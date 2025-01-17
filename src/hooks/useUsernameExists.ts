import { useEffect, useState } from "react";
import { auth, db } from "@functions/firebase";
import { loadingState } from "@types";
import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";

/**
 * 
 * @returns Thig function checks the the username does exist.
 */
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
          setExists(loadingState.loading)
          snap = onSnapshot(doc(db, "Users", authUser.uid), (doc) => {
            if (doc.exists()){
              setUsername(doc.data().username)
              setExists(loadingState.success)
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