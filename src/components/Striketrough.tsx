import React, { useMemo, useState } from 'react'
import {Svg, Line} from "react-native-svg"
import {View} from "react-native"

/**
 * A React Functional Component 
 * @param gridState The 
 * @returns 
 */
export default function Striketrough({active}:{active: activeType}) {
  const [length, setLength] = useState<number>(0)
  const xOne = useMemo(() => {return active.xOne}, [active])
  const xTwo = useMemo(() => {return active.xTwo}, [active])
  const yOne = useMemo(() => {return active.yOne}, [active])
  const yTwo = useMemo(() => {return active.yTwo}, [active])

  return (
    <View style={{width: "100%", height: "100%", position: 'absolute'}} onLayout={(e) => {setLength(e.nativeEvent.layout.height)}}>
      <Svg width={length} height={length}>
        <Line x1={xOne * length/3 + length/6} x2={xTwo  * length/3  + length/6} y1={yOne  * length/3 +  length/6} y2={yTwo  * length/3 + length/6} stroke={"#FED049"} strokeLinecap='round' strokeWidth={5}/>
      </Svg>
    </View>
  )
}
