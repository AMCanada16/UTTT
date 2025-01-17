/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Svg, Circle } from "react-native-svg";
import { CircleIcon, XIcon } from "@components/Icons";

if (typeof window !== 'undefined') {
  // @ts-ignore
  window._frameTimestamp = null
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TextAnimation({length, mode, colored}:{length: number, mode: "X"|"O", colored: boolean}) {
  const r = useSharedValue(Math.max(0, length));

  useEffect(() => {
    r.value = 0;
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
    <>
      <Svg style={{width: Math.max(0, length), height: Math.max(0, length), zIndex: 1, borderRadius: (mode === "X") ? 0:length, overflow: 'hidden'}}>
        <AnimatedCircle
          cx="50%"
          cy="50%"
          fill={(mode === "X") ? "#5ce1e6":"#ff9c9c"}
          animatedProps={animatedProps}
        />
      </Svg>
      { (mode === "X") ?
        <XIcon width={Math.max(0, length)} height={Math.max(0, length)} style={{position: 'absolute'}} color="#5ce1e6"/>:
        <CircleIcon width={Math.max(0, length)} height={Math.max(0, length)} style={{position: 'absolute'}} color="#ff9c9c"/>
      }
    </>
  );
}