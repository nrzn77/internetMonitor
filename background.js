let connectivityLossCount = 0;
let startTime = Date.now();


chrome.storage.local.get(['connectivityLossCount', 'startTime', 'isMonitoring'], (result) => {
  if (result.connectivityLossCount === undefined) {
    chrome.storage.local.set({ connectivityLossCount: 0 });
  } else {
    connectivityLossCount = result.connectivityLossCount;
  }

  if (result.startTime === undefined) {
    chrome.storage.local.set({ startTime });
  } else {
    startTime = result.startTime;
  }

  if (result.isMonitoring === undefined) {
    chrome.storage.local.set({ isMonitoring: false });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkConnectivity') {
    console.log('Checking connectivity...');
    checkConnectivity();
  }
});


function checkConnectivity() {
    fetch('https://icanhazip.com', { method: 'GET' })
      .then(response => response.text())
      .then(() => {
        console.log('Internet is connected');
      })
      .catch(() => {
        console.log('Internet is disconnected');
        connectivityLossCount++;
        chrome.storage.local.set({ connectivityLossCount });
      });
  }
