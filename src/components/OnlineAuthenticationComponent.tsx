/*
  UTTT
  Andrew Mainella
  May 8, 2024
  Authentication component used to play online games.
*/
import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { CloseIcon, GoogleIcon } from './Icons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { signInAnonymously } from '../functions/AuthenticationFunctions'
import AppleAuthenticationButton from './AppleAuthenticationButton'
import DefaultButton from './DefaultButton'
import { signInWithGoogle } from '../functions/signInWithGoogle'


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
        <Pressable 
          style={{
            backgroundColor: 'white',
            borderRadius: 4,
            borderColor: "black",
            borderWidth: 1,
            height: 38,
            width: width * ((width <= 560) ? 0.95:0.8) - 22,
            paddingHorizontal: 12,
            marginTop: 5,
            justifyContent: 'center'
          }}
          onPress={() => {
            signInWithGoogle()
          }}
        >
          <View style={{flexDirection: "row", alignItems: 'center', height: 36, justifyContent: 'center'}}>
            <GoogleIcon width={20} height={20} style={{marginRight: 14, height: 36}}/>
            <Text style={{textAlignVertical: 'center', fontSize: 14, fontFamily: 'Roboto'}}>Sign In With Google</Text>
          </View>
        </Pressable>
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