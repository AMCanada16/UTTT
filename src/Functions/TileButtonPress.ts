import { gridStateSlice } from "../Redux/reducers/gridStateReducer";
import { playerModeSlice } from "../Redux/reducers/playerModeReducer";
import { selectedGridSlice } from "../Redux/reducers/selectedGridReducer";
import store from "../Redux/store"
import { gridStateMode } from "../Types"

function checkIfGameOver(gridState: DimentionalType): boolean {
  var change: boolean = false
  for(var playerMode = 1; playerMode < 3; playerMode++){
    for(var index = 0; index < 3; index++){//Check Horizontal
      for(var indexIn = 0; indexIn < 3; indexIn++){//Check Horizontal
        if (gridState.value[index][indexIn] === playerMode){
          if (index === 2){
            //It's A Match
            change = true
          }
        } else {
          break
        }
      }
    }
    for(var index = 0; index < 3; index++){//Check Vertical
      for(var indexIn = 0; indexIn < 3; indexIn++){//Check Vertical
        if (gridState.value[indexIn][index] === playerMode) {
          if (index === 2){
            change = true
          } 
        } else {
          break
        }
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
  }
  console.log("The game is over return", change)
  return change
}

export function TileButtonPress(
  firstIndex: number, 
  secondIndex: number,
  thirdIndex: number, 
  forthIndex: number,
): boolean {
  var returningGameOver: boolean = false
  const playerMode = store.getState().playerMode;
  const newGrid = (thirdIndex === 0) ? (forthIndex === 0) ? 1:(forthIndex === 1) ? 2:3: (thirdIndex === 1) ?  (forthIndex === 0) ? 4:(forthIndex === 1) ? 5:6: (forthIndex === 0) ? 7:(forthIndex === 1) ? 8:9
  const bigTileIndex = (firstIndex === 0) ? (secondIndex === 0) ? 1:(secondIndex === 1) ? 4:7:(firstIndex === 1) ? (secondIndex === 0) ? 2:(secondIndex === 1) ? 5:8:(secondIndex === 0) ? 3:(secondIndex=== 1) ? 6:9

  let newGridState: DimentionalType = JSON.parse(JSON.stringify(store.getState().gridState));
  const isNewGridPositionFull = store.getState().gridState.value[forthIndex][thirdIndex] === gridStateMode.O || store.getState().gridState.value[forthIndex][thirdIndex] === gridStateMode.X || store.getState().gridState.value[forthIndex][thirdIndex] === gridStateMode.Full
  if (playerMode === gridStateMode.X){
    newGridState.inner[firstIndex][secondIndex].value[thirdIndex][forthIndex] = gridStateMode.X
    if (isNewGridPositionFull){
      store.dispatch(selectedGridSlice.actions.setSelectedGrid(0))
    } else {
      store.dispatch(selectedGridSlice.actions.setSelectedGrid(newGrid))
    }
  } else if (playerMode === gridStateMode.O) {
    let newInner = JSON.parse(JSON.stringify(newGridState.inner));
    newInner[firstIndex][secondIndex].value[thirdIndex][forthIndex] = gridStateMode.O
    newGridState = {...newGridState, inner: newInner}
    if (isNewGridPositionFull){
      store.dispatch(selectedGridSlice.actions.setSelectedGrid(0))
    } else {
      store.dispatch(selectedGridSlice.actions.setSelectedGrid(newGrid))
    }
  }
  if (playerMode === gridStateMode.X || playerMode === gridStateMode.O){
    var change: boolean = false
    for(var index = 0; index < 3; index++){//Check Horizontal
      if (newGridState.inner[firstIndex][secondIndex].value[thirdIndex][index] === playerMode){
        if (index === 2){
            //It's A Match
            let newInner = JSON.parse(JSON.stringify(newGridState.inner));
            change = true
            if (forthIndex > 1){
              newInner[firstIndex][secondIndex].active = {
                xOne: 0,
                xTwo: 2,
                yOne: thirdIndex,
                yTwo: thirdIndex
              }
            } else {
              console.log(newInner, firstIndex, secondIndex)
              newInner[firstIndex][secondIndex].active = {
                xOne: 2,
                xTwo: 0,
                yOne: thirdIndex,
                yTwo: thirdIndex
              }
            }
            newGridState = {...newGridState, inner: newInner}
          }
      } else {
        break
      }
    }
    for(var index = 0; index < 3; index++){//Check Vertical
      if (newGridState.inner[firstIndex][secondIndex].value[index][forthIndex] === playerMode) {
        if (index === 2){
          change = true

          if (thirdIndex > 1){
            newGridState.inner[firstIndex][secondIndex].active = {
              xOne: forthIndex,
              xTwo: forthIndex,
              yOne: 2,
              yTwo: 0
            }
          } else {
            newGridState.inner[firstIndex][secondIndex].active = {
              xOne: forthIndex,
              xTwo: forthIndex,
              yOne: 0,
              yTwo: 2
            }
          }
        } 
      } else {
        break
      }
    }
    for(var index = 0; index < 3; index++){//Check Diagnal Left Right
      if (newGridState.inner[firstIndex][secondIndex].value[index][index] === playerMode) {
        console.log("something works", index)
        if (index === 2){
          change = true
          if (forthIndex > 1){
            newGridState.inner[firstIndex][secondIndex].active = {
              xOne: 0,
              xTwo: 2,
              yOne: 2,
              yTwo: 0
            }
          } else {
            newGridState.inner[firstIndex][secondIndex].active = {
              xOne: 2,
              xTwo: 0,
              yOne: 0,
              yTwo: 2
            }
          }
        } else {
          
          break
        }
      }
    }
    for(var index = 0; index < 3; index++){//Check Diagnal Right Left
      if (newGridState.inner[firstIndex][secondIndex].value[2-index][index] === playerMode) {
        if (index === 2){
          change = true
          if (forthIndex > 1){
            newGridState.inner[firstIndex][secondIndex].active = {
              xOne: 2,
              xTwo: 0,
              yOne: 0,
              yTwo: 2
            }
          } else {
            newGridState.inner[firstIndex][secondIndex].active = {
              xOne: 0,
              xTwo: 2,
              yOne: 0,
              yTwo: 2
            }
          }
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
          newGridState.value[firstIndex][secondIndex] = gridStateMode.Full
          if (newGrid === bigTileIndex){
            store.dispatch(selectedGridSlice.actions.setSelectedGrid(0)) //TO DO fix this
          }
        }
      }
      store.dispatch(gridStateSlice.actions.setGridState(newGridState))
    } else {
      newGridState.value[firstIndex][secondIndex] = playerMode
      const isGameOver = checkIfGameOver(newGridState)
      if (isGameOver){
        returningGameOver = true
      }
      store.dispatch(gridStateSlice.actions.setGridState(newGridState))
      if (newGrid === bigTileIndex){
        store.dispatch(selectedGridSlice.actions.setSelectedGrid(0))
      }
    }
  }
  if (playerMode === gridStateMode.O){
    store.dispatch(playerModeSlice.actions.setPlayerMode(gridStateMode.X))
  //  console.log("Done", newGridState, "X")
  } else if (playerMode === gridStateMode.X) {
    store.dispatch(playerModeSlice.actions.setPlayerMode(gridStateMode.O))
  // console.log("Done", newGridState, "O")
  }
  return returningGameOver
}