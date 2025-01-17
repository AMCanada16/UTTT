/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { collection, getDoc, setDoc, updateDoc, where, query, getCountFromServer, doc, runTransaction  } from "firebase/firestore";
import { db } from "./firebase";
import { loadingState } from "@types";

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
 * A function to update a user online.
 * @param uid The uid of the user to update
 * @param isPublic The new isPublic Value of the user
 * @returns A boolean of wheater it succeded. Returns true if success.
 */
export async function updatePublic(uid: string, isPublic: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, "Users", uid), {
      isPublic: isPublic
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
 * @param isPublic If the users account is public
 * @returns A boolean of wheater it succeded. Returns true if success.
 */
export async function addUser(uid: string, username: string): Promise<boolean> {
  try {
    if (await checkIfUsernameValid(username) === loadingState.success) {
      await setDoc(doc(db, "Users", uid), {
        username,
        friends: [],
        requests: []
      })
      return true
    }
    return false
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

export async function getFriends(uid: string): Promise<{
  friends: string[],
  requests: string[]
} | undefined> {
  try {
    const result = await getDoc(doc(db, "Users", uid))
    if (result.exists()) {
      const data = result.data()
      return {
        friends: data.friends,
        requests: data.requests
      }
    } else {
      return undefined
    }
  } catch {
    return undefined
  }
}

/**
 * 
 * @param uid 
 * @param approveUid 
 * @returns 
 */
export async function approveFriendRequest(uid: string, approveUid: string) {
  try {
    // This needs to be a transaction so that both users exist and update their friends at the same time.
    await runTransaction(db, async (transaction) => {
      const usersRequestsResult = await transaction.get(doc(db, "Users", uid))
      if (usersRequestsResult.exists()) {
        let userRequests = [...usersRequestsResult.data().requests]
        userRequests = userRequests.filter((e) => {
          if (e !== approveUid) {
            return e
          }
        })
        let usersFriends = [...usersRequestsResult.data().friends]
        usersFriends.push(approveUid)

        const appoveUserResult = await transaction.get(doc(db, "Users", approveUid))
        if (appoveUserResult.exists()) {
          let approveUserFriends = [...appoveUserResult.data().friends]
          approveUserFriends.push(uid)

          await transaction.update(doc(db, "Users", uid), {
            friends: usersFriends,
            requests: userRequests
          })

          await transaction.update(doc(db, "Users", approveUid), {
            friends: approveUserFriends
          })
        }
      } else {
        return loadingState.failed
      }
    })
    return loadingState.success
  } catch (error) {
    return loadingState.failed
  }
}

export async function requestFriend(uid: string, requestUid: string): Promise<loadingState> {
  try {
    await runTransaction(db, async (transaction) => {
      const usersRequestsRequestsResult = await transaction.get(doc(db, "Users", requestUid))
      if (usersRequestsRequestsResult.exists()) {
        let userRequestRequests = [...usersRequestsRequestsResult.data().requests]
        userRequestRequests.push(uid)
        await transaction.update(doc(db, "Users", requestUid), {
          requests: userRequestRequests
        })
      } else {
        return loadingState.failed
      }
    })
    return loadingState.success
  } catch {
    return loadingState.failed
  }
}

export async function removeFriend(uid: string, removeUid: string) {
  try {
    await runTransaction(db, async (transaction) => {
      const usersRequestsResult = await transaction.get(doc(db, "Users", uid))
      if (usersRequestsResult.exists()) {
        let usersFriends = [...usersRequestsResult.data().friends]
        usersFriends = usersFriends.filter((e) => {
          if (e !== removeUid) {
            return e
          }
        })
        await transaction.update(doc(db, "Users", uid), {
          friends: usersFriends
        })
        const removeUserResult = await transaction.get(doc(db, "Users", removeUid))
        if (removeUserResult.exists()) {
          let removeUserFriends = [...removeUserResult.data().friends]
          removeUserFriends = removeUserFriends.filter((e) => {
            if (e !== uid) {
              return e
            }
          })
          await transaction.update(doc(db, "Users", removeUid), {
            friends:removeUserFriends
          })
        }
      }
    })
    return loadingState.success
  } catch {
    return loadingState.failed
  }
}