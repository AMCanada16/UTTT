/*
  Ultimate Tic Tac Toe
  Andrew Mainella
  18 November 2023
  UltimateTicTacToe.tsx
*/
import { useEffect, useState } from "react"
import { emptyGame, gridStateMode } from "../Types"
import { useNavigate, useParams } from "react-router-native"
import { useSelector } from "react-redux"
import store, { RootState } from "../Redux/store"
import { getDimentionalFromData, loadGame, updateGame } from "../Functions/OnlineFunctions"
import { doc, onSnapshot } from "firebase/firestore"
import { loadStorageGame, updateStorageGame } from "../Functions/StorageFunctions"
import { db } from "../Firebase/Firebase"
import { View, Text, StyleSheet, Pressable } from "react-native"
import BigTileTextAnimation from "../UI/BigTileTextAnimation"
import Striketrough from "../UI/Striketrough"
import TileButton from "../UI/TileButton"
import { isGameOverSlice } from "../Redux/reducers/isGameOverReducer"
import { gridStateSlice } from "../Redux/reducers/gridStateReducer"
import { selectedGridSlice } from "../Redux/reducers/selectedGridReducer"
import { playerModeSlice } from "../Redux/reducers/playerModeReducer"
import { ChevronLeft, CircleIcon, CopiedIcon, CopyIcon, ResetIcon, XIcon } from "../UI/Icons"
import * as Clipboard from 'expo-clipboard';

//Renders root type
function InnerGame({firstIndex, secondIndex, game, gameLength}:{firstIndex: number, secondIndex: number, game: RootType, gameLength: number}) {
  const { height, width } = useSelector((state: RootState) => state.dimensions)
  const gridState = useSelector((state: RootState) => state.gridState)
  return (
    <View key={"SecondCol" + firstIndex + " " + secondIndex} style={{
      width: gameLength * 0.32,
      height: gameLength * 0.32,
      overflow: 'hidden',
      marginBottom: (secondIndex === 2) ? 0:gameLength * 0.02
    }}> 
      {game.value.map((secondRow: gridStateMode[], thirdIndex) => (
        <View key={`SecondRow`} style={{
          flexDirection: 'row', height: (gameLength * 0.32)/3
          }}>
          { thirdIndex !== 0 ?
            <View style={{backgroundColor: 'black', width: gameLength * 0.32, height: 5, borderRadius: 15, position: 'absolute', bottom: '98%'}}/>:null
          }
          { thirdIndex === 0 ?
            <>
              <View style={{backgroundColor: 'black', width: 5, height: (gameLength * 0.32 - 3), borderRadius: 15, position: 'absolute', left: (gameLength * 0.32 - 10)/3}}/>
              <View style={{backgroundColor: 'black', width: 5, height: (gameLength * 0.32 - 3), borderRadius: 15, position: 'absolute', left: ((gameLength * 0.32 - 10)/3 * 2 + 5)}}/>
            </>:null
          }
          {secondRow.map((secondColumn: gridStateMode, forthIndex) => (
            <View key={"Block" + firstIndex + " " + secondIndex + " " + thirdIndex + " " + forthIndex} style={{
              width: (gameLength * 0.32 - 10)/3,
              height: (gameLength * 0.32 - 10)/3,
              marginRight: (forthIndex !== 2) ? 5:0,
              marginBottom: (thirdIndex !== 2) ? 5:0
            }}>
              <TileButton value={((secondColumn === gridStateMode.Open) ? " ":(secondColumn === gridStateMode.O) ? "O":(secondColumn === gridStateMode.X) ? "X":" ")} key={(firstIndex * secondIndex) + (thirdIndex * forthIndex)} firstIndex={firstIndex} secondIndex={secondIndex} thirdIndex={thirdIndex} forthIndex={forthIndex} />
            </View>
          ))}
        </View>
      ))}
      {(gridState.inner[firstIndex][secondIndex].active) ? 
        <Striketrough gridState={gridState} width={width} height={height} firstIndex={firstIndex} secondIndex={secondIndex} />:null
      }
      {(gridState.value[firstIndex][secondIndex] === gridStateMode.O || gridState.value[firstIndex][secondIndex] === gridStateMode.X) ? 
        <View style={styles.dimentionTileContainer}>
          <BigTileTextAnimation mode={(gridState.value[firstIndex][secondIndex] === gridStateMode.O) ? "O":(gridState.value[firstIndex][secondIndex] === gridStateMode.X) ? "X":" "}/>
        </View>:null}
    </View>
  )
}

function MainGame() {
  const { height, width } = useSelector((state: RootState) => state.dimensions)
  const [gameLength, setGameLength] = useState<number>(0);
  const gridState = useSelector((state: RootState) => state.gridState)

  useEffect(() => {
    setGameLength((height < width) ? height * 0.8: width * 0.8)
  }, [width, height])

  return (
    <View key={"FirstRow"} style={[styles.firstRow, {
      height: gameLength,
      width: gameLength
    }]}>
      {gridState.inner.map((firstRow: RootType[], firstIndex) => (
        <View key={"FirstCol" + firstIndex} style={{
          width: gameLength * 0.32,
          height: gameLength,
          marginRight: (firstIndex === 2) ? 0:gameLength * 0.02
        }}>
          {
            firstRow.map((game: RootType, secondIndex) => (
              <InnerGame game={game} firstIndex={firstIndex} secondIndex={secondIndex} gameLength={gameLength}/>
            ))
          }
        </View>
      ))}
    </View>
  )
}

export function UltimateTicTacToe() {
  //first dimention board, second rows, third columns, forth second rows, fifth columns
  const { gameType, gameId } = useParams()
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const isGameOver = useSelector((state: RootState) => state.isGameOver);
  const gridState = useSelector((state: RootState) => state.gridState)
  const playerMode = useSelector((state: RootState) => state.playerMode)
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
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
        const data = doc.data();
        const result = getDimentionalFromData(data["gameStateInner"], data["gameStateValue"]);
        store.dispatch(gridStateSlice.actions.setGridState(result));
      }
    });
    return () => {
      unsub()
    }
  }

  function resetUTTT() {
    store.dispatch(gridStateSlice.actions.setGridState(emptyGame))
    store.dispatch(selectedGridSlice.actions.setSelectedGrid(0))
    store.dispatch(playerModeSlice.actions.setPlayerMode(gridStateMode.X))
    if (gameType === "online"){
      updateGame(gameId ? gameId.replace(/ /g,''):"", emptyGame, gridStateMode.X)
    } else if (gameType === "friend" || gameType === "ai"){
      store.dispatch(gridStateSlice.actions.setGridState(emptyGame))
      store.dispatch(isGameOverSlice.actions.setIsGameOver(false))
      updateStorageGame(gameId ? gameId.replace(/ /g,''):"", gridState)
    }
  }

  async function Copy() {
    if (gameId !== undefined) {
      await Clipboard.setStringAsync(gameId);
      setIsCopied(true);
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
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: 'black', opacity: 0.8, position: "absolute"}}>ULTIMATE</Text>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: "#00fffc", transform: [{translateX: -2}, {translateY: -1}], position: "absolute", zIndex: -1}}>ULTIMATE</Text>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: "#fc00ff", transform: [{translateX: -2}, {translateY: 2}], position: "absolute", zIndex: -2}}>ULTIMATE</Text>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: "#fffc00", transform: [{translateX: 1}, {translateY: 4}], position: "absolute", zIndex: -3}}>ULTIMATE</Text>
        </View>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: 50, color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25, position: "relative"}}>TICK </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: 50, color: "#a0f4f7", textShadowColor: "#5CE1E6", textShadowRadius: 25, position: "relative"}}>TAC </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: 50, color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25, position: "relative"}}>TOE </Text>
      </View>
      <Pressable style={{flexDirection: 'row', padding: 10, backgroundColor: 'white', borderRadius: 15, marginBottom: 10}} onPress={() => Copy()}>
        { gameId !== undefined ?
          <>
            { isCopied ?
              <CopiedIcon width={20} height={20}/>:
              <CopyIcon width={20} height={20}/>
            }
          </>:null
        }
        <Text style={{marginLeft: 10, marginTop: 'auto', marginBottom: 'auto'}}>{gameId}</Text>
      </Pressable>
      <MainGame />
      <View style={{flexDirection: "row"}}>
        <Pressable onPress={() => navigate('/')} style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 10, marginTop: 5, marginRight: 5}}>
          <ChevronLeft width={16} height={16}/>
          <Text style={{marginLeft: 2}}>Back</Text>
        </Pressable>
        <Pressable onPress={() => resetUTTT()} style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 10, marginTop: 5, marginLeft: 5}}>
          <ResetIcon width={16} height={16}/>
          <Text style={{marginLeft: 2}}>Reset</Text>
        </Pressable>
      </View>
      { isGameOver ?
        <View style={{position: 'absolute', width: width * 0.8, height: height * 0.8, top: 'auto', bottom: 'auto', left: 'auto', right: 'auto', backgroundColor: 'rgba(255,255,255, 0.6)', borderRadius: 25}}>
          <Text style={{margin: 10}}>Game Over</Text>
        </View>:null
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
  secondRow: {
    flexDirection: "row",
    height: "33.3%"
  }
});