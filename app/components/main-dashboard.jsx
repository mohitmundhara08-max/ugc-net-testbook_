'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const allChannels = [
  { subject: 'Common', username: '@testbook_ugcnet', subs: 40637, posts: 12, viewRate: 8.5, avgViews: 3.4 },
  { subject: 'Paper 1', username: '@pritipaper1', teacher: 'Priti', subs: 21161, posts: 11, viewRate: 8.9, avgViews: 1.9 },
  { subject: 'Paper 1', username: '@tulikamam', teacher: 'Tulika', subs: 15125, posts: 8, viewRate: 7.1, avgViews: 1.1 },
  { subject: 'Paper 1', username: '@Anshikamaamtestbook', teacher: 'Anshika', subs: 11932, posts: 10, viewRate: 8.3, avgViews: 1.0 },
  { subject: 'Paper 1', username: '@testbookrajatsir', teacher: 'Rajat Sir', subs: 3897, posts: 7, viewRate: 6.8, avgViews: 0.3 },
  { subject: 'Political Science', username: '@pradyumansir_testbook', subs: 28967, posts: 9, viewRate: 7.2, avgViews: 2.1 },
  { subject: 'History', username: '@AshwaniSir_Testbook', subs: 13400, posts: 9, viewRate: 7.5, avgViews: 1.0 },
  { subject: 'Public Administration', username: '@kiranmaamtestbook', subs: 6204, posts: 6, viewRate: 6.2, avgViews: 0.4 },
  { subject: 'Sociology', username: '@Manojsonker_Testbook', subs: 5496, posts: 7, viewRate: 6.8, avgViews: 0.4 },
  { subject: 'Education', username: '@Heenamaam_testbook', subs: 4887, posts: 8, viewRate: 7.1, avgViews: 0.3 },
  { subject: 'Home Science', username: '@AditiMaam_Testbook', subs: 4212, posts: 6, viewRate: 5.9, avgViews: 0.3 },
  { subject: 'Law', username: '@karanSir_Testbook', subs: 3418, posts: 5, viewRate: 5.2, avgViews: 0.2 },
  { subject: 'English', username: '@testbookdakshita', subs: 2976, posts: 6, viewRate: 5.8, avgViews: 0.2 },
  { subject: 'Geography', username: '@AshishSir_Testbook', subs: 1424, posts: 4, viewRate: 4.5, avgViews: 0.1 },
  { subject: 'Economics', username: '@ShachiMaam_Testbook', subs: 1376, posts: 5, viewRate: 4.8, avgViews: 0.1 },
  { subject: 'Management', username: '@Monikamaamtestbook', subs: 1249, posts: 3, viewRate: 3.9, avgViews: 0.1 },
  { subject: 'Management', username: '@yogitamaamtestbook', subs: 1201, posts: 4, viewRate: 4.2, avgViews: 0.1 },
  { subject: 'Environmental Science', username: '@EVS_AnshikamaamTestbook', subs: 1085, posts: 3, viewRate: 3.5, avgViews: 0.1 },
  { subject: 'Library Science', username: '@daminimaam_testbook', subs: 908, posts: 2, viewRate: 2.8, avgViews: 0.05 },
  { subject: 'Computer Science', username: '@TestbookShahna', subs: 847, posts: 5, viewRate: 4.6, avgViews: 0.04 },
  { subject: 'Sanskrit', username: '@Prakashsirtestbook', subs: 763, posts: 3, viewRate: 3.1, avgViews: 0.03 },
  { subject: 'Hindi', username: '@kesharisir_testbook', subs: 752, posts: 4, viewRate: 3.8, avgViews: 0.03 },
  { subject: 'Commerce', username: '@TestbookNiharikaMaam', subs: 696, posts: 2, viewRate: 2.5, avgViews: 0.02 },
  { subject: 'Psychology', username: '@MrinaliniMaam_Testbook', subs: 623, posts: 3, viewRate: 3.2, avgViews: 0.02 },
  { subject: 'Physical Education', username: '@testbook_gauravsir', subs: 112, posts: 1, viewRate: 1.5, avgViews: 0.01 },
];

const mockChartData = [
  { date: 'Mar 13', subscribers: 215000, viewRate: 6.2 },
  { date: 'Mar 14', subscribers: 217500, viewRate: 6.8 },
  { date: 'Mar 15', subscribers: 220100, viewRate: 7.1 },
  { date: 'Mar 16', subscribers: 223400, viewRate: 7.5 },
  { date: 'Mar 17', subscribers: 226800, viewRate: 7.9 },
  { date: 'Mar 18', subscribers: 229200, viewRate: 7.3 },
  { date: 'Mar 19', subscribers: 232400, viewRate: 7.8 },
];

function getLastSevenDates() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  }
  return dates;
}

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState('channel-analytics');
  const [selectedSubject, setSelectedSubject] = useState('Common');
  const [selectedDate, setSelectedDate] = useState('');
  const [expandedChannel, setExpandedChannel] = useState(null);

  const lastSevenDates = getLastSevenDates();

  useEffect(() => {
    if (!selectedDate && lastSevenDates.length > 0) {
      setSelectedDate(lastSevenDates[lastSevenDates.length - 1]);
    }
  }, []);

  const uniqueSubjects = Array.from(new Set(allChannels.map(ch => ch.subject)));
  const totalSubs = allChannels.reduce((sum, ch) => sum + ch.subs, 0);
  const totalPosts = allChannels.reduce((sum, ch) => sum + ch.posts, 0);
  const avgViewRate = (allChannels.reduce((sum, ch) => sum + ch.viewRate, 0) / allChannels.length).toFixed(1);

  const channelsBySubject = allChannels.filter(ch => ch.subject === selectedSubject);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 py-6 px-4 text-center text-white">
        <h1 className="text-3xl font-bold">UGC NET Telegram Intelligence Hub</h1>
        <p className="mt-2 text-blue-100">Real-time insights into all 25 UGC NET Testbook channels</p>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-center gap-8 px-4 py-0 flex-wrap max-w-7xl mx-auto">
          {[
            { id: 'channel-analytics', label: '📊 Channel Analytics' },
            { id: 'daily-digest', label: '📋 Daily Digest' },
            { id: 'trend-charts', label: '📈 Trend Charts' },
            { id: 'competitive', label: '✖ Competitive Intel' },
            { id: 'ideas', label: '💡 Ideas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium transition-colors text-sm md:text-base ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white px-4 py-4 flex justify-center gap-3 flex-wrap border-b border-gray-100">
        {lastSevenDates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`px-4 py-2 rounded-full font-medium transition-colors text-sm ${
              selectedDate === date
                ? 'bg-blue-600 text-white'
                : 'border-2 border-gray-300 text-gray-700 hover:border-blue-400'
            }`}
          >
            {date}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'channel-analytics' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <p className="text-2xl font-bold text-gray-900">{(totalSubs / 1000).toFixed(0)}K</p>
                <p className="text-gray-600 text-sm mt-1">Total Subscribers</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <p className="text-2xl font-bold text-gray-900">{avgViewRate}%</p>
                <p className="text-gray-600 text-sm mt-1">Avg View Rate</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-amber-500">
                <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
                <p className="text-gray-600 text-sm mt-1">Total Posts (Last 7 Days)</p>
              </div>
            </div>

            {/* Subject Buttons - Sliding */}
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
              {uniqueSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors text-sm whitespace-nowrap flex-shrink-0 ${
                    selectedSubject === subject
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {/* Channels */}
            <div className="space-y-4">
              {channelsBySubject.map((channel) => (
                <div key={channel.username} className="bg-white rounded-lg shadow overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedChannel(expandedChannel === channel.username ? null : channel.username)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {channel.subject}
                          {channel.teacher && ` - ${channel.teacher}`}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{channel.username}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">Own</span>
                    </div>

                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Subscribers</p>
                        <p className="font-bold text-gray-900">{(channel.subs / 1000).toFixed(1)}K</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Posts</p>
                        <p className="font-bold text-gray-900">{channel.posts}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">View Rate</p>
                        <p className="font-bold text-gray-900">{channel.viewRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Views</p>
                        <p className="font-bold text-gray-900">{channel.avgViews}K</p>
                      </div>
                    </div>

                    <button className="text-blue-600 font-medium text-sm mt-3 hover:text-blue-800">
                      tap to expand {expandedChannel === channel.username ? '▼' : '▶'}
                    </button>
                  </div>

                  {expandedChannel === channel.username && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <a
                        href={`https://t.me/${channel.username.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium hover:text-blue-800"
                      >
                        Open on Telegram →
                      </a>
                      <div className="mt-4">
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={mockChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="subscribers" stroke="#2563eb" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Competitors */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🔴 Competitors</h3>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-700 font-medium">Waiting for competitor handles...</p>
                <p className="text-gray-500 text-sm mt-2">Share competitor Telegram handles to populate this section</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'daily-digest' && (
          <div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 text-white mb-6">
              <h2 className="text-2xl font-bold">Daily Digest</h2>
              <p className="text-purple-100 mt-1">{selectedDate}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <h4 className="font-bold text-gray-900 mb-3">📈 Network Reach</h4>
                <p className="text-sm text-gray-700">Total: {totalSubs.toLocaleString()} | 25 channels | {avgViewRate}% avg</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <h4 className="font-bold text-gray-900 mb-3">📊 Top Channel</h4>
                <p className="text-sm text-gray-700">Common (@testbook_ugcnet) - 40.6K subscribers</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-amber-500">
                <h4 className="font-bold text-gray-900 mb-3">📝 Activity</h4>
                <p className="text-sm text-gray-700">{totalPosts} total posts | {avgViewRate}% avg rate</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trend-charts' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📈 7-Day Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="subscribers" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">View Rate Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="viewRate" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'competitive' && (
          <div>
            <div className="bg-blue-100 p-8 rounded-lg text-center border-l-4 border-blue-600">
              <p className="text-blue-900 font-bold text-lg">📊 Competitive Intel</p>
              <p className="text-blue-700 mt-2">Waiting for competitor handles...</p>
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div>
            <div className="bg-green-100 p-8 rounded-lg text-center border-l-4 border-green-600 mb-6">
              <p className="text-green-900 font-bold text-lg">💡 Ideas & Insights</p>
              <p className="text-green-700 mt-2">Strategic recommendations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <h4 className="font-bold text-gray-900 mb-2">🔵 Core Strength</h4>
                <p className="text-sm text-gray-700">Common and Paper 1 show highest engagement (8-9%)</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <h4 className="font-bold text-gray-900 mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm text-gray-700">Subject channels have growth potential</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-amber-500">
                <h4 className="font-bold text-gray-900 mb-2">💡 Content Strategy</h4>
                <p className="text-sm text-gray-700">Leverage Paper 1 formats across channels</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12 py-8 px-4 text-center">
        <p className="text-gray-600 text-sm">Generated {new Date().toLocaleDateString()}</p>
        <p className="text-gray-500 text-xs mt-2">UGC NET Telegram Intelligence Hub</p>
      </div>
    </div>
  );
}
