/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@functions/firebase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

/**
 * This is the implimentation of @react-native-google-signin/google-signin.
 * A function to call the redirect to sign in with google
 */
export default async function signInWithGoogleiOS() {
  try {
    if (await GoogleSignin.hasPlayServices()){
      const userInfo = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(userInfo.data?.idToken);
      await signInWithCredential(auth, credential);
    }
  } catch (error) {
    console.log(error)
  }
}