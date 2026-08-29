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
and replace each Firebase placeholder with the values from **Firebase Console →
Project settings → General → Your apps → Web app → Config**. Vite reads
environment variables at startup, so restart the development server after
changing the configuration.

To work locally without Firebase, set `VITE_DEMO_MODE=true` in `.env.local`.
Demo mode bypasses authentication and uses in-memory sample entries, comments,
ratings, and uploads. It is available only through the Vite development server;
production builds always require Firebase.

### Firestore group rules

My Groups needs a Cloud Firestore default database and the version-controlled
rules in `firestore.rules`. After signing in to the project-local Firebase CLI,
deploy only those rules with:

```sh
npm run firebase:login
npm run firestore:deploy -- --project <your-project-id>
```

Use the value of `VITE_FIREBASE_PROJECT_ID` from `.env.local` for
`<your-project-id>`. This deploys the rules and the membership collection-group
index. The rules deliberately permit only authenticated users to create a group
together with their own owner membership and to read their own memberships.

Use `npm run firestore:emulator` to test the rules locally. The Firestore
emulator requires a Java runtime; deployment does not.

Run the automated rules contract with:

```sh
npm run test:firestore-rules
```

It uses the emulator and a `demo-*` project, so it never accesses the deployed
Firebase project.

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
