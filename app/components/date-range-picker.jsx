'use client';
import { useMemo } from 'react';

// IST helpers — all date math anchored to Asia/Kolkata
const IST_OFFSET_MS = 5.5 * 3600 * 1000;

function istDateString(d = new Date()) {
  // Returns 'YYYY-MM-DD' representing the calendar day in IST
  return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Kolkata' });
}

function istDateAtStart(dateStr) {
  // Returns a Date representing 00:00:00 IST on given YYYY-MM-DD
  return new Date(`${dateStr}T00:00:00+05:30`);
}

function istDateAtEnd(dateStr) {
  // Returns 23:59:59.999 IST on given YYYY-MM-DD
  return new Date(`${dateStr}T23:59:59.999+05:30`);
}

function addDays(date, n) {
  return new Date(date.getTime() + n * 86400000);
}

export const PRESETS = {
  today: () => {
    const t = istDateString();
    return { from: istDateAtStart(t).toISOString(), to: new Date().toISOString() };
  },
  yesterday: () => {
    const t = istDateString();
    const yest = istDateString(addDays(istDateAtStart(t), -1));
    return { from: istDateAtStart(yest).toISOString(), to: istDateAtEnd(yest).toISOString() };
  },
  last7d: () => {
    const t = istDateString();
    return { from: istDateAtStart(istDateString(addDays(istDateAtStart(t), -6))).toISOString(), to: new Date().toISOString() };
  },
  last30d: () => {
    const t = istDateString();
    return { from: istDateAtStart(istDateString(addDays(istDateAtStart(t), -29))).toISOString(), to: new Date().toISOString() };
  },
  ytd: () => {
    const istNow = new Date(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' }));
    const year = istNow.getFullYear();
    return { from: istDateAtStart(`${year}-01-01`).toISOString(), to: new Date().toISOString() };
  },
  all: () => {
    return { from: '2022-01-01T00:00:00+05:30', to: new Date().toISOString() };
  },
};

export const PRESET_LABELS = [
  { key: 'today',     label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7d',    label: 'Last 7d' },
  { key: 'last30d',   label: 'Last 30d' },
  { key: 'ytd',       label: 'YTD' },
  { key: 'all',       label: 'All time' },
];

// Convert ISO timestamp to datetime-local input string (in IST)
function isoToLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const istMs = d.getTime() + IST_OFFSET_MS;
  return new Date(istMs).toISOString().slice(0, 16);
}

// Convert datetime-local string (IST) back to ISO timestamp
function localToIso(local) {
  if (!local) return null;
  return new Date(`${local}:00+05:30`).toISOString();
}

export default function DateRangePicker({ value, onChange }) {
  const { from, to, preset } = value || {};

  const handlePreset = (key) => {
    const range = PRESETS[key]();
    onChange({ ...range, preset: key });
  };

  const handleCustomFrom = (e) => {
    const iso = localToIso(e.target.value);
    if (iso) onChange({ from: iso, to: to || new Date().toISOString(), preset: 'custom' });
  };

  const handleCustomTo = (e) => {
    const iso = localToIso(e.target.value);
    if (iso) onChange({ from: from || PRESETS.last30d().from, to: iso, preset: 'custom' });
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      padding: '10px 12px',
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
    }}>
      <span style={{ fontSize: 16 }}>📅</span>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {PRESET_LABELS.map((p) => {
          const active = preset === p.key;
          return (
            <button
              key={p.key}
              onClick={() => handlePreset(p.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid ' + (active ? '#0f172a' : 'transparent'),
                background: active ? '#0f172a' : 'transparent',
                color:      active ? 'white'   : '#475569',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <input
          type="datetime-local"
          value={isoToLocal(from)}
          onChange={handleCustomFrom}
          style={{
            padding: '6px 10px',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            fontSize: 13,
            fontFamily: 'inherit',
          }}
        />
        <span style={{ color: '#94a3b8', fontSize: 14 }}>→</span>
        <input
          type="datetime-local"
          value={isoToLocal(to)}
          onChange={handleCustomTo}
          style={{
            padding: '6px 10px',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            fontSize: 13,
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
