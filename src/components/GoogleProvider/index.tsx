/*
  UTTT pulled from Sudoku
  Andrew Mainella
  11 September 2024
  Setting up google sign in with @react-native-google-signin/google-signin. This has been tested on iOS.
*/
import { ReactNode, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function GoogleProvider({
  children
}:{
  children: ReactNode
}) {
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '94813812988-lhtl01ojo9jchu3h8sbvr97uk9p1ajum.apps.googleusercontent.com'
    });  
  }, [])
  return children
}