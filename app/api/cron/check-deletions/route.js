// app/api/cron/check-deletions/route.js
// Probes Telegram to find posts that have been deleted from channels and marks them
// in tg_posts.deleted_at. Telegram doesn't push delete events to bots, so the only
// way to detect deletion is to test "does this message still exist?" — we do that
// via copyMessage to a private audit chat, then delete the copy.
//
// REQUIRED ENV VARS:
//   TELEGRAM_BOT_TOKEN       — same bot that has admin in your channels
//   TELEGRAM_AUDIT_CHAT_ID   — numeric ID of a PRIVATE group/channel where the bot
//                              is also admin (it forwards copies here for probing,
//                              then deletes the copies)
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// USAGE:
//   GET /api/cron/check-deletions             — checks last 7 days of live posts
//   GET /api/cron/check-deletions?days=14     — wider window
//   GET /api/cron/check-deletions?force=1     — bypass Vercel-cron auth gate (manual run)

import { createClient } from '@supabase/supabase-js';

export const dynamic     = 'force-dynamic';
export const maxDuration = 60;

const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const AUDIT_CHAT  = process.env.TELEGRAM_AUDIT_CHAT_ID;
const SB_URL      = process.env.SUPABASE_URL;
const SB_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = (SB_URL && SB_KEY)
  ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

function isAuthorized(request) {
  const ua = request.headers.get('user-agent') || '';
  const { searchParams } = new URL(request.url);
  return ua.toLowerCase().includes('vercel') || searchParams.get('force') === '1';
}

// Probe one message: copyMessage to audit chat. Returns:
//   { exists: true,  copyId }   — message still exists
//   { exists: false }            — message was deleted (or never existed)
//   { exists: null, error }      — couldn't determine (rate limit, bot not admin, etc)
async function probeMessage(chatUsername, messageId) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/copyMessage`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        chat_id:              AUDIT_CHAT,
        from_chat_id:         '@' + chatUsername,
        message_id:           messageId,
        disable_notification: true,
      }),
    });
    const data = await res.json();

    if (data.ok) {
      // Exists — clean up the copy immediately
      const copyId = data.result.message_id;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: AUDIT_CHAT, message_id: copyId }),
      });
      return { exists: true, copyId };
    }

    const desc = (data.description || '').toLowerCase();
    // Telegram says these for deleted/inaccessible source messages:
    //   "Bad Request: message to copy not found"
    //   "Bad Request: MESSAGE_ID_INVALID"
    //   "Bad Request: message can't be copied"
    if (desc.includes('not found') || desc.includes('invalid') || desc.includes("can't be copied")) {
      return { exists: false };
    }
    // Anything else — rate limit, bot not admin anymore, network — treat as unknown
    return { exists: null, error: data.description || 'unknown' };
  } catch (e) {
    return { exists: null, error: e.message };
  }
}

export async function GET(request) {
  if (!isAuthorized(request)) return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!BOT_TOKEN)             return Response.json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not set' });
  if (!AUDIT_CHAT)            return Response.json({ ok: false, error: 'TELEGRAM_AUDIT_CHAT_ID not set — see setup docs' });
  if (!sb)                    return Response.json({ ok: false, error: 'supabase_not_configured' });

  const { searchParams } = new URL(request.url);
  const days  = Math.max(1, Math.min(30, parseInt(searchParams.get('days') || '7', 10)));
  const since = new Date(Date.now() - days * 86400000).toISOString();

  // Pull live posts in the window (deleted_at IS NULL) — these are candidates
  const { data: candidates, error: readErr } = await sb
    .from('tg_posts')
    .select('id, chat_username, message_id, posted_at')
    .is('deleted_at', null)
    .gte('posted_at', since)
    .order('posted_at', { ascending: false })
    .limit(2000);

  if (readErr) return Response.json({ ok: false, error: 'supabase_read: ' + readErr.message });
  if (!candidates?.length) return Response.json({ ok: true, checked: 0, deletedFound: 0, note: 'no live posts in window' });

  let deletedFound = 0;
  let unknown      = 0;
  const deletedIds = [];

  // Probe sequentially with a tiny delay so we stay under Telegram's 30 msg/sec limit comfortably
  for (const p of candidates) {
    const r = await probeMessage(p.chat_username, p.message_id);
    if (r.exists === false) {
      deletedIds.push(p.id);
      deletedFound++;
    } else if (r.exists === null) {
      unknown++;
    }
    await new Promise(r => setTimeout(r, 50)); // ~20 probes/sec
  }

  // Single UPDATE for all detected deletions
  if (deletedIds.length) {
    const { error: updErr } = await sb
      .from('tg_posts')
      .update({ deleted_at: new Date().toISOString() })
      .in('id', deletedIds);
    if (updErr) {
      return Response.json({ ok: false, error: 'supabase_update: ' + updErr.message, deletedFound, unknown, checked: candidates.length });
    }
  }

  return Response.json({
    ok:           true,
    checked:      candidates.length,
    deletedFound,
    unknown,
    windowDays:   days,
    note:         `${deletedFound} newly marked deleted${unknown ? ` · ${unknown} undetermined (likely rate-limited or non-admin)` : ''}`,
  });
}
