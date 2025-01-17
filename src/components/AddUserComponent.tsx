/*
  UTTT
  Andrew Mainella
  8 May 2024
  AddUserComponent.tsx
  A react functional component to add a user.
*/
import { View, Text, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronRight, CloseIcon, SignOutIcon } from './Icons'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { addUser, checkIfUsernameValid } from '@functions/UserFunctions'
import { auth } from '@functions/firebase'
import DefaultButton from '@components/DefaultButton'
import { signOut } from '@functions/AuthenticationFunctions'
import { loadingState } from '@types'

/**
 * A function to add a username if the account doesn't have one
 * @param onClose A function called when the user closes the component. This should hide the view
 * @returns A react function
 * @remarks Needs internet to work. This component should be after checking if the component has internet. (need to add offline screen)
 */
export default function UsernameComponent({
  onClose
}:{
  onClose: () => void
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [username, setUsername] = useState<string>("")
  const [usernameState, setUsernameState] = useState<loadingState>(loadingState.loading)

  async function check() {
    if (username.length > 2) {
      setUsernameState(await checkIfUsernameValid(username))
    } else {
      setUsernameState(loadingState.loading)
    }
  }

  useEffect(() => {
    check()
  }, [username])

  return (
    <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Pressable style={{marginTop: (width <= 560) ? 15:25, marginLeft: (width <= 560) ? 15:25}} onPress={() => {onClose()}}>
        <CloseIcon width={30} height={30}/>
      </Pressable>
      <Text style={{
        fontWeight: "bold",
        fontSize: 25,
        textAlign: 'center'
      }}>Your Account Needs a Username</Text>
      <Text
          style={{
            marginLeft: 7.5
          }}
        >Username</Text>
      <TextInput 
        value={username}
        onChangeText={setUsername}
        style={{height: 35, fontSize: 25, borderWidth: 1, borderColor: 'black', padding: 5, margin: 5, fontFamily: 'RussoOne'}}
      />
      <DefaultButton
        onPress={() => {
          let uid = auth.currentUser?.uid
          if (uid !== undefined) {
            addUser(uid, username)
          }
        }}
        style={{
          margin: 5,
          flexDirection: 'row'
        }}
        disabled={usernameState !== loadingState.success}
      >
        {usernameState === loadingState.loading ?
          <Text>The username needs to be longer than 2 characters</Text>:null
        }
        {usernameState === loadingState.success ?
          <>
            <Text style={{marginTop: 2}}>Continue</Text>
            <ChevronRight width={20} height={20}/>
          </>:null
        }
        {usernameState === loadingState.exists ?
          <Text>The Username Already Exists</Text>:null
        }
         {usernameState === loadingState.failed ?
          <Text>Something has gone wrong, please try again later.</Text>:null
        }
      </DefaultButton>
      <DefaultButton 
        onPress={() => {
          signOut()
        }}
        style={{
          flexDirection: 'row',
          margin: 5
        }}
      >
        <SignOutIcon width={20} height={20}/>
        <Text style={{textAlign: "center", justifyContent: 'center', marginVertical: 'auto'}}>Sign Out</Text>
      </DefaultButton>
    </View>
  )
}