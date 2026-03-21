export const maxDuration = 30;

export async function GET() {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  const usernames = [
    { username: 'testbook_ugcnet', label: 'UGC NET Common' },
    { username: 'pritipaper1', label: 'Paper 1 - Priti' },
    { username: 'tulikamam', label: 'Paper 1 - Tulika' },
    { username: 'Anshikamaamtestbook', label: 'Paper 1 - Anshika' },
    { username: 'testbookrajatsir', label: 'Paper 1 - Rajat Sir' },
    { username: 'pradyumansir_testbook', label: 'Political Science' },
    { username: 'AshwaniSir_Testbook', label: 'History' },
    { username: 'kiranmaamtestbook', label: 'Public Administration' },
    { username: 'Manojsonker_Testbook', label: 'Sociology' },
    { username: 'Heenamaam_testbook', label: 'Education' },
    { username: 'AditiMaam_Testbook', label: 'Home Science' },
    { username: 'karanSir_Testbook', label: 'Law' },
    { username: 'testbookdakshita', label: 'English' },
    { username: 'AshishSir_Testbook', label: 'Geography' },
    { username: 'ShachiMaam_Testbook', label: 'Economics' },
    { username: 'Monikamaamtestbook', label: 'Management' },
    { username: 'yogitamaamtestbook', label: 'Management' },
    { username: 'EVS_AnshikamaamTestbook', label: 'Environmental Science' },
    { username: 'daminimaam_testbook', label: 'Library Science' },
    { username: 'TestbookShahna', label: 'Computer Science' },
    { username: 'Prakashsirtestbook', label: 'Sanskrit' },
    { username: 'kesharisir_testbook', label: 'Hindi' },
    { username: 'TestbookNiharikaMaam', label: 'Commerce' },
    { username: 'MrinaliniMaam_Testbook', label: 'Psychology' },
    { username: 'testbook_gauravsir', label: 'Physical Education' },
  ];

  const staticSubs = [40914,21161,15125,11932,3897,28967,13400,6204,5496,4887,4212,3418,2976,1424,1376,1249,1201,1085,908,847,763,752,696,623,112];

  let channels = [];
  let isLive = false;

  if (BOT_TOKEN) {
    const results = await Promise.allSettled(
      usernames.map(async (ch, i) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/getChatMemberCount?chat_id=@${ch.username}`,
            { signal: controller.signal }
          );
          clearTimeout(timeout);
          const data = await res.json();
          return {
            username: ch.username, label: ch.label, title: ch.label,
            description: '', subscribers: data.ok ? data.result : staticSubs[i], live: data.ok,
          };
        } catch {
          return { username: ch.username, label: ch.label, title: ch.label, description: '', subscribers: staticSubs[i], live: false };
        }
      })
    );
    channels = results.map((r, i) =>
      r.status === 'fulfilled' ? r.value
      : { username: usernames[i].username, label: usernames[i].label, title: usernames[i].label, description: '', subscribers: staticSubs[i], live: false }
    );
    isLive = channels.some(c => c.live);
  } else {
    channels = usernames.map((ch, i) => ({
      username: ch.username, label: ch.label, title: ch.label, description: '', subscribers: staticSubs[i], live: false,
    }));
  }

  const totalSubscribers = channels.reduce((sum, c) => sum + c.subscribers, 0);

  return Response.json({
    success: true, totalSubscribers, channels,
    fetchedAt: new Date().toISOString(), isLive,
  });
}
