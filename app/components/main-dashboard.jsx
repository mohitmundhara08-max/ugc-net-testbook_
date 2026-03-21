'use client';

import { useState, useEffect } from 'react';

const STATIC_CHANNELS = [
  { username: 'testbook_ugcnet', subject: 'Common', name: '@testbook_ugcnet', posts: 12, rate: 8.5, teacher: '' },
  { username: 'pritipaper1', subject: 'Paper 1', name: '@pritipaper1', posts: 11, rate: 8.9, teacher: 'Priti' },
  { username: 'tulikamam', subject: 'Paper 1', name: '@tulikamam', posts: 8, rate: 7.1, teacher: 'Tulika' },
  { username: 'Anshikamaamtestbook', subject: 'Paper 1', name: '@Anshikamaamtestbook', posts: 10, rate: 8.3, teacher: 'Anshika' },
  { username: 'testbookrajatsir', subject: 'Paper 1', name: '@testbookrajatsir', posts: 7, rate: 6.8, teacher: 'Rajat Sir' },
  { username: 'pradyumansir_testbook', subject: 'Political Science', name: '@pradyumansir_testbook', posts: 9, rate: 7.2, teacher: '' },
  { username: 'AshwaniSir_Testbook', subject: 'History', name: '@AshwaniSir_Testbook', posts: 9, rate: 7.5, teacher: '' },
  { username: 'kiranmaamtestbook', subject: 'Public Administration', name: '@kiranmaamtestbook', posts: 6, rate: 6.2, teacher: '' },
  { username: 'Manojsonker_Testbook', subject: 'Sociology', name: '@Manojsonker_Testbook', posts: 7, rate: 6.8, teacher: '' },
  { username: 'Heenamaam_testbook', subject: 'Education', name: '@Heenamaam_testbook', posts: 8, rate: 7.1, teacher: '' },
  { username: 'AditiMaam_Testbook', subject: 'Home Science', name: '@AditiMaam_Testbook', posts: 6, rate: 5.9, teacher: '' },
  { username: 'karanSir_Testbook', subject: 'Law', name: '@karanSir_Testbook', posts: 5, rate: 5.2, teacher: '' },
  { username: 'testbookdakshita', subject: 'English', name: '@testbookdakshita', posts: 6, rate: 5.8, teacher: '' },
  { username: 'AshishSir_Testbook', subject: 'Geography', name: '@AshishSir_Testbook', posts: 4, rate: 4.5, teacher: '' },
  { username: 'ShachiMaam_Testbook', subject: 'Economics', name: '@ShachiMaam_Testbook', posts: 5, rate: 4.8, teacher: '' },
  { username: 'Monikamaamtestbook', subject: 'Management', name: '@Monikamaamtestbook', posts: 3, rate: 3.9, teacher: '' },
  { username: 'yogitamaamtestbook', subject: 'Management', name: '@yogitamaamtestbook', posts: 4, rate: 4.2, teacher: '' },
  { username: 'EVS_AnshikamaamTestbook', subject: 'Environmental Science', name: '@EVS_AnshikamaamTestbook', posts: 3, rate: 3.5, teacher: '' },
  { username: 'daminimaam_testbook', subject: 'Library Science', name: '@daminimaam_testbook', posts: 2, rate: 2.8, teacher: '' },
  { username: 'TestbookShahna', subject: 'Computer Science', name: '@TestbookShahna', posts: 5, rate: 4.6, teacher: '' },
  { username: 'Prakashsirtestbook', subject: 'Sanskrit', name: '@Prakashsirtestbook', posts: 3, rate: 3.1, teacher: '' },
  { username: 'kesharisir_testbook', subject: 'Hindi', name: '@kesharisir_testbook', posts: 4, rate: 3.8, teacher: '' },
  { username: 'TestbookNiharikaMaam', subject: 'Commerce', name: '@TestbookNiharikaMaam', posts: 2, rate: 2.5, teacher: '' },
  { username: 'MrinaliniMaam_Testbook', subject: 'Psychology', name: '@MrinaliniMaam_Testbook', posts: 3, rate: 3.2, teacher: '' },
  { username: 'testbook_gauravsir', subject: 'Physical Education', name: '@testbook_gauravsir', posts: 1, rate: 1.5, teacher: '' },
];

// Simulated 7-day history (% growth per day, applied backwards from today)
function buildHistory(currentSubs) {
  const days = [];
  const today = new Date();
  let val = currentSubs;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    days.push({ label, subs: Math.round(val * (1 - i * 0.0015)) });
  }
  return days;
}

function MiniBar({ value, max, color = '#2563eb' }) {
  return (
    <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '8px', width: '100%' }}>
      <div style={{ background: color, height: '100%', width: `${Math.max(2, (value / max) * 100)}%`, borderRadius: '4px', transition: 'width 0.4s ease' }} />
    </div>
  );
}

function ChannelCard({ channel, expanded, onToggle, liveData }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '16px', cursor: 'pointer' }} onClick={onToggle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#002D5B' }}>
              {channel.title || channel.subject}{channel.teacher && ` · ${channel.teacher}`}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{channel.name}</p>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>Own</span>
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>Subscribers</p>
            <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: '#002D5B', fontSize: '15px' }}>
              {channel.subs.toLocaleString('en-IN')}
              {liveData && <span style={{ fontSize: '10px', color: '#16a34a', marginLeft: '4px' }}>●</span>}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>Posts</p>
            <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: '#002D5B', fontSize: '15px' }}>{channel.posts}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>View Rate</p>
            <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: '#002D5B', fontSize: '15px' }}>{channel.rate}%</p>
          </div>
          <div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>Status</p>
            <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '15px' }}><span style={{ color: '#16a34a' }}>● Active</span></p>
          </div>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '16px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          {channel.description && <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>{channel.description}</p>}
          <a href={`https://t.me/${channel.username}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            Open on Telegram →
          </a>
        </div>
      )}
    </div>
  );
}

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedSubject, setSelectedSubject] = useState('Common');
  const [expandedChannel, setExpandedChannel] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch('/api/channels')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setLiveData(data);
          setLastFetched(new Date(data.fetchedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
          // Generate alerts: channels where simulated 7-day growth > 2% or subs very low
          const alertList = [];
          data.channels.forEach(ch => {
            if (ch.subscribers < 1000) alertList.push({ type: 'warning', username: ch.username, msg: `Low reach — only ${ch.subscribers.toLocaleString('en-IN')} subscribers` });
            if (ch.subscribers > 20000) alertList.push({ type: 'success', username: ch.username, msg: `Top performer — ${ch.subscribers.toLocaleString('en-IN')} subscribers` });
          });
          setAlerts(alertList);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const channels = STATIC_CHANNELS.map(sc => {
    const live = liveData?.channels?.find(lc => lc.username.toLowerCase() === sc.username.toLowerCase());
    return { ...sc, subs: live?.subscribers ?? 0, title: live?.title || sc.subject, description: live?.description || '' };
  });

  const subjects = Array.from(new Set(channels.map(c => c.subject)));
  const filtered = channels.filter(c => c.subject === selectedSubject);
  const totalSubs = liveData?.totalSubscribers || channels.reduce((sum, c) => sum + c.subs, 0);
  const totalPosts = channels.reduce((sum, c) => sum + c.posts, 0);
  const avgRate = (channels.reduce((sum, c) => sum + c.rate, 0) / channels.length).toFixed(1);
  const sorted = [...channels].sort((a, b) => b.subs - a.subs);

  // Trends: top 5 channels with 7-day history
  const top5 = sorted.slice(0, 5);
  const trendColors = ['#2563eb', '#16a34a', '#d97706', '#7c3aed', '#dc2626'];

  // Digest: movers (biggest channels + engagement leaders)
  const engagementLeaders = [...channels].sort((a, b) => b.rate - a.rate).slice(0, 3);
  const postLeaders = [...channels].sort((a, b) => b.posts - a.posts).slice(0, 3);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#6b7280', fontWeight: 500 }}>Fetching live channel data...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(to right, #002D5B, #0047AB)', padding: '24px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>UGC NET Telegram Intelligence Hub</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.85, fontSize: '14px' }}>Real-time insights into all 25 UGC NET Testbook channels</p>
        {lastFetched && <p style={{ margin: '6px 0 0 0', opacity: 0.65, fontSize: '12px' }}>🟢 Live · Last updated: {lastFetched} IST</p>}
      </div>

      {/* Tab Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 16px', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {['analytics','digest','trends','alerts','competitive','ideas'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '16px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === tab ? '#2563eb' : '#6b7280', fontWeight: activeTab === tab ? 600 : 500, fontSize: '13px', position: 'relative' }}>
            {tab === 'analytics' && '📊 Analytics'}
            {tab === 'digest' && '📋 Digest'}
            {tab === 'trends' && '📈 Trends'}
            {tab === 'alerts' && <>🔔 Alerts {alerts.length > 0 && <span style={{ background: '#dc2626', color: 'white', borderRadius: '50%', fontSize: '10px', padding: '1px 5px', marginLeft: '4px', fontWeight: 700 }}>{alerts.length}</span>}</>}
            {tab === 'competitive' && '✖ Competitive'}
            {tab === 'ideas' && '💡 Ideas'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {[
                { val: `${(totalSubs/1000).toFixed(1)}K`, label: 'Total Subscribers', color: '#2563eb', live: true },
                { val: `${avgRate}%`, label: 'Avg View Rate', color: '#16a34a' },
                { val: totalPosts, label: 'Total Posts', color: '#d97706' },
                { val: '25', label: 'Active Channels', color: '#7c3aed' },
              ].map((card, i) => (
                <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${card.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#002D5B' }}>
                    {card.val}
                    {card.live && liveData && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', marginLeft: '8px' }}>🟢 LIVE</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>{card.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#002D5B' }}>🏆 Top 5 Channels</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sorted.slice(0,5).map((ch,i) => (
                  <div key={ch.username} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '28px', height: '28px', background: ['#fbbf24','#9ca3af','#b45309','#e5e7eb','#e5e7eb'][i], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: i<3?'white':'#374151', flexShrink: 0 }}>{i+1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#002D5B' }}>{ch.title||ch.subject}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#002D5B' }}>{ch.subs.toLocaleString('en-IN')}</span>
                      </div>
                      <MiniBar value={ch.subs} max={sorted[0].subs} color={trendColors[i]} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '8px' }}>
              {subjects.map(subj => (
                <button key={subj} onClick={() => setSelectedSubject(subj)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: selectedSubject===subj?'#2563eb':'#f3f4f6', color: selectedSubject===subj?'white':'#374151', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500, fontSize: '13px' }}>{subj}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(channel => (
                <ChannelCard key={channel.name} channel={channel} expanded={expandedChannel===channel.name} onToggle={() => setExpandedChannel(expandedChannel===channel.name?null:channel.name)} liveData={liveData} />
              ))}
            </div>
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#002D5B' }}>🔴 Competitors</h3>
              <div style={{ background: '#fef3c7', padding: '24px', borderRadius: '12px', border: '1px dashed #f59e0b', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#92400e', fontWeight: 600 }}>⏳ Share competitor channel handles to enable this section</p>
              </div>
            </div>
          </div>
        )}

        {/* ── DIGEST TAB ── */}
        {activeTab === 'digest' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#6d28d9,#4f46e5)', padding: '32px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>📋 Daily Digest</h2>
              <p style={{ margin: 0, opacity: 0.85 }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { emoji: '👑', label: 'Largest Channel', val: sorted[0]?.title, sub: `${sorted[0]?.subs.toLocaleString('en-IN')} subs` },
                { emoji: '🔥', label: 'Highest View Rate', val: engagementLeaders[0]?.title, sub: `${engagementLeaders[0]?.rate}% view rate` },
                { emoji: '✍️', label: 'Most Active Poster', val: postLeaders[0]?.title, sub: `${postLeaders[0]?.posts} posts` },
                { emoji: '📡', label: 'Total Network', val: `${(totalSubs/1000).toFixed(1)}K`, sub: 'across 25 channels' },
              ].map((card,i) => (
                <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '22px' }}>{card.emoji}</p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>{card.label}</p>
                  <p style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: 700, color: '#002D5B' }}>{card.val}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{card.sub}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 600, color: '#002D5B' }}>🔥 Top Engagement Rates</h4>
                {engagementLeaders.map((ch,i) => (
                  <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i<2?'1px solid #f3f4f6':'none' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{ch.title||ch.subject}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>{ch.rate}%</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 600, color: '#002D5B' }}>✍️ Most Active Channels</h4>
                {postLeaders.map((ch,i) => (
                  <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i<2?'1px solid #f3f4f6':'none' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{ch.title||ch.subject}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>{ch.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#002D5B' }}>All 25 Channels Ranked</h3>
              {sorted.map((ch,i) => (
                <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i<sorted.length-1?'1px solid #f3f4f6':'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#9ca3af', fontSize: '13px', minWidth: '28px' }}>#{i+1}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#002D5B' }}>{ch.title||ch.subject}</p>
                      <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px' }}>{ch.name}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#002D5B' }}>{ch.subs.toLocaleString('en-IN')}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#16a34a' }}>{ch.rate}% rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TRENDS TAB ── */}
        {activeTab === 'trends' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#0369a1,#0284c7)', padding: '32px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>📈 7-Day Trend View</h2>
              <p style={{ margin: 0, opacity: 0.85 }}>Simulated growth trajectory for top 5 channels</p>
            </div>

            {top5.map((ch, ci) => {
              const history = buildHistory(ch.subs);
              const maxVal = Math.max(...history.map(h => h.subs));
              const minVal = Math.min(...history.map(h => h.subs));
              const growth = ch.subs - history[0].subs;
              const growthPct = ((growth / (history[0].subs || 1)) * 100).toFixed(1);
              return (
                <div key={ch.username} style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#002D5B' }}>{ch.title||ch.subject}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{ch.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 2px 0', fontSize: '20px', fontWeight: 700, color: '#002D5B' }}>{ch.subs.toLocaleString('en-IN')}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: growth >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                        {growth >= 0 ? '▲' : '▼'} {Math.abs(growth).toLocaleString('en-IN')} ({growthPct}%) 7d
                      </p>
                    </div>
                  </div>
                  {/* Bar chart */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
                    {history.map((point, pi) => {
                      const barH = maxVal === minVal ? 60 : Math.max(8, ((point.subs - minVal) / (maxVal - minVal)) * 72);
                      const isToday = pi === history.length - 1;
                      return (
                        <div key={pi} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '100%', height: `${barH}px`, background: isToday ? trendColors[ci] : `${trendColors[ci]}55`, borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} title={`${point.label}: ${point.subs.toLocaleString('en-IN')}`} />
                          <span style={{ fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{point.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '20px', marginTop: '8px' }}>
              <p style={{ margin: '0 0 6px 0', color: '#0369a1', fontWeight: 600, fontSize: '14px' }}>📌 Note</p>
              <p style={{ margin: 0, color: '#0c4a6e', fontSize: '13px' }}>Charts show projected 7-day trajectory. Real historical data requires MTProto API — add <code>TELEGRAM_BOT_TOKEN</code> to Vercel env vars to start live tracking.</p>
            </div>
          </div>
        )}

        {/* ── ALERTS TAB ── */}
        {activeTab === 'alerts' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', padding: '32px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>🔔 Channel Alerts</h2>
              <p style={{ margin: 0, opacity: 0.85 }}>{alerts.length} alerts detected · {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long'})}</p>
            </div>

            {alerts.length === 0 && (
              <div style={{ background: 'white', padding: '48px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: '32px', margin: '0 0 12px 0' }}>✅</p>
                <p style={{ margin: 0, fontWeight: 600, color: '#002D5B' }}>All channels healthy — no alerts</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {alerts.filter(a => a.type === 'warning').map((alert, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', borderLeft: '4px solid #f59e0b', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px' }}>⚠️</span>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontWeight: 600, color: '#002D5B', fontSize: '14px' }}>@{alert.username}</p>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{alert.msg}</p>
                  </div>
                </div>
              ))}
              {alerts.filter(a => a.type === 'success').map((alert, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', borderLeft: '4px solid #16a34a', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px' }}>🚀</span>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontWeight: 600, color: '#002D5B', fontSize: '14px' }}>@{alert.username}</p>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{alert.msg}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#002D5B', fontSize: '15px', fontWeight: 600 }}>📊 All Channels Health Check</h4>
              {sorted.map((ch, i) => {
                const health = ch.subs > 10000 ? 'great' : ch.subs > 3000 ? 'good' : ch.subs > 1000 ? 'low' : 'critical';
                const colors = { great: '#16a34a', good: '#2563eb', low: '#f59e0b', critical: '#dc2626' };
                const labels = { great: '🟢 Great', good: '🔵 Good', low: '🟡 Low', critical: '🔴 Critical' };
                return (
                  <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i<sorted.length-1?'1px solid #f3f4f6':'none' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#002D5B' }}>{ch.title||ch.subject}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{ch.name}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#002D5B' }}>{ch.subs.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: colors[health] }}>{labels[health]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── COMPETITIVE TAB ── */}
        {activeTab === 'competitive' && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#002D5B' }}>✖ Competitive Intel</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>Add competitor handles to unlock this section.</p>
            <div style={{ background: '#fef3c7', padding: '32px', borderRadius: '12px', border: '1px dashed #f59e0b', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#92400e', fontWeight: 600 }}>⏳ Share competitor @usernames to unlock this section</p>
            </div>
          </div>
        )}

        {/* ── IDEAS TAB ── */}
        {activeTab === 'ideas' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#10b981,#059669)', padding: '32px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>💡 Strategic Ideas</h2>
              <p style={{ margin: 0, opacity: 0.9 }}>{new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
            </div>
            {[
              {title:'Launch "Day X" Daily Study Schedules',priority:'high',tag:'Study Plans',target:'All Channels',desc:'Reformat posts into daily schedules: Read Current Affairs, Revise Topic X, Attempt Mock Test.'},
              {title:'Branded "Good Morning Testbook Champs!" Posts',priority:'medium',tag:'Motivation',target:'All Channels',desc:'Replace generic quotes with branded community greeting. Builds stronger identity.'},
              {title:'"Question of the Day" Polls',priority:'medium',tag:'Engagement',target:'TB Pass Open',desc:'Daily MCQ poll on exam topics. Low effort, high engagement boost.'},
              {title:'Posts for Major Indian Festivals',priority:'low',tag:'Community',target:'All Channels',desc:'Content calendar for Holi, Diwali, Eid etc. Connects personally with audience.'},
            ].map((idea,i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', borderLeft: `4px solid ${idea.priority==='high'?'#dc2626':idea.priority==='medium'?'#f59e0b':'#9ca3af'}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#002D5B' }}>#{i+1} {idea.title}</h4>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ background: idea.priority==='high'?'#fee2e2':idea.priority==='medium'?'#fef9c3':'#f3f4f6', color: idea.priority==='high'?'#dc2626':idea.priority==='medium'?'#b45309':'#6b7280', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{idea.priority}</span>
                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{idea.tag}</span>
                  </div>
                </div>
                <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#374151' }}>{idea.desc}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Target: {idea.target}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '24px 16px', textAlign: 'center', marginTop: '48px' }}>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>Last updated: {lastFetched || new Date().toLocaleDateString()}</p>
        <p style={{ margin: '6px 0 0 0', color: '#9ca3af', fontSize: '12px' }}>UGC NET Telegram Intelligence Hub · Powered by Telegram Bot API</p>
      </div>
    </div>
  );
}
