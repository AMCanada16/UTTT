/*
  UTTT
  Andrew Mainella
*/
import { Unsubscribe, collection, doc, endAt, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { getFriends } from "../functions/UserFunctions"
import { loadingState } from "../Types"

/*
  TO DO
  Docs
  Pagination
  Fail
*/
/**
 * 
 * @param search 
 * @param isFriends 
 * @returns 
 */
export default function useFriends(search: string, isFriends: boolean, page: number) {
  const [friends, setFriends] = useState<friendType[]>([])
  const [friendsCount, setFriendsCount] = useState<number>(0)
  const [friendsState, setFriendsState] = useState<loadingState>(loadingState.loading)
  const [currentFriendsState, setCurrentFriendsState] = useState<loadingState>(loadingState.notStarted)
  const [currentFriends, setCurrentFriends] = useState<string[]>([])
  const [currentRequests, setCurrentRequests] = useState<string[]>([])

  useEffect(() => {
    let snap: undefined | Unsubscribe = undefined
    const unlisten = auth.onAuthStateChanged(
      async authUser => {
        if (authUser !== null) {
          snap = onSnapshot(doc(db, "Users", authUser.uid), (doc) => {
            if (doc.exists()){
              setCurrentFriends(doc.data().friends)
              setFriendsCount(doc.data().friends.length)
              setCurrentRequests(doc.data().requests)
              setCurrentFriendsState(loadingState.success)
            } else {
              setCurrentFriendsState(loadingState.failed)
            }
          });
        } else {
          setCurrentFriendsState(loadingState.failed)
        }
      },
    );
    return () => {
      unlisten();
      if (snap !== undefined) {
        snap()
      }
    }
  }, [])
  

  useEffect(() => {
    let uid = auth.currentUser?.uid
    if (uid !== undefined && currentFriendsState === loadingState.success) {
      let q = query(collection(db, "Users"), orderBy("username"))
      if (isFriends && search !== "") {
        if (currentFriends.length === 0) {
          setFriends([])
        } else {
          q = query(collection(db, "Users"),  where("friends", 'array-contains', uid), orderBy("username"), startAt(search), endAt(search+"\uf8ff"))
        }
      } else if (isFriends) {
        if (currentFriends.length === 0) {
          setFriends([])
        } else {
          q = query(collection(db, "Users"), where("friends", 'array-contains', uid), orderBy("username"))
        }
      } else if (search !== "") {
        q = query(collection(db, "Users"), orderBy("username"), startAt(search), endAt(search+"\uf8ff"))
      }
      const unsub = onSnapshot(q, async (result) => {
        if (uid !== undefined) {
          let usersFound: friendType[] = []
          result.docs.forEach((doc) => {
            const data = doc.data()
            if (doc.id !== uid) {
              usersFound.push({
                uid: doc.id,
                isFriend: currentFriends.includes(doc.id),
                username: data.username,
                isRequested: data.requests.includes(uid),
                isRequesting: currentRequests.includes(doc.id)
              })
            }
          })
          setFriends(usersFound)
        }
      });
      return () => {
        unsub()
      }
    }
  }, [search, isFriends, currentFriends, currentFriendsState])

  return {
    friends,
    friendsCount,
    friendsState
  }
}