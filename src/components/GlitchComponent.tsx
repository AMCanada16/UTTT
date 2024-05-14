import React from 'react'
import { View, Text, DimensionValue } from 'react-native'

export default function GlitchComponent({text, animated, fontSize, justifyText, width, height}:{text: string, animated: boolean, fontSize: number, justifyText?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined, width?:  DimensionValue | undefined, height?: DimensionValue | undefined}) {
  return (
    <View>
      { animated ?     
      <View style={{alignItems: "center", justifyContent: justifyText, width: width, height: height}}>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute", textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#00fffc", zIndex: -1, transform: [{translateX: -2}, {translateY: 2}], textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#fc00ff", zIndex: -2, transform: [{translateX: 2}, {translateY: -4}], textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#fffc00", zIndex: -3, transform: [{translateX: 2}, {translateY: 2}], textAlign: "center"}}>{text}</Text>
      </View>:
      <View style={{alignItems: "center", justifyContent: justifyText, width: width, height: height}}>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute", textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#00fffc", zIndex: -1, transform: [{translateX: -2}, {translateY: 2}], textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#fc00ff", zIndex: -2, transform: [{translateX: 2}, {translateY: -4}], textAlign: "center"}}>{text}</Text>
        <Text style={{fontSize: fontSize, fontFamily: "BarlowCondensed", textTransform: "uppercase", fontWeight: "bold", position: "absolute",  color: "#fffc00", zIndex: -3, transform: [{translateX: 2}, {translateY: 2}], textAlign: "center"}}>{text}</Text>
      </View>
      }
    </View>
  )
}