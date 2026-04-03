# BarFly - Find Your Night

BarFly is a nightlife discovery platform that helps users find bars, breweries, and events happening around them. It aggregates events from Facebook, Google, and Eventbrite, then notifies users when their saved bars post new events.

## Tech Stack

### Mobile App (client)

- React Native (Expo)
- React Navigation
- Firebase (Auth + Push Notifications)
- Axios

### Backend (server)

- Node.js + Express
- MongoDB + Mongoose
- Facebook Graph API
- Google Places API
- Eventbrite API
- Node Cron (event sync jobs)

## Project Structure

```text
BarFly/
├── client/                # React Native app
│   ├── App.js
│   ├── app.config.js
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── splash.png
│   ├── components/
│   ├── navigation/
│   ├── screens/
│   ├── theme/
│   └── utils/
├── server/                # Node backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── jobs/
│   └── server.js
└── README.md
```

## Installation

1. Clone the repo

```bash
git clone https://github.com/YOURNAME/barfly.git
cd barfly
```

2. Install client dependencies

```bash
cd client
npm install
```

3. Install server dependencies

```bash
cd ../server
npm install
```

4. Start MongoDB (macOS)

```bash
brew services start mongodb-community
```

5. Run the backend

```bash
npm run dev
```

6. Run the mobile app

```bash
cd ../client
expo start
```

## Environment Variables

Create a `.env` file in `server`:

```env
MONGO_URI=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
GOOGLE_API_KEY=
EVENTBRITE_TOKEN=
FIREBASE_SERVER_KEY=
```

Create a `.env` file in `client`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

## Event Sync Jobs

Event sync scripts run automatically using Node Cron to:

- Pull Facebook events
- Pull Google events
- Pull Eventbrite events
- Update MongoDB
- Trigger push notifications for saved bars

## Features

- Bar locator (map + list)
- Bar profiles
- Event aggregation
- Save bars to My Bars
- Push notifications
- Search + filters
- Modern neon nightlife UI

## Development Commands

### Root (server + client)

```bash
cd BarFly
npm start
```

### Client

```bash
cd client
expo start
```

### Server

```bash
cd server
npm run dev
```

## License

Private - All rights reserved.

## Internal Docs

- `docs/QUICKSTART.md`
- `docs/ARCHITECTURE.md`
- `docs/AUTH_FLOW.md`
- `docs/UI_SYSTEM.md`
- `docs/TROUBLESHOOTING.md`
