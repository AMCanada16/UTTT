

if (typeof window !== 'undefined') {
    // @ts-ignore
    window._frameTimestamp = null
}

import React, { useEffect } from "react";
import { Button, View, StyleSheet, Text, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Svg, Circle, Rect, Path} from "react-native-svg";

const svg = require('../../assets/Mediamodifier-Design.svg');


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TextAnimation({length, mode, colored}:{length: number, mode: "X"|"O", colored: boolean}) {
  const r = useSharedValue(100);

  useEffect(() => {
    console.log("Change Logger")
    r.value = -1
  }, [])

  // highlight-start
  const animatedProps = useAnimatedProps(() => ({
    r: withTiming(r.value, {
      duration: 500,
      easing: Easing.in(Easing.linear)
    })
    ,
  }));
  // highlight-end

  return (
    <View style={[styles.container]} onLayout={() => {console.log("Starting")}}>
      <Svg style={{width: length, height: length, zIndex: 1}}>
        <AnimatedCircle
          cx="50%"
          cy="50%"
          fill="blue"
          r={0}
          animatedProps={animatedProps}
          onPress={() => {}}
        />
      </Svg>
      { (mode === "X") ?
        <Image style={{width: length * 2.3, height: length * 2.3, position: "absolute", overlayColor: "red", tintColor: colored ? "#a0f4f7":"black", shadowColor: "#5CE1E6", shadowRadius: 25, }} source={require('../../assets/Mediamodifier-Design.svg')} />: <Image style={{width: length * 0.8, height: length * 0.8, position: "absolute"}} source={require('../../assets/circle-svgrepo-com.svg')} />
      }
      {/* <TextAnimationSVGUri /> */}
    </View>
  );
}

//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  svg: {
    position: "absolute"
  },
});

//  