# **To-Do App - React Native**  

A feature-rich **To-Do App** built with **React Native** that combines task management with user authentication and a referral system. The project leverages **GraphQL backend (Hasura)**, **Apollo Client**, **Firebase Authentication**, **Expo**. 

This app is divided into three key stages:
1. **Core Functionality:** Create, update, and delete tasks with real-time sync.
2. **User Authentication & Permissions:** Secure sign-in with Firebase.
3. **Referral System:** Track user referrals and manage referral counts.

---

## **Features**
- **Task Management:** Add, update, and delete tasks.
- **User Authentication:** Google Sign-In with Firebase.
- **GraphQL Backend:** Real-time task synchronization using Hasura.
- **Persistent Storage:** Managed with Apollo Client.
- **Referral Tracking:** Referral counts increment or decrement based on user actions.
- **Mobile-Friendly UI:** Built using Expo for seamless interaction on mobile devices.

---

## **Technologies Used**
- **React Native** for the frontend interface.
- **Firebase** for authentication.
- **Apollo Client** for GraphQL state management.
- **Hasura** for managing backend and database.
- **Expo** for building and running the React Native app.
---

## **Project Setup**

### **1. Firebase Setup**
1. **Create a Firebase Project:**  
   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable Google Sign-In under **Authentication → Sign-in Method**.

2. **Add Android/iOS App to Firebase:**  
   - Download the `google-services.json` file (for Android) or `GoogleService-Info.plist` (for iOS).
   - Place the `google-services.json` file in the root of your project under `/android/app`.

---

### **2. Hasura Setup**
1. **Create a Hasura Account and Project:**  
   - Visit the [Hasura Console](https://hasura.io/) and create an account.  
   - Create a new project and connect it to a PostgreSQL database.

2. **Integrate Database and Execute SQL Scripts:**  
   - Create the required tables (`app_users`, `todos`) and set up triggers and functions.  
   - Use the SQL script found in `db_creation.sql` to automate this process:
     - Add triggers to manage **referral counts**.
     - Functions for generating referral codes and managing incremental/decremental logic.

---

### **3. Clone the Repository**
```bash
git clone https://github.com/Sham2003/My-Todo-App.git
cd My-Todo-App
```

### **4. Update Configurations**

Update `appConfig.js` with Firebase and Hasura details:

1. Add your Firebase project credentials (from `google-services.json`).
2. Update the Hasura GraphQL endpoint in `appConfig.js`.

```javascript
const appConfig = {
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    // Other Firebase fields...
  },
  graphql: {
    uri: "https://your-hasura-project.hasura.app/v1/graphql",
  },
};

export default appConfig;
```

### **5. Install Dependencies and Run the App**
Run the following commands in your terminal:

```bash
npm install
npx expo start
```

### **6. Optional: Build the App (Android/iOS)**
If you want to build the app for a production environment:
1. Build for Android:
```bash
npx expo build:android
```
2. Build for iOS:
```bash
npx expo build:ios
```

### **7. Conclusion**
This To-Do App demonstrates the integration of multiple technologies to create a seamless user experience with real-time data sync, authentication, and referral tracking. It’s an excellent template for projects requiring task management with user engagement features.
