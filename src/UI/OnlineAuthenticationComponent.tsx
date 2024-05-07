import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { CloseIcon, GoogleIcon, SignInWithApple } from './Icons'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import useRedirect from '../hooks/useRedirect'
import { signInAnonymously, signInWithApple, signInWithGoogle } from '../Functions/AuthenticationFunctions'

export default function OnlineAuthenticationComponent({
  onClose
}:{
  onClose: () => void
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  return (
    <View style={{width: width * 0.8, height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Pressable style={{marginTop: 25, marginLeft: 25}} onPress={() => {onClose()}}>
        <CloseIcon width={20} height={20}/>
      </Pressable>
      <Text>No User has sign in</Text>
      <Pressable
        style={{backgroundColor: "black", width: 210, height: 40, paddingHorizontal: 16.8, borderRadius: 6, marginHorizontal: ((width * 0.8) -210)/2}}
        onPress={() => {
          signInWithApple()
        }}
      >
        <SignInWithApple width={176.4} height={40}/>
      </Pressable>
      <Pressable 
        style={{
          backgroundColor: 'white',
          borderRadius: 4,
          borderColor: "#747775",
          borderWidth: 1,
          height: 38,
          width: 181.23,
          paddingHorizontal: 12,
          marginHorizontal: ((width * 0.8) -181.23)/2,
          marginTop: 5
        }}
        onPress={() => {
          signInWithGoogle()
        }}
      >
        <View style={{flexDirection: "row", alignItems: 'center'}}>
          <GoogleIcon width={20} height={20} style={{marginRight: 14, height: 36}}/>
          <Text style={{textAlignVertical: 'center', fontSize: 14, fontFamily: 'Roboto'}}>Sign In With Google</Text>
        </View>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: 'white',
          borderRadius: 15,
          padding: 10,
          margin: 5,
          borderWidth: 1,
          borderColor: 'black'
        }}
        onPress={() => {
          signInAnonymously()
        }}
      >
        <Text>Continue As Guest</Text>
      </Pressable>
    </View>
  )
}