import { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Button, TextInput } from "react-native";
import { useNavigate } from "react-router-native";
import GlitchComponent from './UI/GlitchComponent';
import { createNewGame } from './Functions/OnlineFunctions';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from "expo-font";
import { addGame, deleteGame, getGames } from "./Functions/StorageFunctions";
import TextAnimation from "./UI/TextAnimation";
import { emptyGame, gridStateMode } from "./Types";

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

function Online(){
  const navigation = useNavigate();
  const [gameId, setGameID] = useState<string>("")
  return(
    <View style={{width: "80%"}}>
      <Text>Load Game</Text>
      <TextInput onChangeText={(e) => {setGameID(e)}} value={gameId}/>
      <Button title='load' onPress={() => {
        if (/^\d{7}$/.test(gameId)){
          navigation("/UTTT/online/"+gameId)
        } else {
          console.log("")
        }
      }}/>
      <Button title='Create New' onPress={async () => {
        const result = await createNewGame(emptyGame, gridStateMode.O)
        if (result !== null){
          navigation("/UTTT/online/"+result)
        }
      }}/>
    </View>
  )
}

function StorageGames({isFriend, onClose}:{isFriend: boolean, onClose: () => void}) {
    const navigation = useNavigate();
    const [gameId, setGameID] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [games, setGames] = useState<gameStorageType[]>([])

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
    return(
        <View style={{width: dimensions.window.width * 0.8, backgroundColor: "rgba(255,255,255, 0.95)", height: dimensions.window.height * 0.8, justifyContent: "center", alignContent: "center", alignItems: "center", borderRadius: 25}}>
            <Button title="Close" onPress={() => {onClose()}}/>
            <Text>Load Game</Text>
            { games.map((game) => (
                <View key={game.gameId}>
                    <TouchableOpacity onPress={() => {if (isFriend){navigation("/UTTT/friend/" + game.gameId)} else {navigation("/UTTT/ai/" + game.gameId)}}}>
                        <Text>{new Date(game.lastPlayed).toString()}</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <Button title='Create New' onPress={async () => {
                if (isFriend){
                    const result = await addGame("Friend")
                    navigation("/UTTT/friend/" + result)
                } else {
                    const result = await addGame("AI")
                    navigation("/UTTT/ai/" + result)
                }
            }}/>
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
    "RussoOne": require("../assets/Fonts/RussoOne-Regular.ttf"),
    "Ultimate": require("../assets/Fonts/Ultimate.ttf"),
    "BarlowCondensed": require("../assets/Fonts/BarlowCondensed-Black.ttf"),
    "Glitch":require("../assets/Fonts/MokotoGlitchMark2.ttf")
  });
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
  const onLayoutRootView = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);
  // text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
  //red overide: #ff9c9c //Shadow #FF5757
  return(
    <View style={{backgroundColor: "#5E17EB", width: dimensions.window.width, overflow: "hidden", height: dimensions.window.height}}>
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
        <Text>Ultimate Tic Tac Teo takes tic tac toe to the next level. Battle it out wit</Text>
        
      </View>
      <View  style={{flexDirection: "row"}}>
        {/*ONLINE*/}
        <View style={{position: "relative", width: "33%"}}>
          <TouchableOpacity onPress={() => {setIsShowingOnlineScreen(true); setIsShowingAIScreen(false); setIsShowingFriendScreen(false)}} style={{backgroundColor: "white", borderRadius: 10, height: dimensions.window.height * 0.15, width: dimensions.window.width * 0.25, margin: "auto"}}>
            <GlitchComponent fontSize={dimensions.window.width * 0.04} text='PLAY ONLINE' animated={false} justifyText='center'height={dimensions.window.height * 0.15} width={dimensions.window.width * 0.25}/>
          </TouchableOpacity>
        </View>
        {/*AI*/}
        <View style={{position: "relative", width: "33%"}}>
          <TouchableOpacity onPress={() => {setIsShowingAIScreen(true); setIsShowingFriendScreen(false); setIsShowingOnlineScreen(false)}} style={{backgroundColor: "white", borderRadius: 10, width: dimensions.window.width * 0.25, margin: "auto", height:  dimensions.window.height * 0.15, justifyContent: "center"}}>
            <View style={{position: "relative"}}>
              <GlitchComponent fontSize={dimensions.window.width * 0.04} text='PLAY AGAINST'animated={true}/>
              <Text style={{fontFamily: "Glitch", fontSize: dimensions.window.width * 0.03, position: "relative", textAlign: "center", marginTop: dimensions.window.width * 0.05, color: "green"}}>AI</Text>
            </View> 
          </TouchableOpacity>
        </View>
        <View style={{position: "relative", width: "33%"}}>
          <TouchableOpacity onPress={() => {setIsShowingFriendScreen(true); setIsShowingAIScreen(false); setIsShowingOnlineScreen(false)}} style={{backgroundColor: "white", borderRadius: 10, height: dimensions.window.height * 0.15, width: dimensions.window.width * 0.25, margin: "auto"}}>
            <GlitchComponent fontSize={dimensions.window.width * 0.04} text='PLAY FRIEND' animated={false} justifyText='center'height={dimensions.window.height * 0.15} width={dimensions.window.width * 0.25}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{alignContent: "center", alignItems: "center", justifyContent: "center", position: "absolute", width: dimensions.window.width, height: dimensions.window.height}} pointerEvents='box-none'>
      { isShowingOnlineScreen ? 
        <Online />:null
      }
      { (isShowingFriendScreen || isShowingAIScreen) ?
        <StorageGames isFriend={isShowingFriendScreen} onClose={() => {setIsShowingAIScreen(false); setIsShowingFriendScreen(false)}}/>:null
      }
      </View>
    </View>
  )
}