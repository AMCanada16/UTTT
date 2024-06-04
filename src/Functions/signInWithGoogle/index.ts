import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebase";

/**
 * A function to call the redirect to sign in with google
 */
export async function signInWithGoogle() {
  try {
    if (await GoogleSignin.hasPlayServices()){
      const userInfo = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(userInfo.idToken)
      await signInWithCredential(auth, credential);
    }
  } catch (error) {

  }
}