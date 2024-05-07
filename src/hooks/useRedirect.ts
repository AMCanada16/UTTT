/*
  Andrew Mainella
  Hamlet Clue
*/
import { getRedirectResult } from "firebase/auth"
import { useEffect, useState } from "react"
import { router } from "expo-router"
import { auth } from "../Firebase/Firebase"

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