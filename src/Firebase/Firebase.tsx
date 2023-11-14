// Import the functions you need from the SDKs you need
import {initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// import setupAppCheck from "./FirebaseAppCheck";
// import { firebase } from "@react-native-firebase/app-check";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

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
// setupAppCheck(app)

const auth = getAuth();
const db = getFirestore(app)

// async function check() {
//   try {
//     const { token } = await firebase.appCheck().getToken(true);
  
//     if (token.length > 0) {
//       console.log('AppCheck verification passed');
//     }
//   } catch (error) {
//     console.log('AppCheck verification failed');
//   }
// }
// check()

export { db, auth };