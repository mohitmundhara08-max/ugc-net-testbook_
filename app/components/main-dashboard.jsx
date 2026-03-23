'use client';
import { useState, useEffect } from 'react';

const STATIC_CHANNELS = [
  { username: 'testbook_ugcnet', subject: 'Common', name: '@testbook_ugcnet', posts: 12, rate: 8.5, teacher: '', avgViews: 3400, avgFwd: 3.7, joined: 55, left: 36, bestHours: ['3:30pm','6:30pm','7:30pm','8:30pm'], contentTypes: [{type:'Morning Motivation',posts:4,avgViews:5000,rate:5.4,fwd:1.0},{type:'News Bulletin',posts:4,avgViews:2900,rate:3.1,fwd:5.0},{type:'Study Plans',posts:4,avgViews:2300,rate:2.4,fwd:5.0}], topPost: 'Morning motivation featuring a quote by Amartya Sen.' },
  { username: 'pritipaper1', subject: 'Paper 1', name: '@pritipaper1', posts: 11, rate: 8.9, teacher: 'Priti', avgViews: 1900, avgFwd: 2.1, joined: 42, left: 18, bestHours: ['7:00am','12:00pm','6:00pm'], contentTypes: [{type:'PYQ Discussion',posts:4,avgViews:2200,rate:9.8,fwd:3.0},{type:'Concept Notes',posts:4,avgViews:1800,rate:8.5,fwd:2.0},{type:'Mock Test Links',posts:3,avgViews:1500,rate:7.2,fwd:1.5}], topPost: 'Paper 1 PYQ marathon — top 50 questions.' },
  { username: 'tulikamam', subject: 'Paper 1', name: '@tulikamam', posts: 8, rate: 7.1, teacher: 'Tulika', avgViews: 1200, avgFwd: 1.8, joined: 30, left: 22, bestHours: ['8:00am','5:00pm'], contentTypes: [{type:'Study Plans',posts:3,avgViews:1400,rate:8.0,fwd:2.0},{type:'Concept Notes',posts:3,avgViews:1100,rate:6.8,fwd:1.8},{type:'Motivation',posts:2,avgViews:1000,rate:6.2,fwd:1.5}], topPost: 'Complete Paper 1 revision strategy in 30 days.' },
  { username: 'Anshikamaamtestbook', subject: 'Paper 1', name: '@Anshikamaamtestbook', posts: 10, rate: 8.3, teacher: 'Anshika', avgViews: 1100, avgFwd: 2.2, joined: 28, left: 15, bestHours: ['9:00am','4:00pm','8:00pm'], contentTypes: [{type:'PYQ Discussion',posts:4,avgViews:1300,rate:9.1,fwd:3.0},{type:'Concept Notes',posts:3,avgViews:1000,rate:7.8,fwd:2.0},{type:'Study Plans',posts:3,avgViews:900,rate:7.2,fwd:1.8}], topPost: 'Teaching Aptitude PYQ with detailed explanation.' },
  { username: 'testbookrajatsir', subject: 'Paper 1', name: '@testbookrajatsir', posts: 7, rate: 6.8, teacher: 'Rajat Sir', avgViews: 320, avgFwd: 1.2, joined: 12, left: 8, bestHours: ['10:00am','6:00pm'], contentTypes: [{type:'Concept Notes',posts:3,avgViews:380,rate:7.5,fwd:1.5},{type:'Study Plans',posts:2,avgViews:290,rate:6.2,fwd:1.0},{type:'Motivation',posts:2,avgViews:280,rate:5.8,fwd:1.0}], topPost: 'Research Methodology complete notes.' },
  { username: 'pradyumansir_testbook', subject: 'Political Science', name: '@pradyumansir_testbook', posts: 9, rate: 7.2, teacher: '', avgViews: 2400, avgFwd: 4.1, joined: 48, left: 25, bestHours: ['8:00am','2:00pm','7:00pm'], contentTypes: [{type:'PYQ Discussion',posts:4,avgViews:2800,rate:8.1,fwd:5.0},{type:'Current Affairs',posts:3,avgViews:2200,rate:6.8,fwd:4.0},{type:'Concept Notes',posts:2,avgViews:1900,rate:6.1,fwd:3.0}], topPost: 'Indian Political Thought — complete unit revision.' },
  { username: 'AshwaniSir_Testbook', subject: 'History', name: '@AshwaniSir_Testbook', posts: 9, rate: 7.5, teacher: '', avgViews: 1100, avgFwd: 2.8, joined: 35, left: 20, bestHours: ['9:00am','5:00pm'], contentTypes: [{type:'PYQ Discussion',posts:4,avgViews:1300,rate:8.5,fwd:3.5},{type:'Concept Notes',posts:3,avgViews:1000,rate:7.0,fwd:2.5},{type:'Timeline Notes',posts:2,avgViews:900,rate:6.2,fwd:2.0}], topPost: 'Modern Indian History complete timeline.' },
  { username: 'kiranmaamtestbook', subject: 'Public Administration', name: '@kiranmaamtestbook', posts: 6, rate: 6.2, teacher: '', avgViews: 500, avgFwd: 1.5, joined: 18, left: 12, bestHours: ['10:00am','6:00pm'], contentTypes: [{type:'Concept Notes',posts:3,avgViews:580,rate:7.0,fwd:2.0},{type:'PYQ Discussion',posts:2,avgViews:460,rate:5.8,fwd:1.5},{type:'Study Plans',posts:1,avgViews:400,rate:5.0,fwd:1.0}], topPost: 'Administrative Theories — Fayol vs Taylor.' },
  { username: 'Manojsonker_Testbook', subject: 'Sociology', name: '@Manojsonker_Testbook', posts: 7, rate: 6.8, teacher: '', avgViews: 420, avgFwd: 1.8, joined: 15, left: 10, bestHours: ['11:00am','7:00pm'], contentTypes: [{type:'Concept Notes',posts:3,avgViews:500,rate:7.5,fwd:2.0},{type:'PYQ Discussion',posts:2,avgViews:390,rate:6.5,fwd:1.8},{type:'Motivation',posts:2,avgViews:350,rate:5.8,fwd:1.5}], topPost: 'Max Weber vs Emile Durkheim — analysis.' },
  { username: 'Heenamaam_testbook', subject: 'Education', name: '@Heenamaam_testbook', posts: 8, rate: 7.1, teacher: '', avgViews: 400, avgFwd: 1.6, joined: 14, left: 9, bestHours: ['9:00am','4:00pm'], contentTypes: [{type:'Concept Notes',posts:3,avgViews:480,rate:8.0,fwd:2.0},{type:'PYQ Discussion',posts:3,avgViews:370,rate:6.8,fwd:1.5},{type:'Study Plans',posts:2,avgViews:320,rate:5.8,fwd:1.2}], topPost: 'NCF 2005 complete summary.' },
  { username: 'AditiMaam_Testbook', subject: 'Home Science', name: '@AditiMaam_Testbook', posts: 6, rate: 5.9, teacher: '', avgViews: 340, avgFwd: 1.2, joined: 12, left: 8, bestHours: ['10:00am','5:00pm'], contentTypes: [{type:'Concept Notes',posts:3,avgViews:400,rate:6.5,fwd:1.5},{type:'PYQ Discussion',posts:2,avgViews:300,rate:5.5,fwd:1.2},{type:'Motivation',posts:1,avgViews:280,rate:4.8,fwd:1.0}], topPost: 'Human Development theories.' },
  { username: 'karanSir_Testbook', subject: 'Law', name: '@karanSir_Testbook', posts: 5, rate: 5.2, teacher: '', avgViews: 280, avgFwd: 1.1, joined: 10, left: 7, bestHours: ['11:00am','6:00pm'], contentTypes: [{type:'Case Studies',posts:2,avgViews:320,rate:6.0,fwd:1.5},{type:'Concept Notes',posts:2,avgViews:260,rate:5.0,fwd:1.0},{type:'PYQ Discussion',posts:1,avgViews:240,rate:4.5,fwd:1.0}], topPost: 'Constitutional Law — fundamental rights PYQ.' },
  { username: 'testbookdakshita', subject: 'English', name: '@testbookdakshita', posts: 6, rate: 5.8, teacher: '', avgViews: 250, avgFwd: 1.3, joined: 9, left: 6, bestHours: ['9:00am','5:00pm'], contentTypes: [{type:'Literary Theory',posts:2,avgViews:290,rate:6.5,fwd:1.5},{type:'PYQ Discussion',posts:2,avgViews:240,rate:5.5,fwd:1.2},{type:'Author Notes',posts:2,avgViews:210,rate:4.8,fwd:1.0}], topPost: 'Post-colonial literature — key theorists.' },
  { username: 'AshishSir_Testbook', subject: 'Geography', name: '@AshishSir_Testbook', posts: 4, rate: 4.5, teacher: '', avgViews: 130, avgFwd: 0.9, joined: 6, left: 5, bestHours: ['10:00am','6:00pm'], contentTypes: [{type:'Map Work',posts:2,avgViews:160,rate:5.0,fwd:1.2},{type:'Concept Notes',posts:1,avgViews:120,rate:4.2,fwd:0.8},{type:'PYQ Discussion',posts:1,avgViews:100,rate:3.5,fwd:0.7}], topPost: 'Physical Geography — climatology notes.' },
  { username: 'ShachiMaam_Testbook', subject: 'Economics', name: '@ShachiMaam_Testbook', posts: 5, rate: 4.8, teacher: '', avgViews: 140, avgFwd: 1.0, joined: 6, left: 5, bestHours: ['11:00am','5:00pm'], contentTypes: [{type:'Concept Notes',posts:2,avgViews:170,rate:5.5,fwd:1.2},{type:'PYQ Discussion',posts:2,avgViews:130,rate:4.5,fwd:1.0},{type:'Current Affairs',posts:1,avgViews:110,rate:3.8,fwd:0.8}], topPost: 'Macroeconomics — IS-LM model simplified.' },
  { username: 'Monikamaamtestbook', subject: 'Management', name: '@Monikamaamtestbook', posts: 3, rate: 3.9, teacher: '', avgViews: 110, avgFwd: 0.8, joined: 5, left: 4, bestHours: ['10:00am','5:00pm'], contentTypes: [{type:'Concept Notes',posts:2,avgViews:130,rate:4.5,fwd:1.0},{type:'PYQ Discussion',posts:1,avgViews:90,rate:3.0,fwd:0.6}], topPost: "Porter's Five Forces explained." },
  { username: 'yogitamaamtestbook', subject: 'Management', name: '@yogitamaamtestbook', posts: 4, rate: 4.2, teacher: '', avgViews: 115, avgFwd: 0.9, joined: 5, left: 4, bestHours: ['9:00am','4:00pm'], contentTypes: [{type:'Concept Notes',posts:2,avgViews:140,rate:4.8,fwd:1.0},{type:'Case Studies',posts:1,avgViews:100,rate:3.8,fwd:0.8},{type:'PYQ Discussion',posts:1,avgViews:95,rate:3.5,fwd:0.7}], topPost: 'HR Management — Maslow vs Herzberg.' },
  { username: 'EVS_AnshikamaamTestbook', subject: 'Environmental Science', name: '@EVS_AnshikamaamTestbook', posts: 3, rate: 3.5, teacher: '', avgViews: 95, avgFwd: 0.7, joined: 4, left: 4, bestHours: ['10:00am','6:00pm'], contentTypes: [{type:'Concept Notes',posts:2,avgViews:110,rate:4.0,fwd:0.8},{type:'PYQ Discussion',posts:1,avgViews:80,rate:2.8,fwd:0.6}], topPost: 'Climate Change and Biodiversity.' },
  { username: 'daminimaam_testbook', subject: 'Library Science', name: '@daminimaam_testbook', posts: 2, rate: 2.8, teacher: '', avgViews: 80, avgFwd: 0.6, joined: 3, left: 3, bestHours: ['11:00am','5:00pm'], contentTypes: [{type:'Concept Notes',posts:1,avgViews:95,rate:3.2,fwd:0.8},{type:'PYQ Discussion',posts:1,avgViews:65,rate:2.4,fwd:0.5}], topPost: 'Library Classification — DDC vs UDC.' },
  { username: 'TestbookShahna', subject: 'Computer Science', name: '@TestbookShahna', posts: 5, rate: 4.6, teacher: '', avgViews: 95, avgFwd: 1.0, joined: 4, left: 3, bestHours: ['9:00am','7:00pm'], contentTypes: [{type:'Algorithm Notes',posts:2,avgViews:115,rate:5.5,fwd:1.2},{type:'PYQ Discussion',posts:2,avgViews:90,rate:4.2,fwd:1.0},{type:'Concept Notes',posts:1,avgViews:75,rate:3.5,fwd:0.8}], topPost: 'Data Structures — Trees and Graphs.' },
  { username: 'Prakashsirtestbook', subject: 'Sanskrit', name: '@Prakashsirtestbook', posts: 3, rate: 3.1, teacher: '', avgViews: 70, avgFwd: 0.6, joined: 3, left: 3, bestHours: ['8:00am','4:00pm'], contentTypes: [{type:'Grammar Notes',posts:2,avgViews:85,rate:3.5,fwd:0.7},{type:'PYQ Discussion',posts:1,avgViews:55,rate:2.5,fwd:0.5}], topPost: 'Panini grammar — Ashtadhyayi overview.' },
  { username: 'kesharisir_testbook', subject: 'Hindi', name: '@kesharisir_testbook', posts: 4, rate: 3.8, teacher: '', avgViews: 80, avgFwd: 0.8, joined: 3, left: 3, bestHours: ['9:00am','5:00pm'], contentTypes: [{type:'Literature Notes',posts:2,avgViews:95,rate:4.5,fwd:1.0},{type:'PYQ Discussion',posts:1,avgViews:72,rate:3.5,fwd:0.8},{type:'Grammar Notes',posts:1,avgViews:60,rate:2.8,fwd:0.6}], topPost: 'Chhayavad poetry — key poets and works.' },
  { username: 'TestbookNiharikaMaam', subject: 'Commerce', name: '@TestbookNiharikaMaam', posts: 2, rate: 2.5, teacher: '', avgViews: 70, avgFwd: 0.5, joined: 3, left: 3, bestHours: ['10:00am','5:00pm'], contentTypes: [{type:'Concept Notes',posts:1,avgViews:85,rate:3.0,fwd:0.6},{type:'PYQ Discussion',posts:1,avgViews:55,rate:2.0,fwd:0.4}], topPost: 'Financial Accounting — ratio analysis.' },
  { username: 'MrinaliniMaam_Testbook', subject: 'Psychology', name: '@MrinaliniMaam_Testbook', posts: 3, rate: 3.2, teacher: '', avgViews: 72, avgFwd: 0.7, joined: 3, left: 3, bestHours: ['10:00am','6:00pm'], contentTypes: [{type:'Concept Notes',posts:2,avgViews:88,rate:3.8,fwd:0.8},{type:'PYQ Discussion',posts:1,avgViews:56,rate:2.5,fwd:0.6}], topPost: 'Cognitive theories — Piaget vs Vygotsky.' },
  { username: 'testbook_gauravsir', subject: 'Physical Education', name: '@testbook_gauravsir', posts: 1, rate: 1.5, teacher: '', avgViews: 20, avgFwd: 0.3, joined: 1, left: 2, bestHours: ['11:00am'], contentTypes: [{type:'Concept Notes',posts:1,avgViews:20,rate:1.5,fwd:0.3}], topPost: 'Sports physiology — basic concepts.' },
];

function buildHistory(channel, anchorDateKey) {
  const subs = channel.subs;
  const days = [];
  const anchor = anchorDateKey ? new Date(anchorDateKey + 'T12:00:00') : new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(anchor);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const seed = d.getDate() * 7 + d.getMonth() * 31;
    const variation = 1 - (i * 0.0012) - (Math.sin(seed + i) * 0.0004);
    const daySubs = Math.round(subs * variation);
    const joined = Math.max(1, Math.round(channel.joined * (0.8 + (seed % 5) * 0.1)));
    const left   = Math.max(1, Math.round(channel.left   * (0.7 + (seed % 4) * 0.1)));
    const posts  = Math.max(1, Math.round(channel.posts  * (0.75 + (seed % 5) * 0.1) / 7));
    days.push({ label, subs: daySubs, rate: parseFloat((3.5 + Math.sin((seed + i) * 0.9) * 1.3).toFixed(1)), net: joined - left, joined, left, posts });
  }
  return days;
}

function getDateStats(base, anchorDateKey) {
  const d = anchorDateKey ? new Date(anchorDateKey + 'T12:00:00') : new Date();
  const seed = d.getDate() + d.getMonth() * 31;
  return {
    joined: Math.max(1, Math.round(base.joined * (0.8 + (seed % 5) * 0.1))),
    left: Math.max(1, Math.round(base.left * (0.7 + (seed % 4) * 0.1))),
    avgViews: Math.round(base.avgViews * (0.88 + (seed % 6) * 0.04)),
    rate: parseFloat((base.rate * (0.9 + (seed % 5) * 0.04)).toFixed(1)),
    posts: Math.max(1, Math.round(base.posts * (0.75 + (seed % 5) * 0.1))),
  };
}

function getDateButtons() {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return { label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), key: d.toISOString().slice(0, 10) };
  });
}

function getChannelIdea(ch) {
  if (ch.subs > 20000) {
    if (ch.rate < 8) return `Engagement is low for your reach. Launch daily polls or quizzes to boost interaction from ${ch.rate}% toward 10%+.`;
    return `Strong performer! Introduce weekly live Q&A sessions to convert passive subscribers into active learners.`;
  }
  if (ch.subs > 5000) {
    if (ch.posts < 7) return `Posting frequency is low (${ch.posts}/week). Aim for 10+ posts/week with bite-sized content to grow faster.`;
    return `Good base — add "Share with a friend" CTAs in every post. Your ${ch.rate}% view rate means ${Math.round(ch.subs * ch.rate / 100)} active readers daily.`;
  }
  if (ch.subs > 1000) return `Run a "30-day challenge" series. Consistent daily posts will build habit among your ${ch.subs.toLocaleString('en-IN')} subscribers.`;
  return `Channel needs growth push. Cross-promote with @testbook_ugcnet and Paper 1 channels. Post daily at ${ch.bestHours?.[0] || '7:00pm'} IST.`;
}

function MiniBar({ value, max, color }) {
  return (
    <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '8px', width: '100%' }}>
      <div style={{ background: color, height: '100%', width: `${Math.max(2, (value / max) * 100)}%`, borderRadius: '4px' }} />
    </div>
  );
}

function MiniDualChart({ history, color }) {
  const [hovered, setHovered] = useState(null);
  const H = 80; const W = 100;
  const maxSubs = Math.max(...history.map(h => h.subs));
  const minSubs = Math.min(...history.map(h => h.subs));
  const maxRate = Math.max(...history.map(h => h.rate));
  const minRate = Math.min(...history.map(h => h.rate));

  const sx = i => (i / (history.length - 1)) * W;
  const syS = v => H - ((v - minSubs) / (maxSubs - minSubs || 1)) * (H - 10) - 5;
  const syR = v => H - ((v - minRate) / (maxRate - minRate || 1)) * (H - 10) - 5;

  const subsPts = history.map((h, i) => `${sx(i)},${syS(h.subs)}`).join(' ');
  const ratePts = history.map((h, i) => `${sx(i)},${syR(h.rate)}`).join(' ');

  const subsTicks = [minSubs, (minSubs+maxSubs)/2, maxSubs].map(v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : `${Math.round(v)}`);
  const rateTicks = [minRate, ((minRate+maxRate)/2).toFixed(1), maxRate].map(v => `${v}%`);

  return (
    <div style={{ position: 'relative', paddingLeft: 32, paddingRight: 36, paddingBottom: 32 }}>
      {/* Left Y-axis: subs */}
      <div style={{ position: 'absolute', left: 0, top: 0, height: H, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 30 }}>
        {[subsTicks[2], subsTicks[1], subsTicks[0]].map((t, i) => <span key={i} style={{ fontSize: 8, color: `${color}cc`, textAlign: 'right', display: 'block' }}>{t}</span>)}
      </div>
      {/* Right Y-axis: rate */}
      <div style={{ position: 'absolute', right: 0, top: 0, height: H, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 34 }}>
        {[rateTicks[2], rateTicks[1], rateTicks[0]].map((t, i) => <span key={i} style={{ fontSize: 8, color: '#f59e0b', textAlign: 'left', display: 'block' }}>{t}</span>)}
      </div>

      {/* Hover hit zones */}
      <div style={{ position: 'absolute', top: 0, left: 32, right: 36, height: H, display: 'flex' }}>
        {history.map((h, i) => (
          <div key={i} style={{ flex: 1, height: '100%', cursor: 'crosshair', position: 'relative' }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            {hovered === i && (
              <div style={{ position: 'absolute', bottom: '105%', left: '50%', transform: 'translateX(-50%)', background: '#002D5B', color: 'white', borderRadius: 7, padding: '6px 9px', fontSize: 10, lineHeight: 1.6, zIndex: 30, pointerEvents: 'none', boxShadow: '0 3px 12px rgba(0,0,0,0.25)', minWidth: 130 }}>
                <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 3, marginBottom: 3 }}>{h.label}</div>
                <div>Subs: <span style={{ color: `${color}ee`, fontWeight: 700 }}>{h.subs.toLocaleString('en-IN')}</span></div>
                <div>View Rate: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{h.rate}%</span></div>
                <div>Net Subs: <span style={{ color: h.net >= 0 ? '#4ade80' : '#f87171', fontWeight: 700 }}>{h.net >= 0 ? '+' : ''}{h.net}</span></div>
                <div>Posts: <span style={{ color: '#94a3b8', fontWeight: 700 }}>{h.posts}</span></div>
              </div>
            )}
            {/* Vertical guide line on hover */}
            {hovered === i && <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: '100%', background: 'rgba(0,0,0,0.1)' }} />}
          </div>
        ))}
      </div>

      {/* SVG: subs line (solid) + rate line (dashed) + dots */}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', height: H }} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(f => <line key={f} x1={0} y1={H * f} x2={W} y2={H * f} stroke="#f3f4f6" strokeWidth="0.5" />)}
        {/* Subs area fill */}
        <polyline points={`0,${H} ${subsPts} ${W},${H}`} fill={`${color}18`} stroke="none" />
        {/* Subs line */}
        <polyline points={subsPts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {/* Rate line dashed amber */}
        <polyline points={ratePts} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {/* Dots */}
        {history.map((h, i) => (
          <g key={i}>
            <circle cx={sx(i)} cy={syS(h.subs)} r={hovered === i ? '2.8' : '1.8'} fill={hovered === i ? 'white' : color} stroke={color} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            <circle cx={sx(i)} cy={syR(h.rate)} r={hovered === i ? '2.4' : '1.4'} fill={hovered === i ? 'white' : '#f59e0b'} stroke="#f59e0b" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </svg>

      {/* X-axis dates */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        {history.map((h, i) => (
          <span key={i} style={{ fontSize: '9px', color: hovered === i ? color : '#9ca3af', fontWeight: hovered === i ? 700 : 400, textAlign: 'center', flex: 1 }}>{h.label}</span>
        ))}
      </div>

      {/* Axis legend — bottom left */}
      <div style={{ position: 'absolute', bottom: 0, left: 32, display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 8, color: `${color}cc` }}>
          <span style={{ width: 14, height: 2, background: color, display: 'inline-block', borderRadius: 1 }} />Subs
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 8, color: '#f59e0b' }}>
          <span style={{ width: 14, height: 0, borderTop: '1.5px dashed #f59e0b', display: 'inline-block' }} />Rate %
        </span>
        <span style={{ fontSize: 8, color: '#9ca3af' }}>X: Date</span>
      </div>
    </div>
  );
}

// ─── DrilldownStats — Telegram-style charts with independent date sliders ──
function DrilldownStats({ channel }) {
  const [followerWeek, setFollowerWeek] = useState(0);
  const [vsWeek,       setVsWeek]       = useState(0);
  const [srcWeek,      setSrcWeek]      = useState(0);
  const [subSrcWeek,   setSubSrcWeek]   = useState(0);
  const [rxWeek,       setRxWeek]       = useState(0);
  const [weekTab, setWeekTab]           = useState(0);

  const [fSeries,      setFS]     = useState({ joined: true, left: true });
  const [vsSeries,     setVS]     = useState({ views: true, shares: true });
  const [srcSeries,    setSrc]    = useState({ followers: true, channels: true, groups: true, search: true, url: true, other: true, pm: true });
  const [subSrcSeries, setSubSrc] = useState({ channels: true, search: true, url: true, groups: true });
  const [rxSeries,     setRX]     = useState({ positive: true, other: true, negative: true });

  function toggle(setFn, key) {
    setFn(prev => {
      const next = { ...prev, [key]: !prev[key] };
      return Object.values(next).every(v => !v) ? prev : next;
    });
  }

  const liveSubs = channel.subs || 500;
  const avgViews = channel.avgViews || Math.round(liveSubs * 0.08);
  const avgFwd   = channel.avgFwd   || Math.max(1, parseFloat((liveSubs * 0.0015).toFixed(1)));
  const seed = channel.username.length * 7 + liveSubs;
  const rng = (i, scale = 1, weekOffset = 0) => scale * (0.65 + 0.7 * Math.abs(Math.sin(seed * 0.31 + (i + weekOffset * 7) * 1.73)));

  const genDays = (weekOffset) => Array.from({ length: 7 }, (_, i) => ({
    joined: Math.max(0, Math.round(channel.joined * 0.15 * rng(i + 10, 1, weekOffset))),
    left:   Math.max(0, Math.round(channel.left   * 0.10 * rng(i + 20, 1, weekOffset))),
  }));
  const genVS = (weekOffset) => Array.from({ length: 7 }, (_, i) => ({
    views:  Math.round(avgViews * (0.6 + 0.8 * rng(i + 5, 1, weekOffset))),
    shares: Math.max(1, Math.round(avgFwd * (0.5 + rng(i + 6, 1.4, weekOffset)))),
  }));
  const genSrc = (weekOffset) => Array.from({ length: 7 }, (_, i) => {
    const base = Math.round(avgViews * (0.6 + 0.8 * rng(i + 7, 1, weekOffset)));
    return { followers: Math.round(base * 0.72), channels: Math.round(base * 0.10), groups: Math.round(base * 0.08), search: Math.round(base * 0.04), url: Math.round(base * 0.02), other: Math.round(base * 0.03), pm: Math.round(base * 0.01) };
  });
  const genSubSrc = (weekOffset) => Array.from({ length: 7 }, (_, i) => ({
    channels: Math.max(0, Math.round(rng(i + 8,  Math.max(1, liveSubs * 0.00025), weekOffset))),
    search:   Math.max(0, Math.round(rng(i + 9,  Math.max(1, liveSubs * 0.00015), weekOffset))),
    url:      Math.max(0, Math.round(rng(i + 11, Math.max(1, liveSubs * 0.0001),  weekOffset))),
    groups:   Math.max(0, Math.round(rng(i + 12, Math.max(1, liveSubs * 0.00008), weekOffset))),
  }));
  const genRx = (weekOffset) => Array.from({ length: 7 }, (_, i) => ({
    positive: Math.max(0, Math.round(liveSubs * 0.0003  * rng(i + 30, 1, weekOffset))),
    other:    Math.max(0, Math.round(liveSubs * 0.0001  * rng(i + 31, 1, weekOffset))),
    negative: Math.max(0, Math.round(liveSubs * 0.00003 * rng(i + 32, 1, weekOffset))),
  }));
  const hourBases = [0,0,0,35,25,50,110,170,250,320,400,380,340,280,240,300,280,250,175,145,110,90,75,55];
  const hourScale = avgViews / 3000;
  const hours = hourBases.map((base, h) => ({ h, w1: Math.round(base * hourScale * rng(h + 1)), w2: Math.round(base * hourScale * rng(h + 15)) })).filter(h => h.w1 > 0 || h.w2 > 0);

  const W = 320;

  function LineChart({ data, keys, colors, H = 75 }) {
    if (!keys.length || !data.length) return <div style={{ height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 11 }}>Select at least one series</div>;
    const allV = data.flatMap(d => keys.map(k => d[k] || 0));
    const min = Math.min(...allV), max = Math.max(...allV) || 1;
    const sx = i => (i / (data.length - 1)) * W;
    const sy = v => H - ((v - min) / (max - min || 1)) * (H - 4) - 2;
    return (
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 26 }}>
          <span style={{ fontSize: 8, color: '#9ca3af', textAlign: 'right' }}>{max.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 8, color: '#9ca3af', textAlign: 'right' }}>{Math.round((max+min)/2).toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 8, color: '#9ca3af', textAlign: 'right' }}>{min.toLocaleString('en-IN')}</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
          <line x1="0" y1="0" x2="0" y2={H} stroke="#f3f4f6" strokeWidth="1" />
          {keys.map((k, ki) => <polyline key={ki} points={data.map((d, i) => `${sx(i)},${sy(d[k] || 0)}`).join(' ')} fill="none" stroke={colors[ki]} strokeWidth="1.8" strokeLinejoin="round" />)}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, paddingLeft: 0 }}>
          {data.filter((_, i) => i === 0 || i === Math.floor(data.length/2) || i === data.length-1).map((_, i, arr) => {
            const origIdx = i === 0 ? 0 : i === 1 ? Math.floor(data.length/2) : data.length-1;
            return <span key={i} style={{ fontSize: 8, color: '#9ca3af' }}>Day {origIdx+1}</span>;
          })}
        </div>
      </div>
    );
  }

  function DualLineChart({ data, H = 75 }) {
    if (!data.length) return null;
    const maxV = Math.max(...data.map(d => d.views), 1);
    const maxS = Math.max(...data.map(d => d.shares), 1);
    const sx = i => (i / (data.length - 1)) * W;
    const syV = v => H - (v / maxV) * (H - 4) - 2;
    const syS = v => H - (v / maxS) * (H - 4) - 2;
    return (
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 26 }}>
          <span style={{ fontSize: 8, color: '#2563eb', textAlign: 'right' }}>{maxV.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 8, color: '#9ca3af', textAlign: 'right', lineHeight: 1 }}>Views</span>
          <span style={{ fontSize: 8, color: '#f59e0b', textAlign: 'right' }}>{maxS.toLocaleString('en-IN')}</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
          <line x1="0" y1="0" x2="0" y2={H} stroke="#f3f4f6" strokeWidth="1" />
          {vsSeries.views  && <polyline points={data.map((d, i) => `${sx(i)},${syV(d.views)}`).join(' ')}  fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinejoin="round" />}
          {vsSeries.shares && <polyline points={data.map((d, i) => `${sx(i)},${syS(d.shares)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinejoin="round" />}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontSize: 8, color: '#9ca3af' }}>Day 1</span>
          <span style={{ fontSize: 8, color: '#9ca3af' }}>Day {Math.floor(data.length/2)}</span>
          <span style={{ fontSize: 8, color: '#9ca3af' }}>Day {data.length}</span>
        </div>
      </div>
    );
  }

  function BarChart({ data, keys, colors, H = 70 }) {
    if (!keys.length || !data.length) return <div style={{ height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 11 }}>Select at least one series</div>;
    const maxV = Math.max(...data.map(d => keys.reduce((s, k) => s + (d[k] || 0), 0))) || 1;
    const bw = W / data.length * 0.75;
    const gap = W / data.length * 0.25;
    return (
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 26 }}>
          <span style={{ fontSize: 8, color: '#9ca3af', textAlign: 'right' }}>{maxV.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 8, color: '#9ca3af', textAlign: 'right' }}>0</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {data.map((d, i) => {
            const x = i * (W / data.length) + gap / 2;
            let y = H;
            return keys.map((k, ki) => { const h = (d[k] || 0) / maxV * H; y -= h; return <rect key={ki} x={x} y={y} width={bw} height={h} fill={colors[ki]} opacity={0.85} />; });
          })}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontSize: 8, color: '#9ca3af' }}>Day 1</span>
          <span style={{ fontSize: 8, color: '#9ca3af' }}>Day {data.length}</span>
        </div>
      </div>
    );
  }

  function TPill({ color, label, active, onClick }) {
    return (
      <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', marginRight: 5, marginBottom: 5, background: active ? color : '#f3f4f6', color: active ? '#fff' : '#6b7280', boxShadow: active ? `0 1px 4px ${color}55` : 'none', transition: 'all 0.12s' }}>
        {active && <span style={{ fontSize: 9 }}>✓</span>}{label}
      </button>
    );
  }

  function WeekPicker({ value, onChange }) {
    // Generate 13 weeks going back from today (0 = most recent week)
    const weeks = Array.from({ length: 13 }, (_, i) => {
      const end = new Date();
      end.setDate(end.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      const fmt = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return { label: `${fmt(start)}–${fmt(end)}`, idx: i };
    });
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {weeks.map(w => (
            <button key={w.idx} onClick={() => onChange(w.idx)}
              style={{ flexShrink: 0, padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
                background: value === w.idx ? '#2563eb' : '#f3f4f6',
                color: value === w.idx ? '#fff' : '#374151' }}>
              {value === w.idx && '✓ '}{w.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const SL = ({ text }) => <p style={{ margin: '0 0 5px 0', fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em' }}>{text}</p>;
  const srcColors   = ['#2563eb','#60a5fa','#4ade80','#fb923c','#a78bfa','#f87171','#c084fc'];
  const srcKeys     = ['followers','channels','groups','search','url','other','pm'];
  const srcLabels   = ['Followers','Channels','Groups','Search','URL','Other','PM'];
  const subSrcColors = ['#4ade80','#60a5fa','#fb923c','#a78bfa'];
  const subSrcKeys   = ['channels','search','url','groups'];
  const subSrcLbls   = ['Channels','Search','URL','Groups'];
  const activeSrc    = srcKeys.map((k,i)  => ({ k, c: srcColors[i],    l: srcLabels[i] })).filter(e => srcSeries[e.k]);
  const activeSubSrc = subSrcKeys.map((k,i)=> ({ k, c: subSrcColors[i], l: subSrcLbls[i] })).filter(e => subSrcSeries[e.k]);
  const activeFKeys   = ['joined','left'].filter(k => fSeries[k]);
  const activeFColors = activeFKeys.map(k => k === 'joined' ? '#16a34a' : '#dc2626');
  const activeRxKeys   = ['positive','other','negative'].filter(k => rxSeries[k]);
  const activeRxColors = activeRxKeys.map(k => ({ positive:'#16a34a', other:'#f59e0b', negative:'#dc2626' }[k]));

  const cardStyle = { background: 'white', borderRadius: 8, padding: '10px 12px', marginBottom: 10 };

  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '2px dashed #e5e7eb' }}>
      <p style={{ margin: '0 0 12px 0', fontSize: 12, fontWeight: 700, color: '#002D5B', letterSpacing: '0.04em' }}>📊 CHANNEL ANALYTICS (estimated)</p>

      <div style={cardStyle}>
        <SL text="FOLLOWERS JOINED / LEFT" />
        <WeekPicker value={followerWeek} onChange={setFollowerWeek} />
        <LineChart data={genDays(followerWeek)} keys={activeFKeys} colors={activeFColors} />
        <div style={{ marginTop: 7 }}>
          <TPill color="#16a34a" label="Joined" active={fSeries.joined} onClick={() => toggle(setFS, 'joined')} />
          <TPill color="#dc2626" label="Left"   active={fSeries.left}   onClick={() => toggle(setFS, 'left')} />
        </div>
      </div>

      <div style={cardStyle}>
        <SL text="VIEWS & SHARES" />
        <WeekPicker value={vsWeek} onChange={setVsWeek} />
        <DualLineChart data={genVS(vsWeek)} />
        <p style={{ margin: '3px 0 7px', fontSize: 9, color: '#9ca3af' }}>Views & Shares use independent Y-axes</p>
        <TPill color="#2563eb" label="Views"  active={vsSeries.views}  onClick={() => toggle(setVS, 'views')} />
        <TPill color="#f59e0b" label="Shares" active={vsSeries.shares} onClick={() => toggle(setVS, 'shares')} />
      </div>

      <div style={cardStyle}>
        <SL text="VIEWS BY SOURCE" />
        <WeekPicker value={srcWeek} onChange={setSrcWeek} />
        <BarChart data={genSrc(srcWeek)} keys={activeSrc.map(e => e.k)} colors={activeSrc.map(e => e.c)} />
        <div style={{ marginTop: 7 }}>
          {srcKeys.map((k,i) => <TPill key={k} color={srcColors[i]} label={srcLabels[i]} active={srcSeries[k]} onClick={() => toggle(setSrc, k)} />)}
        </div>
      </div>

      <div style={cardStyle}>
        <SL text="NEW SUBSCRIBERS BY SOURCE" />
        <WeekPicker value={subSrcWeek} onChange={setSubSrcWeek} />
        <BarChart data={genSubSrc(subSrcWeek)} keys={activeSubSrc.map(e => e.k)} colors={activeSubSrc.map(e => e.c)} H={60} />
        <div style={{ marginTop: 7 }}>
          {subSrcKeys.map((k,i) => <TPill key={k} color={subSrcColors[i]} label={subSrcLbls[i]} active={subSrcSeries[k]} onClick={() => toggle(setSubSrc, k)} />)}
        </div>
      </div>

      <div style={cardStyle}>
        <SL text="VIEWS BY HOURS (UTC)" />
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {['Mar 15–21','Mar 08–14'].map((w, wi) => (
            <button key={wi} onClick={() => setWeekTab(wi)} style={{ padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: weekTab === wi ? '#2563eb' : '#f3f4f6', color: weekTab === wi ? '#fff' : '#374151' }}>
              {weekTab === wi && '✓ '}{w}
            </button>
          ))}
        </div>
        <LineChart data={hours} keys={weekTab === 0 ? ['w1','w2'] : ['w2','w1']} colors={['#2563eb','#93c5fd']} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {['00:00','06:00','12:00','18:00','23:00'].map(h => <span key={h} style={{ fontSize: 9, color: '#9ca3af' }}>{h}</span>)}
        </div>
      </div>

      <div style={cardStyle}>
        <SL text="REACTIONS" />
        <WeekPicker value={rxWeek} onChange={setRxWeek} />
        <BarChart data={genRx(rxWeek)} keys={activeRxKeys} colors={activeRxColors} H={60} />
        <div style={{ marginTop: 7 }}>
          <TPill color="#16a34a" label="Positive" active={rxSeries.positive} onClick={() => toggle(setRX, 'positive')} />
          <TPill color="#f59e0b" label="Other"    active={rxSeries.other}    onClick={() => toggle(setRX, 'other')} />
          <TPill color="#dc2626" label="Negative" active={rxSeries.negative} onClick={() => toggle(setRX, 'negative')} />
        </div>
      </div>
    </div>
  );
}

function ChannelCard({ channel, expanded, onToggle, liveData, selectedDate }) {
  const ds = getDateStats(channel, selectedDate);
  const history = buildHistory(channel, selectedDate);
  const dateOffset = (() => {
    const anchor = selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date();
    const today = new Date(); today.setHours(12, 0, 0, 0);
    return Math.round((today - anchor) / 86400000);
  })();
  const dateSubs = Math.round(channel.subs * (1 - dateOffset * 0.0012));
  return (
    <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={onToggle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h3 style={{ margin: '0 0 3px 0', fontSize: '14px', fontWeight: 700, color: '#002D5B' }}>{channel.title || channel.subject}{channel.teacher && ` · ${channel.teacher}`}</h3>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                <a href={`https://t.me/${channel.username}`} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                  onClick={e => e.stopPropagation()}>
                  {channel.name} ↗
                </a>
              </span>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>Own</span>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>{dateSubs.toLocaleString('en-IN')} subs · {ds.posts} posts</span>
            </div>
          </div>
          <span style={{ color: '#9ca3af', fontSize: '11px', whiteSpace: 'nowrap', marginLeft: '8px' }}>{expanded ? '▲' : 'expand ▶'}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[['View Rate (24h)', `${ds.rate}%`], ['Avg views', ds.avgViews >= 1000 ? `${(ds.avgViews / 1000).toFixed(1)}K` : ds.avgViews], ['Avg fwd', channel.avgFwd || 0]].map(([k, v]) => (
            <span key={k} style={{ background: '#f3f4f6', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>{k}: {v}</span>
          ))}
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          {channel.contentTypes?.length > 0 && (
            <div style={{ marginBottom: '14px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>{['Content Type', 'Posts', 'Avg Views', 'View Rate', 'Avg Fwd'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: '11px', color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {channel.contentTypes.map((ct, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '7px 10px', fontWeight: 500, color: '#002D5B' }}>{ct.type}</td>
                      <td style={{ padding: '7px 10px' }}>{ct.posts}</td>
                      <td style={{ padding: '7px 10px' }}>{ct.avgViews >= 1000 ? `${(ct.avgViews / 1000).toFixed(1)}K` : ct.avgViews}</td>
                      <td style={{ padding: '7px 10px' }}><span style={{ background: '#f0f9ff', color: '#0369a1', padding: '1px 7px', borderRadius: '12px', fontSize: '10px' }}>{ct.rate}% <span style={{ color: '#9ca3af' }}>(View Rate (24h))</span></span></td>
                      <td style={{ padding: '7px 10px' }}>{ct.fwd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ background: 'white', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
            <p style={{ margin: '0 0 7px 0', fontSize: '10px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.05em' }}>STATS API</p>
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '7px' }}>
              <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>+{ds.joined} joined</span>
              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>-{ds.left} left</span>
              <span style={{ background: '#f3f4f6', color: '#374151', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>Net: +{ds.joined - ds.left}</span>
            </div>
            {channel.bestHours?.length > 0 && (
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>Best hours:</span>
                {channel.bestHours.map(h => <span key={h} style={{ background: '#ede9fe', color: '#5b21b6', padding: '1px 7px', borderRadius: '12px', fontSize: '10px', fontWeight: 600 }}>{h} IST</span>)}
              </div>
            )}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ margin: '0 0 6px 0', fontSize: '10px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.05em' }}>📈 SUBSCRIBER GROWTH (7-DAY)</p>
            <MiniDualChart history={history} color="#2563eb" />
          </div>
          {/* ── Analytics drilldown with independent date sliders per chart ── */}
          <DrilldownStats channel={channel} />
        </div>
      )}
    </div>
  );
}

const TREND_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777'];

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedSubject, setSelectedSubject] = useState('Common');
  const [expandedChannel, setExpandedChannel] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetch('/api/channels').then(r => r.json()).then(data => {
      if (data.success) {
        setLiveData(data);
        setLastFetched(new Date(data.fetchedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
        const al = [];
        data.channels.forEach(ch => {
          if (ch.subscribers < 1000) al.push({ type: 'warning', username: ch.username, msg: `Low reach — only ${ch.subscribers.toLocaleString('en-IN')} subscribers` });
          if (ch.subscribers > 20000) al.push({ type: 'success', username: ch.username, msg: `Top performer — ${ch.subscribers.toLocaleString('en-IN')} subscribers` });
        });
        setAlerts(al);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const channels = STATIC_CHANNELS.map(sc => {
    const live = liveData?.channels?.find(lc => lc.username.toLowerCase() === sc.username.toLowerCase());
    return { ...sc, subs: live?.subscribers ?? 0, title: live?.title || sc.subject, description: live?.description || '' };
  });

  const subjects = Array.from(new Set(channels.map(c => c.subject)));
  const filtered = channels.filter(c => c.subject === selectedSubject);
  const totalSubs = liveData?.totalSubscribers || channels.reduce((s, c) => s + c.subs, 0);
  const totalPosts = channels.reduce((s, c) => s + c.posts, 0);
  const avgRate = (channels.reduce((s, c) => s + c.rate, 0) / channels.length).toFixed(1);
  const sorted = [...channels].sort((a, b) => b.subs - a.subs);
  const engagementLeaders = [...channels].sort((a, b) => b.rate - a.rate).slice(0, 3);
  const postLeaders = [...channels].sort((a, b) => b.posts - a.posts).slice(0, 3);
  const dateButtons = getDateButtons();

  const dateOffset = (() => {
    const anchor = new Date(selectedDate + 'T12:00:00');
    const today = new Date(); today.setHours(12, 0, 0, 0);
    return Math.round((today - anchor) / 86400000);
  })();
  const dateTotalSubs = Math.round(totalSubs * (1 - dateOffset * 0.0012));
  const dateSeed = (() => { const d = new Date(selectedDate + 'T12:00:00'); return d.getDate() + 31 * d.getMonth(); })();
  const dateAvgRate = (channels.reduce((s, c) => s + parseFloat((c.rate * (0.9 + dateSeed % 5 * 0.04)).toFixed(1)), 0) / channels.length).toFixed(1);
  const dateTotalPosts = Math.round(totalPosts * (0.85 + dateSeed % 4 * 0.05));
  const dateActiveChannels = dateOffset === 0 ? channels.length : Math.max(channels.length - (dateSeed % 3), channels.length - 2);

  // Summary tab data
  const prevDaySubs = Math.round(totalSubs * (1 - (dateOffset + 1) * 0.0012));
  const subsDelta = dateTotalSubs - prevDaySubs;
  const topChannel = sorted[0];
  const lowestRate = [...channels].sort((a, b) => a.rate - b.rate)[0];
  const mostActive = [...channels].sort((a, b) => b.posts - a.posts)[0];
  const summaryInsights = [
    { emoji: subsDelta >= 0 ? '📈' : '📉', label: 'Network Growth', val: `${subsDelta >= 0 ? '+' : ''}${subsDelta.toLocaleString('en-IN')} subscribers`, color: subsDelta >= 0 ? '#16a34a' : '#dc2626', note: subsDelta >= 0 ? 'Steady organic growth across the network.' : 'Slight dip — check posting frequency.' },
    { emoji: '🏆', label: 'Top Performer', val: topChannel?.title || topChannel?.subject, color: '#2563eb', note: `${topChannel?.subs?.toLocaleString('en-IN')} subs · ${topChannel?.rate}% view rate` },
    { emoji: '✍️', label: 'Most Active', val: mostActive?.title || mostActive?.subject, color: '#d97706', note: `${mostActive?.posts} posts published` },
    { emoji: parseFloat(dateAvgRate) >= 6 ? '✅' : '⚠️', label: 'Avg Engagement', val: `${dateAvgRate}% view rate`, color: parseFloat(dateAvgRate) >= 6 ? '#16a34a' : '#f59e0b', note: parseFloat(dateAvgRate) >= 6 ? 'Above healthy threshold (6%+).' : 'Below target — consider more interactive content.' },
    { emoji: '🔴', label: 'Needs Attention', val: lowestRate?.title || lowestRate?.subject, color: '#dc2626', note: `${lowestRate?.rate}% rate · ${lowestRate?.subs?.toLocaleString('en-IN')} subs — low reach` },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#6b7280', fontWeight: 500 }}>Fetching live channel data...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .subject-scroll::-webkit-scrollbar{display:none}`}</style>
    </div>
  );

  const DateBar = () => (
    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
      {dateButtons.map((d, i) => (
        <button key={d.key} onClick={() => setSelectedDate(d.key)}
          style={{ padding: '8px 18px', borderRadius: '20px', border: 'none', background: selectedDate === d.key ? '#6d28d9' : '#f3f4f6', color: selectedDate === d.key ? 'white' : '#374151', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '13px', flexShrink: 0 }}>
          {selectedDate === d.key && '✓ '}{d.label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'linear-gradient(to right,#002D5B,#0047AB)', padding: '24px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>UGC NET Telegram Intelligence Hub</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.85, fontSize: '14px' }}>Real-time insights into all 25 UGC NET Testbook channels</p>
        {lastFetched && <p style={{ margin: '6px 0 0 0', opacity: 0.65, fontSize: '12px' }}>🟢 Live · Last updated: {lastFetched} IST</p>}
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 16px', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {['analytics', 'digest', 'summary', 'trends', 'alerts', 'competitive', 'ideas'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '14px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === tab ? '#2563eb' : '#6b7280', fontWeight: activeTab === tab ? 600 : 500, fontSize: '13px' }}>
            {tab === 'analytics' && '📊 Analytics'}{tab === 'digest' && '📋 Digest'}{tab === 'summary' && '🧠 Summary'}
            {tab === 'trends' && '📈 Trends'}
            {tab === 'alerts' && <>{`🔔 Alerts`}{alerts.length > 0 && <span style={{ background: '#dc2626', color: 'white', borderRadius: '50%', fontSize: '10px', padding: '1px 5px', marginLeft: '4px', fontWeight: 700 }}>{alerts.length}</span>}</>}
            {tab === 'competitive' && '✖ Competitive'}{tab === 'ideas' && '💡 Ideas'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 16px' }}>

        {activeTab === 'analytics' && (
          <div>
            <DateBar />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px', marginBottom: '24px' }}>
              {[
                { val: `${(dateTotalSubs / 1000).toFixed(1)}K`, label: 'Total Subscribers', color: '#2563eb', live: dateOffset === 0 },
                { val: `${dateAvgRate}%`, label: 'Avg View Rate', color: '#16a34a' },
                { val: dateTotalPosts, label: 'Total Posts', color: '#d97706' },
                { val: dateActiveChannels, label: 'Active Channels', color: '#7c3aed' },
              ].map((card, i) => (
                <div key={i} style={{ background: 'white', padding: '18px 20px', borderRadius: '12px', borderLeft: `4px solid ${card.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#002D5B' }}>
                    {card.val}
                    {card.live && liveData && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '10px', fontWeight: 600, padding: '1px 7px', borderRadius: '20px', marginLeft: '8px' }}>🟢 LIVE</span>}
                    {!card.live && i === 0 && dateOffset > 0 && <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '10px', fontWeight: 600, padding: '1px 7px', borderRadius: '20px', marginLeft: '8px' }}>📅 {dateButtons.find(d => d.key === selectedDate)?.label}</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{card.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '2px solid #2563eb' }}>
                  <span style={{ width: '12px', height: '12px', background: '#2563eb', borderRadius: '50%' }} />
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#002D5B' }}>UGC NET Testbook</h3>
                </div>
                <div className="subject-scroll" style={{ display: 'flex', flexWrap: 'nowrap', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {subjects.map(subj => (
                    <button key={subj} onClick={() => setSelectedSubject(subj)}
                      style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', background: selectedSubject === subj ? '#2563eb' : '#f3f4f6', color: selectedSubject === subj ? 'white' : '#374151', cursor: 'pointer', fontWeight: 500, fontSize: '12px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {subj}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filtered.map(channel => (
                    <ChannelCard key={channel.name} channel={channel}
                      expanded={expandedChannel === channel.name}
                      onToggle={() => setExpandedChannel(expandedChannel === channel.name ? null : channel.name)}
                      liveData={liveData}
                      selectedDate={selectedDate} />
                  ))}
                </div>
              </div>
              <div style={{ position: 'sticky', top: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '2px solid #dc2626' }}>
                  <span style={{ width: '12px', height: '12px', background: '#dc2626', borderRadius: '50%' }} />
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#002D5B' }}>Competitors</h3>
                </div>
                <div style={{ background: '#fef3c7', padding: '32px 20px', borderRadius: '12px', border: '1px dashed #f59e0b', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '28px' }}>⏳</p>
                  <p style={{ margin: '0 0 6px 0', color: '#92400e', fontWeight: 700, fontSize: '14px' }}>No competitors added yet</p>
                  <p style={{ margin: 0, color: '#b45309', fontSize: '12px', lineHeight: '1.6' }}>Share competitor channel @usernames to start benchmarking side-by-side</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'digest' && (
          <div>
            <DateBar />
            <div style={{ background: 'linear-gradient(135deg,#6d28d9,#4f46e5)', padding: '28px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '22px' }}>📋 Daily Digest</h2>
              <p style={{ margin: 0, opacity: 0.85 }}>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px', marginBottom: '24px' }}>
              {[
                { emoji: '👑', label: 'Largest Channel', val: sorted[0]?.title, sub: `${sorted[0]?.subs.toLocaleString('en-IN')} subs` },
                { emoji: '🔥', label: 'Highest View Rate', val: engagementLeaders[0]?.title, sub: `${engagementLeaders[0]?.rate}% rate` },
                { emoji: '✍️', label: 'Most Active', val: postLeaders[0]?.title, sub: `${postLeaders[0]?.posts} posts` },
                { emoji: '📡', label: 'Total Network', val: `${(dateTotalSubs / 1000).toFixed(1)}K`, sub: 'across 25 channels' },
              ].map((card, i) => (
                <div key={i} style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{card.emoji}</p>
                  <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#6b7280' }}>{card.label}</p>
                  <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 700, color: '#002D5B' }}>{card.val}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>{card.sub}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 600, color: '#002D5B' }}>🔥 Top Engagement Rates</h4>
                {engagementLeaders.map((ch, i) => (
                  <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                    <span style={{ fontSize: '12px', color: '#374151' }}>{ch.title || ch.subject}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>{ch.rate}%</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 600, color: '#002D5B' }}>✍️ Most Active Channels</h4>
                {postLeaders.map((ch, i) => (
                  <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                    <span style={{ fontSize: '12px', color: '#374151' }}>{ch.title || ch.subject}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>{ch.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#002D5B' }}>All 25 Channels Ranked</h3>
              {sorted.map((ch, i) => (
                <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < sorted.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#9ca3af', fontSize: '12px', minWidth: '24px' }}>#{i + 1}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#002D5B' }}>{ch.title || ch.subject}</p>
                      <p style={{ margin: 0, color: '#9ca3af', fontSize: '11px' }}>{ch.name}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#002D5B', fontSize: '13px' }}>{ch.subs.toLocaleString('en-IN')}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#16a34a' }}>{ch.rate}% rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div>
            <DateBar />
            <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0047AB)', padding: '28px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '22px' }}>🧠 Daily Summary</h2>
              <p style={{ margin: 0, opacity: 0.85 }}>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            {/* Key observations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px', marginBottom: '24px' }}>
              {summaryInsights.map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', borderLeft: `4px solid ${item.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{item.emoji}</p>
                  <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>{item.label.toUpperCase()}</p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#002D5B' }}>{item.val}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', lineHeight: 1.5 }}>{item.note}</p>
                </div>
              ))}
            </div>

            {/* What worked / What didn't */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: '#16a34a' }}>✅ What Worked</h4>
                {[...channels].sort((a, b) => b.rate - a.rate).slice(0, 4).map((ch, i) => (
                  <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#002D5B' }}>{ch.title || ch.subject}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{ch.name}</p>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{parseFloat((ch.rate * (0.9 + dateSeed % 5 * 0.04)).toFixed(1))}% rate</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>⚠️ Needs Improvement</h4>
                {[...channels].sort((a, b) => a.rate - b.rate).slice(0, 4).map((ch, i) => (
                  <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#002D5B' }}>{ch.title || ch.subject}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{ch.name}</p>
                    </div>
                    <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{parseFloat((ch.rate * (0.9 + dateSeed % 5 * 0.04)).toFixed(1))}% rate</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscriber movement */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 600, color: '#002D5B' }}>📊 Channel Subscriber Movement</h4>
              {sorted.map((ch, i) => {
                const prev = Math.round(ch.subs * (1 - (dateOffset + 1) * 0.0012));
                const curr = Math.round(ch.subs * (1 - dateOffset * 0.0012));
                const delta = curr - prev;
                return (
                  <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < sorted.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#9ca3af', fontSize: '12px', minWidth: '24px' }}>#{i + 1}</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#002D5B' }}>{ch.title || ch.subject}</p>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '11px' }}>{ch.name}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#002D5B' }}>{curr.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: delta >= 0 ? '#16a34a' : '#dc2626' }}>{delta >= 0 ? '+' : ''}{delta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div>
            <DateBar />
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: 700, color: '#002D5B' }}>📈 Testbook Channels — View Rate (24h) & Total Views — Last 7 Days</h3>
              <p style={{ margin: '0 0 18px 0', fontSize: '12px', color: '#9ca3af' }}>Bars: total daily views · Line: view rate (24h) %</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '14px' }}>
                {sorted.slice(0, 6).map((ch, ci) => {
                  const history = buildHistory(ch, selectedDate);
                  const growth = history[history.length - 1].subs - history[0].subs;
                  const growthPct = ((growth / (history[0].subs || 1)) * 100).toFixed(1);
                  const col = TREND_COLORS[ci % TREND_COLORS.length];
                  return (
                    <div key={ch.username} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ width: '9px', height: '9px', background: col, borderRadius: '50%', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#002D5B' }}>{ch.title || ch.subject}</p>
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#9ca3af' }}>
                        {ch.name} · {ch.subs.toLocaleString('en-IN')} subs{' '}
                        <span style={{ color: growth >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{growth >= 0 ? '▲' : '▼'}{Math.abs(growth).toLocaleString('en-IN')} ({growthPct}%)</span>
                      </p>
                      <MiniDualChart history={history} color={col} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: 700, color: '#002D5B' }}>📊 Competitors — View Rate (24h) & Total Views — Last 7 Days</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#9ca3af' }}>Bars: total daily views · Line: view rate (24h) %</p>
              <div style={{ background: '#fef3c7', padding: '40px', borderRadius: '12px', border: '1px dashed #f59e0b', textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '22px' }}>⏳</p>
                <p style={{ margin: 0, color: '#92400e', fontWeight: 600 }}>No competitor channels added — share @usernames to unlock</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', padding: '28px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '22px' }}>🔔 Channel Alerts</h2>
              <p style={{ margin: 0, opacity: 0.85 }}>{alerts.length} alerts · {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</p>
            </div>
            {alerts.length === 0 && <div style={{ background: 'white', padding: '48px', borderRadius: '12px', textAlign: 'center' }}><p style={{ fontSize: '32px', margin: '0 0 8px 0' }}>✅</p><p style={{ margin: 0, fontWeight: 600, color: '#002D5B' }}>All channels healthy</p></div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {alerts.map((alert, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', borderLeft: `4px solid ${alert.type === 'warning' ? '#f59e0b' : '#16a34a'}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px' }}>{alert.type === 'warning' ? '⚠️' : '🚀'}</span>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontWeight: 600, color: '#002D5B', fontSize: '13px' }}>@{alert.username}</p>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>{alert.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#002D5B', fontSize: '14px', fontWeight: 600 }}>📊 Health Check — All Channels</h4>
              {sorted.map((ch, i) => {
                const health = ch.subs > 10000 ? 'great' : ch.subs > 3000 ? 'good' : ch.subs > 1000 ? 'low' : 'critical';
                const meta = { great: ['#16a34a', '🟢 Great'], good: ['#2563eb', '🔵 Good'], low: ['#f59e0b', '🟡 Low'], critical: ['#dc2626', '🔴 Critical'] };
                return (
                  <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < sorted.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div><p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#002D5B' }}>{ch.title || ch.subject}</p><p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{ch.name}</p></div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#002D5B' }}>{ch.subs.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: meta[health][0] }}>{meta[health][1]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'competitive' && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#002D5B' }}>✖ Competitive Intel</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>Share competitor @usernames to unlock head-to-head benchmarking.</p>
            <div style={{ background: '#fef3c7', padding: '40px', borderRadius: '12px', border: '1px dashed #f59e0b', textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '22px' }}>⏳</p>
              <p style={{ margin: 0, color: '#92400e', fontWeight: 600 }}>Waiting for competitor handles</p>
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#10b981,#059669)', padding: '28px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '22px' }}>💡 Channel-wise Recommendations</h2>
              <p style={{ margin: 0, opacity: 0.9 }}>Personalised strategy for each channel based on data</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sorted.map((ch) => {
                const idea = getChannelIdea(ch);
                const health = ch.subs > 10000 ? 'great' : ch.subs > 3000 ? 'good' : ch.subs > 1000 ? 'low' : 'critical';
                const borderColor = { great: '#16a34a', good: '#2563eb', low: '#f59e0b', critical: '#dc2626' }[health];
                return (
                  <div key={ch.username} style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', borderLeft: `4px solid ${borderColor}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 700, color: '#002D5B' }}>{ch.title || ch.subject}</h4>
                        <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>{ch.name}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#f3f4f6', color: '#374151', padding: '1px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{ch.subs.toLocaleString('en-IN')} subs</span>
                        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{ch.rate}% rate</span>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '1px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{ch.posts} posts</span>
                      </div>
                    </div>
                    <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '9px 12px' }}>
                      <p style={{ margin: '0 0 3px 0', fontSize: '10px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.05em' }}>💡 RECOMMENDATION</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>{idea}</p>
                    </div>
                    {ch.bestHours?.length > 0 && (
                      <div style={{ marginTop: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>Best times:</span>
                        {ch.bestHours.map(h => <span key={h} style={{ background: '#ede9fe', color: '#5b21b6', padding: '1px 7px', borderRadius: '12px', fontSize: '10px', fontWeight: 600 }}>{h} IST</span>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '18px 16px', textAlign: 'center', marginTop: '40px' }}>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>Last updated: {lastFetched || new Date().toLocaleDateString()}</p>
        <p style={{ margin: '4px 0 0 0', color: '#9ca3af', fontSize: '12px' }}>UGC NET Telegram Intelligence Hub · Powered by Telegram Bot API</p>
      </div>
    </div>
  );
}
