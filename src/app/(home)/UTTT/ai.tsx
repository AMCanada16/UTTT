/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import SelectStorageGames from '@components/SelectStorageGame'
import { RootState } from '@redux/store'

export default function ai() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  return (
    <View style={{width, height, alignContent: 'center', alignItems: 'center', justifyContent: 'center', position: 'absolute'}} pointerEvents='box-none'>
      <SelectStorageGames onClose={() => {router.push("/") }} isFriend={false}/>
    </View>
  )
}