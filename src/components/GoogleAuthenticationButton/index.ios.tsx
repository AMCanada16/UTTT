/*
  UTTT
  Andrew Mainella
  27 September 2024
*/
import { Pressable, useWindowDimensions, View } from "react-native"
import { GoogleIcon } from "../Icons"
import { Text } from "react-native"
import signInWithGoogleiOS from "../../functions/signInWithGoogleiOS"

export default function GoogleAuthenticationButton() {
  const {width} = useWindowDimensions()
  return (
    <Pressable 
      style={{
        backgroundColor: 'white',
        borderRadius: 4,
        borderColor: "black",
        borderWidth: 1,
        height: 38,
        width: width * ((width <= 560) ? 0.95:0.8) - 22,
        paddingHorizontal: 12,
        marginTop: 5,
        justifyContent: 'center'
      }}
      onPress={() => {
        signInWithGoogleiOS()
      }}
    >
      <View style={{flexDirection: "row", alignItems: 'center', height: 36, justifyContent: 'center'}}>
        <GoogleIcon width={20} height={20} style={{marginRight: 14, height: 36}}/>
        <Text style={{textAlignVertical: 'center', fontSize: 14, fontFamily: 'Roboto'}}>Sign In With Google</Text>
      </View>
    </Pressable>
  )
}