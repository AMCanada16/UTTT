import { useEffect, useState } from "react"
import { Pressable } from "react-native"
import TextAnimation from "./TextAnimation"
import { TileButtonPress } from "../Functions/TileButtonPress"
import store from "../Redux/store"
import { auth } from "../Firebase/Firebase"

enum gridStateMode{
  Open,
  X,
  O,
  Full
}

function checkIfFilled(firstIndex: number, secondIndex: number, thirdIndex: number, forthIndex: number) {
  const currentGame = store.getState().gameState
  const buttonGridLocation = (secondIndex === 0) ? (firstIndex === 0) ? 1:(firstIndex === 1) ? 2:3:(secondIndex === 1) ? (firstIndex === 0) ? 4:(firstIndex === 1) ? 5:6:(firstIndex === 0) ? 7:(firstIndex=== 1) ? 8:9
  const value = currentGame.data.inner[firstIndex][secondIndex].value[thirdIndex][forthIndex];
  const bigValue = currentGame.data.value[firstIndex][secondIndex];
  let uid = auth.currentUser?.uid
  if (currentGame.gameType === 'online' && uid !== undefined) {
    const currentUser = currentGame.users.find((e) => {return e.userId === uid})
    if (currentUser !== undefined && currentGame.currentTurn !== currentUser.player) {
      return true
    }
  }
  if (value === gridStateMode.O || value === gridStateMode.X || bigValue === gridStateMode.O || bigValue === gridStateMode.X) {
    return true
  }
  if (currentGame.selectedGrid === 0) {
    return false
  }
  if (buttonGridLocation === currentGame.selectedGrid) {
    return false
  }
  return true
}

function useCheckIfFilled(
  firstIndex: number, 
  secondIndex: number,
  thirdIndex: number, 
  forthIndex: number
) {
  const [filled, setFilled] = useState<boolean>(false)
  useEffect(() => {
    setFilled(checkIfFilled(firstIndex, secondIndex, thirdIndex, forthIndex))
    const unsubscribe = store.subscribe(() => {
      setFilled(checkIfFilled(firstIndex, secondIndex, thirdIndex, forthIndex))
    })
    return () => {
      unsubscribe()
    }
  }, [])
  return filled
}

export default function TileButton(
  {firstIndex, secondIndex, thirdIndex, forthIndex, value, currentTurn}:
  {
    value: gridStateMode,
    firstIndex: number, 
    secondIndex: number,
    thirdIndex: number, 
    forthIndex: number,
    currentTurn: gridStateMode
  }) {
  //Second index row, first index column
  const [length, setLength] = useState(0)
  const filled = useCheckIfFilled(firstIndex, secondIndex, thirdIndex, forthIndex);

  return(
    <Pressable disabled={filled} style={{
      backgroundColor: filled ? '#5E17EB':(currentTurn === gridStateMode.O) ? '#ff9c9c':'#5ce1e6',
      width: '100%',
      height: '100%',
      borderRadius: (filled === false && currentTurn === gridStateMode.O) ? 99:undefined
    }}
    onPress={() => {
      TileButtonPress(firstIndex, secondIndex, thirdIndex, forthIndex)
    }}
    onLayout={(e) => {setLength(e.nativeEvent.layout.height)}}
    >
      { (value === gridStateMode.X || value === gridStateMode.O) ?
        <TextAnimation mode={(value === gridStateMode.X) ? "X":"O"} length={length} colored={false} />:null
      }
    </Pressable>
  )
}