// app/api/bot/setup/route.js
// One-time setup endpoint — hit this once after deploy to register the webhook with Telegram.
// Self-discovers the bot via getMe. Tells you exactly what got configured.
//
// USAGE:
//   GET  /api/bot/setup            → shows current webhook status + bot info
//   POST /api/bot/setup            → registers the webhook (uses your deployed URL)
//   POST /api/bot/setup?delete=1   → unregisters the webhook (rollback)

export const dynamic = 'force-dynamic';

const BOT_TOKEN      = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || '';

function deployedOrigin(request) {
  // Prefer the explicit Vercel-supplied URL, fall back to request headers
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host  = request.headers.get('x-forwarded-host')  || request.headers.get('host');
  return `${proto}://${host}`;
}

async function getMe() {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
  return res.json();
}

async function getWebhookInfo() {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
  return res.json();
}

export async function GET(request) {
  if (!BOT_TOKEN) return Response.json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not set' });

  const [me, hook] = await Promise.all([getMe(), getWebhookInfo()]);
  const desiredUrl = `${deployedOrigin(request)}/api/webhook/telegram`;

  return Response.json({
    ok:                me.ok,
    bot:               me.ok ? { id: me.result.id, username: me.result.username, name: me.result.first_name } : null,
    currentWebhook:    hook.result || null,
    desiredWebhookUrl: desiredUrl,
    isCorrectlySet:    hook.result?.url === desiredUrl,
    secret_required:   !!WEBHOOK_SECRET,
    nextStep:          hook.result?.url === desiredUrl
      ? 'Webhook is already correctly configured. You can hit POST to re-register if needed.'
      : 'Send a POST request to this same URL to register the webhook.',
  });
}

export async function POST(request) {
  if (!BOT_TOKEN) return Response.json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not set' });

  const { searchParams } = new URL(request.url);

  // Rollback path
  if (searchParams.get('delete') === '1') {
    const res  = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook?drop_pending_updates=true`);
    const data = await res.json();
    return Response.json({ ok: data.ok, deleted: true, telegram: data });
  }

  // Register webhook
  const url = `${deployedOrigin(request)}/api/webhook/telegram`;
  const body = {
    url,
    allowed_updates: ['channel_post', 'edited_channel_post'],
    drop_pending_updates: true,
    max_connections: 40,
  };
  if (WEBHOOK_SECRET) body.secret_token = WEBHOOK_SECRET;

  const res  = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  const data = await res.json();

  if (!data.ok) {
    return Response.json({ ok: false, error: data.description || 'setWebhook failed', telegram: data });
  }

  // Read back the configured webhook to confirm
  const hook = await getWebhookInfo();

  return Response.json({
    ok:               true,
    registered:       true,
    webhookUrl:       url,
    secret_used:      !!WEBHOOK_SECRET,
    allowed_updates:  body.allowed_updates,
    confirmation:     hook.result,
    nextStep:         'Post a test message in any channel and check /api/posts — it should appear within seconds.',
  });
}
