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
        width: (width * ((width <= 560) ? 0.95:0.8)) - 10,
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
          await signInWithCredential(auth, credential);
          // signed in
        } catch (e) {
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