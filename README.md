# Express Firebase Auth Middleware
[![npm version](https://badge.fury.io/js/express-firebase-auth.svg)](https://badge.fury.io/js/express-firebase-auth)

Authenticate your endpoints with Firebase auth.

## Features:

- Authenticate the user using Firebase before running the function.
- Ability to skip authentication on public API endpoints.


## Installing / Getting started

```shell
yarn add express-firebase-auth
```

In your app:

```javascript
// Get this credentials file from the Firebase console.
import serviceAccount from '../firebase-config.json';
// Import the package
import { createFirebaseAuth } from 'express-firebase-auth';

// Initialize the firebase auth
const firebaseAuth = createFirebaseAuth({
  serviceAccount,
  ignoredUrls: [
    '/ignore'
  ]
});
app.use(firebaseAuth);
```

| Option           | Value                                                                                                                     |
| -------------    |:-------------------------------------------------------------------------------------------------------------------------:|
| `serviceAccount` | ([**Note1**](#note1)) [Obtain this from firebase](https://firebase.google.com/docs/admin/setup#initialize_the_sdk)        |
| `firebase`       | ([**Note1**](#note1)) An initialized firebase app. [Refer Firebase setup](https://firebase.google.com/docs/admin/setup)   |
| `ignoredUrls`    | (*Optional*) An array of URLs where you need to skip the authentication.                                                  |

#### Note1
You **must** provide either the `serviceAccount` credentials or an already initialized `firebase` app.
If you are planning to use other services of Firebase in your app, you should initialize your own app.
If you only want the authentication part, you can simply pass the `serviceAccount` credentials and `express-firebase-auth` will initialize the app for you.
You cannot initialize two firebase apps.

This package adds the `user` object returned by firebase to `res.locals.user`. You can use that inside your functions.

## Developing

### Prerequisites
- NodeJS: [https://nodejs.org/en/](https://nodejs.org/en/)
- Yarn: [https://yarnpkg.com/en/](https://yarnpkg.com/en/)
- ESLint in your editor.


### Setting up Dev

Clone the repo and run `yarn install`. Make sure you have an editor with an `eslint` plugin active. **Never** start working without `eslint`.


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).

## Style guide

Always follow the AirBnb Style Guide.

## License

[MIT licensed](./LICENSE).