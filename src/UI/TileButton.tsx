import { useEffect, useState } from "react"
import { StyleSheet, Pressable } from "react-native"
import TextAnimation from "./TextAnimation"
import { TileButtonPress } from "../Functions/TileButtonPress"
import store, { RootState } from "../Redux/store"
import { useSelector } from "react-redux"

enum gridStateMode{
  Open,
  X,
  O,
  Full
}

function checkIfFilled(firstIndex: number, secondIndex: number, thirdIndex: number, forthIndex: number) {
  const buttonGridLocation = (secondIndex === 0) ? (firstIndex === 0) ? 1:(firstIndex === 1) ? 2:3:(secondIndex === 1) ? (firstIndex === 0) ? 4:(firstIndex === 1) ? 5:6:(firstIndex === 0) ? 7:(firstIndex=== 1) ? 8:9
  const value = store.getState().gridState.inner[firstIndex][secondIndex].value[thirdIndex][forthIndex];
  const bigValue = store.getState().gridState.value[firstIndex][secondIndex];
  if (value === gridStateMode.O || value === gridStateMode.X || bigValue === gridStateMode.O || bigValue === gridStateMode.X) {
    return true
  }
  if (store.getState().selectedGrid === 0) {
    return false
  }
  if (buttonGridLocation === store.getState().selectedGrid) {
    return false
  }
  return true
}

export default function TileButton(
  {firstIndex, secondIndex, thirdIndex, forthIndex, value}:
  {
    value: string,
    firstIndex: number, 
    secondIndex: number,
    thirdIndex: number, 
    forthIndex: number, 
  }) {
  //Second index row, first index column
  const [length, setLength] = useState(0)
  const filled = checkIfFilled(firstIndex, secondIndex, thirdIndex, forthIndex);
  const playerMode = useSelector((state: RootState) => state.playerMode)

  useEffect(() => {
    console.log(playerMode, filled, filled === false && playerMode === gridStateMode.O)
  }, [playerMode, filled])
  
  return(
    <Pressable disabled={filled} style={{
      backgroundColor: filled ? '':(playerMode === gridStateMode.O) ? '#ff9c9c':'#5ce1e6',
      width: '100%',
      height: '100%',
      borderRadius: (filled === false && playerMode === gridStateMode.O) ? 99:undefined
    }}
    onPress={() => {
      console.log(firstIndex, secondIndex)
      TileButtonPress(firstIndex, secondIndex, thirdIndex, forthIndex)
    }}
    onLayout={(e) => {setLength(e.nativeEvent.layout.height)}}
    >
      { (value === "X" || value === "O") ?
        <TextAnimation mode={(value === "X") ? "X":"O"} length={length} colored={false} />:null
      }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tileButtonOpenStyle: {
    height: "100%",
    width: "auto",
    aspectRatio: "1/1",
    backgroundColor: "blue"
  },
  tileButtonsFilledStyle: {
    height: "100%",
    width: "100%",
    backgroundColor: "gray",
  },
});