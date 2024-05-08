/*
  Ultimate Tic Tac Toe
  Andrew Mainella
  18 November 2023
  Welcome.tsx
*/
import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator } from "react-native";
import GlitchComponent from '../UI/GlitchComponent';
import { createNewGame, getOnlineGames } from '../Functions/OnlineFunctions';
import { addGame, getStorageGames } from "../Functions/StorageFunctions";
import { emptyGame, gridStateMode, loadingState } from "../Types";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { CloseIcon, GoogleIcon, SignInWithApple } from "../UI/Icons";
import { router, useGlobalSearchParams, useRouter } from "expo-router";
import { auth } from "../Firebase/Firebase";
import OnlineAuthenticationComponent from "../UI/OnlineAuthenticationComponent";
import AccountPage from "../UI/AccountPage";
import useUsernameExists from "../hooks/useUsernameExists";
import UsernameComponent from "../UI/AddUserComponent";
import BottomComponent from "../UI/BottomComponent";

function Online({onClose}:{onClose: () => void}){
  const router = useRouter()
  const [gameId, setGameID] = useState<string>("")
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [games, setGames] = useState<GameType[]>([])
  const [isAuth, setIsAuth] = useState(false)
  const usernameExists = useUsernameExists()

  async function createNew() {
    const uid = auth.currentUser?.uid
    if (uid !== undefined) {
      const result = await createNewGame(emptyGame, gridStateMode.X, uid)
      if (result !== null){
        router.push("/UTTT/online/"+result)
      }
    }
  }

  async function loadGames() {
    const result = await getOnlineGames()
    setGames(result)
  }

  useEffect(() =>{
    const unlisten = auth.onAuthStateChanged(
      authUser => {
        if (authUser !== null) {
          loadGames()
          setIsAuth(true)
        } else {
          setGames([])
          setIsAuth(false)
        }
      },
    );
    return () => {
      unlisten();
    }
 }, []);

  if (!isAuth) {
    return <OnlineAuthenticationComponent onClose={onClose}/>
  }

  if (usernameExists === loadingState.loading) {
    return (
      <View style={{width: width * 0.8, height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
        <ActivityIndicator />
        <Text>Loading</Text>
      </View>
    )
  }

  if (usernameExists === loadingState.failed) {
    return <UsernameComponent onClose={onClose}/>
  }

  return(
    <View style={{width: width * 0.8, height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Pressable style={{marginTop: 25, marginLeft: 25}} onPress={() => {onClose()}}>
        <CloseIcon width={20} height={20}/>
      </Pressable>
      <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 2}}>Load Game</Text>
      <TextInput onChangeText={(e) => {setGameID(e)}} value={gameId}/>
      <FlatList
        data={games}
        renderItem={(game) => (
          <Pressable
            style={{
              marginHorizontal: 15,
              backgroundColor: '#d3d3d350',
              padding: 10,
              borderRadius: 15,
              flexDirection: 'row',
              marginBottom: 7.5
            }}  
            onPress={() => {
              router.push("/UTTT/online/" + game.item.gameId)
            }}
          >
            <Text style={{marginRight: 5}}>{game.item.gameId}</Text>
            <Text>{game.item.date}</Text>
          </Pressable>
        )}
      />
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        <Pressable onPress={() => {
          if (/^\d{7}$/.test(gameId)){
            router.push("/UTTT/online/"+gameId)
          }
        }} style={{marginLeft: 'auto', marginRight: 'auto', borderRadius: 15, backgroundColor: 'blue', width: width * 0.25}}>
          <Text style={{margin: 10, color: 'white', textAlign: 'center'}}>Load</Text>
        </Pressable>
        <Pressable onPress={() => createNew()} style={{marginLeft: 'auto', marginRight: 'auto', borderRadius: 15, backgroundColor: 'blue', width: width * 0.25}}>
          <Text style={{margin: 10, color: 'white', textAlign: 'center'}}>Create New</Text>
        </Pressable>
      </View>
    </View>
  )
}

function StorageGames({isFriend, onClose}:{isFriend: boolean, onClose: () => void}) {
  const router = useRouter();
  const [gameId, setGameID] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [games, setGames] = useState<GameType[]>([])
  const {height, width} = useSelector((state: RootState) => state.dimensions)

  async function getGameData(){
    if (isFriend){
      const result = await getStorageGames("friend")
      setGames(result)
    } else {
      const result = await getStorageGames("ai")
      setGames(result)
    }
  }
  useEffect(() => { 
    getGameData()
  }, [])

  async function createNew() {
    if (isFriend){
      const result = await addGame("friend")
      router.push("/UTTT/friend/" + result)
    } else {
      const result = await addGame("ai")
      router.push("/UTTT/ai/" + result)
    }
  }

  return(
    <View style={{width: width * 0.8, backgroundColor: "rgba(255,255,255, 0.95)", height: height * 0.8, borderRadius: 25}}>
      <Pressable style={{marginTop: 25, marginLeft: 25}} onPress={() => {onClose()}}>
        <CloseIcon width={20} height={20}/>
      </Pressable>
      <Text style={{marginTop: 2, marginLeft: 'auto', marginRight: 'auto'}}>Load Game</Text>
      <FlatList
        data={games}
        renderItem={(game) => (
          <Pressable key={game.item.gameId} style={{margin: 15, marginVertical: 5, backgroundColor: '#d3d3d350', padding: 10, borderRadius: 15}} onPress={() => {if (isFriend){router.push("/UTTT/friend/" + game.item.gameId)} else {router.push("/UTTT/ai/" + game.item.gameId)}}}>
            <Text>{new Date(game.item.date).toString()}</Text>
          </Pressable>
        )}
      />
      <Pressable onPress={() => createNew()} style={{marginLeft: 'auto', marginRight: 'auto', borderRadius: 15, backgroundColor: 'blue', marginBottom: 15}}>
        <Text style={{margin: 10, color: 'white'}}>Create New</Text>
      </Pressable>
    </View>
  )
}

export function WelcomePage({
  online
}:{
  online: boolean
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const { gameType } = useGlobalSearchParams()
  // text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
  //red overide: #ff9c9c //Shadow #FF5757

  return(
    <View style={{backgroundColor: "#5E17EB", width: width, overflow: "hidden", height: height}}>
      <View style={{position: "relative", height: 150, marginLeft: "5%"}}>
        <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 560) ? 150:(width * 0.255), position: "absolute"}}>ULTIMATE</Text>
        <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 560) ? 150:(width * 0.255), color: "#00fffc", transform: [{translateX: -2}, {translateY: -1}], position: "absolute", zIndex: -1}}>ULTIMATE</Text>
        <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 560) ? 150:(width * 0.255), color: "#fc00ff", transform: [{translateX: -2}, {translateY: 2}], position: "absolute", zIndex: -2}}>ULTIMATE</Text>
        <Text selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 560) ? 150:(width * 0.255), color: "#fffc00", transform: [{translateX: 1}, {translateY: 4}], position: "absolute", zIndex: -3}}>ULTIMATE</Text>
      </View>
      <View style={{flexDirection: "row", marginLeft: "5%"}}>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 390) ? 50:(width * 0.13), color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25}}>TICK </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 390) ? 50:(width * 0.13), color: "#a0f4f7", textShadowColor: "#5CE1E6", textShadowRadius: 25}}>TAC </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 390) ? 50:(width * 0.13), color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25}}>TOE </Text>
      </View>
      <View>
        <Text style={{marginLeft: '5%', marginTop: 10, marginBottom: 10, color: 'white', marginRight: "5%"}}>Ultimate Tic Tac Toe takes tic tac toe to the next level. Battle it out with your friends or AI. Online gameplay is also avaliable.</Text>
        <View>
          
        </View>
      </View>
      <BottomComponent />
      <View style={{alignContent: "center", alignItems: "center", justifyContent: "center", position: "absolute", width: width, height: height}} pointerEvents='box-none'>
      { (online) ? 
        <Online onClose={() => router.push("/")}/>:null
      }
      { (gameType === "ai" || gameType === "friend") ?
        <StorageGames isFriend={gameType === "friend"} onClose={() => {router.push("/")}}/>:null
      }
      { (gameType === "account") ?
        <AccountPage />:null
      }
      </View>
    </View>
  )
}

export default function DefaultMainWelcomePage() {
  return <WelcomePage online={false}/>
}