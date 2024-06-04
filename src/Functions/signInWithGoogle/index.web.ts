import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../firebase";

/**
 * A function to call the redirect to sign in with google
 */
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  } catch (error) {

  }
}