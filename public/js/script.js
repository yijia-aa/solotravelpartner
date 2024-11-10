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

function getWeatherRecommendation() {
    const location = document.getElementById('location-input').value;
    if (!location) {
        alert('Please enter your current location.');
        return;
    }

    const query = `What is the current weather in ${location}, and what should I wear today?`;

    submitQuery(query, ['plugin-1711895182']); // Replace with actual Weather Agent plugin ID
}

function getTouristAttractions() {
    const location = document.getElementById('location-input').value;
    const travelStyle = document.querySelector('input[name="travel-style"]:checked').value;

    if (!location) {
        alert('Please enter your current location.');
        return;
    }

    const query = `I prefer a ${travelStyle} travel style. Recommend tourist attractions for me to visit in ${location}, mentioning any tickets needed.`;

    submitQuery(query, ['plugin-1717434994', 'plugin-1717419365']); // Replace with actual Google Maps and Trip Advisor plugin IDs
}

function getFoodCultureAdvice() {
    const location = document.getElementById('location-input').value;
    if (!location) {
        alert('Please enter your current location.');
        return;
    }

    const query = `Give me some advice on local food and culture in ${location}.`;

    submitQuery(query, ['plugin-1717419365']); // Replace with actual Trip Advisor plugin ID
}

// Functions for Urgent Needs features

function findNearestRestroom() {
    const query = `Find the closest restroom to my current location.`;

    submitQuery(query, ['plugin-1723468702']); // Replace with actual Restroom Agent plugin ID
}

function sendEmergencyMessage() {
    const username = document.getElementById('username').value;
    const contactNumber = document.getElementById('contact-number').value;

    if (!username || !contactNumber) {
        alert('Please enter your name and emergency contact number.');
        return;
    }

    const query = `Send the message "I AM ${username}. SOS HELP ME. I AM AT [CURRENT LOCATION]" via WhatsApp to ${contactNumber}.`;

    submitQuery(query, ['plugin-1717340460']); // Replace with actual WhatsApp Agent plugin ID
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
