/*
  UTTT
  Andrew Mainella
  8 May 2024
*/
import { getRedirectResult } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "../firebase"
import { useRouter } from "expo-router"

/**
 * A hook that handles the redirect result for the login.
 * @returns A boolean weater the authentication is loading
 */
export default function useRedirect() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  async function load() {
    try {
      const result = await getRedirectResult(auth)
      if (result !== null) {
        router.push("/")
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])
  return isLoading
}