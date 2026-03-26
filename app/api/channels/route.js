export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const OWN_CHANNELS = [
  { username: 'testbook_ugcnet',       label: 'UGC NET Common' },
  { username: 'pritipaper1',           label: 'Paper 1 - Priti' },
  { username: 'tulikamam',             label: 'Paper 1 - Tulika' },
  { username: 'Anshikamaamtestbook',   label: 'Paper 1 - Anshika' },
  { username: 'testbookrajatsir',      label: 'Paper 1 - Rajat Sir' },
  { username: 'pradyumansir_testbook', label: 'Political Science' },
  { username: 'AshwaniSir_Testbook',   label: 'History' },
  { username: 'kiranmaamtestbook',     label: 'Public Administration' },
  { username: 'Manojsonker_Testbook',  label: 'Sociology' },
  { username: 'Heenamaam_testbook',    label: 'Education' },
  { username: 'AditiMaam_Testbook',    label: 'Home Science' },
  { username: 'karanSir_Testbook',     label: 'Law' },
  { username: 'testbookdakshita',      label: 'English' },
  { username: 'AshishSir_Testbook',    label: 'Geography' },
  { username: 'ShachiMaam_Testbook',   label: 'Economics' },
  { username: 'Monikamaamtestbook',    label: 'Management' },
  { username: 'yogitamaamtestbook',    label: 'Management' },
  { username: 'EVS_AnshikamaamTestbook', label: 'Environmental Science' },
  { username: 'daminimaam_testbook',   label: 'Library Science' },
  { username: 'TestbookShahna',        label: 'Computer Science' },
  { username: 'Prakashsirtestbook',    label: 'Sanskrit' },
  { username: 'kesharisir_testbook',   label: 'Hindi' },
  { username: 'TestbookNiharikaMaam',  label: 'Commerce' },
  { username: 'MrinaliniMaam_Testbook',label: 'Psychology' },
  { username: 'testbook_gauravsir',    label: 'Physical Education' },
];

async function fetchOne(username) {
  const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
  try {
    const [chatRes, countRes] = await Promise.all([
      Promise.race([fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=@${username}`), timeout(4000)]),
      Promise.race([fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMemberCount?chat_id=@${username}`), timeout(4000)]),
    ]);
    const chatData  = await chatRes.json();
    const countData = await countRes.json();
    if (!chatData.ok) return { username, label: username, title: username, description: '', subscribers: 0, live: false };
    return {
      username,
      label:       chatData.result.title || username,
      title:       chatData.result.title || username,
      description: chatData.result.description || '',
      subscribers: countData.ok ? countData.result : 0,
      live: true,
    };
  } catch {
    return { username, label: username, title: username, description: '', subscribers: 0, live: false };
  }
}

async function fetchBatch(usernames) {
  const BATCH = 20; // 4 batches of 20 for ~80 competitors, no delay = ~2s total
  const results = [];
  for (let i = 0; i < usernames.length; i += BATCH) {
    const batch = usernames.slice(i, i + BATCH);
    const batchResults = await Promise.all(batch.map(fetchOne));
    results.push(...batchResults);
  }
  return results;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { subject, channelSummary, compDetails, selectedDate } = body;

    const prompt = `You are a senior growth strategist for a leading EdTech company in India. Analyze this UGC NET Telegram channel data for "${subject}" and generate actionable intelligence.

TODAY: ${selectedDate}

OWN CHANNELS:
${JSON.stringify(channelSummary, null, 2)}

TOP COMPETITORS (live subscriber counts):
${compDetails?.length ? JSON.stringify(compDetails, null, 2) : 'No competitor data available.'}

Respond with ONLY a JSON object (no markdown, no preamble):
{"healthInsights":[{"channel":"name","signal":"2-4 words","observed":"one sentence with numbers","hypothesis":"one sentence root cause","action":"one specific action today","severity":"high"}],"keyInsight":"one paragraph with specific numbers and competitor comparison","contentIdeas":[{"type":"quiz","title":"specific title","description":"two sentences","tags":["tag1","tag2"],"competitorEvidence":"one sentence","priority":"high","effort":"quick (<2 hr)"}],"quickWins":[{"title":"action title","description":"two sentences","inspiredBy":"data signal","priority":"high","effort":"quick (<2 hr)"}]}

Rules: healthInsights 2-4 items. contentIdeas 2-3 items. quickWins 2-3 items. type must be one of: quiz, video, pdf, text. severity: high/medium/low. priority: high/medium. effort exactly: "quick (<2 hr)" or "moderate (half day)" or "large (1-2 days)".`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) return Response.json({ success: false, error: data?.error?.message || 'Claude API error' }, { status: 500 });

    const text = data.content?.find(b => b.type === 'text')?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return Response.json({ success: true, insights: parsed });
  } catch (err) {
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  // Competitor lookup: /api/channels?type=competitors&usernames=a,b,c
  if (type === 'competitors') {
    const usernamesParam = searchParams.get('usernames') || '';
    const usernames = usernamesParam.split(',').map(u => u.trim()).filter(Boolean);
    if (!usernames.length) return Response.json({ success: false, error: 'No usernames provided' }, { status: 400 });
    const channels = await fetchBatch(usernames);
    return Response.json({ success: true, channels, fetchedAt: new Date().toISOString() });
  }

  // Default: own channels
  const channels = await fetchBatch(OWN_CHANNELS.map(c => c.username));
  const labeled = channels.map((ch, i) => ({ ...ch, label: OWN_CHANNELS[i]?.label || ch.label }));
  const totalSubscribers = labeled.reduce((s, c) => s + c.subscribers, 0);
  return Response.json({
    success: true,
    totalSubscribers,
    channels: labeled,
    fetchedAt: new Date().toISOString(),
    isLive: true,
  });
}
