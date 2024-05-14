import { useEffect, useState } from "react";
import { auth, db } from "../Firebase/Firebase";
import { getUsername } from "../Functions/UserFunctions";
import { loadingState } from "../Types";
import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";

export default function useUsernameExists() {
  const [exists, setExists] = useState<loadingState>(loadingState.loading);

  useEffect(() =>{
    let snap: undefined | Unsubscribe = undefined
    const unlisten = auth.onAuthStateChanged(
      async authUser => {
        if (authUser !== null) {
          const usernameResult = await getUsername(authUser.uid)
          if (usernameResult !== undefined) {
            setExists(loadingState.success)
          } else {
            snap = onSnapshot(doc(db, "Users", authUser.uid), (doc) => {
              if (doc.exists()){
                setExists(loadingState.success)
              } else {
                setExists(loadingState.failed)
              }
            });
            setExists(loadingState.failed)
          }
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
  return exists
}