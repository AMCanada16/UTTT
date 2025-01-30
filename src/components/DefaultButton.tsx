/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import React, { ReactNode, useState } from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';

export default function DefaultButton({
  children,
  style,
  ...props
}:{
  children: ReactNode
  style?: ViewStyle
} & PressableProps) {
  const [isSecond, setIsSecond] = useState<boolean>(false)
  return (
    <Pressable
      style={[{
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: isSecond ? "gray":"white",
        padding: 10
      }, style]}
      onHoverIn={() => setIsSecond(true)}
      onHoverOut={() => setIsSecond(false)}
      onPressIn={() => setIsSecond(true)}
      onPressOut={() => setIsSecond(false)}
      {...props}
    >
      {children}
    </Pressable>
  )
}