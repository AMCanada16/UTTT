import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

export default function GameOverComponent() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  return (
    <View style={{position: 'absolute', width: width * ((width <= 560) ? 0.95:0.8), height: height * ((width <= 560) ? 0.95:0.8), top: 'auto', bottom: 'auto', left: 'auto', right: 'auto', backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Text
        style={{margin: 10, fontSize: height * 0.2, fontFamily: "Ultimate", textAlign: 'center'}}
      >Game Over</Text>
      <Pressable onPress={() => {
        router.push('/')
      }}>
        <Text>Back</Text>
      </Pressable>
    </View>
  )
}