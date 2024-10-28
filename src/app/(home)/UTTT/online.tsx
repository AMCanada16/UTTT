import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import SelectOnlineGame from '../../../components/SelectOnlineGame'
import { router } from 'expo-router'


export default function index() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  return (
    <View style={{width, height, alignContent: 'center', alignItems: 'center', justifyContent: 'center', position: 'absolute'}} pointerEvents='box-none'>
      <SelectOnlineGame onClose={() => {router.push("/")}}/>
    </View>
  )
}