import { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";
import { getUsername } from "../Functions/UserFunctions";

export default function useUsernameExists() {
  const [exists, setExists] = useState<boolean>(false);
  useEffect(() =>{
    const unlisten = auth.onAuthStateChanged(
      async authUser => {
        console.log(authUser)
        if (authUser !== null) {
          const usernameResult = await getUsername(authUser.uid)
          if (usernameResult !== undefined) {
            setExists(true)
          } else {
            setExists(false)
          }
        } else {
          setExists(false)
        }
      },
    );
    return () => {
      unlisten();
    }
  }, []);
  return exists
}