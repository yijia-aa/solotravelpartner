
# Voyago - Travel Companion

**Voyago** is a web application designed to enhance the travel experience with convenient features, including a travel itinerary planner, weather forecasts, safety alerts, and a humorous chatbot. The app utilizes OnDemand agents such as the Tripadvisor and internet agents for travel planning and safety alerts, and a custom-developed joke agent to make interactions fun and engaging.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integrations](#api-integrations)
- [License](#license)

---

## Features

### 1. **Travel Itinerary**
   - Provides day-by-day recommendations based on the user’s location and travel style.
   - Styles supported: Culture Tourism, Outdoor Adventure, Leisure & Relaxation, Gastronomy Tour, and Nature & Wildlife.
   - Allows users to input additional requests or comments for a customized travel plan.

### 2. **Weather Forecast & Advice**
   - Delivers the latest weather forecast based on the user-provided location.
   - Offers clothing suggestions to match the current climate conditions.

### 3. **Safety Alert**
   - Notifies users about any current safety alerts or concerns in their specified location, helping them plan safer travels.

### 4. **Joke Chatbot**
   - A custom-built chatbot provides a light-hearted experience, sharing jokes from a knowledge base of over 1,000 clean jokes.
   - Users can interact with the chatbot by typing messages, to which it responds with a humorous tone, occasionally adding a new joke.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: OnDemand.io API (integrates several agents like Tripadvisor, internet agents, and a custom joke agent)
- **Libraries**: Google Fonts (Poppins)

---

## Setup and Installation

### Prerequisites
- A web server or local environment to serve the HTML file (e.g., `Live Server` extension in VSCode).
- API Key for OnDemand.io services.

### Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/voyago-travel-companion.git
   cd voyago-travel-companion
   ```

2. **Set up API Key**:
   - Replace the placeholder `apiKey` values in the JavaScript with your valid API key from OnDemand.io.

3. **Run the Application**:
   - Open the `index.html` file in a browser, or serve it through a local server:
     ```bash
     open index.html
     ```
   - Alternatively, right-click the file and choose “Open with Live Server” if using VSCode.

---

## Usage

1. **Navigate Between Tabs**:
   - The navigation bar at the top includes tabs for `Travel Plan`, `Weather Forecast & Advice`, `Safety Alert`, and `Chat Bot`.

2. **Travel Plan**:
   - Enter a location and select your preferred travel style.
   - Add any additional requests or comments and click “Get Recommendations” for a tailored itinerary.

3. **Weather Forecast & Advice**:
   - Enter a location and click “Get Weather” to view the latest weather information and clothing recommendations.

4. **Safety Alert**:
   - Enter a location and click “Get Safety Alert” to retrieve any recent safety information for that area.

5. **Joke Chatbot**:
   - Type a message and click “Send” to interact with the chatbot.
   - The chatbot can share a joke, adding a humorous element to the conversation.

---

## Project Structure

```plaintext
voyago-travel-companion/
├── index.html            # Main HTML file
├── styles.css            # Custom styles for the application
├── script.js             # JavaScript for handling API requests and interactions
└── README.md             # Documentation file
```

### Key Files
- **index.html**: Contains the main structure of the application, including all tabs and sections.
- **script.js**: Handles interactions, API requests, and responses for the travel plan, weather, safety alerts, and chatbot.
- **styles.css**: Includes the styling rules for different UI elements, such as tabs, input fields, and the chatbot.

---

## API Integrations

### OnDemand Agents

The application integrates various OnDemand agents for data retrieval:
- **Tripadvisor Agent**: Provides location-based travel recommendations and popular attractions.
- **Internet Agent**: Used for general web information, including weather forecasts and safety alerts.
- **Custom Joke Agent**: A knowledge-based system containing over 1,000 jokes, tailored for the chatbot to enhance user engagement.

### API Request Examples

- **Creating a Chat Session**:
  ```javascript
  async function createChatSession(apiKey, externalUserId) {
      const response = await fetch('https://api.on-demand.io/chat/v1/sessions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'apikey': apiKey
          },
          body: JSON.stringify({
              pluginIds: [],
              externalUserId: externalUserId
          })
      });
      const data = await response.json();
      return data.data.id; // Extract session ID
  }
  ```

- **Fetching Jokes for the Chatbot**:
  ```javascript
  async function getJokeResponse(userInput) {
      const apiKey = 'your-api-key';
      const query = userInput ? userInput : `Tell me a joke.`;

      try {
          const sessionId = await createChatSession(apiKey, 'user-id');
          const response = await submitQuery(apiKey, sessionId, query, ['plugin-1731248070']);
          const joke = response.data.answer || "Couldn't think of a joke right now.";
          displayMessage(joke, 'bot');
      } catch (error) {
          console.error("Error fetching joke:", error);
      }
  }
  ```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Voyago - Your Travel Companion** is a project aimed at providing users with a comprehensive and enjoyable travel planning experience. With an intelligent itinerary planner, real-time weather and safety alerts, and a humorous chatbot, Voyago ensures an all-in-one travel assistant right at your fingertips.
