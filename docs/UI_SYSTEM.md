# UI System

## Theme Tokens

Primary source: `client/theme/`

- `colors.js`
- `gradients.js`
- `typography.js`
- `surfaces.js`

Use tokens instead of hardcoded values when possible.

## Shared Components

- `NeonScreen`: base gradient screen + ambient effects
- `NeonButton`: neon CTA with press feedback
- `ScreenTitleBlock`: title/subtitle + top safe-area rhythm
- `NightOwlzLogo` and `NightOwlzIcon`: branding system

## Safe Area Rules

- App root must include `SafeAreaProvider`.
- Top title/header spacing is safe-area aware.
- Avoid negative top margins near notch/dynamic island.

## Motion Rules

- Prefer transform/opacity animation over layout animation.
- Keep motion subtle and consistent with ambient cycle.
- Avoid stacking multiple competing screen transitions.

## Logo Placement Rules

- Discover: primary brand presence
- Profile: icon inside avatar area
- Bar profile: subtle accent only
- Tab icon: compact icon-only mark
