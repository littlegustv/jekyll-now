chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'innerBounds': {
      'width': 720,
      'height': 480
    }
  });
});