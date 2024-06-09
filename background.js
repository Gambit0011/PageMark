chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const { link, comment } = request;
  
    // Here you would normally send the data to your backend server or API
    // For demonstration, we are logging it to the console
    console.log('Link:', link);
    console.log('Comment:', comment);
  
    // Replace the URL below with your API endpoint
    const apiUrl = 'http://localhost:3000/save';
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ link, comment }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      sendResponse({ status: 'Data saved successfully!' });
    })
    .catch((error) => {
      console.error('Error:', error);
      sendResponse({ status: 'Error saving data.' });
    });
  
    // Indicate that the response is sent asynchronously
    return true;
  });
  