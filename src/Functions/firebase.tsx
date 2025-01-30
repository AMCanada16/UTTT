import { initializeApp, getApp, getApps, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth, Auth } from "firebase/auth"
import { getDatabase } from "firebase/database";
import { Platform } from "react-native";
import getExpoSecureStorePersistence from "@functions/getExpoSecureStorePersistance";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let auth: Auth;
if (getApps.length === 0) {
  app = initializeApp(firebaseConfig);
  if (Platform.OS !== "web") {
    auth = initializeAuth(app, {
      persistence: getExpoSecureStorePersistence(),
    });
  } else {
    auth = getAuth(app);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

const db = getFirestore(app);
const database = getDatabase();

export { db, auth, database };