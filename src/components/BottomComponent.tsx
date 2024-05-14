import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import GlitchComponent from './GlitchComponent'

enum collapsedMode {
  full, // all side by side
  side, // two staks of two
  stacked // statcked
}

export default function BottomComponent() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [collapsed, setCollpased] = useState<collapsedMode>(collapsedMode.full)
  const [componentWidth, setComponentWidth] = useState<number>(0);
  const [mainComponentWidth, setMainComponentWidth] = useState<number>(0);

  useEffect(() => {
    if (width <= 560) {
      setCollpased(collapsedMode.stacked)
      setComponentWidth((width - ((width/4) - width * 0.2)))
      setMainComponentWidth(width)
    } else if (width <= 1000) {
      setCollpased(collapsedMode.side)
      setMainComponentWidth(width/2)
      setComponentWidth((width/2 - ((width/4) - width * 0.2)))
    } else {
      setMainComponentWidth(width/4)
      setCollpased(collapsedMode.full)
      setComponentWidth(width * 0.2)
    }
  }, [width, height])

  return (
    <>
      <View style={{flexDirection: (collapsed === collapsedMode.stacked) ? undefined:"row"}}>
        <View style={{flexDirection: (collapsed !== collapsedMode.full) ? undefined:"row"}}>
            {/*ONLINE*/}
            <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
              <Pressable onPress={() => {router.push("/UTTT/online")}} style={{backgroundColor: "white", borderRadius: 10, height: height * ((collapsed === collapsedMode.stacked) ? 0.1:0.15), width: componentWidth, marginHorizontal: ((width/4) - width * 0.2)/2}}>
                <GlitchComponent fontSize={width * 0.04} text='PLAY ONLINE' animated={false} justifyText='center'height={height * ((collapsed === collapsedMode.stacked) ? 0.1:0.15)} width={componentWidth}/>
              </Pressable>
            </View>
            {/*AI*/}
            <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
              <Pressable onPress={() => {router.push("/UTTT/ai")}} style={{backgroundColor: "white", borderRadius: 10, width: componentWidth, margin: "auto", height: height * ((collapsed === collapsedMode.stacked) ? 0.1:0.15), justifyContent: "center", marginHorizontal: ((width/4) - width * 0.2)/2}}>
                <View style={{position: "relative"}}>
                  <GlitchComponent fontSize={width * 0.03} text='PLAY AGAINST'animated={true}/>
                  <Text style={{fontFamily: "Glitch", fontSize: width * 0.03, position: "relative", textAlign: "center", marginTop: width * 0.05, color: "green"}}>AI</Text>
                </View> 
              </Pressable>
            </View>
        </View>
        <View style={{flexDirection: (collapsed !== collapsedMode.full) ? undefined:"row"}}>
          <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
            <Pressable onPress={() => {router.push("/UTTT/friend")}} style={{backgroundColor: "white", borderRadius: 10, height: height * ((collapsed === collapsedMode.stacked) ? 0.1:0.15), width: componentWidth, margin: "auto", marginHorizontal: ((width/4) - width * 0.2)/2}}>
              <GlitchComponent fontSize={width * 0.04} text='PLAY FRIEND' animated={false} justifyText='center'height={height * ((collapsed === collapsedMode.stacked) ? 0.1:0.15)} width={componentWidth}/>
            </Pressable>
          </View>
          <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
            <Pressable onPress={() => {router.push("/UTTT/account")}} style={{backgroundColor: "white", borderRadius: 10, height: height * ((collapsed === collapsedMode.stacked) ? 0.1:0.15), width: componentWidth, margin: "auto", marginHorizontal: ((width/4) - width * 0.2)/2}}>
              <GlitchComponent fontSize={width * 0.04} text='ACCOUNT' animated={false} justifyText='center'height={height * ((collapsed === collapsedMode.stacked) ? 0.1:0.15)} width={componentWidth}/>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  )
}