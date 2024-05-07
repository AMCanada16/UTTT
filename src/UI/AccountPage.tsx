import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { router } from 'expo-router'
import { signOut } from '../Functions/AuthenticationFunctions'
import { getUsername } from '../Functions/UserFunctions'
import { auth } from '../Firebase/Firebase'

function SignOutButton() {
  const [signOutLoading, setSignOutLoading] = useState<boolean>(false)
  const [signOutFailed, setSignOutFailed] = useState<boolean>(false)
  
  async function loadSignOut() {
    setSignOutLoading(true)
    let result = await signOut()
    if (!result) {
      setSignOutFailed(true)
    }
    setSignOutLoading(false)
  }

  if (signOutFailed) {
    return (
      <View>
        <Text>Failed</Text>
      </View>
    )
  }

  if (signOutLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    )
  }

  return (
    <Pressable
      onPress={() => loadSignOut()}
      style={{
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 5
      }}
    >
      <Text>Sign Out</Text>
    </Pressable>
  )
}

export default function AccountPage() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [username, setUsername] = useState<string>("");

  async function loadUserData() {
    const uid = auth.currentUser?.uid
    if (uid !== undefined) {
      const username = await getUsername(uid)
      if (username !== undefined) {
        setUsername(username)
      }
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <View style={{width: width * 0.8, backgroundColor: "rgba(255,255,255, 0.95)", height: height * 0.8, borderRadius: 25, padding: 10}}>
      <Pressable onPress={() => {
        router.push("/")
      }}>
        <Text>Close</Text>
      </Pressable>
      <Text>Account Page</Text>
      <Text>Username: {username}</Text>
      <Text>Stats</Text>
      <Text>Games Played</Text>
      <Text>Games Won</Text>
      <Text>Active Games</Text>
      <SignOutButton />
      <Pressable>
        <Text>Delete Account</Text>
      </Pressable>
    </View>
  )
}