chrome.alarms.create('mainLoop', { periodInMinutes: 1 / 60 }); // 每秒检查一次

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'mainLoop') {
    const { isPaused, nextTime } = await chrome.storage.local.get(['isPaused', 'nextTime']);
    if (!isPaused && Date.now() >= nextTime) {
      chrome.tabs.query({ url: "*://*.qzone.qq.com/*" }, (tabs) => {
        tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { action: 'refresh' }));
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'notify') {
    chrome.notifications.create({
      title: message.title,
      message: message.body,
      type: 'basic',
      iconUrl: 'assets/icon128.png'
    });
  }
});
