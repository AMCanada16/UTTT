/*
  UTTT
  Andrew Mainella
  May 8, 2024
  Authentication component used to play online games.
*/
import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { CloseIcon } from './Icons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { signInAnonymously } from '../functions/AuthenticationFunctions'
import AppleAuthenticationButton from './AppleAuthenticationButton'
import DefaultButton from './DefaultButton'
import GoogleAuthenticationButton from './GoogleAuthenticationButton'


export default function OnlineAuthenticationComponent({
  onClose
}:{
  onClose: () => void
}) {
  const {width, height} = useSelector((state: RootState) => state.dimensions)
  return (
    <View style={{
      backgroundColor: 'rgba(169,169,169,0.9)',
      width,
      height,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <View style={{width: width * ((width <= 560) ? 0.95:0.8), backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, borderWidth: 1, borderColor: 'black', padding: 10, paddingBottom: 15}}>
        <Pressable style={{marginTop: (width <= 560) ? 0:25, marginLeft: (width <= 560) ? 0:25}} onPress={() => {onClose()}}>
          <CloseIcon width={30} height={30}/>
        </Pressable>
        <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 25, marginBottom: 10}}>Login</Text>
        <AppleAuthenticationButton />
        <GoogleAuthenticationButton />
        <DefaultButton
          onPress={() => {
            signInAnonymously()
          }}
          style={{
            marginTop: 5
          }}
        >
          <Text>Continue As Guest</Text>
        </DefaultButton>
      </View>
    </View>
  )
}