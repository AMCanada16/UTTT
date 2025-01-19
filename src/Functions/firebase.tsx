import { initializeApp, getApp, getApps, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from "firebase/auth"
import { getDatabase } from "firebase/database";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyCCAWNKF8eHsynUew6iUSbj1RVW4IjTk8Q",
    authDomain: "archimedes4-games.firebaseapp.com",
    projectId: "archimedes4-games",
    storageBucket: "archimedes4-games.appspot.com",
    messagingSenderId: "94813812988",
    appId: "1:94813812988:web:971222502862df28e6ff79",
    measurementId: "G-LP1K0RXN7R"  
};

// Initialize Firebase
let app;
if (getApps.length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp()
}

let auth: Auth;

if (Platform.OS !== "web") {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  auth = getAuth(app);
}
const db = getFirestore(app)
const database = getDatabase();

export { db, auth, database };