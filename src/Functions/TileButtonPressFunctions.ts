import { gridStateMode } from "../Types"

/**
 * A function that checks to see if the game of tic tac toe has been won or lost
 * @remarks This does not check if the game is draw.
 * @param gridState The current state of the game
 * @param playerMode The current gridStateMode of the player (This would be x or o)
 * @param firstIndex The row of where the change has been made in the tic tac toe game
 * @param secondIndex The column of where the change has been made in the tic tac toe game
 * @returns a gridStateMode of the tic tac toe game at the provided row and column
 */
export function checkIfGameOver(gridState: gridStateMode[][], playerMode: gridStateMode, firstIndex: number, secondIndex: number): gridStateMode{
  var change: boolean = false
  for(var index = 0; index < 3; index++){//Check Horizontal
    if (gridState[firstIndex][index] === playerMode){
      if (index === 2){
        //It's A Match
        change = true
      }
    } else {
      break
    }
  }
  for(var index = 0; index < 3; index++){//Check Vertical
    if (gridState[index][secondIndex] === playerMode) {
      if (index === 2){
        change = true
      } 
    } else {
      break
    } 
  }
  for(var index = 0; index < 3; index++){//Check Diagnal Left Right
    if (gridState[index][index] === playerMode) {
      if (index === 2){
        change = true
      }
    } else {
      break
    }
  }
  for(var index = 0; index < 3; index++){//Check Diagnal Right Left
    if (gridState[2-index][index] === playerMode) {
      if (index === 2){
        change = true
      }
    } else {
      break
    }
  }
  
  if (change) {
    return playerMode
  }
  return gridStateMode.Open
}