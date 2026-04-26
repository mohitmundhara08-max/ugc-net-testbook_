// app/api/posts/route.js
// Paginates through ALL pending Telegram updates (not just 100)

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function GET() {
  if (!BOT_TOKEN) {
    return Response.json({ success: false, error: 'TELEGRAM_BOT_TOKEN not set' });
  }

  try {
    // Paginate through all pending updates — up to 10 batches of 100 = 1000 updates
    // This covers 25 channels × ~10 posts/day × 2 days = ~500 updates comfortably
    const allUpdates = [];
    let offset = undefined;

    for (let batch = 0; batch < 10; batch++) {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=100${offset !== undefined ? `&offset=${offset}` : ''}`;
      const res  = await fetch(url, { cache: 'no-store' });
      const data = await res.json();

      if (!data.ok || !data.result?.length) break;

      allUpdates.push(...data.result);

      // If we got fewer than 100, we've reached the end of the queue
      if (data.result.length < 100) break;

      // Advance offset to get next batch (this consumes the current batch from Telegram's queue)
      offset = data.result[data.result.length - 1].update_id + 1;
    }

    // Build counts and post items keyed by date → channel
    const counts = {};
    const posts  = {};
    const cutoff = Date.now() - 48 * 60 * 60 * 1000; // 48h ago

    for (const update of allUpdates) {
      const msg = update.message || update.channel_post || update.edited_channel_post;
      if (!msg) continue;

      const ts = msg.date * 1000;
      if (ts < cutoff) continue; // skip older than 48h

      const date = new Date(ts).toLocaleDateString('sv-SE', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD in IST
      const time = new Date(ts).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).toLowerCase();

      const rawUsername = msg.chat?.username || '';
      const username    = rawUsername.toLowerCase();
      if (!username) continue;

      // Classify post type
      let type    = 'Message';
      let preview = (msg.text || msg.caption || '').slice(0, 80).replace(/\n/g, ' ');

      if (msg.poll) {
        type    = msg.poll.type === 'quiz' ? 'MCQ Poll' : 'Poll';
        preview = (msg.poll.question || '').slice(0, 80);
      } else if (msg.photo?.length) {
        type = 'Photo';
      } else if (msg.video || msg.video_note) {
        type = 'Video';
      } else if (msg.document) {
        type = 'Document';
      } else if (msg.text?.match(/youtube\.com|youtu\.be/i)) {
        type = 'YouTube Class';
      } else if (msg.text?.match(/t\.me\//i)) {
        type = 'Telegram Link';
      }

      // counts
      if (!counts[date])              counts[date]          = {};
      if (!counts[date][username])    counts[date][username] = 0;
      counts[date][username]++;

      // posts
      if (!posts[date])              posts[date]          = {};
      if (!posts[date][username])    posts[date][username] = [];
      posts[date][username].push({ type, preview, time, messageId: msg.message_id });
    }

    // Sort posts within each channel by time (messageId is monotonically increasing)
    for (const date of Object.keys(posts)) {
      for (const ch of Object.keys(posts[date])) {
        posts[date][ch].sort((a, b) => a.messageId - b.messageId);
      }
    }

    return Response.json({
      success: true,
      counts,
      posts,
      totalUpdates: allUpdates.length,
      note: `Real posts from Telegram getUpdates · ${allUpdates.length} updates collected · covers last 48h`,
    });

  } catch (e) {
    console.error('[posts] error:', e.message);
    return Response.json({ success: false, error: e.message });
  }
}
