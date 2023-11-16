import React from 'react'
import { View, Text, DimensionValue } from 'react-native'
import {useFonts} from "expo-font"

export default function GlitchComponent({text, animated, fontSize, justifyText, width, height}:{text: string, animated: boolean, fontSize: number, justifyText?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined, width?:  DimensionValue | undefined, height?: DimensionValue | undefined}) {
  const [isLoaded] = useFonts({
    "RussoOne": require("../../assets/Fonts/RussoOne-Regular.ttf"),
    "Ultimate": require("../../assets/Fonts/Ultimate.ttf"),
    "BarlowCondensed": require("../../assets/Fonts/BarlowCondensed-Black.ttf"),
    "Glitch":require("../../assets/Fonts/MokotoGlitchMark2.ttf")
  });

  if (!isLoaded) {
    return null
  }

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