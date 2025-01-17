/*
  UTTT
  Andrew Mainella
  September 2024
*/
import { auth } from "@functions/firebase"
import { gridStateMode } from "@types"

/**
 * Returns tue if the tile is filled meaning it is not open.
 * @param game The current game state
 * @param index The index of the tile to be checked
 * @returns a boolean
 */
export default function checkIfFilled(game: GameType, index: number, gridIndex: number, ai?: boolean) {
  const value = game.data.inner[index]
  const bigValue = game.data.value[gridIndex]
  let uid = auth.currentUser?.uid
  if (game.gameType === 'online' && uid !== undefined) {
    const currentUser = game.users.find((e) => {return e.userId === uid})
    if (currentUser !== undefined && game.currentTurn !== currentUser.player) {
      // It is the other users turn
      return true
    }
  }
  if (game.gameType === 'ai' && game.currentTurn === gridStateMode.o && ai !== true) {
    // It is currently the ais turn
    return true
  }
  if (value === gridStateMode.o || value === gridStateMode.x || bigValue === gridStateMode.x || bigValue === gridStateMode.o) {
    // The tile or grid zone is already filled
    return true
  }
  if (game.selectedGrid === 0) {
    // There is no constaint on the selected grid
    return false
  }
  if ((gridIndex + 1) === game.selectedGrid) {
    // The selected grid is the same as the current grid
    return false
  }
  return true
}