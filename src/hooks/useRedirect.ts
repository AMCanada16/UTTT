/*
  UTTT
  Andrew Mainella
  8 May 2024
*/
import { getRedirectResult } from "firebase/auth"
import { useEffect, useState } from "react"
import { router } from "expo-router"
import { auth } from "../Firebase/Firebase"

/**
 * A hook that handles the redirect result for the login.
 * @returns A boolean weater the authentication is loading
 */
export default function useRedirect() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  async function load() {
    try {
      const result = await getRedirectResult(auth)
      if (result !== null) {
        router.push("/")
      }
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])
  return isLoading
}