import { useEffect, useState } from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import TextAnimation from "./TextAnimation"


enum gridStateMode{
  Open,
  X,
  O,
  Full
}

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

export default function TileButton(
    {playerMode, firstIndex, secondIndex, thirdIndex, forthIndex, onSetGridState, gridState, onSetPlayerMode, selectedGrid, onSetSelectedGrid, value, onGameOver}:
    {
      value: string,
      playerMode: gridStateMode, 
      firstIndex: number, 
      secondIndex: number,
      thirdIndex: number, 
      forthIndex: number, 
      onSetGridState: (item: DimentionalType) => void, 
      gridState: DimentionalType, 
      selectedGrid: number,
      onSetSelectedGrid: (item: number) => void, 
      onSetPlayerMode: (item: gridStateMode) => void,
      onGameOver: () => void
    }) {
    //Second index row, first index column
    const [length, setLength] = useState(0)
    const bigTileIndex = (firstIndex === 0) ? (secondIndex === 0) ? 1:(secondIndex === 1) ? 4:7:(firstIndex === 1) ? (secondIndex === 0) ? 2:(secondIndex === 1) ? 5:8:(secondIndex === 0) ? 3:(secondIndex=== 1) ? 6:9
    const buttonGridLocation = (secondIndex === 0) ? (firstIndex === 0) ? 1:(firstIndex === 1) ? 2:3:(secondIndex === 1) ? (firstIndex === 0) ? 4:(firstIndex === 1) ? 5:6:(firstIndex === 0) ? 7:(firstIndex=== 1) ? 8:9
    const newGrid = (thirdIndex === 0) ? (forthIndex === 0) ? 1:(forthIndex === 1) ? 2:3: (thirdIndex === 1) ?  (forthIndex === 0) ? 4:(forthIndex === 1) ? 5:6: (forthIndex === 0) ? 7:(forthIndex === 1) ? 8:9
    const filled = (gridState.inner[firstIndex][secondIndex].value[thirdIndex][forthIndex] === gridStateMode.O || gridState.inner[firstIndex][secondIndex].value[thirdIndex][forthIndex] === gridStateMode.X || gridState.value[firstIndex][secondIndex] === gridStateMode.O || gridState.value[firstIndex][secondIndex] === gridStateMode.X) ? true:(selectedGrid === 0) ? false:!(buttonGridLocation === selectedGrid)
    return(
      <TouchableOpacity disabled={filled} style={filled ?  styles.tileButtonsFilledStyle:styles.tileButtonOpenStyle}
      onPress={() => {
        var newGridState: DimentionalType = gridState
        const isNewGridPositionFull = gridState.value[forthIndex][thirdIndex] === gridStateMode.O || gridState.value[forthIndex][thirdIndex] === gridStateMode.X || gridState.value[forthIndex][thirdIndex] === gridStateMode.Full
        if (playerMode === gridStateMode.X){
          newGridState.inner[firstIndex][secondIndex].value[thirdIndex][forthIndex] = gridStateMode.X
          if (isNewGridPositionFull){
            onSetSelectedGrid(0)
          } else {
            onSetSelectedGrid(newGrid)
          }
        } else if (playerMode === gridStateMode.O) {
          newGridState.inner[firstIndex][secondIndex].value[thirdIndex][forthIndex] = gridStateMode.O
          if (isNewGridPositionFull){
            onSetSelectedGrid(0)
          } else {
            onSetSelectedGrid(newGrid)
          }
        }
        if (playerMode === gridStateMode.X || playerMode === gridStateMode.O){
          var change: boolean = false
          for(var index = 0; index < 3; index++){//Check Horizontal
            if (newGridState.inner[firstIndex][secondIndex].value[thirdIndex][index] === playerMode){
              if (index === 2){
                //It's A Match
                change = true
                if (forthIndex > 1){
                  newGridState.inner[firstIndex][secondIndex].active = {
                    xOne: 0,
                    xTwo: 2,
                    yOne: thirdIndex,
                    yTwo: thirdIndex
                  }
                } else {
                  newGridState.inner[firstIndex][secondIndex].active = {
                    xOne: 2,
                    xTwo: 0,
                    yOne: thirdIndex,
                    yTwo: thirdIndex
                  }
                }
              }
            } else {
              break
            }
          }
          for(var index = 0; index < 3; index++){//Check Vertical
            if (newGridState.inner[firstIndex][secondIndex].value[index][forthIndex] === playerMode) {
              if (index === 2){
                change = true
  
                // newGridState.inner[firstIndex][secondIndex].active = {
                //   xOne: 
                // }
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
                    onSetSelectedGrid(0) //TO DO fix this
                }
              }
            }
            onSetGridState(newGridState)
          } else {
            console.log("This code was ran")
            newGridState.value[firstIndex][secondIndex] = playerMode
            const isGameOver = checkIfGameOver(newGridState)
            if (isGameOver){
                onGameOver()
            }
            onSetGridState(newGridState)
            if (newGrid === bigTileIndex){
              onSetSelectedGrid(0)
            }
          }
        }
        if (playerMode === gridStateMode.O){
          onSetPlayerMode(gridStateMode.X)
        //  console.log("Done", newGridState, "X")
        } else if (playerMode === gridStateMode.X) {
          onSetPlayerMode(gridStateMode.O)
        // console.log("Done", newGridState, "O")
        }
      }}
      onLayout={(e) => {setLength(e.nativeEvent.layout.height)}}
      >
        { (value === "X" || value === "O") ?
          <TextAnimation mode={(value === "X") ? "X":"O"} length={length} colored={false} />:null
        }
        {/* <Text style={styles.tileTextStyle}>{value}</Text> */}
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      margin: "auto"
    },
    tileButtonContainerStyle: {
      height: "auto",
      aspectRatio: "1/1",
      width: "32%",
      backgroundColor: "blue",
      margin: "1%"
    },
    tileButtonOpenStyle: {
      height: "100%",
      width: "auto",
      aspectRatio: "1/1",
      backgroundColor: "blue"
    },
    tileButtonsFilledStyle: {
      height: "100%",
      width: "100%",
      backgroundColor: "gray",
    },
    tileTextStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: "auto"
    },
    dimentionTileText: {
      fontSize: 250,
      zIndex: 100
    },
    dimentionTileContainer: {
      position: "absolute",
      alignItems: 'center',
      justifyContent: 'center',
      width: "100%",
      height: "auto",
      aspectRatio: "1/1",
      margin:"auto",
      zIndex: 100
    },
    firstRow: {
      flexDirection: "row",
      width: "90%"
    },
    firstCol: {
      margin: "1%",
      height: "100%",
      width: "32%"
    },
    firstColFirstIndex: {
      marginTop: "1%",
      marginRight: "1%",
      height: "100%",
      width: "32%"
    },
    secondCol: {
      paddingBottom: 5,
      flex: 1
    },
    secondRow: {
      flexDirection: "row",
      height: "33.3%"
    }
  });