// app/lib/fetch-with-retry.js
// Resilient fetch wrapper. Retries on 5xx (cold-start 503s, gateway timeouts) and network errors.
// Use exactly like fetch(): fetchWithRetry(url, opts) → Promise<Response>

export async function fetchWithRetry(url, opts = {}, {
  maxRetries = 3,
  initialDelayMs = 800,
  backoffFactor = 2,
  onRetry = null,
} = {}) {
  let lastError;
  let delay = initialDelayMs;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const res = await fetch(url, opts);
      // 5xx = retry, 4xx = don't retry (it's our bug)
      if (res.status >= 500 && res.status < 600 && attempt <= maxRetries) {
        if (onRetry) onRetry({ attempt, status: res.status, willRetry: true });
        await new Promise((r) => setTimeout(r, delay));
        delay *= backoffFactor;
        continue;
      }
      return res;
    } catch (e) {
      lastError = e;
      if (attempt <= maxRetries) {
        if (onRetry) onRetry({ attempt, error: e.message, willRetry: true });
        await new Promise((r) => setTimeout(r, delay));
        delay *= backoffFactor;
        continue;
      }
      throw e;
    }
  }
  throw lastError || new Error('fetch failed after retries');
}
