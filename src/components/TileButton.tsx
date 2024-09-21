/*
  UTTT
  Andrew Mainella
*/
import { useMemo, useState } from "react"
import { Pressable } from "react-native"
import TextAnimation from "./TextAnimation"
import TileButtonPress from "../functions/TileButtonPress"
import { gridStateMode } from "../Types"
import useCheckIfFilled from "../hooks/useCheckIfFilled"
import getIndex from "../functions/getIndex"

export default function TileButton(
  {tileIndex, gridIndex, currentTurn, game}:
  {
    tileIndex: number,
    gridIndex: number,
    currentTurn: gridStateMode,
    game: GameType
  }) {
  //Second index row, first index column
  const [length, setLength] = useState(0)
  const index: number = useMemo(() => {return getIndex(tileIndex, gridIndex)}, [tileIndex, gridIndex])
  const value = useMemo(() => {
    if (game.data.inner.length <= index) {
      return gridStateMode.full
    }
    return game.data.inner[index]
  }, [index])
  const filled = useCheckIfFilled(game, index, gridIndex);

  return(
    <Pressable disabled={filled} style={{
      backgroundColor: filled ? '#5E17EB':(currentTurn === gridStateMode.o) ? '#ff9c9c':'#5ce1e6',
      width: '100%',
      height: '100%',
      borderRadius: (filled === false && currentTurn === gridStateMode.o) ? 99:undefined
    }}
    onPress={() => {
      TileButtonPress(index, index, gridIndex, game)
    }}
    onLayout={(e) => {setLength(e.nativeEvent.layout.height)}}
    >
      { (value === gridStateMode.x || value === gridStateMode.o) ?
        <TextAnimation mode={(value === gridStateMode.x) ? "X":"O"} length={length} colored={false} />:null
      }
    </Pressable>
  )
}