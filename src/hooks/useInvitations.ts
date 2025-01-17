/*
  UTTT
  Andrew Mainella
*/
import { collection, endAt, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { auth, db } from "@functions/firebase"
import { getFriends } from "@functions/UserFunctions"
import { loadingState } from "@types"
import { RootState } from "@redux/store"

/*
  TO DO
  Docs
  Pagination
  Fail
  Search
*/
export default function useInvitations(search: string, friends: boolean): {
  state: loadingState,
  users: invitationUserType[],
  onEnd: () => void
} {
  const [state, setState] = useState<loadingState>(loadingState.loading)
  const [users, setUsers] = useState<invitationUserType[]>([])
  const gameUsers = useSelector((state: RootState) => state.gameState.users)

  async function load() {
    let uid = auth.currentUser?.uid
    if (uid !== undefined) {
      let q = query(collection(db, "Users"))
      const friendsResult = await getFriends(uid)
      if (search !== "" && friends === true) {
        q = query(collection(db, "Users"), where("friends", "array-contains", uid), orderBy("username"), startAt(search), endAt(search+"\uf8ff"))
      } else if (search !== "") {
        q = query(collection(db, "Users"), orderBy("username"), startAt(search), endAt(search+"\uf8ff"))
      } else if (friends === true) {
        q = query(collection(db, "Users"), where("friends", "array-contains", uid), orderBy("username"), startAt(search), endAt(search+"\uf8ff"))
      }
      if (friendsResult !== undefined) {
        const unsub = onSnapshot(q, async (result) => {
          let usersFound: invitationUserType[] = []
          result.docs.forEach((doc) => {
            const data = doc.data()
            if (doc.id !== uid && gameUsers?.some((e) => {
              return e.userId !== uid
            }) === false) {
              usersFound.push({
                uid: doc.id,
                username: data.username,
                isFriend: friendsResult.friends.includes(doc.id)
              })
            }
          })
          setState(loadingState.success)
          setUsers(usersFound)
        });
        return () => {
          unsub()
        }
      }
    } else {
      setState(loadingState.failed)
    }
  }

  useEffect(() => {
    load()
  }, [search, gameUsers, friends])

  return {
    state,
    users,
    onEnd: () => {

    }
  }
}