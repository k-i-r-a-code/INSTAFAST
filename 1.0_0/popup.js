document.addEventListener('DOMContentLoaded', function() {
  const speedOptions = document.querySelectorAll('.speed-option');
  const radioButtons = document.querySelectorAll('input[name="speed"]');
  const statusDiv = document.getElementById('status');
  const permissionButton = document.getElementById('requestPermission');
chrome.permissions.contains({
    origins: ['https://www.instagram.com/*']
  }, function(result) {
    if (result) {
      permissionButton.textContent = '✓ Instagram Access Granted';
      permissionButton.classList.add('granted');
      permissionButton.disabled = true;
    }
  });
  permissionButton.addEventListener('click', function() {
    chrome.permissions.request({
      origins: ['https://www.instagram.com/*']
    }, function(granted) {
      if (granted) {
        permissionButton.textContent = '✓ Instagram Access Granted';
        permissionButton.classList.add('granted');
        permissionButton.disabled = true;
        
        // Show status message
        statusDiv.textContent = 'Permission granted! ✓';
        statusDiv.classList.add('show');
        setTimeout(() => {
          statusDiv.classList.remove('show');
        }, 2000);
      }
    });
  });
  chrome.storage.sync.get(['playbackSpeed'], function(result) {
    const savedSpeed = result.playbackSpeed || 1.0;
    radioButtons.forEach(radio => {
      if (parseFloat(radio.value) === savedSpeed) {
        radio.checked = true;
        radio.closest('.speed-option').classList.add('active');
      }
    });
  });
  speedOptions.forEach(option => {
    option.addEventListener('click', function() {
      const speed = parseFloat(this.dataset.speed);
      const radio = this.querySelector('input[type="radio"]');
      radio.checked = true;
      speedOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      chrome.storage.sync.set({ playbackSpeed: speed }, function() {
        console.log('Speed saved:', speed);
        statusDiv.classList.add('show');
        setTimeout(() => {
          statusDiv.classList.remove('show');
        }, 2000);
      });
    });
  });
  radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const speed = parseFloat(this.value);
        speedOptions.forEach(opt => opt.classList.remove('active'));
        this.closest('.speed-option').classList.add('active');
        chrome.storage.sync.set({ playbackSpeed: speed }, function() {
          console.log('Speed saved:', speed);
          statusDiv.classList.add('show');
          setTimeout(() => {
            statusDiv.classList.remove('show');
          }, 2000);
        });
      }
    });
  });
});