/*
  Ultimate Tic Tac Toe
  Andrew Mainella
  18 November 2023
  UltimateTicTacToe.tsx
*/
import * as Clipboard from 'expo-clipboard';
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux/store"
import { View, Text, StyleSheet, Pressable, ActivityIndicator, useWindowDimensions } from "react-native"
import BigTileTextAnimation from "@components/BigTileTextAnimation"
import Striketrough from "@components/Striketrough"
import TileButton from "@components/TileButton"
import { ChevronLeft, CloseIcon, CopiedIcon, CopyIcon, OfflineIcon, PersonIcon } from "@components/Icons"
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router"
import useGame from "@hooks/useGame"
import { auth } from "@functions/firebase"
import PlayersPage from "@components/PlayersPage"
import GameOverComponent from "@components/GameOverComponent"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useIsConnected from "@hooks/useIsConnected"
import { trainModel } from "@functions/ai"
import { gridStateMode } from "@types"
import React from 'react';

//Renders root type
function InnerGame({game, gridIndex, gameLength}:{game: GameType, gridIndex: number, gameLength: number}) {
  const active = useMemo(() => {
    const foundActive = game.data.active.find((active) => active.gridIndex === gridIndex)
    return foundActive
  }, [game])
  const {width} = useWindowDimensions()
  const borderWidth = useMemo(() => {
    if (width >= 575) {
      return 4
    } else {
      return 4 * (width/575)
    }
  }, [width])
  return (
    <View key={`Grid_${gridIndex}`} style={{
      width: gameLength/3 - (borderWidth * 2),
      height: gameLength/3 - (borderWidth * 2),
      overflow: 'hidden',
      margin: 4
    }}> 
      <View style={{flexDirection: 'row'}}>
        <TileButton tileIndex={0} gridIndex={gridIndex} currentTurn={game.currentTurn} game={game} gameLength={gameLength}/>
        <View style={{width: borderWidth}}/>
        <TileButton tileIndex={1} gridIndex={gridIndex} currentTurn={game.currentTurn} game={game} gameLength={gameLength}/>
        <View style={{width: borderWidth}}/>
        <TileButton tileIndex={2} gridIndex={gridIndex} currentTurn={game.currentTurn} game={game} gameLength={gameLength}/>
      </View>
      <View style={{height: borderWidth, width: gameLength/3 - (borderWidth * 2), backgroundColor: 'black'}}/>
      <View style={{flexDirection: 'row'}}>
        <TileButton tileIndex={3} gridIndex={gridIndex} currentTurn={game.currentTurn} game={game} gameLength={gameLength}/>
        <View style={{width: borderWidth}}/>
        <TileButton tileIndex={4} gridIndex={gridIndex} currentTurn={game.currentTurn} game={game} gameLength={gameLength}/>
        <View style={{width: borderWidth}}/>
        <TileButton tileIndex={5} gridIndex={gridIndex} currentTurn={game.currentTurn} game={game} gameLength={gameLength}/>
      </View>
      <View style={{height: borderWidth, width: gameLength/3 - (borderWidth * 2), backgroundColor: 'black'}}/>
      <View style={{flexDirection: 'row'}}>
        <TileButton tileIndex={6} gridIndex={gridIndex} currentTurn={game.currentTurn} game={game} gameLength={gameLength}/>
        <View style={{width: borderWidth}}/>
        <TileButton tileIndex={7} gridIndex={gridIndex} currentTurn={game.currentTurn} game={game} gameLength={gameLength}/>
        <View style={{width: borderWidth}}/>
        <TileButton tileIndex={8} gridIndex={gridIndex} currentTurn={game.currentTurn} game={game} gameLength={gameLength}/>
      </View>
      <View style={{height: gameLength/3 - (2 * borderWidth), width: borderWidth, backgroundColor: 'black', position: 'absolute', left: (gameLength/3 - (4 * borderWidth))/3, zIndex: 2}}/>
      <View style={{height: gameLength/3 - (2 * borderWidth), width: borderWidth, backgroundColor: 'black', position: 'absolute', left: ((gameLength/3 - (4 * borderWidth))/3 * 2) + borderWidth, zIndex: 2, bottom: 0}}/>
      {(active !== undefined) ? 
        <Striketrough active={active}  />:null
      }
      {(game.data.value[gridIndex] === gridStateMode.o || game.data.value[gridIndex] === gridStateMode.x) ? 
        <View style={styles.dimentionTileContainer}>
          <BigTileTextAnimation mode={(game.data.value[gridIndex] === gridStateMode.o) ? "O":(game.data.value[gridIndex] === gridStateMode.x) ? "X":" "}/>
        </View>:null}
    </View>
  )
}

function MainGame({game}:{game: GameType}) {
  const { height, width } = useSelector((state: RootState) => state.dimensions)
  const [gameLength, setGameLength] = useState<number>(0);

  useEffect(() => {
    if ((width < height && width <= 560) || (width > height && height <= 560)) {
      setGameLength((height < width) ? height * 0.9: width * 0.9)
    } else {
      setGameLength((height < width) ? height * 0.8: width * 0.8) 
    }
  }, [width, height])

  return (
    <View key={"Container"} style={{
      height: gameLength,
      width: gameLength
    }}>
      <View style={{flexDirection: 'row'}}>
        <InnerGame game={game} gridIndex={0} gameLength={gameLength}/>
        <InnerGame game={game} gridIndex={1} gameLength={gameLength}/>
        <InnerGame game={game} gridIndex={2} gameLength={gameLength}/>
      </View>
      <View style={{flexDirection: 'row'}}>
        <InnerGame game={game} gridIndex={3} gameLength={gameLength}/>
        <InnerGame game={game} gridIndex={4} gameLength={gameLength}/>
        <InnerGame game={game} gridIndex={5} gameLength={gameLength}/>
      </View>
      <View style={{flexDirection: 'row'}}>
        <InnerGame game={game} gridIndex={6} gameLength={gameLength}/>
        <InnerGame game={game} gridIndex={7} gameLength={gameLength}/>
        <InnerGame game={game} gridIndex={8} gameLength={gameLength}/>
      </View>
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
  const [isShowingGameOver, setIsShowingGameOver] = useState<boolean>(true)
  const insets = useSafeAreaInsets()
  const isConnected = useIsConnected()

  const game = useGame(gameId as string, (gameType === 'online'))
  const [modelLoading, setModelLoading] = useState<boolean>(true)

  async function Copy() {
    if (typeof gameId === 'string') {
      await Clipboard.setStringAsync(gameId);
      setIsCopied(true);
    }
  }

  async function loadModal() {
    await trainModel()
    setModelLoading(false)
  }

  useEffect(() => {
    if (gameType === 'ai') {
      loadModal()
    } else {
      setModelLoading(false)
    }
  }, [])

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

  if (game === 'loading' || modelLoading) {
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
        <Pressable onPress={() => router.push('/')} style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 10, marginTop: 5, marginRight: 5}}>
          <ChevronLeft width={16} height={16}/>
          <Text style={{marginLeft: 2}}>Back</Text>
        </Pressable>
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
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 555) ? 150:(width * 0.24), color: 'black', opacity: 0.8, position: "absolute", marginTop: insets.top}}>ULTIMATE</Text>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 555) ? 150:(width * 0.24), color: "#00fffc", transform: [{translateX: -2}, {translateY: -1}], position: "absolute", zIndex: -1, marginTop: insets.top}}>ULTIMATE</Text>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 555) ? 150:(width * 0.24), color: "#fc00ff", transform: [{translateX: -2}, {translateY: 2}], position: "absolute", zIndex: -2, marginTop: insets.top}}>ULTIMATE</Text>
          <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 555) ? 150:(width * 0.24), color: "#fffc00", transform: [{translateX: 1}, {translateY: 4}], position: "absolute", zIndex: -3, marginTop: insets.top}}>ULTIMATE</Text>
        </View>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 555) ? 50:(width * 0.09), color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25, position: "relative", marginTop: insets.top}}>TIC </Text>
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
        {(game.gameType === 'online' && game.gameOver === gridStateMode.open) ?
          <Pressable onPress={() => setIsShowingPlayers(true)} style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 10, marginTop: 5, marginLeft: 5}}>
            <PersonIcon width={16} height={16}/>
            <Text style={{marginLeft: 2}}>Players</Text>
          </Pressable>:null
        }
        {(game.gameOver !== gridStateMode.open && isShowingGameOver === false) ?
          <Pressable onPress={() => setIsShowingGameOver(true)} style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 10, marginTop: 5, marginLeft: 5}}>
            <Text>Show game over</Text>
          </Pressable>:null
        }
      </View>
      { (game.gameOver !== gridStateMode.open && isShowingGameOver === true) ?
        <GameOverComponent onClose={() => setIsShowingGameOver(false)}/>:null
      }
      { (game.gameType === 'online' && (isShowingPlayers || game.users.length < 2) && game.gameOver === gridStateMode.open)?
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