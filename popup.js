  document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('saveLinkForm');
  const changeFileButton = document.getElementById('changeFileButton');

  // Get the current tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    document.getElementById('link').value = currentTab.url;
  });

  // Load the stored filename or use a default
  chrome.storage.sync.get(['filename'], function(result) {
    if (!result.filename) {
      chrome.storage.sync.set({ filename: 'links.xlsx' });
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const link = document.getElementById('link').value;
    const comment = document.getElementById('comment').value;

    // Retrieve the filename from storage
    chrome.storage.sync.get(['filename'], function(result) {
      const filename = result.filename;

      // Send data to background script for saving to Excel
      chrome.runtime.sendMessage({ link, comment, filename }, function(response) {
        if (response.status === 'Data saved successfully!') {
          alert('Link and comment saved!');
        } else {
          alert(`Error: ${response.message}`);
        }
      });
    });
  });

  changeFileButton.addEventListener('click', function () {
    const newFilename = prompt('Enter new filename (with .xlsx extension):', 'links.xlsx');
    if (newFilename) {
      chrome.storage.sync.set({ filename: newFilename }, function() {
        alert('Filename changed to ' + newFilename);
      });
    }
  });
});
