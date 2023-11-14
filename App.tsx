import { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import Modle from "./src/Model"
import { NativeRouter, Route, Link, Routes, useNavigate, useParams } from "react-router-native";
import { createNewGame, loadGame, getDimentionalFromData, updateGame } from './src/Functions/OnlineFunctions';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './src/Firebase/Firebase';
import { useFonts } from "expo-font"
import TileButton from './src/UI/TileButton';
import * as SplashScreen from 'expo-splash-screen';
import WelcomePage from './src/Welcome';
import { loadStorageGame, updateStorageGame } from './src/Functions/StorageFunctions';
import Striketrough from './src/UI/Striketrough';
import BigTileTextAnimation from './src/UI/BigTileTextAnimation';
import store, { RootState } from './src/Redux/store';
import { dimensionsSlice } from './src/Redux/reducers/dimensionsReducer';
import {Provider, useSelector} from "react-redux"

SplashScreen.preventAutoHideAsync();

enum gridStateMode{
  Open,
  X,
  O,
  Full
}
export const emptyGame: DimentionalType = {
  inner: [[{
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }], [{
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }], [{
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }]],
  value: [[gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],[gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],[gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
}

declare global{
  type DimentionalType = {
    inner: RootType[][]
    value: gridStateMode[][]
    active?: {
      xOne: number,
      xTwo: number,
      yOne: number,
      yTwo: number
    }
  }
  
  type RootType = {
    value: gridStateMode[][]
    active?: {
      xOne: number,
      xTwo: number,
      yOne: number,
      yTwo: number
    }
  }
}

function UltimateTicTacToe() {
  //first dimention board, second rows, third columns, forth second rows, fifth columns
  const [playerMode, setPlayerMode] = useState<gridStateMode>(gridStateMode.O)
  const [selectedGrid, setSelectedGrid] = useState<number>(0)
  const [gridState, setGridState] = useState<DimentionalType>(emptyGame)
  const [isGameOver, setIsGameOver] = useState<boolean>(false)
  const { gameType, gameId } = useParams()
  const {height, width} = useSelector((state: RootState) => state.dimensions)

  async function load() {
    if (gameType === "online"){
      const result = await loadGame(gameId ? gameId.replace(/ /g,''):"")
      if (result !== undefined){
       setGridState(result as unknown as DimentionalType)
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
      updateStorageGame(gameId ? gameId.replace(/ /g,''):"", gridState, isGameOver)
    }
  }, [playerMode])

  useEffect(() => {
    load()
  }, [])

  return(
    <View style={[styles.container, {width: width, height: height}]}>
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
                            <TileButton onGameOver={() => {setIsGameOver(true)}} value={((secondColumn === gridStateMode.Open) ? " ":(secondColumn === gridStateMode.O) ? "O":(secondColumn === gridStateMode.X) ? "X":" ")} key={(firstIndex * secondIndex) + (thirdIndex * forthIndex)} playerMode={playerMode} firstIndex={firstIndex} secondIndex={secondIndex} thirdIndex={thirdIndex} forthIndex={forthIndex} onSetGridState={setGridState} onSetPlayerMode={setPlayerMode} onSetSelectedGrid={setSelectedGrid} gridState={gridState} selectedGrid={selectedGrid} />
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
                    { (gridState.value[firstIndex][secondIndex] === gridStateMode.O || gridState.value[firstIndex][secondIndex] === gridStateMode.X) ? <View style={styles.dimentionTileContainer}><BigTileTextAnimation mode={(gridState.value[firstIndex][secondIndex] === gridStateMode.O) ? "O":(gridState.value[firstIndex][secondIndex] === gridStateMode.X) ? "X":" "}/></View>:null}
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
          setGridState(emptyGame); 
          setSelectedGrid(0); 
          setPlayerMode(gridStateMode.O); 
          if (gameType === "online"){
            updateGame(gameId ? gameId.replace(/ /g,''):"", emptyGame, gridStateMode.O)
          } else if (gameType === "friend" || gameType === "ai"){
            setGridState(emptyGame)
            console.log("This")
            updateStorageGame(gameId ? gameId.replace(/ /g,''):"", gridState, false)
          }
          }}/>
      </View>
      { isGameOver ?
        <Text>Game Over</Text>:null
      }
    </View>
  )
}

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

function App() {

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    return () => subscription?.remove();
  });

  const {height, width} = useSelector((state: RootState) => state.dimensions)

  useEffect(() => {
    if (dimensions.window.height !== height) {
      store.dispatch(dimensionsSlice.actions.setHeight(dimensions.window.height))
    }
    if (dimensions.window.width !== width) {
      store.dispatch(dimensionsSlice.actions.setWidth(dimensions.window.width))
    }
  }, [dimensions.window.height, dimensions.window.width])

  return (
    <NativeRouter>
      <View style={styles.container}>
        <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/UTTT/:gameType/:gameId" element={<UltimateTicTacToe />} />
        <Route path="/modle" element={<Modle/>} />
        </Routes>
      </View>
    </NativeRouter>
  );
}

export default function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5E17EB",
    alignItems: 'center',
    justifyContent: 'center',
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
