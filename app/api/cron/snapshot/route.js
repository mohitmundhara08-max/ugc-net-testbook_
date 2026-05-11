// app/api/cron/snapshot/route.js
// Daily snapshot of subscriber counts for all 25 channels.
// Triggered by Vercel Cron at 03:30 UTC (09:00 IST) — see vercel.json.
// Can also be hit manually (e.g. /api/cron/snapshot?force=1) for a fresh snapshot today.

import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // cron may need a few seconds across 25 channels

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SB_URL    = process.env.SUPABASE_URL;
const SB_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = (SB_URL && SB_KEY)
  ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

// Mirrors app/api/channels/route.js — keep in sync if channels are added/removed
const CHANNELS = [
  'testbook_ugcnet','pritipaper1','tulikamam','Anshikamaamtestbook','testbookrajatsir',
  'pradyumansir_testbook','AshwaniSir_Testbook','kiranmaamtestbook','Manojsonker_Testbook',
  'Heenamaam_testbook','AditiMaam_Testbook','karanSir_Testbook','testbookdakshita',
  'AshishSir_Testbook','ShachiMaam_Testbook','Monikamaamtestbook','yogitamaamtestbook',
  'EVS_AnshikamaamTestbook','daminimaam_testbook','TestbookShahna','Prakashsirtestbook',
  'kesharisir_testbook','TestbookNiharikaMaam','MrinaliniMaam_Testbook','testbook_gauravsir',
];

function isAuthorized(request) {
  // Vercel Cron sets a specific user-agent. Allow forced manual triggers too.
  const ua = request.headers.get('user-agent') || '';
  const { searchParams } = new URL(request.url);
  return ua.toLowerCase().includes('vercel') || searchParams.get('force') === '1';
}

async function fetchSubCount(username) {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMemberCount?chat_id=@${username}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    if (!data.ok) return { username, ok: false, error: data.description || 'unknown' };
    return { username, ok: true, subscribers: data.result };
  } catch (e) {
    return { username, ok: false, error: e.message };
  }
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  if (!BOT_TOKEN) {
    return Response.json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not set' });
  }
  if (!sb) {
    return Response.json({ ok: false, error: 'supabase_not_configured' });
  }

  // Today in IST (YYYY-MM-DD) — snapshot_date is a DATE column
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Kolkata' });

  // Fetch all 25 sub counts in parallel
  const results = await Promise.all(CHANNELS.map(fetchSubCount));

  // Build rows for successful fetches only
  const rows = results
    .filter(r => r.ok && typeof r.subscribers === 'number')
    .map(r => ({
      chat_username: r.username.toLowerCase(),
      snapshot_date: today,
      subscribers:   r.subscribers,
      captured_at:   new Date().toISOString(),
    }));

  if (rows.length === 0) {
    return Response.json({
      ok: false,
      error: 'all_fetches_failed',
      results,
    });
  }

  // Upsert — same channel + date overrides (idempotent)
  const { error } = await sb
    .from('tg_subscriber_snapshots')
    .upsert(rows, { onConflict: 'chat_username,snapshot_date' });

  if (error) {
    console.error('[cron/snapshot] upsert failed:', error.message);
    return Response.json({ ok: false, error: error.message });
  }

  const failed = results.filter(r => !r.ok);
  return Response.json({
    ok:           true,
    date:         today,
    captured:     rows.length,
    failed:       failed.length,
    failures:     failed,
    total:        CHANNELS.length,
  });
}
