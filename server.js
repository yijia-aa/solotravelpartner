const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Replace with your actual API key and external user ID
const apiKey = process.env.ONDEMAND_API_KEY;
const externalUserId = process.env.EXTERNAL_USER_ID;

// Create Chat Session
app.get('/create-session', async (req, res) => {
    const url = 'https://api.on-demand.io/chat/v1/sessions';
    const headers = {
        'apikey': apiKey,
        'Content-Type': 'application/json'
    };
    const body = {
        "pluginIds": [],
        "externalUserId": externalUserId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await response.json();
        const sessionId = data.data.id;
        res.json({ sessionId: sessionId });
    } catch (error) {
        console.error('Error creating chat session:', error);
        res.status(500).json({ error: 'Failed to create chat session' });
    }
});

// Submit Query
app.post('/submit-query/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    const { query, pluginIds } = req.body;

    const url = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
    const headers = {
        'apikey': apiKey,
        'Content-Type': 'application/json'
    };
    const body = {
        "endpointId": "predefined-openai-gpt4o",
        "query": query,
        "pluginIds": pluginIds,
        "responseMode": "sync"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await response.json();
        const answer = data.data.answer;
        res.json({ answer: answer });
    } catch (error) {
        console.error('Error submitting query:', error);
        res.status(500).json({ error: 'Failed to submit query' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
