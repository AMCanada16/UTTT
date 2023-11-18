import { StyleProp, ViewStyle } from "react-native";
import Svg, { G, Path, Rect, Shape, SvgProps } from "react-native-svg";

type iconProps = {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle> | undefined;
  props?: Shape<SvgProps> | undefined;
};

interface colorIconProps extends iconProps {
  color?: string | undefined;
}

export function CloseIcon({ width, height, style }: iconProps) {
  return (
    <Svg
      width={width}
      height={height}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
    >
      <G>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
          fill="#0F1729"
        />
      </G>
    </Svg>
  );
}

export function CircleIcon({ width, height, style, color }: colorIconProps) {
  return (
    <Svg width={width} height={height} style={style} fill={color ? color:"#000000"} id="Capa_1" viewBox="-2.62 -2.62 34.35 34.35" stroke={color ? color:"#000000"} strokeWidth="2.9107">
      <G id="c149_moon">
        <Path id="_x3C_Compound_Path_x3E__7_" d="M14.558,2.079c6.877,0,12.471,5.597,12.471,12.473c0,6.877-5.594,12.476-12.471,12.476 c-6.879,0-12.478-5.599-12.478-12.476C2.08,7.676,7.679,2.079,14.558,2.079 M14.558,0C6.563,0,0,6.562,0,14.552 c0,7.995,6.563,14.555,14.558,14.555s14.549-6.56,14.549-14.555C29.106,6.562,22.552,0,14.558,0L14.558,0z"/>
      </G>
    </Svg>
  )
}

export function XIcon({ width, height, style, color }: colorIconProps) {
  return (
    <Svg width={width} height={height} style={style} viewBox="0 0 1024 1024" fill={color ? color:"#000000"}>
      <G id="SVGRepo_iconCarrier">
        <Path fill={color ? color:"#000000"} d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/>
      </G>
    </Svg>
  )
}
//#5ce1e6

export function ChevronLeft({ width, height, style }: iconProps) {
  return (
    <Svg width={width} height={height} style={style} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_iconCarrier">
        <Path fillRule="evenodd" clipRule="evenodd" d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z" fill="#000000" />
      </G>
    </Svg>
  )
}

export function ResetIcon({ width, height, style }:iconProps) {
  return (
    <Svg width={width} height={height} style={style} viewBox="0 0 21 21" fill={"#000000"}>
      <G id="SVGRepo_iconCarrier">
        <G fill="none" fillRule="evenodd" stroke={"#000000"} strokeLinecap="round" strokeLinejoin="round" transform="translate(2 2)">
          <Path d="m4.5 1.5c-2.4138473 1.37729434-4 4.02194088-4 7 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/>
          <Path d="m4.5 5.5v-4h-4"/>
        </G>
      </G>
    </Svg>
  )
}

export function CopyIcon({ width, height, style }:iconProps) {
  return (
    <Svg width={width} height={height} style={style} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_iconCarrier">
        <Path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="#292D32"/>
        <Path d="M17.0998 2H12.8998C9.81668 2 8.37074 3.09409 8.06951 5.73901C8.00649 6.29235 8.46476 6.75 9.02167 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V14.9781C17.2498 15.535 17.7074 15.9933 18.2608 15.9303C20.9057 15.629 21.9998 14.1831 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z" fill="#292D32"/>
      </G>
    </Svg>
  )
}

export function CopiedIcon({ width, height, style }:iconProps) {
  return (
    <Svg width={width} height={height} style={style} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_iconCarrier">
        <Path d="M17.0998 2H12.8998C9.81668 2 8.37074 3.09409 8.06951 5.73901C8.00649 6.29235 8.46476 6.75 9.02167 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V14.9781C17.2498 15.535 17.7074 15.9933 18.2608 15.9303C20.9057 15.629 21.9998 14.1831 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z" fill="#292D32"/>
        <Path d="M11.1 8H6.9C3.4 8 2 9.4 2 12.9V17.1C2 20.6 3.4 22 6.9 22H11.1C14.6 22 16 20.6 16 17.1V12.9C16 9.4 14.6 8 11.1 8ZM12.29 13.65L8.58 17.36C8.44 17.5 8.26 17.57 8.07 17.57C7.88 17.57 7.7 17.5 7.56 17.36L5.7 15.5C5.42 15.22 5.42 14.77 5.7 14.49C5.98 14.21 6.43 14.21 6.71 14.49L8.06 15.84L11.27 12.63C11.55 12.35 12 12.35 12.28 12.63C12.56 12.91 12.57 13.37 12.29 13.65Z" fill="#292D32"/>
      </G>
    </Svg>
  )
}