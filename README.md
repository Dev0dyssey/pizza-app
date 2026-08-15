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
npm run dev
```

The development server is available at <http://localhost:3000>.

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
