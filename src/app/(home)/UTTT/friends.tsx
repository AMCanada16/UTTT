/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import FriendsPage from '../../../components/FriendsPage'

export default function index() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  return (
    <View style={{width, height, alignContent: 'center', alignItems: 'center', justifyContent: 'center', position: 'absolute'}} pointerEvents='box-none'>
      <FriendsPage />
    </View>
  )
}