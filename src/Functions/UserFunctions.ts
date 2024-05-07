import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

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

export async function updateUsername(uid: string, username: string) {
  try {
    await updateDoc(doc(db, "Users", uid), {
      username: username
    })
    return true
  } catch {
    return false
  }
}

export async function addUser(uid: string, username: string) {
  try {
    await setDoc(doc(db, "Users", uid), {
      username: username
    })
    return true
  } catch {
    return false
  }
}