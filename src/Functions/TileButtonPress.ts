/*
  This is a function to be called when the user picks the tile.
  When the game mode is:
  Online:
    This function will call PickTile it will then upload the current game to the server. This function will handle any errors that occur.
  Offline:
    Offline will update the game in the local storeage. This function will handle any errors that occur.
  Ai:
    Offline will update the game in the local storeage. This function will handle any errors that occur.
    Also, this function will first make a move the user makes. Then it will update the state and let the ai move. It will then finally wait for the ai to make the final move.
*/
import { perdict } from "@functions/ai/common";
import indexToGridIndex from "@functions/indexToGridIndex";
import indexToTileIndex from "@functions/indexToTileIndex";
import { updateGame } from "@functions/online";
import pickTile from "@functions/pickTile";
import { updateStorageGame } from "@functions/storageFunctions";
import { gameSlice } from "@redux/reducers/gameReducer";
import store from "@redux/store";
import { gridStateMode, loadingState } from "@types";

/**
 * 
 * @param index 
 * @param tileIndex 
 * @param gridIndex 
 * @param game 
 * @returns A state on the result of the operation
 */
export default async function tileButtonPress(
  index: number,
	tileIndex: number,
	gridIndex: number,
  game: GameType
): Promise<loadingState> {
  const pickResult = pickTile(index, tileIndex, gridIndex, game)
  if (pickResult.result !== loadingState.success) {
    return loadingState.failed
  }
  const newGame = pickResult.data

  // Update data
  if (newGame.gameType === 'online') {
    const uploadResult = await updateGame(newGame)
    if (uploadResult !== loadingState.success) {
      return loadingState.failed;
    }
  }

  if (newGame.gameType !== 'online') {
    const saveResult = await updateStorageGame(newGame)
    if (saveResult !== loadingState.success) {
      return loadingState.failed
    }
    store.dispatch(gameSlice.actions.setGame(newGame))
  }

  // Handle ai gameplay
  if (newGame.gameType === 'ai' && newGame.currentTurn === gridStateMode.o && newGame.gameOver === gridStateMode.open) {
    let outArr = [...newGame.data.inner]
    outArr[index] = gridStateMode.full
 
    const result = await perdict([...newGame.data.inner], newGame)
    const indexPre = result.findIndex((e, i) => {return e !== newGame.data.inner[i] &&  newGame.data.inner[i] !== gridStateMode.full})
    if (indexPre === -1) {
      return loadingState.failed
    }
    const aiTileIndex = indexToTileIndex(indexPre)
    const aiGridIndex = indexToGridIndex(indexPre)
    const aiResult = pickTile(indexPre, aiTileIndex, aiGridIndex, newGame)
    if (aiResult.result !== loadingState.success) {
      return loadingState.failed
    }

    const saveResult = await updateStorageGame(aiResult.data)
    if (saveResult !== loadingState.success) {
      return loadingState.failed
    }
    store.dispatch(gameSlice.actions.setGame(aiResult.data))
  }

  return loadingState.success
}