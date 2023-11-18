/*
  Ultimate Tic Tac Toe
  Andrew Mainella
  18 November 2023
  Welcome.tsx
*/
import { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useNavigate } from "react-router-native";
import GlitchComponent from '../UI/GlitchComponent';
import { createNewGame } from '../Functions/OnlineFunctions';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from "expo-font";
import { addGame, getGames } from "../Functions/StorageFunctions";
import { emptyGame, gridStateMode } from "../Types";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { CloseIcon } from "../UI/Icons";

function Online({onClose}:{onClose: () => void}){
  const navigation = useNavigate();
  const [gameId, setGameID] = useState<string>("")
  const {height, width} = useSelector((state: RootState) => state.dimensions)

  async function createNew() {
    const result = await createNewGame(emptyGame, gridStateMode.O)
    if (result !== null){
      navigation("/UTTT/online/"+result)
    }
  }

  return(
    <View style={{width: width * 0.8, height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Pressable style={{marginTop: 25, marginLeft: 25}} onPress={() => {onClose()}}>
        <CloseIcon width={20} height={20}/>
      </Pressable>
      <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 2}}>Load Game</Text>
      <TextInput onChangeText={(e) => {setGameID(e)}} value={gameId}/>
      <View style={{flexDirection: 'row'}}>
        <Pressable onPress={() => {
          if (/^\d{7}$/.test(gameId)){
            navigation("/UTTT/online/"+gameId)
          } else {
            console.log("")
          }
        }} style={{marginLeft: 'auto', marginRight: 'auto', borderRadius: 15, backgroundColor: 'blue'}}>
          <Text style={{margin: 10, color: 'white'}}>Load</Text>
        </Pressable>
        <Pressable onPress={() => createNew()} style={{marginLeft: 'auto', marginRight: 'auto', borderRadius: 15, backgroundColor: 'blue'}}>
          <Text style={{margin: 10, color: 'white'}}>Create New</Text>
        </Pressable>
      </View>
    </View>
  )
}

function StorageGames({isFriend, onClose}:{isFriend: boolean, onClose: () => void}) {
  const navigation = useNavigate();
  const [gameId, setGameID] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [games, setGames] = useState<gameStorageType[]>([])
  const {height, width} = useSelector((state: RootState) => state.dimensions)

  async function getGameData(){
    if (isFriend){
      const result = await getGames("Friend")
      setGames(result)
    } else {
      const result = await getGames("AI")
      setGames(result)
    }
  }
  useEffect(() => { 
    getGameData()
  }, [])

  async function createNew() {
    if (isFriend){
      const result = await addGame("Friend")
      navigation("/UTTT/friend/" + result)
    } else {
      const result = await addGame("AI")
      navigation("/UTTT/ai/" + result)
    }
  }

  return(
    <View style={{width: width * 0.8, backgroundColor: "rgba(255,255,255, 0.95)", height: height * 0.8, borderRadius: 25}}>
      <Pressable style={{marginTop: 25, marginLeft: 25}} onPress={() => {onClose()}}>
        <CloseIcon width={20} height={20}/>
      </Pressable>
      <Text style={{marginTop: 2, marginLeft: 'auto', marginRight: 'auto'}}>Load Game</Text>
      { games.map((game) => (
        <View key={game.gameId} style={{margin: 10, marginLeft: 'auto', marginRight: 'auto'}}>
          <Pressable onPress={() => {if (isFriend){navigation("/UTTT/friend/" + game.gameId)} else {navigation("/UTTT/ai/" + game.gameId)}}}>
            <Text>{new Date(game.lastPlayed).toString()}</Text>
          </Pressable>
        </View>
      ))}
      <Pressable onPress={() => createNew()} style={{marginLeft: 'auto', marginRight: 'auto', borderRadius: 15, backgroundColor: 'blue'}}>
        <Text style={{margin: 10, color: 'white'}}>Create New</Text>
      </Pressable>
    </View>
  )
}

export default function WelcomePage() {
  const navigation = useNavigate();
  const [selectedGameType, setSelectedGameType] = useState<string>("online")
  const [isShowingOnlineScreen, setIsShowingOnlineScreen] = useState<boolean>(false)
  const [isShowingFriendScreen, setIsShowingFriendScreen] = useState<boolean>(false)
  const [isShowingAIScreen, setIsShowingAIScreen] = useState<boolean>(false)
  const [isLoaded] = useFonts({
    "RussoOne": require("../../assets/Fonts/RussoOne-Regular.ttf"),
    "Ultimate": require("../../assets/Fonts/Ultimate.ttf"),
    "BarlowCondensed": require("../../assets/Fonts/BarlowCondensed-Black.ttf"),
    "Glitch":require("../../assets/Fonts/MokotoGlitchMark2.ttf")
  });
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  
  useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);
  // text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
  //red overide: #ff9c9c //Shadow #FF5757

  return(
    <View style={{backgroundColor: "#5E17EB", width: width, overflow: "hidden", height: height}}>
      <View style={{position: "relative", height: 150, marginLeft: "5%"}}>
        <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, position: "absolute"}}>ULTIMATE</Text>
        <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: "#00fffc", transform: [{translateX: -2}, {translateY: -1}], position: "absolute", zIndex: -1}}>ULTIMATE</Text>
        <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: "#fc00ff", transform: [{translateX: -2}, {translateY: 2}], position: "absolute", zIndex: -2}}>ULTIMATE</Text>
        <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: 150, color: "#fffc00", transform: [{translateX: 1}, {translateY: 4}], position: "absolute", zIndex: -3}}>ULTIMATE</Text>
      </View>
      <View style={{flexDirection: "row", marginLeft: "5%"}}>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: 50, color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25}}>TICK </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: 50, color: "#a0f4f7", textShadowColor: "#5CE1E6", textShadowRadius: 25}}>TAC </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: 50, color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25}}>TOE </Text>
      </View>
      <View>
        <Text>Ultimate Tic Tac Teo takes tic tac toe to the next level. Battle it out with</Text>
      </View>
      <View  style={{flexDirection: "row"}}>
        {/*ONLINE*/}
        <View style={{position: "relative", width: "33%"}}>
          <Pressable onPress={() => {setIsShowingOnlineScreen(true); setIsShowingAIScreen(false); setIsShowingFriendScreen(false)}} style={{backgroundColor: "white", borderRadius: 10, height: height * 0.15, width: width * 0.25, margin: "auto"}}>
            <GlitchComponent fontSize={width * 0.04} text='PLAY ONLINE' animated={false} justifyText='center'height={height * 0.15} width={width * 0.25}/>
          </Pressable>
        </View>
        {/*AI*/}
        <View style={{position: "relative", width: "33%"}}>
          <Pressable onPress={() => {setIsShowingAIScreen(true); setIsShowingFriendScreen(false); setIsShowingOnlineScreen(false)}} style={{backgroundColor: "white", borderRadius: 10, width: width * 0.25, margin: "auto", height:  height * 0.15, justifyContent: "center"}}>
            <View style={{position: "relative"}}>
              <GlitchComponent fontSize={width * 0.04} text='PLAY AGAINST'animated={true}/>
              <Text style={{fontFamily: "Glitch", fontSize: width * 0.03, position: "relative", textAlign: "center", marginTop: width * 0.05, color: "green"}}>AI</Text>
            </View> 
          </Pressable>
        </View>
        <View style={{position: "relative", width: "33%"}}>
          <Pressable onPress={() => {setIsShowingFriendScreen(true); setIsShowingAIScreen(false); setIsShowingOnlineScreen(false)}} style={{backgroundColor: "white", borderRadius: 10, height: height * 0.15, width: width * 0.25, margin: "auto"}}>
            <GlitchComponent fontSize={width * 0.04} text='PLAY FRIEND' animated={false} justifyText='center'height={height * 0.15} width={width * 0.25}/>
          </Pressable>
        </View>
      </View>
      <View style={{alignContent: "center", alignItems: "center", justifyContent: "center", position: "absolute", width: width, height: height}} pointerEvents='box-none'>
      { isShowingOnlineScreen ? 
        <Online onClose={() => setIsShowingOnlineScreen(false)}/>:null
      }
      { (isShowingFriendScreen || isShowingAIScreen) ?
        <StorageGames isFriend={isShowingFriendScreen} onClose={() => {setIsShowingAIScreen(false); setIsShowingFriendScreen(false)}}/>:null
      }
      </View>
    </View>
  )
}
