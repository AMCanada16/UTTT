import React from 'react'
import { Redirect } from 'expo-router'
import { Text } from 'react-native'

/** This screen redirects the user home if they aren't where they should be. */
export default function NotFound() {
  return <Redirect href={"/"}/>
}