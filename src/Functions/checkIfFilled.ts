import { auth } from "../firebase"
import store from "../redux/store"
import { gridStateMode } from "../Types"

/**
 * @param index
 * @returns 
 */
export default function checkIfFilled(game: GameType, index: number, gridIndex: number) {
  const currentGame = store.getState().gameState
  const value = game.data.inner[index]
  const bigValue = currentGame.data.value[gridIndex]
  let uid = auth.currentUser?.uid
  if (currentGame.gameType === 'online' && uid !== undefined) {
    const currentUser = currentGame.users.find((e) => {return e.userId === uid})
    if (currentUser !== undefined && currentGame.currentTurn !== currentUser.player) {
      // It is the other users turn
      return true
    }
  }
  if (currentGame.gameType === 'ai' && currentGame.currentTurn === gridStateMode.o) {
    // It is currently the ais turn
    return true
  }
  if (value === gridStateMode.o || value === gridStateMode.x || bigValue === gridStateMode.x || bigValue === gridStateMode.o) {
    // The tile or grid zone is already filled
    return true
  }
  if (currentGame.selectedGrid === 0) {
    // There is no constaint on the selected grid
    return false
  }
  if ((gridIndex + 1) === currentGame.selectedGrid) {
    // The selected grid is the same as the current grid
    return false
  }
  return true
}