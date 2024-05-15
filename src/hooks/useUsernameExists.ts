import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { getUsername } from "../functions/UserFunctions";
import { loadingState } from "../Types";
import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";

export default function useUsername(): {
  exists: loadingState;
  username: string;
} {
  const [exists, setExists] = useState<loadingState>(loadingState.loading);
  const [username, setUsername] = useState<string>("")

  useEffect(() =>{
    let snap: undefined | Unsubscribe = undefined
    const unlisten = auth.onAuthStateChanged(
      async authUser => {
        if (authUser !== null) {
          snap = onSnapshot(doc(db, "Users", authUser.uid), (doc) => {
            if (doc.exists()){
              setExists(loadingState.success)
              setUsername(doc.data().username)
            } else {
              setExists(loadingState.failed)
            }
          });
        } else {
          setExists(loadingState.failed)
        }
      },
    );
    return () => {
      unlisten();
      if (snap !== undefined) {
        snap()
      }
    }
  }, []);
  return {
    exists,
    username
  }
}