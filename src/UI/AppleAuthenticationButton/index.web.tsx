import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { signInWithApple } from '../../Functions/AuthenticationFunctions'
import { SignInWithApple } from '../Icons'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'

export default function AppleAuthenticationButton() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  return (
    <Pressable
      style={{backgroundColor: "black", width: 210, height: 40, paddingHorizontal: 16.8, borderRadius: 6, marginHorizontal: ((width * 0.8) -210)/2}}
      onPress={() => {
        signInWithApple()
      }}
    >
      <SignInWithApple width={176.4} height={40}/>
    </Pressable>
  )
}