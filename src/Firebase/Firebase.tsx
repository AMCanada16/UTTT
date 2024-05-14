import {initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database";

const firebaseConfig = {
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

const auth = getAuth();
const db = getFirestore(app)
const database = getDatabase();

export { db, auth, database };