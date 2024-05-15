/*
  Ultimate Tic Tac Toe
  Andrew Mainella
  18 November 2023
  UltimateTicTacToe.tsx
*/
import { useEffect, useState } from "react"
import { emptyGame, gridStateMode } from "../../../Types"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { updateGame } from "../../../functions/OnlineFunctions"
import { updateStorageGame } from "../../../functions/StorageFunctions"
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native"
import BigTileTextAnimation from "../../../components/BigTileTextAnimation"
import Striketrough from "../../../components/Striketrough"
import TileButton from "../../../components/TileButton"
import { ChevronLeft, CloseIcon, CopiedIcon, CopyIcon, OfflineIcon, PersonIcon, ResetIcon } from "../../../components/Icons"
import * as Clipboard from 'expo-clipboard';
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router"
import useGame from "../../../hooks/useGame"
import { setCurrentTurn, setGridState, setIsGameOver, setSelectedGrid } from "../../../functions/gameActions"
import { auth } from "../../../firebase"
import PlayersPage from "../../../components/PlayersPage"
import GameOverComponent from "../../../components/GameOverComponent"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useIsConnected from "../../../hooks/useIsConnected"

//Renders root type
function InnerGame({firstIndex, secondIndex, root, game, gameLength}:{firstIndex: number, secondIndex: number, root: RootType, game: GameType, gameLength: number}) {
  return (
    <View key={"SecondCol" + firstIndex + " " + secondIndex} style={{
      width: gameLength * 0.32,
      height: gameLength * 0.32,
      overflow: 'hidden',
      marginBottom: (secondIndex === 2) ? 0:gameLength * 0.02
    }}> 
      {root.value.map((secondRow: gridStateMode[], thirdIndex) => (
        <View key={`Row_${thirdIndex}`} style={{
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
              <TileButton value={secondColumn} firstIndex={firstIndex} secondIndex={secondIndex} thirdIndex={thirdIndex} forthIndex={forthIndex} currentTurn={game.currentTurn}/>
            </View>
          ))}
        </View>
      ))}
      {(game.data.inner[firstIndex][secondIndex].active) ? 
        <Striketrough gridState={game.data} firstIndex={firstIndex} secondIndex={secondIndex} />:null
      }
      {(game.data.value[firstIndex][secondIndex] === gridStateMode.O || game.data.value[firstIndex][secondIndex] === gridStateMode.X) ? 
        <View style={styles.dimentionTileContainer}>
          <BigTileTextAnimation mode={(game.data.value[firstIndex][secondIndex] === gridStateMode.O) ? "O":(game.data.value[firstIndex][secondIndex] === gridStateMode.X) ? "X":" "}/>
        </View>:null}
    </View>
  )
}

function MainGame({game}:{game: GameType}) {
  const { height, width } = useSelector((state: RootState) => state.dimensions)
  const [gameLength, setGameLength] = useState<number>(0);

  useEffect(() => {
    setGameLength((height < width) ? height * 0.8: width * 0.8)
  }, [width, height])

  return (
    <View key={"FirstRow"} style={[styles.firstRow, {
      height: gameLength,
      width: gameLength
    }]}>
      {game.data.inner.map((firstRow: RootType[], firstIndex) => (
        <View key={"FirstCol" + firstIndex} style={{
          width: gameLength * 0.32,
          height: gameLength,
          marginRight: (firstIndex === 2) ? 0:gameLength * 0.02
        }}>
          {
            firstRow.map((root: RootType, secondIndex) => (
              <InnerGame key={`Mini_Game_${firstIndex}_${secondIndex}`} game={game} root={root} firstIndex={firstIndex} secondIndex={secondIndex} gameLength={gameLength}/>
            ))
          }
        </View>
      ))}
    </View>
  )
}

export default function UltimateTicTacToe() {
  //first dimention board, second rows, third columns, forth second rows, fifth columns
  const { gameType, gameId } = useGlobalSearchParams()
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const router = useRouter()
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isShowingPlayers, setIsShowingPlayers] = useState<boolean>(false)
  const insets = useSafeAreaInsets()
  const isConnected = useIsConnected()

  const game = useGame(gameId as string, (gameType === 'online'))

  async function Copy() {
    if (typeof gameId === 'string') {
      await Clipboard.setStringAsync(gameId);
      setIsCopied(true);
    }
  }

  if (!isConnected) {
    return (
      <View style={{width: width, height: height, backgroundColor: "#5E17EB", alignItems: 'center', justifyContent: 'center', margin: "auto"}}>
        <Pressable style={{position: 'absolute', top: (width <= 560) ? 25:35, left: (width <= 560) ? 25:35}} onPress={() => {
          router.push("/")
        }}>
          <CloseIcon width={30} height={30} color="white"/>
        </Pressable>
        <OfflineIcon width={30} height={30} color="white"/>
        <Text style={{color: 'white'}}>Offline</Text>
      </View>
    )
  }

  if (game === 'loading') {
    return (
      <View style={{width: width, height: height, backgroundColor: "#5E17EB", alignItems: 'center', justifyContent: 'center', margin: "auto"}}>
        <ActivityIndicator />
        <Text style={{color: 'white'}}>Loading</Text>
      </View>
    )
  }

  if (game == undefined) {
    return (
      <View style={{width: width, height: height, backgroundColor: "#5E17EB", alignItems: 'center', justifyContent: 'center', margin: "auto"}}>
        <Text style={{color: 'white'}}>The game could not be found.</Text>
      </View>
    )
  }

  if (auth.currentUser === null && game.gameType === 'online') {
    return <Redirect href={"/UTTT/online"}/>
  }

  return(
    <View style={{width: width, height: height, backgroundColor: "#5E17EB", alignItems: 'center', justifyContent: 'center', margin: "auto"}}>
      <View style={{position: "absolute", height: 150, top: 0, left: 0, flexDirection: "row"}}>
        <View style={{position: "relative", height: 150, marginLeft: "5%"}}>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 555) ? 150:(width * 0.255), color: 'black', opacity: 0.8, position: "absolute", marginTop: insets.top}}>ULTIMATE</Text>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 555) ? 150:(width * 0.255), color: "#00fffc", transform: [{translateX: -2}, {translateY: -1}], position: "absolute", zIndex: -1, marginTop: insets.top}}>ULTIMATE</Text>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 555) ? 150:(width * 0.255), color: "#fc00ff", transform: [{translateX: -2}, {translateY: 2}], position: "absolute", zIndex: -2, marginTop: insets.top}}>ULTIMATE</Text>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 555) ? 150:(width * 0.255), color: "#fffc00", transform: [{translateX: 1}, {translateY: 4}], position: "absolute", zIndex: -3, marginTop: insets.top}}>ULTIMATE</Text>
        </View>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 555) ? 50:(width * 0.09), color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25, position: "relative", marginTop: insets.top}}>TICK </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 555) ? 50:(width * 0.09), color: "#a0f4f7", textShadowColor: "#5CE1E6", textShadowRadius: 25, position: "relative", marginTop: insets.top}}>TAC </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 555) ? 50:(width * 0.09), color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25, position: "relative", marginTop: insets.top}}>TOE </Text>
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
      <MainGame game={game}/>
      <View style={{flexDirection: "row"}}>
        <Pressable onPress={() => router.push('/')} style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 10, marginTop: 5, marginRight: 5}}>
          <ChevronLeft width={16} height={16}/>
          <Text style={{marginLeft: 2}}>Back</Text>
        </Pressable>
        {(game.gameType === 'online') ?
          <Pressable onPress={() => setIsShowingPlayers(true)} style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 10, marginTop: 5, marginLeft: 5}}>
            <PersonIcon width={16} height={16}/>
            <Text style={{marginLeft: 2}}>Players</Text>
          </Pressable>:null
        }
      </View>
      { game.gameOver ?
        <GameOverComponent />:null
      }
      { (game.gameType === 'online' && (isShowingPlayers || game.users.length < 2))?
        <PlayersPage accounts={game.users} onClose={() => {setIsShowingPlayers(false)}}/>:null
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