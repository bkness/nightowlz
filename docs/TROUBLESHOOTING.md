# Troubleshooting

## Expo / Node Issues

### Error: `toReversed is not a function`

Cause: older Node runtime.
Fix: switch to Node 20+.

## Auth Screens Missing

Check:

1. Files exist in `client/screens/Auth/`.
2. Imports in `client/navigation/StackNavigator.js` are correct.
3. Route names match navigation calls.

## Profile Tab Fails to Load

Check:

1. `client/screens/Profile/ProfileScreen.js` exists.
2. `client/navigation/TabNavigator.js` imports Profile screen correctly.
3. File path and case match exactly.

## Notch / Camera Overlap

Check:

1. `SafeAreaProvider` wraps app in `client/App.js`.
2. `ScreenTitleBlock` and header spacing use safe-area offsets.
3. No negative top margins on title containers.

## JSX Compile Errors in Auth Files

Common cause: invalid comment syntax inside JSX props.
Bad:

```jsx
<NeonButton disabled={!canSubmit /* comment */} />
```

Good:

```jsx
{
  /* comment */
}
<NeonButton disabled={!canSubmit} />;
```

## Quick Recovery Checklist

1. Run `npm install` in `client` and `server`.
2. Run server: `cd server && npm run dev`.
3. Run app: `cd client && npx expo run:ios`.
4. If stale build behavior persists, rebuild iOS app.
