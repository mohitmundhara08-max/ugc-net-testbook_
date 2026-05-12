// app/api/channel-metrics/route.js
// Returns per-channel aggregate metrics for a date range.
// Query params: from (ISO timestamp), to (ISO timestamp).
//
// Combines three sources:
//   - tg_channel_metrics_v1 RPC (post aggregates: views, reactions, best hour, top post...)
//   - tg_channel_meta_snapshots (current subs, notif %, admins, kicked, banned)
//   - tg_subscriber_snapshots (for subs delta in range)

import { createClient } from '@supabase/supabase-js';

export const dynamic    = 'force-dynamic';
export const runtime    = 'nodejs';
export const maxDuration = 30;

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = (SB_URL && SB_KEY)
  ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

export async function GET(request) {
  if (!sb) return Response.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to   = searchParams.get('to');
  if (!from || !to) {
    return Response.json({ ok: false, error: 'missing_from_or_to' }, { status: 400 });
  }

  try {
    const [postsRes, metaRes, snapsRes, dataFreshness] = await Promise.all([
      sb.rpc('tg_channel_metrics_v1', { from_ts: from, to_ts: to }),
      sb.from('tg_channel_meta_snapshots')
        .select('chat_username, subscribers, notifications_enabled_pct, notifications_enabled_count, captured_at, admins_count, kicked_count, banned_count, pinned_msg_id, can_view_stats, invite_link, title, description, slowmode_seconds, is_verified')
        .order('captured_at', { ascending: false }),
      sb.from('tg_subscriber_snapshots')
        .select('chat_username, snapshot_date, subscribers')
        .gte('snapshot_date', from.slice(0, 10))
        .lte('snapshot_date', to.slice(0, 10))
        .order('snapshot_date', { ascending: true }),
      sb.from('tg_posts').select('created_at').order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]);

    if (postsRes.error) throw new Error('rpc: ' + postsRes.error.message);
    if (metaRes.error)  throw new Error('meta: ' + metaRes.error.message);
    if (snapsRes.error) throw new Error('snaps: ' + snapsRes.error.message);

    const postMetrics = postsRes.data || [];

    // Latest meta per channel (results sorted DESC, take first per channel)
    const latestMeta = {};
    for (const m of (metaRes.data || [])) {
      const u = m.chat_username.toLowerCase();
      if (!latestMeta[u]) latestMeta[u] = m;
    }

    // Earliest subscriber snapshot in the range (per channel) — used for delta
    const startSubsByChannel = {};
    for (const s of (snapsRes.data || [])) {
      const u = s.chat_username.toLowerCase();
      if (startSubsByChannel[u] === undefined) startSubsByChannel[u] = s.subscribers;
    }

    // Index aggregates by channel
    const aggByChannel = {};
    for (const a of postMetrics) {
      aggByChannel[a.chat_username.toLowerCase()] = a;
    }

    // Build the unified list — every channel with meta gets a row, even if no posts in range
    const allChannels = new Set([
      ...Object.keys(latestMeta),
      ...Object.keys(aggByChannel),
    ]);

    const channels = Array.from(allChannels).map((u) => {
      const m   = latestMeta[u] || {};
      const a   = aggByChannel[u] || {};
      const startSubs   = startSubsByChannel[u];
      const currentSubs = m.subscribers ?? null;
      const subsDelta   = (currentSubs !== null && startSubs !== undefined && startSubs !== null)
        ? currentSubs - startSubs
        : null;

      const totalEng       = (a.total_forwards || 0) + (a.total_reactions || 0) + (a.total_replies || 0);
      const engagementRate = a.total_views ? (totalEng / Number(a.total_views)) * 100 : null;

      const hoursSinceLastPost = a.last_post_at
        ? (Date.now() - new Date(a.last_post_at).getTime()) / 3600000
        : null;

      let status;
      if (hoursSinceLastPost === null)      status = 'no_posts';
      else if (hoursSinceLastPost < 24)     status = 'active';
      else if (hoursSinceLastPost < 48)     status = 'quiet';
      else                                  status = 'silent';

      return {
        username:            u,
        title:               m.title || null,
        description:         m.description || null,
        inviteLink:          m.invite_link || null,
        isVerified:          m.is_verified || false,
        slowmodeSeconds:     m.slowmode_seconds ?? null,

        // Current snapshot
        subscribers:         currentSubs,
        subsDelta,
        startSubs:           startSubs ?? null,
        notifPct:            m.notifications_enabled_pct,
        notifOnCount:        m.notifications_enabled_count,
        adminsCount:         m.admins_count,
        kickedCount:         m.kicked_count,
        bannedCount:         m.banned_count,
        pinnedMsgId:         m.pinned_msg_id,
        canViewStats:        m.can_view_stats,
        metaCapturedAt:      m.captured_at,

        // Range aggregates
        posts:               a.posts ?? 0,
        postsLive:           a.posts_live ?? 0,
        postsDeleted:        a.posts_deleted ?? 0,
        postsPinned:         a.posts_pinned ?? 0,
        postsEdited:         a.posts_edited ?? 0,
        avgViews:            a.avg_views ?? null,
        medianViews:         a.median_views ?? null,
        totalViews:          a.total_views ? Number(a.total_views) : null,
        totalForwards:       a.total_forwards ? Number(a.total_forwards) : null,
        totalReactions:      a.total_reactions ? Number(a.total_reactions) : null,
        totalReplies:        a.total_replies ? Number(a.total_replies) : null,
        engagementRate,
        bestHour:            a.best_hour ?? null,
        topPostId:           a.top_post_id ?? null,
        topPostViews:        a.top_post_views ?? null,
        topPostUrl:          (a.top_post_id) ? `https://t.me/${u}/${a.top_post_id}` : null,
        topContentType:      a.top_content_type ?? null,
        contentTypeBreakdown: a.content_type_breakdown ?? null,

        firstPostAt:         a.first_post_at ?? null,
        lastPostAt:          a.last_post_at ?? null,
        hoursSinceLastPost,
        status,
      };
    });

    return Response.json({
      ok:    true,
      from,
      to,
      channels,
      dataFreshness: {
        latestPostCreatedAt: dataFreshness.data?.created_at || null,
        latestMetaCapturedAt: Object.values(latestMeta).reduce((max, m) => {
          return (!max || m.captured_at > max) ? m.captured_at : max;
        }, null),
        snapshotDaysInRange: snapsRes.data?.length || 0,
      },
    });
  } catch (e) {
    console.error('[channel-metrics]', e.message);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
