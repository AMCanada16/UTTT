/*
  UTTT
  Andrew Mainella
*/
import { collection, doc, getDoc, setDoc, updateDoc, where, query, getCountFromServer } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { loadingState } from "../Types";

/**
 * Gets the username of a users provided the uid.
 * @param uid The uid of the user to get
 * @returns Returns a string if found and returns undefined if not found.
 */
export async function getUsername(uid: string): Promise<string | undefined> {
  try {
    const result = await getDoc(doc(db, "Users", uid))
    if (result.exists()) {
      const data = result.data()
      return data.username
    } else {
      return undefined
    }
  } catch {
    return undefined
  }
}

/**
 * A function to update a user online.
 * @param uid The uid of the user to update
 * @param username The new username of the user
 * @returns A boolean of wheater it succeded. Returns true if success.
 */
export async function updateUsername(uid: string, username: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, "Users", uid), {
      username: username
    })
    return true
  } catch {
    return false
  }
}

/**
 * A function to add a user online.
 * @param uid The uid of user to add
 * @param username The username of the user to add
 * @returns A boolean of wheater it succeded. Returns true if success.
 */
export async function addUser(uid: string, username: string): Promise<boolean> {
  try {
    await setDoc(doc(db, "Users", uid), {
      username: username
    })
    return true
  } catch {
    return false
  }
}

/**
 * Check if the username exits from some other user.
 * @param username The username to check
 * @returns Returns a loadingState if it exists.
 */
export async function checkIfUsernameValid(username: string): Promise<loadingState> {
  try {
    const q = query(collection(db, "Users"), where("username", "==", username));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count === 0) {
      return loadingState.success
    } else {
      return loadingState.exists
    }
  } catch {
    return loadingState.failed
  }
}