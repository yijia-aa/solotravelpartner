// Handle tab navigation
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('nav ul li a');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const selectedTab = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.id === selectedTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // Activate the first tab by default
    tabs[0].click();
});

// Initialize chat session when the page loads
window.onload = function() {
    fetch('/create-session')
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('sessionId', data.sessionId);
        })
        .catch(error => {
            console.error('Error creating chat session:', error);
        });
};

// Functions for Travel Plan features

// function getWeatherRecommendation() {
//     const location = document.getElementById('location-input').value;
//     if (!location) {
//         alert('Please enter your current location.');
//         return;
//     }

//     const query = `What is the current weather in ${location}, and what should I wear today?`;

//     submitQuery(query, ['plugin-1713924030']); // Weather plugin ID
// }


async function getWeatherRecommendation() {
    const apiKey = '6iTH4QKVAT4yjfbPAq1KnM3WgEoTNhA3';
    const externalUserId = '007';

    // Step 1: Create Chat Session
    const createSessionUrl = 'https://api.on-demand.io/chat/v1/sessions';
    const createSessionHeaders = {
        'apikey': apiKey,
        'Content-Type': 'application/json'
    };
    const createSessionBody = JSON.stringify({
        "pluginIds": [],
        "externalUserId": externalUserId
    });

    try {
        // Make the request to create a chat session
        const createSessionResponse = await fetch(createSessionUrl, {
            method: 'POST',
            headers: createSessionHeaders,
            body: createSessionBody
        });

        const createSessionData = await createSessionResponse.json();
        const sessionId = createSessionData.data.id;

        // Step 2: Submit Query
        const submitQueryUrl = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
        const submitQueryHeaders = {
            'apikey': apiKey,
            'Content-Type': 'application/json'
        };
        const submitQueryBody = JSON.stringify({
            "endpointId": "predefined-openai-gpt4o",
            "query": "What's the weather like?",
            "pluginIds": ["plugin-1712327325", "plugin-1713962163", "plugin-1723275191", "plugin-1713924030"],
            "responseMode": "sync"
        });

        // Make the request to submit a query
        const queryResponse = await fetch(submitQueryUrl, {
            method: 'POST',
            headers: submitQueryHeaders,
            body: submitQueryBody
        });

        const queryResponseData = await queryResponse.json();

        // Print the response from the query
        console.log(queryResponseData);
        return queryResponseData;

    } catch (error) {
        console.error('Error fetching weather recommendation:', error);
    }
}


function getTouristAttractions() {
    const location = document.getElementById('location-input').value;
    const travelStyle = document.querySelector('input[name="travel-style"]:checked').value;

    if (!location) {
        alert('Please enter your current location.');
        return;
    }

    const query = `I prefer a ${travelStyle} travel style. Recommend tourist attractions for me to visit in ${location}, mentioning any tickets needed.`;

    submitQuery(query, ['plugin-1723275191', 'plugin-1718945102']); // Google Maps and Trip Advisor plugin IDs
}

function getFoodCultureAdvice() {
    const location = document.getElementById('location-input').value;
    if (!location) {
        alert('Please enter your current location.');
        return;
    }

    const query = `Give me some advice on local food and culture in ${location}.`;

    submitQuery(query, ['plugin-1718945102']); // Trip Advisor plugin ID
}

// Functions for Urgent Needs features

function findNearestRestroom() {
    const query = `Find the closest restroom to my current location.`;

    submitQuery(query, ['plugin-1717340460']); // Restroom Agent plugin ID
}

function sendEmergencyMessage() {
    const username = document.getElementById('username').value;
    const contactNumber = document.getElementById('contact-number').value;

    if (!username || !contactNumber) {
        alert('Please enter your name and emergency contact number.');
        return;
    }

    const query = `Send the message "I AM ${username}. SOS HELP ME. I AM AT [CURRENT LOCATION]" via WhatsApp to ${contactNumber}.`;

    submitQuery(query, ['plugin-1726688608']); // WhatsApp Agent plugin ID
}

// Function for Live Company feature

function liveChat() {
    const userInput = document.getElementById('live-chat-input').value.trim();
    if (!userInput) return;

    const chatWindow = document.getElementById('chat-window');
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user');
    userMessage.textContent = `You: ${userInput}`;
    chatWindow.appendChild(userMessage);

    submitQuery(userInput, [], function(answer) {
        const assistantMessage = document.createElement('div');
        assistantMessage.classList.add('message', 'assistant');
        assistantMessage.textContent = `Assistant: ${answer}`;
        chatWindow.appendChild(assistantMessage);

        chatWindow.scrollTop = chatWindow.scrollHeight;
    });

    document.getElementById('live-chat-input').value = '';
}

// General function to submit queries

function submitQuery(query, pluginIds = [], callback) {
    const sessionId = sessionStorage.getItem('sessionId');
    const requestBody = {
        query: query,
        pluginIds: pluginIds
    };

    fetch(`/submit-query/${sessionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            const answer = data.answer;
            const activeTab = document.querySelector('.tab-content.active').id;

            if (activeTab === 'main-tab') {
                document.getElementById('travel-plan-results').innerHTML = `<p>${answer}</p>`;
            } else if (activeTab === 'urgent-tab') {
                document.getElementById('urgent-needs-results').innerHTML = `<p>${answer}</p>`;
            } else if (activeTab === 'live-company-tab' && callback) {
                callback(answer);
            }
        })
        .catch(error => {
            console.error('Error submitting query:', error);
        });
}

// Feedback submission

function submitFeedback() {
    const feedback = document.getElementById('feedback-input').value.trim();
    if (!feedback) {
        alert('Please enter your feedback.');
        return;
    }

    // Here you can implement the logic to send feedback to your server or email
    alert('Thank you for your feedback!');
    document.getElementById('feedback-input').value = '';
}
