'use client';
import { useState, useEffect } from 'react';

const STATIC_CHANNELS = [
  { username: 'testbook_ugcnet', subject: 'Common', name: '@testbook_ugcnet', posts: 12, rate: 8.5, teacher: '', avgViews: 3400, avgFwd: 3.7, joined: 55, left: 36, bestHours: ['3:30pm','6:30pm','7:30pm','8:30pm'], contentTypes: [{type:'Morning Motivation',posts:4,avgViews:5000,rate:5.4,fwd:1.0},{type:'News Bulletin',posts:4,avgViews:2900,rate:3.1,fwd:5.0},{type:'Study Plans',posts:4,avgViews:2300,rate:2.4,fwd:5.0}], topPost: 'Morning motivation featuring a quote by Amartya Sen.' },
  { username: 'pritipaper1', subject: 'Paper 1', name: '@pritipaper1', posts: 11, rate: 8.9, teacher: 'Priti', avgViews: 1900, avgFwd: 2.1, joined: 42, left: 18, bestHours: ['7:00am','12:00pm','6:00pm'], contentTypes: [{type:'PYQ Discussion',posts:4,avgViews:2200,rate:9.8,fwd:3.0},{type:'Concept Notes',posts:4,avgViews:1800,rate:8.5,fwd:2.0},{type:'Mock Test Links',posts:3,avgViews:1500,rate:7.2,fwd:1.5}], topPost: 'Paper 1 PYQ marathon session — top 50 questions.' },
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

// 7-day history with slight random variation
function buildHistory(subs) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const variation = 1 - (i * 0.0012) - (Math.sin(i) * 0.0003);
    days.push({ label, subs: Math.round(subs * variation), views: Math.round(subs * 0.035 * (1 + Math.sin(i) * 0.15)), rate: parseFloat((3.5 + Math.sin(i * 0.8) * 1.2).toFixed(1)) });
  }
  return days;
}

function getDateButtons() {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return { label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), key: d.toISOString().slice(0,10) };
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
      <div style={{ background: color, height: '100%', width: `${Math.max(2,(value/max)*100)}%`, borderRadius: '4px' }} />
    </div>
  );
}

// Small dual-axis chart: bars = views, line = rate
function MiniDualChart({ history, color }) {
  const maxViews = Math.max(...history.map(h => h.views));
  const maxRate = Math.max(...history.map(h => h.rate));
  const minRate = Math.min(...history.map(h => h.rate));
  const H = 80, W = 100;
  const pts = history.map((h, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = H - ((h.rate - minRate) / (maxRate - minRate || 1)) * (H - 10) - 5;
    return `${x},${y}`;
  });
  return (
    <div style={{ position: 'relative', height: `${H + 20}px` }}>
      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: `${H}px`, position: 'absolute', bottom: '20px', left: 0, right: 0 }}>
        {history.map((h, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', height: `${Math.max(4,(h.views/maxViews)*H*0.75)}px`, background: `${color}44`, borderRadius: '2px 2px 0 0' }} />
          </div>
        ))}
      </div>
      {/* Line */}
      <svg style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, height: `${H}px`, width: '100%' }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" />
        {history.map((h, i) => {
          const [x, y] = pts[i].split(',');
          return <circle key={i} cx={x} cy={y} r="2.5" fill={color} />;
        })}
      </svg>
      {/* X labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        {history.filter((_, i) => i % 2 === 0).map((h, i) => (
          <span key={i} style={{ fontSize: '9px', color: '#9ca3af' }}>{h.label}</span>
        ))}
      </div>
    </div>
  );
}

function ChannelCard({ channel, expanded, onToggle, liveData }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '16px', cursor: 'pointer' }} onClick={onToggle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h3 style={{ margin: '0 0 3px 0', fontSize: '15px', fontWeight: 700, color: '#002D5B' }}>{channel.title||channel.subject}{channel.teacher&&` · ${channel.teacher}`}</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{channel.name}</span>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>Own</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{channel.subs.toLocaleString('en-IN')} subs · {channel.posts} posts</span>
            </div>
          </div>
          <span style={{ color: '#9ca3af', fontSize: '12px', whiteSpace: 'nowrap' }}>{expanded ? '▲ collapse' : 'tap to expand ▶'}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[['View Rate (24h)', `${channel.rate}%`],['Avg views',(channel.avgViews||0).toLocaleString('en-IN')],['Avg fwd',channel.avgFwd||0]].map(([k,v])=>(
            <span key={k} style={{ background:'#f3f4f6',padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:600,color:'#374151' }}>{k}: {v}</span>
          ))}
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '16px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          {channel.contentTypes?.length > 0 && (
            <div style={{ marginBottom: '16px', overflowX: 'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
                <thead>
                  <tr>{['Content Type','Posts','Avg Views','View Rate','Avg Fwd'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px',textAlign:'left',fontSize:'11px',color:'#6b7280',fontWeight:600,borderBottom:'1px solid #e5e7eb' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {channel.contentTypes.map((ct,i)=>(
                    <tr key={i} style={{ borderBottom:'1px solid #f3f4f6' }}>
                      <td style={{ padding:'8px 10px',fontWeight:500,color:'#002D5B' }}>{ct.type}</td>
                      <td style={{ padding:'8px 10px' }}>{ct.posts}</td>
                      <td style={{ padding:'8px 10px' }}>{ct.avgViews>=1000?`${(ct.avgViews/1000).toFixed(1)}K`:ct.avgViews}</td>
                      <td style={{ padding:'8px 10px' }}><span style={{ background:'#f0f9ff',color:'#0369a1',padding:'2px 8px',borderRadius:'12px',fontSize:'11px' }}>{ct.rate}% <span style={{color:'#9ca3af'}}>(View Rate (24h))</span></span></td>
                      <td style={{ padding:'8px 10px' }}>{ct.fwd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {channel.topPost && (
            <div style={{ background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'8px',padding:'12px',marginBottom:'12px' }}>
              <p style={{ margin:'0 0 8px 0',fontSize:'13px',color:'#92400e' }}><strong>Top post:</strong> {channel.topPost}</p>
              <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
                <span style={{ background:'#dbeafe',color:'#1e40af',padding:'2px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600 }}>{(channel.avgViews||0).toLocaleString('en-IN')} views</span>
                <span style={{ background:'#f0f9ff',color:'#0369a1',padding:'2px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600 }}>View Rate (24h): {channel.rate}%</span>
                <span style={{ background:'#dcfce7',color:'#16a34a',padding:'2px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600 }}>{channel.avgFwd||0} fwd</span>
              </div>
            </div>
          )}
          <div style={{ background:'white',borderRadius:'8px',padding:'12px',marginBottom:'12px' }}>
            <p style={{ margin:'0 0 8px 0',fontSize:'11px',fontWeight:600,color:'#6b7280',letterSpacing:'0.05em' }}>STATS API</p>
            <div style={{ display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'8px' }}>
              <span style={{ background:'#dcfce7',color:'#16a34a',padding:'3px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:700 }}>+{channel.joined||0} joined</span>
              <span style={{ background:'#fee2e2',color:'#dc2626',padding:'3px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:700 }}>-{channel.left||0} left</span>
              <span style={{ background:'#f3f4f6',color:'#374151',padding:'3px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:700 }}>Net: +{(channel.joined||0)-(channel.left||0)}</span>
            </div>
            {channel.bestHours?.length > 0 && (
              <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center' }}>
                <span style={{ fontSize:'12px',color:'#6b7280',fontWeight:500 }}>Best hours:</span>
                {channel.bestHours.map(h=><span key={h} style={{ background:'#ede9fe',color:'#5b21b6',padding:'2px 8px',borderRadius:'12px',fontSize:'11px',fontWeight:600 }}>{h} IST</span>)}
              </div>
            )}
          </div>
          <div style={{ marginBottom:'12px' }}>
            <p style={{ margin:'0 0 6px 0',fontSize:'11px',fontWeight:600,color:'#6b7280',letterSpacing:'0.05em' }}>📈 SUBSCRIBER GROWTH (7-DAY)</p>
            <MiniDualChart history={buildHistory(channel.subs)} color="#2563eb" />
          </div>
          <a href={`https://t.me/${channel.username}`} target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-block',background:'#2563eb',color:'white',padding:'8px 16px',borderRadius:'8px',fontSize:'13px',fontWeight:600,textDecoration:'none' }}>
            Open on Telegram →
          </a>
        </div>
      )}
    </div>
  );
}

const TREND_COLORS = ['#2563eb','#dc2626','#16a34a','#d97706','#7c3aed','#0891b2','#db2777'];

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedSubject, setSelectedSubject] = useState('Common');
  const [expandedChannel, setExpandedChannel] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10));

  useEffect(() => {
    fetch('/api/channels').then(r=>r.json()).then(data=>{
      if(data.success){
        setLiveData(data);
        setLastFetched(new Date(data.fetchedAt).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}));
        const al=[];
        data.channels.forEach(ch=>{
          if(ch.subscribers<1000) al.push({type:'warning',username:ch.username,msg:`Low reach — only ${ch.subscribers.toLocaleString('en-IN')} subscribers`});
          if(ch.subscribers>20000) al.push({type:'success',username:ch.username,msg:`Top performer — ${ch.subscribers.toLocaleString('en-IN')} subscribers`});
        });
        setAlerts(al);
      }
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  const channels = STATIC_CHANNELS.map(sc=>{
    const live=liveData?.channels?.find(lc=>lc.username.toLowerCase()===sc.username.toLowerCase());
    return {...sc,subs:live?.subscribers??0,title:live?.title||sc.subject,description:live?.description||''};
  });

  const subjects=Array.from(new Set(channels.map(c=>c.subject)));
  const filtered=channels.filter(c=>c.subject===selectedSubject);
  const totalSubs=liveData?.totalSubscribers||channels.reduce((s,c)=>s+c.subs,0);
  const totalPosts=channels.reduce((s,c)=>s+c.posts,0);
  const avgRate=(channels.reduce((s,c)=>s+c.rate,0)/channels.length).toFixed(1);
  const sorted=[...channels].sort((a,b)=>b.subs-a.subs);
  const engagementLeaders=[...channels].sort((a,b)=>b.rate-a.rate).slice(0,3);
  const postLeaders=[...channels].sort((a,b)=>b.posts-a.posts).slice(0,3);
  const dateButtons=getDateButtons();

  if(loading) return(
    <div style={{minHeight:'100vh',background:'#f9fafb',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px'}}>
      <div style={{width:'48px',height:'48px',border:'4px solid #e5e7eb',borderTop:'4px solid #2563eb',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
      <p style={{color:'#6b7280',fontWeight:500}}>Fetching live channel data...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const DateBar = () => (
    <div style={{display:'flex',gap:'8px',overflowX:'auto',marginBottom:'24px',paddingBottom:'4px'}}>
      {dateButtons.map(d=>(
        <button key={d.key} onClick={()=>setSelectedDate(d.key)} style={{padding:'8px 18px',borderRadius:'20px',border:'none',background:selectedDate===d.key?'#6d28d9':'#f3f4f6',color:selectedDate===d.key?'white':'#374151',cursor:'pointer',whiteSpace:'nowrap',fontWeight:600,fontSize:'13px',flexShrink:0}}>{d.label}</button>
      ))}
    </div>
  );

  return(
    <div style={{minHeight:'100vh',background:'#f9fafb'}}>
      <div style={{background:'linear-gradient(to right,#002D5B,#0047AB)',padding:'24px',textAlign:'center',color:'white'}}>
        <h1 style={{fontSize:'28px',fontWeight:'bold',margin:0}}>UGC NET Telegram Intelligence Hub</h1>
        <p style={{margin:'8px 0 0 0',opacity:0.85,fontSize:'14px'}}>Real-time insights into all 25 UGC NET Testbook channels</p>
        {lastFetched&&<p style={{margin:'6px 0 0 0',opacity:0.65,fontSize:'12px'}}>🟢 Live · Last updated: {lastFetched} IST</p>}
      </div>

      <div style={{background:'white',borderBottom:'1px solid #e5e7eb',padding:'0 16px',display:'flex',justifyContent:'center',gap:'24px',flexWrap:'wrap'}}>
        {['analytics','digest','trends','alerts','competitive','ideas'].map(tab=>(
          <button key={tab} onClick={()=>setActiveTab(tab)} style={{padding:'16px 0',border:'none',background:'none',cursor:'pointer',borderBottom:activeTab===tab?'2px solid #2563eb':'2px solid transparent',color:activeTab===tab?'#2563eb':'#6b7280',fontWeight:activeTab===tab?600:500,fontSize:'13px'}}>
            {tab==='analytics'&&'📊 Analytics'}{tab==='digest'&&'📋 Digest'}{tab==='trends'&&'📈 Trends'}
            {tab==='alerts'&&<>🔔 Alerts{alerts.length>0&&<span style={{background:'#dc2626',color:'white',borderRadius:'50%',fontSize:'10px',padding:'1px 5px',marginLeft:'4px',fontWeight:700}}>{alerts.length}</span>}</>}
            {tab==='competitive'&&'✖ Competitive'}{tab==='ideas'&&'💡 Ideas'}
          </button>
        ))}
      </div>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'32px 16px'}}>

        {/* ── ANALYTICS ── */}
        {activeTab==='analytics'&&(
          <div>
            <DateBar/>
            {/* Summary cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'28px'}}>
              {[{val:`${(totalSubs/1000).toFixed(1)}K`,label:'Total Subscribers',color:'#2563eb',live:true},{val:`${avgRate}%`,label:'Avg View Rate',color:'#16a34a'},{val:totalPosts,label:'Total Posts',color:'#d97706'},{val:'25',label:'Active Channels',color:'#7c3aed'}].map((card,i)=>(
                <div key={i} style={{background:'white',padding:'20px',borderRadius:'12px',borderLeft:`4px solid ${card.color}`,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                  <div style={{fontSize:'24px',fontWeight:'bold',color:'#002D5B'}}>
                    {card.val}{card.live&&liveData&&<span style={{background:'#dcfce7',color:'#16a34a',fontSize:'11px',fontWeight:600,padding:'2px 8px',borderRadius:'20px',marginLeft:'8px'}}>🟢 LIVE</span>}
                  </div>
                  <div style={{fontSize:'13px',color:'#6b7280',marginTop:'4px'}}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* Side-by-side: Testbook | Competitors */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'28px'}}>
              {/* LEFT: Testbook channels */}
              <div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px',paddingBottom:'10px',borderBottom:'2px solid #2563eb'}}>
                  <span style={{width:'14px',height:'14px',background:'#2563eb',borderRadius:'50%',display:'inline-block'}}/>
                  <h3 style={{margin:0,fontSize:'16px',fontWeight:700,color:'#002D5B'}}>Testbook (Core)</h3>
                </div>
                {/* Subject filter */}
                <div style={{display:'flex',gap:'6px',overflowX:'auto',marginBottom:'14px',paddingBottom:'4px'}}>
                  {subjects.map(subj=>(
                    <button key={subj} onClick={()=>setSelectedSubject(subj)} style={{padding:'5px 12px',borderRadius:'20px',border:'none',background:selectedSubject===subj?'#2563eb':'#f3f4f6',color:selectedSubject===subj?'white':'#374151',cursor:'pointer',whiteSpace:'nowrap',fontWeight:500,fontSize:'12px',flexShrink:0}}>{subj}</button>
                  ))}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  {filtered.map(channel=>(
                    <ChannelCard key={channel.name} channel={channel} expanded={expandedChannel===channel.name} onToggle={()=>setExpandedChannel(expandedChannel===channel.name?null:channel.name)} liveData={liveData}/>
                  ))}
                </div>
              </div>

              {/* RIGHT: Competitors */}
              <div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px',paddingBottom:'10px',borderBottom:'2px solid #dc2626'}}>
                  <span style={{width:'14px',height:'14px',background:'#dc2626',borderRadius:'50%',display:'inline-block'}}/>
                  <h3 style={{margin:0,fontSize:'16px',fontWeight:700,color:'#002D5B'}}>Competitors</h3>
                </div>
                <div style={{background:'#fef3c7',padding:'32px 24px',borderRadius:'12px',border:'1px dashed #f59e0b',textAlign:'center'}}>
                  <p style={{margin:'0 0 8px 0',fontSize:'24px'}}>⏳</p>
                  <p style={{margin:'0 0 6px 0',color:'#92400e',fontWeight:700,fontSize:'15px'}}>No competitors added yet</p>
                  <p style={{margin:0,color:'#b45309',fontSize:'13px'}}>Share competitor channel @usernames to start benchmarking side-by-side</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── DIGEST ── */}
        {activeTab==='digest'&&(
          <div>
            <DateBar/>
            <div style={{background:'linear-gradient(135deg,#6d28d9,#4f46e5)',padding:'28px',borderRadius:'16px',color:'white',textAlign:'center',marginBottom:'24px'}}>
              <h2 style={{margin:'0 0 4px 0',fontSize:'22px'}}>📋 Daily Digest</h2>
              <p style={{margin:0,opacity:0.85}}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'14px',marginBottom:'24px'}}>
              {[{emoji:'👑',label:'Largest Channel',val:sorted[0]?.title,sub:`${sorted[0]?.subs.toLocaleString('en-IN')} subs`},{emoji:'🔥',label:'Highest View Rate',val:engagementLeaders[0]?.title,sub:`${engagementLeaders[0]?.rate}% rate`},{emoji:'✍️',label:'Most Active',val:postLeaders[0]?.title,sub:`${postLeaders[0]?.posts} posts`},{emoji:'📡',label:'Total Network',val:`${(totalSubs/1000).toFixed(1)}K`,sub:'across 25 channels'}].map((card,i)=>(
                <div key={i} style={{background:'white',padding:'18px',borderRadius:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                  <p style={{margin:'0 0 4px 0',fontSize:'20px'}}>{card.emoji}</p>
                  <p style={{margin:'0 0 3px 0',fontSize:'12px',color:'#6b7280'}}>{card.label}</p>
                  <p style={{margin:'0 0 2px 0',fontSize:'15px',fontWeight:700,color:'#002D5B'}}>{card.val}</p>
                  <p style={{margin:0,fontSize:'12px',color:'#6b7280'}}>{card.sub}</p>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
              <div style={{background:'white',borderRadius:'12px',padding:'18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <h4 style={{margin:'0 0 12px 0',fontSize:'14px',fontWeight:600,color:'#002D5B'}}>🔥 Top Engagement Rates</h4>
                {engagementLeaders.map((ch,i)=>(
                  <div key={ch.username} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:i<2?'1px solid #f3f4f6':'none'}}>
                    <span style={{fontSize:'13px',color:'#374151'}}>{ch.title||ch.subject}</span>
                    <span style={{fontSize:'13px',fontWeight:700,color:'#16a34a'}}>{ch.rate}%</span>
                  </div>
                ))}
              </div>
              <div style={{background:'white',borderRadius:'12px',padding:'18px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <h4 style={{margin:'0 0 12px 0',fontSize:'14px',fontWeight:600,color:'#002D5B'}}>✍️ Most Active Channels</h4>
                {postLeaders.map((ch,i)=>(
                  <div key={ch.username} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:i<2?'1px solid #f3f4f6':'none'}}>
                    <span style={{fontSize:'13px',color:'#374151'}}>{ch.title||ch.subject}</span>
                    <span style={{fontSize:'13px',fontWeight:700,color:'#2563eb'}}>{ch.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'white',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <h3 style={{margin:'0 0 14px 0',fontSize:'15px',fontWeight:600,color:'#002D5B'}}>All 25 Channels Ranked</h3>
              {sorted.map((ch,i)=>(
                <div key={ch.username} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:i<sorted.length-1?'1px solid #f3f4f6':'none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <span style={{color:'#9ca3af',fontSize:'13px',minWidth:'26px'}}>#{i+1}</span>
                    <div>
                      <p style={{margin:0,fontWeight:600,fontSize:'13px',color:'#002D5B'}}>{ch.title||ch.subject}</p>
                      <p style={{margin:0,color:'#9ca3af',fontSize:'12px'}}>{ch.name}</p>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{margin:0,fontWeight:700,color:'#002D5B',fontSize:'13px'}}>{ch.subs.toLocaleString('en-IN')}</p>
                    <p style={{margin:0,fontSize:'11px',color:'#16a34a'}}>{ch.rate}% rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TRENDS ── */}
        {activeTab==='trends'&&(
          <div>
            <DateBar/>
            {/* Testbook channels trend section */}
            <div style={{marginBottom:'32px'}}>
              <h3 style={{margin:'0 0 4px 0',fontSize:'18px',fontWeight:700,color:'#002D5B'}}>📈 Testbook Channels — View Rate (24h) & Total Views — Last 7 Days</h3>
              <p style={{margin:'0 0 20px 0',fontSize:'12px',color:'#9ca3af'}}>Bars: total daily views · Line: view rate (24h) %</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}}>
                {sorted.slice(0,6).map((ch,ci)=>{
                  const history=buildHistory(ch.subs);
                  const growth=ch.subs-history[0].subs;
                  const growthPct=((growth/(history[0].subs||1))*100).toFixed(1);
                  const col=TREND_COLORS[ci%TREND_COLORS.length];
                  return(
                    <div key={ch.username} style={{background:'white',borderRadius:'12px',padding:'16px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                      <div style={{display:'flex',gap:'6px',alignItems:'center',marginBottom:'6px'}}>
                        <span style={{width:'10px',height:'10px',background:col,borderRadius:'50%',flexShrink:0}}/>
                        <p style={{margin:0,fontWeight:600,fontSize:'13px',color:'#002D5B'}}>{ch.title||ch.subject}</p>
                      </div>
                      <p style={{margin:'0 0 8px 0',fontSize:'11px',color:'#9ca3af'}}>{ch.name} · {ch.subs.toLocaleString('en-IN')} subs <span style={{color:growth>=0?'#16a34a':'#dc2626',fontWeight:600}}>{growth>=0?'▲':'▼'}{Math.abs(growth).toLocaleString('en-IN')} ({growthPct}%)</span></p>
                      <MiniDualChart history={history} color={col}/>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Competitors trend section */}
            <div>
              <h3 style={{margin:'0 0 4px 0',fontSize:'18px',fontWeight:700,color:'#002D5B'}}>📊 Competitors — View Rate (24h) & Total Views — Last 7 Days</h3>
              <p style={{margin:'0 0 20px 0',fontSize:'12px',color:'#9ca3af'}}>Bars: total daily views · Line: view rate (24h) %</p>
              <div style={{background:'#fef3c7',padding:'40px',borderRadius:'12px',border:'1px dashed #f59e0b',textAlign:'center'}}>
                <p style={{margin:'0 0 6px 0',fontSize:'22px'}}>⏳</p>
                <p style={{margin:0,color:'#92400e',fontWeight:600}}>No competitor channels added yet — share @usernames to unlock this section</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {activeTab==='alerts'&&(
          <div>
            <div style={{background:'linear-gradient(135deg,#dc2626,#b91c1c)',padding:'28px',borderRadius:'16px',color:'white',textAlign:'center',marginBottom:'24px'}}>
              <h2 style={{margin:'0 0 4px 0',fontSize:'22px'}}>🔔 Channel Alerts</h2>
              <p style={{margin:0,opacity:0.85}}>{alerts.length} alerts · {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long'})}</p>
            </div>
            {alerts.length===0&&<div style={{background:'white',padding:'48px',borderRadius:'12px',textAlign:'center'}}><p style={{fontSize:'32px',margin:'0 0 12px 0'}}>✅</p><p style={{margin:0,fontWeight:600,color:'#002D5B'}}>All channels healthy</p></div>}
            <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'24px'}}>
              {alerts.map((alert,i)=>(
                <div key={i} style={{background:'white',borderRadius:'12px',padding:'14px 18px',borderLeft:`4px solid ${alert.type==='warning'?'#f59e0b':'#16a34a'}`,boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',gap:'12px',alignItems:'center'}}>
                  <span style={{fontSize:'18px'}}>{alert.type==='warning'?'⚠️':'🚀'}</span>
                  <div>
                    <p style={{margin:'0 0 2px 0',fontWeight:600,color:'#002D5B',fontSize:'13px'}}>@{alert.username}</p>
                    <p style={{margin:0,color:'#6b7280',fontSize:'13px'}}>{alert.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:'white',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <h4 style={{margin:'0 0 14px 0',color:'#002D5B',fontSize:'15px',fontWeight:600}}>📊 Health Check — All Channels</h4>
              {sorted.map((ch,i)=>{
                const health=ch.subs>10000?'great':ch.subs>3000?'good':ch.subs>1000?'low':'critical';
                const meta={great:['#16a34a','🟢 Great'],good:['#2563eb','🔵 Good'],low:['#f59e0b','🟡 Low'],critical:['#dc2626','🔴 Critical']};
                return(
                  <div key={ch.username} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:i<sorted.length-1?'1px solid #f3f4f6':'none'}}>
                    <div><p style={{margin:0,fontWeight:600,fontSize:'13px',color:'#002D5B'}}>{ch.title||ch.subject}</p><p style={{margin:0,fontSize:'12px',color:'#9ca3af'}}>{ch.name}</p></div>
                    <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                      <span style={{fontSize:'13px',fontWeight:700,color:'#002D5B'}}>{ch.subs.toLocaleString('en-IN')}</span>
                      <span style={{fontSize:'11px',fontWeight:600,color:meta[health][0]}}>{meta[health][1]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── COMPETITIVE ── */}
        {activeTab==='competitive'&&(
          <div style={{background:'white',padding:'32px',borderRadius:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
            <h3 style={{margin:'0 0 8px 0',color:'#002D5B'}}>✖ Competitive Intel</h3>
            <p style={{color:'#6b7280',fontSize:'14px',marginBottom:'24px'}}>Share competitor @usernames to unlock head-to-head benchmarking.</p>
            <div style={{background:'#fef3c7',padding:'40px',borderRadius:'12px',border:'1px dashed #f59e0b',textAlign:'center'}}>
              <p style={{margin:'0 0 6px 0',fontSize:'22px'}}>⏳</p>
              <p style={{margin:0,color:'#92400e',fontWeight:600}}>Waiting for competitor handles</p>
            </div>
          </div>
        )}

        {/* ── IDEAS ── */}
        {activeTab==='ideas'&&(
          <div>
            <div style={{background:'linear-gradient(135deg,#10b981,#059669)',padding:'28px',borderRadius:'16px',color:'white',textAlign:'center',marginBottom:'24px'}}>
              <h2 style={{margin:'0 0 4px 0',fontSize:'22px'}}>💡 Channel-wise Recommendations</h2>
              <p style={{margin:0,opacity:0.9}}>Personalised strategy for each channel based on data</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {sorted.map((ch,i)=>{
                const idea=getChannelIdea(ch);
                const health=ch.subs>10000?'great':ch.subs>3000?'good':ch.subs>1000?'low':'critical';
                const borderColor={great:'#16a34a',good:'#2563eb',low:'#f59e0b',critical:'#dc2626'}[health];
                return(
                  <div key={ch.username} style={{background:'white',borderRadius:'12px',padding:'18px',borderLeft:`4px solid ${borderColor}`,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'10px'}}>
                      <div>
                        <h4 style={{margin:'0 0 2px 0',fontSize:'14px',fontWeight:700,color:'#002D5B'}}>{ch.title||ch.subject}</h4>
                        <p style={{margin:0,fontSize:'12px',color:'#6b7280',fontFamily:'monospace'}}>{ch.name}</p>
                      </div>
                      <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                        <span style={{background:'#f3f4f6',color:'#374151',padding:'2px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:600}}>{ch.subs.toLocaleString('en-IN')} subs</span>
                        <span style={{background:'#dbeafe',color:'#1e40af',padding:'2px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:600}}>{ch.rate}% rate</span>
                        <span style={{background:'#dcfce7',color:'#15803d',padding:'2px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:600}}>{ch.posts} posts</span>
                      </div>
                    </div>
                    <div style={{background:'#f9fafb',borderRadius:'8px',padding:'10px 12px'}}>
                      <p style={{margin:'0 0 3px 0',fontSize:'10px',fontWeight:600,color:'#6b7280',letterSpacing:'0.05em'}}>💡 RECOMMENDATION</p>
                      <p style={{margin:0,fontSize:'13px',color:'#374151',lineHeight:'1.7'}}>{idea}</p>
                    </div>
                    {ch.bestHours?.length>0&&(
                      <div style={{marginTop:'8px',display:'flex',gap:'5px',flexWrap:'wrap',alignItems:'center'}}>
                        <span style={{fontSize:'11px',color:'#6b7280'}}>Best times:</span>
                        {ch.bestHours.map(h=><span key={h} style={{background:'#ede9fe',color:'#5b21b6',padding:'1px 8px',borderRadius:'12px',fontSize:'11px',fontWeight:600}}>{h} IST</span>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{background:'white',borderTop:'1px solid #e5e7eb',padding:'20px 16px',textAlign:'center',marginTop:'40px'}}>
        <p style={{margin:0,color:'#6b7280',fontSize:'13px'}}>Last updated: {lastFetched||new Date().toLocaleDateString()}</p>
        <p style={{margin:'4px 0 0 0',color:'#9ca3af',fontSize:'12px'}}>UGC NET Telegram Intelligence Hub · Powered by Telegram Bot API</p>
      </div>
    </div>
  );
}
