/*
  UTTT
  Andrew Mainella
  8 May 2024
  auth.ts
*/
import { signInAnonymously as signInAnonymouslyFirebase, signOut as signOutFirebase, deleteUser as deleteUserFirebase } from "firebase/auth";
import { ref, remove } from "firebase/database";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, database, db } from "@functions/firebase";

/**
 * 
 * @returns A boolean of the sucess
 */
export async function signInAnonymously() {
  try {
    await signInAnonymouslyFirebase(auth)
    return true
  } catch {
    return false
  }
}

export async function signOut(): Promise<boolean> {
  try {
    await signOutFirebase(auth)
    return true
  } catch (error) {
    return false
  }
}


export async function deleteUser(): Promise<boolean> {
  try {
    const user = auth.currentUser
    if (user !== null) {
      await deleteDoc(doc(db, "Users", user.uid))
      await remove(ref(database, `/status/${user.uid}`))
      await deleteUserFirebase(user)
      return true
    }
    return false
  } catch (e) {
    return false
  }
}