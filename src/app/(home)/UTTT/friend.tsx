/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import SelectStorageGames from '../../../components/SelectStorageGame'

export default function friend() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  return (
    <View style={{width, height, alignContent: 'center', alignItems: 'center', justifyContent: 'center', position: 'absolute'}} pointerEvents='box-none'>
      <SelectStorageGames onClose={() => {router.push("/") }} isFriend />
    </View>
  )
}