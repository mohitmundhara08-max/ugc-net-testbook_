'use client';
import { useEffect, useMemo, useState } from 'react';
import SubjectMultiSelect, { applySubjectFilter } from './subject-multiselect';
import { fetchWithRetry } from '../lib/fetch-with-retry';

// ─────────────────────────── mappings ───────────────────────────
const SUBJECTS = {
  testbook_ugcnet: 'Common',
  pritipaper1: 'Paper 1 · Priti',
  tulikamam: 'Paper 1 · Tulika',
  anshikamaamtestbook: 'Paper 1 · Anshika',
  testbookrajatsir: 'Paper 1 · Rajat Sir',
  pradyumansir_testbook: 'Political Science',
  ashwanisir_testbook: 'History',
  kiranmaamtestbook: 'Public Administration',
  manojsonker_testbook: 'Sociology',
  heenamaam_testbook: 'Education',
  aditimaam_testbook: 'Home Science',
  karansir_testbook: 'Law',
  testbookdakshita: 'English',
  ashishsir_testbook: 'Geography',
  shachimaam_testbook: 'Economics',
  monikamaamtestbook: 'Management 1',
  yogitamaamtestbook: 'Management 2',
  evs_anshikamaamtestbook: 'Environmental Science',
  daminimaam_testbook: 'Library Science',
  testbookshahna: 'Computer Science',
  prakashsirtestbook: 'Sanskrit',
  kesharisir_testbook: 'Hindi',
  testbookniharikamaam: 'Commerce',
  mrinalinimaam_testbook: 'Psychology',
  testbook_gauravsir: 'Physical Education',
};

const POST_TYPES = ['Message', 'MCQ', 'YouTube Class', 'PDF Notes', 'Voice Note', 'PYQ Discussion', 'Current Affairs', 'Promotional'];

const POST_TYPE_COLORS = {
  'MCQ':             { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
  'YouTube Class':   { bg: '#fee2e2', text: '#991b1b', border: '#dc2626' },
  'PDF Notes':       { bg: '#dcfce7', text: '#15803d', border: '#22c55e' },
  'Voice Note':      { bg: '#ede9fe', text: '#5b21b6', border: '#8b5cf6' },
  'PYQ Discussion':  { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  'Current Affairs': { bg: '#cffafe', text: '#155e75', border: '#06b6d4' },
  'Promotional':     { bg: '#f3e8ff', text: '#6b21a8', border: '#a855f7' },
  'Message':         { bg: '#f1f5f9', text: '#334155', border: '#64748b' },
};

const STATUS_BADGE = {
  scheduled: { bg: '#dbeafe', text: '#1e40af', label: 'Scheduled' },
  posting:   { bg: '#fef3c7', text: '#92400e', label: 'Posting…' },
  posted:    { bg: '#dcfce7', text: '#15803d', label: 'Posted' },
  failed:    { bg: '#fee2e2', text: '#991b1b', label: 'Failed' },
  cancelled: { bg: '#f1f5f9', text: '#64748b', label: 'Cancelled' },
};

// ─────────────────────────── date helpers (IST) ───────────────────────────
function startOfDayIst(d) {
  const istStr = d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Kolkata' });
  return new Date(`${istStr}T00:00:00+05:30`);
}
function endOfDayIst(d) {
  const istStr = d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Kolkata' });
  return new Date(`${istStr}T23:59:59.999+05:30`);
}
function addDays(d, n) { return new Date(d.getTime() + n * 86400000); }
function startOfWeekIst(d) {
  const day = new Date(d.toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' })).getDay();
  return startOfDayIst(addDays(d, -day));
}
function startOfMonthIst(d) {
  const istStr = d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Kolkata' });
  const [y, m] = istStr.split('-');
  return new Date(`${y}-${m}-01T00:00:00+05:30`);
}
function endOfMonthIst(d) {
  const start = startOfMonthIst(d);
  const next  = new Date(start);
  next.setMonth(next.getMonth() + 1);
  return new Date(next.getTime() - 1);
}
function fmtTime(d) {
  return d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });
}
function fmtDayLabel(d) {
  return d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short' });
}
function fmtMonthLabel(d) {
  return d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'long', year: 'numeric' });
}
function istKey(d) {
  return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Kolkata' });
}
function istHour(d) {
  return parseInt(d.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }), 10);
}
function isSameDayIst(a, b) {
  return istKey(a) === istKey(b);
}

// ─────────────────────────── component ───────────────────────────
export default function ContentCalendarSection({ channels = [] }) {
  // ─── State ───
  const [view, setView]            = useState('week');      // 'day' | 'week' | 'month'
  const [cursor, setCursor]        = useState(() => new Date()); // any date in the visible range
  const [filterSubjects, setFilterSubjects] = useState([]);
  const [posts, setPosts]          = useState([]);
  const [loading, setLoading]      = useState(true);
  const [error, setError]          = useState(null);

  const [editPost, setEditPost]    = useState(null);   // post being edited (or { isNew: true, ... })

  // AI Generator state (preserve existing behaviour)
  const [aiChannel, setAiChannel]  = useState(channels[0]?.username || '');
  const [aiDate, setAiDate]        = useState(istKey(new Date()));
  const [aiLoading, setAiLoading]  = useState(false);
  const [aiError, setAiError]      = useState(null);

  // ─── Range for fetch ───
  const { rangeFrom, rangeTo } = useMemo(() => {
    if (view === 'day')   return { rangeFrom: startOfDayIst(cursor),   rangeTo: endOfDayIst(cursor) };
    if (view === 'week')  return { rangeFrom: startOfWeekIst(cursor),  rangeTo: addDays(startOfWeekIst(cursor), 6) };
    return { rangeFrom: startOfMonthIst(cursor), rangeTo: endOfMonthIst(cursor) };
  }, [cursor, view]);

  // ─── Fetch ───
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/scheduled-posts?from=${encodeURIComponent(rangeFrom.toISOString())}&to=${encodeURIComponent(rangeTo.toISOString())}`;
      const r = await fetchWithRetry(url, {});
      const d = await r.json();
      if (!d.ok) setError(d.error || 'unknown');
      else       setPosts(d.posts || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [rangeFrom.toISOString(), rangeTo.toISOString()]);

  // ─── Subject filter ───
  const allSubjects = useMemo(() => Array.from(new Set(Object.values(SUBJECTS))).sort(), []);
  const filteredPosts = useMemo(() => {
    if (filterSubjects.length === 0) return posts;
    if (filterSubjects.includes('__none__')) return [];
    return posts.filter((p) => filterSubjects.includes(SUBJECTS[p.chat_username] || p.chat_username));
  }, [posts, filterSubjects]);

  // ─── Navigation ───
  const goToday = () => setCursor(new Date());
  const goPrev = () => {
    if (view === 'day')  return setCursor(addDays(cursor, -1));
    if (view === 'week') return setCursor(addDays(cursor, -7));
    const d = new Date(cursor); d.setMonth(d.getMonth() - 1); setCursor(d);
  };
  const goNext = () => {
    if (view === 'day')  return setCursor(addDays(cursor, 1));
    if (view === 'week') return setCursor(addDays(cursor, 7));
    const d = new Date(cursor); d.setMonth(d.getMonth() + 1); setCursor(d);
  };

  // ─── Header label ───
  const headerLabel = useMemo(() => {
    if (view === 'day')   return fmtDayLabel(cursor);
    if (view === 'week') {
      const s = startOfWeekIst(cursor);
      const e = addDays(s, 6);
      return `${s.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })} – ${e.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return fmtMonthLabel(cursor);
  }, [cursor, view]);

  // ─── AI generator ───
  async function runAiPlan() {
    if (!aiChannel) return;
    const ch = channels.find((c) => c.username === aiChannel);
    if (!ch) { setAiError('Unknown channel'); return; }
    setAiLoading(true); setAiError(null);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          channelUsername: ch.username,
          channelTitle:    ch.title || ch.subject,
          subject:         ch.subject || SUBJECTS[ch.username] || 'UGC NET',
          contentTypes:    ch.contentTypes || [],
          subscribers:     ch.subs,
          bestHours:       ch.bestHours || [],
          date:            aiDate,
        }),
      });
      const data = await res.json();
      if (!data.success) { setAiError(data.error || 'Failed'); return; }

      // Convert AI-generated posts into scheduled-post inserts
      const istDate = aiDate; // YYYY-MM-DD
      for (const p of data.posts || []) {
        // p.time looks like "8:00 AM" / "12:00 PM" — parse to 24h
        const t = parseAmPmToIst(istDate, p.time);
        if (!t) continue;
        const insert = {
          chat_username: ch.username,
          scheduled_at:  t.toISOString(),
          post_type:     p.type || 'Message',
          content:       p.text || '',
          quiz_question:   p.question || null,
          quiz_options:    p.options || null,
          quiz_correct_idx: (p.correct_option_id !== undefined && p.correct_option_id !== null) ? Number(p.correct_option_id) : null,
          quiz_explanation: p.explanation || null,
          should_pin:    !!p.pin,
          source:        'ai_day_plan',
        };
        await fetch('/api/scheduled-posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(insert),
        });
      }
      // Navigate to that date so the user sees the new posts
      setCursor(new Date(`${istDate}T12:00:00+05:30`));
      setView('day');
      await refresh();
    } catch (e) { setAiError(e.message); }
    finally { setAiLoading(false); }
  }

  function parseAmPmToIst(istDate, timeStr) {
    if (!timeStr) return null;
    const m = String(timeStr).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const ampm = m[3].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const hh = String(h).padStart(2, '0');
    const mm = String(min).padStart(2, '0');
    return new Date(`${istDate}T${hh}:${mm}:00+05:30`);
  }

  // ─── Save handlers ───
  async function savePost(post) {
    const isNew = !post.id;
    const url   = isNew ? '/api/scheduled-posts' : `/api/scheduled-posts/${post.id}`;
    const method = isNew ? 'POST' : 'PATCH';
    const body = {
      chat_username:    post.chat_username,
      scheduled_at:     post.scheduled_at,
      post_type:        post.post_type,
      content:          post.content,
      quiz_question:    post.quiz_question || null,
      quiz_options:     post.quiz_options || null,
      quiz_correct_idx: post.quiz_correct_idx ?? null,
      quiz_explanation: post.quiz_explanation || null,
      should_pin:       !!post.should_pin,
      source:           post.source || 'manual',
    };
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json();
    if (!d.ok) throw new Error(d.error || 'save_failed');
    setEditPost(null);
    await refresh();
  }
  async function deletePost(id) {
    if (!confirm('Cancel/delete this scheduled post? If already posted, it will also be deleted from Telegram.')) return;
    const r = await fetch(`/api/scheduled-posts/${id}`, { method: 'DELETE' });
    const d = await r.json();
    if (!d.ok) { alert('Delete failed: ' + d.error); return; }
    setEditPost(null);
    await refresh();
  }
  async function postNow(id) {
    if (!confirm('Post this to Telegram immediately?')) return;
    const r = await fetch(`/api/scheduled-posts/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'post-now' }),
    });
    const d = await r.json();
    if (!d.ok) { alert('Post failed: ' + d.error); return; }
    setEditPost(null);
    await refresh();
  }
  async function pinPost(id, pin) {
    const r = await fetch(`/api/scheduled-posts/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: pin ? 'pin' : 'unpin' }),
    });
    const d = await r.json();
    if (!d.ok) { alert((pin ? 'Pin' : 'Unpin') + ' failed: ' + d.error); return; }
    await refresh();
  }

  // ─── Click empty slot → open new-post modal ───
  function newPostAt(date) {
    setEditPost({
      isNew: true,
      chat_username: aiChannel || channels[0]?.username || '',
      scheduled_at: date.toISOString(),
      post_type: 'Message',
      content: '',
      should_pin: false,
      source: 'manual',
    });
  }

  return (
    <div>
      <Header />
      <AiGenerator
        channels={channels}
        aiChannel={aiChannel} setAiChannel={setAiChannel}
        aiDate={aiDate} setAiDate={setAiDate}
        loading={aiLoading} error={aiError}
        onRun={runAiPlan}
      />

      <CalendarToolbar
        view={view} setView={setView}
        headerLabel={headerLabel}
        onPrev={goPrev} onNext={goNext} onToday={goToday}
        filterSubjects={filterSubjects} setFilterSubjects={setFilterSubjects}
        allSubjects={allSubjects}
        onNewPost={() => newPostAt(new Date())}
        onRefresh={refresh}
        loading={loading}
      />

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        {view === 'month' && <MonthView cursor={cursor} posts={filteredPosts} onEventClick={setEditPost} onSlotClick={newPostAt} />}
        {view === 'week'  && <WeekView  cursor={cursor} posts={filteredPosts} onEventClick={setEditPost} onSlotClick={newPostAt} />}
        {view === 'day'   && <DayView   cursor={cursor} posts={filteredPosts} onEventClick={setEditPost} onSlotClick={newPostAt} />}
      </div>

      {editPost && (
        <PostModal
          post={editPost}
          channels={channels}
          onSave={savePost}
          onClose={() => setEditPost(null)}
          onDelete={deletePost}
          onPostNow={postNow}
          onPinToggle={pinPost}
        />
      )}

      <FooterNote />
    </div>
  );
}

// ─────────────────────────── Header ───────────────────────────
function Header() {
  return (
    <div style={{ marginBottom: 14 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>📅 Content Calendar</h1>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
        Schedule, pin, post & delete · auto-publishes to Telegram at scheduled time
      </div>
    </div>
  );
}

// ─────────────────────────── AI Generator (preserved, simplified) ───────────────────────────
function AiGenerator({ channels, aiChannel, setAiChannel, aiDate, setAiDate, loading, error, onRun }) {
  const ch = channels.find((c) => c.username === aiChannel);
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
      border: '1px solid #fcd34d', borderRadius: 10, padding: '12px 14px', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 16 }}>✨</span>
        <strong style={{ fontSize: 13, color: '#92400e' }}>AI Day Plan</strong>
        <select
          value={aiChannel}
          onChange={(e) => setAiChannel(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, background: 'white', minWidth: 240 }}
        >
          {channels.map((c) => (
            <option key={c.username} value={c.username}>
              @{c.username} {c.subs ? `(${c.subs.toLocaleString('en-IN')} subs)` : ''}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={aiDate}
          onChange={(e) => setAiDate(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
        />
        <button
          onClick={onRun}
          disabled={loading || !aiChannel}
          style={{
            background: loading ? '#94a3b8' : '#92400e', color: 'white',
            border: 'none', padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Generating…' : '✨ Generate & schedule day'}
        </button>
        <span style={{ fontSize: 11, color: '#92400e' }}>
          {ch?.bestHours?.length ? `Best hours: ${ch.bestHours.join(', ')}` : ''}
        </span>
      </div>
      {error && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#991b1b' }}>AI error: {error}</div>
      )}
    </div>
  );
}

// ─────────────────────────── Toolbar ───────────────────────────
function CalendarToolbar({ view, setView, headerLabel, onPrev, onNext, onToday, filterSubjects, setFilterSubjects, allSubjects, onNewPost, onRefresh, loading }) {
  const btn = (active) => ({
    padding: '6px 12px', borderRadius: 6, border: 'none',
    background: active ? '#0f172a' : 'transparent', color: active ? 'white' : '#475569',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  });
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      padding: '10px 12px', background: 'white', border: '1px solid #e2e8f0',
      borderRadius: 10, marginBottom: 12,
    }}>
      <button onClick={onToday} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: 'white', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>Today</button>
      <button onClick={onPrev} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: 'white', borderRadius: 6, fontSize: 14, cursor: 'pointer', color: '#475569' }}>‹</button>
      <button onClick={onNext} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: 'white', borderRadius: 6, fontSize: 14, cursor: 'pointer', color: '#475569' }}>›</button>

      <strong style={{ fontSize: 15, color: '#0f172a', margin: '0 6px' }}>{headerLabel}</strong>

      <div style={{ display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 6, padding: 2 }}>
        <button onClick={() => setView('day')}   style={btn(view === 'day')}>Day</button>
        <button onClick={() => setView('week')}  style={btn(view === 'week')}>Week</button>
        <button onClick={() => setView('month')} style={btn(view === 'month')}>Month</button>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <SubjectMultiSelect
          options={allSubjects}
          value={filterSubjects}
          onChange={setFilterSubjects}
          label="Subjects"
        />
        <button onClick={onRefresh} disabled={loading} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: 'white', borderRadius: 6, fontSize: 13, cursor: loading ? 'wait' : 'pointer', color: '#475569' }}>
          {loading ? '⟳' : '↻'}
        </button>
        <button onClick={onNewPost} style={{ padding: '7px 14px', border: 'none', background: '#0f172a', color: 'white', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          + New post
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────── Month View ───────────────────────────
function MonthView({ cursor, posts, onEventClick, onSlotClick }) {
  const monthStart = startOfMonthIst(cursor);
  const monthEnd   = endOfMonthIst(cursor);
  const gridStart  = addDays(monthStart, -monthStart.getDay()); // back to Sunday
  // 6 weeks * 7 days = 42 cells
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const today = new Date();

  // Group posts by IST date string
  const postsByDay = useMemo(() => {
    const m = new Map();
    for (const p of posts) {
      const k = istKey(new Date(p.scheduled_at));
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(p);
    }
    return m;
  }, [posts]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(110px, auto)' }}>
        {cells.map((d, i) => {
          const inMonth = d >= monthStart && d <= monthEnd;
          const isToday = isSameDayIst(d, today);
          const dayPosts = postsByDay.get(istKey(d)) || [];
          const dayNum   = parseInt(d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric' }), 10);
          return (
            <div
              key={i}
              onClick={(e) => { if (e.target === e.currentTarget) onSlotClick(new Date(d.getTime() + 9 * 3600 * 1000)); }}
              style={{
                borderRight: ((i + 1) % 7 !== 0) ? '1px solid #f1f5f9' : 'none',
                borderBottom: '1px solid #f1f5f9',
                padding: 6,
                background: inMonth ? 'white' : '#f8fafc',
                opacity: inMonth ? 1 : 0.6,
                minHeight: 110,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 3,
              }}
            >
              <div style={{
                fontSize: 12, fontWeight: 700,
                color: isToday ? 'white' : '#0f172a',
                background: isToday ? '#3b82f6' : 'transparent',
                width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', alignSelf: 'flex-start',
              }}>{dayNum}</div>
              {dayPosts.slice(0, 4).map((p) => <EventChip key={p.id} post={p} compact onClick={() => onEventClick(p)} />)}
              {dayPosts.length > 4 && (
                <div style={{ fontSize: 10, color: '#64748b', paddingLeft: 4 }}>+ {dayPosts.length - 4} more</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────── Week View ───────────────────────────
function WeekView({ cursor, posts, onEventClick, onSlotClick }) {
  const weekStart = startOfWeekIst(cursor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();
  const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

  // Index posts: dayKey → hour → posts
  const grid = useMemo(() => {
    const m = new Map();
    for (const p of posts) {
      const dt = new Date(p.scheduled_at);
      const key = istKey(dt);
      const h   = istHour(dt);
      if (!m.has(key)) m.set(key, new Map());
      const hourMap = m.get(key);
      if (!hourMap.has(h)) hourMap.set(h, []);
      hourMap.get(h).push(p);
    }
    return m;
  }, [posts]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, minmax(120px, 1fr))', minWidth: 900 }}>
        {/* Header row */}
        <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #f1f5f9' }} />
        {days.map((d, i) => {
          const isToday = isSameDayIst(d, today);
          return (
            <div key={i} style={{
              padding: '8px 10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', borderRight: (i === 6 ? 'none' : '1px solid #f1f5f9'),
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short' })}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 700,
                color: isToday ? 'white' : '#0f172a',
                background: isToday ? '#3b82f6' : 'transparent',
                width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', marginTop: 2,
              }}>
                {d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric' })}
              </div>
            </div>
          );
        })}

        {/* Hour rows */}
        {HOURS.map((h) => (
          <Fragment key={h}>
            <div style={{ padding: '4px 8px', fontSize: 10, color: '#94a3b8', textAlign: 'right', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', minHeight: 56 }}>
              {(h % 12 === 0 ? 12 : h % 12)} {h < 12 ? 'AM' : 'PM'}
            </div>
            {days.map((d, i) => {
              const cellPosts = (grid.get(istKey(d))?.get(h)) || [];
              const cellTime = new Date(`${istKey(d)}T${String(h).padStart(2, '0')}:00:00+05:30`);
              return (
                <div
                  key={i}
                  onClick={(e) => { if (e.target === e.currentTarget) onSlotClick(cellTime); }}
                  style={{
                    borderRight: (i === 6 ? 'none' : '1px solid #f1f5f9'),
                    borderBottom: '1px solid #f1f5f9',
                    minHeight: 56,
                    padding: 3,
                    display: 'flex', flexDirection: 'column', gap: 2,
                    cursor: 'pointer',
                    background: 'white',
                  }}
                >
                  {cellPosts.map((p) => <EventChip key={p.id} post={p} onClick={() => onEventClick(p)} />)}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────── Day View ───────────────────────────
function DayView({ cursor, posts, onEventClick, onSlotClick }) {
  const dayPosts = useMemo(() => posts.filter((p) => isSameDayIst(new Date(p.scheduled_at), cursor)).sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)), [posts, cursor]);
  const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
  const today = new Date();

  const postsByHour = useMemo(() => {
    const m = new Map();
    for (const p of dayPosts) {
      const h = istHour(new Date(p.scheduled_at));
      if (!m.has(h)) m.set(h, []);
      m.get(h).push(p);
    }
    return m;
  }, [dayPosts]);

  return (
    <div>
      <div style={{ padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <strong style={{ fontSize: 14, color: '#0f172a' }}>{fmtDayLabel(cursor)}</strong>
        {isSameDayIst(cursor, today) && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>TODAY</span>}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>{dayPosts.length} posts</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr' }}>
        {HOURS.map((h) => {
          const hp = postsByHour.get(h) || [];
          const slotTime = new Date(`${istKey(cursor)}T${String(h).padStart(2, '0')}:00:00+05:30`);
          return (
            <Fragment key={h}>
              <div style={{ padding: '6px 10px', fontSize: 11, color: '#94a3b8', textAlign: 'right', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', minHeight: 64 }}>
                {(h % 12 === 0 ? 12 : h % 12)} {h < 12 ? 'AM' : 'PM'}
              </div>
              <div
                onClick={(e) => { if (e.target === e.currentTarget) onSlotClick(slotTime); }}
                style={{ borderBottom: '1px solid #f1f5f9', minHeight: 64, padding: 6, display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}
              >
                {hp.map((p) => <EventChip key={p.id} post={p} expanded onClick={() => onEventClick(p)} />)}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

// React.Fragment shim (since we don't import React)
function Fragment({ children }) { return <>{children}</>; }

// ─────────────────────────── Event chip ───────────────────────────
function EventChip({ post, compact, expanded, onClick }) {
  const color  = POST_TYPE_COLORS[post.post_type] || POST_TYPE_COLORS.Message;
  const subj   = SUBJECTS[post.chat_username] || post.chat_username;
  const time   = fmtTime(new Date(post.scheduled_at));
  const status = STATUS_BADGE[post.status] || STATUS_BADGE.scheduled;
  const isPosted = post.status === 'posted';
  const isFailed = post.status === 'failed';

  const opacity = (post.status === 'cancelled') ? 0.4 : 1;
  const decoration = isPosted ? 'line-through' : 'none';

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      title={`${time} · ${subj} · ${post.post_type}\n${(post.content || post.quiz_question || '').slice(0, 120)}`}
      style={{
        background: color.bg, color: color.text,
        borderLeft: `3px solid ${color.border}`,
        padding: compact ? '2px 6px' : (expanded ? '6px 10px' : '3px 6px'),
        borderRadius: 4,
        fontSize: compact ? 10 : 11,
        cursor: 'pointer',
        overflow: 'hidden',
        whiteSpace: compact ? 'nowrap' : 'normal',
        textOverflow: 'ellipsis',
        opacity,
        textDecoration: decoration,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <span>{time}</span>
        {post.should_pin && <span title="Will be pinned" style={{ fontSize: 9 }}>📌</span>}
        {isFailed && <span title="Posting failed" style={{ fontSize: 9 }}>⚠️</span>}
        {isPosted && <span title="Already posted" style={{ fontSize: 9 }}>✓</span>}
        {!compact && <span style={{ marginLeft: 'auto', fontSize: 9, opacity: 0.8 }}>{post.post_type}</span>}
      </div>
      {!compact && (
        <div style={{ fontSize: compact ? 9 : 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
          {subj}
        </div>
      )}
      {expanded && (post.content || post.quiz_question) && (
        <div style={{ fontSize: 11, marginTop: 4, lineHeight: 1.4, color: '#0f172a', whiteSpace: 'pre-wrap', maxHeight: 80, overflow: 'hidden' }}>
          {(post.content || post.quiz_question || '').slice(0, 200)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────── Modal ───────────────────────────
function PostModal({ post, channels, onSave, onClose, onDelete, onPostNow, onPinToggle }) {
  const [draft, setDraft] = useState(() => ({ ...post }));
  const isNew = !!post.isNew;
  const isPosted = draft.status === 'posted';

  const updateField = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  // Convert scheduled_at to datetime-local input value (in IST)
  const scheduledLocal = useMemo(() => {
    if (!draft.scheduled_at) return '';
    const d = new Date(draft.scheduled_at);
    const istStr = d.toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' });
    return istStr.slice(0, 16).replace(' ', 'T');
  }, [draft.scheduled_at]);
  const onTimeChange = (e) => {
    if (!e.target.value) return;
    const iso = new Date(`${e.target.value}:00+05:30`).toISOString();
    updateField('scheduled_at', iso);
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'white', borderRadius: 12, width: 'min(640px, 100%)', maxHeight: '90vh',
        overflow: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #e2e8f0' }}>
          <strong style={{ fontSize: 16, color: '#0f172a' }}>
            {isNew ? '➕ New scheduled post' : (isPosted ? '✓ Posted message' : '✏️ Edit scheduled post')}
          </strong>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 20, color: '#94a3b8', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Channel">
            <select
              value={draft.chat_username || ''}
              onChange={(e) => updateField('chat_username', e.target.value)}
              disabled={isPosted}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, background: 'white' }}
            >
              <option value="">Select channel…</option>
              {channels.map((c) => (
                <option key={c.username} value={c.username}>
                  {SUBJECTS[c.username] || c.username} · @{c.username}
                </option>
              ))}
            </select>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Scheduled for (IST)">
              <input type="datetime-local" value={scheduledLocal} onChange={onTimeChange} disabled={isPosted}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
            </Field>
            <Field label="Post type">
              <select
                value={draft.post_type || 'Message'}
                onChange={(e) => updateField('post_type', e.target.value)}
                disabled={isPosted}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, background: 'white' }}
              >
                {POST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          {draft.post_type === 'MCQ' ? (
            <>
              <Field label="Question">
                <input value={draft.quiz_question || ''} onChange={(e) => updateField('quiz_question', e.target.value)} disabled={isPosted}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
              </Field>
              <Field label="Options (one per line, mark correct with *)">
                <textarea
                  value={(draft.quiz_options || []).map((o, i) => (i === Number(draft.quiz_correct_idx ?? 0) ? '* ' : '') + o).join('\n')}
                  disabled={isPosted}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter((l) => l.trim());
                    let correctIdx = 0;
                    const opts = lines.map((l, i) => {
                      if (l.startsWith('* ')) { correctIdx = i; return l.slice(2); }
                      return l;
                    });
                    updateField('quiz_options', opts);
                    updateField('quiz_correct_idx', correctIdx);
                  }}
                  rows={5}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, fontFamily: 'inherit' }}
                  placeholder="* Option A&#10;Option B&#10;Option C&#10;Option D"
                />
              </Field>
              <Field label="Explanation">
                <input value={draft.quiz_explanation || ''} onChange={(e) => updateField('quiz_explanation', e.target.value)} disabled={isPosted}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
              </Field>
            </>
          ) : (
            <Field label="Content (HTML <b> tags supported, \\n for new lines)">
              <textarea
                value={draft.content || ''}
                onChange={(e) => updateField('content', e.target.value)}
                disabled={isPosted}
                rows={8}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, fontFamily: 'inherit' }}
                placeholder="Your post text…"
              />
            </Field>
          )}

          <Field label="">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#0f172a', cursor: isPosted ? 'default' : 'pointer' }}>
              <input
                type="checkbox"
                checked={!!draft.should_pin}
                disabled={isPosted}
                onChange={(e) => updateField('should_pin', e.target.checked)}
              />
              📌 Pin this message after posting
            </label>
          </Field>

          {draft.status && (
            <div style={{
              padding: '8px 10px', borderRadius: 6,
              background: (STATUS_BADGE[draft.status] || STATUS_BADGE.scheduled).bg,
              color: (STATUS_BADGE[draft.status] || STATUS_BADGE.scheduled).text,
              fontSize: 12, fontWeight: 600,
            }}>
              Status: {(STATUS_BADGE[draft.status] || STATUS_BADGE.scheduled).label}
              {draft.posted_at && ` · ${new Date(draft.posted_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`}
              {draft.error_message && ` · ${draft.error_message}`}
              {draft.telegram_message_id && (
                <> · <a href={`https://t.me/${draft.chat_username}/${draft.telegram_message_id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>View on Telegram ↗</a></>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '12px 18px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', background: '#f8fafc' }}>
          {!isNew && (
            <button
              onClick={() => onDelete(post.id)}
              style={{ padding: '7px 12px', border: '1px solid #fecaca', background: 'white', color: '#991b1b', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              🗑 Delete{isPosted ? ' from Telegram' : ''}
            </button>
          )}
          {!isNew && !isPosted && (
            <button
              onClick={() => onPostNow(post.id)}
              style={{ padding: '7px 12px', border: '1px solid #16a34a', background: 'white', color: '#15803d', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              📤 Post now
            </button>
          )}
          {!isNew && isPosted && (
            <button
              onClick={() => onPinToggle(post.id, !draft.should_pin)}
              style={{ padding: '7px 12px', border: '1px solid #f59e0b', background: 'white', color: '#92400e', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              {draft.should_pin ? '📌 Unpin' : '📌 Pin'}
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ padding: '7px 12px', border: '1px solid #cbd5e1', background: 'white', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Close</button>
          {!isPosted && (
            <button
              onClick={() => onSave(draft).catch((e) => alert('Save failed: ' + e.message))}
              style={{ padding: '7px 16px', border: 'none', background: '#0f172a', color: 'white', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              {isNew ? 'Schedule' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      {label && <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{label.toUpperCase()}</div>}
      {children}
    </div>
  );
}

// ─────────────────────────── Footer note ───────────────────────────
function FooterNote() {
  return (
    <div style={{
      marginTop: 12, padding: '10px 14px', background: '#f0f9ff', border: '1px solid #93c5fd',
      borderRadius: 8, fontSize: 11, color: '#075985', lineHeight: 1.6,
    }}>
      <strong>💡 How auto-posting works:</strong> A worker job runs every 5 minutes and posts any scheduled items that are due. For this to actually publish to Telegram, the @ugcdatabot must be an admin in the channel with "Post Messages" permission. Currently the bot only reads — to enable auto-posting, promote it to admin in each channel (Channel settings → Administrators → Add admin → @ugcdatabot → enable "Post Messages" + "Pin Messages" + "Delete Messages"). Until then, you can still schedule + use "Post now" which uses your existing bot read access (will fail with an error if bot lacks post permission — you'll see why in the failed status).
    </div>
  );
}
