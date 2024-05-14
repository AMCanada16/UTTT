/*
  UTTT
  Andrew Mainella
*/
import { collection, doc, endAt, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../Firebase/Firebase"
import { getFriends } from "../Functions/UserFunctions"

/*
  TO DO
  Docs
  Pagination
  Fail
  Search
*/
export default function useFriends(search: string) {
  const [friends, setFriends] = useState<friendType[]>([])

  useEffect(() => {
    let uid = auth.currentUser?.uid
    if (uid !== undefined) {
      let q = query(collection(db, "Users"), orderBy("username"))
      if (search !== "") {
        q = query(collection(db, "Users"), orderBy("username"), startAt(search), endAt(search+"\uf8ff"))
      }
      const unsub = onSnapshot(q, async (result) => {
        if (uid !== undefined) {
          const friendsResult = await getFriends(uid)
          if (friendsResult !== undefined) {
            let usersFound: friendType[] = []
            result.docs.forEach((doc) => {
              const data = doc.data()
              if (doc.id !== uid) {
                usersFound.push({
                  uid: doc.id,
                  isFriend: friendsResult.friends.includes(doc.id),
                  username: data.username,
                  isRequested: data.requests.includes(uid),
                  isRequesting: friendsResult.requests.includes(doc.id)
                })
              }
            })
            setFriends(usersFound)
          }
        }
      });
      return () => {
        unsub()
      }
    }
  }, [search])

  return friends
}