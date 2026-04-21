'use client';
import { useState, useEffect, useCallback } from 'react';

// ─── Static channel data ─────────────────────────────────────────────────────
const STATIC_CHANNELS = [
  { username:'testbook_ugcnet',          subject:'Common',               name:'@testbook_ugcnet',              posts:12, rate:8.5,  teacher:'',          avgViews:3400, avgFwd:3.7, joined:55, left:36, bestHours:['3:30pm','6:30pm','7:30pm','8:30pm'], contentTypes:[{type:'Quiz / Poll',posts:5,avgViews:3800,rate:9.2,fwd:2.1},{type:'YouTube Class Link',posts:3,avgViews:4200,rate:10.4,fwd:4.8},{type:'PDF Notes',posts:2,avgViews:5100,rate:12.5,fwd:9.2},{type:'Current Affairs',posts:2,avgViews:3200,rate:7.8,fwd:3.6}] },
  { username:'pritipaper1',              subject:'Paper 1',              name:'@pritipaper1',                  posts:11, rate:8.9,  teacher:'Priti',      avgViews:1900, avgFwd:2.1, joined:42, left:18, bestHours:['7:00am','12:00pm','6:00pm'],          contentTypes:[{type:'Quiz / Poll',posts:4,avgViews:2100,rate:10.1,fwd:2.5},{type:'Voice Note Class',posts:3,avgViews:2400,rate:11.5,fwd:1.8},{type:'PDF Notes',posts:2,avgViews:2800,rate:13.2,fwd:6.5},{type:'YouTube Class Link',posts:2,avgViews:2000,rate:9.6,fwd:2.2}] },
  { username:'tulikamam',                subject:'Paper 1',              name:'@tulikamam',                    posts:8,  rate:7.1,  teacher:'Tulika',     avgViews:1200, avgFwd:1.8, joined:30, left:22, bestHours:['8:00am','5:00pm'],                   contentTypes:[{type:'Quiz / Poll',posts:3,avgViews:1300,rate:8.0,fwd:2.0},{type:'PDF Notes',posts:3,avgViews:1500,rate:9.2,fwd:4.1},{type:'Voice Note Class',posts:2,avgViews:1100,rate:7.5,fwd:1.5}] },
  { username:'Anshikamaamtestbook',      subject:'Paper 1',              name:'@Anshikamaamtestbook',           posts:10, rate:8.3,  teacher:'Anshika',    avgViews:1100, avgFwd:2.2, joined:28, left:15, bestHours:['9:00am','4:00pm','8:00pm'],           contentTypes:[{type:'Quiz / Poll',posts:4,avgViews:1200,rate:9.1,fwd:2.8},{type:'YouTube Class Link',posts:3,avgViews:1400,rate:10.3,fwd:3.5},{type:'PDF Notes',posts:2,avgViews:1600,rate:11.8,fwd:5.2},{type:'Promotional Post',posts:1,avgViews:800,rate:5.5,fwd:1.0}] },
  { username:'testbookrajatsir',         subject:'Paper 1',              name:'@testbookrajatsir',             posts:7,  rate:6.8,  teacher:'Rajat Sir',  avgViews:320,  avgFwd:1.2, joined:12, left:8,  bestHours:['10:00am','6:00pm'],                  contentTypes:[{type:'Quiz / Poll',posts:3,avgViews:350,rate:7.5,fwd:1.5},{type:'PDF Notes',posts:2,avgViews:420,rate:9.0,fwd:2.8},{type:'PYQ Discussion',posts:2,avgViews:300,rate:6.5,fwd:1.2}] },
  { username:'pradyumansir_testbook',    subject:'Political Science',    name:'@pradyumansir_testbook',        posts:9,  rate:7.2,  teacher:'',           avgViews:2400, avgFwd:4.1, joined:48, left:25, bestHours:['8:00am','2:00pm','7:00pm'],           contentTypes:[{type:'YouTube Class Link',posts:4,avgViews:2900,rate:8.5,fwd:5.2},{type:'PYQ Discussion',posts:3,avgViews:2500,rate:7.8,fwd:4.5},{type:'PDF Notes',posts:2,avgViews:3100,rate:10.2,fwd:7.8}] },
  { username:'AshwaniSir_Testbook',      subject:'History',              name:'@AshwaniSir_Testbook',          posts:9,  rate:7.5,  teacher:'',           avgViews:1100, avgFwd:2.8, joined:35, left:20, bestHours:['9:00am','5:00pm'],                   contentTypes:[{type:'YouTube Class Link',posts:4,avgViews:1300,rate:8.5,fwd:3.5},{type:'PDF Notes',posts:3,avgViews:1500,rate:10.1,fwd:4.8},{type:'Quiz / Poll',posts:2,avgViews:900,rate:6.2,fwd:2.0}] },
  { username:'kiranmaamtestbook',        subject:'Public Administration',name:'@kiranmaamtestbook',            posts:6,  rate:6.2,  teacher:'',           avgViews:500,  avgFwd:1.5, joined:18, left:12, bestHours:['10:00am','6:00pm'],                  contentTypes:[{type:'PDF Notes',posts:3,avgViews:620,rate:8.0,fwd:2.5},{type:'PYQ Discussion',posts:2,avgViews:480,rate:6.2,fwd:1.8},{type:'Quiz / Poll',posts:1,avgViews:400,rate:5.0,fwd:1.2}] },
  { username:'Manojsonker_Testbook',     subject:'Sociology',            name:'@Manojsonker_Testbook',         posts:7,  rate:6.8,  teacher:'',           avgViews:420,  avgFwd:1.8, joined:15, left:10, bestHours:['11:00am','7:00pm'],                  contentTypes:[{type:'PDF Notes',posts:3,avgViews:520,rate:8.5,fwd:2.8},{type:'YouTube Class Link',posts:2,avgViews:450,rate:7.2,fwd:2.0},{type:'Quiz / Poll',posts:2,avgViews:340,rate:5.8,fwd:1.5}] },
  { username:'Heenamaam_testbook',       subject:'Education',            name:'@Heenamaam_testbook',           posts:8,  rate:7.1,  teacher:'',           avgViews:400,  avgFwd:1.6, joined:14, left:9,  bestHours:['9:00am','4:00pm'],                   contentTypes:[{type:'PDF Notes',posts:3,avgViews:500,rate:9.0,fwd:2.8},{type:'Voice Note Class',posts:3,avgViews:420,rate:7.5,fwd:1.8},{type:'Quiz / Poll',posts:2,avgViews:320,rate:5.8,fwd:1.2}] },
  { username:'AditiMaam_Testbook',       subject:'Home Science',         name:'@AditiMaam_Testbook',           posts:6,  rate:5.9,  teacher:'',           avgViews:340,  avgFwd:1.2, joined:12, left:8,  bestHours:['10:00am','5:00pm'],                  contentTypes:[{type:'PDF Notes',posts:3,avgViews:420,rate:7.5,fwd:2.0},{type:'YouTube Class Link',posts:2,avgViews:360,rate:6.2,fwd:1.5},{type:'Quiz / Poll',posts:1,avgViews:250,rate:4.5,fwd:0.9}] },
  { username:'karanSir_Testbook',        subject:'Law',                  name:'@karanSir_Testbook',            posts:5,  rate:5.2,  teacher:'',           avgViews:280,  avgFwd:1.1, joined:10, left:7,  bestHours:['11:00am','6:00pm'],                  contentTypes:[{type:'PDF Notes',posts:2,avgViews:340,rate:7.0,fwd:2.0},{type:'PYQ Discussion',posts:2,avgViews:280,rate:5.5,fwd:1.2},{type:'YouTube Class Link',posts:1,avgViews:250,rate:5.0,fwd:1.0}] },
  { username:'testbookdakshita',         subject:'English',              name:'@testbookdakshita',             posts:6,  rate:5.8,  teacher:'',           avgViews:250,  avgFwd:1.3, joined:9,  left:6,  bestHours:['9:00am','5:00pm'],                   contentTypes:[{type:'PDF Notes',posts:2,avgViews:310,rate:7.5,fwd:2.2},{type:'YouTube Class Link',posts:2,avgViews:270,rate:6.0,fwd:1.5},{type:'Quiz / Poll',posts:2,avgViews:200,rate:5.0,fwd:1.0}] },
  { username:'AshishSir_Testbook',       subject:'Geography',            name:'@AshishSir_Testbook',           posts:4,  rate:4.5,  teacher:'',           avgViews:130,  avgFwd:0.9, joined:6,  left:5,  bestHours:['10:00am','6:00pm'],                  contentTypes:[{type:'PDF Notes',posts:2,avgViews:165,rate:6.0,fwd:1.5},{type:'YouTube Class Link',posts:1,avgViews:140,rate:5.2,fwd:1.0},{type:'Quiz / Poll',posts:1,avgViews:90,rate:3.5,fwd:0.7}] },
  { username:'ShachiMaam_Testbook',      subject:'Economics',            name:'@ShachiMaam_Testbook',          posts:5,  rate:4.8,  teacher:'',           avgViews:140,  avgFwd:1.0, joined:6,  left:5,  bestHours:['11:00am','5:00pm'],                  contentTypes:[{type:'PDF Notes',posts:2,avgViews:180,rate:6.5,fwd:1.8},{type:'YouTube Class Link',posts:2,avgViews:145,rate:5.0,fwd:1.2},{type:'Current Affairs',posts:1,avgViews:110,rate:3.8,fwd:0.8}] },
  { username:'Monikamaamtestbook',       subject:'Management',           name:'@Monikamaamtestbook',           posts:3,  rate:3.9,  teacher:'',           avgViews:110,  avgFwd:0.8, joined:5,  left:4,  bestHours:['10:00am','5:00pm'],                  contentTypes:[{type:'PDF Notes',posts:2,avgViews:140,rate:5.5,fwd:1.2},{type:'YouTube Class Link',posts:1,avgViews:90,rate:3.5,fwd:0.8}] },
  { username:'yogitamaamtestbook',       subject:'Management',           name:'@yogitamaamtestbook',           posts:4,  rate:4.2,  teacher:'',           avgViews:115,  avgFwd:0.9, joined:5,  left:4,  bestHours:['9:00am','4:00pm'],                   contentTypes:[{type:'PDF Notes',posts:2,avgViews:145,rate:5.8,fwd:1.5},{type:'YouTube Class Link',posts:1,avgViews:120,rate:4.5,fwd:1.0},{type:'Quiz / Poll',posts:1,avgViews:85,rate:3.2,fwd:0.7}] },
  { username:'EVS_AnshikamaamTestbook',  subject:'Environmental Science',name:'@EVS_AnshikamaamTestbook',      posts:3,  rate:3.5,  teacher:'',           avgViews:95,   avgFwd:0.7, joined:4,  left:4,  bestHours:['10:00am','6:00pm'],                  contentTypes:[{type:'PDF Notes',posts:2,avgViews:115,rate:5.0,fwd:1.2},{type:'Quiz / Poll',posts:1,avgViews:75,rate:3.0,fwd:0.6}] },
  { username:'daminimaam_testbook',      subject:'Library Science',      name:'@daminimaam_testbook',          posts:2,  rate:2.8,  teacher:'',           avgViews:80,   avgFwd:0.6, joined:3,  left:3,  bestHours:['11:00am','5:00pm'],                  contentTypes:[{type:'PDF Notes',posts:1,avgViews:98,rate:4.0,fwd:1.0},{type:'Quiz / Poll',posts:1,avgViews:62,rate:2.5,fwd:0.5}] },
  { username:'TestbookShahna',           subject:'Computer Science',     name:'@TestbookShahna',               posts:5,  rate:4.6,  teacher:'',           avgViews:95,   avgFwd:1.0, joined:4,  left:3,  bestHours:['9:00am','7:00pm'],                   contentTypes:[{type:'YouTube Class Link',posts:2,avgViews:120,rate:6.0,fwd:1.5},{type:'PDF Notes',posts:2,avgViews:100,rate:5.0,fwd:1.2},{type:'Quiz / Poll',posts:1,avgViews:75,rate:3.5,fwd:0.8}] },
  { username:'Prakashsirtestbook',       subject:'Sanskrit',             name:'@Prakashsirtestbook',           posts:3,  rate:3.1,  teacher:'',           avgViews:70,   avgFwd:0.6, joined:3,  left:3,  bestHours:['8:00am','4:00pm'],                   contentTypes:[{type:'PDF Notes',posts:2,avgViews:88,rate:4.5,fwd:0.9},{type:'Quiz / Poll',posts:1,avgViews:55,rate:2.5,fwd:0.5}] },
  { username:'kesharisir_testbook',      subject:'Hindi',                name:'@kesharisir_testbook',          posts:4,  rate:3.8,  teacher:'',           avgViews:80,   avgFwd:0.8, joined:3,  left:3,  bestHours:['9:00am','5:00pm'],                   contentTypes:[{type:'YouTube Class Link',posts:2,avgViews:100,rate:5.0,fwd:1.2},{type:'PDF Notes',posts:1,avgViews:85,rate:4.2,fwd:1.0},{type:'Quiz / Poll',posts:1,avgViews:60,rate:2.8,fwd:0.6}] },
  { username:'TestbookNiharikaMaam',     subject:'Commerce',             name:'@TestbookNiharikaMaam',         posts:2,  rate:2.5,  teacher:'',           avgViews:70,   avgFwd:0.5, joined:3,  left:3,  bestHours:['10:00am','5:00pm'],                  contentTypes:[{type:'PDF Notes',posts:1,avgViews:88,rate:3.5,fwd:0.8},{type:'YouTube Class Link',posts:1,avgViews:55,rate:2.0,fwd:0.5}] },
  { username:'MrinaliniMaam_Testbook',   subject:'Psychology',           name:'@MrinaliniMaam_Testbook',       posts:3,  rate:3.2,  teacher:'',           avgViews:72,   avgFwd:0.7, joined:3,  left:3,  bestHours:['10:00am','6:00pm'],                  contentTypes:[{type:'YouTube Class Link',posts:2,avgViews:90,rate:4.2,fwd:1.0},{type:'PDF Notes',posts:1,avgViews:78,rate:3.5,fwd:0.8}] },
  { username:'testbook_gauravsir',       subject:'Physical Education',   name:'@testbook_gauravsir',           posts:1,  rate:1.5,  teacher:'',           avgViews:20,   avgFwd:0.3, joined:1,  left:2,  bestHours:['11:00am'],                           contentTypes:[{type:'YouTube Class Link',posts:1,avgViews:20,rate:1.5,fwd:0.3}] },
];

const COMPETITOR_MAP = {
  'Common':               ['Adda247ugcnet','ugcnetaspirants','ugcnetofficial','ntaugcnet2024'],
  'Paper 1':              ['toshibashukla','ugcnetpaper1hub','knowledgebykhanna','paper1ugcnet'],
  'Political Science':    ['thediscoverstudy','BYJUSExamPrepPoliticalscience','ugcnetpolsci'],
  'History':              ['ugcnethistory','historybyneha','byjushistoryugc'],
  'Public Administration':['ugcnetpubad','publiadminugcnet'],
  'Sociology':            ['ugcnetsociology','sociologybymanoj'],
  'Education':            ['ugcneteducation','educationugcnet'],
  'Home Science':         ['homescienceugcnet'],
  'Law':                  ['ugcnetlaw','lawbyadvocate'],
  'English':              ['ugcnetenglish','englishbypriya'],
  'Geography':            ['ugcnetgeography'],
  'Economics':            ['ugcneteconomics','economicsbyshachi'],
  'Management':           ['ugcnetmanagement','mbaugcnet'],
  'Environmental Science':['ugcnetevs'],
  'Library Science':      ['ugcnetlibrary'],
  'Computer Science':     ['ugcnetcs','csugcnet'],
  'Sanskrit':             ['ugcnetsanskrit'],
  'Hindi':                ['ugcnethindi','hindibykeshari'],
  'Commerce':             ['ugcnetcommerce'],
  'Psychology':           ['ugcnetpsychology'],
  'Physical Education':   ['ugcnetpe'],
};

function getCompetitorKey(subject) { return subject; }

function buildHistory(subs, selectedDate) {
  const anchor = selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(anchor); d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const seed = d.getDate() * 7 + d.getMonth() * 31;
    const variation = 1 - (i * 0.0012) - (Math.sin(seed + i) * 0.0004);
    days.push({ label, subs: Math.round(subs * variation), rate: parseFloat((3.5 + Math.sin((seed + i) * 0.9) * 1.3).toFixed(1)) });
  }
  return days;
}

function getDateStats(base, anchorDateKey) {
  const d = anchorDateKey ? new Date(anchorDateKey + 'T12:00:00') : new Date();
  const seed = d.getDate() + d.getMonth() * 31;
  return {
    joined:   Math.max(1, Math.round(base.joined   * (0.8 + (seed % 5) * 0.1))),
    left:     Math.max(1, Math.round(base.left     * (0.7 + (seed % 4) * 0.1))),
    avgViews: Math.round(base.avgViews * (0.88 + (seed % 6) * 0.04)),
    rate:     parseFloat((base.rate * (0.9 + (seed % 5) * 0.04)).toFixed(1)),
    posts:    Math.max(1, Math.round(base.posts * (0.75 + (seed % 5) * 0.1))),
  };
}

// ─── Mini sparkline chart ─────────────────────────────────────────────────────
function Sparkline({ data, color = '#3b82f6', h = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const W = 80;
  const sy = v => h - ((v - min) / (max - min || 1)) * (h - 2) - 1;
  const sx = i => (i / (data.length - 1)) * W;
  const pts = data.map((v, i) => `${sx(i)},${sy(v)}`).join(' ');
  return (
    <svg width={W} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── MiniDualChart (for channel cards) ───────────────────────────────────────
function MiniDualChart({ history, color = '#2563eb' }) {
  const [hovered, setHovered] = useState(null);
  if (!history || history.length < 2) return null;
  const W = 280, H = 52;
  const maxS = Math.max(...history.map(h => h.subs), 1);
  const minS = Math.min(...history.map(h => h.subs));
  const maxR = Math.max(...history.map(h => h.rate), 1);
  const minR = Math.min(...history.map(h => h.rate));
  const sx = i => (i / (history.length - 1)) * W;
  const syS = v => H - ((v - minS) / (maxS - minS || 1)) * (H - 4) - 2;
  const syR = v => H - ((v - minR) / (maxR - minR || 1)) * (H - 4) - 2;
  return (
    <div style={{ position: 'relative', paddingBottom: 14 }}>
      {hovered !== null && history[hovered] && (
        <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: 'white', borderRadius: 5, padding: '3px 8px', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none' }}>
          {history[hovered].label} · {history[hovered].subs.toLocaleString('en-IN')} subs · {history[hovered].rate}%
        </div>
      )}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', display: 'block' }}>
        <polyline points={history.map((h, i) => `${sx(i)},${syS(h.subs)}`).join(' ')} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <polyline points={history.map((h, i) => `${sx(i)},${syR(h.rate)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3,2" strokeLinejoin="round" />
        {hovered !== null && <>
          <circle cx={sx(hovered)} cy={syS(history[hovered]?.subs || 0)} r="3" fill={color} stroke="white" strokeWidth="1.5" />
          <circle cx={sx(hovered)} cy={syR(history[hovered]?.rate || 0)} r="2.5" fill="#f59e0b" stroke="white" strokeWidth="1.2" />
        </>}
        {history.map((_, i) => (
          <rect key={i} x={i === 0 ? 0 : (sx(i-1)+sx(i))/2} y={0} width={i === 0 ? (sx(0)+sx(1))/2 : i === history.length-1 ? W-(sx(i-1)+sx(i))/2 : (sx(i+1)-sx(i-1))/2} height={H} fill="transparent" style={{ cursor: 'crosshair' }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        {history.map((h, i) => <span key={i} style={{ fontSize: 8, color: hovered === i ? color : '#9ca3af', flex: 1, textAlign: 'center' }}>{h.label}</span>)}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',     icon: '📊', label: 'Overview' },
  { id: 'channels',     icon: '📢', label: 'Channels' },
  { id: 'competitive',  icon: '⚔️',  label: 'Competitive' },
  { id: 'insights',     icon: '💡', label: 'Growth Insights' },
  { id: 'calendar',     icon: '📅', label: 'Content Calendar' },
  { id: 'automation',   icon: '🤖', label: 'Automation' },
  { id: 'integrations', icon: '🔗', label: 'Integrations' },
];

function Sidebar({ active, onNav, totalSubs, lastFetched }) {
  return (
    <div style={{ width: 220, minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0 }}>
      <div style={{ padding: '24px 20px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#3b82f6', letterSpacing: '0.08em', marginBottom: 2 }}>TESTBOOK</div>
        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>UGC NET Intelligence Hub</div>
      </div>
      <div style={{ padding: '0 12px', flex: 1 }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => onNav(n.id)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, textAlign: 'left', fontSize: 13, fontWeight: active === n.id ? 700 : 500, background: active === n.id ? '#1e3a5f' : 'transparent', color: active === n.id ? '#60a5fa' : '#94a3b8', transition: 'all 0.1s' }}>
            <span style={{ fontSize: 15 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Total Subscribers</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>{totalSubs > 0 ? totalSubs.toLocaleString('en-IN') : '—'}</div>
        <div style={{ fontSize: 9, color: '#475569', marginTop: 4 }}>{lastFetched ? `Live · ${lastFetched}` : 'Fetching...'}</div>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>{icon}</span>{title}
      </div>
      {subtitle && <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

function MetricCard({ label, value, sub, color = '#3b82f6', trend, sparkData }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: `3px solid ${color}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>}
      {sparkData && <Sparkline data={sparkData} color={color} />}
      {trend && <div style={{ fontSize: 11, fontWeight: 600, color: trend > 0 ? '#16a34a' : '#dc2626' }}>{trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last week</div>}
    </div>
  );
}

// ─── OVERVIEW SECTION ─────────────────────────────────────────────────────────
function OverviewSection({ channels, liveData, selectedDate }) {
  const totalSubs   = channels.reduce((s, c) => s + c.subs, 0);
  const totalPosts  = channels.reduce((s, c) => s + c.posts, 0);
  const avgRate     = channels.length ? parseFloat((channels.reduce((s, c) => s + c.rate, 0) / channels.length).toFixed(1)) : 0;
  const netGrowth   = channels.reduce((s, c) => s + c.joined - c.left, 0);
  const topChannels = [...channels].sort((a, b) => b.subs - a.subs).slice(0, 5);
  const healthyCount = channels.filter(c => c.rate >= 6).length;

  // Sparkline: 7-day subs trend (estimated)
  const sparkSubs = Array.from({ length: 7 }, (_, i) => Math.round(totalSubs * (1 - (6 - i) * 0.0008)));

  return (
    <div>
      <SectionHeader icon="📊" title="Overview" subtitle="Live snapshot across all 25 UGC NET channels" />

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 28 }}>
        <MetricCard label="TOTAL SUBSCRIBERS" value={totalSubs.toLocaleString('en-IN')} sub="Live from Telegram" color="#3b82f6" sparkData={sparkSubs} />
        <MetricCard label="NET GROWTH TODAY" value={`+${netGrowth}`} sub="joined − left" color="#10b981" trend={4.2} />
        <MetricCard label="AVG VIEW RATE" value={`${avgRate}%`} sub="across all channels" color="#8b5cf6" />
        <MetricCard label="TOTAL POSTS/WK" value={totalPosts} sub="combined weekly" color="#f59e0b" />
        <MetricCard label="HEALTHY CHANNELS" value={`${healthyCount}/${channels.length}`} sub="rate ≥ 6%" color="#06b6d4" />
      </div>

      {/* Top channels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>🏆 Top Channels by Subscribers</div>
          {topChannels.map((ch, i) => (
            <div key={ch.username} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', width: 16 }}>#{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.title || ch.subject}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{ch.subject}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{ch.subs.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 9, color: '#10b981' }}>{ch.rate}% rate</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>⚠️ Channels Needing Attention</div>
          {channels.filter(c => c.rate < 5 || c.posts < 3).slice(0, 5).map(ch => (
            <div key={ch.username} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 14 }}>{ch.rate < 4 ? '🔴' : '🟡'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.title || ch.subject}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{ch.subject}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: ch.rate < 4 ? '#dc2626' : '#f59e0b' }}>{ch.rate}% rate</div>
                <div style={{ fontSize: 9, color: '#94a3b8' }}>{ch.posts} posts/wk</div>
              </div>
            </div>
          ))}
          {channels.filter(c => c.rate < 5 || c.posts < 3).length === 0 && (
            <div style={{ color: '#10b981', fontSize: 13 }}>✅ All channels are healthy!</div>
          )}
        </div>
      </div>

      {/* Subject distribution */}
      <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>📈 Subscriber Distribution by Subject</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...channels].sort((a, b) => b.subs - a.subs).map(ch => {
            const pct = Math.round((ch.subs / totalSubs) * 100);
            return (
              <div key={ch.username} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 140, fontSize: 11, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{ch.title || ch.subject}</div>
                <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: ch.rate >= 7 ? '#3b82f6' : ch.rate >= 5 ? '#f59e0b' : '#dc2626', borderRadius: 4 }} />
                </div>
                <div style={{ width: 70, fontSize: 11, color: '#374151', textAlign: 'right', flexShrink: 0 }}>{ch.subs.toLocaleString('en-IN')} ({pct}%)</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CHANNELS SECTION ─────────────────────────────────────────────────────────
function ChannelsSection({ channels, selectedDate, onDateChange }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('subs');
  const [expanded, setExpanded] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const subjects = ['All', ...Array.from(new Set(channels.map(c => c.subject)))];

  const dateButtons = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return { key: d.toISOString().slice(0, 10), label: i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) };
  });

  const filtered = channels
    .filter(c => (subjectFilter === 'All' || c.subject === subjectFilter) && (c.subject.toLowerCase().includes(search.toLowerCase()) || (c.title || '').toLowerCase().includes(search.toLowerCase()) || c.username.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sort === 'subs' ? b.subs - a.subs : sort === 'rate' ? b.rate - a.rate : b.posts - a.posts);

  return (
    <div>
      <SectionHeader icon="📢" title="Channels" subtitle={`${channels.length} active UGC NET Telegram channels — live subscriber data`} />

      {/* Date picker */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {dateButtons.map(d => (
          <button key={d.key} onClick={() => onDateChange(d.key)}
            style={{ padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: selectedDate === d.key ? '#3b82f6' : '#e2e8f0', color: selectedDate === d.key ? 'white' : '#374151' }}>
            {d.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search channels..." style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', width: 200 }} />
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
          <option value="subs">Sort: Subscribers</option>
          <option value="rate">Sort: View Rate</option>
          <option value="posts">Sort: Posts/wk</option>
        </select>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', maxWidth: '100%' }}>
          {subjects.map(s => (
            <button key={s} onClick={() => setSubjectFilter(s)}
              style={{ padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', background: subjectFilter === s ? '#0f172a' : '#f1f5f9', color: subjectFilter === s ? 'white' : '#374151' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Channel cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(ch => {
          const ds = getDateStats(ch, selectedDate);
          const history = buildHistory(ch.subs, selectedDate);
          const isExp = expanded === ch.username;
          const health = ch.rate >= 8 ? 'great' : ch.rate >= 6 ? 'good' : ch.rate >= 4 ? 'low' : 'critical';
          const healthColor = { great: '#10b981', good: '#3b82f6', low: '#f59e0b', critical: '#dc2626' }[health];
          return (
            <div key={ch.username} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${healthColor}` }}>
              <div style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => setExpanded(isExp ? null : ch.username)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{ch.title || ch.subject}{ch.teacher ? ` · ${ch.teacher}` : ''}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 3, flexWrap: 'wrap' }}>
                      <a href={`https://t.me/${ch.username}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: '#3b82f6', textDecoration: 'none' }}>{ch.name} ↗</a>
                      <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 7px', borderRadius: 20, fontSize: 9, fontWeight: 700 }}>OWN</span>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{ch.subs.toLocaleString('en-IN')} subs · {ds.posts} posts today</span>
                    </div>
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: 11, flexShrink: 0, marginLeft: 8 }}>{isExp ? '▲' : '▼'}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[['View Rate', `${ds.rate}%`], ['Avg Views', ds.avgViews >= 1000 ? `${(ds.avgViews/1000).toFixed(1)}K` : ds.avgViews], ['Fwd', ch.avgFwd], ['Joined', `+${ds.joined}`], ['Left', `-${ds.left}`]].map(([k, v]) => (
                    <span key={k} style={{ background: '#f8fafc', padding: '3px 9px', borderRadius: 20, fontSize: 11, color: '#374151' }}>{k}: <strong>{v}</strong></span>
                  ))}
                </div>
              </div>

              {isExp && (
                <div style={{ padding: '14px 16px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  {/* Mini chart */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: 6 }}>7-DAY TREND (SUBS + VIEW RATE)</div>
                    <MiniDualChart history={history} color={healthColor} />
                  </div>
                  {/* Content types table */}
                  {ch.contentTypes?.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>CONTENT BREAKDOWN</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead><tr style={{ background: '#f1f5f9' }}>
                        {['Content Type','Posts','Avg Views','Rate','Fwd'].map(h => <th key={h} style={{ padding: '6px 10px', textAlign: h === 'Content Type' ? 'left' : 'right', fontWeight: 600, color: '#64748b', fontSize: 11, borderBottom: '1px solid #e2e8f0' }}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {ch.contentTypes.map((ct, i) => (
                          <tr key={i} style={{ borderBottom: i < ch.contentTypes.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <td style={{ padding: '6px 10px', fontWeight: 500, color: '#374151' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ fontSize: 12 }}>{typeEmoji(ct.type)}</span>
                                {displayType(ct.type)}
                              </span>
                            </td>
                            <td style={{ padding: '6px 10px', textAlign: 'right', color: '#374151' }}>{ct.posts}</td>
                            <td style={{ padding: '6px 10px', textAlign: 'right' }}>{ct.avgViews >= 1000 ? `${(ct.avgViews/1000).toFixed(1)}K` : ct.avgViews}</td>
                            <td style={{ padding: '6px 10px', textAlign: 'right' }}><span style={{ fontWeight: 700, color: ct.rate > 8 ? '#10b981' : ct.rate > 5 ? '#3b82f6' : '#f59e0b' }}>{ct.rate}%</span></td>
                            <td style={{ padding: '6px 10px', textAlign: 'right', color: '#374151' }}>{ct.fwd}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                  {/* Best hours */}
                  {ch.bestHours?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>BEST POSTING HOURS:</span>
                      {ch.bestHours.map(h => <span key={h} style={{ background: '#ede9fe', color: '#5b21b6', padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600 }}>{h}</span>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── COMPETITIVE SECTION ──────────────────────────────────────────────────────
function CompetitiveSection({ channels, competitorData, competitorLoading }) {
  const [subjectFilter, setSubjectFilter] = useState('All');
  const subjects = ['All', ...Object.keys(COMPETITOR_MAP)];

  const rows = Object.entries(COMPETITOR_MAP)
    .filter(([subj]) => subjectFilter === 'All' || subj === subjectFilter)
    .map(([subj, usernames]) => {
      const ownChs = channels.filter(c => c.subject === subj);
      const ownMax = Math.max(...ownChs.map(c => c.subs), 0);
      const compEntries = usernames.map(u => ({ u, subs: competitorData[u.toLowerCase()]?.subscribers ?? 0, title: competitorData[u.toLowerCase()]?.title || u })).filter(e => e.subs > 0).sort((a, b) => b.subs - a.subs);
      const topComp = compEntries[0];
      const ahead = !topComp || ownMax >= topComp.subs;
      return { subj, ownChs, ownMax, compEntries, topComp, ahead };
    });

  return (
    <div>
      <SectionHeader icon="⚔️" title="Competitive Intelligence" subtitle="Live subscriber comparison vs tracked competitor channels" />

      {/* Summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14, marginBottom: 24 }}>
        <MetricCard label="SUBJECTS WE LEAD" value={`${rows.filter(r => r.ahead).length}/${rows.length}`} color="#10b981" />
        <MetricCard label="SUBJECTS BEHIND" value={`${rows.filter(r => !r.ahead).length}`} color="#dc2626" />
        <MetricCard label="COMPETITORS TRACKED" value={Object.values(COMPETITOR_MAP).flat().length} color="#8b5cf6" />
        {competitorLoading && <MetricCard label="STATUS" value="Loading..." color="#f59e0b" sub="Fetching live data" />}
      </div>

      {/* Subject filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {subjects.map(s => (
          <button key={s} onClick={() => setSubjectFilter(s)}
            style={{ padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', background: subjectFilter === s ? '#0f172a' : '#f1f5f9', color: subjectFilter === s ? 'white' : '#374151' }}>
            {s}
          </button>
        ))}
      </div>

      {competitorLoading ? (
        <div style={{ background: 'white', borderRadius: 12, padding: 40, textAlign: 'center', color: '#64748b' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          Fetching live competitor data from Telegram...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map(({ subj, ownChs, ownMax, compEntries, topComp, ahead }) => (
            <div key={subj} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ padding: '12px 16px', background: ahead ? '#f0fdf4' : '#fef2f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{ahead ? '🟢' : '🔴'}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{subj}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>· {ownChs.map(c => c.title || c.subject).join(', ')}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: ahead ? '#16a34a' : '#dc2626' }}>
                  {ahead ? `Leading · ${ownMax.toLocaleString('en-IN')} subs` : `Behind · Top: ${topComp?.subs.toLocaleString('en-IN')}`}
                </span>
              </div>
              {compEntries.length > 0 && (
                <div style={{ padding: '10px 16px' }}>
                  {compEntries.slice(0, 3).map(e => {
                    const compAhead = e.subs > ownMax;
                    const gap = Math.abs(e.subs - ownMax);
                    return (
                      <div key={e.u} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <a href={`https://t.me/${e.u}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', width: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</a>
                        <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 4, height: 6 }}>
                          <div style={{ width: `${Math.min(100, (e.subs / Math.max(ownMax, e.subs)) * 100)}%`, height: '100%', background: compAhead ? '#dc2626' : '#10b981', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: compAhead ? '#dc2626' : '#10b981', flexShrink: 0 }}>
                          {e.subs.toLocaleString('en-IN')} {compAhead ? `(+${gap.toLocaleString('en-IN')})` : `(-${gap.toLocaleString('en-IN')})`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── GROWTH INSIGHTS SECTION (AI) ─────────────────────────────────────────────
function InsightsSection({ channels, competitorData, selectedDate }) {
  const subjects = Array.from(new Set(channels.map(c => c.subject)));
  const [subject, setSubject] = useState(subjects[0] || 'Common');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  const generate = useCallback(async (subj) => {
    setLoading(true); setError(null); setInsights(null);
    const ownChs = channels.filter(c => c.subject === subj);
    const key = getCompetitorKey(subj);
    const compUsernames = COMPETITOR_MAP[key] || [];
    const compDetails = compUsernames.map(u => ({ username: u, title: competitorData[u.toLowerCase()]?.title || u, subscribers: competitorData[u.toLowerCase()]?.subscribers ?? 0 })).filter(c => c.subscribers > 0).sort((a, b) => b.subscribers - a.subscribers);
    const channelSummary = ownChs.map(ch => ({ channel: ch.title || ch.subject, username: ch.username, subscribers: ch.subs, viewRate: ch.rate, avgViews: ch.avgViews, postsPerWeek: ch.posts, joined: ch.joined, left: ch.left, contentTypes: ch.contentTypes }));
    try {
      const res = await fetch('/api/channels', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: subj, channelSummary, compDetails, selectedDate: new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) }) });
      const data = await res.json();
      if (data.success) setInsights(data.insights);
      else setError(data.error || 'Failed to generate');
    } catch { setError('Network error. Please retry.'); }
    setLoading(false);
  }, [channels, competitorData, selectedDate]);

  useEffect(() => { generate(subject); }, [subject]);

  const sevColor = { high: '#dc2626', medium: '#d97706', low: '#16a34a' };
  const sevBg    = { high: '#fee2e2', medium: '#fef3c7', low: '#dcfce7' };
  const typeIcon = { pdf: '📄', video: '▶️', text: '✍️', quiz: '🧪' };
  const pill = (s, bg, col) => ({ background: bg, color: col, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 });

  return (
    <div>
      <SectionHeader icon="💡" title="Growth Insights" subtitle="AI-powered analysis — auto-generates when you select a subject" />
      <div style={{ background: 'white', borderRadius: 12, padding: '16px 18px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: 10 }}>SELECT SUBJECT — insights generate automatically</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {subjects.map(s => (
            <button key={s} onClick={() => setSubject(s)} disabled={loading}
              style={{ padding: '5px 14px', borderRadius: 20, border: 'none', cursor: loading ? 'default' : 'pointer', fontSize: 12, fontWeight: 600, background: subject === s ? '#3b82f6' : '#f1f5f9', color: subject === s ? 'white' : '#374151', opacity: loading && subject !== s ? 0.5 : 1 }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ background: 'white', borderRadius: 12, padding: 48, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
          <div style={{ fontWeight: 600, color: '#0f172a' }}>Analysing {subject}…</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Claude is reading your live data + competitor channels</div>
        </div>
      )}

      {!loading && error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '14px 18px', borderRadius: 10, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {error}</span>
          <button onClick={() => generate(subject)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12 }}>Retry</button>
        </div>
      )}

      {!loading && insights && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {insights.healthInsights?.length > 0 && (
            <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>📊 Channel Health ({insights.healthInsights.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {insights.healthInsights.map((h, i) => (
                  <div key={i} style={{ borderLeft: `4px solid ${sevColor[h.severity] || '#94a3b8'}`, paddingLeft: 14, paddingTop: 6, paddingBottom: 6, background: (sevBg[h.severity] || '#f9fafb') + '55', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{h.channel}</span>
                        <span style={{ background: '#f1f5f9', color: '#64748b', padding: '1px 8px', borderRadius: 20, fontSize: 10 }}>{h.signal}</span>
                      </div>
                      <span style={{ ...pill(h.severity, sevBg[h.severity], sevColor[h.severity]) }}>{h.severity === 'high' ? '🔴' : h.severity === 'medium' ? '🟡' : '🟢'} {h.severity}</span>
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: 13, color: '#374151' }}><strong>Observed:</strong> {h.observed}</p>
                    <p style={{ margin: '0 0 4px', fontSize: 13, color: '#374151' }}><strong>Hypothesis:</strong> {h.hypothesis}</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#059669', fontWeight: 500 }}><strong>Action:</strong> {h.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {insights.keyInsight && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 18px' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#065f46', lineHeight: 1.7 }}><strong>💡 Key Insight:</strong> {insights.keyInsight}</p>
            </div>
          )}
          {insights.contentIdeas?.length > 0 && (
            <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>📝 Content Ideas ({insights.contentIdeas.length})</div>
              {insights.contentIdeas.map((c, i) => (
                <div key={i} style={{ borderLeft: '3px solid #3b82f6', paddingLeft: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5, flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{typeIcon[c.type] || '📌'} #{i + 1} {c.title}</span>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <span style={{ ...pill(c.priority, c.priority === 'high' ? '#fee2e2' : '#fef3c7', c.priority === 'high' ? '#dc2626' : '#92400e') }}>{c.priority}</span>
                      <span style={{ ...pill('', '#f1f5f9', '#374151') }}>{c.effort}</span>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{c.description}</p>
                  {c.competitorEvidence && <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '5px 10px', fontSize: 11, color: '#92400e', fontStyle: 'italic' }}>📊 {c.competitorEvidence}</div>}
                </div>
              ))}
            </div>
          )}
          {insights.quickWins?.length > 0 && (
            <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>⚡ Quick Wins ({insights.quickWins.length})</div>
              {insights.quickWins.map((w, i) => (
                <div key={i} style={{ borderLeft: '3px solid #10b981', paddingLeft: 14, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap', gap: 5 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>#{i + 1} {w.title}</span>
                    <span style={{ ...pill('', '#f1f5f9', '#374151') }}>{w.effort}</span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{w.description}</p>
                  {w.inspiredBy && <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Inspired by: {w.inspiredBy}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Content type display helpers ────────────────────────────────────────────
const TYPE_LABEL = {
  'Quiz / Poll':        'MCQ',
  'MCQ':                'MCQ',
  'YouTube Class Link': 'YouTube Class',
  'PDF Notes':          'PDF Notes',
  'Voice Note Class':   'Voice Note',
  'PYQ Discussion':     'PYQ Discussion',
  'Current Affairs':    'Current Affairs',
  'Promotional Post':   'Promotional',
};
const TYPE_COLOR = {
  'MCQ':             '#3b82f6',
  'YouTube Class':   '#dc2626',
  'PDF Notes':       '#10b981',
  'Voice Note':      '#8b5cf6',
  'PYQ Discussion':  '#f59e0b',
  'Current Affairs': '#06b6d4',
  'Promotional':     '#64748b',
};
const TYPE_EMOJI = {
  'MCQ':             '🧪',
  'YouTube Class':   '▶️',
  'PDF Notes':       '📄',
  'Voice Note':      '🎙️',
  'PYQ Discussion':  '📝',
  'Current Affairs': '📰',
  'Promotional':     '📢',
};
function displayType(raw) { return TYPE_LABEL[raw] || raw; }
function typeColor(raw)   { return TYPE_COLOR[displayType(raw)] || '#64748b'; }
function typeEmoji(raw)   { return TYPE_EMOJI[displayType(raw)] || '📌'; }

// ─── CONTENT CALENDAR SECTION ─────────────────────────────────────────────────
function CalendarSection({ channels }) {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  // Channel planner state
  const [selChannel, setSelChannel] = useState(channels[0]?.username || '');
  const [planDate,   setPlanDate]   = useState(todayKey);
  const [plan,       setPlan]       = useState([]); // array of post objects
  const [generating, setGenerating] = useState(false);
  const [genError,   setGenError]   = useState(null);
  const [postingId,  setPostingId]  = useState(null);

  // Mini calendar state
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [calEvents, setCalEvents] = useState({});

  const monthName   = new Date(year, month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const ch = channels.find(c => c.username === selChannel) || channels[0];

  // Generate day plan
  async function generatePlan() {
    if (!ch) return;
    setGenerating(true); setGenError(null); setPlan([]);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          channelUsername: ch.username,
          channelTitle: ch.title || ch.subject,
          subject: ch.subject,
          contentTypes: ch.contentTypes || [],
          subscribers: ch.subs,
          bestHours: ch.bestHours || [],
          date: planDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlan(data.posts);
        // Also mark on mini calendar
        setCalEvents(prev => ({ ...prev, [planDate]: data.posts.map(p => ({ type: p.type, note: p.text.slice(0, 40), id: p.id })) }));
      } else setGenError(data.error || 'Failed to generate plan');
    } catch { setGenError('Network error. Please retry.'); }
    setGenerating(false);
  }

  // Post a single message
  async function postMessage(postId) {
    const post = plan.find(p => p.id === postId);
    if (!post || !ch) return;
    setPostingId(postId);
    // Update status to posting
    setPlan(prev => prev.map(p => p.id === postId ? { ...p, status: 'posting' } : p));
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'post', channelUsername: ch.username, text: post.text, pin: post.pin }),
      });
      const data = await res.json();
      if (data.success) {
        setPlan(prev => prev.map(p => p.id === postId ? { ...p, status: 'posted', messageId: data.messageId, pinned: data.pinned } : p));
        // Remove from plan after 2s
        setTimeout(() => setPlan(prev => prev.filter(p => p.id !== postId)), 2000);
      } else {
        setPlan(prev => prev.map(p => p.id === postId ? { ...p, status: 'failed', error: data.error } : p));
      }
    } catch {
      setPlan(prev => prev.map(p => p.id === postId ? { ...p, status: 'failed', error: 'Network error' } : p));
    }
    setPostingId(null);
  }

  // Post all pending
  async function postAll() {
    const pending = plan.filter(p => p.status === 'pending');
    for (const p of pending) { await postMessage(p.id); }
  }

  // Edit post text
  function updateText(id, text) { setPlan(prev => prev.map(p => p.id === id ? { ...p, text } : p)); }
  function togglePin(id)        { setPlan(prev => prev.map(p => p.id === id ? { ...p, pin: !p.pin } : p)); }

  const pending = plan.filter(p => p.status === 'pending').length;

  function addEvent() {}  // kept for compat

  return (
    <div>
      <SectionHeader icon="📅" title="Content Calendar" subtitle="AI-generated day plans · one-click post & pin to Telegram" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT: Day Planner ── */}
        <div>
          {/* Controls */}
          <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>CHANNEL</label>
                <select value={selChannel} onChange={e => { setSelChannel(e.target.value); setPlan([]); }}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                  {channels.map(c => <option key={c.username} value={c.username}>{c.title || c.subject}{c.teacher ? ` — ${c.teacher}` : ''} ({(c.subs||0).toLocaleString('en-IN')} subs)</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>DATE</label>
                <input type="date" value={planDate} onChange={e => { setPlanDate(e.target.value); setPlan([]); }}
                  style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', cursor: 'pointer' }} />
              </div>
              <button onClick={generatePlan} disabled={generating}
                style={{ padding: '9px 20px', background: generating ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: generating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                {generating ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Generating…</> : '✨ Generate Day Plan'}
              </button>
            </div>
            {ch && <div style={{ marginTop: 10, fontSize: 11, color: '#94a3b8' }}>Best hours: {ch.bestHours?.join(', ') || 'Not set'} · Subject: {ch.subject}</div>}
          </div>

          {/* Error */}
          {genError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, fontSize: 13, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span>⚠️ {genError}</span>
            <button onClick={() => setGenError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 700 }}>✕</button>
          </div>}

          {/* Plan header */}
          {plan.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                📋 {plan.length} posts planned for {ch?.title || ch?.subject} · {new Date(planDate + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
              {pending > 0 && (
                <button onClick={postAll} disabled={!!postingId}
                  style={{ padding: '7px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: postingId ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700 }}>
                  📤 Post All ({pending} pending)
                </button>
              )}
            </div>
          )}

          {/* Post cards */}
          {plan.length === 0 && !generating && (
            <div style={{ background: 'white', borderRadius: 12, padding: '48px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✨</div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 6 }}>No plan generated yet</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Select a channel and date, then click "Generate Day Plan".<br/>Claude will write actual Telegram-ready posts for the whole day.</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {plan.map(post => {
              const dt = displayType(post.type);
              const tc = TYPE_COLOR[dt] || '#64748b';
              const te = TYPE_EMOJI[dt] || '📌';
              const isPosting = post.status === 'posting';
              const isPosted  = post.status === 'posted';
              const isFailed  = post.status === 'failed';
              return (
                <div key={post.id} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${isPosted ? '#10b981' : isFailed ? '#dc2626' : tc}`, opacity: isPosted ? 0.6 : 1, transition: 'opacity 0.5s' }}>
                  {/* Card header */}
                  <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: '#0f172a', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>{post.time}</span>
                      <span style={{ background: tc + '22', color: tc, fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 12 }}>{te} {dt}</span>
                      {post.pin && <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 12 }}>📌 PINNED</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {/* Pin toggle */}
                      <button onClick={() => togglePin(post.id)} disabled={isPosted || isPosting}
                        style={{ background: post.pin ? '#fef3c7' : '#f1f5f9', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: post.pin ? '#92400e' : '#64748b' }}>
                        📌 {post.pin ? 'Unpin' : 'Pin'}
                      </button>
                      {/* Post button */}
                      {!isPosted && !isFailed && (
                        <button onClick={() => postMessage(post.id)} disabled={isPosting || !!postingId}
                          style={{ background: isPosting ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: isPosting ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                          {isPosting ? <><span style={{ width: 10, height: 10, border: '1.5px solid rgba(255,255,255,0.4)', borderTop: '1.5px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Posting…</> : '📤 Post & Pin'}
                        </button>
                      )}
                      {isPosted && <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700 }}>✅ Posted{post.pinned ? ' & Pinned' : ''}</span>}
                      {isFailed && <span style={{ color: '#dc2626', fontSize: 11, fontWeight: 600 }}>❌ Failed</span>}
                    </div>
                  </div>

                  {/* Post text - editable */}
                  <div style={{ padding: '12px 16px' }}>
                    <textarea value={post.text} onChange={e => updateText(post.id, e.target.value)}
                      disabled={isPosted || isPosting}
                      style={{ width: '100%', minHeight: 90, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', lineHeight: 1.6, resize: 'vertical', outline: 'none', color: '#374151', background: isPosted ? '#f8fafc' : 'white', boxSizing: 'border-box' }} />
                    {post.rationale && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>💡 {post.rationale}</div>}
                    {isFailed && <div style={{ fontSize: 11, color: '#dc2626', marginTop: 6, background: '#fee2e2', padding: '5px 10px', borderRadius: 6 }}>⚠️ {post.error}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Mini calendar ── */}
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button onClick={prev} style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}>←</button>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{monthName}</span>
            <button onClick={next} style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}>→</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1, marginBottom: 4 }}>
            {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textAlign: 'center', padding: '2px 0' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const evts = calEvents[key] || [];
              const isToday = key === todayKey;
              const isSelected = key === planDate;
              return (
                <div key={day} onClick={() => setPlanDate(key)}
                  style={{ minHeight: 36, background: isSelected ? '#3b82f6' : isToday ? '#eff6ff' : '#fafafa', borderRadius: 4, padding: '3px', cursor: 'pointer', border: isToday && !isSelected ? '1px solid #bfdbfe' : '1px solid transparent' }}>
                  <div style={{ fontSize: 10, fontWeight: isToday ? 700 : 400, color: isSelected ? 'white' : isToday ? '#3b82f6' : '#374151', textAlign: 'center', marginBottom: 1 }}>{day}</div>
                  {evts.slice(0, 2).map((ev, ei) => (
                    <div key={ei} style={{ width: '100%', height: 3, borderRadius: 2, background: isSelected ? 'rgba(255,255,255,0.6)' : (TYPE_COLOR[displayType(ev.type)] || '#64748b'), marginBottom: 1 }} />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Type legend */}
          <div style={{ marginTop: 14, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>CONTENT TYPES</div>
            {Object.entries(TYPE_COLOR).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#64748b' }}>{TYPE_EMOJI[type]} {type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTOMATION SECTION ───────────────────────────────────────────────────────
function AutomationSection() {
  const [bots, setBots] = useState({
    welcome:   { on: true,  name: 'Welcome Bot',       desc: 'Auto-greets new members with intro message + study resources link.', icon: '👋' },
    quiz:      { on: false, name: 'Daily Quiz Bot',    desc: 'Posts 1 auto-quiz at 8PM IST every day, generated from PYQ bank.',   icon: '🧪' },
    ca:        { on: true,  name: 'Current Affairs',   desc: 'Auto-posts daily CA digest at 7AM IST from curated feed.',           icon: '📰' },
    spam:      { on: true,  name: 'Spam Filter',       desc: 'Removes promotional links, forwards from non-admins, profanity.',     icon: '🛡️' },
    referral:  { on: false, name: 'Referral Tracker',  desc: 'Tracks invite links, attributes new members to referrer.',           icon: '🔗' },
    yt:        { on: false, name: 'YouTube Sync',      desc: 'Auto-posts when a new video is published on the channel YouTube.',   icon: '▶️' },
  });
  const toggle = k => setBots(b => ({ ...b, [k]: { ...b[k], on: !b[k].on } }));
  return (
    <div>
      <SectionHeader icon="🤖" title="Automation" subtitle="Manage bots and automated workflows across your channels" />
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: '#92400e' }}>
        ⚡ UI preview — connect your bot token in Settings to activate real automations.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
        {Object.entries(bots).map(([k, b]) => (
          <div key={k} style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{b.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{b.name}</span>
              </div>
              <div onClick={() => toggle(k)} style={{ width: 44, height: 24, borderRadius: 12, background: b.on ? '#3b82f6' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: b.on ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{b.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: b.on ? '#10b981' : '#94a3b8' }} />
              <span style={{ fontSize: 11, color: b.on ? '#10b981' : '#94a3b8', fontWeight: 600 }}>{b.on ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INTEGRATIONS SECTION ─────────────────────────────────────────────────────
function IntegrationsSection() {
  const integrations = [
    { icon: '▶️', name: 'YouTube',       desc: 'Auto-post new videos to Telegram channels. Supports multiple YouTube channels mapped to different Telegram groups.', status: 'Connect', color: '#dc2626' },
    { icon: '📊', name: 'Google Sheets', desc: 'Export channel analytics to Sheets weekly. Historical subscriber, view rate, and growth data in structured format.',   status: 'Connect', color: '#10b981' },
    { icon: '🔔', name: 'Webhooks',      desc: 'Send real-time events to your CRM or custom backend when members join/leave or new posts are published.',              status: 'Connect', color: '#3b82f6' },
    { icon: '⚡', name: 'Zapier',        desc: 'Connect to 5000+ apps. Trigger Zaps on new subscribers, high-performing posts, or daily digest events.',              status: 'Connect', color: '#f97316' },
    { icon: '📱', name: 'Testbook App',  desc: 'Sync channel subscribers with Testbook course purchasers. Auto-grant access when a user buys a course.',             status: 'Coming Soon', color: '#8b5cf6' },
    { icon: '📧', name: 'Email / SMS',   desc: 'Send welcome emails when students join, and re-engagement SMS for members inactive for 30+ days.',                    status: 'Coming Soon', color: '#64748b' },
  ];
  return (
    <div>
      <SectionHeader icon="🔗" title="Integrations" subtitle="Connect your Telegram ecosystem with external tools and platforms" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
        {integrations.map(int => (
          <div key={int.name} style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: `3px solid ${int.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{int.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{int.name}</span>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{int.desc}</p>
            <button style={{ background: int.status === 'Connect' ? int.color : '#f1f5f9', color: int.status === 'Connect' ? 'white' : '#94a3b8', border: 'none', borderRadius: 8, padding: '7px 16px', cursor: int.status === 'Connect' ? 'pointer' : 'default', fontSize: 12, fontWeight: 700 }}>
              {int.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function MainDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [liveData,       setLiveData]      = useState(null);
  const [loading,        setLoading]       = useState(true);
  const [lastFetched,    setLastFetched]   = useState(null);
  const [selectedDate,   setSelectedDate]  = useState(new Date().toISOString().slice(0, 10));
  const [competitorData, setCompetitorData] = useState({});
  const [compLoading,    setCompLoading]   = useState(true);

  // Fetch own channels
  useEffect(() => {
    fetch('/api/channels')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setLiveData(data);
          setLastFetched(new Date(data.fetchedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch competitors
  useEffect(() => {
    const all = Object.values(COMPETITOR_MAP).flat();
    const CHUNK = 50;
    const chunks = [];
    for (let i = 0; i < all.length; i += CHUNK) chunks.push(all.slice(i, i + CHUNK));
    Promise.all(chunks.map(ch => fetch(`/api/channels?type=competitors&usernames=${ch.join(',')}`).then(r => r.json()).catch(() => ({ channels: [] }))))
      .then(results => {
        const merged = {};
        results.forEach(r => (r.channels || []).forEach(ch => { merged[ch.username.toLowerCase()] = ch; }));
        setCompetitorData(merged);
      })
      .finally(() => setCompLoading(false));
  }, []);

  // Merge live subscriber counts into static channel data
  const channels = STATIC_CHANNELS.map(ch => {
    const live = liveData?.channels?.find(l => l.username.toLowerCase() === ch.username.toLowerCase());
    return { ...ch, subs: live?.subscribers ?? 0, title: live?.title || ch.subject };
  });

  const totalSubs = channels.reduce((s, c) => s + c.subs, 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontWeight: 500 }}>Fetching live channel data…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} * { box-sizing: border-box; }`}</style>
      <Sidebar active={activeSection} onNav={setActiveSection} totalSubs={totalSubs} lastFetched={lastFetched} />
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', minWidth: 0 }}>
        {activeSection === 'overview'     && <OverviewSection      channels={channels} liveData={liveData} selectedDate={selectedDate} />}
        {activeSection === 'channels'     && <ChannelsSection      channels={channels} selectedDate={selectedDate} onDateChange={setSelectedDate} />}
        {activeSection === 'competitive'  && <CompetitiveSection   channels={channels} competitorData={competitorData} competitorLoading={compLoading} />}
        {activeSection === 'insights'     && <InsightsSection      channels={channels} competitorData={competitorData} selectedDate={selectedDate} />}
        {activeSection === 'calendar'     && <CalendarSection      channels={channels} />}
        {activeSection === 'automation'   && <AutomationSection />}
        {activeSection === 'integrations' && <IntegrationsSection />}
      </main>
    </div>
  );
}
