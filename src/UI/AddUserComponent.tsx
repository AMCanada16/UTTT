import { View, Text, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import { CloseIcon } from './Icons'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { addUser } from '../Functions/UserFunctions'
import { auth } from '../Firebase/Firebase'

export default function UsernameComponent({
  onClose
}:{
  onClose: () => void
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [username, setUsername] = useState<string>("")
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
      <Pressable onPress={() => {
        let uid = auth.currentUser?.uid
        if (uid !== undefined) {
          addUser(uid, username)
        }
      }}>
        <Text>Continue</Text>
      </Pressable>
      <Pressable>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  )
}