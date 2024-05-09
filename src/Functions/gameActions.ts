/*
  UTTT
  Andrew Mainella
  25 April 2024
*/
import { doc, updateDoc } from "firebase/firestore";
import { gameSlice } from "../Redux/reducers/gameReducer";
import store from "../Redux/store";
import { db } from "../Firebase/Firebase";
import { gridStateMode } from "../Types";
import { getDatafromDimentionalGrid } from "./OnlineFunctions";

/**
 * Set the selected grid of the game
 * @param selectedGrid the new selected grid
 * @param gameId The id of the *ONLINE* game. Only pass for online.
 */
export function setSelectedGrid(selectedGrid: number, gameId?: string) {
  if (gameId !== undefined) {
    let ref = doc(db, "Games", gameId)
    updateDoc(ref, {
      selectedGrid: selectedGrid
    })
  } else {
    store.dispatch(gameSlice.actions.setSelectedGrid(selectedGrid))
  }
}

/**
 * Set if the game is over.
 * The new value of game over
 * @param isGameOver The new value of if the game is over.
 * @param gameId The id of the *ONLINE* game. Only pass for online.
 */
export function setIsGameOver(isGameOver: boolean, gameId?: string) {
  if (gameId !== undefined) {
    updateDoc(doc(db, "Games", gameId), {
      gameOver: isGameOver
    })
  } else {
    store.dispatch(gameSlice.actions.setIsGameOver(isGameOver))
  }
}

/**
 * Set the grid state the game
 * @param gridState the new grid state
 * @param gameId The id of the *ONLINE* game. Only pass for online.
 */
export function setGridState(gridState: DimentionalType, gameId?: string) {
  if (gameId !== undefined) {
    const firebaseData = getDatafromDimentionalGrid(gridState)
    updateDoc(doc(db, "Games", gameId), {
      gameStateValue: firebaseData.activeValues,
      gameStateInner: firebaseData.innerValues,
      gameStateActive: firebaseData.innerValueActive
    })
  } else {
    store.dispatch(gameSlice.actions.setGameState(gridState))
  }
}

/**
 * Set the turn of the game
 * @param turn the new turn
 * @param gameId The id of the *ONLINE* game. Only pass for online.
 */
export function setCurrentTurn(turn: gridStateMode, gameId?: string) {
  if (gameId !== undefined) {
    updateDoc(doc(db, "Games", gameId), {
      currentTurn: turn
    })
  } else {
    store.dispatch(gameSlice.actions.setCurrentTurn(turn))
  }
}