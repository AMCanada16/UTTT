/*
  UTTT
  Andrew Mainella
  1 October 2024
  account.tsx
  This file is the account page for the UTTT game. It is a welcome page that displays the user's account information.
*/
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import AccountPage from '@components/AccountPage';
import { RootState } from '@redux/store';

export default function account() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  return (
    <View style={{width, height, alignContent: 'center', alignItems: 'center', justifyContent: 'center', position: 'absolute'}} pointerEvents='box-none'>
      <AccountPage />
    </View>
  )
}