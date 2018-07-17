const createFirebaseAuth = ({
  ignoredUrls,
  serviceAccount,
  firebase,
  checkEmailVerified = false,
  checkEmailVerifiedIgnoredUrls
}) => {
  if (!serviceAccount && !firebase) {
    /* eslint-disable no-console */
    console.log(
      '*********************************************************************************'
    );
    console.log(
      'Please provide the Firebase serviceAccount object or an initialized firebase app!'
    );
    console.log(
      '*********************************************************************************'
    );
    /* eslint-enable no-console */
  }

  // If the user has passed an initialized firebase app, use that
  // or initialize one using the serviceAccount object.
  const firebaseAdmin = firebase || require.main.require('firebase-admin');
  if (!firebase) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_DATABASE_NAME}.firebaseio.com`
    });
  }

  return (req, res, next) => {
    if (ignoredUrls && ignoredUrls.includes(req.path)) {
      next(); // If the url is in `ignoredUrls`, skip the authorization.
    } else {
      const authorizationHeader = req.header('Authorization');

      // Send an error if the authorization header is missing
      if (!authorizationHeader) {
        res.status(401);
        return res.send({ error: 'Missing authorization header!' });
      }

      const idToken = authorizationHeader.split(' ').pop();

      // Authenticate user
      firebaseAdmin
        .auth()
        .verifyIdToken(idToken)
        .then(user => {
          // If checkEmailVerified is true, deny the request if the user's email is not verified
          // Skip if the url is in checkEmailVerifiedIgnoredUrls
          if (
            checkEmailVerified &&
            (checkEmailVerifiedIgnoredUrls &&
              !checkEmailVerifiedIgnoredUrls.includes(req.originalUrl)) &&
            !user.email_verified
          ) {
            res.status(401);
            return res.send({ error: 'You are not authorized!' });
          }

          res.locals.user = user; // Set the user object to locals
          return next();
        })
        .catch(error => {
          res.status(401);
          res.send({ error: 'You are not authorized!' });

          next(error);
        });
    }
  };
};

module.exports = {
  createFirebaseAuth
};
