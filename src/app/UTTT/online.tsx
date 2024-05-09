/*
  UTTT
  Andrew Mainella
  7 May 2024
  online.tsx
  A functional component that activates the online popup.
  I wanted this to not need to use a use
*/
import React from 'react'
import { WelcomePage } from '..'

export default function index() {
  return <WelcomePage online={true}/>
}