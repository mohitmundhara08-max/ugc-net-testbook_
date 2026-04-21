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
  'Common':               ['Adda247ugcnet','ntaugcnett','UtkarshUGCNET','apniuniversityofficial','pwugcnet','jrfaddaofficial'],
  'Paper 1':              ['toshibashukla','GulshanPAPER1','DrLokeshBali','ugcnetpaper1bygauravsir','aditiNETJRF'],
  'Political Science':    ['thediscoverstudy','BYJUSExamPrepPoliticalscience'],
  'History':              ['historybysubhanginipriya','history','UgcNetHistoryOfficial'],
  'Public Administration':['jrfaddapublicadmin'],
  'Sociology':            ['ugcnetsociologybyjrfadda','antarachakk_9876'],
  'Education':            ['education_by_drpriyanka'],
  'Home Science':         ['nta_net_home_science','homescienceprerna'],
  'Law':                  ['ugcnetlawaspirant','ugc_net_Law_Lecture','masterscave_law','ugcnetlawbydikshasingh'],
  'English':              ['EnglishWithAKSRajveer','EnglishNETJRF','dana_multitasker','Literature2021','UGCNETEnglishByAyeshaMaam','ugcnetenglishbyaishwaryapuri','ugc_net_english'],
  'Geography':            ['suraj_Sir_Geo','GEOGRAPHY_UGC_NET_PGT_SET_ADDA','ugc_net_jrf_geography','geography','GEOGRAPHY_UGC_NETJRF','Geographywankit','netxamgeo'],
  'Economics':            ['ECONOMICSNTANET','ugcneteconomicsbyshivanisharma','ugcneteconomicsnotes','netecon22','UGCPAPER1economics','economics_ugc_net'],
  'Management':           ['ugc_net_commerce_management','ugc_net_management_commerce','MANAGEMENT_NET_SET_ADDA','SeekStudySmartly3s','mgtbykanupriya','DeepeshManoraniSir_UgcNet'],
  'Environmental Science':['ugc_Net_evs','ugcnetevsbyanshikapandey','evs_study','EVS_withAdda247'],
  'Library Science':      ['UGCNETJRF2024JUNE','ugc_net_Library_Science','net_library_science','bsiacademy_lis','lisupdatesforall','UGCNETLibraryScience'],
  'Computer Science':     ['puneet_computer_science_ugc_net','ugc_net_computerscience','ugcnetcse2023','Computer_science_net_notes'],
  'Sanskrit':             ['Avdheshvidyalankarah','Sanskrit_By_Sachinsir'],
  'Hindi':                ['UGC_NET_HINDI_CSIR_GRAMMAR_CUET','padhaaiwal'],
  'Commerce':             ['commercenetachievers','NetJRFwithAIR1Yukti','ugc_net_commerce_management','ugcnetcommercebyadda247','UGC_NET_COMMERCE_CUET','JRF_NETCommerce','ugcnetbybushra'],
  'Psychology':           ['netwithhafsa','ugcnetpsychologyforall','psychprep','psychohub12345'],
  'Physical Education':   ['Physical_Education_Adda247','ugc_net_Phsyical_education','RWA_UGC_NET_PHYSICAL_EDUCATION'],
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
  { id: 'youtube',      icon: '▶️',  label: 'YT Calendar' },
  { id: 'masterclass',  icon: '🎓', label: 'Master Classes' },
  { id: 'promotions',   icon: '📣', label: 'Promotions' },
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
    setPlan(prev => prev.map(p => p.id === postId ? { ...p, status: 'posting' } : p));
    try {
      const payload = {
        action: 'post',
        channelUsernames: [ch.username],
        pin: post.pin,
        type: post.type,
      };
      // MCQ uses poll data, others use text
      if (post.type === 'MCQ') {
        payload.question       = post.question;
        payload.options        = post.options;
        payload.correct_option_id = Number(post.correct_option_id);
        payload.explanation    = post.explanation;
      } else {
        payload.text = post.text;
      }
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const result = data.results?.[0];
      if (result?.success) {
        setPlan(prev => prev.map(p => p.id === postId ? { ...p, status: 'posted', messageId: result.messageId, pinned: result.pinned } : p));
        setTimeout(() => setPlan(prev => prev.filter(p => p.id !== postId)), 2000);
      } else {
        setPlan(prev => prev.map(p => p.id === postId ? { ...p, status: 'failed', error: result?.error || 'Failed' } : p));
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

                  {/* Post content — MCQ shows poll fields, others show textarea */}
                  <div style={{ padding: '12px 16px' }}>
                    {post.type === 'MCQ' ? (
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>QUESTION</div>
                          <textarea value={post.question || ''} onChange={e => setPlan(prev => prev.map(p => p.id === post.id ? { ...p, question: e.target.value } : p))}
                            disabled={isPosted || isPosting}
                            style={{ width: '100%', padding: '7px 9px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, resize: 'vertical', outline: 'none', minHeight: 50, boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                          {(post.options || ['','','','']).map((opt, oi) => (
                            <div key={oi}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>
                                {['A','B','C','D'][oi]} {Number(post.correct_option_id) === oi && <span style={{ color: '#10b981' }}>✓ CORRECT</span>}
                              </div>
                              <input value={opt} onChange={e => { const opts = [...(post.options||['','','',''])]; opts[oi] = e.target.value; setPlan(prev => prev.map(p => p.id === post.id ? { ...p, options: opts } : p)); }}
                                disabled={isPosted || isPosting}
                                style={{ width: '100%', padding: '5px 8px', border: `1px solid ${Number(post.correct_option_id) === oi ? '#10b981' : '#e2e8f0'}`, borderRadius: 6, fontSize: 11, outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>CORRECT ANSWER:</div>
                          <select value={post.correct_option_id || 0} onChange={e => setPlan(prev => prev.map(p => p.id === post.id ? { ...p, correct_option_id: Number(e.target.value) } : p))}
                            style={{ padding: '3px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, outline: 'none' }}>
                            {['A (0)','B (1)','C (2)','D (3)'].map((l, i) => <option key={i} value={i}>{l}</option>)}
                          </select>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>EXPLANATION (shown after answering)</div>
                          <input value={post.explanation || ''} onChange={e => setPlan(prev => prev.map(p => p.id === post.id ? { ...p, explanation: e.target.value } : p))}
                            disabled={isPosted || isPosting} placeholder="Brief explanation of the correct answer..."
                            style={{ width: '100%', padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                    ) : (
                      <textarea value={post.text || ''} onChange={e => setPlan(prev => prev.map(p => p.id === post.id ? { ...p, text: e.target.value } : p))}
                        disabled={isPosted || isPosting}
                        style={{ width: '100%', minHeight: 90, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', lineHeight: 1.6, resize: 'vertical', outline: 'none', color: '#374151', background: isPosted ? '#f8fafc' : 'white', boxSizing: 'border-box' }} />
                    )}
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
// ─── Shared multi-channel selector ───────────────────────────────────────────
function ChannelMultiSelect({ channels, selected, onChange }) {
  const allSelected = selected.length === channels.length;
  return (
    <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', maxHeight: 180, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>SELECT CHANNELS</span>
        <button onClick={() => onChange(allSelected ? [] : channels.map(c => c.username))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#3b82f6' }}>
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      {channels.map(ch => (
        <label key={ch.username} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, cursor: 'pointer' }}>
          <input type="checkbox" checked={selected.includes(ch.username)} onChange={e => {
            if (e.target.checked) onChange([...selected, ch.username]);
            else onChange(selected.filter(u => u !== ch.username));
          }} />
          <span style={{ fontSize: 12, color: '#374151' }}>{ch.title || ch.subject}{ch.teacher ? ` — ${ch.teacher}` : ''}</span>
          <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto' }}>{(ch.subs||0).toLocaleString('en-IN')}</span>
        </label>
      ))}
    </div>
  );
}

// ─── PostHistory — track sent messages with delete ────────────────────────────
function PostHistoryItem({ item, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [deleted,  setDeleted]  = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', channelUsername: item.channel, messageId: item.messageId }),
      });
      const data = await res.json();
      if (data.success) { setDeleted(true); setTimeout(() => onDelete(item.id), 1000); }
      else alert('Delete failed: ' + data.error);
    } catch { alert('Network error'); }
    setDeleting(false);
  }

  if (deleted) return <div style={{ padding: '8px 12px', fontSize: 12, color: '#10b981', background: '#f0fdf4', borderRadius: 8 }}>✅ Deleted from Telegram</div>;
  return (
    <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>@{item.channel} {item.pinned && '📌'}</div>
        <div style={{ fontSize: 10, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.preview}</div>
      </div>
      <button onClick={handleDelete} disabled={deleting}
        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: deleting ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
        {deleting ? '...' : '🗑️ Delete'}
      </button>
    </div>
  );
}

// ─── YOUTUBE CALENDAR SECTION ─────────────────────────────────────────────────
function YTCalendarSection({ channels }) {
  const [classes, setClasses]           = useState([]);
  const [xlsxLoaded, setXlsxLoaded]     = useState(false);
  const [view, setView]                 = useState('calendar'); // 'calendar' | 'list'
  const [selDate, setSelDate]           = useState(new Date().toISOString().slice(0,10));
  const [modal, setModal]               = useState(null); // class item for compose
  const [selChannels, setSelChannels]   = useState([]);
  const [postMsg, setPostMsg]           = useState('');
  const [posting, setPosting]           = useState(false);
  const [postedItems, setPostedItems]   = useState([]);
  const [imageUrl, setImageUrl]         = useState('');

  // Load SheetJS from CDN
  useEffect(() => {
    if (window.XLSX) { setXlsxLoaded(true); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = () => setXlsxLoaded(true);
    document.head.appendChild(s);
  }, []);

  function parseExcel(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = window.XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = window.XLSX.utils.sheet_to_json(ws, { defval: '' });
        const parsed = rows.filter(r => r['YT Topics'] || r['YT Time']).map((r, i) => ({
          id: `yt_${i}`,
          date: r['Date'] ? new Date(r['Date']).toISOString().slice(0,10) : '',
          subject: r['Subject'] || '',
          faculty: r['Faculty'] || '',
          category: r['Category'] || '',
          ytTime: r['YT Time'] || '',
          ytTopics: r['YT Topics'] || '',
          classStatus: r['Class Status'] || '',
          thumbnailStatus: r['Thumbnail Status'] || '',
          remarks: r['Remarks'] || '',
        }));
        setClasses(parsed);
      } catch { alert('Could not parse Excel. Ensure columns match the expected format.'); }
    };
    reader.readAsArrayBuffer(file);
  }

  // Classes for selected date
  const dayClasses = classes.filter(c => c.date === selDate);
  // Group by date for calendar dots
  const classByDate = {};
  classes.forEach(c => { if (c.date) classByDate[c.date] = (classByDate[c.date] || 0) + 1; });

  // Get thumbnail from YouTube URL in topic
  function extractYtId(text) {
    const m = text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function openCompose(cls) {
    const thumb = extractYtId(cls.ytTopics);
    setImageUrl(thumb ? `https://img.youtube.com/vi/${thumb}/maxresdefault.jpg` : '');
    setPostMsg(`🎓 <b>${cls.subject} — YouTube Class</b>\n\n📌 <b>Topic:</b> ${cls.ytTopics}\n👨‍🏫 <b>Faculty:</b> ${cls.faculty}\n⏰ <b>Time:</b> ${cls.ytTime}\n\n✅ Join now and ace your UGC NET!\n📲 testbook.com/ugc-net-coaching`);
    setSelChannels([]);
    setModal(cls);
  }

  async function postClass() {
    if (!selChannels.length) { alert('Select at least one channel'); return; }
    if (!postMsg.trim()) { alert('Write a message first'); return; }
    setPosting(true);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'post', channelUsernames: selChannels, text: postMsg, imageUrl: imageUrl || undefined, pin: false }),
      });
      const data = await res.json();
      if (data.results) {
        data.results.forEach(r => {
          if (r.success) setPostedItems(prev => [...prev, { id: `ph_${Date.now()}_${r.channel}`, channel: r.channel, messageId: r.messageId, pinned: r.pinned, preview: postMsg.replace(/<[^>]+>/g,'').slice(0,60) }]);
        });
        setModal(null);
      }
    } catch { alert('Network error'); }
    setPosting(false);
  }

  // Calendar grid
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthName = new Date(calYear, calMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div>
      <SectionHeader icon="▶️" title="YouTube Class Calendar" subtitle="Upload your YT schedule sheet · view in calendar · post to channels" />

      {/* Upload */}
      <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Upload Schedule Excel</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>Columns needed: Date, Subject, Faculty, Category, YT Time, YT Topics, Class Status, Thumbnail Status, Remarks</div>
          <input type="file" accept=".xlsx,.xls,.csv" disabled={!xlsxLoaded} onChange={e => e.target.files[0] && parseExcel(e.target.files[0])}
            style={{ fontSize: 12, cursor: xlsxLoaded ? 'pointer' : 'not-allowed' }} />
          {!xlsxLoaded && <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 8 }}>Loading Excel parser...</span>}
        </div>
        {classes.length > 0 && (
          <div style={{ display: 'flex', gap: 16, marginLeft: 'auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{classes.length}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Classes loaded</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['calendar','list'].map(v => <button key={v} onClick={() => setView(v)} style={{ padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: view === v ? '#3b82f6' : '#f1f5f9', color: view === v ? 'white' : '#374151' }}>{v === 'calendar' ? '📅 Calendar' : '📋 List'}</button>)}
            </div>
          </div>
        )}
      </div>

      {classes.length === 0 && (
        <div style={{ background: 'white', borderRadius: 12, padding: '48px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>▶️</div>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 6 }}>No classes loaded yet</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Upload your YouTube class schedule Excel above to see them in calendar view.</div>
        </div>
      )}

      {classes.length > 0 && view === 'calendar' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); }} style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}>←</button>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{monthName}</span>
              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); }} style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}>→</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
              {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textAlign: 'center' }}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
              {Array.from({ length: firstDay }).map((_,i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_,i) => i+1).map(day => {
                const key = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const cnt = classByDate[key] || 0;
                const isSel = key === selDate;
                const isToday = key === today.toISOString().slice(0,10);
                return (
                  <div key={day} onClick={() => setSelDate(key)} style={{ minHeight: 44, background: isSel ? '#dc2626' : cnt > 0 ? '#fff7f7' : '#fafafa', borderRadius: 6, padding: '3px 4px', cursor: 'pointer', border: isToday ? '1px solid #fca5a5' : '1px solid transparent' }}>
                    <div style={{ fontSize: 10, fontWeight: isSel ? 700 : 400, color: isSel ? 'white' : '#374151', textAlign: 'center' }}>{day}</div>
                    {cnt > 0 && <div style={{ fontSize: 9, color: isSel ? 'rgba(255,255,255,0.9)' : '#dc2626', fontWeight: 700, textAlign: 'center' }}>{cnt} class{cnt > 1 ? 'es' : ''}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }}>
              {new Date(selDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} — {dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''}
            </div>
            {dayClasses.length === 0 ? <div style={{ color: '#94a3b8', fontSize: 12 }}>No classes scheduled for this date.</div> : dayClasses.map(cls => {
              const ytId = extractYtId(cls.ytTopics);
              return (
                <div key={cls.id} style={{ background: 'white', borderRadius: 10, padding: '12px 14px', marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderLeft: '4px solid #dc2626' }}>
                  {ytId && <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="thumbnail" style={{ width: '100%', borderRadius: 6, marginBottom: 8, display: 'block' }} onError={e => e.target.style.display='none'} />}
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 3 }}>{cls.subject}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3 }}>👨‍🏫 {cls.faculty} · ⏰ {cls.ytTime}</div>
                  <div style={{ fontSize: 11, color: '#374151', marginBottom: 8, lineHeight: 1.5 }}>📌 {cls.ytTopics}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ background: cls.classStatus === 'Done' ? '#dcfce7' : '#fef3c7', color: cls.classStatus === 'Done' ? '#15803d' : '#92400e', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 12 }}>{cls.classStatus || 'Pending'}</span>
                    <button onClick={() => openCompose(cls)} style={{ marginLeft: 'auto', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>📤 Post</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {classes.length > 0 && view === 'list' && (
        <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr style={{ background: '#f1f5f9' }}>
              {['Date','Subject','Faculty','YT Time','Topics','Status',''].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 11, borderBottom: '1px solid #e2e8f0' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {classes.map(cls => (
                <tr key={cls.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', color: '#374151' }}>{cls.date}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#0f172a' }}>{cls.subject}</td>
                  <td style={{ padding: '8px 12px', color: '#374151' }}>{cls.faculty}</td>
                  <td style={{ padding: '8px 12px', color: '#374151' }}>{cls.ytTime}</td>
                  <td style={{ padding: '8px 12px', color: '#374151', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls.ytTopics}</td>
                  <td style={{ padding: '8px 12px' }}><span style={{ background: cls.classStatus === 'Done' ? '#dcfce7' : '#fef3c7', color: cls.classStatus === 'Done' ? '#15803d' : '#92400e', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 12 }}>{cls.classStatus || 'Pending'}</span></td>
                  <td style={{ padding: '8px 12px' }}><button onClick={() => openCompose(cls)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Post</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Post history */}
      {postedItems.length > 0 && (
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>📬 Posted Messages ({postedItems.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {postedItems.map(item => <PostHistoryItem key={item.id} item={item} onDelete={id => setPostedItems(prev => prev.filter(p => p.id !== id))} />)}
          </div>
        </div>
      )}

      {/* Compose modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setModal(null)}>
          <div style={{ background: 'white', borderRadius: 14, padding: 24, width: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 12px 48px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>📤 Post YouTube Class</div>
            {imageUrl && <img src={imageUrl} alt="thumb" style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} onError={e => e.target.style.display='none'} />}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>IMAGE URL (optional — YouTube thumbnail auto-filled)</div>
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>MESSAGE</div>
              <textarea value={postMsg} onChange={e => setPostMsg(e.target.value)} rows={6}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <ChannelMultiSelect channels={channels} selected={selChannels} onChange={setSelChannels} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={postClass} disabled={posting || !selChannels.length}
                style={{ flex: 1, background: posting ? '#94a3b8' : '#dc2626', color: 'white', border: 'none', borderRadius: 8, padding: '10px', cursor: posting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13 }}>
                {posting ? 'Posting...' : `📤 Post to ${selChannels.length} channel${selChannels.length !== 1 ? 's' : ''}`}
              </button>
              <button onClick={() => setModal(null)} style={{ flex: 0.5, background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MASTER CLASS CALENDAR SECTION ───────────────────────────────────────────
function MasterClassSection({ channels }) {
  const [classes, setClasses]           = useState([]);
  const [xlsxLoaded, setXlsxLoaded]     = useState(false);
  const [modal, setModal]               = useState(null);
  const [selChannels, setSelChannels]   = useState([]);
  const [postMsg, setPostMsg]           = useState('');
  const [posting, setPosting]           = useState(false);
  const [postedItems, setPostedItems]   = useState([]);
  const [selDate, setSelDate]           = useState(new Date().toISOString().slice(0,10));

  useEffect(() => {
    if (window.XLSX) { setXlsxLoaded(true); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = () => setXlsxLoaded(true);
    document.head.appendChild(s);
  }, []);

  function parseExcel(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = window.XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = window.XLSX.utils.sheet_to_json(ws, { defval: '' });
        const parsed = rows.filter(r => r['Master Class Time'] || r['MC SERIES NAME']).map((r, i) => ({
          id: `mc_${i}`,
          date: r['Date'] ? new Date(r['Date']).toISOString().slice(0,10) : '',
          subject: r['Subject'] || '',
          faculty: r['Faculty'] || '',
          mcCategory: r['MC Category'] || '',
          mcTime: r['Master Class Time'] || '',
          seriesName: r['MC SERIES NAME'] || '',
          topic: r['Master Class Topic (To be filled by Faculty)'] || r['Master Class Topic'] || '',
          classStatus: r['Class Status'] || '',
          remarks: r['Remarks'] || '',
        }));
        setClasses(parsed);
      } catch { alert('Could not parse Excel. Check the column names.'); }
    };
    reader.readAsArrayBuffer(file);
  }

  function openCompose(cls) {
    setPostMsg(`🎓 <b>${cls.subject} — Master Class</b>\n\n📚 <b>Series:</b> ${cls.seriesName}\n📌 <b>Topic:</b> ${cls.topic}\n👨‍🏫 <b>Faculty:</b> ${cls.faculty}\n⏰ <b>Time:</b> ${cls.mcTime}\n\n🔥 Don't miss this class! Join now.\n📲 testbook.com/ugc-net-coaching`);
    setSelChannels([]);
    setModal(cls);
  }

  async function postClass() {
    if (!selChannels.length) { alert('Select at least one channel'); return; }
    if (!postMsg.trim()) { alert('Write a message first'); return; }
    setPosting(true);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'post', channelUsernames: selChannels, text: postMsg, pin: false }),
      });
      const data = await res.json();
      if (data.results) {
        data.results.forEach(r => {
          if (r.success) setPostedItems(prev => [...prev, { id: `ph_${Date.now()}_${r.channel}`, channel: r.channel, messageId: r.messageId, pinned: r.pinned, preview: postMsg.replace(/<[^>]+>/g,'').slice(0,60) }]);
        });
        setModal(null);
      }
    } catch { alert('Network error'); }
    setPosting(false);
  }

  const classByDate = {};
  classes.forEach(c => { if (c.date) classByDate[c.date] = (classByDate[c.date] || 0) + 1; });
  const dayClasses = classes.filter(c => c.date === selDate);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();

  return (
    <div>
      <SectionHeader icon="🎓" title="Master Class Calendar" subtitle="Upload your MC schedule · view in calendar · post announcements" />

      <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Upload Master Class Schedule</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>Columns: Date, Subject, Faculty, MC Category, Master Class Time, MC SERIES NAME, Master Class Topic, Class Status, Remarks</div>
        <input type="file" accept=".xlsx,.xls,.csv" disabled={!xlsxLoaded} onChange={e => e.target.files[0] && parseExcel(e.target.files[0])} style={{ fontSize: 12 }} />
        {classes.length > 0 && <span style={{ marginLeft: 12, fontSize: 12, color: '#10b981', fontWeight: 700 }}>✅ {classes.length} master classes loaded</span>}
      </div>

      {classes.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: '48px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎓</div>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>No master classes loaded</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Upload your master class schedule Excel to get started.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y=>y-1); } else setCalMonth(m=>m-1); }} style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}>←</button>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{new Date(calYear, calMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y=>y+1); } else setCalMonth(m=>m+1); }} style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}>→</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
              {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textAlign: 'center' }}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
              {Array.from({ length: firstDay }).map((_,i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth },(_,i)=>i+1).map(day => {
                const key = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const cnt = classByDate[key] || 0;
                const isSel = key === selDate;
                return (
                  <div key={day} onClick={() => setSelDate(key)} style={{ minHeight: 44, background: isSel ? '#8b5cf6' : cnt > 0 ? '#f5f3ff' : '#fafafa', borderRadius: 6, padding: '3px 4px', cursor: 'pointer' }}>
                    <div style={{ fontSize: 10, fontWeight: isSel ? 700 : 400, color: isSel ? 'white' : '#374151', textAlign: 'center' }}>{day}</div>
                    {cnt > 0 && <div style={{ fontSize: 9, color: isSel ? 'rgba(255,255,255,0.9)' : '#8b5cf6', fontWeight: 700, textAlign: 'center' }}>{cnt}</div>}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }}>
              {new Date(selDate+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})} — {dayClasses.length} class{dayClasses.length!==1?'es':''}
            </div>
            {dayClasses.length === 0 ? <div style={{ color: '#94a3b8', fontSize: 12 }}>No master classes on this date.</div> : dayClasses.map(cls => (
              <div key={cls.id} style={{ background: 'white', borderRadius: 10, padding: '12px 14px', marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderLeft: '4px solid #8b5cf6' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 3 }}>{cls.seriesName || cls.subject}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3 }}>👨‍🏫 {cls.faculty} · ⏰ {cls.mcTime}</div>
                <div style={{ fontSize: 11, color: '#374151', marginBottom: 8, lineHeight: 1.5 }}>📌 {cls.topic || '(topic TBD)'}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ background: '#f5f3ff', color: '#6d28d9', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 12 }}>{cls.mcCategory}</span>
                  <button onClick={() => openCompose(cls)} style={{ marginLeft: 'auto', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>📤 Post</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {postedItems.length > 0 && (
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>📬 Posted Messages</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {postedItems.map(item => <PostHistoryItem key={item.id} item={item} onDelete={id => setPostedItems(prev => prev.filter(p => p.id !== id))} />)}
          </div>
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setModal(null)}>
          <div style={{ background: 'white', borderRadius: 14, padding: 24, width: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 12px 48px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>📤 Post Master Class</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>MESSAGE</div>
              <textarea value={postMsg} onChange={e => setPostMsg(e.target.value)} rows={7}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <ChannelMultiSelect channels={channels} selected={selChannels} onChange={setSelChannels} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={postClass} disabled={posting || !selChannels.length}
                style={{ flex: 1, background: posting ? '#94a3b8' : '#8b5cf6', color: 'white', border: 'none', borderRadius: 8, padding: '10px', cursor: posting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13 }}>
                {posting ? 'Posting...' : `📤 Post to ${selChannels.length} channel${selChannels.length !== 1 ? 's' : ''}`}
              </button>
              <button onClick={() => setModal(null)} style={{ flex: 0.5, background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROMOTIONS SECTION ───────────────────────────────────────────────────────
function PromotionsSection({ channels }) {
  const [imageUrl,     setImageUrl]     = useState('');
  const [copy,         setCopy]         = useState('');
  const [link,         setLink]         = useState('');
  const [selChannels,  setSelChannels]  = useState([]);
  const [times,        setTimes]        = useState(['']);
  const [pin,          setPin]          = useState(false);
  const [posting,      setPosting]      = useState(false);
  const [postedItems,  setPostedItems]  = useState([]);
  const [results,      setResults]      = useState([]);

  function addTime()    { if (times.length < 3) setTimes([...times, '']); }
  function removeTime(i){ setTimes(times.filter((_,idx) => idx !== i)); }
  function setTime(i,v) { const t=[...times]; t[i]=v; setTimes(t); }

  const fullMessage = [copy, link].filter(Boolean).join('\n\n');

  async function postNow() {
    if (!selChannels.length) { alert('Select at least one channel'); return; }
    if (!fullMessage.trim()) { alert('Write your promotional copy first'); return; }
    setPosting(true); setResults([]);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'post',
          channelUsernames: selChannels,
          text: fullMessage,
          imageUrl: imageUrl || undefined,
          pin,
        }),
      });
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
        data.results.filter(r => r.success).forEach(r => {
          setPostedItems(prev => [...prev, {
            id: `promo_${Date.now()}_${r.channel}`,
            channel: r.channel,
            messageId: r.messageId,
            pinned: r.pinned,
            preview: fullMessage.replace(/<[^>]+>/g,'').slice(0,60),
          }]);
        });
      }
    } catch { alert('Network error'); }
    setPosting(false);
  }

  async function schedulePost(time) {
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(h, m, 0, 0);
    if (scheduled < now) scheduled.setDate(scheduled.getDate() + 1);
    const msUntil = scheduled - now;
    alert(`Scheduled for ${scheduled.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} (in ${Math.round(msUntil/60000)} minutes). Keep this tab open.`);
    setTimeout(() => postNow(), msUntil);
  }

  return (
    <div>
      <SectionHeader icon="📣" title="Promotions" subtitle="Post promotional content to any channels · schedule up to 3 times · delete anytime" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* Left: Compose */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Image */}
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>IMAGE URL (optional)</div>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/promo-banner.jpg"
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            {imageUrl && <img src={imageUrl} alt="preview" style={{ marginTop: 8, width: '100%', borderRadius: 8, maxHeight: 180, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />}
          </div>

          {/* Copy */}
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>PROMOTIONAL COPY</div>
            <textarea value={copy} onChange={e => setCopy(e.target.value)} rows={6} placeholder={`🔥 <b>Big Sale Alert!</b>\n\nJoin UGC NET SuperCoaching at the best price ever.\n✅ All subjects covered\n✅ Live + recorded sessions\n✅ 24/7 doubt support`}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Use HTML: &lt;b&gt;bold&lt;/b&gt; · Emojis supported</div>
          </div>

          {/* Link */}
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>LINK (optional)</div>
            <input value={link} onChange={e => setLink(e.target.value)} placeholder="https://testbook.com/ugc-net-coaching"
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Pin */}
          <div style={{ background: 'white', borderRadius: 12, padding: '14px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div onClick={() => setPin(p => !p)} style={{ width: 44, height: 24, borderRadius: 12, background: pin ? '#f59e0b' : '#e2e8f0', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: pin ? 23 : 3, transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>📌 Pin this message</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{pin ? 'Will be pinned to top of channel' : 'Will not be pinned'}</div>
            </div>
          </div>
        </div>

        {/* Right: Channels + Schedule + Post */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Channel selector */}
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <ChannelMultiSelect channels={channels} selected={selChannels} onChange={setSelChannels} />
          </div>

          {/* Schedule times */}
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>SCHEDULE TIMES (up to 3 per day)</div>
            {times.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input type="time" value={t} onChange={e => setTime(i, e.target.value)}
                  style={{ flex: 1, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                <button onClick={() => t && schedulePost(t)} disabled={!t || !selChannels.length || !fullMessage.trim()}
                  style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: 6, padding: '7px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  ⏰ Schedule
                </button>
                {times.length > 1 && <button onClick={() => removeTime(i)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '7px 10px', cursor: 'pointer', fontSize: 12 }}>✕</button>}
              </div>
            ))}
            {times.length < 3 && (
              <button onClick={addTime} style={{ background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>+ Add Time Slot</button>
            )}
          </div>

          {/* Post Now */}
          <button onClick={postNow} disabled={posting || !selChannels.length || !fullMessage.trim()}
            style={{ padding: '12px 24px', background: posting ? '#94a3b8' : '#e11d48', color: 'white', border: 'none', borderRadius: 12, cursor: posting ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 800, boxShadow: '0 2px 8px rgba(225,29,72,0.3)' }}>
            {posting ? '⏳ Posting...' : `📤 Post Now to ${selChannels.length} channel${selChannels.length !== 1 ? 's' : ''}`}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <div style={{ background: 'white', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Post Results</div>
              {results.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 13 }}>{r.success ? '✅' : '❌'}</span>
                  <span style={{ fontSize: 12, color: '#374151' }}>@{r.channel}</span>
                  {!r.success && <span style={{ fontSize: 11, color: '#dc2626' }}>{r.error}</span>}
                  {r.pinned && <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>📌 pinned</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post history with delete */}
      {postedItems.length > 0 && (
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>📬 Posted Messages — click 🗑️ Delete to remove from Telegram</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {postedItems.map(item => <PostHistoryItem key={item.id} item={item} onDelete={id => setPostedItems(prev => prev.filter(p => p.id !== id))} />)}
          </div>
        </div>
      )}
    </div>
  );
}


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
        {activeSection === 'youtube'      && <YTCalendarSection    channels={channels} />}
        {activeSection === 'masterclass'  && <MasterClassSection   channels={channels} />}
        {activeSection === 'promotions'   && <PromotionsSection    channels={channels} />}
        {activeSection === 'automation'   && <AutomationSection />}
        {activeSection === 'integrations' && <IntegrationsSection />}
      </main>
    </div>
  );
}
