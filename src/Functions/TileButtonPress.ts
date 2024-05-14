/*
  UTTT
  Andrew Mainella
*/
import store from "../Redux/store"
import { gridStateMode } from "../Types"
import { perdictMoveGame } from "./Ai";
import { setCurrentTurn, setGridState, setIsGameOver, setSelectedGrid } from "./gameActions";

function setGameTile(original: DimentionalType, firstIndex: number, secondIndex: number, thirdIndex: number, forthIndex: number, currentTurn: gridStateMode) {
  let newValue = [...original.inner[firstIndex][secondIndex].value]
  let newValueOne = [...newValue[thirdIndex]]
  newValueOne[forthIndex] = currentTurn
  newValue[thirdIndex] = newValueOne
  let newInner = [...original.inner]
  let newInnerOne = [...original.inner[firstIndex]]
  newInnerOne[secondIndex] = {
    ...newInner[firstIndex][secondIndex],
    value: newValue
  }
  newInner[firstIndex] = newInnerOne
  return {
    ...original,
    inner: newInner
  }
}

function setActive(original: DimentionalType, firstIndex: number, secondIndex: number, active?: {
  xOne: number;
  xTwo: number;
  yOne: number;
  yTwo: number;
} | undefined) {
  let newInner = [...original.inner]
  let newInnerOne = [...original.inner[firstIndex]]
  newInnerOne[secondIndex] = {
    ...newInner[firstIndex][secondIndex],
    active
  }
  newInner[firstIndex] = newInnerOne
  return {
    ...original,
    inner: newInner
  }
}

function setValue(original: DimentionalType, firstIndex: number, secondIndex: number, value: gridStateMode) {
  let newValue = [...original.value]
  let newValueOne = [...original.value[firstIndex]]
  newValueOne[secondIndex] = value
  newValue[firstIndex] = newValueOne
  return {
    ...original,
    value: newValue
  }
}

function checkIfGameOver(gridState: DimentionalType, playerMode: gridStateMode, firstIndex: number, secondIndex: number): boolean {
  var change: boolean = false
  for(var index = 0; index < 3; index++){//Check Horizontal
    if (gridState.value[firstIndex][index] === playerMode){
      if (index === 2){
        //It's A Match
        change = true
      }
    } else {
      break
    }
  }
  for(var index = 0; index < 3; index++){//Check Vertical
    if (gridState.value[index][secondIndex] === playerMode) {
      if (index === 2){
        change = true
      } 
    } else {
      break
    } 
  }
  for(var index = 0; index < 3; index++){//Check Diagnal Left Right
    if (gridState.value[index][index] === playerMode) {
      if (index === 2){
        change = true
      }
    } else {
      break
    }
  }
  for(var index = 0; index < 3; index++){//Check Diagnal Right Left
    if (gridState.value[2-index][index] === playerMode) {
      if (index === 2){
        change = true
      }
    } else {
      break
    }
  }
  
  return change
}

export function TileButtonPress(
  firstIndex: number, 
  secondIndex: number,
  thirdIndex: number, 
  forthIndex: number,
  ai?: boolean
) {
  const onlineGameId = (store.getState().gameState.gameType === 'online') ? store.getState().gameState.gameId:undefined
  const playerMode = store.getState().gameState.currentTurn
  const newGrid = (thirdIndex === 0) ? (forthIndex === 0) ? 1:(forthIndex === 1) ? 2:3: (thirdIndex === 1) ?  (forthIndex === 0) ? 4:(forthIndex === 1) ? 5:6: (forthIndex === 0) ? 7:(forthIndex === 1) ? 8:9
  const bigTileIndex = (firstIndex === 0) ? (secondIndex === 0) ? 1:(secondIndex === 1) ? 4:7:(firstIndex === 1) ? (secondIndex === 0) ? 2:(secondIndex === 1) ? 5:8:(secondIndex === 0) ? 3:(secondIndex=== 1) ? 6:9

  var newGridState: DimentionalType = {...store.getState().gameState.data}
  const isNewGridPositionFull = newGridState.value[forthIndex][thirdIndex] === gridStateMode.O || newGridState.value[forthIndex][thirdIndex] === gridStateMode.X || newGridState.value[forthIndex][thirdIndex] === gridStateMode.Full
  //updating
  if (playerMode === gridStateMode.X || playerMode === gridStateMode.O){
    newGridState = setGameTile(newGridState, firstIndex, secondIndex, thirdIndex, forthIndex, playerMode)
    if (isNewGridPositionFull){
      setSelectedGrid(0, onlineGameId)
    } else {
      setSelectedGrid(newGrid, onlineGameId)
    }
    var change: boolean = false
    for(var index = 0; index < 3; index++){//Check Horizontal
      if (newGridState.inner[firstIndex][secondIndex].value[thirdIndex][index] === playerMode){
        if (index === 2){
          //It's A Match
          change = true
          if (forthIndex > 1){
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: 0,
              xTwo: 2,
              yOne: thirdIndex,
              yTwo: thirdIndex
            })
          } else {
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: 2,
              xTwo: 0,
              yOne: thirdIndex,
              yTwo: thirdIndex
            })
          }
        }
      } else {
        break
      }
    }
    console.log(newGridState)
    for(var index = 0; index < 3; index++){//Check Vertical
      if (newGridState.inner[firstIndex][secondIndex].value[index][forthIndex] === playerMode) {
        if (index === 2){
          change = true
          if (thirdIndex > 1){
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: forthIndex,
              xTwo: forthIndex,
              yOne: 2,
              yTwo: 0
            })
          } else {
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: forthIndex,
              xTwo: forthIndex,
              yOne: 0,
              yTwo: 2
            })
          }
        } 
      } else {
        break
      }
    }
    for(var index = 0; index < 3; index++){//Check Diagnal Left Right
      if (newGridState.inner[firstIndex][secondIndex].value[index][index] === playerMode) {
        if (index === 2){
          change = true
          if (forthIndex > 1){
            //Line moves left to right
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: 0,
              xTwo: 2,
              yOne: 0,
              yTwo: 2
            })
          } else {
            //Line moves right to left
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: 2,
              xTwo: 0,
              yOne: 2,
              yTwo: 0
            })
          }
        }
      } else {
        break
      }
    }
    for(var index = 0; index < 3; index++){//Check Diagnal Right Left
      if (newGridState.inner[firstIndex][secondIndex].value[2-index][index] === playerMode) {
        //Checking is right 
        if (index === 2){
          change = true
          newGridState = setActive(newGridState, firstIndex, secondIndex, {
            xOne: 2,
            xTwo: 0,
            yOne: 0,
            yTwo: 2
          })
        }
      } else {
        break
      }
    }

    if (!change){
      //Checks if the sqaure is full meaning the tic tac toe has ended in a draw
      for(var indexOne = 0; index < 3; index++){
        var complete = true
        for(var index = 0; index < 3; index++){
          if (newGridState.inner[firstIndex][secondIndex].value[indexOne][index] === gridStateMode.Open){
            complete = false
            break              
          }
        }
        if (!complete){
          break
        } else if (index === 2){
          change = true
          newGridState = setValue(newGridState, firstIndex, secondIndex, gridStateMode.Full)
          if (newGrid === bigTileIndex){
            setSelectedGrid(0, onlineGameId)//TO DO fix this
          }
        }
      }
      setGridState(newGridState, onlineGameId)
    } else {
      newGridState = setValue(newGridState, firstIndex, secondIndex, playerMode)
      setIsGameOver(checkIfGameOver(newGridState, playerMode, firstIndex, secondIndex), onlineGameId)
      setGridState(newGridState, onlineGameId)
      if (newGrid === bigTileIndex){
        setSelectedGrid(0, onlineGameId)
      }
    }
  }

  // Set the new plater mode
  if (playerMode === gridStateMode.O){
    setCurrentTurn(gridStateMode.X, onlineGameId)
  } else if (playerMode === gridStateMode.X) {
    setCurrentTurn(gridStateMode.O, onlineGameId)
  }

  if (store.getState().gameState.gameType === 'ai' && ai !== true) {
    console.log("HERE")
    console.log(store.getState().gameState)
    perdictMoveGame(store.getState().gameState)
  }
}
