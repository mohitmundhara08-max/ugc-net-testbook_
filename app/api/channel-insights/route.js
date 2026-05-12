// app/api/channel-insights/route.js
// AI-generated insights for the channels view.
// POST body: { channels: [], range: { from, to, preset } }
// Returns: { ok, insights: [{ icon, category, title, detail, channels, severity }] }

export const dynamic     = 'force-dynamic';
export const runtime     = 'nodejs';
export const maxDuration = 30;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SUBJECT_MAP = {
  testbook_ugcnet: 'Common',
  pritipaper1: 'Paper 1 · Priti', tulikamam: 'Paper 1 · Tulika',
  anshikamaamtestbook: 'Paper 1 · Anshika', testbookrajatsir: 'Paper 1 · Rajat Sir',
  pradyumansir_testbook: 'Political Science', ashwanisir_testbook: 'History',
  kiranmaamtestbook: 'Public Administration', manojsonker_testbook: 'Sociology',
  heenamaam_testbook: 'Education', aditimaam_testbook: 'Home Science',
  karansir_testbook: 'Law', testbookdakshita: 'English',
  ashishsir_testbook: 'Geography', shachimaam_testbook: 'Economics',
  monikamaamtestbook: 'Management 1', yogitamaamtestbook: 'Management 2',
  evs_anshikamaamtestbook: 'Environmental Science', daminimaam_testbook: 'Library Science',
  testbookshahna: 'Computer Science', prakashsirtestbook: 'Sanskrit',
  kesharisir_testbook: 'Hindi', testbookniharikamaam: 'Commerce',
  mrinalinimaam_testbook: 'Psychology', testbook_gauravsir: 'Physical Education',
};

function compactChannel(c) {
  const subj = SUBJECT_MAP[c.username] || c.username;
  return {
    username: c.username,
    subject: subj,
    subs: c.subscribers,
    notifPct: c.notifPct?.toFixed?.(1) ?? null,
    posts: c.postsLive,
    avgViews: c.avgViews,
    medianViews: c.medianViews,
    engagementPct: c.engagementRate?.toFixed?.(2) ?? null,
    bestHour: c.bestHour,
    topType: c.topContentType,
    topPostViews: c.topPostViews,
    subsGained: c.subsGained,
    subsLost: c.subsLost,
    subsNet: c.subsNet,
    forwards: c.totalForwards,
    reactions: c.totalReactions,
    deleted: c.postsDeleted,
    edited: c.postsEdited,
    lastPostHoursAgo: c.hoursSinceLastPost?.toFixed?.(1) ?? null,
    status: c.status,
  };
}

export async function POST(request) {
  if (!ANTHROPIC_API_KEY) {
    return Response.json({ ok: false, error: 'anthropic_key_not_set' }, { status: 500 });
  }

  let body;
  try { body = await request.json(); } catch { return Response.json({ ok: false, error: 'bad_json' }, { status: 400 }); }
  const { channels = [], range = {} } = body;

  if (!Array.isArray(channels) || channels.length === 0) {
    return Response.json({ ok: false, error: 'no_channels' }, { status: 400 });
  }

  const compact = channels.map(compactChannel);
  const rangeLabel = range.preset || `${range.from} → ${range.to}`;

  const prompt = `You are an expert analyst for Testbook's UGC NET Telegram channel network. Mohit manages 25 channels in this network covering different UGC NET subjects (Common, Paper 1 faculty channels, and subject-specific channels). He needs sharp, actionable, specific insights — not generic platitudes.

Date range analyzed: ${rangeLabel}

Channel data (one row per channel):
${JSON.stringify(compact, null, 2)}

Generate 6-9 insights. Be RUTHLESSLY SPECIFIC — name the channel(s), cite the numbers, suggest the action. No vague "consider improving" advice. If you're stating a fact, cite the metric. If you're recommending an action, make it concrete and doable this week.

Each insight should be one of these categories:
- "Opportunity" 🚀  — A growth lever Mohit should pull
- "Anomaly" ⚠️  — Something unusual that needs investigation
- "Recommendation" 💡  — Specific action to take this week
- "Pattern" 🎯  — A trend across multiple channels

Focus areas (cover at least 4 of these):
1. Channels with reach but low engagement (high subs, low notif%, low engagement rate)
2. Channels with high engagement but low reach (small subs, high notif%, high engagement rate) — what makes them sticky?
3. Content-type winners — what's driving views (cross-channel patterns)?
4. Best posting hours — distribution across channels
5. Specific channels declining or growing fast in subs
6. Engagement quality (forwards = passive distribution; reactions = active interest; replies = community)
7. Posts edited/deleted patterns — potential quality or compliance signals
8. Subject-vs-subject comparison (Paper 1 vs Subject channels)

OUTPUT FORMAT — return ONLY a valid JSON array, no preamble, no markdown:
[
  {
    "icon": "🚀",
    "category": "Opportunity",
    "title": "short headline (max 100 chars)",
    "detail": "1-2 sentence specific actionable explanation with numbers and channel names (max 280 chars)",
    "channels": ["channel_username1", "channel_username2"],
    "severity": "high" | "medium" | "low"
  }
]

Channels array should contain the channel usernames (lowercase) most relevant to this insight. severity reflects how urgent/important Mohit should treat it.`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 2500,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return Response.json({ ok: false, error: data?.error?.message || 'claude_api_error' }, { status: 500 });
    }

    const text = data.content?.find((b) => b.type === 'text')?.text || '';
    // Strip any code fences and try to extract the JSON array
    const cleaned = text.replace(/```json\s*|\s*```/g, '').trim();

    let insights = [];
    try {
      insights = JSON.parse(cleaned);
    } catch {
      // Fallback: find the JSON array
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (match) insights = JSON.parse(match[0]);
    }

    if (!Array.isArray(insights)) {
      return Response.json({ ok: false, error: 'invalid_insights_format', raw: cleaned.slice(0, 500) }, { status: 500 });
    }

    return Response.json({
      ok: true,
      insights,
      generatedAt: new Date().toISOString(),
      channelCount: channels.length,
      range: rangeLabel,
    });
  } catch (e) {
    console.error('[channel-insights]', e.message);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
