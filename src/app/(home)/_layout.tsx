import { View, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'
import { WelcomePage } from '../../components/WelcomePage'
import { Slot } from 'expo-router'

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