import { View, Text, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CloseIcon, SignOutIcon } from './Icons'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { addUser, checkIfUsernameValid } from '../Functions/UserFunctions'
import { auth } from '../Firebase/Firebase'
import DefaultButton from './DefaultButton'
import { signOut } from '../Functions/AuthenticationFunctions'
import { loadingState } from '../Types'

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
    <View style={{width: width * 0.8, height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Pressable style={{marginTop: 25, marginLeft: 25}} onPress={() => {onClose()}}>
        <CloseIcon width={20} height={20}/>
      </Pressable>
      <Text>Your Account Needs a Username</Text>
      <Text>Username</Text>
      <TextInput 
        value={username}
        onChangeText={setUsername}
      />
      <DefaultButton
        onPress={() => {
          let uid = auth.currentUser?.uid
          if (uid !== undefined) {
            addUser(uid, username)
          }
        }}
        style={{
          margin: 5
        }}
      >
        {usernameState === loadingState.loading ?
          <Text>The username needs to be longer than 2 characters</Text>:null
        }
        {usernameState === loadingState.success ?
          <Text>Continue</Text>:null
        }
        {usernameState === loadingState.exists ?
          <Text>Exists</Text>:null
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
        <Text>Sign Out</Text>
      </DefaultButton>
    </View>
  )
}