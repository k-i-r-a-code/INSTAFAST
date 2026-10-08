(function() {
  'use strict';
  let defaultSpeed = 1.0;
  chrome.storage.sync.get(['playbackSpeed'], function(result) {
    defaultSpeed = result.playbackSpeed || 1.0;
    console.log('InstaSpeed: Default speed set to', defaultSpeed);
    applySpeedToExistingVideos();
  });
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.playbackSpeed) {
      defaultSpeed = changes.playbackSpeed.newValue;
      console.log('InstaSpeed: Speed changed to', defaultSpeed);
      applySpeedToExistingVideos();
    }
  });
  function applySpeedToExistingVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video.playbackRate !== defaultSpeed) {
        video.playbackRate = defaultSpeed;
        console.log('InstaSpeed: Applied speed', defaultSpeed, 'to existing video');
      }
    });
  }
    const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeName === 'VIDEO') {
          setVideoSpeed(node);
        } else if (node.querySelectorAll) {
          const videos = node.querySelectorAll('video');
          videos.forEach(setVideoSpeed);
        }
      });
    });
  });
  function setVideoSpeed(video) {
    video.playbackRate = defaultSpeed;
    console.log('InstaSpeed: Set new video speed to', defaultSpeed);
    video.addEventListener('play', function() {
      if (video.playbackRate !== defaultSpeed) {
        video.playbackRate = defaultSpeed;
        console.log('InstaSpeed: Restored speed on play event');
      }
    });
    video.addEventListener('ratechange', function() {
      if (video.playbackRate !== defaultSpeed) {
        setTimeout(() => {
          if (video.playbackRate !== defaultSpeed) {
            video.playbackRate = defaultSpeed;
            console.log('InstaSpeed: Corrected playback rate');
          }
        }, 100);
      }
    });
  }
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  applySpeedToExistingVideos();
  console.log('InstaSpeed: Content script loaded and monitoring');
})();
