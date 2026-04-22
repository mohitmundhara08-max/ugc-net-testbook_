// app/api/calendar/route.js
// Uses fetch directly — no @anthropic-ai/sdk needed

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'generate') return await generateDayPlan(body);
    if (action === 'post')     return await postToTelegram(body);
    if (action === 'delete')   return await deleteFromTelegram(body);

    return Response.json({ success: false, error: 'Unknown action: ' + action });
  } catch (e) {
    console.error('[calendar] error:', e.message);
    return Response.json({ success: false, error: e.message });
  }
}

async function generateDayPlan({ channelUsername, channelTitle, subject, contentTypes, subscribers, bestHours, date }) {
  if (!ANTHROPIC_KEY) {
    return Response.json({ success: false, error: 'ANTHROPIC_API_KEY not set in Vercel environment variables' });
  }

  const hours = (bestHours && bestHours.length) ? bestHours.join(', ') : '8:00 AM, 12:00 PM, 6:00 PM, 8:30 PM';
  const contentMix = (contentTypes && contentTypes.length)
    ? contentTypes.map(ct => `${ct.type} (avg ${ct.avgViews} views, ${ct.rate}% rate)`).join('; ')
    : 'Quiz/Poll, YouTube Class Link, PDF Notes, PYQ Discussion, Current Affairs';

  const prompt = `You are an expert Telegram content strategist for UGC NET exam preparation at Testbook.
Generate a full posting plan for ONE day for this channel:

Channel: @${channelUsername} (${channelTitle || subject})
Subject: ${subject}
Subscribers: ${(subscribers || 0).toLocaleString('en-IN')}
Best posting hours: ${hours}
Top content types: ${contentMix}
Date: ${date}

Generate exactly 5 posts ready to send on Telegram.

Return ONLY valid JSON (no markdown fences):
{
  "posts": [
    {
      "id": "p1",
      "time": "8:00 AM",
      "type": "MCQ",
      "pin": false,
      "question": "Specific UGC NET ${subject} question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_option_id": 0,
      "explanation": "Brief explanation of correct answer",
      "rationale": "Why this post at this time"
    },
    {
      "id": "p2",
      "time": "12:00 PM",
      "type": "PDF Notes",
      "pin": false,
      "text": "Complete Telegram-ready post text with HTML bold <b>like this</b>\\n\\nNewlines as \\\\n",
      "rationale": "Why this post at this time"
    }
  ]
}

Rules: specific to UGC NET ${subject}, HTML only <b> tag, newlines as \\n, correct_option_id 0-indexed, return ONLY JSON`;

  let raw;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return Response.json({ success: false, error: data.error?.message || 'Anthropic API error' });
    }
    raw = data.content?.[0]?.text?.trim() || '';
  } catch (e) {
    return Response.json({ success: false, error: 'AI fetch error: ' + e.message });
  }

  try {
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(clean);
    if (!parsed.posts || !Array.isArray(parsed.posts)) throw new Error('Missing posts array');
    return Response.json({ success: true, posts: parsed.posts });
  } catch (e) {
    console.error('[calendar] JSON parse error. Raw:', raw.slice(0, 200));
    return Response.json({ success: false, error: 'Failed to parse AI response. Please retry.' });
  }
}

async function postToTelegram({ channelUsernames, text, imageUrl, pin, type, question, options, correct_option_id, explanation }) {
  if (!BOT_TOKEN) {
    return Response.json({ success: false, error: 'TELEGRAM_BOT_TOKEN not set' });
  }

  const results = await Promise.all(
    (channelUsernames || []).map(async (username) => {
      const chatId = '@' + username.replace(/^@/, '');
      try {
        let msgId;

        if (type === 'MCQ' && question && options?.length) {
          const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              question: question.slice(0, 255),
              options: options.map(o => ({ text: String(o).slice(0, 100) })),
              type: 'quiz',
              correct_option_id: Number(correct_option_id ?? 0),
              explanation: (explanation || '').slice(0, 200),
              is_anonymous: true,
            }),
          });
          const data = await res.json();
          if (!data.ok) return { channel: username, success: false, error: data.description };
          msgId = data.result.message_id;

        } else if (imageUrl) {
          const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, photo: imageUrl, caption: (text || '').slice(0, 1024), parse_mode: 'HTML' }),
          });
          const data = await res.json();
          if (!data.ok) return { channel: username, success: false, error: data.description };
          msgId = data.result.message_id;

        } else {
          const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: (text || '').slice(0, 4096), parse_mode: 'HTML' }),
          });
          const data = await res.json();
          if (!data.ok) return { channel: username, success: false, error: data.description };
          msgId = data.result.message_id;
        }

        let pinned = false;
        if (pin && msgId) {
          const pinRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/pinChatMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, message_id: msgId, disable_notification: true }),
          });
          pinned = (await pinRes.json()).ok;
        }

        return { channel: username, success: true, messageId: msgId, pinned };
      } catch (e) {
        return { channel: username, success: false, error: e.message };
      }
    })
  );

  return Response.json({ success: true, results });
}

async function deleteFromTelegram({ channelUsername, messageId }) {
  if (!BOT_TOKEN) return Response.json({ success: false, error: 'TELEGRAM_BOT_TOKEN not configured' });
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: '@' + (channelUsername || '').replace(/^@/, ''), message_id: messageId }),
  });
  const data = await res.json();
  return Response.json({ success: data.ok, error: data.description });
}
