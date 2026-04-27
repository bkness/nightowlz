# Night Owlz — Find Your Night

A React Native nightlife discovery app for finding bars, clubs, and live music near you. Search any city, save your favorites, and explore from your phone.

> Built as a solo full-stack mobile project — React Native + Expo on the frontend, Node/Express + MongoDB on the backend, Apple Maps powering real-time venue discovery.

---

## Features

- **City search** — find bars and venues anywhere via Apple Maps with OpenStreetMap fallback
- **Category filters** — toggle between Bars, Clubs, Live Music, and Entertainment
- **Bar profiles** — opening hours, address, phone, website, and an in-app map view
- **Save to My Bars** — heart any bar to your personal collection (JWT-authenticated)
- **My Bars** — your saved shortlist with one-tap remove
- **Profile** — live saved bar count pulled from your account
- **Settings modal** — frosted glass overlay with theme toggle
- **Smooth animations** — press feedback, spring physics, and neon glow effects throughout
- **Role-based auth** — user and owner accounts with separate flows

---

## Tech Stack

### Mobile (`client`)

| | |
|---|---|
| Framework | React Native 0.83 · Expo ~55 |
| Navigation | React Navigation 7 (bottom tabs + native stack) |
| Animations | React Native Reanimated 4 |
| Maps | react-native-maps |
| UI | Expo Linear Gradient · Expo Blur · custom neon design system |
| Fonts | Pacifico · Lobster (via Expo Google Fonts) |
| HTTP | Axios |

### Backend (`server`)

| | |
|---|---|
| Runtime | Node.js · Express |
| Database | MongoDB · Mongoose |
| Auth | JWT (7-day tokens) · bcrypt |
| Maps API | Apple MapKit JS — venue search + enrichment |
| Fallback | OpenStreetMap Overpass API |
| Deploy | Render |

---

## Project Structure

```
nightowlz/
├── client/
│   ├── components/
│   │   ├── bars/          # BarCard
│   │   ├── common/        # NeonButton, NeonScreen, SlidingPanel, etc.
│   │   └── layout/        # Header
│   ├── navigation/        # Tab navigator + stack config
│   ├── screens/
│   │   ├── Auth/          # Login · Signup
│   │   ├── BarProfile/    # Venue detail, map, save/remove
│   │   ├── Discover/      # Search + category filters
│   │   ├── Events/        # Coming soon
│   │   ├── MyBars/        # Saved collection
│   │   ├── Profile/       # User stats + settings
│   │   └── Settings/      # Modal overlay
│   ├── theme/             # Colors, typography, surfaces, gradients
│   └── utils/             # Axios instance
└── server/
    ├── models/            # User · SavedBar · Bar
    ├── routes/api/        # auth · saved-bars · maps · bars
    └── middleware/        # JWT auth
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)
- MongoDB Atlas account
- Apple Developer account (for MapKit JS token)

### Install

```bash
git clone https://github.com/bkness/nightowlz.git
cd nightowlz
npm install          # installs workspace root deps
cd client && npm install
cd ../server && npm install
```

### Environment — `server/.env`

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nightowlz
JWT_SECRET=your-32-byte-hex-secret
PORT=3001
APPLE_MAPS_TEAM_ID=your-team-id
APPLE_MAPS_KEY_ID=your-key-id
APPLE_MAPS_PRIVATE_KEY_PATH=./config/AuthKey_KEYID.p8
```

### Run

```bash
# From repo root
npm run server    # starts Express on :3001
npm run client    # starts Expo
```

---

## Live

Server: [https://nightowlz.onrender.com](https://nightowlz.onrender.com)  
Mobile client: TestFlight build in progress.

## Screenshots

> Coming soon — TestFlight build in progress.

---

## Roadmap

- [ ] Events tab — real-time event listings per venue
- [ ] Owner dashboard — bar owners promote events directly
- [ ] Push notifications — alerts when saved bars post events
- [ ] Discovery modal cards — animated sheet instead of stack push
- [ ] App Store release

---

## License

Private — All rights reserved © bkness

## Contact

Brandon Kelly — [GitHub](https://github.com/bkness) · kbrandon863@gmail.com
