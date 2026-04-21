export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ─── GENERATE: Claude builds a full day plan ──────────────────────────────
    if (action === 'generate') {
      const { channelUsername, channelTitle, subject, contentTypes, subscribers, bestHours, date } = body;

      const dateStr = new Date(date + 'T12:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });

      const topTypes = (contentTypes || []).map(c => c.type).join(', ') || 'MCQ, PDF Notes, YouTube Class Link';

      const prompt = `You are a Telegram channel content manager for Testbook, India's leading EdTech company.

Generate a complete day's content plan for this UGC NET channel:

Channel: ${channelTitle} (@${channelUsername})
Subject: ${subject}
Subscribers: ${Number(subscribers).toLocaleString('en-IN')}
Date: ${dateStr}
Best Posting Hours: ${(bestHours || ['8:00am','12:00pm','6:00pm','8:00pm']).join(', ')}
Typical content mix: ${topTypes}

Return a JSON array ONLY (no markdown, no preamble, no code fences):
[
  {
    "time": "7:00 AM",
    "type": "Current Affairs",
    "emoji": "📰",
    "text": "Complete ready-to-post Telegram message. Use HTML: <b>bold</b>. Include emojis, actual content specific to ${subject} for UGC NET. For MCQ type include the question + 4 options A/B/C/D + spoiler answer. For Current Affairs include 3-4 bullet points. For PDF Notes include key concept summary. Max 350 chars.",
    "pin": false,
    "rationale": "Why this time slot works"
  }
]

Rules:
- Generate exactly 5-7 posts spread across the day
- Use ONLY these types: MCQ, PDF Notes, YouTube Class Link, Voice Note Class, PYQ Discussion, Current Affairs, Promotional Post
- Write REAL content — actual ${subject} topics, real MCQ questions from UGC NET syllabus, actual tips
- Mark pin:true for exactly ONE post (the most valuable content of the day)
- Space posts based on best hours provided
- HTML tags allowed: <b> <i> <code> — nothing else
- Each post must be self-contained and useful without any additional context
- Include a light Testbook CTA on 1-2 posts max (e.g., "Join SuperCoaching at testbook.com")
- Date: ${dateStr}`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return Response.json({ success: false, error: data?.error?.message || 'Claude API error' }, { status: 500 });
      }

      const raw = data.content?.find(b => b.type === 'text')?.text || '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const posts = JSON.parse(clean);

      // Attach unique IDs
      const tagged = posts.map((p, i) => ({ ...p, id: `post_${Date.now()}_${i}`, status: 'pending' }));
      return Response.json({ success: true, posts: tagged });
    }

    // ─── POST: Send message to Telegram channel ───────────────────────────────
    if (action === 'post') {
      const { channelUsername, text, pin } = body;

      if (!BOT_TOKEN) {
        return Response.json({ success: false, error: 'TELEGRAM_BOT_TOKEN not set in environment variables.' }, { status: 500 });
      }

      // Send the message
      const sendRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: `@${channelUsername}`,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      });
      const sendData = await sendRes.json();

      if (!sendData.ok) {
        // Common errors with human-readable messages
        const errMsg = sendData.description || 'Telegram API error';
        const hint = errMsg.includes('bot is not a member')
          ? 'The bot needs to be added as an admin to this channel.'
          : errMsg.includes('not enough rights')
          ? 'The bot does not have permission to post. Make it an admin with "Post Messages" rights.'
          : errMsg;
        return Response.json({ success: false, error: hint });
      }

      const messageId = sendData.result.message_id;
      let pinned = false;

      // Pin the message if requested
      if (pin && messageId) {
        const pinRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/pinChatMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: `@${channelUsername}`,
            message_id: messageId,
            disable_notification: true,
          }),
        });
        const pinData = await pinRes.json();
        pinned = pinData.ok;
      }

      return Response.json({ success: true, messageId, pinned });
    }

    return Response.json({ success: false, error: 'Unknown action' }, { status: 400 });

  } catch (err) {
    console.error('Calendar API error:', err);
    return Response.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
