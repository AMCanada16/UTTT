/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import GlitchComponent from '@components/GlitchComponent';
import { RootState } from '@redux/store';

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
  const router = useRouter()

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

  if (collapsed === collapsedMode.full) {
    return (
      <View style={{flexDirection: 'row'}}>
        {/*ONLINE*/}
        <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
          <Pressable onPress={() => {router.push("/UTTT/online")}} style={{backgroundColor: "white", borderRadius: 10, height: height * 0.15, width: componentWidth, marginHorizontal: ((width/4) - width * 0.2)/2}}>
            <GlitchComponent fontSize={width * 0.04} text='PLAY ONLINE' animated={false} justifyText='center'height={height *0.15} width={componentWidth}/>
          </Pressable>
        </View>
        {/*AI*/}
        <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
          <Pressable onPress={() => {router.push("/UTTT/ai")}} style={{backgroundColor: "white", borderRadius: 10, width: componentWidth, margin: "auto", height: height * (0.15), justifyContent: "center", marginHorizontal: ((width/4) - width * 0.2)/2}}>
            <View style={{position: "relative", marginTop: width * 0.01}}>
              <View style={{height: width * 0.02, justifyContent: 'center'}}>
                <GlitchComponent fontSize={width * 0.03} text='PLAY AGAINST' animated={true} height={width * 0.04}/>
              </View>
              <Text style={{fontFamily: "Glitch", fontSize: width * 0.03, position: "relative", textAlign: "center", marginTop: width * 0.01, color: "green"}}>AI</Text>
            </View>
          </Pressable>
        </View>
        <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
          <Pressable onPress={() => {router.push("/UTTT/friend")}} style={{backgroundColor: "white", borderRadius: 10, height: height * 0.15, width: componentWidth, margin: "auto", marginHorizontal: ((width/4) - width * 0.2)/2}}>
            <GlitchComponent fontSize={width * 0.04} text='PLAY FRIEND' animated={false} justifyText='center'height={height * 0.15} width={componentWidth}/>
          </Pressable>
        </View>
        <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
          <Pressable onPress={() => {router.push("/UTTT/account")}} style={{backgroundColor: "white", borderRadius: 10, height: height * 0.15, width: componentWidth, margin: "auto", marginHorizontal: ((width/4) - width * 0.2)/2}}>
            <GlitchComponent fontSize={width * 0.04} text='ACCOUNT' animated={false} justifyText='center'height={height * 0.15} width={componentWidth}/>
          </Pressable>
        </View>
      </View>
    )
  }

  if (collapsed === collapsedMode.stacked) {
    return (
      <View>
        {/*ONLINE*/}
        <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
          <Pressable onPress={() => {router.push("/UTTT/online")}} style={{backgroundColor: "white", borderRadius: 10, height: height * ((collapsed === collapsedMode.stacked) ? 0.06:0.15), width: componentWidth, marginHorizontal: ((width/4) - width * 0.2)/2}}>
            <GlitchComponent fontSize={width * 0.04} text='PLAY ONLINE' animated={false} justifyText='center'height={height * ((collapsed === collapsedMode.stacked) ? 0.06:0.15)} width={componentWidth}/>
          </Pressable>
        </View>
        {/*AI*/}
        <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
          <Pressable onPress={() => {router.push("/UTTT/ai")}} style={{backgroundColor: "white", borderRadius: 10, width: componentWidth, margin: "auto", height: height * ((collapsed === collapsedMode.stacked) ? 0.06:0.15), justifyContent: "center", marginHorizontal: ((width/4) - width * 0.2)/2, alignItems: (collapsed === collapsedMode.stacked) ? 'center':undefined}}>
            <View style={{position: "relative", flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: (collapsed === collapsedMode.stacked) ? width * 0.25:undefined, height: width * 0.04, justifyContent: 'center'}}>
                <GlitchComponent fontSize={width * 0.04} text='PLAY AGAINST' animated={false} width={(collapsed === collapsedMode.stacked) ? width * 0.25:undefined} height={(collapsed === collapsedMode.stacked) ? width * 0.05:undefined}/>
              </View>
              <Text style={{fontFamily: "Glitch", fontSize: width * 0.03, position: "relative", textAlign: "center", marginTop: width * 0.015, color: "green", marginVertical: width * 0.015}}>AI</Text>
            </View>
          </Pressable>
        </View>
        <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
          <Pressable onPress={() => {router.push("/UTTT/friend")}} style={{backgroundColor: "white", borderRadius: 10, height: height * ((collapsed === collapsedMode.stacked) ? 0.06:0.15), width: componentWidth, margin: "auto", marginHorizontal: ((width/4) - width * 0.2)/2}}>
            <GlitchComponent fontSize={width * 0.04} text='PLAY FRIEND' animated={false} justifyText='center'height={height * ((collapsed === collapsedMode.stacked) ? 0.06:0.15)} width={componentWidth}/>
          </Pressable>
        </View>
        <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
          <Pressable onPress={() => {router.push("/UTTT/account")}} style={{backgroundColor: "white", borderRadius: 10, height: height * ((collapsed === collapsedMode.stacked) ? 0.06:0.15), width: componentWidth, margin: "auto", marginHorizontal: ((width/4) - width * 0.2)/2}}>
            <GlitchComponent fontSize={width * 0.04} text='ACCOUNT' animated={false} justifyText='center'height={height * ((collapsed === collapsedMode.stacked) ? 0.06:0.15)} width={componentWidth}/>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <>
      <View>
        <View style={{flexDirection: "row"}}>
            {/*ONLINE*/}
            <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
              <Pressable onPress={() => {router.push("/UTTT/online")}} style={{backgroundColor: "white", borderRadius: 10, height: height * (0.15), width: componentWidth, marginHorizontal: ((width/4) - width * 0.2)/2}}>
                <GlitchComponent fontSize={width * 0.04} text='PLAY ONLINE' animated={false} justifyText='center'height={height * 0.15} width={componentWidth}/>
              </Pressable>
            </View>
            {/*AI*/}
            <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
              <Pressable onPress={() => {router.push("/UTTT/ai")}} style={{backgroundColor: "white", borderRadius: 10, width: componentWidth, margin: "auto", height: height * (0.15), justifyContent: "center", marginHorizontal: ((width/4) - width * 0.2)/2}}>
                <View style={{position: "relative", marginTop: undefined}}>
                  <View style={{justifyContent: 'center'}}>
                    <GlitchComponent fontSize={width * 0.04} text='PLAY AGAINST' animated={true} />
                  </View>
                  <Text style={{fontFamily: "Glitch", fontSize: width * 0.03, position: "relative", textAlign: "center", marginTop: (width * 0.05), color: "green"}}>AI</Text>
                </View>
              </Pressable>
            </View>
        </View>
        <View style={{flexDirection: "row"}}>
          <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
            <Pressable onPress={() => {router.push("/UTTT/friend")}} style={{backgroundColor: "white", borderRadius: 10, height: height * (0.15), width: componentWidth, margin: "auto", marginHorizontal: ((width/4) - width * 0.2)/2}}>
              <GlitchComponent fontSize={width * 0.04} text='PLAY FRIEND' animated={false} justifyText='center'height={height * (0.15)} width={componentWidth}/>
            </Pressable>
          </View>
          <View style={{position: "relative", width: mainComponentWidth, marginTop: 15}}>
            <Pressable onPress={() => {router.push("/UTTT/account")}} style={{backgroundColor: "white", borderRadius: 10, height: height * (0.15), width: componentWidth, margin: "auto", marginHorizontal: ((width/4) - width * 0.2)/2}}>
              <GlitchComponent fontSize={width * 0.04} text='ACCOUNT' animated={false} justifyText='center'height={height * (0.15)} width={componentWidth}/>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  )
}