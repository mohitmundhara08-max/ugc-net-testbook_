// app/api/cron/export-sheet/route.js
// Daily export of Supabase data → Google Sheet for team visibility.
// Triggered by Vercel Cron at 04:00 UTC (09:30 IST) — see vercel.json.
// Manual trigger: /api/cron/export-sheet?force=1
//
// Auth: Google service account JWT (zero deps — uses Node's built-in crypto).

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic    = 'force-dynamic';
export const maxDuration = 60;

const SB_URL    = process.env.SUPABASE_URL;
const SB_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SA_EMAIL  = process.env.GOOGLE_SHEETS_SA_EMAIL;
const SA_KEY    = process.env.GOOGLE_SHEETS_SA_PRIVATE_KEY;
const SHEET_ID  = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

const CHANNELS = [
  { username:'testbook_ugcnet',         subject:'Common' },
  { username:'pritipaper1',             subject:'Paper 1 · Priti' },
  { username:'tulikamam',               subject:'Paper 1 · Tulika' },
  { username:'Anshikamaamtestbook',     subject:'Paper 1 · Anshika' },
  { username:'testbookrajatsir',        subject:'Paper 1 · Rajat Sir' },
  { username:'pradyumansir_testbook',   subject:'Political Science' },
  { username:'AshwaniSir_Testbook',     subject:'History' },
  { username:'kiranmaamtestbook',       subject:'Public Administration' },
  { username:'Manojsonker_Testbook',    subject:'Sociology' },
  { username:'Heenamaam_testbook',      subject:'Education' },
  { username:'AditiMaam_Testbook',      subject:'Home Science' },
  { username:'karanSir_Testbook',       subject:'Law' },
  { username:'testbookdakshita',        subject:'English' },
  { username:'AshishSir_Testbook',      subject:'Geography' },
  { username:'ShachiMaam_Testbook',     subject:'Economics' },
  { username:'Monikamaamtestbook',      subject:'Management 1' },
  { username:'yogitamaamtestbook',      subject:'Management 2' },
  { username:'EVS_AnshikamaamTestbook', subject:'Environmental Science' },
  { username:'daminimaam_testbook',     subject:'Library Science' },
  { username:'TestbookShahna',          subject:'Computer Science' },
  { username:'Prakashsirtestbook',      subject:'Sanskrit' },
  { username:'kesharisir_testbook',     subject:'Hindi' },
  { username:'TestbookNiharikaMaam',    subject:'Commerce' },
  { username:'MrinaliniMaam_Testbook',  subject:'Psychology' },
  { username:'testbook_gauravsir',      subject:'Physical Education' },
];

const sb = (SB_URL && SB_KEY)
  ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

// ── Google service-account auth ──────────────────────────────────────────────
function b64url(input) {
  return Buffer.from(input).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signJwt(saEmail, privateKey, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header  = { alg: 'RS256', typ: 'JWT' };
  const payload = { iss: saEmail, scope, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = crypto.createSign('RSA-SHA256').update(signingInput).sign(privateKey);
  return `${signingInput}.${b64url(sig)}`;
}

async function getAccessToken() {
  // Vercel env vars escape newlines as literal \n — undo that for PEM parsing
  const privateKey = (SA_KEY || '').replace(/\\n/g, '\n');
  const jwt = signJwt(SA_EMAIL, privateKey, 'https://www.googleapis.com/auth/spreadsheets');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion:  jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Google auth failed: ' + JSON.stringify(data));
  return data.access_token;
}

async function pushTabs(token, tabs) {
  // tabs: [{ range, values }]
  // 1. Clear each tab fully
  const clearRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchClear`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ ranges: tabs.map(t => t.range.replace(/!A1$/, '')) }),
    }
  );
  if (!clearRes.ok) throw new Error('batchClear failed: ' + (await clearRes.text()));

  // 2. Write new values
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: tabs.map(t => ({ range: t.range, majorDimension: 'ROWS', values: t.values })),
      }),
    }
  );
  if (!updateRes.ok) throw new Error('batchUpdate failed: ' + (await updateRes.text()));
  return updateRes.json();
}

// ── Request guard ────────────────────────────────────────────────────────────
function isAuthorized(request) {
  const ua = request.headers.get('user-agent') || '';
  const { searchParams } = new URL(request.url);
  return ua.toLowerCase().includes('vercel') || searchParams.get('force') === '1';
}

// ── Main handler ─────────────────────────────────────────────────────────────
export async function GET(request) {
  if (!isAuthorized(request)) return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!sb)                    return Response.json({ ok: false, error: 'supabase_not_configured' });
  if (!SA_EMAIL || !SA_KEY)   return Response.json({ ok: false, error: 'google_sa_not_configured' });
  if (!SHEET_ID)              return Response.json({ ok: false, error: 'sheet_id_not_set' });

  try {
    // 1. Pull data from Supabase
    const sinceIso = new Date(Date.now() - 30 * 86400000).toISOString();
    const [postsRes, snapsRes] = await Promise.all([
      sb.from('tg_posts')
        .select('chat_username, posted_at, post_type, preview, message_id')
        .gte('posted_at', sinceIso)
        .order('posted_at', { ascending: false })
        .limit(5000),
      sb.from('tg_subscriber_snapshots')
        .select('chat_username, snapshot_date, subscribers')
        .order('snapshot_date', { ascending: false }),
    ]);
    if (postsRes.error) throw new Error('posts read: ' + postsRes.error.message);
    if (snapsRes.error) throw new Error('snapshots read: ' + snapsRes.error.message);
    const posts = postsRes.data || [];
    const snaps = snapsRes.data || [];

    // 2. Tab: Daily Snapshot (rows = dates, columns = channels, last column = total)
    const snapByDate = {};
    for (const r of snaps) {
      if (!snapByDate[r.snapshot_date]) snapByDate[r.snapshot_date] = {};
      snapByDate[r.snapshot_date][(r.chat_username || '').toLowerCase()] = r.subscribers;
    }
    const dates       = Object.keys(snapByDate).sort().reverse();
    const snapHeader  = ['Date (IST)', ...CHANNELS.map(c => c.subject), 'Total'];
    const snapRows    = dates.map(d => {
      const row = [d];
      let total = 0;
      for (const c of CHANNELS) {
        const v = snapByDate[d][c.username.toLowerCase()];
        row.push(typeof v === 'number' ? v : '');
        if (typeof v === 'number') total += v;
      }
      row.push(total);
      return row;
    });

    // 3. Tab: All Posts (last 30 days)
    const postHeader = ['Date (IST)', 'Time (IST)', 'Channel', 'Subject', 'Type', 'Preview', 'Message ID'];
    const postRows = posts.map(p => {
      const ts   = new Date(p.posted_at);
      const date = ts.toLocaleDateString('sv-SE',   { timeZone: 'Asia/Kolkata' });
      const time = ts.toLocaleTimeString('en-IN',   { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      const ch   = CHANNELS.find(c => c.username.toLowerCase() === (p.chat_username || '').toLowerCase());
      return [date, time, '@' + (p.chat_username || ''), ch?.subject || '', p.post_type, p.preview, p.message_id];
    });

    // 4. Tab: Channel Performance (latest snapshot + post counts)
    const latestSnap   = snapByDate[dates[0]] || {};
    const last7dIso    = new Date(Date.now() -  7 * 86400000).toISOString();
    const last30dIso   = new Date(Date.now() - 30 * 86400000).toISOString();
    const counts7d     = {};
    const counts30d    = {};
    const lastPostAt   = {};
    for (const p of posts) {
      const u = (p.chat_username || '').toLowerCase();
      if (p.posted_at >= last30dIso) counts30d[u] = (counts30d[u] || 0) + 1;
      if (p.posted_at >= last7dIso)  counts7d[u]  = (counts7d[u]  || 0) + 1;
      if (!lastPostAt[u] || p.posted_at > lastPostAt[u]) lastPostAt[u] = p.posted_at;
    }
    const perfHeader = ['Channel', 'Subject', 'Subscribers', 'Posts (last 7d)', 'Posts (last 30d)', 'Last Post (IST)'];
    const perfRows = CHANNELS.map(c => {
      const u = c.username.toLowerCase();
      const last = lastPostAt[u]
        ? new Date(lastPostAt[u]).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })
        : '';
      return ['@' + c.username, c.subject, latestSnap[u] ?? '', counts7d[u] || 0, counts30d[u] || 0, last];
    }).sort((a, b) => (Number(b[2]) || 0) - (Number(a[2]) || 0));

    // 5. Push to Sheets
    const token = await getAccessToken();
    await pushTabs(token, [
      { range: "'Daily Snapshot'!A1",      values: [snapHeader, ...snapRows] },
      { range: "'All Posts'!A1",           values: [postHeader, ...postRows] },
      { range: "'Channel Performance'!A1", values: [perfHeader, ...perfRows] },
    ]);

    return Response.json({
      ok:               true,
      exportedAt:       new Date().toISOString(),
      snapshotDays:     dates.length,
      postsExported:    postRows.length,
      channelsTracked:  CHANNELS.length,
      sheetUrl:         `https://docs.google.com/spreadsheets/d/${SHEET_ID}`,
    });
  } catch (e) {
    console.error('[cron/export-sheet]', e.message);
    return Response.json({ ok: false, error: e.message });
  }
}
