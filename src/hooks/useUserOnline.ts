import { useEffect, useMemo, useState } from "react";
import { database } from "../firebase";
import { onValue, ref } from "firebase/database";
import useIsAuth from "./useIsAuth";


/**
 * This function subsribiute to see if the user is online.
 * @see useShareStatus to upload the uers online state to the server.
 * @param id The uid of the user to check if they are online
 * @returns 
 */
export default function useUserOnline(id: string) {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const {isAuth, isLoading} = useIsAuth()
  const authenticated = useMemo(() => {
    if (isLoading === false && isAuth === true) {
      return true
    }
    return false
  }, [isAuth, isLoading])

  useEffect(() => {
    if (!authenticated) {
      return
    }
    const starCountRef = ref(database, 'status/' + id);
    const unsub = onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setIsOnline(data.online)
      }
    });
    return () => {
      unsub()
    }
  }, [authenticated])
  return isOnline
}