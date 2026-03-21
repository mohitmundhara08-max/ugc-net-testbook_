const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Your 25 Telegram channels
const CHANNELS = [
  { username: 'testbook_ugcnet', label: 'UGC NET Common', group: 'Core' },
  { username: 'pradyumansir_testbook', label: 'Political Science - Pradyuman Sir', group: 'Core' },
  { username: 'pritipaper1', label: 'Paper 1 - Priti Maam', group: 'Core' },
  { username: 'tulikamam', label: 'Paper 1 - Tulika Maam', group: 'Core' },
  { username: 'Anshikamaamtestbook', label: 'Anshika Maam', group: 'Core' },
  { username: 'testbookrajatsir', label: 'Rajat Sir', group: 'Core' },
  { username: 'AshwaniSir_Testbook', label: 'History - Ashwani Sir', group: 'Core' },
  { username: 'kiranmaamtestbook', label: 'Kiran Maam', group: 'Core' },
  { username: 'Manojsonker_Testbook', label: 'Manoj Sonker Sir', group: 'Core' },
  { username: 'Heenamaam_testbook', label: 'Heena Maam', group: 'Core' },
  { username: 'AditiMaam_Testbook', label: 'Aditi Maam', group: 'Core' },
  { username: 'karanSir_Testbook', label: 'Karan Sir', group: 'Core' },
  { username: 'testbookdakshita', label: 'Dakshita Maam', group: 'Core' },
  { username: 'AshishSir_Testbook', label: 'Ashish Sir', group: 'Core' },
  { username: 'ShachiMaam_Testbook', label: 'Shachi Maam', group: 'Core' },
  { username: 'Monikamaamtestbook', label: 'Monika Maam', group: 'Core' },
  { username: 'yogitamaamtestbook', label: 'Yogita Maam', group: 'Core' },
  { username: 'EVS_AnshikamaamTestbook', label: 'EVS - Anshika Maam', group: 'Core' },
  { username: 'daminimaam_testbook', label: 'Damini Maam', group: 'Core' },
  { username: 'TestbookShahna', label: 'Computer Science - Shahna', group: 'Core' },
  { username: 'Prakashsirtestbook', label: 'Prakash Sir', group: 'Core' },
  { username: 'kesharisir_testbook', label: 'Keshari Sir', group: 'Core' },
  { username: 'TestbookNiharikaMaam', label: 'Niharika Maam', group: 'Core' },
  { username: 'MrinaliniMaam_Testbook', label: 'Mrinalini Maam', group: 'Core' },
  { username: 'testbook_gauravsir', label: 'Gaurav Sir', group: 'Core' },
];

// Helper: fetch from Telegram Bot API
function telegramRequest(method, params) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const query = new URLSearchParams(params).toString();
  const url = `https://api.telegram.org/bot${token}/${method}?${query}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// API endpoint: GET /api/channels
app.get('/api/channels', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const results = await Promise.allSettled(
      CHANNELS.map(async (ch) => {
        try {
          const [chatInfo, memberCount] = await Promise.all([
            telegramRequest('getChat', { chat_id: `@${ch.username}` }),
            telegramRequest('getChatMemberCount', { chat_id: `@${ch.username}` })
          ]);

          return {
            username: ch.username,
            label: ch.label,
            group: ch.group,
            title: chatInfo.result?.title || ch.label,
            subscribers: memberCount.result || 0,
            description: chatInfo.result?.description || '',
            error: null
          };
        } catch (err) {
          return {
            username: ch.username,
            label: ch.label,
            group: ch.group,
            title: ch.label,
            subscribers: 0,
            description: '',
            error: err.message
          };
        }
      })
    );

    const channels = results.map(r => r.value || r.reason);
    const totalSubscribers = channels.reduce((sum, ch) => sum + (ch.subscribers || 0), 0);

    res.json({
      success: true,
      fetchedAt: new Date().toISOString(),
      totalSubscribers,
      channels
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
