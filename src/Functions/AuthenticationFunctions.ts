import { GoogleAuthProvider, signInWithRedirect, signInAnonymously as signInAnonymouslyFirebase, OAuthProvider, signOut as signOutFirebase } from "firebase/auth";
import { auth, db } from "../Firebase/Firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteUser as deleteUserFirebase } from "firebase/auth";

export async function signInWithApple() {
  const provider = new OAuthProvider('apple.com');
  signInWithRedirect(auth, provider);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
}

export async function signInAnonymously() {
  try {
    await signInAnonymouslyFirebase(auth)
  } catch {

  }
}

export async function signOut(): Promise<boolean> {
  try {
    await signOutFirebase(auth)
    console.log(auth, "HERE")
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function deleteUser(): Promise<boolean> {
  try {
    const user = auth.currentUser
    if (user !== null) {
      await deleteDoc(doc(db, "Users", user.uid))
      await deleteUserFirebase(user)
      return true
    }
    return false
  } catch {
    return false
  }
}