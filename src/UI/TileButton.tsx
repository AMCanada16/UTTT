import { useState } from "react"
import { StyleSheet, Pressable } from "react-native"
import TextAnimation from "./TextAnimation"
import { TileButtonPress } from "../Functions/TileButtonPress"
import store from "../Redux/store"

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
  return(
    <Pressable disabled={filled} style={filled ?  styles.tileButtonsFilledStyle:styles.tileButtonOpenStyle}
    onPress={() => {
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    margin: "auto"
  },
  tileButtonContainerStyle: {
    height: "auto",
    aspectRatio: "1/1",
    width: "32%",
    backgroundColor: "blue",
    margin: "1%"
  },
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
  tileTextStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: "auto"
  },
  dimentionTileText: {
    fontSize: 250,
    zIndex: 100
  },
  dimentionTileContainer: {
    position: "absolute",
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: "auto",
    aspectRatio: "1/1",
    margin:"auto",
    zIndex: 100
  },
  firstRow: {
    flexDirection: "row",
    width: "90%"
  },
  firstCol: {
    margin: "1%",
    height: "100%",
    width: "32%"
  },
  firstColFirstIndex: {
    marginTop: "1%",
    marginRight: "1%",
    height: "100%",
    width: "32%"
  },
  secondCol: {
    paddingBottom: 5,
    flex: 1
  },
  secondRow: {
    flexDirection: "row",
    height: "33.3%"
  }
});