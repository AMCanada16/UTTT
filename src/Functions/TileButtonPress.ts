/*
  UTTT
  Andrew Mainella
*/
import { gridStateMode, loadingState } from "../Types"
import { setGameOver} from "./gameActions";

function getLRBaseIndex(index: number) {
	return index - (index % 27) + ((Math.floor((index % 9)/3.0)) * 3)
}


export default function TileButtonPress(
  index: number,
	tileIndex: number,
	gridIndex: number,
  game: GameType
): {
  result: loadingState.failed
} | {
  result: loadingState.success;
  data: GameType;
} {
  var newGame = game
  // check if the game is current
  if (game.gameOver != gridStateMode.open) {
    return  {
      result: loadingState.failed
    }
  }
  // define the default variables used
  let currentTurn = game.currentTurn

  //update the data
  if (currentTurn == gridStateMode.x || currentTurn == gridStateMode.o){
    newGame.data.inner[index] = currentTurn
    
    // A boolean if a square has become x or o (if so we need to check for win)
    var change: boolean = false
    
    //Check Horizontal
    for (let x = 0; x < 3; x += 1) {
      let baseIndex = index - (index % 3)
      let check = newGame.data.inner[baseIndex]
      if (newGame.data.inner[baseIndex + x] != check) {
        break
      }
      if (x == 2) {
        change = true
        let secondIndex: number = Math.floor(index/27.0)
        let y: number = Math.floor(index/9.0) - (secondIndex * 3)

        newGame.data.value[gridIndex] = currentTurn
        newGame.data.active = [...newGame.data.active,
          {
            xOne: 0,
            xTwo: 2,
            yOne: y,
            yTwo: y,
            gridIndex
          }]
        // TODO handle active
      }
    }
    
    //Check Vertical
    for (let y = 0; y < 3; y += 1) {
      //		The index - Anything above it in it's row
      let baseIndex = index - (Math.floor((index % 27)/9.0) * 9)
      let check = newGame.data.inner[baseIndex]
      // TODO fit bottom
      if (newGame.data.inner[baseIndex + (y * 9)] != check) {
        break
      }
      if (y == 2) {
        // TODO handle active
        change = true
        let secondIndex: number = Math.floor(index/27.0)
        let xPos: number = (index % 3)

        newGame.data.value[gridIndex] = currentTurn
        newGame.data.active = [...newGame.data.active,
          {
            xOne: xPos,
            xTwo: xPos,
            yOne: 0,
            yTwo: 2,
            gridIndex
        }]
      }
    }
    
    //Check Diagnal Left Right
    let lrBaseIndex = getLRBaseIndex(index)
    if (newGame.data.inner[lrBaseIndex] == newGame.data.inner[lrBaseIndex + 10] && newGame.data.inner[lrBaseIndex + 10] == newGame.data.inner[lrBaseIndex + 20] && newGame.data.inner[lrBaseIndex] != gridStateMode.open) {
      change = true
      newGame.data.value[gridIndex] = currentTurn
      newGame.data.active = [...newGame.data.active,
        {
          xOne: 0,
          xTwo: 2,
          yOne: 0,
          yTwo: 2,
          gridIndex
        }]
    }
    
    //Check Diagnal Right Left
    let rlBaseIndex = getLRBaseIndex(index) + 2
    if (newGame.data.inner[rlBaseIndex] == newGame.data.inner[rlBaseIndex + 8] && newGame.data.inner[rlBaseIndex + 8] == newGame.data.inner[rlBaseIndex + 16] && newGame.data.inner[rlBaseIndex] != gridStateMode.open) {
      change = true
      newGame.data.value[gridIndex] = currentTurn
      newGame.data.active = [...newGame.data.active,
        {
          xOne: 2,
          xTwo: 0,
          yOne: 2,
          yTwo: 0,
          gridIndex
        }]
    }
    if (!change){
      //Checks if the sqaure is full meaning the tic tac toe has ended in a draw
      var full = true
      // This is the index in the top left of the square
      let lrIndex = getLRBaseIndex(index)
      for (let x = 0; x < 3; x += 1) {
        for (let y = 0; y < 3; y += 1){
          if (newGame.data.inner[(lrIndex + x) + (y * 9)] == gridStateMode.open) {
            full = false
            break
          }
        }
        if (!full) {
          break
        }
      }
      if (full) {
        newGame.data.value[tileIndex] = gridStateMode.full
        change = true
      }
    }
    if (change) {
      var isGameOver = false
      /*
        GridIndex
        | 0 1 2 | rowIndex 0
        | 3 4 5 | rowIndex 1
        | 6 7 8 | rowIndex 2
        --------
          0 1 2
        Columns
        
      */
      let rowIndex = Math.floor(gridIndex/3.0)
      let columnIndex = gridIndex % 3
      
      // Check full game horizontal
      for (let x = 0; x < 3; x += 1) {
        if (newGame.data.value[(rowIndex * 3) + x] != newGame.data.value[(rowIndex * 3)]) {
          break
        }
        if (x == 2) {
          isGameOver = true
        }
      }
      
      // Check full game vert
      for (let y = 0; y < 3; y += 1) {
        if (newGame.data.value[(y * 3) + columnIndex] != newGame.data.value[(y * 3) + columnIndex]) {
          break
        }
        if (y == 2) {
          isGameOver = true
        }
      }
      
      // Check full game left right
      if (newGame.data.value[0] == newGame.data.value[4] && newGame.data.value[4] == newGame.data.value[8] && newGame.data.value[8] != gridStateMode.open) {
        isGameOver = true
      }
      
      // Check full game right left
      if (newGame.data.value[2] == newGame.data.value[4] && newGame.data.value[4] == newGame.data.value[6] && newGame.data.value[6] != gridStateMode.open) {
        isGameOver = true
      }
      
      // is full game full?
      var full = true
      for (let x = 0; x < 3; x += 1) {
        for (let y = 0; y < 3; y += 1) {
          if (newGame.data.value[x + (y * 3)] == gridStateMode.open) {
            full = false
            break
          }
        }
        if (!full) {
          break
        }
      }
      
      if (full) {
        newGame.gameOver = gridStateMode.full
      }
      
      if (isGameOver) {
        //setGameOver(currentTurn, newGame) TODO fix
      }
    }
  }
  
  if (newGame.data.value[tileIndex] != gridStateMode.open) {
    newGame.selectedGrid = 0
  } else {
    newGame.selectedGrid = tileIndex
  }

  // Set the new plater mode
  if (currentTurn == gridStateMode.o){
    newGame.currentTurn = gridStateMode.x
  } else if (currentTurn == gridStateMode.x) {
    newGame.currentTurn = gridStateMode.o
  }
  return {
    result: loadingState.success,
    data: newGame
  }
}