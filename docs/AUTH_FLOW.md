# Auth Flow

## Routes

Defined in stack navigator:

- `Login`
- `SignUp`
- `HomeTabs`
- `BarProfile`

## Initial Route Behavior

In `client/navigation/StackNavigator.js`:

- Dev: `HomeTabs`
- Prod: `Login`

Pattern:

```js
const INITIAL_ROUTE = __DEV__ ? "HomeTabs" : "Login";
```

## Login Screen

- File: `client/screens/Auth/LoginScreen.js`
- Inputs: identifier, password
- Dev convenience: optional button to continue to app

## Signup Screen

- File: `client/screens/Auth/SignupScreen.js`
- Inputs: username, email, password
- Navigation should target existing route names (`Login`, `HomeTabs`)

## Known Gotchas

- JSX comments inside component props will break compile.
- Use route names exactly as declared in stack (`Login`, `SignUp`, etc.).
- Keep `SafeAreaProvider` active so auth screens render below notch/camera.
