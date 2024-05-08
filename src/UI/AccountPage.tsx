import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { router } from 'expo-router'
import { signOut } from '../Functions/AuthenticationFunctions'
import { getUsername } from '../Functions/UserFunctions'
import { auth } from '../Firebase/Firebase'
import DefaultButton from './DefaultButton'
import OnlineAuthenticationComponent from './OnlineAuthenticationComponent'

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
    <DefaultButton
      onPress={() => loadSignOut()}
      style={{marginBottom: 5}}
    >
      <Text>Sign Out</Text>
    </DefaultButton>
  )
}

export default function AccountPage() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [username, setUsername] = useState<string>("");
  const [isAuth, setIsAuth] = useState(false)

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

  useEffect(() =>{
    const unlisten = auth.onAuthStateChanged(
      authUser => {
        if (authUser !== null) {
          setIsAuth(true)
        } else {
          setIsAuth(false)
        }
      },
    );
    return () => {
      unlisten();
    }
 }, []);

  if (!isAuth) {
    return <OnlineAuthenticationComponent onClose={() => {}}/>
  }

  return (
    <View style={{width: width * (width <= 560 ? 0.95:0.8), backgroundColor: "rgba(255,255,255, 0.95)", height: height * 0.8, borderRadius: 25, padding: 10}}>
      <Pressable onPress={() => {
        router.push("/")
      }}>
        <Text>Close</Text>
      </Pressable>
      <Text>Account Page</Text>
      <Text>Username: {username}</Text>
      <Text>Online Stats</Text>
      <Text>Games Played</Text>
      <Text>Games Won</Text>
      <Text>Active Games</Text>
      <SignOutButton />
      <DefaultButton style={{backgroundColor: "red"}}>
        <Text style={{fontWeight: 'bold', color: 'white'}}>Delete Account</Text>
      </DefaultButton>
    </View>
  )
}