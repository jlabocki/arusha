const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const {join} = require("node:path");

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'public')));

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
      body: JSON.stringify({ messages }),
      redirect: 'follow'
    });
    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      // Log the message object for debugging
      console.dir(data.choices[0].message, { depth: null });
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
