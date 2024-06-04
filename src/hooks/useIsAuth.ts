import { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function useIsAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() =>{
    const unlisten = auth.onAuthStateChanged(
      authUser => {
        if (authUser !== null) {
          setIsAuth(true)
          setIsLoading(false)
        } else {
          setIsAuth(false)
          setIsLoading(false)
        }
      },
    );
    return () => {
      unlisten();
    }
 }, []);
  
    return { isAuth, isLoading };
}