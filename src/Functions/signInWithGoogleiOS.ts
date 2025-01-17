/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";

/**
 * A function to call the redirect to sign in with google
 */
export default async function signInWithGoogleiOS() {
  try {
    if (await GoogleSignin.hasPlayServices()){
      const userInfo = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(userInfo.idToken)
      await signInWithCredential(auth, credential);
    }
  } catch (error) {
    console.log(error)
  }
}