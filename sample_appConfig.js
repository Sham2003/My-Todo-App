// appConfig.js

// Use your values here
// change the file name to "appConfig.js"
// for import check firebaseConfig.js
const appConfig = {
    // Firebase Config
    firebase: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-firebase-api-key",
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
      appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-app-id",
    },
  
    // Apollo GraphQL Config
    graphql: {
      uri: process.env.REACT_APP_GRAPHQL_URI || "your-graphql-endpoint",
    },
  
    // Authentication
    googleAuth: {
        clientId: 'your firebase client id',
        webClientId: 'your firebase web client id'
    },
  };
  
export default appConfig;
  