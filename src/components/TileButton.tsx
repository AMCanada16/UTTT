/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { useMemo } from "react"
import { Pressable } from "react-native"
import TextAnimation from "./TextAnimation"
import TileButtonPress from "../functions/TileButtonPress"
import { gridStateMode, loadingState } from "../Types"
import useCheckIfFilled from "../hooks/useCheckIfFilled"
import getIndex from "../functions/getIndex"
import store from "../redux/store"
import { gameSlice } from "../redux/reducers/gameReducer"

export default function TileButton(
  {tileIndex, gridIndex, currentTurn, game, gameLength}:
  {
    tileIndex: number,
    gridIndex: number,
    currentTurn: gridStateMode,
    game: GameType,
    gameLength: number
  }) {
  const index: number = useMemo(() => {return getIndex(tileIndex, gridIndex)}, [tileIndex, gridIndex])
  const value = useMemo(() => {
    if (game.data.inner.length <= index) {
      return gridStateMode.full
    }
    return game.data.inner[index]
  }, [index, game])
  const filled = useCheckIfFilled(game, index, gridIndex);

  return(
    <Pressable
      disabled={filled}
      style={{
        backgroundColor: filled ? '#5E17EB':(currentTurn === gridStateMode.o) ? '#ff9c9c':'#5ce1e6',
        width: (gameLength/3 - 16)/3,
        height: (gameLength/3 - 16)/3,
        borderRadius: (filled === false && currentTurn === gridStateMode.o) ? 99:undefined
      }}
      onPress={async () => {
        const result = await TileButtonPress(index, tileIndex, gridIndex, game)
        if (result.result === loadingState.success) {
          // dispatch the new game state
          store.dispatch(gameSlice.actions.setGame(result.data))
        }
      }}
    >
      { (value === gridStateMode.x || value === gridStateMode.o) ?
        <TextAnimation mode={(value === gridStateMode.x) ? "X":"O"} length={(gameLength/3 - 16)/3} colored={false} />:null
      }
    </Pressable>
  )
}