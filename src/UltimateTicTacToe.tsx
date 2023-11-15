import { useEffect, useState } from "react"
import { emptyGame, gridStateMode } from "./Types"
import { useParams } from "react-router-native"
import { useSelector } from "react-redux"
import store, { RootState } from "./Redux/store"
import { getDimentionalFromData, loadGame, updateGame } from "./Functions/OnlineFunctions"
import { doc, onSnapshot } from "firebase/firestore"
import { loadStorageGame, updateStorageGame } from "./Functions/StorageFunctions"
import { db } from "./Firebase/Firebase"
import { View, Text, Button, StyleSheet } from "react-native"
import BigTileTextAnimation from "./UI/BigTileTextAnimation"
import Striketrough from "./UI/Striketrough"
import TileButton from "./UI/TileButton"
import { isGameOverSlice } from "./Redux/reducers/isGameOverReducer"
import { gridStateSlice } from "./Redux/reducers/gridStateReducer"
import { selectedGridSlice } from "./Redux/reducers/selectedGridReducer"
import { playerModeSlice } from "./Redux/reducers/playerModeReducer"

export function UltimateTicTacToe() {
  //first dimention board, second rows, third columns, forth second rows, fifth columns
  const { gameType, gameId } = useParams()
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const isGameOver = useSelector((state: RootState) => state.isGameOver);
  const gridState = useSelector((state: RootState) => state.gridState)
  const playerMode = useSelector((state: RootState) => state.playerMode)

  async function load() {
    if (gameType === "online"){
      const result = await loadGame(gameId ? gameId.replace(/ /g,''):"")
      if (result !== undefined){
       store.dispatch(gridStateSlice.actions.setGridState(result as unknown as DimentionalType))
      }
      onUpdate()
    } else if (gameType === "ai" || gameType === "friend"){
      loadStorageGame(gameId ? gameId.replace(/ /g,''):"")
    }
  }

  function onUpdate() {
    const unsub = onSnapshot(doc(db, "Games", gameId ? gameId.replace(/ /g,''):""), (doc) => {
      if (doc.exists()){
        const data = doc.data()
        const result = getDimentionalFromData(data["gameStateInner"], data["gameStateValue"])
        console.log("This here:", result)
        console.log("Data", data)
      }
    });
    return () => {
      unsub()
    }
  }

  useEffect(() => {
    if (gameType === "online"){
      updateGame(gameId ? gameId.replace(/ /g,''):"", gridState, playerMode)
    } else if (gameType === "ai" || gameType === "friend"){
      updateStorageGame(gameId ? gameId.replace(/ /g,''):"", gridState)
    }
  }, [playerMode])

  useEffect(() => {
    load()
  }, [])

  return(
    <View style={{width: width, height: height, backgroundColor: "#5E17EB", alignItems: 'center', justifyContent: 'center', margin: "auto"}}>
        <View style={{position: "absolute", height: 150, top: 0, left: 0, flexDirection: "row"}}>
          <View style={{position: "relative", height: 150, marginLeft: "5%"}}>
            <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, position: "absolute"}}>ULTIMATE</Text>
            <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: "#00fffc", transform: [{translateX: -2}, {translateY: -1}], position: "absolute", zIndex: -1}}>ULTIMATE</Text>
            <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: "#fc00ff", transform: [{translateX: -2}, {translateY: 2}], position: "absolute", zIndex: -2}}>ULTIMATE</Text>
            <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: "#fffc00", transform: [{translateX: 1}, {translateY: 4}], position: "absolute", zIndex: -3}}>ULTIMATE</Text>
          </View>
          <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: 50, color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25, position: "relative"}}>TICK </Text>
          <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: 50, color: "#a0f4f7", textShadowColor: "#5CE1E6", textShadowRadius: 25, position: "relative"}}>TAC </Text>
          <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: 50, color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25, position: "relative"}}>TOE </Text>
        </View>
      <Text>{gameId}</Text>
      <View key={"FirstRow"} style={[styles.firstRow, {
        height: (height < width) ? height * 0.8: width * 0.8,
        width: (height < width) ? height * 0.8: width * 0.8
      }]}>
        {gridState.inner.map((firstRow: RootType[], firstIndex) => (
            <View key={"FirstCol" + firstIndex} style={(firstIndex === 0) ? styles.firstColFirstIndex:styles.firstCol}>
              {
                firstRow.map((firstColumn: RootType, secondIndex) => (
                  <View key={"SecondCol" + firstIndex + " " + secondIndex} style={styles.secondCol}> 
                    {firstColumn.value.map((secondRow: gridStateMode[], thirdIndex) => (
                      <View key={"SecondRow" + firstIndex + " " + secondIndex + " " + thirdIndex} style={styles.secondRow}>
                        {secondRow.map((secondColumn: gridStateMode, forthIndex) => (
                          <View key={"Block" + firstIndex + " " + secondIndex + " " + thirdIndex + " " + forthIndex} style={styles.tileButtonContainerStyle}>
                            <TileButton onGameOver={() => {store.dispatch(isGameOverSlice.actions.setIsGameOver(true))}} value={((secondColumn === gridStateMode.Open) ? " ":(secondColumn === gridStateMode.O) ? "O":(secondColumn === gridStateMode.X) ? "X":" ")} key={(firstIndex * secondIndex) + (thirdIndex * forthIndex)} firstIndex={firstIndex} secondIndex={secondIndex} thirdIndex={thirdIndex} forthIndex={forthIndex} />
                          </View>
                        ))
                        }
                      </View>
                    ))
                    }
                    <View style={styles.dimentionTileContainer} pointerEvents='none'>
                      { (gridState.inner[firstIndex][secondIndex].active) ? 
                        <Striketrough gridState={gridState} width={width} height={height} firstIndex={firstIndex} secondIndex={secondIndex} />:null
                      }
                    </View>
                    <View style={styles.dimentionTileContainer} pointerEvents='none'>
                    { (gridState.value[firstIndex][secondIndex] === gridStateMode.O || gridState.value[firstIndex][secondIndex] === gridStateMode.X) ? 
                      <View style={styles.dimentionTileContainer}>
                        <BigTileTextAnimation mode={(gridState.value[firstIndex][secondIndex] === gridStateMode.O) ? "O":(gridState.value[firstIndex][secondIndex] === gridStateMode.X) ? "X":" "}/>
                      </View>:null}
                    </View>
                  </View>
                ))
              }
            </View>
        ))
        }
      </View>
      <View style={{flexDirection: "row"}}>
        <Text>
        {((playerMode === gridStateMode.Open) ? " ":(playerMode === gridStateMode.O) ? "O":"X")}
        </Text>
        <Button title='reset' onPress={() => {
          store.dispatch(gridStateSlice.actions.setGridState(emptyGame))
          store.dispatch(selectedGridSlice.actions.setSelectedGrid(0))
          store.dispatch(playerModeSlice.actions.setPlayerMode(gridStateMode.O))
          if (gameType === "online"){
            updateGame(gameId ? gameId.replace(/ /g,''):"", emptyGame, gridStateMode.O)
          } else if (gameType === "friend" || gameType === "ai"){
            store.dispatch(gridStateSlice.actions.setGridState(emptyGame))
            store.dispatch(isGameOverSlice.actions.setIsGameOver(false))
            updateStorageGame(gameId ? gameId.replace(/ /g,''):"", gridState)
          }
          }}/>
      </View>
      { isGameOver ?
        <Text>Game Over</Text>:null
      }
    </View>
  )
}

const styles = StyleSheet.create({
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