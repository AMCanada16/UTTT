import React from 'react'
import { View, Text } from 'react-native'
import {useFonts} from "expo-font"
import { StyleSheet } from 'react-native'

export default function GlitchComponent({text, animated, fontSize, justifyText, width, height}:{text: string, animated: boolean, fontSize: number, justifyText?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined, width?: string | number | undefined, height?: string | number | undefined}) {
  const [isLoaded] = useFonts({
    "RussoOne": require("../../assets/Fonts/RussoOne-Regular.ttf"),
    "Ultimate": require("../../assets/Fonts/Ultimate.ttf"),
    "BarlowCondensed": require("../../assets/Fonts/BarlowCondensed-Black.ttf"),
    "Glitch":require("../../assets/Fonts/MokotoGlitchMark2.ttf")
  });
  return (
    <View>
      { animated ?     
      <View style={{alignItems: "center", justifyContent: justifyText, width: width, height: height}}>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute", textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#00fffc", zIndex: -1, transform: [{translateX: -2, translateY: 2}], textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#fc00ff", zIndex: -2, transform: [{translateX: 2, translateY: -8}], textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#fffc00", zIndex: -3, transform: [{translateX: 2, translateY: 2}], textAlign: "center"}}>{text}</Text>
      </View>:
      <View style={{alignItems: "center", justifyContent: justifyText, width: width, height: height}}>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute", textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#00fffc", zIndex: -1, transform: [{translateX: -2, translateY: 2}], textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#fc00ff", zIndex: -2, transform: [{translateX: 2, translateY: -8}], textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#fffc00", zIndex: -3, transform: [{translateX: 2, translateY: 2}], textAlign: "center"}}>{text}</Text>
      </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  topView: {
    width: '100%',
    position: 'absolute',
    top: 0, backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    },
  shadowView: {
    position: 'absolute',
    top: 3,
    width: '100%',
    zIndex: -10,
    borderRadius: 17,
    backgroundColor: '#ddd'}
});

//    0% {
//     text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
//     0.025em 0.04em 0 #fffc00;
// }
// 15% {
//     text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
//     0.025em 0.04em 0 #fffc00;
// }
// 16% {
//     text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
//     -0.05em -0.05em 0 #fffc00;
// }
// 49% {
//     text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
//     -0.05em -0.05em 0 #fffc00;
// }
// 50% {
//     text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
//     0 -0.04em 0 #fffc00;
// }
// 99% {
//     text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
//     0 -0.04em 0 #fffc00;
// }
// 100% {
//     text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
//     -0.04em -0.025em 0 #fffc00;
// }
//        {/* <p className="glitch">
{/* <span aria-hidden="true">{text}</span>
{text}
<span aria-hidden="true">{text}</span>
</p> */} 