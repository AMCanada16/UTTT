import { useState } from "react"
import { ActivityIndicator, View, Text } from "react-native"
import { ErrorCircleIcon, SignOutIcon } from "@components/Icons"
import DefaultButton from "@components/DefaultButton"
import { signOut } from '@functions/AuthenticationFunctions'

export default function SignOutButton() {
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
      <View 
        style={{
          flexDirection: 'row', borderRadius: 4,
          borderWidth: 1,
          borderColor: 'black',
          backgroundColor: "white",
          padding: 10, marginBottom: 5
        }}
      >
        <ErrorCircleIcon width={20} height={20}/>
        <Text style={{marginLeft: 5, marginVertical: 'auto'}} selectable={false}>Failed To Sign Out</Text>
      </View>
    )
  }

  if (signOutLoading) {
    return (
      <View
        style={{
          flexDirection: 'row', borderRadius: 4,
          borderWidth: 1,
          borderColor: 'black',
          backgroundColor: "white",
          padding: 10, marginBottom: 5
        }}
      >
        <View style={{width: 20, height: 20}}>
          <ActivityIndicator />
        </View>
        <Text style={{marginLeft: 5, marginVertical: 'auto'}} selectable={false}>Loading...</Text>
      </View>
    )
  }

  return (
    <DefaultButton
      onPress={() => loadSignOut()}
      style={{marginBottom: 5, flexDirection: 'row'}}
    >
      <SignOutIcon width={19} height={19}/>
      <Text style={{
        fontSize: 16
      }}>Sign Out</Text>
    </DefaultButton>
  )
}