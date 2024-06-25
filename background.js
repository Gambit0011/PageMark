  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { link, comment, filename } = request;

  const apiUrl = 'http://localhost:3000/save';

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ link, comment, filename }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      sendResponse({ status: 'Data saved successfully!' });
    } else {
      throw new Error(data.message || 'Unknown error');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    sendResponse({ status: 'Error saving data.', message: error.message });
  });

  return true; // Indicate that the response is sent asynchronously
});
