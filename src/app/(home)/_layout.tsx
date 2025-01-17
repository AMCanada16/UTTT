import { Slot } from 'expo-router'
import React, { useEffect } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { WelcomePage } from '@components/WelcomePage'

/*
 This is the main layout. This needs to be in a main layout so only the overlay re-renders on re route.
*/
export default function _layout() {
  const {height, width} = useWindowDimensions()
  useEffect(() => {
    console.log("rendered")
  }, [])
  return (
    <View style={{width, height}}>
      <WelcomePage />
      <View style={{width, height, zIndex: 2, position: 'absolute'}} pointerEvents='box-none'>
        <Slot />
      </View>
    </View>
  )
}