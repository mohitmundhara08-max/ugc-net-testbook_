// app/api/overview-metrics/route.js
// Orchestrates: current period channel metrics, prior period channel metrics, top posts in range.

import { createClient } from '@supabase/supabase-js';

export const dynamic     = 'force-dynamic';
export const runtime     = 'nodejs';
export const maxDuration = 30;

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = (SB_URL && SB_KEY)
  ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

function computePriorRange(fromIso, toIso) {
  const from = new Date(fromIso);
  const to   = new Date(toIso);
  const durationMs = to.getTime() - from.getTime();
  if (durationMs <= 0) return null;
  const priorTo   = new Date(from.getTime() - 1);
  const priorFrom = new Date(from.getTime() - durationMs);
  return { from: priorFrom.toISOString(), to: priorTo.toISOString() };
}

async function fetchPeriodChannels(from, to) {
  // Reuses the per-channel metrics RPC + meta join logic from /api/channel-metrics
  const [postsRes, metaRes, followersRes, growthRes] = await Promise.all([
    sb.rpc('tg_channel_metrics_v1', { from_ts: from, to_ts: to }),
    sb.from('tg_channel_meta_snapshots')
      .select('chat_username, subscribers, notifications_enabled_pct, captured_at, title')
      .order('captured_at', { ascending: false }),
    sb.from('tg_followers_daily')
      .select('chat_username, date, joined, left_count')
      .gte('date', from.slice(0, 10))
      .lte('date', to.slice(0, 10))
      .limit(50000),
    sb.from('tg_growth_daily')
      .select('chat_username, date, total_subs')
      .gte('date', from.slice(0, 10))
      .lte('date', to.slice(0, 10))
      .order('date', { ascending: true })
      .limit(50000),
  ]);
  if (postsRes.error)     throw new Error('rpc: ' + postsRes.error.message);
  if (metaRes.error)      throw new Error('meta: ' + metaRes.error.message);
  if (followersRes.error) throw new Error('fol: '  + followersRes.error.message);
  if (growthRes.error)    throw new Error('gro: '  + growthRes.error.message);

  const latestMeta = {};
  for (const m of (metaRes.data || [])) {
    const u = m.chat_username.toLowerCase();
    if (!latestMeta[u]) latestMeta[u] = m;
  }

  const followersByChannel = {};
  for (const r of (followersRes.data || [])) {
    const u = r.chat_username.toLowerCase();
    if (!followersByChannel[u]) followersByChannel[u] = { gained: 0, lost: 0, days: 0 };
    followersByChannel[u].gained += r.joined || 0;
    followersByChannel[u].lost   += r.left_count || 0;
    followersByChannel[u].days   += 1;
  }

  const growthByChannel = {};
  for (const r of (growthRes.data || [])) {
    const u = r.chat_username.toLowerCase();
    if (!growthByChannel[u]) growthByChannel[u] = { startSubs: null, endSubs: null };
    if (growthByChannel[u].startSubs === null) growthByChannel[u].startSubs = r.total_subs;
    growthByChannel[u].endSubs = r.total_subs;
  }

  const aggByChannel = {};
  for (const a of (postsRes.data || [])) aggByChannel[a.chat_username.toLowerCase()] = a;

  const allUsers = new Set([
    ...Object.keys(latestMeta),
    ...Object.keys(aggByChannel),
    ...Object.keys(followersByChannel),
  ]);

  return Array.from(allUsers).map((u) => {
    const m = latestMeta[u] || {};
    const a = aggByChannel[u] || {};
    const fol = followersByChannel[u];
    const gr  = growthByChannel[u];
    const totalEng = (a.total_forwards || 0) + (a.total_reactions || 0) + (a.total_replies || 0);
    const engagementRate = a.total_views ? (totalEng / Number(a.total_views)) * 100 : null;
    const endSubs = gr?.endSubs ?? m.subscribers ?? null;
    const startSubs = gr?.startSubs ?? null;
    return {
      username: u,
      title: m.title || null,
      subscribers: m.subscribers ?? null,
      endSubs, startSubs,
      notifPct: m.notifications_enabled_pct,
      subsGained: fol?.gained ?? null,
      subsLost:   fol?.lost ?? null,
      subsNet:    (fol ? fol.gained - fol.lost : null),
      growthPct:  (startSubs && fol) ? ((fol.gained - fol.lost) / startSubs) * 100 : null,
      posts:      a.posts_live ?? 0,
      avgViews:   a.avg_views ?? null,
      totalViews: a.total_views ? Number(a.total_views) : null,
      totalForwards: a.total_forwards ? Number(a.total_forwards) : null,
      totalReactions: a.total_reactions ? Number(a.total_reactions) : null,
      engagementRate,
      bestHour: a.best_hour ?? null,
      topPostId:   a.top_post_id ?? null,
      topPostViews: a.top_post_views ?? null,
      topContentType: a.top_content_type ?? null,
    };
  });
}

export async function GET(request) {
  if (!sb) return Response.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to   = searchParams.get('to');
  if (!from || !to) {
    return Response.json({ ok: false, error: 'missing_from_or_to' }, { status: 400 });
  }

  const prior = computePriorRange(from, to);

  try {
    const [currentChannels, priorChannels, topPostsRes, dailyRowsRes] = await Promise.all([
      fetchPeriodChannels(from, to),
      prior ? fetchPeriodChannels(prior.from, prior.to) : Promise.resolve(null),
      sb.from('tg_posts')
        .select('chat_username, message_id, views, post_type, posted_at, preview, forwards')
        .gte('posted_at', from)
        .lte('posted_at', to)
        .is('deleted_at', null)
        .not('views', 'is', null)
        .order('views', { ascending: false, nullsFirst: false })
        .limit(20),
      sb.from('tg_followers_daily')
        .select('chat_username, date, joined, left_count')
        .gte('date', from.slice(0, 10))
        .lte('date', to.slice(0, 10))
        .order('date', { ascending: true })
        .limit(50000),
    ]);

    if (topPostsRes.error)  throw new Error('top_posts: ' + topPostsRes.error.message);
    if (dailyRowsRes.error) throw new Error('daily: ' + dailyRowsRes.error.message);
    const dailyRows = dailyRowsRes.data || [];

    return Response.json({
      ok: true,
      current: { from, to, channels: currentChannels },
      prior:   prior ? { from: prior.from, to: prior.to, channels: priorChannels } : null,
      topPosts: (topPostsRes.data || []).map((p) => ({
        chatUsername: p.chat_username.toLowerCase(),
        messageId:    p.message_id,
        views:        p.views,
        forwards:     p.forwards,
        postType:     p.post_type,
        postedAt:     p.posted_at,
        preview:      p.preview ? p.preview.slice(0, 140) : null,
        url:          `https://t.me/${p.chat_username}/${p.message_id}`,
      })),
      // Raw daily-by-channel rows for the trend chart (client-side filterable)
      dailyByChannel: dailyRows.map((r) => ({
        date:     r.date,
        channel:  r.chat_username.toLowerCase(),
        joined:   r.joined || 0,
        left:     r.left_count || 0,
      })),
    });
  } catch (e) {
    console.error('[overview-metrics]', e.message);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
