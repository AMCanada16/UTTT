import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { GoogleLogin } from "@react-oauth/google";
import { auth } from "@functions/firebase";

export default function GoogleAuthenticationButton() {
  return (
    <GoogleLogin
      onSuccess={async credentialResponse => {
        const googleCredential = GoogleAuthProvider.credential(credentialResponse.credential);
        await signInWithCredential(auth, googleCredential);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  )
}