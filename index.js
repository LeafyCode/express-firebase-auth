const firebase = require.main.require('firebase-admin');

const createFirebaseAuth = ({ ignoredUrls, serviceAccount }) => {
  if (!serviceAccount) {
    /* eslint-disable no-console */
    console.log('***************************************************************');
    console.log('Please provide the Firebase serviceAccount object!');
    console.log('***************************************************************');
    /* eslint-enable no-console */
  }

  // Initialize firebase
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_DATABASE_NAME}.firebaseio.com`
  });

  return (req, res, next) => {
    if (ignoredUrls && ignoredUrls.includes(req.originalUrl)) {
      next(); // If the url is in `ignoredUrls`, skip the autherization.
    } else {
      const authorizationHeader = req.header('Authorization');

      // Send an error if the autherization header is missing
      if (!authorizationHeader) {
        res.status(401);
        return res.send({ error: 'Missing autherization header!' });
      }

      const idToken = authorizationHeader.split(' ').pop();

      // Authenticate user
      firebase
        .auth()
        .verifyIdToken(idToken)
        .then((user) => {
          res.locals.user = user; // Set the user object to locals
          next();
        })
        .catch((error) => {
          res.status(401);
          res.send({ error: 'You are not autherized!' });

          next(error);
        });
    }
  };
};

module.exports = {
  createFirebaseAuth
};
