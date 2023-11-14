import { firebase } from "@react-native-firebase/app-check"
import { FirebaseApp } from "firebase/app"

export default function setupAppCheck(_app: FirebaseApp) {
    const appCheckProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider()
    appCheckProvider.configure({
      android: {
        provider: __DEV__ ? 'debug' : 'playIntegrity',
        debugToken: 'YOUR_DEBUG_TOKEN',
      },
      apple: {
        provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
        debugToken: 'YOUR_DEBUG_TOKEN',
      },
      web: {
        provider: 'reCaptchaV3',
        siteKey: 'unknown',
      },
    })
    firebase.appCheck().initializeAppCheck({ provider: appCheckProvider, isTokenAutoRefreshEnabled: true })
}