/*
  UTTT
  Andrew Mainella
  14 May 2024
*/
import React, { useState } from 'react'
import { View } from 'react-native'
import TextAnimation from '@components/TextAnimation'

/**
 * 
 * @param mode x or o for the type of tile animation
 * @returns 
 */
export default function BigTileTextAnimation({mode}:{mode: string}) {
  const [length, setLength] = useState<number>(100)
  return (
    <View style={{width: "100%", height: "100%"}} onLayout={(e) => {setLength(e.nativeEvent.layout.height)}}>
      { (mode == "X" || mode == "O") ?
        <TextAnimation colored={true} length={length} mode={(mode === "X") ? "X":"O"} />:null
      }
    </View>
  )
}
