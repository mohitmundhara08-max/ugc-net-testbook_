// app/api/webhook/telegram/route.js
// Receives Telegram webhook updates and persists channel posts to Supabase.
// Idempotent via UNIQUE (chat_id, message_id) — Telegram retries won't dupe.

import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || '';

const sb = (SB_URL && SB_KEY)
  ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

function classifyPost(msg) {
  let type = 'Message';
  let preview = (msg.text || msg.caption || '').slice(0, 200).replace(/\n/g, ' ');

  if (msg.poll) {
    type    = msg.poll.type === 'quiz' ? 'MCQ Poll' : 'Poll';
    preview = (msg.poll.question || '').slice(0, 200);
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

  return { type, preview };
}

export async function POST(request) {
  // 1. Secret token verification (set when registering webhook)
  if (WEBHOOK_SECRET) {
    const incoming = request.headers.get('x-telegram-bot-api-secret-token');
    if (incoming !== WEBHOOK_SECRET) {
      return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }

  // 2. Supabase must be configured
  if (!sb) {
    return Response.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 });
  }

  // 3. Parse update payload
  let update;
  try {
    update = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  // 4. Extract the message — only care about channel posts (not DMs, not group messages)
  const msg = update.channel_post || update.edited_channel_post;
  if (!msg || !msg.chat || msg.chat.type !== 'channel') {
    // Always return 200 so Telegram doesn't retry — we just don't care about this update type
    return Response.json({ ok: true, skipped: 'not_a_channel_post' });
  }

  const username = (msg.chat.username || '').toLowerCase();
  if (!username) {
    return Response.json({ ok: true, skipped: 'no_username' });
  }

  // 5. Build row
  const { type, preview } = classifyPost(msg);
  const row = {
    chat_id:       msg.chat.id,
    message_id:    msg.message_id,
    chat_username: username,
    posted_at:     new Date(msg.date * 1000).toISOString(),
    post_type:     type,
    preview,
    raw:           update,
  };

  // 6. Upsert (idempotent on UNIQUE chat_id + message_id)
  const { error } = await sb
    .from('tg_posts')
    .upsert(row, { onConflict: 'chat_id,message_id', ignoreDuplicates: true });

  if (error) {
    console.error('[webhook] insert failed:', error.message);
    // Return 200 anyway — Telegram will keep retrying forever if we don't ack.
    // We'd rather drop one update than poison the queue.
    return Response.json({ ok: false, error: error.message });
  }

  return Response.json({ ok: true, type, username });
}

// Health check
export async function GET() {
  return Response.json({
    ok: true,
    route: 'telegram-webhook',
    note: 'POST endpoint for Telegram bot updates. Set webhook via /api/bot/setup.',
    supabase_configured: !!sb,
    secret_required: !!WEBHOOK_SECRET,
  });
}
