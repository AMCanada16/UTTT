/*
  UTTT
  Andrew Mainella
  May 31 2024
*/
import AppleSignin from 'react-apple-signin-auth';

/** Apple Signin button */
export default function AppleAuthenticationButton() {
  return (
  <AppleSignin
    authOptions={{
      clientId: 'com.Archimedes4.UTTT',
      scope: 'email',
      redirectURI: 'https://archimedes4-games.web.app/account',
      state: 'signin',
      nonce: Math.random().toString(36).substring(2, 10),
      usePopup: true,
    }}
    uiType="dark"
    className="apple-auth-btn"
    onSuccess={(e: any) => {
      console.log(e)
    }}
    onError={() => {

    }}
  />
)}
