// app/api/cron/post-scheduled/route.js
// Called every 5 min. Finds posts where scheduled_at <= now AND status=scheduled, posts them.
// Authentication: requires header x-cron-secret matching env CRON_SECRET, OR Vercel's CRON_SECRET if invoked from Vercel cron.

import { createClient } from '@supabase/supabase-js';

export const dynamic     = 'force-dynamic';
export const runtime     = 'nodejs';
export const maxDuration = 60;

const SB_URL      = process.env.SUPABASE_URL;
const SB_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const CRON_SECRET = process.env.CRON_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET; // reuse existing secret

const sb = (SB_URL && SB_KEY)
  ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

async function tgSend(post) {
  const chatId = '@' + post.chat_username.replace(/^@/, '');

  if (post.post_type === 'MCQ' && post.quiz_question && Array.isArray(post.quiz_options)) {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        question: post.quiz_question.slice(0, 255),
        options: post.quiz_options.map((o) => ({ text: String(o).slice(0, 100) })),
        type: 'quiz',
        correct_option_id: Number(post.quiz_correct_idx ?? 0),
        explanation: (post.quiz_explanation || '').slice(0, 200),
        is_anonymous: true,
      }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.description || 'sendPoll failed');
    return data.result.message_id;
  }

  if (post.image_url) {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, photo: post.image_url, caption: (post.content || '').slice(0, 1024), parse_mode: 'HTML' }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.description || 'sendPhoto failed');
    return data.result.message_id;
  }

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: (post.content || '').slice(0, 4096), parse_mode: 'HTML' }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'sendMessage failed');
  return data.result.message_id;
}

async function tgPin(chat_username, message_id) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/pinChatMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: '@' + chat_username.replace(/^@/, ''), message_id, disable_notification: true }),
  });
  return (await res.json()).ok;
}

export async function GET(request) {
  // Auth — allow either header secret OR Vercel's own cron token
  const headerSecret = request.headers.get('x-cron-secret');
  const authHeader   = request.headers.get('authorization');
  const vercelCron   = authHeader === `Bearer ${process.env.CRON_SECRET || ''}`;
  if (CRON_SECRET && headerSecret !== CRON_SECRET && !vercelCron) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  if (!sb) return Response.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 });
  if (!BOT_TOKEN) return Response.json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not configured' }, { status: 500 });

  const startedAt = new Date().toISOString();
  const results   = { picked: 0, posted: 0, failed: 0, items: [] };

  try {
    // Atomically pick up to 20 due posts (status=scheduled, scheduled_at <= now)
    const { data: dueRows, error: pickErr } = await sb
      .from('tg_scheduled_posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(20);
    if (pickErr) throw new Error('pick: ' + pickErr.message);
    results.picked = dueRows?.length || 0;

    for (const post of (dueRows || [])) {
      // Mark posting (lock)
      const { error: lockErr } = await sb
        .from('tg_scheduled_posts')
        .update({ status: 'posting' })
        .eq('id', post.id)
        .eq('status', 'scheduled');  // optimistic: only flip if still scheduled
      if (lockErr) {
        results.items.push({ id: post.id, ok: false, error: 'lock_failed: ' + lockErr.message });
        continue;
      }

      try {
        const msgId = await tgSend(post);
        let pinned = false;
        if (post.should_pin) {
          try { pinned = await tgPin(post.chat_username, msgId); }
          catch (e) { console.warn('[cron] pin failed:', e.message); }
        }
        await sb.from('tg_scheduled_posts').update({
          status: 'posted',
          telegram_message_id: msgId,
          posted_at: new Date().toISOString(),
          error_message: null,
        }).eq('id', post.id);
        results.posted += 1;
        results.items.push({ id: post.id, channel: post.chat_username, ok: true, message_id: msgId, pinned });
      } catch (e) {
        const retries = (post.retry_count || 0) + 1;
        const finalStatus = retries >= 3 ? 'failed' : 'scheduled';  // retry up to 3 times
        await sb.from('tg_scheduled_posts').update({
          status: finalStatus,
          error_message: e.message,
          retry_count: retries,
        }).eq('id', post.id);
        results.failed += 1;
        results.items.push({ id: post.id, channel: post.chat_username, ok: false, error: e.message, will_retry: finalStatus === 'scheduled' });
      }
    }

    return Response.json({ ok: true, startedAt, ...results });
  } catch (e) {
    console.error('[cron post-scheduled]', e.message);
    return Response.json({ ok: false, error: e.message, ...results }, { status: 500 });
  }
}
