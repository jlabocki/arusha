const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 8080;

app.use(bodyParser.json());

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit-text', async (req, res) => {
  try {
    const messages = req.body.messages;

    // Get the content of the last message
    const text = messages[messages.length - 1].content;

    // Log the text data for debugging
    console.log('Text submitted:', text);

    // Make an API call with the submitted text
    const response = await fetch('http://localhost:61642/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text }),
      redirect: 'follow'
    });
    const data = await response.json();

    if (response.choices && response.choices.length > 0 && response.choices[0].message) {
        // Log the message object for debugging
        console.dir(response.choices[0].message, { depth: null });
      } else {
        console.log('No message found in the API response');
      }

    res.send(data);
  } catch (error) {
    console.error('Error processing text:', error);
    res.status(500).send('Error processing text');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
