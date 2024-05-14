import { useEffect, useState } from "react";
import { database } from "../Firebase/Firebase";
import { onValue, ref } from "firebase/database";

export default function useUserOnline(id: string) {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  useEffect(() => {
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
  }, [])
  return isOnline
}