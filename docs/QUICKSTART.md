# Quickstart

## Prereqs

- Node 20+
- Xcode (for iOS builds)
- MongoDB running locally or a valid remote URI

## Install

From project root:

```bash
cd client && npm install
cd ../server && npm install
```

## Run Server

```bash
cd server
npm run dev
```

## Run iOS App

In a second terminal:

```bash
cd client
npx expo run:ios
```

Alternative:

```bash
cd client
npm run start
```

## Common Dev Paths

- Mobile app: `client/`
- API server: `server/`
- Navigation flow: `client/navigation/`
- Theme tokens: `client/theme/`

## Important Notes

- If Expo errors on `toReversed` or similar runtime features, switch to Node 20.
- If top inset/notch spacing looks wrong, confirm `SafeAreaProvider` remains in `client/App.js`.
- Auth flow starts at HomeTabs in dev (`__DEV__`), and Login in production.
