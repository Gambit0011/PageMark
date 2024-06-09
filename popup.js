document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('saveLinkForm');
    
    // Get the current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      document.getElementById('link').value = currentTab.url;
    });
  
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      
      const link = document.getElementById('link').value;
      const comment = document.getElementById('comment').value;
  
      // Save the data
      chrome.storage.sync.set({ link, comment }, function() {
        console.log('Data saved');
        alert('Link and comment saved!');
      });
  
      // Send data to background script for saving to Excel
      chrome.runtime.sendMessage({ link, comment }, function(response) {
        console.log(response.status);
      });
    });
  });
  