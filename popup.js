let isMonitoring = false;

function updatePopup() {
  chrome.storage.local.get(['connectivityLossCount', 'startTime', 'isMonitoring'], (result) => {
    let startTime = result.startTime || Date.now();
    let currentTime = Date.now();
    let elapsedTime = Math.floor((currentTime - startTime) / 1000); // in seconds

    document.getElementById('lossCount').textContent = result.connectivityLossCount || 0;
    document.getElementById('elapsedTime').textContent = formatElapsedTime(elapsedTime);

    isMonitoring = result.isMonitoring || false;
    document.getElementById('startStopButton').textContent = isMonitoring ? 'Stop Monitoring' : 'Start Monitoring';
  });
}

function formatElapsedTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
}

function toggleMonitoring() {
  isMonitoring = !isMonitoring;
  if (isMonitoring) {
    chrome.storage.local.set({ startTime: Date.now(), connectivityLossCount: 0 }); // Reset count to 0
    chrome.alarms.create('checkConnectivity', { periodInMinutes: 0.5 }); // 30 seconds
  } else {
    chrome.alarms.clear('checkConnectivity');
  }
  chrome.storage.local.set({ isMonitoring });
  updatePopup();
}

document.addEventListener('DOMContentLoaded', () => {
  updatePopup();
  let startStopButton = document.getElementById('startStopButton');
  if (startStopButton) {
    startStopButton.addEventListener('click', toggleMonitoring);
  } else {
    console.error('startStopButton element not found.');
  }
});
