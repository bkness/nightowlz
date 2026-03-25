# 🍺 BarFly — Find Your Night

BarFly is a nightlife discovery platform that helps users find bars, breweries, and events happening around them. It aggregates events from Facebook, Google, and Eventbrite, and sends notifications when a user’s saved bars post new events.

---

## 🚀 Tech Stack

### Mobile App (client/)

- React Native (Expo)
- React Navigation
- Firebase (Auth + Push Notifications)
- Axios for API calls

### Backend (server/)

- Node.js + Express
- MongoDB + Mongoose
- Facebook Graph API
- Google Places API
- Eventbrite API
- Node Cron (event sync jobs)

---

## 📁 Project Structure

barfly/
├── client/ # React Native app
├── server/ # Node backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── jobs/ # Event sync scripts
│ └── server.js
├── .env
├── .env.example
└── README.md

---

## 🔧 Installation

### 1. Clone the repo

git clone https://github.com/YOURNAME/barfly.git
cd barfly

### 2. Install client dependencies

cd client
npm install

### 4. Start MongoDB (macOS)

brew services start mongodb-community

### 5. Run the backend

npm run dev

### 6. Run the mobile app

cd ../client
expo start

---

## 🔐 Environment Variables

Create a `.env` file in `/server`:

MONGO_URI=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
GOOGLE_API_KEY=
EVENTBRITE_TOKEN=
FIREBASE_SERVER_KEY=

Create a `.env` file in `/client`:

EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

---

## 🕒 Event Sync Jobs

Event sync scripts run automatically using Node Cron:

- Pull Facebook events
- Pull Google events
- Pull Eventbrite events
- Update MongoDB
- Trigger push notifications for saved bars

---

## 📱 Features

- Bar locator (map + list)
- Bar profiles
- Event aggregation
- Save bars to “My Bars”
- Push notifications
- Search + filters
- Modern neon nightlife UI

---

## 🛠️ Development Commands

### Client

expo start

### Server

npm run dev

---

## 📄 License

Private — All rights reserved.
