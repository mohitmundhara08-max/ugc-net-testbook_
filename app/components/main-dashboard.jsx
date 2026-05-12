'use client';
import { useState, useEffect, useCallback } from 'react';
import ChannelsSectionV2 from './channels-section';

// ── Snapshot storage key ────────────────────────────────────────────────────
const SNAPSHOT_KEY = 'tg_sub_snapshots_v1';

// ── Static channel data ─────────────────────────────────────────────────────
const CHANNELS = [
  { username:'testbook_ugcnet', subject:'Common', name:'@testbook_ugcnet', posts:12, rate:8.5, teacher:'', avgViews:3400, avgFwd:3.7, joined:55, left:36, bestHours:['3:30pm','6:30pm','7:30pm','8:30pm'], contentTypes:[{type:'Quiz / Poll',posts:5,avgViews:3800,rate:9.2,fwd:2.1},{type:'YouTube Class Link',posts:3,avgViews:4200,rate:10.4,fwd:4.8},{type:'PDF Notes',posts:2,avgViews:5100,rate:12.5,fwd:9.2},{type:'Current Affairs',posts:2,avgViews:3200,rate:7.8,fwd:3.6}] },
  { username:'pritipaper1', subject:'Paper 1', name:'@pritipaper1', posts:11, rate:8.9, teacher:'Priti', avgViews:1900, avgFwd:2.1, joined:42, left:18, bestHours:['7:00am','12:00pm','6:00pm'], contentTypes:[{type:'Quiz / Poll',posts:4,avgViews:2100,rate:10.1,fwd:2.5},{type:'Voice Note Class',posts:3,avgViews:2400,rate:11.5,fwd:1.8},{type:'PDF Notes',posts:2,avgViews:2800,rate:13.2,fwd:6.5},{type:'YouTube Class Link',posts:2,avgViews:2000,rate:9.6,fwd:2.2}] },
  { username:'tulikamam', subject:'Paper 1', name:'@tulikamam', posts:8, rate:7.1, teacher:'Tulika', avgViews:1200, avgFwd:1.8, joined:30, left:22, bestHours:['8:00am','5:00pm'], contentTypes:[{type:'Quiz / Poll',posts:3,avgViews:1300,rate:8,fwd:2},{type:'PDF Notes',posts:3,avgViews:1500,rate:9.2,fwd:4.1},{type:'Voice Note Class',posts:2,avgViews:1100,rate:7.5,fwd:1.5}] },
  { username:'Anshikamaamtestbook', subject:'Paper 1', name:'@Anshikamaamtestbook', posts:10, rate:8.3, teacher:'Anshika', avgViews:1100, avgFwd:2.2, joined:28, left:15, bestHours:['9:00am','4:00pm','8:00pm'], contentTypes:[{type:'Quiz / Poll',posts:4,avgViews:1200,rate:9.1,fwd:2.8},{type:'YouTube Class Link',posts:3,avgViews:1400,rate:10.3,fwd:3.5},{type:'PDF Notes',posts:2,avgViews:1600,rate:11.8,fwd:5.2},{type:'Promotional Post',posts:1,avgViews:800,rate:5.5,fwd:1}] },
  { username:'testbookrajatsir', subject:'Paper 1', name:'@testbookrajatsir', posts:7, rate:6.8, teacher:'Rajat Sir', avgViews:320, avgFwd:1.2, joined:12, left:8, bestHours:['10:00am','6:00pm'], contentTypes:[{type:'Quiz / Poll',posts:3,avgViews:350,rate:7.5,fwd:1.5},{type:'PDF Notes',posts:2,avgViews:420,rate:9,fwd:2.8},{type:'PYQ Discussion',posts:2,avgViews:300,rate:6.5,fwd:1.2}] },
  { username:'pradyumansir_testbook', subject:'Political Science', name:'@pradyumansir_testbook', posts:9, rate:7.2, teacher:'', avgViews:2400, avgFwd:4.1, joined:48, left:25, bestHours:['8:00am','2:00pm','7:00pm'], contentTypes:[{type:'YouTube Class Link',posts:4,avgViews:2900,rate:8.5,fwd:5.2},{type:'PYQ Discussion',posts:3,avgViews:2500,rate:7.8,fwd:4.5},{type:'PDF Notes',posts:2,avgViews:3100,rate:10.2,fwd:7.8}] },
  { username:'AshwaniSir_Testbook', subject:'History', name:'@AshwaniSir_Testbook', posts:9, rate:7.5, teacher:'', avgViews:1100, avgFwd:2.8, joined:35, left:20, bestHours:['9:00am','5:00pm'], contentTypes:[{type:'YouTube Class Link',posts:4,avgViews:1300,rate:8.5,fwd:3.5},{type:'PDF Notes',posts:3,avgViews:1500,rate:10.1,fwd:4.8},{type:'Quiz / Poll',posts:2,avgViews:900,rate:6.2,fwd:2}] },
  { username:'kiranmaamtestbook', subject:'Public Administration', name:'@kiranmaamtestbook', posts:6, rate:6.2, teacher:'', avgViews:500, avgFwd:1.5, joined:18, left:12, bestHours:['10:00am','6:00pm'], contentTypes:[{type:'PDF Notes',posts:3,avgViews:620,rate:8,fwd:2.5},{type:'PYQ Discussion',posts:2,avgViews:480,rate:6.2,fwd:1.8},{type:'Quiz / Poll',posts:1,avgViews:400,rate:5,fwd:1.2}] },
  { username:'Manojsonker_Testbook', subject:'Sociology', name:'@Manojsonker_Testbook', posts:7, rate:6.8, teacher:'', avgViews:420, avgFwd:1.8, joined:15, left:10, bestHours:['11:00am','7:00pm'], contentTypes:[{type:'PDF Notes',posts:3,avgViews:520,rate:8.5,fwd:2.8},{type:'YouTube Class Link',posts:2,avgViews:450,rate:7.2,fwd:2},{type:'Quiz / Poll',posts:2,avgViews:340,rate:5.8,fwd:1.5}] },
  { username:'Heenamaam_testbook', subject:'Education', name:'@Heenamaam_testbook', posts:8, rate:7.1, teacher:'', avgViews:400, avgFwd:1.6, joined:14, left:9, bestHours:['9:00am','4:00pm'], contentTypes:[{type:'PDF Notes',posts:3,avgViews:500,rate:9,fwd:2.8},{type:'Voice Note Class',posts:3,avgViews:420,rate:7.5,fwd:1.8},{type:'Quiz / Poll',posts:2,avgViews:320,rate:5.8,fwd:1.2}] },
  { username:'AditiMaam_Testbook', subject:'Home Science', name:'@AditiMaam_Testbook', posts:6, rate:5.9, teacher:'', avgViews:340, avgFwd:1.2, joined:12, left:8, bestHours:['10:00am','5:00pm'], contentTypes:[{type:'PDF Notes',posts:3,avgViews:420,rate:7.5,fwd:2},{type:'YouTube Class Link',posts:2,avgViews:360,rate:6.2,fwd:1.5},{type:'Quiz / Poll',posts:1,avgViews:250,rate:4.5,fwd:0.9}] },
  { username:'karanSir_Testbook', subject:'Law', name:'@karanSir_Testbook', posts:5, rate:5.2, teacher:'', avgViews:280, avgFwd:1.1, joined:10, left:7, bestHours:['11:00am','6:00pm'], contentTypes:[{type:'PDF Notes',posts:2,avgViews:340,rate:7,fwd:2},{type:'PYQ Discussion',posts:2,avgViews:280,rate:5.5,fwd:1.2},{type:'YouTube Class Link',posts:1,avgViews:250,rate:5,fwd:1}] },
  { username:'testbookdakshita', subject:'English', name:'@testbookdakshita', posts:6, rate:5.8, teacher:'', avgViews:250, avgFwd:1.3, joined:9, left:6, bestHours:['9:00am','5:00pm'], contentTypes:[{type:'PDF Notes',posts:2,avgViews:310,rate:7.5,fwd:2.2},{type:'YouTube Class Link',posts:2,avgViews:270,rate:6,fwd:1.5},{type:'Quiz / Poll',posts:2,avgViews:200,rate:5,fwd:1}] },
  { username:'AshishSir_Testbook', subject:'Geography', name:'@AshishSir_Testbook', posts:4, rate:4.5, teacher:'', avgViews:130, avgFwd:0.9, joined:6, left:5, bestHours:['10:00am','6:00pm'], contentTypes:[{type:'PDF Notes',posts:2,avgViews:165,rate:6,fwd:1.5},{type:'YouTube Class Link',posts:1,avgViews:140,rate:5.2,fwd:1},{type:'Quiz / Poll',posts:1,avgViews:90,rate:3.5,fwd:0.7}] },
  { username:'ShachiMaam_Testbook', subject:'Economics', name:'@ShachiMaam_Testbook', posts:5, rate:4.8, teacher:'', avgViews:140, avgFwd:1, joined:6, left:5, bestHours:['11:00am','5:00pm'], contentTypes:[{type:'PDF Notes',posts:2,avgViews:180,rate:6.5,fwd:1.8},{type:'YouTube Class Link',posts:2,avgViews:145,rate:5,fwd:1.2},{type:'Current Affairs',posts:1,avgViews:110,rate:3.8,fwd:0.8}] },
  { username:'Monikamaamtestbook', subject:'Management', name:'@Monikamaamtestbook', posts:3, rate:3.9, teacher:'', avgViews:110, avgFwd:0.8, joined:5, left:4, bestHours:['10:00am','5:00pm'], contentTypes:[{type:'PDF Notes',posts:2,avgViews:140,rate:5.5,fwd:1.2},{type:'YouTube Class Link',posts:1,avgViews:90,rate:3.5,fwd:0.8}] },
  { username:'yogitamaamtestbook', subject:'Management', name:'@yogitamaamtestbook', posts:4, rate:4.2, teacher:'', avgViews:115, avgFwd:0.9, joined:5, left:4, bestHours:['9:00am','4:00pm'], contentTypes:[{type:'PDF Notes',posts:2,avgViews:145,rate:5.8,fwd:1.5},{type:'YouTube Class Link',posts:1,avgViews:120,rate:4.5,fwd:1},{type:'Quiz / Poll',posts:1,avgViews:85,rate:3.2,fwd:0.7}] },
  { username:'EVS_AnshikamaamTestbook', subject:'Environmental Science', name:'@EVS_AnshikamaamTestbook', posts:3, rate:3.5, teacher:'', avgViews:95, avgFwd:0.7, joined:4, left:4, bestHours:['10:00am','6:00pm'], contentTypes:[{type:'PDF Notes',posts:2,avgViews:115,rate:5,fwd:1.2},{type:'Quiz / Poll',posts:1,avgViews:75,rate:3,fwd:0.6}] },
  { username:'daminimaam_testbook', subject:'Library Science', name:'@daminimaam_testbook', posts:2, rate:2.8, teacher:'', avgViews:80, avgFwd:0.6, joined:3, left:3, bestHours:['11:00am','5:00pm'], contentTypes:[{type:'PDF Notes',posts:1,avgViews:98,rate:4,fwd:1},{type:'Quiz / Poll',posts:1,avgViews:62,rate:2.5,fwd:0.5}] },
  { username:'TestbookShahna', subject:'Computer Science', name:'@TestbookShahna', posts:5, rate:4.6, teacher:'', avgViews:95, avgFwd:1, joined:4, left:3, bestHours:['9:00am','7:00pm'], contentTypes:[{type:'YouTube Class Link',posts:2,avgViews:120,rate:6,fwd:1.5},{type:'PDF Notes',posts:2,avgViews:100,rate:5,fwd:1.2},{type:'Quiz / Poll',posts:1,avgViews:75,rate:3.5,fwd:0.8}] },
  { username:'Prakashsirtestbook', subject:'Sanskrit', name:'@Prakashsirtestbook', posts:3, rate:3.1, teacher:'', avgViews:70, avgFwd:0.6, joined:3, left:3, bestHours:['8:00am','4:00pm'], contentTypes:[{type:'PDF Notes',posts:2,avgViews:88,rate:4.5,fwd:0.9},{type:'Quiz / Poll',posts:1,avgViews:55,rate:2.5,fwd:0.5}] },
  { username:'kesharisir_testbook', subject:'Hindi', name:'@kesharisir_testbook', posts:4, rate:3.8, teacher:'', avgViews:80, avgFwd:0.8, joined:3, left:3, bestHours:['9:00am','5:00pm'], contentTypes:[{type:'YouTube Class Link',posts:2,avgViews:100,rate:5,fwd:1.2},{type:'PDF Notes',posts:1,avgViews:85,rate:4.2,fwd:1},{type:'Quiz / Poll',posts:1,avgViews:60,rate:2.8,fwd:0.6}] },
  { username:'TestbookNiharikaMaam', subject:'Commerce', name:'@TestbookNiharikaMaam', posts:2, rate:2.5, teacher:'', avgViews:70, avgFwd:0.5, joined:3, left:3, bestHours:['10:00am','5:00pm'], contentTypes:[{type:'PDF Notes',posts:1,avgViews:88,rate:3.5,fwd:0.8},{type:'YouTube Class Link',posts:1,avgViews:55,rate:2,fwd:0.5}] },
  { username:'MrinaliniMaam_Testbook', subject:'Psychology', name:'@MrinaliniMaam_Testbook', posts:3, rate:3.2, teacher:'', avgViews:72, avgFwd:0.7, joined:3, left:3, bestHours:['10:00am','6:00pm'], contentTypes:[{type:'YouTube Class Link',posts:2,avgViews:90,rate:4.2,fwd:1},{type:'PDF Notes',posts:1,avgViews:78,rate:3.5,fwd:0.8}] },
  { username:'testbook_gauravsir', subject:'Physical Education', name:'@testbook_gauravsir', posts:1, rate:1.5, teacher:'', avgViews:20, avgFwd:0.3, joined:1, left:2, bestHours:['11:00am'], contentTypes:[{type:'YouTube Class Link',posts:1,avgViews:20,rate:1.5,fwd:0.3}] },
];

// ── Competitor channels ─────────────────────────────────────────────────────
const COMPETITORS = {
  'Common':['Adda247ugcnet','ntaugcnett','UtkarshUGCNET','apniuniversityofficial','pwugcnet','jrfaddaofficial'],
  'Paper 1':['toshibashukla','GulshanPAPER1','DrLokeshBali','ugcnetpaper1bygauravsir','aditiNETJRF'],
  'Political Science':['thediscoverstudy','BYJUSExamPrepPoliticalscience'],
  'History':['historybysubhanginipriya','history','UgcNetHistoryOfficial'],
  'Public Administration':['jrfaddapublicadmin'],
  'Sociology':['ugcnetsociologybyjrfadda','antarachakk_9876'],
  'Education':['education_by_drpriyanka'],
  'Home Science':['nta_net_home_science','homescienceprerna'],
  'Law':['ugcnetlawaspirant','ugc_net_Law_Lecture','masterscave_law','ugcnetlawbydikshasingh'],
  'English':['EnglishWithAKSRajveer','EnglishNETJRF','dana_multitasker','Literature2021','UGCNETEnglishByAyeshaMaam','ugcnetenglishbyaishwaryapuri','ugc_net_english'],
  'Geography':['suraj_Sir_Geo','GEOGRAPHY_UGC_NET_PGT_SET_ADDA','ugc_net_jrf_geography','geography','GEOGRAPHY_UGC_NETJRF','Geographywankit','netxamgeo'],
  'Economics':['ECONOMICSNTANET','ugcneteconomicsbyshivanisharma','ugcneteconomicsnotes','netecon22','UGCPAPER1economics','economics_ugc_net'],
  'Management':['ugc_net_commerce_management','ugc_net_management_commerce','MANAGEMENT_NET_SET_ADDA','SeekStudySmartly3s','mgtbykanupriya','DeepeshManoraniSir_UgcNet'],
  'Environmental Science':['ugc_Net_evs','ugcnetevsbyanshikapandey','evs_study','EVS_withAdda247'],
  'Library Science':['UGCNETJRF2024JUNE','ugc_net_Library_Science','net_library_science','bsiacademy_lis','lisupdatesforall','UGCNETLibraryScience'],
  'Computer Science':['puneet_computer_science_ugc_net','ugc_net_computerscience','ugcnetcse2023','Computer_science_net_notes'],
  'Sanskrit':['Avdheshvidyalankarah','Sanskrit_By_Sachinsir'],
  'Hindi':['UGC_NET_HINDI_CSIR_GRAMMAR_CUET','padhaaiwal'],
  'Commerce':['commercenetachievers','NetJRFwithAIR1Yukti','ugc_net_commerce_management','ugcnetcommercebyadda247','UGC_NET_COMMERCE_CUET','JRF_NETCommerce','ugcnetbybushra'],
  'Psychology':['netwithhafsa','ugcnetpsychologyforall','psychprep','psychohub12345'],
  'Physical Education':['Physical_Education_Adda247','ugc_net_Phsyical_education','RWA_UGC_NET_PHYSICAL_EDUCATION'],
};

// ── Content type helpers ────────────────────────────────────────────────────
const TYPE_LABEL_MAP = {
  'Quiz / Poll':'MCQ','MCQ':'MCQ',
  'YouTube Class Link':'YouTube Class','PDF Notes':'PDF Notes',
  'Voice Note Class':'Voice Note','PYQ Discussion':'PYQ Discussion',
  'Current Affairs':'Current Affairs','Promotional Post':'Promotional',
};
const TYPE_COLOR = { 'MCQ':'#3b82f6','YouTube Class':'#dc2626','PDF Notes':'#10b981','Voice Note':'#8b5cf6','PYQ Discussion':'#f59e0b','Current Affairs':'#06b6d4','Promotional':'#64748b' };
const TYPE_ICON  = { 'MCQ':'🧪','YouTube Class':'▶️','PDF Notes':'📄','Voice Note':'🎙️','PYQ Discussion':'📝','Current Affairs':'📰','Promotional':'📢' };

function normalizeType(raw) { return TYPE_LABEL_MAP[raw] || raw; }
function typeColor(raw)     { return TYPE_COLOR[normalizeType(raw)] || '#64748b'; }
function typeIcon(raw)      { return TYPE_ICON[normalizeType(raw)]  || '📌'; }

// ── Snapshot helpers ────────────────────────────────────────────────────────
function saveSnapshot(date, channels) {
  try {
    const all = JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || '{}');
    all[date] = {};
    channels.forEach(ch => { all[date][ch.username.toLowerCase()] = ch.subscribers; });
    const keys = Object.keys(all).sort().slice(-30);
    const trimmed = {};
    keys.forEach(k => { trimmed[k] = all[k]; });
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(trimmed));
  } catch {}
}

function loadSnapshot(date) {
  try { return JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || '{}')[date] || null; }
  catch { return null; }
}

function allSnapshotDates() {
  try { return Object.keys(JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || '{}')).sort().reverse(); }
  catch { return []; }
}

// ── Calendar post cache (survives section switches + page reloads) ─────────
const calCacheKey = (ch, dt) => `cal_posts_v1_${ch}_${dt}`;
function saveCalCache(ch, dt, posts) {
  try { localStorage.setItem(calCacheKey(ch, dt), JSON.stringify(posts)); } catch {}
}
function loadCalCache(ch, dt) {
  try { return JSON.parse(localStorage.getItem(calCacheKey(ch, dt)) || 'null'); } catch { return null; }
}

// ── Sparkline ───────────────────────────────────────────────────────────────
function Sparkline({ data, color = '#3b82f6', h = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const y = v => h - (v - min) / (max - min || 1) * (h - 2) - 1;
  const x = i => (i / (data.length - 1)) * 80;
  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return <svg width={80} height={h} style={{ display: 'block' }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" /></svg>;
}

// ── Mini dual chart ─────────────────────────────────────────────────────────
function MiniDualChart({ history, color = '#2563eb' }) {
  const [hover, setHover] = useState(null);
  if (!history || history.length < 2) return null;
  const maxS = Math.max(...history.map(h => h.subs), 1), minS = Math.min(...history.map(h => h.subs));
  const maxR = Math.max(...history.map(h => h.rate), 1), minR = Math.min(...history.map(h => h.rate));
  const W = 280, H = 52;
  const x = i => (i / (history.length - 1)) * W;
  const ySubs = v => H - (v - minS) / (maxS - minS || 1) * 48 - 2;
  const yRate = v => H - (v - minR) / (maxR - minR || 1) * 48 - 2;
  return (
    <div style={{ position: 'relative', paddingBottom: 14 }}>
      {hover !== null && history[hover] && (
        <div style={{ position:'absolute',top:-28,left:'50%',transform:'translateX(-50%)',background:'#0f172a',color:'white',borderRadius:5,padding:'3px 8px',fontSize:9,fontWeight:600,whiteSpace:'nowrap',zIndex:10,pointerEvents:'none' }}>
          {history[hover].label} · {history[hover].subs.toLocaleString('en-IN')} subs · {history[hover].rate}%
        </div>
      )}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible',display:'block' }}>
        <polyline points={history.map((h,i)=>`${x(i)},${ySubs(h.subs)}`).join(' ')} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <polyline points={history.map((h,i)=>`${x(i)},${yRate(h.rate)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3,2" strokeLinejoin="round" />
        {hover !== null && (<>
          <circle cx={x(hover)} cy={ySubs(history[hover]?.subs||0)} r="3" fill={color} stroke="white" strokeWidth="1.5" />
          <circle cx={x(hover)} cy={yRate(history[hover]?.rate||0)} r="2.5" fill="#f59e0b" stroke="white" strokeWidth="1.2" />
        </>)}
        {history.map((_, i) => (
          <rect key={i} x={i===0?0:(x(i-1)+x(i))/2} y={0} width={i===0?(x(0)+x(1))/2:i===history.length-1?W-(x(i-1)+x(i))/2:(x(i+1)-x(i-1))/2} height={H} fill="transparent" style={{cursor:'crosshair'}} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} />
        ))}
      </svg>
      <div style={{ display:'flex',justifyContent:'space-between',position:'absolute',bottom:0,left:0,right:0 }}>
        {history.map((h,i)=>(
          <span key={i} style={{ fontSize:8,color:hover===i?color:'#9ca3af',flex:1,textAlign:'center' }}>{h.label}</span>
        ))}
      </div>
    </div>
  );
}

// ── Nav items ───────────────────────────────────────────────────────────────
const NAV = [
  {id:'overview',   icon:'📊', label:'Overview'},
  {id:'channels',   icon:'📢', label:'Channels'},
  {id:'competitive',icon:'⚔️', label:'Competitive'},
  {id:'insights',   icon:'💡', label:'Growth Insights'},
  {id:'calendar',   icon:'📅', label:'Content Calendar'},
  {id:'youtube',    icon:'▶️', label:'YT Calendar'},
  {id:'masterclass',icon:'🎓', label:'Master Classes'},
  {id:'promotions', icon:'📣', label:'Promotions'},
  {id:'automation', icon:'🤖', label:'Automation'},
  {id:'integrations',icon:'🔗',label:'Integrations'},
];

// ── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, totalSubs, lastFetched }) {
  return (
    <div style={{ width:220,minHeight:'100vh',background:'#0f172a',display:'flex',flexDirection:'column',flexShrink:0,position:'sticky',top:0 }}>
      <div style={{ padding:'24px 20px 16px' }}>
        <div style={{ fontSize:13,fontWeight:800,color:'#3b82f6',letterSpacing:'0.08em',marginBottom:2 }}>TESTBOOK</div>
        <div style={{ fontSize:11,color:'#64748b',fontWeight:500 }}>UGC NET Intelligence Hub</div>
      </div>
      <div style={{ padding:'0 12px',flex:1 }}>
        {NAV.map(n => (
          <button key={n.id} onClick={()=>onNav(n.id)} style={{ width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',cursor:'pointer',marginBottom:2,textAlign:'left',fontSize:13,fontWeight:active===n.id?700:500,background:active===n.id?'#1e3a5f':'transparent',color:active===n.id?'#60a5fa':'#94a3b8',transition:'all 0.1s' }}>
            <span style={{ fontSize:15 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
      <div style={{ padding:'16px 20px',borderTop:'1px solid #1e293b' }}>
        <div style={{ fontSize:11,color:'#64748b',marginBottom:4 }}>Total Subscribers</div>
        <div style={{ fontSize:18,fontWeight:800,color:'#f1f5f9' }}>{totalSubs>0?totalSubs.toLocaleString('en-IN'):'—'}</div>
        <div style={{ fontSize:9,color:'#475569',marginTop:4 }}>{lastFetched?`Live · ${lastFetched}`:'Fetching...'}</div>
      </div>
    </div>
  );
}

// ── Section header ──────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:22,fontWeight:800,color:'#0f172a',display:'flex',alignItems:'center',gap:10 }}><span>{icon}</span>{title}</div>
      {subtitle && <div style={{ fontSize:13,color:'#64748b',marginTop:4 }}>{subtitle}</div>}
    </div>
  );
}

// ── Metric card ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, color='#3b82f6', trend, sparkData }) {
  return (
    <div style={{ background:'white',borderRadius:12,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderTop:`3px solid ${color}`,display:'flex',flexDirection:'column',gap:4 }}>
      <div style={{ fontSize:11,color:'#64748b',fontWeight:600,letterSpacing:'0.05em' }}>{label}</div>
      <div style={{ fontSize:22,fontWeight:800,color:'#0f172a' }}>{value}</div>
      {sub && <div style={{ fontSize:11,color:'#94a3b8' }}>{sub}</div>}
      {sparkData && <Sparkline data={sparkData} color={color} />}
      {trend && <div style={{ fontSize:11,fontWeight:600,color:trend>0?'#16a34a':'#dc2626' }}>{trend>0?'▲':'▼'} {Math.abs(trend)}% vs last week</div>}
    </div>
  );
}



// ── Pulse card (Overview KPIs — real data only) ────────────────────────────
function PulseCard({ label, value, sub, delta, tag, color }) {
  const tagStyles = {
    LIVE:     { bg:'#dcfce7', fg:'#15803d' },
    ALERT:    { bg:'#fef3c7', fg:'#b45309' },
    SNAPSHOT: { bg:'#dbeafe', fg:'#1d4ed8' },
    OK:       { bg:'#e0f2fe', fg:'#0369a1' },
  };
  const t = tagStyles[tag] || tagStyles.LIVE;
  const deltaColor = delta == null ? '#64748b' : delta > 0 ? '#10b981' : delta < 0 ? '#dc2626' : '#64748b';
  return (
    <div style={{ background:'white',borderRadius:12,padding:'14px 16px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderTop:`3px solid ${color}` }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
        <div style={{ fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.05em' }}>{label}</div>
        <span style={{ fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:4,background:t.bg,color:t.fg }}>{tag}</span>
      </div>
      <div style={{ fontSize:22,fontWeight:800,color:'#0f172a',marginBottom:4,lineHeight:1.1 }}>{value}</div>
      {sub && <div style={{ fontSize:11,color:deltaColor,fontWeight:500 }}>{sub}</div>}
    </div>
  );
}

// ── Overview section — operator's morning briefing (real data only) ────────
function OverviewSection({ channels, postCounts = {}, postItems = {}, lastFetched, onNavigate, snapshots = {} }) {
  // Date keys in IST — must match how /api/posts and /api/snapshots key their data
  const istDate    = (offsetDays = 0) => new Date(Date.now() + offsetDays * 86400000).toLocaleDateString('sv-SE', { timeZone: 'Asia/Kolkata' });
  const today      = istDate(0);
  const yesterday  = istDate(-1);
  const sevenAgo   = istDate(-7);
  const todayLabel = new Date().toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long', timeZone:'Asia/Kolkata' });

  // Real subscriber metrics — from /api/channels (live Bot API)
  const totalSubs = channels.reduce((a,c)=>a+c.subs,0);

  // Subscriber deltas — Supabase-backed snapshots from /api/snapshots
  const ySnap = snapshots[yesterday] || null;
  const wSnap = snapshots[sevenAgo]  || null;
  const subsYesterday = ySnap ? Object.values(ySnap).reduce((a,v)=>a+(Number(v)||0),0) : null;
  const subsWeekAgo   = wSnap ? Object.values(wSnap).reduce((a,v)=>a+(Number(v)||0),0) : null;
  const delta1d = subsYesterday !== null ? totalSubs - subsYesterday : null;
  const delta7d = subsWeekAgo   !== null ? totalSubs - subsWeekAgo   : null;

  // Real post metrics — from /api/posts (Bot API getUpdates, last 48h)
  const todayCounts     = postCounts[today]     || {};
  const yesterdayCounts = postCounts[yesterday] || {};
  const postsToday      = Object.values(todayCounts).reduce((a,v)=>a+v,0);
  const postsYesterday  = Object.values(yesterdayCounts).reduce((a,v)=>a+v,0);

  const activeToday = channels.filter(c => (todayCounts[c.username.toLowerCase()] || 0) > 0).length;
  const idleToday   = channels.length - activeToday;

  // "Quiet" = no posts in either today or yesterday (full 48h Bot API window)
  const silentChannels = channels.filter(c => {
    const u = c.username.toLowerCase();
    return (todayCounts[u] || 0) === 0 && (yesterdayCounts[u] || 0) === 0;
  });

  // Per-channel posting tiles (sorted by activity desc, then subs desc)
  const channelTiles = channels.map(c => {
    const u = c.username.toLowerCase();
    return { ...c, postsToday: todayCounts[u] || 0, posts48h: (todayCounts[u]||0) + (yesterdayCounts[u]||0) };
  }).sort((a,b)=> b.postsToday - a.postsToday || b.subs - a.subs);

  const topActiveToday = [...channelTiles].filter(c=>c.postsToday>0).slice(0,5);

  // Today's post-type breakdown (real, from postItems)
  const typeBreakdown = {};
  const todayItems = postItems[today] || {};
  Object.values(todayItems).forEach(arr => arr.forEach(p => {
    const key = normalizeType(p.type);
    typeBreakdown[key] = (typeBreakdown[key] || 0) + 1;
  }));
  const typeEntries  = Object.entries(typeBreakdown).sort((a,b)=>b[1]-a[1]);
  const maxTypeCount = typeEntries.length ? typeEntries[0][1] : 0;

  // Format helpers
  const fmtDelta = (d) => d == null ? '—' : `${d >= 0 ? '+' : ''}${d.toLocaleString('en-IN')}`;

  return (
    <div>
      <SectionHeader
        icon="📊"
        title="Overview"
        subtitle={`Your morning briefing · ${todayLabel}${lastFetched ? ` · Last sync ${lastFetched}` : ''}`}
      />

      {/* Quick actions row */}
      <div style={{ display:'flex',gap:8,marginBottom:16,flexWrap:'wrap' }}>
        <button onClick={()=>window.location.reload()} style={{ background:'#0f172a',color:'white',border:'none',borderRadius:8,padding:'8px 14px',fontSize:12,fontWeight:600,cursor:'pointer' }}>↻ Refresh live data</button>
        <button onClick={()=>onNavigate?.('calendar')}    style={{ background:'white',color:'#0f172a',border:'1px solid #e2e8f0',borderRadius:8,padding:'8px 14px',fontSize:12,fontWeight:600,cursor:'pointer' }}>📅 Generate today's calendar</button>
        <button onClick={()=>onNavigate?.('channels')}    style={{ background:'white',color:'#0f172a',border:'1px solid #e2e8f0',borderRadius:8,padding:'8px 14px',fontSize:12,fontWeight:600,cursor:'pointer' }}>📢 Inspect channels</button>
        <button onClick={()=>onNavigate?.('insights')}    style={{ background:'white',color:'#0f172a',border:'1px solid #e2e8f0',borderRadius:8,padding:'8px 14px',fontSize:12,fontWeight:600,cursor:'pointer' }}>💡 Growth insights</button>
      </div>

      {/* PULSE STRIP — only real data, never fabricated */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14,marginBottom:20 }}>
        <PulseCard
          label="TOTAL SUBSCRIBERS"
          value={totalSubs.toLocaleString('en-IN')}
          sub={delta1d !== null ? `${fmtDelta(delta1d)} vs yesterday` : 'First snapshot lands at 9 AM IST tomorrow'}
          delta={delta1d}
          tag="LIVE"
          color="#3b82f6"
        />
        <PulseCard
          label="POSTS TODAY"
          value={postsToday}
          sub={`${postsYesterday} yesterday · ${fmtDelta(postsToday - postsYesterday)}`}
          delta={postsToday - postsYesterday}
          tag="LIVE"
          color="#10b981"
        />
        <PulseCard
          label="ACTIVE CHANNELS"
          value={`${activeToday} / ${channels.length}`}
          sub={`${idleToday} haven't posted today`}
          tag="LIVE"
          color="#8b5cf6"
        />
        <PulseCard
          label="QUIET IN 48H"
          value={silentChannels.length}
          sub={silentChannels.length === 0 ? 'All channels publishing' : 'Needs your nudge'}
          tag={silentChannels.length === 0 ? 'OK' : 'ALERT'}
          color={silentChannels.length === 0 ? '#10b981' : '#f59e0b'}
        />
        <PulseCard
          label="7-DAY GROWTH"
          value={delta7d !== null ? fmtDelta(delta7d) : '—'}
          sub={delta7d !== null ? 'vs 7 days ago' : 'Building history — needs 7 days of cron snapshots'}
          delta={delta7d}
          tag="SNAPSHOT"
          color="#06b6d4"
        />
      </div>

      {/* TODAY'S POSTING STATUS — 25-channel grid */}
      <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginBottom:16 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:8 }}>
          <div style={{ fontSize:13,fontWeight:700,color:'#0f172a' }}>📡 Today's Posting Status — all 25 channels</div>
          <div style={{ fontSize:11,color:'#64748b',display:'flex',gap:14 }}>
            <span><span style={{ color:'#10b981' }}>●</span> 3+ posts</span>
            <span><span style={{ color:'#f59e0b' }}>●</span> 1–2 posts</span>
            <span><span style={{ color:'#dc2626' }}>●</span> none</span>
          </div>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10 }}>
          {channelTiles.map(c => {
            const status = c.postsToday >= 3 ? 'green' : c.postsToday >= 1 ? 'yellow' : 'red';
            const color  = status === 'green' ? '#10b981' : status === 'yellow' ? '#f59e0b' : '#dc2626';
            const bg     = status === 'green' ? '#f0fdf4' : status === 'yellow' ? '#fffbeb' : '#fef2f2';
            return (
              <div
                key={c.username}
                onClick={()=>onNavigate?.('channels')}
                title={`@${c.username} · click to inspect`}
                style={{ background:bg,border:`1px solid ${color}33`,borderRadius:8,padding:'10px 12px',cursor:'pointer',transition:'transform .15s ease' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 2px 6px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:6 }}>
                  <span style={{ width:7,height:7,borderRadius:'50%',background:color,flexShrink:0 }} />
                  <div style={{ fontSize:11,fontWeight:600,color:'#0f172a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                    {c.subject}{c.teacher?` · ${c.teacher}`:''}
                  </div>
                </div>
                <div style={{ display:'flex',alignItems:'baseline',justifyContent:'space-between' }}>
                  <span style={{ fontSize:18,fontWeight:800,color }}>{c.postsToday}</span>
                  <span style={{ fontSize:10,color:'#64748b' }}>{c.subs.toLocaleString('en-IN')} subs</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TWO-COLUMN: Most Active vs Quiet */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16 }}>
        <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:14 }}>🔥 Most Active Today</div>
          {topActiveToday.length === 0 ? (
            <div style={{ color:'#94a3b8',fontSize:13 }}>No posts published today yet. {postsYesterday > 0 ? `${postsYesterday} posts went out yesterday.` : ''}</div>
          ) : topActiveToday.map((c,i)=>(
            <div key={c.username} onClick={()=>onNavigate?.('channels')} style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10,cursor:'pointer' }}>
              <span style={{ fontSize:12,fontWeight:700,color:'#10b981',width:16 }}>#{i+1}</span>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:12,fontWeight:600,color:'#0f172a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.subject}{c.teacher?` · ${c.teacher}`:''}</div>
                <div style={{ fontSize:10,color:'#94a3b8' }}>@{c.username}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:13,fontWeight:700,color:'#0f172a' }}>{c.postsToday} {c.postsToday===1?'post':'posts'}</div>
                <div style={{ fontSize:9,color:'#94a3b8' }}>{c.subs.toLocaleString('en-IN')} subs</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:14 }}>⚠️ Quiet in Last 48h</div>
          {silentChannels.length === 0 ? (
            <div style={{ color:'#10b981',fontSize:13 }}>✅ Every channel posted in the last 48 hours.</div>
          ) : (
            <>
              {silentChannels.slice(0,5).map(c=>(
                <div key={c.username} onClick={()=>onNavigate?.('channels')} style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10,cursor:'pointer' }}>
                  <span style={{ fontSize:14 }}>🔴</span>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:12,fontWeight:600,color:'#0f172a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.subject}{c.teacher?` · ${c.teacher}`:''}</div>
                    <div style={{ fontSize:10,color:'#94a3b8' }}>@{c.username}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11,fontWeight:600,color:'#dc2626' }}>0 posts / 48h</div>
                    <div style={{ fontSize:9,color:'#94a3b8' }}>{c.subs.toLocaleString('en-IN')} subs</div>
                  </div>
                </div>
              ))}
              {silentChannels.length > 5 && <div style={{ fontSize:11,color:'#64748b',marginTop:8 }}>+ {silentChannels.length - 5} more quiet channels — see Channels section</div>}
            </>
          )}
        </div>
      </div>

      {/* TODAY'S CONTENT MIX */}
      <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginBottom:16 }}>
        <div style={{ fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:14 }}>📝 Today's Content Mix — {postsToday} posts across {activeToday} channels</div>
        {typeEntries.length === 0 ? (
          <div style={{ color:'#94a3b8',fontSize:13 }}>No posts published today yet. <button onClick={()=>onNavigate?.('calendar')} style={{ background:'none',border:'none',color:'#3b82f6',fontWeight:600,cursor:'pointer',padding:0,fontSize:13 }}>Generate today's plan →</button></div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            {typeEntries.map(([t,n])=>{
              const pct = Math.round(n/maxTypeCount*100);
              const color = TYPE_COLOR[t] || '#64748b';
              const icon  = TYPE_ICON[t]  || '📌';
              return (
                <div key={t} style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <div style={{ width:160,fontSize:11,color:'#374151',flexShrink:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{icon} {t}</div>
                  <div style={{ flex:1,background:'#f1f5f9',borderRadius:4,height:8,overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`,height:'100%',background:color,borderRadius:4 }} />
                  </div>
                  <div style={{ width:60,fontSize:11,fontWeight:600,color:'#374151',textAlign:'right',flexShrink:0 }}>{n} {n===1?'post':'posts'}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* HONEST GAP CALLOUT */}
      <details style={{ background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:10,padding:'12px 16px' }}>
        <summary style={{ fontSize:12,fontWeight:600,color:'#475569',cursor:'pointer',userSelect:'none' }}>
          🔎 What's on this dashboard and why
        </summary>
        <div style={{ fontSize:11,color:'#64748b',lineHeight:1.7,marginTop:10 }}>
          <strong>Posts:</strong> captured live by webhook — Telegram pushes each post the moment it goes out, we store it in Supabase. Survives across devices, no data loss.<br/>
          <strong>Subscriber growth:</strong> daily snapshot at 9 AM IST via Vercel Cron → Supabase. 7-day delta needs ≥7 days of cron runs.<br/>
          <strong>What's still not possible:</strong> per-post view counts, forwards, engagement rate, joined/left counts — Telegram Bot API doesn't expose these. Would need MTProto user-bot integration.<br/>
          <strong>Idle alert window:</strong> 48 hours (today + yesterday) — we have full history beyond this but the alert intentionally uses a tight window.
        </div>
      </details>
    </div>
  );
}

// ── Channels section ────────────────────────────────────────────────────────
function ChannelsSection({ channels, selectedDate, onDateChange, postCounts, postItems }) {
  const [search,     setSearch]     = useState('');
  const [sortBy,     setSortBy]     = useState('subs');
  const [expanded,   setExpanded]   = useState(null);
  const [filterSubj, setFilterSubj] = useState('All');

  const today     = new Date().toISOString().slice(0,10);
  const yesterday = new Date(Date.now()-864e5).toISOString().slice(0,10);
  const dates     = [{ key:today, label:'Today' },{ key:yesterday, label:'Yesterday' }];
  const subjects  = ['All', ...Array.from(new Set(channels.map(c=>c.subject)))];

  const getPostCnt = (ch, date) => postCounts?.[date]?.[ch.username.toLowerCase()] || 0;
  const getPosts   = (ch, date) => postItems?.[date]?.[ch.username.toLowerCase()] || [];

  // Real content-type breakdown from actual posts
  const typeBreakdown = (posts) => {
    const map = {};
    posts.forEach(p => { map[p.type] = (map[p.type]||0)+1; });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]);
  };

  const filtered = channels
    .filter(c =>
      (filterSubj==='All' || c.subject===filterSubj) &&
      (c.subject.toLowerCase().includes(search.toLowerCase()) ||
       (c.title||'').toLowerCase().includes(search.toLowerCase()) ||
       c.username.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a,b) => {
      if (sortBy==='posts') return getPostCnt(b,selectedDate)-getPostCnt(a,selectedDate);
      return b.subs-a.subs;
    });

  return (
    <div>
      <SectionHeader icon="📢" title="Channels" subtitle={`${channels.length} UGC NET Telegram channels · live subscriber counts`} />

      {/* Date picker — only today/yesterday since posts API covers 48h */}
      <div style={{ display:'flex',gap:8,marginBottom:16 }}>
        {dates.map(d=>(
          <button key={d.key} onClick={()=>onDateChange(d.key)} style={{ padding:'6px 18px',borderRadius:20,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:selectedDate===d.key?'#3b82f6':'#e2e8f0',color:selectedDate===d.key?'white':'#374151' }}>{d.label}</button>
        ))}
        <div style={{ marginLeft:'auto',background:'#dcfce7',border:'1px solid #bbf7d0',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:700,color:'#15803d' }}>● Subscribers: LIVE from Telegram</div>
      </div>

      {/* Search + Sort + Subject filter */}
      <div style={{ display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search channels…" style={{ padding:'7px 12px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,outline:'none',width:200 }} />
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ padding:'7px 12px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,outline:'none',cursor:'pointer' }}>
          <option value="subs">Sort: Subscribers</option>
          <option value="posts">Sort: Posts today</option>
        </select>
        <div style={{ display:'flex',gap:6,overflowX:'auto',flexWrap:'wrap' }}>
          {subjects.map(s=>(
            <button key={s} onClick={()=>setFilterSubj(s)} style={{ padding:'4px 12px',borderRadius:20,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,whiteSpace:'nowrap',background:filterSubj===s?'#0f172a':'#f1f5f9',color:filterSubj===s?'white':'#374151' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Channel cards */}
      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
        {filtered.map(ch => {
          const postCnt  = getPostCnt(ch, selectedDate);
          const posts    = getPosts(ch, selectedDate);
          const isExp    = expanded === ch.username;
          const breakdown= typeBreakdown(posts);

          // Activity-based border: green = posted today, yellow = only yesterday, gray = silent
          const todayPosts = getPostCnt(ch, today);
          const yestPosts  = getPostCnt(ch, yesterday);
          const borderColor = todayPosts>0 ? '#10b981' : yestPosts>0 ? '#f59e0b' : '#e2e8f0';
          const activityBadge = todayPosts>0
            ? { bg:'#dcfce7',color:'#15803d',text:`✅ ${todayPosts} posts today` }
            : yestPosts>0
            ? { bg:'#fef3c7',color:'#92400e',text:`⚠️ ${yestPosts} posts yesterday` }
            : { bg:'#fee2e2',color:'#991b1b',text:'🔴 No recent posts' };

          return (
            <div key={ch.username} style={{ background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderLeft:`4px solid ${borderColor}` }}>
              {/* Card header */}
              <div style={{ padding:'14px 16px',cursor:'pointer' }} onClick={()=>setExpanded(isExp?null:ch.username)}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
                  <div style={{ minWidth:0,flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:700,color:'#0f172a',marginBottom:4 }}>
                      {ch.title||ch.subject}
                      {ch.teacher ? <span style={{ fontWeight:400,color:'#64748b',fontSize:13 }}> · {ch.teacher}</span> : null}
                    </div>
                    <div style={{ display:'flex',gap:6,alignItems:'center',flexWrap:'wrap' }}>
                      <a href={`https://t.me/${ch.username}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:11,color:'#3b82f6',textDecoration:'none' }}>@{ch.username} ↗</a>
                      <span style={{ background:'#dbeafe',color:'#1e40af',padding:'1px 7px',borderRadius:20,fontSize:9,fontWeight:700 }}>{ch.subject}</span>
                      <span style={{ background:'#dcfce7',color:'#15803d',padding:'1px 7px',borderRadius:20,fontSize:9,fontWeight:700 }}>● {ch.subs.toLocaleString('en-IN')} subs</span>
                      <span style={{ background:activityBadge.bg,color:activityBadge.color,padding:'1px 7px',borderRadius:20,fontSize:9,fontWeight:700 }}>{activityBadge.text}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0,marginLeft:12 }}>
                    <span style={{ fontSize:18,fontWeight:800,color:'#0f172a' }}>{ch.subs.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize:10,color:'#94a3b8' }}>{isExp?'▲ collapse':'▼ expand'}</span>
                  </div>
                </div>
              </div>

              {/* Expanded panel */}
              {isExp && (
                <div style={{ borderTop:'1px solid #f1f5f9',background:'#f8fafc',padding:'14px 16px' }}>

                  {/* Posts for selected date */}
                  {posts.length > 0 ? (
                    <div style={{ marginBottom:14 }}>
                      <div style={{ fontSize:10,fontWeight:700,color:'#64748b',letterSpacing:'0.05em',marginBottom:8 }}>
                        POSTS — {selectedDate===today?'TODAY':selectedDate===yesterday?'YESTERDAY':selectedDate} (real from Telegram · {posts.length} total)
                      </div>
                      <div style={{ display:'flex',flexDirection:'column',gap:5 }}>
                        {posts.map((p,i) => (
                          <div key={i} style={{ display:'flex',gap:8,alignItems:'flex-start',background:'white',borderRadius:8,padding:'7px 10px',boxShadow:'0 1px 2px rgba(0,0,0,0.04)' }}>
                            <span style={{ fontSize:10,color:'#94a3b8',whiteSpace:'nowrap',flexShrink:0,marginTop:1,minWidth:55 }}>{p.time}</span>
                            <span style={{ background:typeColor(p.type)+'22',color:typeColor(p.type),fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:10,whiteSpace:'nowrap',flexShrink:0 }}>{typeIcon(p.type)} {p.type}</span>
                            <span style={{ fontSize:11,color:'#374151',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.preview||'(no preview)'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:8,padding:'10px 14px',marginBottom:14,fontSize:12,color:'#9a3412' }}>
                      ⚠️ No posts found for {selectedDate===today?'today':selectedDate===yesterday?'yesterday':selectedDate} in the Telegram bot update window.
                    </div>
                  )}

                  {/* Content type breakdown from real posts */}
                  {breakdown.length > 0 && (
                    <div style={{ marginBottom:14 }}>
                      <div style={{ fontSize:10,fontWeight:700,color:'#64748b',letterSpacing:'0.05em',marginBottom:8 }}>CONTENT TYPE BREAKDOWN (from real posts)</div>
                      <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                        {breakdown.map(([type,count]) => (
                          <span key={type} style={{ background:typeColor(type)+'18',color:typeColor(type),border:`1px solid ${typeColor(type)}44`,padding:'4px 10px',borderRadius:20,fontSize:11,fontWeight:700 }}>
                            {typeIcon(type)} {type} · {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Channel description from Telegram */}
                  {ch.description && (
                    <div style={{ background:'white',borderRadius:8,padding:'10px 12px',fontSize:11,color:'#64748b',lineHeight:1.6,borderLeft:'3px solid #e2e8f0' }}>
                      <div style={{ fontSize:10,fontWeight:700,color:'#94a3b8',marginBottom:4 }}>CHANNEL DESCRIPTION (from Telegram)</div>
                      {ch.description.slice(0,200)}{ch.description.length>200?'…':''}
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

// ── Competitive section ─────────────────────────────────────────────────────
function CompetitiveSection({ channels, competitorData, competitorLoading }) {
  const [filterSubj, setFilterSubj] = useState('All');
  const allSubjects = ['All', ...Object.keys(COMPETITORS)];

  const rows = Object.entries(COMPETITORS)
    .filter(([subj]) => filterSubj==='All' || subj===filterSubj)
    .map(([subj, compUsernames]) => {
      const ownChs  = channels.filter(c=>c.subject===subj);
      const ownMax  = Math.max(...ownChs.map(c=>c.subs), 0);
      const compEntries = compUsernames.map(u=>({ u, subs:competitorData[u.toLowerCase()]?.subscribers||0, title:competitorData[u.toLowerCase()]?.title||u })).filter(e=>e.subs>0).sort((a,b)=>b.subs-a.subs);
      const topComp = compEntries[0];
      const ahead   = !topComp || ownMax >= topComp.subs;
      return { subj, ownChs, ownMax, compEntries, topComp, ahead };
    });

  return (
    <div>
      <SectionHeader icon="⚔️" title="Competitive Intelligence" subtitle="Live subscriber comparison vs tracked competitor channels" />
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:14,marginBottom:24 }}>
        <MetricCard label="SUBJECTS WE LEAD"    value={`${rows.filter(r=>r.ahead).length}/${rows.length}`} color="#10b981" />
        <MetricCard label="SUBJECTS BEHIND"     value={rows.filter(r=>!r.ahead).length} color="#dc2626" />
        <MetricCard label="COMPETITORS TRACKED" value={Object.values(COMPETITORS).flat().length} color="#8b5cf6" />
        {competitorLoading && <MetricCard label="STATUS" value="Loading..." color="#f59e0b" sub="Fetching live data" />}
      </div>
      <div style={{ display:'flex',gap:6,marginBottom:16,overflowX:'auto',paddingBottom:4 }}>
        {allSubjects.map(s=><button key={s} onClick={()=>setFilterSubj(s)} style={{ padding:'5px 12px',borderRadius:20,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,whiteSpace:'nowrap',background:filterSubj===s?'#0f172a':'#f1f5f9',color:filterSubj===s?'white':'#374151' }}>{s}</button>)}
      </div>
      {competitorLoading ? (
        <div style={{ background:'white',borderRadius:12,padding:40,textAlign:'center',color:'#64748b' }}>
          <div style={{ width:32,height:32,border:'3px solid #e2e8f0',borderTop:'3px solid #3b82f6',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 12px' }} />
          Fetching live competitor data from Telegram...
        </div>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
          {rows.map(({ subj, ownChs, ownMax, compEntries, topComp, ahead })=>(
            <div key={subj} style={{ background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ padding:'12px 16px',background:ahead?'#f0fdf4':'#fef2f2',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                  <span>{ahead?'🟢':'🔴'}</span>
                  <span style={{ fontWeight:700,fontSize:14,color:'#0f172a' }}>{subj}</span>
                  <span style={{ fontSize:11,color:'#64748b' }}>· {ownChs.map(c=>c.title||c.subject).join(', ')}</span>
                </div>
                <span style={{ fontSize:12,fontWeight:700,color:ahead?'#16a34a':'#dc2626' }}>
                  {ahead?`Leading · ${ownMax.toLocaleString('en-IN')} subs`:`Behind · Top: ${topComp?.subs.toLocaleString('en-IN')}`}
                </span>
              </div>
              {compEntries.length>0&&(
                <div style={{ padding:'10px 16px' }}>
                  {compEntries.slice(0,3).map(e=>{
                    const behind = e.subs > ownMax;
                    const diff   = Math.abs(e.subs - ownMax);
                    return (
                      <div key={e.u} style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
                        <a href={`https://t.me/${e.u}`} target="_blank" rel="noopener noreferrer" style={{ fontSize:12,color:'#3b82f6',textDecoration:'none',width:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{e.title}</a>
                        <div style={{ flex:1,background:'#f1f5f9',borderRadius:4,height:6 }}>
                          <div style={{ width:`${Math.min(100,e.subs/Math.max(ownMax,e.subs)*100)}%`,height:'100%',background:behind?'#dc2626':'#10b981',borderRadius:4 }} />
                        </div>
                        <span style={{ fontSize:12,fontWeight:700,color:behind?'#dc2626':'#10b981',flexShrink:0 }}>{e.subs.toLocaleString('en-IN')} {behind?`(+${diff.toLocaleString('en-IN')})`:`(-${diff.toLocaleString('en-IN')})`}</span>
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

// ── Insights section ────────────────────────────────────────────────────────
function InsightsSection({ channels, competitorData, selectedDate }) {
  const subjects = Array.from(new Set(channels.map(c=>c.subject)));
  const [selSubj, setSelSubj] = useState(subjects[0]||'Common');
  const [loading, setLoading]  = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError]      = useState(null);

  const fetchInsights = useCallback(async (subj) => {
    setLoading(true); setError(null); setInsights(null);
    const ownChs  = channels.filter(c=>c.subject===subj);
    const comps   = (COMPETITORS[subj]||[]).map(u=>({ username:u, title:competitorData[u.toLowerCase()]?.title||u, subscribers:competitorData[u.toLowerCase()]?.subscribers||0 })).filter(e=>e.subscribers>0).sort((a,b)=>b.subscribers-a.subscribers);
    const summary = ownChs.map(c=>({ channel:c.title||c.subject, username:c.username, subscribers:c.subs, viewRate:c.rate, avgViews:c.avgViews, postsPerWeek:c.posts, joined:c.joined, left:c.left, contentTypes:c.contentTypes }));
    try {
      const res  = await fetch('/api/channels',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ subject:subj, channelSummary:summary, compDetails:comps, selectedDate:new Date(selectedDate+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) }) });
      const data = await res.json();
      data.success ? setInsights(data.insights) : setError(data.error||'Failed to generate');
    } catch { setError('Network error. Please retry.'); }
    setLoading(false);
  },[channels, competitorData, selectedDate]);

  useEffect(()=>{ fetchInsights(selSubj); },[selSubj]);

  const sev = { high:'#dc2626',medium:'#d97706',low:'#16a34a' };
  const sevBg = { high:'#fee2e2',medium:'#fef3c7',low:'#dcfce7' };

  return (
    <div>
      <SectionHeader icon="💡" title="Growth Insights" subtitle="AI-powered analysis — auto-generates when you select a subject" />
      <div style={{ background:'white',borderRadius:12,padding:'16px 18px',marginBottom:20,boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize:11,fontWeight:700,color:'#64748b',letterSpacing:'0.05em',marginBottom:10 }}>SELECT SUBJECT — insights generate automatically</div>
        <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
          {subjects.map(s=>(
            <button key={s} onClick={()=>setSelSubj(s)} disabled={loading} style={{ padding:'5px 14px',borderRadius:20,border:'none',cursor:loading?'default':'pointer',fontSize:12,fontWeight:600,background:selSubj===s?'#3b82f6':'#f1f5f9',color:selSubj===s?'white':'#374151',opacity:loading&&selSubj!==s?0.5:1 }}>{s}</button>
          ))}
        </div>
      </div>
      {loading&&<div style={{ background:'white',borderRadius:12,padding:48,textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ width:36,height:36,border:'3px solid #e2e8f0',borderTop:'3px solid #3b82f6',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 14px' }} />
        <div style={{ fontWeight:600,color:'#0f172a' }}>Analysing {selSubj}…</div>
        <div style={{ fontSize:12,color:'#94a3b8',marginTop:4 }}>Claude is reading your live data + competitor channels</div>
      </div>}
      {!loading&&error&&<div style={{ background:'#fee2e2',color:'#dc2626',padding:'14px 18px',borderRadius:10,fontSize:13,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <span>⚠️ {error}</span><button onClick={()=>fetchInsights(selSubj)} style={{ background:'#dc2626',color:'white',border:'none',borderRadius:6,padding:'4px 12px',cursor:'pointer',fontSize:12 }}>Retry</button>
      </div>}
      {!loading&&insights&&(
        <div style={{ display:'flex',flexDirection:'column',gap:18 }}>
          {insights.healthInsights?.length>0&&(
            <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize:15,fontWeight:700,color:'#0f172a',marginBottom:14 }}>📊 Channel Health ({insights.healthInsights.length})</div>
              <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                {insights.healthInsights.map((item,i)=>(
                  <div key={i} style={{ borderLeft:`4px solid ${sev[item.severity]||'#94a3b8'}`,paddingLeft:14,paddingTop:6,paddingBottom:6,background:(sevBg[item.severity]||'#f9fafb')+'55',borderRadius:'0 8px 8px 0' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6,flexWrap:'wrap',gap:6 }}>
                      <div style={{ display:'flex',gap:8 }}>
                        <span style={{ fontWeight:700,fontSize:13,color:'#0f172a' }}>{item.channel}</span>
                        <span style={{ background:'#f1f5f9',color:'#64748b',padding:'1px 8px',borderRadius:20,fontSize:10 }}>{item.signal}</span>
                      </div>
                      <span style={{ background:sevBg[item.severity],color:sev[item.severity],padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:700 }}>{item.severity==='high'?'🔴':item.severity==='medium'?'🟡':'🟢'} {item.severity}</span>
                    </div>
                    <p style={{ margin:'0 0 4px',fontSize:13,color:'#374151' }}><strong>Observed:</strong> {item.observed}</p>
                    <p style={{ margin:'0 0 4px',fontSize:13,color:'#374151' }}><strong>Hypothesis:</strong> {item.hypothesis}</p>
                    <p style={{ margin:0,fontSize:13,color:'#059669',fontWeight:500 }}><strong>Action:</strong> {item.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {insights.keyInsight&&<div style={{ background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:12,padding:'14px 18px' }}>
            <p style={{ margin:0,fontSize:13,color:'#065f46',lineHeight:1.7 }}><strong>💡 Key Insight:</strong> {insights.keyInsight}</p>
          </div>}
          {insights.contentIdeas?.length>0&&(
            <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize:15,fontWeight:700,color:'#0f172a',marginBottom:14 }}>📝 Content Ideas ({insights.contentIdeas.length})</div>
              {insights.contentIdeas.map((idea,i)=>(
                <div key={i} style={{ borderLeft:'3px solid #3b82f6',paddingLeft:14,marginBottom:14 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:5,flexWrap:'wrap',gap:6 }}>
                    <span style={{ fontWeight:700,fontSize:13,color:'#0f172a' }}>#{i+1} {idea.title}</span>
                    <div style={{ display:'flex',gap:5 }}>
                      <span style={{ background:idea.priority==='high'?'#fee2e2':'#fef3c7',color:idea.priority==='high'?'#dc2626':'#92400e',padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:700 }}>{idea.priority}</span>
                      <span style={{ background:'#f1f5f9',color:'#374151',padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:700 }}>{idea.effort}</span>
                    </div>
                  </div>
                  <p style={{ margin:'0 0 6px',fontSize:13,color:'#374151',lineHeight:1.6 }}>{idea.description}</p>
                  {idea.competitorEvidence&&<div style={{ background:'#fffbeb',border:'1px solid #fde68a',borderRadius:6,padding:'5px 10px',fontSize:11,color:'#92400e',fontStyle:'italic' }}>📊 {idea.competitorEvidence}</div>}
                </div>
              ))}
            </div>
          )}
          {insights.quickWins?.length>0&&(
            <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize:15,fontWeight:700,color:'#0f172a',marginBottom:14 }}>⚡ Quick Wins ({insights.quickWins.length})</div>
              {insights.quickWins.map((win,i)=>(
                <div key={i} style={{ borderLeft:'3px solid #10b981',paddingLeft:14,marginBottom:12 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4,flexWrap:'wrap',gap:5 }}>
                    <span style={{ fontWeight:700,fontSize:13,color:'#0f172a' }}>#{i+1} {win.title}</span>
                    <span style={{ background:'#f1f5f9',color:'#374151',padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:700 }}>{win.effort}</span>
                  </div>
                  <p style={{ margin:'0 0 4px',fontSize:13,color:'#374151',lineHeight:1.6 }}>{win.description}</p>
                  {win.inspiredBy&&<p style={{ margin:0,fontSize:11,color:'#94a3b8' }}>Inspired by: {win.inspiredBy}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Content Calendar section ────────────────────────────────────────────────
function ContentCalendarSection({ channels }) {
  const today = new Date().toISOString().slice(0,10);
  const [selChannel, setSelChannel] = useState(channels[0]?.username||'');
  const [selDate,    setSelDate]    = useState(today);
  const [posts,      setPosts]      = useState(()=>loadCalCache(channels[0]?.username||'', today)||[]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [posting,    setPosting]    = useState(null);
  const [calYear,    setCalYear]    = useState(new Date().getFullYear());
  const [calMonth,   setCalMonth]   = useState(new Date().getMonth());
  // scheduled[date] = [{type,note,id}]  — for the mini calendar dots
  const [scheduled,  setScheduled]  = useState({});

  // Restore from cache when channel or date changes — never wipe cached content
  useEffect(() => {
    const cached = loadCalCache(selChannel, selDate);
    setPosts(cached || []);
    setError(null);
  }, [selChannel, selDate]);

  const channel = channels.find(c=>c.username===selChannel)||channels[0];
  const monthLabel = new Date(calYear,calMonth).toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  const firstDay   = new Date(calYear,calMonth,1).getDay();
  const daysInMonth = new Date(calYear,calMonth+1,0).getDate();

  async function generate() {
    if (!channel) return;
    // Snapshot the channel+date at call time so cache saves correctly even if user switches
    const genChannel = channel.username;
    const genDate = selDate;
    setLoading(true); setError(null);
    try {
      const res  = await fetch('/api/calendar',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ action:'generate', channelUsername:channel.username, channelTitle:channel.title||channel.subject, subject:channel.subject, contentTypes:channel.contentTypes||[], subscribers:channel.subs, bestHours:channel.bestHours||[], date:genDate }) });
      const data = await res.json();
      if (data.success) {
        // Save to localStorage immediately — survives section switches
        saveCalCache(genChannel, genDate, data.posts);
        // Only update UI state if still on same channel+date
        setPosts(data.posts);
        setScheduled(prev => ({
          ...prev,
          [genDate]: data.posts.map(p => ({ type:p.type, note:(p.text||p.question||'').slice(0,40), id:p.id }))
        }));
      } else {
        setError(data.error||'Failed to generate plan');
      }
    } catch { setError('Network error. Please retry.'); }
    setLoading(false);
  }

  async function postSingle(id) {
    const post = posts.find(p=>p.id===id);
    if (!post||!channel) return;
    setPosting(id);
    setPosts(prev=>prev.map(p=>p.id===id?{...p,status:'posting'}:p));
    try {
      const body = { action:'post', channelUsernames:[channel.username], pin:post.pin, type:post.type };
      if (post.type==='MCQ') { body.question=post.question; body.options=post.options; body.correct_option_id=Number(post.correct_option_id); body.explanation=post.explanation; }
      else { body.text=post.text; }
      const res  = await fetch('/api/calendar',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body) });
      const data = await res.json();
      const result = data.results?.[0];
      if (result?.success) {
        setPosts(prev=>prev.map(p=>p.id===id?{...p,status:'posted',messageId:result.messageId,pinned:result.pinned}:p));
        setTimeout(()=>setPosts(prev=>prev.filter(p=>p.id!==id)),2000);
      } else {
        setPosts(prev=>prev.map(p=>p.id===id?{...p,status:'failed',error:result?.error||'Failed'}:p));
      }
    } catch { setPosts(prev=>prev.map(p=>p.id===id?{...p,status:'failed',error:'Network error'}:p)); }
    setPosting(null);
  }

  async function postAll() {
    for (const p of posts.filter(p=>p.status==='pending'||!p.status)) await postSingle(p.id);
  }

  const pendingCount = posts.filter(p=>p.status==='pending'||!p.status).length;

  return (
    <div>
      <SectionHeader icon="📅" title="Content Calendar" subtitle="AI-generated day plans · one-click post & pin to Telegram" />
      <div style={{ display:'grid',gridTemplateColumns:'1fr 340px',gap:20,alignItems:'start' }}>
        {/* Left — generator + posts */}
        <div>
          <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginBottom:16 }}>
            <div style={{ display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-end' }}>
              <div style={{ flex:1,minWidth:180 }}>
                <label style={{ display:'block',fontSize:11,fontWeight:700,color:'#64748b',marginBottom:5 }}>CHANNEL</label>
                <select value={selChannel} onChange={e=>{setSelChannel(e.target.value);}} style={{ width:'100%',padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,outline:'none',cursor:'pointer' }}>
                  {channels.map(c=><option key={c.username} value={c.username}>{c.title||c.subject}{c.teacher?` — ${c.teacher}`:''} ({(c.subs||0).toLocaleString('en-IN')} subs)</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block',fontSize:11,fontWeight:700,color:'#64748b',marginBottom:5 }}>DATE</label>
                <input type="date" value={selDate} onChange={e=>{setSelDate(e.target.value);}} style={{ padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,outline:'none',cursor:'pointer' }} />
              </div>
              <button onClick={generate} disabled={loading} style={{ padding:'9px 20px',background:loading?'#94a3b8':'#3b82f6',color:'white',border:'none',borderRadius:8,cursor:loading?'not-allowed':'pointer',fontSize:13,fontWeight:700,display:'flex',alignItems:'center',gap:6,flexShrink:0 }}>
                {loading?<><span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,0.4)',borderTop:'2px solid white',borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block' }} /> Generating…</>:'✨ Generate Day Plan'}
              </button>
            </div>
            {channel&&<div style={{ marginTop:10,fontSize:11,color:'#94a3b8' }}>Best hours: {channel.bestHours?.join(', ')||'Not set'} · Subject: {channel.subject}</div>}
          </div>
          {error&&<div style={{ background:'#fee2e2',color:'#dc2626',padding:'12px 16px',borderRadius:10,fontSize:13,marginBottom:16,display:'flex',justifyContent:'space-between' }}>
            <span>⚠️ {error}</span><button onClick={()=>setError(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'#dc2626',fontWeight:700 }}>✕</button>
          </div>}
          {posts.length>0&&(
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
              <div style={{ fontSize:13,fontWeight:700,color:'#0f172a' }}>📋 {posts.length} posts planned for {channel?.title||channel?.subject} · {new Date(selDate+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
              {pendingCount>0&&<button onClick={postAll} disabled={!!posting} style={{ padding:'7px 16px',background:'#10b981',color:'white',border:'none',borderRadius:8,cursor:posting?'not-allowed':'pointer',fontSize:12,fontWeight:700 }}>📤 Post All ({pendingCount} pending)</button>}
            </div>
          )}
          {posts.length===0&&!loading&&(
            <div style={{ background:'white',borderRadius:12,padding:'36px 24px',textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize:32,marginBottom:10 }}>✨</div>
              <div style={{ fontWeight:700,color:'#0f172a',fontSize:15,marginBottom:6 }}>No plan generated yet</div>
              <div style={{ fontSize:12,color:'#94a3b8',marginBottom:16 }}>Select a channel and date, then click "Generate Day Plan".<br/>Claude will write Telegram-ready posts for the whole day.</div>
              <div style={{ background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:10,padding:'12px 16px',fontSize:12,color:'#0369a1',textAlign:'left',maxWidth:420,margin:'0 auto' }}>
                <strong>💡 Tip:</strong> If this channel has no YouTube or Master Class scheduled for this date, the AI will suggest what video topic could be planned — add those ideas to your YT Calendar section.
              </div>
            </div>
          )}
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            {posts.map(post=>{
              const normType = normalizeType(post.type);
              const color    = TYPE_COLOR[normType]||'#64748b';
              const icon     = TYPE_ICON[normType]||'📌';
              const isPosting = post.status==='posting';
              const isPosted  = post.status==='posted';
              const isFailed  = post.status==='failed';
              return (
                <div key={post.id} style={{ background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderLeft:`4px solid ${isPosted?'#10b981':isFailed?'#dc2626':color}`,opacity:isPosted?0.6:1,transition:'opacity 0.5s' }}>
                  <div style={{ padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #f1f5f9' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                      <span style={{ background:'#0f172a',color:'white',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:12 }}>{post.time}</span>
                      <span style={{ background:color+'22',color,fontSize:11,fontWeight:700,padding:'2px 9px',borderRadius:12 }}>{icon} {normType}</span>
                      {post.pin&&<span style={{ background:'#fef3c7',color:'#92400e',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:12 }}>📌 PINNED</span>}
                    </div>
                    <div style={{ display:'flex',gap:6,alignItems:'center' }}>
                      <button onClick={()=>setPosts(prev=>prev.map(p=>p.id===post.id?{...p,pin:!p.pin}:p))} disabled={isPosted||isPosting} style={{ background:post.pin?'#fef3c7':'#f1f5f9',border:'none',borderRadius:6,padding:'4px 8px',cursor:'pointer',fontSize:11,fontWeight:600,color:post.pin?'#92400e':'#64748b' }}>📌 {post.pin?'Unpin':'Pin'}</button>
                      {!isPosted&&!isFailed&&<button onClick={()=>postSingle(post.id)} disabled={isPosting||!!posting} style={{ background:isPosting?'#94a3b8':'#10b981',color:'white',border:'none',borderRadius:6,padding:'5px 12px',cursor:isPosting?'not-allowed':'pointer',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',gap:5 }}>
                        {isPosting?<><span style={{ width:10,height:10,border:'1.5px solid rgba(255,255,255,0.4)',borderTop:'1.5px solid white',borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block' }} /> Posting…</>:'📤 Post & Pin'}
                      </button>}
                      {isPosted&&<span style={{ color:'#10b981',fontSize:12,fontWeight:700 }}>✅ Posted{post.pinned?' & Pinned':''}</span>}
                      {isFailed&&<span style={{ color:'#dc2626',fontSize:11,fontWeight:600 }}>❌ Failed</span>}
                    </div>
                  </div>
                  <div style={{ padding:'12px 16px' }}>
                    {post.type==='MCQ'?(
                      <div>
                        <div style={{ marginBottom:8 }}>
                          <div style={{ fontSize:10,fontWeight:700,color:'#64748b',marginBottom:4 }}>QUESTION</div>
                          <textarea value={post.question||''} onChange={e=>setPosts(prev=>prev.map(p=>p.id===post.id?{...p,question:e.target.value}:p))} disabled={isPosted||isPosting} style={{ width:'100%',padding:'7px 9px',border:'1px solid #e2e8f0',borderRadius:6,fontSize:12,resize:'vertical',outline:'none',minHeight:50,boxSizing:'border-box' }} />
                        </div>
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8 }}>
                          {(post.options||['','','','']).map((opt,i)=>(
                            <div key={i}>
                              <div style={{ fontSize:10,fontWeight:700,color:'#64748b',marginBottom:2 }}>{['A','B','C','D'][i]} {Number(post.correct_option_id)===i&&<span style={{ color:'#10b981' }}>✓ CORRECT</span>}</div>
                              <input value={opt} onChange={e=>{ const opts=[...(post.options||['','','',''])]; opts[i]=e.target.value; setPosts(prev=>prev.map(p=>p.id===post.id?{...p,options:opts}:p)); }} disabled={isPosted||isPosting} style={{ width:'100%',padding:'5px 8px',border:`1px solid ${Number(post.correct_option_id)===i?'#10b981':'#e2e8f0'}`,borderRadius:6,fontSize:11,outline:'none',boxSizing:'border-box' }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ display:'flex',gap:8,alignItems:'center',marginBottom:6 }}>
                          <div style={{ fontSize:10,fontWeight:700,color:'#64748b' }}>CORRECT ANSWER:</div>
                          <select value={post.correct_option_id||0} onChange={e=>setPosts(prev=>prev.map(p=>p.id===post.id?{...p,correct_option_id:Number(e.target.value)}:p))} style={{ padding:'3px 8px',border:'1px solid #e2e8f0',borderRadius:6,fontSize:11,outline:'none' }}>
                            {['A (0)','B (1)','C (2)','D (3)'].map((l,i)=><option key={i} value={i}>{l}</option>)}
                          </select>
                        </div>
                        <div>
                          <div style={{ fontSize:10,fontWeight:700,color:'#64748b',marginBottom:2 }}>EXPLANATION</div>
                          <input value={post.explanation||''} onChange={e=>setPosts(prev=>prev.map(p=>p.id===post.id?{...p,explanation:e.target.value}:p))} disabled={isPosted||isPosting} placeholder="Brief explanation of the correct answer..." style={{ width:'100%',padding:'5px 8px',border:'1px solid #e2e8f0',borderRadius:6,fontSize:11,outline:'none',boxSizing:'border-box' }} />
                        </div>
                      </div>
                    ):(
                      <textarea value={post.text||''} onChange={e=>setPosts(prev=>prev.map(p=>p.id===post.id?{...p,text:e.target.value}:p))} disabled={isPosted||isPosting} style={{ width:'100%',minHeight:90,padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:12,fontFamily:'monospace',lineHeight:1.6,resize:'vertical',outline:'none',color:'#374151',background:isPosted?'#f8fafc':'white',boxSizing:'border-box' }} />
                    )}
                    {post.rationale&&<div style={{ fontSize:10,color:'#94a3b8',marginTop:4 }}>💡 {post.rationale}</div>}
                    {isFailed&&<div style={{ fontSize:11,color:'#dc2626',marginTop:6,background:'#fee2e2',padding:'5px 10px',borderRadius:6 }}>⚠️ {post.error}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Right — mini calendar */}
        <div style={{ background:'white',borderRadius:12,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',position:'sticky',top:20 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
            <button onClick={()=>calMonth===0?(setCalMonth(11),setCalYear(y=>y-1)):setCalMonth(m=>m-1)} style={{ background:'#f1f5f9',border:'none',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:14 }}>←</button>
            <span style={{ fontWeight:700,fontSize:13,color:'#0f172a' }}>{monthLabel}</span>
            <button onClick={()=>calMonth===11?(setCalMonth(0),setCalYear(y=>y+1)):setCalMonth(m=>m+1)} style={{ background:'#f1f5f9',border:'none',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:14 }}>→</button>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:1,marginBottom:4 }}>
            {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{ fontSize:9,fontWeight:700,color:'#94a3b8',textAlign:'center',padding:'2px 0' }}>{d}</div>)}
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:1 }}>
            {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`} />)}
            {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
              const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const dots    = scheduled[dateStr]||[];
              const isToday2 = dateStr===today;
              const isSel   = dateStr===selDate;
              return (
                <div key={day} onClick={()=>setSelDate(dateStr)} style={{ minHeight:36,background:isSel?'#3b82f6':isToday2?'#eff6ff':'#fafafa',borderRadius:4,padding:'3px',cursor:'pointer',border:isToday2&&!isSel?'1px solid #bfdbfe':'1px solid transparent' }}>
                  <div style={{ fontSize:10,fontWeight:isToday2?700:400,color:isSel?'white':isToday2?'#3b82f6':'#374151',textAlign:'center',marginBottom:1 }}>{day}</div>
                  {dots.slice(0,2).map((d,i)=><div key={i} style={{ width:'100%',height:3,borderRadius:2,background:isSel?'rgba(255,255,255,0.6)':TYPE_COLOR[normalizeType(d.type)]||'#64748b',marginBottom:1 }} />)}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:14,borderTop:'1px solid #f1f5f9',paddingTop:12 }}>
            <div style={{ fontSize:10,fontWeight:700,color:'#94a3b8',marginBottom:8 }}>CONTENT TYPES</div>
            {Object.entries(TYPE_COLOR).map(([t,c])=>(
              <div key={t} style={{ display:'flex',alignItems:'center',gap:6,marginBottom:5 }}>
                <span style={{ width:8,height:8,borderRadius:2,background:c,flexShrink:0 }} />
                <span style={{ fontSize:10,color:'#64748b' }}>{TYPE_ICON[t]} {t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Channel selector (shared) ───────────────────────────────────────────────
function ChannelSelector({ channels, selected, onChange }) {
  const allSelected = selected.length === channels.length;
  return (
    <div style={{ background:'#f8fafc',borderRadius:8,padding:'10px 12px',maxHeight:180,overflowY:'auto' }}>
      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
        <span style={{ fontSize:11,fontWeight:700,color:'#64748b' }}>SELECT CHANNELS</span>
        <button onClick={()=>onChange(allSelected?[]:channels.map(c=>c.username))} style={{ background:'none',border:'none',cursor:'pointer',fontSize:11,fontWeight:700,color:'#3b82f6' }}>{allSelected?'Deselect All':'Select All'}</button>
      </div>
      {channels.map(c=>(
        <label key={c.username} style={{ display:'flex',alignItems:'center',gap:8,marginBottom:5,cursor:'pointer' }}>
          <input type="checkbox" checked={selected.includes(c.username)} onChange={e=>{ e.target.checked?onChange([...selected,c.username]):onChange(selected.filter(u=>u!==c.username)); }} />
          <span style={{ fontSize:12,color:'#374151' }}>{c.title||c.subject}{c.teacher?` — ${c.teacher}`:''}</span>
          <span style={{ fontSize:10,color:'#94a3b8',marginLeft:'auto' }}>{(c.subs||0).toLocaleString('en-IN')}</span>
        </label>
      ))}
    </div>
  );
}

// ── Posted item (delete from Telegram) ─────────────────────────────────────
function PostedItem({ item, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [deleted,  setDeleted]  = useState(false);
  async function remove() {
    setDeleting(true);
    try {
      const res  = await fetch('/api/calendar',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ action:'delete',channelUsername:item.channel,messageId:item.messageId }) });
      const data = await res.json();
      if (data.success) { setDeleted(true); setTimeout(()=>onDelete(item.id),1000); }
      else alert('Delete failed: '+data.error);
    } catch { alert('Network error'); }
    setDeleting(false);
  }
  if (deleted) return <div style={{ padding:'8px 12px',fontSize:12,color:'#10b981',background:'#f0fdf4',borderRadius:8 }}>✅ Deleted from Telegram</div>;
  return (
    <div style={{ background:'#f8fafc',borderRadius:8,padding:'8px 12px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8 }}>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:11,fontWeight:700,color:'#374151' }}>@{item.channel} {item.pinned&&'📌'}</div>
        <div style={{ fontSize:10,color:'#94a3b8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{item.preview}</div>
      </div>
      <button onClick={remove} disabled={deleting} style={{ background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:6,padding:'4px 10px',cursor:deleting?'not-allowed':'pointer',fontSize:11,fontWeight:700,flexShrink:0 }}>{deleting?'...':'🗑️ Delete'}</button>
    </div>
  );
}

// ── Editable data table (shared) — with FIXED XLSX loading ─────────────────
function DataTable({ rows, cols, onRowsChange, accentColor }) {
  const [sortCol,  setSortCol]  = useState(null);
  const [sortAsc,  setSortAsc]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [parseErr, setParseErr] = useState('');
  const [xlsxReady, setXlsxReady] = useState(false);

  // ── FIXED: robust XLSX loading with CDN fallback + polling ──────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.XLSX) { setXlsxReady(true); return; }

    const loadScript = (src, onSuccess, onFail) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = onSuccess;
      s.onerror = onFail;
      document.head.appendChild(s);
    };

    loadScript(
      'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js',
      () => setXlsxReady(true),
      () => loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
        () => setXlsxReady(true),
        () => console.warn('XLSX failed to load from both CDNs')
      )
    );

    // Polling fallback — catches race conditions
    const interval = setInterval(() => {
      if (window.XLSX) { setXlsxReady(true); clearInterval(interval); }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  function updateRow(id, key, val) { onRowsChange(rows.map(r=>r._id===id?{...r,[key]:val}:r)); }

  const visible = rows
    .filter(r => !search || cols.some(c=>(r[c.key]||'').toLowerCase().includes(search.toLowerCase())))
    .sort((a,b) => {
      if (!sortCol) return 0;
      const av=(a[sortCol]||'').toLowerCase(), bv=(b[sortCol]||'').toLowerCase();
      return sortAsc?av.localeCompare(bv):bv.localeCompare(av);
    });

  function handleFile(file) {
    if (!xlsxReady) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb   = window.XLSX.read(new Uint8Array(e.target.result),{type:'array'});
        const ws   = wb.Sheets[wb.SheetNames[0]];
        const json = window.XLSX.utils.sheet_to_json(ws,{defval:''});
        const parsed = json.map((row,i)=>{
          const nr={_id:Date.now()+i};
          cols.forEach(col=>{nr[col.key]=String(row[col.label]??row[col.key]??'');});
          return nr;
        }).filter(r=>cols.some(col=>r[col.key]?.trim()));
        onRowsChange(parsed); setParseErr('');
      } catch { setParseErr('Could not parse file. Check column names match.'); }
    };
    reader.readAsArrayBuffer(file);
  }

  function handlePaste(e) {
    const text = e.clipboardData?.getData('text')||'';
    if (!text.includes('\t')) return;
    e.preventDefault();
    const lines = text.trim().split('\n').filter(Boolean);
    if (!lines.length) return;
    const firstCells = lines[0].split('\t').map(s=>s.trim());
    const hasHeader  = firstCells.some(h=>cols.some(c=>c.label.toLowerCase()===h.toLowerCase()||c.key.toLowerCase()===h.toLowerCase()));
    const dataLines  = hasHeader?lines.slice(1):lines;
    const headers    = hasHeader?firstCells:null;
    const newRows = dataLines.map((line,i)=>{
      const cells = line.split('\t').map(s=>s.trim());
      const nr = {_id:Date.now()+i};
      cols.forEach((col,ci)=>{
        if (headers) { const hi=headers.findIndex(h=>h.toLowerCase()===col.label.toLowerCase()||h.toLowerCase()===col.key.toLowerCase()); nr[col.key]=hi>=0&&cells[hi]||''; }
        else nr[col.key]=cells[ci]||'';
      });
      return nr;
    }).filter(r=>cols.some(c=>r[c.key]?.trim()));
    if (newRows.length) { onRowsChange([...rows,...newRows]); setParseErr(''); }
    else setParseErr('Could not parse pasted data. Make sure columns match.');
  }

  const inputStyle = { padding:0,border:'none',background:'transparent',fontSize:12,color:'#374151',width:'100%',outline:'none',fontFamily:'inherit' };

  return (
    <div>
      <div style={{ display:'flex',gap:10,marginBottom:12,flexWrap:'wrap',alignItems:'center' }}>
        <input placeholder="🔍 Search all columns…" value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1,minWidth:160,padding:'7px 12px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:12,outline:'none' }} />
        <label style={{ background:accentColor,color:'white',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:xlsxReady?'pointer':'not-allowed',flexShrink:0,opacity:xlsxReady?1:0.7 }}>
          📁 Upload Excel {!xlsxReady&&'(loading…)'}
          <input type="file" accept=".xlsx,.xls,.csv" style={{ display:'none' }} disabled={!xlsxReady} onChange={e=>e.target.files[0]&&handleFile(e.target.files[0])} />
        </label>
        <button onClick={()=>{ const nr={_id:Date.now()}; cols.forEach(c=>{nr[c.key]=''}); onRowsChange([...rows,nr]); }} style={{ background:'#f1f5f9',border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer',color:'#374151',flexShrink:0 }}>+ Add Row</button>
        {rows.length>0&&<button onClick={()=>onRowsChange([])} style={{ background:'#fee2e2',border:'none',borderRadius:8,padding:'7px 12px',fontSize:12,fontWeight:700,cursor:'pointer',color:'#dc2626',flexShrink:0 }}>Clear All</button>}
        <span style={{ fontSize:11,color:'#94a3b8' }}>{rows.length} rows</span>
      </div>
      {parseErr&&<div style={{ background:'#fee2e2',color:'#dc2626',padding:'8px 12px',borderRadius:8,fontSize:12,marginBottom:10 }}>⚠️ {parseErr}</div>}
      <div style={{ background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:8,padding:'8px 14px',fontSize:11,color:'#0369a1',marginBottom:12 }}>
        💡 <strong>Tip:</strong> Copy rows from Excel/Google Sheets and paste anywhere in the table below. Or upload an Excel file above. You can also type directly into any cell.
      </div>
      <div style={{ overflowX:'auto',borderRadius:10,boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }} onPaste={handlePaste}>
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:700 }}>
          <thead>
            <tr style={{ background:'#0f172a' }}>
              {cols.map(col=>(
                <th key={col.key} onClick={()=>{ sortCol===col.key?setSortAsc(a=>!a):(setSortCol(col.key),setSortAsc(true)); }} style={{ padding:'10px 12px',textAlign:'left',fontWeight:700,color:'white',fontSize:11,cursor:'pointer',whiteSpace:'nowrap',userSelect:'none',borderRight:'1px solid rgba(255,255,255,0.08)' }}>
                  {col.label} {sortCol===col.key?sortAsc?'↑':'↓':''}
                </th>
              ))}
              <th style={{ padding:'10px 8px',color:'white',fontSize:10,width:40 }} />
            </tr>
          </thead>
          <tbody>
            {visible.length===0?(
              <tr><td colSpan={cols.length+1} style={{ padding:40,textAlign:'center',color:'#94a3b8',fontSize:13,background:'white' }}>No data yet. Upload Excel, paste from spreadsheet, or click "+ Add Row".</td></tr>
            ):visible.map((row,ri)=>(
              <tr key={row._id} style={{ background:ri%2===0?'white':'#fafafa',borderBottom:'1px solid #f1f5f9' }}>
                {cols.map(col=>(
                  <td key={col.key} style={{ padding:0,borderRight:'1px solid #f1f5f9',minWidth:col.width||100 }}>
                    {col.type==='select'?(
                      <select value={row[col.key]} onChange={e=>updateRow(row._id,col.key,e.target.value)} style={{ ...inputStyle,padding:'8px 10px',cursor:'pointer',background:'transparent' }}>
                        <option value="">—</option>
                        {col.options.map(o=><option key={o} value={o}>{o}</option>)}
                      </select>
                    ):(
                      <input value={row[col.key]} onChange={e=>updateRow(row._id,col.key,e.target.value)} placeholder={col.placeholder||col.label} style={{ ...inputStyle,padding:'8px 10px' }} />
                    )}
                  </td>
                ))}
                <td style={{ padding:'6px 8px',textAlign:'center',background:ri%2===0?'white':'#fafafa' }}>
                  <button onClick={()=>onRowsChange(rows.filter(r=>r._id!==row._id))} style={{ background:'none',border:'none',cursor:'pointer',color:'#dc2626',fontSize:14,lineHeight:1 }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── YT Calendar section ─────────────────────────────────────────────────────
function YTCalendarSection({ channels }) {
  const today = new Date();
  const [rows,      setRows]     = useState([]);
  const [postModal, setPostModal] = useState(null);
  const [selChs,    setSelChs]   = useState([]);
  const [msgText,   setMsgText]  = useState('');
  const [imgUrl,    setImgUrl]   = useState('');
  const [posting,   setPosting]  = useState(false);
  const [posted,    setPosted]   = useState([]);
  const [view,      setView]     = useState('table');
  const [calYear,   setCalYear]  = useState(today.getFullYear());
  const [calMonth,  setCalMonth] = useState(today.getMonth());
  const [selDate,   setSelDate]  = useState(today.toISOString().slice(0,10));

  const dotMap = {};
  rows.forEach(r=>{ if(r.date) dotMap[r.date]=(dotMap[r.date]||0)+1; });
  const firstDay = new Date(calYear,calMonth,1).getDay();
  const daysInMonth = new Date(calYear,calMonth+1,0).getDate();
  const dayItems = rows.filter(r=>r.date===selDate);

  async function postNow() {
    if (!selChs.length) return alert('Select at least one channel');
    setPosting(true);
    try {
      const res  = await fetch('/api/calendar',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ action:'post',channelUsernames:selChs,text:msgText,imageUrl:imgUrl||undefined,pin:false }) });
      const data = await res.json();
      (data.results||[]).filter(r=>r.success).forEach(r=>setPosted(p=>[...p,{ id:`yt_${Date.now()}_${r.channel}`,channel:r.channel,messageId:r.messageId,pinned:r.pinned,preview:msgText.replace(/<[^>]+>/g,'').slice(0,60) }]));
      setPostModal(null);
    } catch { alert('Network error'); }
    setPosting(false);
  }

  const YT_COLS = [
    {key:'date',label:'Date',width:110,placeholder:'YYYY-MM-DD'},
    {key:'subject',label:'Subject',width:120},
    {key:'email',label:'Faculty Email',width:160},
    {key:'category',label:'Exam Category',width:120},
    {key:'topic',label:'Class Topic',width:200},
    {key:'time',label:'Class Time',width:100,placeholder:'e.g. 6:00 PM'},
    {key:'status',label:'Class Status',width:110,type:'select',options:['Scheduled','Live','Done','Cancelled']},
    {key:'classType',label:'Class Type',width:110,type:'select',options:['Free','Paid','Trial']},
  ];

  return (
    <div>
      <SectionHeader icon="▶️" title="YouTube Class Calendar" subtitle="Enter, paste, or upload your YT schedule · post to channels" />
      <div style={{ display:'flex',gap:8,marginBottom:20 }}>
        {[['table','📋 Table'],['calendar','📅 Calendar']].map(([k,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{ padding:'7px 18px',borderRadius:20,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:view===k?'#dc2626':'#f1f5f9',color:view===k?'white':'#374151' }}>{l}</button>
        ))}
      </div>
      {view==='table'&&(
        <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginBottom:16 }}>
          <DataTable rows={rows} cols={YT_COLS} onRowsChange={setRows} accentColor="#dc2626" />
          {rows.length>0&&<div style={{ marginTop:12,display:'flex',justifyContent:'flex-end' }}><button onClick={()=>setView('calendar')} style={{ background:'#dc2626',color:'white',border:'none',borderRadius:8,padding:'8px 20px',cursor:'pointer',fontSize:13,fontWeight:700 }}>View in Calendar →</button></div>}
        </div>
      )}
      {view==='calendar'&&(
        <div style={{ display:'grid',gridTemplateColumns:'1fr 300px',gap:20 }}>
          <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
              <button onClick={()=>calMonth===0?(setCalMonth(11),setCalYear(y=>y-1)):setCalMonth(m=>m-1)} style={{ background:'#f1f5f9',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer' }}>←</button>
              <span style={{ fontWeight:700,fontSize:14 }}>{new Date(calYear,calMonth).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</span>
              <button onClick={()=>calMonth===11?(setCalMonth(0),setCalYear(y=>y+1)):setCalMonth(m=>m+1)} style={{ background:'#f1f5f9',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer' }}>→</button>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:4 }}>
              {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{ fontSize:9,fontWeight:700,color:'#94a3b8',textAlign:'center' }}>{d}</div>)}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2 }}>
              {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
              {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
                const ds=`${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const cnt=dotMap[ds]||0; const isSel=ds===selDate;
                return (
                  <div key={day} onClick={()=>setSelDate(ds)} style={{ minHeight:44,background:isSel?'#dc2626':cnt?'#fff7f7':'#fafafa',borderRadius:6,padding:'3px 4px',cursor:'pointer' }}>
                    <div style={{ fontSize:10,fontWeight:isSel?700:400,color:isSel?'white':'#374151',textAlign:'center' }}>{day}</div>
                    {cnt>0&&<div style={{ fontSize:9,color:isSel?'rgba(255,255,255,0.9)':'#dc2626',fontWeight:700,textAlign:'center' }}>{cnt}</div>}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontWeight:700,fontSize:13,color:'#0f172a',marginBottom:12 }}>{new Date(selDate+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
            {dayItems.length===0?<div style={{ color:'#94a3b8',fontSize:12,background:'#fff7f7',border:'1px solid #fee2e2',borderRadius:8,padding:'12px 14px' }}>
              <div style={{ fontWeight:600,color:'#dc2626',marginBottom:4 }}>No classes on this date</div>
              <div style={{ color:'#9a3412',fontSize:11 }}>📹 A YouTube class can be planned here — click "+ Add Row" in the Table view to schedule one, then generate a Content Calendar post for it.</div>
            </div>:dayItems.map(item=>(
              <div key={item._id} style={{ background:'white',borderRadius:10,padding:'12px 14px',marginBottom:10,boxShadow:'0 1px 3px rgba(0,0,0,0.06)',borderLeft:'4px solid #dc2626' }}>
                <div style={{ fontSize:12,fontWeight:700,color:'#0f172a',marginBottom:3 }}>{item.subject}</div>
                <div style={{ fontSize:11,color:'#64748b',marginBottom:3 }}>⏰ {item.time} · 📂 {item.classType}</div>
                <div style={{ fontSize:11,color:'#374151',marginBottom:8 }}>📌 {item.topic}</div>
                <div style={{ display:'flex',gap:6,alignItems:'center' }}>
                  <span style={{ background:item.status==='Done'?'#dcfce7':'#fef3c7',color:item.status==='Done'?'#15803d':'#92400e',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:12 }}>{item.status||'Scheduled'}</span>
                  <button onClick={()=>{ const ytId=item.topic?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]; setImgUrl(ytId?`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`:''); setMsgText(`▶️ <b>${item.subject} — YouTube Class</b>\n\n📌 <b>Topic:</b> ${item.topic}\n⏰ <b>Time:</b> ${item.time}\n📂 <b>Type:</b> ${item.classType||'Free'}\n\n✅ Join now!\n📲 testbook.com/ugc-net-coaching`); setSelChs([]); setPostModal(item); }} style={{ marginLeft:'auto',background:'#dc2626',color:'white',border:'none',borderRadius:6,padding:'4px 12px',cursor:'pointer',fontSize:11,fontWeight:700 }}>📤 Post</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {posted.length>0&&(
        <div style={{ background:'white',borderRadius:12,padding:'16px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginTop:16 }}>
          <div style={{ fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10 }}>📬 Posted</div>
          <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
            {posted.map(item=><PostedItem key={item.id} item={item} onDelete={id=>setPosted(p=>p.filter(x=>x.id!==id))} />)}
          </div>
        </div>
      )}
      {postModal&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200 }} onClick={()=>setPostModal(null)}>
          <div style={{ background:'white',borderRadius:14,padding:24,width:480,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 12px 48px rgba(0,0,0,0.2)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:700,fontSize:15,color:'#0f172a',marginBottom:16 }}>📤 Post YouTube Class</div>
            {imgUrl&&<img src={imgUrl} alt="thumb" style={{ width:'100%',borderRadius:8,marginBottom:12 }} onError={e=>e.target.style.display='none'} />}
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11,fontWeight:700,color:'#64748b',marginBottom:4 }}>IMAGE / THUMBNAIL URL</div>
              <input value={imgUrl} onChange={e=>setImgUrl(e.target.value)} placeholder="Auto-detected from YouTube link in topic" style={{ width:'100%',padding:'7px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:12,outline:'none',boxSizing:'border-box' }} />
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11,fontWeight:700,color:'#64748b',marginBottom:4 }}>MESSAGE</div>
              <textarea value={msgText} onChange={e=>setMsgText(e.target.value)} rows={6} style={{ width:'100%',padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:12,fontFamily:'monospace',lineHeight:1.5,resize:'vertical',outline:'none',boxSizing:'border-box' }} />
            </div>
            <div style={{ marginBottom:14 }}><ChannelSelector channels={channels} selected={selChs} onChange={setSelChs} /></div>
            <div style={{ display:'flex',gap:8 }}>
              <button onClick={postNow} disabled={posting||!selChs.length} style={{ flex:1,background:posting?'#94a3b8':'#dc2626',color:'white',border:'none',borderRadius:8,padding:10,cursor:posting?'not-allowed':'pointer',fontWeight:700,fontSize:13 }}>{posting?'Posting…':`📤 Post to ${selChs.length} channel${selChs.length!==1?'s':''}`}</button>
              <button onClick={()=>setPostModal(null)} style={{ flex:0.5,background:'#f1f5f9',color:'#374151',border:'none',borderRadius:8,padding:10,cursor:'pointer',fontWeight:600,fontSize:13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Master Class section ────────────────────────────────────────────────────
function MasterClassSection({ channels }) {
  const today = new Date();
  const [rows,      setRows]     = useState([]);
  const [postModal, setPostModal] = useState(null);
  const [selChs,    setSelChs]   = useState([]);
  const [msgText,   setMsgText]  = useState('');
  const [posting,   setPosting]  = useState(false);
  const [posted,    setPosted]   = useState([]);
  const [view,      setView]     = useState('table');
  const [calYear,   setCalYear]  = useState(today.getFullYear());
  const [calMonth,  setCalMonth] = useState(today.getMonth());
  const [selDate,   setSelDate]  = useState(today.toISOString().slice(0,10));

  const dotMap = {};
  rows.forEach(r=>{ if(r.date) dotMap[r.date]=(dotMap[r.date]||0)+1; });
  const firstDay = new Date(calYear,calMonth,1).getDay();
  const daysInMonth = new Date(calYear,calMonth+1,0).getDate();
  const dayItems = rows.filter(r=>r.date===selDate);

  async function postNow() {
    if (!selChs.length) return alert('Select at least one channel');
    setPosting(true);
    try {
      const res  = await fetch('/api/calendar',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ action:'post',channelUsernames:selChs,text:msgText,pin:false }) });
      const data = await res.json();
      (data.results||[]).filter(r=>r.success).forEach(r=>setPosted(p=>[...p,{ id:`mc_${Date.now()}_${r.channel}`,channel:r.channel,messageId:r.messageId,pinned:r.pinned,preview:msgText.replace(/<[^>]+>/g,'').slice(0,60) }]));
      setPostModal(null);
    } catch { alert('Network error'); }
    setPosting(false);
  }

  const MC_COLS = [
    {key:'date',label:'Date',width:110,placeholder:'YYYY-MM-DD'},
    {key:'subject',label:'Subject',width:120},
    {key:'email',label:'Faculty Email',width:160},
    {key:'category',label:'Exam Category',width:120},
    {key:'time',label:'Time',width:100,placeholder:'e.g. 3:00 PM'},
    {key:'seriesName',label:'Series Name',width:160},
    {key:'topic',label:'Class Topic',width:200},
    {key:'status',label:'Class Status',width:110,type:'select',options:['Scheduled','Live','Done','Cancelled']},
  ];

  return (
    <div>
      <SectionHeader icon="🎓" title="Master Class Calendar" subtitle="Enter, paste, or upload your MC schedule · post announcements" />
      <div style={{ display:'flex',gap:8,marginBottom:20 }}>
        {[['table','📋 Table'],['calendar','📅 Calendar']].map(([k,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{ padding:'7px 18px',borderRadius:20,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:view===k?'#8b5cf6':'#f1f5f9',color:view===k?'white':'#374151' }}>{l}</button>
        ))}
      </div>
      {view==='table'&&(
        <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginBottom:16 }}>
          <DataTable rows={rows} cols={MC_COLS} onRowsChange={setRows} accentColor="#8b5cf6" />
          {rows.length>0&&<div style={{ marginTop:12,display:'flex',justifyContent:'flex-end' }}><button onClick={()=>setView('calendar')} style={{ background:'#8b5cf6',color:'white',border:'none',borderRadius:8,padding:'8px 20px',cursor:'pointer',fontSize:13,fontWeight:700 }}>View in Calendar →</button></div>}
        </div>
      )}
      {view==='calendar'&&(
        <div style={{ display:'grid',gridTemplateColumns:'1fr 300px',gap:20 }}>
          <div style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
              <button onClick={()=>calMonth===0?(setCalMonth(11),setCalYear(y=>y-1)):setCalMonth(m=>m-1)} style={{ background:'#f1f5f9',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer' }}>←</button>
              <span style={{ fontWeight:700,fontSize:14 }}>{new Date(calYear,calMonth).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</span>
              <button onClick={()=>calMonth===11?(setCalMonth(0),setCalYear(y=>y+1)):setCalMonth(m=>m+1)} style={{ background:'#f1f5f9',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer' }}>→</button>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:4 }}>
              {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{ fontSize:9,fontWeight:700,color:'#94a3b8',textAlign:'center' }}>{d}</div>)}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2 }}>
              {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
              {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
                const ds=`${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const cnt=dotMap[ds]||0; const isSel=ds===selDate;
                return (
                  <div key={day} onClick={()=>setSelDate(ds)} style={{ minHeight:44,background:isSel?'#8b5cf6':cnt?'#f5f3ff':'#fafafa',borderRadius:6,padding:'3px 4px',cursor:'pointer' }}>
                    <div style={{ fontSize:10,fontWeight:isSel?700:400,color:isSel?'white':'#374151',textAlign:'center' }}>{day}</div>
                    {cnt>0&&<div style={{ fontSize:9,color:isSel?'rgba(255,255,255,0.9)':'#8b5cf6',fontWeight:700,textAlign:'center' }}>{cnt}</div>}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontWeight:700,fontSize:13,color:'#0f172a',marginBottom:12 }}>{new Date(selDate+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
            {dayItems.length===0?<div style={{ color:'#94a3b8',fontSize:12,background:'#f5f3ff',border:'1px solid #ede9fe',borderRadius:8,padding:'12px 14px' }}>
              <div style={{ fontWeight:600,color:'#7c3aed',marginBottom:4 }}>No master classes on this date</div>
              <div style={{ color:'#6d28d9',fontSize:11 }}>🎓 A Master Class can be planned here — add it in Table view, then generate a Content Calendar announcement for this channel.</div>
            </div>:dayItems.map(item=>(
              <div key={item._id} style={{ background:'white',borderRadius:10,padding:'12px 14px',marginBottom:10,boxShadow:'0 1px 3px rgba(0,0,0,0.06)',borderLeft:'4px solid #8b5cf6' }}>
                <div style={{ fontSize:12,fontWeight:700,color:'#0f172a',marginBottom:3 }}>{item.seriesName||item.subject}</div>
                <div style={{ fontSize:11,color:'#64748b',marginBottom:3 }}>⏰ {item.time}</div>
                <div style={{ fontSize:11,color:'#374151',marginBottom:8 }}>📌 {item.topic||'(topic TBD)'}</div>
                <div style={{ display:'flex',gap:6,alignItems:'center' }}>
                  <span style={{ background:'#f5f3ff',color:'#6d28d9',fontSize:10,fontWeight:600,padding:'2px 7px',borderRadius:12 }}>{item.category}</span>
                  <button onClick={()=>{ setMsgText(`🎓 <b>${item.subject} — Master Class</b>\n\n📚 <b>Series:</b> ${item.seriesName}\n📌 <b>Topic:</b> ${item.topic}\n⏰ <b>Time:</b> ${item.time}\n\n🔥 Don't miss it!\n📲 testbook.com/ugc-net-coaching`); setSelChs([]); setPostModal(item); }} style={{ marginLeft:'auto',background:'#8b5cf6',color:'white',border:'none',borderRadius:6,padding:'4px 12px',cursor:'pointer',fontSize:11,fontWeight:700 }}>📤 Post</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {posted.length>0&&(
        <div style={{ background:'white',borderRadius:12,padding:'16px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginTop:16 }}>
          <div style={{ fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10 }}>📬 Posted</div>
          <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
            {posted.map(item=><PostedItem key={item.id} item={item} onDelete={id=>setPosted(p=>p.filter(x=>x.id!==id))} />)}
          </div>
        </div>
      )}
      {postModal&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200 }} onClick={()=>setPostModal(null)}>
          <div style={{ background:'white',borderRadius:14,padding:24,width:480,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 12px 48px rgba(0,0,0,0.2)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:700,fontSize:15,color:'#0f172a',marginBottom:16 }}>📤 Post Master Class</div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11,fontWeight:700,color:'#64748b',marginBottom:4 }}>MESSAGE</div>
              <textarea value={msgText} onChange={e=>setMsgText(e.target.value)} rows={7} style={{ width:'100%',padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:12,fontFamily:'monospace',lineHeight:1.5,resize:'vertical',outline:'none',boxSizing:'border-box' }} />
            </div>
            <div style={{ marginBottom:14 }}><ChannelSelector channels={channels} selected={selChs} onChange={setSelChs} /></div>
            <div style={{ display:'flex',gap:8 }}>
              <button onClick={postNow} disabled={posting||!selChs.length} style={{ flex:1,background:posting?'#94a3b8':'#8b5cf6',color:'white',border:'none',borderRadius:8,padding:10,cursor:posting?'not-allowed':'pointer',fontWeight:700,fontSize:13 }}>{posting?'Posting…':`📤 Post to ${selChs.length} channel${selChs.length!==1?'s':''}`}</button>
              <button onClick={()=>setPostModal(null)} style={{ flex:0.5,background:'#f1f5f9',color:'#374151',border:'none',borderRadius:8,padding:10,cursor:'pointer',fontWeight:600,fontSize:13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Promotions section ──────────────────────────────────────────────────────
function PromotionsSection({ channels }) {
  const [imgUrl,  setImgUrl]  = useState('');
  const [copy,    setCopy]    = useState('');
  const [link,    setLink]    = useState('');
  const [selChs,  setSelChs]  = useState([]);
  const [times,   setTimes]   = useState(['']);
  const [pin,     setPin]     = useState(false);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState([]);
  const [posted,  setPosted]  = useState([]);

  const fullText = [copy,link].filter(Boolean).join('\n\n');

  async function postNow() {
    if (!selChs.length) return alert('Select at least one channel');
    if (!fullText.trim()) return alert('Write your promotional copy first');
    setPosting(true); setResults([]);
    try {
      const res  = await fetch('/api/calendar',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ action:'post',channelUsernames:selChs,text:fullText,imageUrl:imgUrl||undefined,pin }) });
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
        data.results.filter(r=>r.success).forEach(r=>setPosted(p=>[...p,{ id:`promo_${Date.now()}_${r.channel}`,channel:r.channel,messageId:r.messageId,pinned:r.pinned,preview:fullText.replace(/<[^>]+>/g,'').slice(0,60) }]));
      }
    } catch { alert('Network error'); }
    setPosting(false);
  }

  async function scheduleAt(time) {
    const [h,m] = time.split(':').map(Number);
    const fire  = new Date(); fire.setHours(h,m,0,0);
    if (fire < new Date()) fire.setDate(fire.getDate()+1);
    const delay = fire - new Date();
    alert(`Scheduled for ${fire.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})} (in ${Math.round(delay/60000)} minutes). Keep this tab open.`);
    setTimeout(()=>postNow(), delay);
  }

  return (
    <div>
      <SectionHeader icon="📣" title="Promotions" subtitle="Post promotional content to any channels · schedule up to 3 times · delete anytime" />
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,alignItems:'start' }}>
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <div style={{ background:'white',borderRadius:12,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize:11,fontWeight:700,color:'#64748b',marginBottom:6 }}>IMAGE URL (optional)</div>
            <input value={imgUrl} onChange={e=>setImgUrl(e.target.value)} placeholder="https://example.com/promo-banner.jpg" style={{ width:'100%',padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,outline:'none',boxSizing:'border-box' }} />
            {imgUrl&&<img src={imgUrl} alt="preview" style={{ marginTop:8,width:'100%',borderRadius:8,maxHeight:180,objectFit:'cover' }} onError={e=>e.target.style.display='none'} />}
          </div>
          <div style={{ background:'white',borderRadius:12,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize:11,fontWeight:700,color:'#64748b',marginBottom:6 }}>PROMOTIONAL COPY</div>
            <textarea value={copy} onChange={e=>setCopy(e.target.value)} rows={6} placeholder={'🔥 <b>Big Sale Alert!</b>\n\nJoin UGC NET SuperCoaching at the best price ever.\n✅ All subjects covered\n✅ Live + recorded sessions\n✅ 24/7 doubt support'} style={{ width:'100%',padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:12,fontFamily:'monospace',lineHeight:1.5,resize:'vertical',outline:'none',boxSizing:'border-box' }} />
            <div style={{ fontSize:10,color:'#94a3b8',marginTop:4 }}>Use HTML: &lt;b&gt;bold&lt;/b&gt; · Emojis supported</div>
          </div>
          <div style={{ background:'white',borderRadius:12,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize:11,fontWeight:700,color:'#64748b',marginBottom:6 }}>LINK (optional)</div>
            <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://testbook.com/ugc-net-coaching" style={{ width:'100%',padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,outline:'none',boxSizing:'border-box' }} />
          </div>
          <div style={{ background:'white',borderRadius:12,padding:'14px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',alignItems:'center',gap:12 }}>
            <div onClick={()=>setPin(p=>!p)} style={{ width:44,height:24,borderRadius:12,background:pin?'#f59e0b':'#e2e8f0',cursor:'pointer',position:'relative',flexShrink:0 }}>
              <div style={{ width:18,height:18,borderRadius:'50%',background:'white',position:'absolute',top:3,left:pin?23:3,transition:'left 0.15s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
            <div>
              <div style={{ fontSize:13,fontWeight:700,color:'#0f172a' }}>📌 Pin this message</div>
              <div style={{ fontSize:11,color:'#94a3b8' }}>{pin?'Will be pinned to top of channel':'Will not be pinned'}</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <div style={{ background:'white',borderRadius:12,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <ChannelSelector channels={channels} selected={selChs} onChange={setSelChs} />
          </div>
          <div style={{ background:'white',borderRadius:12,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize:11,fontWeight:700,color:'#64748b',marginBottom:10 }}>SCHEDULE TIMES (up to 3 per day)</div>
            {times.map((t,i)=>(
              <div key={i} style={{ display:'flex',gap:8,marginBottom:8,alignItems:'center' }}>
                <input type="time" value={t} onChange={e=>{ const n=[...times]; n[i]=e.target.value; setTimes(n); }} style={{ flex:1,padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,outline:'none' }} />
                <button onClick={()=>t&&scheduleAt(t)} disabled={!t||!selChs.length||!fullText.trim()} style={{ background:'#f59e0b',color:'white',border:'none',borderRadius:6,padding:'7px 12px',cursor:'pointer',fontSize:11,fontWeight:700,flexShrink:0 }}>⏰ Schedule</button>
                {times.length>1&&<button onClick={()=>setTimes(times.filter((_,j)=>j!==i))} style={{ background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:6,padding:'7px 10px',cursor:'pointer',fontSize:12 }}>✕</button>}
              </div>
            ))}
            {times.length<3&&<button onClick={()=>setTimes([...times,''])} style={{ background:'#f1f5f9',color:'#374151',border:'none',borderRadius:6,padding:'6px 14px',cursor:'pointer',fontSize:11,fontWeight:600 }}>+ Add Time Slot</button>}
          </div>
          <button onClick={postNow} disabled={posting||!selChs.length||!fullText.trim()} style={{ padding:'12px 24px',background:posting?'#94a3b8':'#e11d48',color:'white',border:'none',borderRadius:12,cursor:posting?'not-allowed':'pointer',fontSize:14,fontWeight:800,boxShadow:'0 2px 8px rgba(225,29,72,0.3)' }}>
            {posting?'⏳ Posting...':`📤 Post Now to ${selChs.length} channel${selChs.length!==1?'s':''}`}
          </button>
          {results.length>0&&(
            <div style={{ background:'white',borderRadius:12,padding:'14px 16px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize:12,fontWeight:700,color:'#0f172a',marginBottom:8 }}>Post Results</div>
              {results.map((r,i)=>(
                <div key={i} style={{ display:'flex',alignItems:'center',gap:8,marginBottom:5 }}>
                  <span style={{ fontSize:13 }}>{r.success?'✅':'❌'}</span>
                  <span style={{ fontSize:12,color:'#374151' }}>@{r.channel}</span>
                  {!r.success&&<span style={{ fontSize:11,color:'#dc2626' }}>{r.error}</span>}
                  {r.pinned&&<span style={{ fontSize:10,color:'#f59e0b',fontWeight:700 }}>📌 pinned</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {posted.length>0&&(
        <div style={{ background:'white',borderRadius:12,padding:'16px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginTop:20 }}>
          <div style={{ fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10 }}>📬 Posted Messages — click 🗑️ Delete to remove from Telegram</div>
          <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
            {posted.map(item=><PostedItem key={item.id} item={item} onDelete={id=>setPosted(p=>p.filter(x=>x.id!==id))} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Automation section ──────────────────────────────────────────────────────
function AutomationSection() {
  const [bots, setBots] = useState({
    welcome:  { on:true,  name:'Welcome Bot',       desc:'Auto-greets new members with intro message + study resources link.',                      icon:'👋' },
    quiz:     { on:false, name:'Daily Quiz Bot',     desc:'Posts 1 auto-quiz at 8PM IST every day, generated from PYQ bank.',                       icon:'🧪' },
    ca:       { on:true,  name:'Current Affairs',    desc:'Auto-posts daily CA digest at 7AM IST from curated feed.',                               icon:'📰' },
    spam:     { on:true,  name:'Spam Filter',        desc:'Removes promotional links, forwards from non-admins, profanity.',                         icon:'🛡️' },
    referral: { on:false, name:'Referral Tracker',   desc:'Tracks invite links, attributes new members to referrer.',                                icon:'🔗' },
    yt:       { on:false, name:'YouTube Sync',       desc:'Auto-posts when a new video is published on the channel YouTube.',                        icon:'▶️' },
  });
  const toggle = key => setBots(b=>({...b,[key]:{...b[key],on:!b[key].on}}));
  return (
    <div>
      <SectionHeader icon="🤖" title="Automation" subtitle="Manage bots and automated workflows across your channels" />
      <div style={{ background:'#fffbeb',border:'1px solid #fde68a',borderRadius:10,padding:'10px 16px',marginBottom:20,fontSize:13,color:'#92400e' }}>
        ⚡ UI preview — connect your bot token in Settings to activate real automations.
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14 }}>
        {Object.entries(bots).map(([key,bot])=>(
          <div key={key} style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',flexDirection:'column',gap:10 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <span style={{ fontSize:22 }}>{bot.icon}</span>
                <span style={{ fontWeight:700,fontSize:14,color:'#0f172a' }}>{bot.name}</span>
              </div>
              <div onClick={()=>toggle(key)} style={{ width:44,height:24,borderRadius:12,background:bot.on?'#3b82f6':'#e2e8f0',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0 }}>
                <div style={{ width:18,height:18,borderRadius:'50%',background:'white',position:'absolute',top:3,left:bot.on?23:3,transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
            <p style={{ margin:0,fontSize:12,color:'#64748b',lineHeight:1.6 }}>{bot.desc}</p>
            <div style={{ display:'flex',alignItems:'center',gap:6 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:bot.on?'#10b981':'#94a3b8' }} />
              <span style={{ fontSize:11,color:bot.on?'#10b981':'#94a3b8',fontWeight:600 }}>{bot.on?'Active':'Inactive'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Integrations section ────────────────────────────────────────────────────
function IntegrationsSection() {
  const items = [
    { icon:'▶️', name:'YouTube',       desc:'Auto-post new videos to Telegram channels. Supports multiple YouTube channels mapped to different Telegram groups.', status:'Connect', color:'#dc2626' },
    { icon:'📊', name:'Google Sheets', desc:'Export channel analytics to Sheets weekly. Historical subscriber, view rate, and growth data in structured format.',  status:'Connect', color:'#10b981' },
    { icon:'🔔', name:'Webhooks',      desc:'Send real-time events to your CRM or custom backend when members join/leave or new posts are published.',              status:'Connect', color:'#3b82f6' },
    { icon:'⚡', name:'Zapier',        desc:'Connect to 5000+ apps. Trigger Zaps on new subscribers, high-performing posts, or daily digest events.',               status:'Connect', color:'#f97316' },
    { icon:'📱', name:'Testbook App',  desc:'Sync channel subscribers with Testbook course purchasers. Auto-grant access when a user buys a course.',              status:'Coming Soon', color:'#8b5cf6' },
    { icon:'📧', name:'Email / SMS',   desc:'Send welcome emails when students join, and re-engagement SMS for members inactive for 30+ days.',                    status:'Coming Soon', color:'#64748b' },
  ];
  return (
    <div>
      <SectionHeader icon="🔗" title="Integrations" subtitle="Connect your Telegram ecosystem with external tools and platforms" />
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14 }}>
        {items.map(item=>(
          <div key={item.name} style={{ background:'white',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderTop:`3px solid ${item.color}` }}>
            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}><span style={{ fontSize:22 }}>{item.icon}</span><span style={{ fontWeight:700,fontSize:14,color:'#0f172a' }}>{item.name}</span></div>
            <p style={{ margin:'0 0 14px',fontSize:12,color:'#64748b',lineHeight:1.6 }}>{item.desc}</p>
            <button style={{ background:item.status==='Connect'?item.color:'#f1f5f9',color:item.status==='Connect'?'white':'#94a3b8',border:'none',borderRadius:8,padding:'7px 16px',cursor:item.status==='Connect'?'pointer':'default',fontSize:12,fontWeight:700 }}>{item.status}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Root dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [section,   setSection]   = useState('overview');
  const [liveData,  setLiveData]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [selDate,   setSelDate]   = useState(new Date().toISOString().slice(0,10));
  const [compData,  setCompData]  = useState({});
  const [compLoading,setCompLoading]=useState(true);
  const [postCounts,setPostCounts]=useState({});
  const [postItems, setPostItems] = useState({});
  const [postNote,  setPostNote]  = useState('');
  const [snapshots, setSnapshots] = useState({});

  const today = new Date().toISOString().slice(0,10);
  const isToday = selDate === today;

  // Fetch own channels
  useEffect(()=>{
    fetch('/api/channels').then(r=>r.json()).then(data=>{
      if (data.success) {
        setLiveData(data);
        setLastFetched(new Date(data.fetchedAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}));
        saveSnapshot(today, data.channels||[]);
      }
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  // Fetch post counts
  useEffect(()=>{
    fetch('/api/posts').then(r=>r.json()).then(data=>{
      if (data.success) { setPostCounts(data.counts||{}); setPostItems(data.posts||{}); setPostNote(data.note||''); }
    }).catch(()=>{});
  },[]);

  // Fetch server-side subscriber snapshots (daily cron writes these to Supabase)
  useEffect(()=>{
    fetch('/api/snapshots').then(r=>r.json()).then(data=>{
      if (data.success) setSnapshots(data.snapshots || {});
    }).catch(()=>{});
  },[]);

  // Fetch competitor data
  useEffect(()=>{
    const allComps = Object.values(COMPETITORS).flat();
    const batches  = [];
    for (let i=0;i<allComps.length;i+=50) batches.push(allComps.slice(i,i+50));
    Promise.all(batches.map(b=>fetch(`/api/channels?type=competitors&usernames=${b.join(',')}`).then(r=>r.json()).catch(()=>({channels:[]})))).then(results=>{
      const map={};
      results.forEach(r=>(r.channels||[]).forEach(ch=>{ map[ch.username.toLowerCase()]=ch; }));
      setCompData(map);
    }).finally(()=>setCompLoading(false));
  },[]);

  const snapshot = isToday ? null : loadSnapshot(selDate);
  const snapshotDates = allSnapshotDates();

  const channels = CHANNELS.map(ch=>{
    const live = liveData?.channels?.find(c=>c.username.toLowerCase()===ch.username.toLowerCase());
    const liveSubs = live?.subscribers??0;
    const snapSubs = snapshot?.[ch.username.toLowerCase()];
    const subs     = isToday ? liveSubs : snapSubs !== undefined ? snapSubs : liveSubs;
    const subsSource = isToday ? 'live' : snapSubs !== undefined ? 'snapshot' : 'live-proxy';
    return { ...ch, subs, liveSubs, subsSource, title: live?.title||ch.subject, description: live?.description||'' };
  });

  const totalSubs = channels.reduce((a,c)=>a+c.subs,0);

  if (loading) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f1f5f9' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48,height:48,border:'4px solid #e2e8f0',borderTop:'4px solid #3b82f6',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px' }} />
        <p style={{ color:'#64748b',fontWeight:500 }}>Fetching live channel data…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex',minHeight:'100vh',background:'#f1f5f9',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} * { box-sizing: border-box; }`}</style>
      <Sidebar active={section} onNav={setSection} totalSubs={totalSubs} lastFetched={lastFetched} />
      <main style={{ flex:1,padding:'28px 32px',overflowY:'auto',minWidth:0 }}>
        {section==='overview'    && <OverviewSection     channels={channels} postCounts={postCounts} postItems={postItems} lastFetched={lastFetched} onNavigate={setSection} snapshots={snapshots} />}
        {section==='channels'    && <ChannelsSectionV2 />}
        {section==='competitive' && <CompetitiveSection  channels={channels} competitorData={compData} competitorLoading={compLoading} />}
        {section==='insights'    && <InsightsSection     channels={channels} competitorData={compData} selectedDate={selDate} />}
        {section==='calendar'    && <ContentCalendarSection channels={channels} />}
        {section==='youtube'     && <YTCalendarSection   channels={channels} />}
        {section==='masterclass' && <MasterClassSection  channels={channels} />}
        {section==='promotions'  && <PromotionsSection   channels={channels} />}
        {section==='automation'  && <AutomationSection />}
        {section==='integrations'&& <IntegrationsSection />}
      </main>
    </div>
  );
}
