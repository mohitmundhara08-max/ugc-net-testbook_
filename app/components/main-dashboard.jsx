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

  useEffect(() => {
    fetch('/api/channels')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setLiveData(data);
          setLastFetched(new Date(data.fetchedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#6b7280', fontWeight: 500 }}>Fetching live channel data...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'linear-gradient(to right, #002D5B, #0047AB)', padding: '24px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>UGC NET Telegram Intelligence Hub</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.85, fontSize: '14px' }}>Real-time insights into all 25 UGC NET Testbook channels</p>
        {lastFetched && <p style={{ margin: '6px 0 0 0', opacity: 0.65, fontSize: '12px' }}>🟢 Live · Last updated: {lastFetched} IST</p>}
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 16px', display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
        {['analytics','digest','trends','competitive','ideas'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '16px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === tab ? '#2563eb' : '#6b7280', fontWeight: activeTab === tab ? 600 : 500, fontSize: '14px' }}>
            {tab === 'analytics' && '📊 Channel Analytics'}
            {tab === 'digest' && '📋 Daily Digest'}
            {tab === 'trends' && '📈 Trend Charts'}
            {tab === 'competitive' && '✖ Competitive Intel'}
            {tab === 'ideas' && '💡 Ideas'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {activeTab === 'analytics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #2563eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#002D5B' }}>
                  {(totalSubs/1000).toFixed(1)}K
                  {liveData && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', marginLeft: '8px' }}>🟢 LIVE</span>}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Total Subscribers</div>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #16a34a', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#002D5B' }}>{avgRate}%</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Avg View Rate</div>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #d97706', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#002D5B' }}>{totalPosts}</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Total Posts</div>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #7c3aed', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#002D5B' }}>25</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Active Channels</div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#002D5B' }}>🏆 Top Channels by Subscribers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sorted.slice(0,5).map((ch,i) => (
                  <div key={ch.username} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '28px', height: '28px', background: i===0?'#fbbf24':i===1?'#9ca3af':i===2?'#b45309':'#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: i<3?'white':'#374151', flexShrink: 0 }}>{i+1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{ch.title||ch.subject}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#002D5B' }}>{ch.subs.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '6px' }}>
                        <div style={{ background: '#2563eb', height: '100%', width: `${(ch.subs/sorted[0].subs)*100}%`, borderRadius: '4px' }} />
                      </div>
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

        {activeTab === 'digest' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#6d28d9,#4f46e5)', padding: '32px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Daily Digest</h2>
              <p style={{ margin: 0, opacity: 0.85 }}>{new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})} — {channels.length} channels</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {[{label:'Biggest Channel',val:sorted[0]?.title,sub:`${sorted[0]?.subs.toLocaleString('en-IN')} subscribers`},{label:'Total Network',val:`${(totalSubs/1000).toFixed(1)}K`,sub:'across all 25 channels'},{label:'Avg View Rate',val:`${avgRate}%`,sub:'average engagement'}].map((card,i) => (
                <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6b7280' }}>{card.label}</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#002D5B' }}>{card.val}</p>
                  <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '13px' }}>{card.sub}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#002D5B' }}>All 25 Channels Ranked</h3>
              {sorted.map((ch,i) => (
                <div key={ch.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i<sorted.length-1?'1px solid #f3f4f6':'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#9ca3af', fontSize: '13px', width: '24px' }}>#{i+1}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#002D5B' }}>{ch.title||ch.subject}</p>
                      <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px' }}>{ch.name}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#002D5B' }}>{ch.subs.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#002D5B' }}>📈 Trend Charts</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>Historical trends need MTProto API. Subscriber counts are live now.</p>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#0369a1', fontWeight: 600 }}>📌 Current Live Snapshot</p>
              <p style={{ margin: '0 0 4px 0', color: '#0c4a6e', fontSize: '13px' }}>Total subscribers: <strong>{totalSubs.toLocaleString('en-IN')}</strong></p>
              <p style={{ margin: 0, color: '#0c4a6e', fontSize: '13px' }}>Fetched: {lastFetched} IST</p>
            </div>
          </div>
        )}

        {activeTab === 'competitive' && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#002D5B' }}>✖ Competitive Intel</h3>
            <div style={{ background: '#fef3c7', padding: '32px', borderRadius: '12px', border: '1px dashed #f59e0b', textAlign: 'center', marginTop: '16px' }}>
              <p style={{ margin: 0, color: '#92400e', fontWeight: 600 }}>⏳ Share competitor @usernames to unlock this section</p>
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#10b981,#059669)', padding: '32px', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>💡 Daily Ideas</h2>
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
