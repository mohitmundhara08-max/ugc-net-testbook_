// app/api/posts/route.js
// Reads channel posts from Supabase (populated by webhook).
// Filters out soft-deleted posts (deleted_at IS NOT NULL) by default.
// Pass ?includeDeleted=1 to include them with a `deleted: true` flag.

import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = (SB_URL && SB_KEY)
  ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

export async function GET(request) {
  if (!sb) {
    return Response.json({ success: false, error: 'supabase_not_configured' });
  }

  const { searchParams } = new URL(request.url);
  const days           = Math.max(1, Math.min(30, parseInt(searchParams.get('days') || '7', 10)));
  const includeDeleted = searchParams.get('includeDeleted') === '1';
  const since          = new Date(Date.now() - days * 86400000).toISOString();

  let query = sb
    .from('tg_posts')
    .select('chat_username, posted_at, post_type, preview, message_id, deleted_at')
    .gte('posted_at', since)
    .order('posted_at', { ascending: true })
    .limit(10000);

  if (!includeDeleted) query = query.is('deleted_at', null);

  const { data, error } = await query;

  if (error) {
    console.error('[posts] read failed:', error.message);
    return Response.json({ success: false, error: error.message });
  }

  // Group by date (IST) and chat_username
  const counts = {};
  const posts  = {};
  let liveCount    = 0;
  let deletedCount = 0;

  for (const row of data || []) {
    const ts   = new Date(row.posted_at);
    const date = ts.toLocaleDateString('sv-SE', { timeZone: 'Asia/Kolkata' });
    const time = ts.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).toLowerCase();
    const u    = (row.chat_username || '').toLowerCase();
    if (!u) continue;

    const isDeleted = !!row.deleted_at;
    if (isDeleted) deletedCount++; else liveCount++;

    // counts: only non-deleted (operator wants live count for KPIs)
    if (!isDeleted) {
      if (!counts[date])             counts[date]          = {};
      if (!counts[date][u])          counts[date][u]       = 0;
      counts[date][u]++;
    }

    if (!posts[date])              posts[date]           = {};
    if (!posts[date][u])           posts[date][u]        = [];
    posts[date][u].push({
      type:      row.post_type,
      preview:   row.preview,
      time,
      messageId: row.message_id,
      ...(isDeleted ? { deleted: true, deletedAt: row.deleted_at } : {}),
    });
  }

  return Response.json({
    success:      true,
    counts,
    posts,
    totalPosts:   liveCount,
    deletedCount,
    rangeDays:    days,
    source:       'supabase',
    note:         `${liveCount} live · ${deletedCount} soft-deleted · last ${days} days`,
  });
}
