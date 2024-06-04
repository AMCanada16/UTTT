/*
  UTTT
  Andrew Mainella
  8 May 2024
  _layout.tsx

*/

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import RootLayout from "../components/RootLayout";
import { useEffect } from "react";

/**
 * The the main function for the app holds providers.
 * @returns The app
 */
export default function AppContainer() {

  useEffect(() => {
    console.log("Configuring Google Signin")
    GoogleSignin.configure({
      iosClientId: '94813812988-lhtl01ojo9jchu3h8sbvr97uk9p1ajum.apps.googleusercontent.com'
    });  
  }, [])

  return <RootLayout />
}

