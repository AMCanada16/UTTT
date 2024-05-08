import { View, Text } from 'react-native'
import React from 'react'
import * as AppleAuthentication from 'expo-apple-authentication';
import { auth } from '../../Firebase/Firebase';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

export default function AppleAuthenticationButton() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{
        width: width * 0.95 - 10,
        height: 40,
        marginHorizontal: 5
      }}
      onPress={async () => {
        try {
          const nonce = Math.random().toString(36).substring(2, 10);
          const appleCredential = await AppleAuthentication.signInAsync();
          const { identityToken } = appleCredential;
          const provider = new OAuthProvider('apple.com');
          const credential = provider.credential({
              idToken: identityToken!,
              rawNonce: nonce
          });
          console.log(credential)
          await signInWithCredential(auth, credential);
          console.log("mark one reached")
          // signed in
        } catch (e) {
          console.log("something went wrong", e)
          // if (e.code === 'ERR_REQUEST_CANCELED') {
          //   // handle that the user canceled the sign-in flow
          // } else {
          //   // handle other errors
          // }
        }
      }}
    />
  )
}