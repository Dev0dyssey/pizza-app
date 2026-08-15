# Pizza Rate

Pizza Rate is a React and Firebase app for saving, rating, and discussing pizzas
and other meals. It runs on the web through Vite and can be packaged for iOS and
Android with Capacitor.

## Requirements

- Node.js 22 or newer
- npm 11 or newer
- Xcode 26+ and CocoaPods for iOS builds
- Android Studio Otter (2025.2.1)+ and JDK 21 for Android builds

## Development

```sh
npm install
npm run setup
npm run dev
```

The development server is available at <http://localhost:3000>.

Before starting the app for the first time, copy `.env.example` to `.env.local`
and replace the placeholder with the `apiKey` from **Firebase Console → Project
settings → General → Your apps → Web app → Config**. Vite reads environment
variables at startup, so restart the development server after changing the key.

To work locally without Firebase, set `VITE_DEMO_MODE=true` in `.env.local`.
Demo mode bypasses authentication and uses in-memory sample entries, comments,
ratings, and uploads. It is available only through the Vite development server;
production builds always require Firebase.

## Quality checks

```sh
npm run check
```

This runs ESLint, strict TypeScript checking, Vitest, and a production build.

## Native apps

Build the web app before synchronising native projects:

```sh
npm run build
npx cap sync
```
