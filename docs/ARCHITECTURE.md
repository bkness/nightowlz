# Architecture

## High Level

BarFly is split into:

- React Native Expo client (`client/`)
- Express + Mongo backend (`server/`)

## Client

### Entry

- `client/App.js` initializes gesture handler, safe area, theme provider, and navigation container.

### Navigation

- `client/navigation/StackNavigator.js`
- `client/navigation/TabNavigator.js`

Stack contains auth + tab shell + bar profile detail.
Tab navigator contains Discover, Events, MyBars, Profile.

### UI System

- Theme tokens in `client/theme/` (`colors`, `gradients`, `typography`, `surfaces`)
- Shared components in `client/components/common/`
- Layout pieces in `client/components/layout/`

### Motion

- Reanimated is used for:
  - Screen entry and ambient effects
  - Button/card press feedback
  - Swipe tab behavior wrapper

## Server

- `server/server.js` bootstraps Express API
- Routes in `server/routes/`
- Models in `server/models/`
- Jobs in `server/jobs/`

## Data and Auth (Current State)

- Auth screens exist on client and currently route users to tabs for dev flow.
- Server has user model and auth dependencies for future production auth hardening.
