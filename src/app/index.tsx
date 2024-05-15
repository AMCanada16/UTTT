/*
  Ultimate Tic Tac Toe
  Andrew Mainella
  18 November 2023
  Welcome.tsx
*/
import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator } from "react-native";
import { createNewGame, getOnlineGames } from '../functions/OnlineFunctions';
import { addGame, getStorageGames } from "../functions/StorageFunctions";
import { emptyGame, gridStateMode, joinRulesArray, loadingState } from "../Types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CloseIcon, OfflineIcon } from "../components/Icons";
import { router, useGlobalSearchParams, useRouter } from "expo-router";
import { auth } from "../firebase";
import OnlineAuthenticationComponent from "../components/OnlineAuthenticationComponent";
import AccountPage from "../components/AccountPage";
import useUsernameExists from "../hooks/useUsernameExists";
import UsernameComponent from "../components/AddUserComponent";
import BottomComponent from "../components/BottomComponent";
import DefaultButton from "../components/DefaultButton";
import FriendsPage from "../components/FriendsPage";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { getFriends } from "../functions/UserFunctions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useIsConnected from "../hooks/useIsConnected";

function Online({onClose}:{onClose: () => void}){
  const router = useRouter()
  const [gameId, setGameID] = useState<string>("")
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [games, setGames] = useState<GameType[]>([])
  const [isAuth, setIsAuth] = useState(false)
  const usernameExists = useUsernameExists().exists
  const [searchMode, setSearchMode] = useState<joinRules>("public")
  const isConnected = useIsConnected()

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
    let uid = auth.currentUser?.uid
    let currentFriends: string[] = []
    if (searchMode !== "invitation") {
      if (uid === undefined) {
        return
      }
      const friendResult = await getFriends(uid)
      if (friendResult !== undefined) {
        currentFriends = friendResult.friends
      }
    }
    const result = await getOnlineGames(searchMode, currentFriends)
    console.log(result)
    if (result !== loadingState.failed) {
      setGames(result)
    }
  }

  useEffect(() => {
    loadGames()
  }, [searchMode])

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

 if (!isConnected) {
  return (
    <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Pressable style={{marginTop: (width <= 560) ? 15:25, marginLeft: (width <= 560) ? 15:25}} onPress={() => {onClose()}}>
        <CloseIcon width={30} height={30}/>
      </Pressable>
      <OfflineIcon width={30} height={30} style={{
        marginHorizontal: (width * ((width <= 560) ? 0.475:0.4)) - 15
      }}/>
    </View>
  )
 }

  if (!isAuth) {
    return <OnlineAuthenticationComponent onClose={onClose}/>
  }

  if (usernameExists === loadingState.loading) {
    return (
      <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
        <Text>Loading</Text>
      </View>
    )
  }

  if (usernameExists === loadingState.failed) {
    return <UsernameComponent onClose={onClose}/>
  }

  return(
    <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Pressable style={{marginTop: (width <= 560) ? 15:25, marginLeft: (width <= 560) ? 15:25}} onPress={() => {onClose()}}>
        <CloseIcon width={30} height={30}/>
      </Pressable>
      <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 2, fontSize: 25}}>Load Game</Text>
      <TextInput
        onChangeText={(e) => {
          if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ""].includes(e.charAt(e.length - 1))) {
            setGameID(e)
          }
        }}
        value={gameId}
        style={{
          borderWidth: 1,
          borderRadius: 4,
          borderColor: 'black',
          marginHorizontal: 5,
          fontSize: 16,
          padding: 15,
          backgroundColor: 'white',
          marginBottom: 5,
          marginTop: 15,
          color: "black"
        }}
        placeholderTextColor={"black"}
        placeholder="Game ID"
      />
      <SegmentedControl
        values={['All', 'Friends', 'Invitation']}
        selectedIndex={joinRulesArray.indexOf(searchMode)}
        onChange={(e) => {
          if (e.nativeEvent.selectedSegmentIndex === 0) {
            setSearchMode('public')
          } else if (e.nativeEvent.selectedSegmentIndex === 1) {
            setSearchMode('friends')
          } else {
            setSearchMode('invitation')
          }
        }}
        style={{margin: 5, marginBottom: 10, borderWidth: 1, borderColor: 'black'}}
      />
      <FlatList
        data={games}
        renderItem={(game) => (
          <DefaultButton
            style={{margin: 5, flexDirection: 'row'}}
            onPress={() => {
              router.push("/UTTT/online/" + game.item.gameId)
            }}
          >
            <Text style={{marginRight: 5}}>{game.item.gameId}</Text>
            <Text>{new Date(game.item.date).toLocaleString('en-CA', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}</Text>
          </DefaultButton>
        )}
      />
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        <DefaultButton
          onPress={() => {
            if (/^\d{7}$/.test(gameId)){
              router.push("/UTTT/online/"+gameId)
            }
          }}
          style={{
            margin: 5,
            marginBottom: 15,
            width: width * (width <= 560 ? 0.475:0.4) - 10
          }}
        >
          <Text>Load</Text>
        </DefaultButton>
        <DefaultButton
          onPress={() => createNew()}
          style={{
            margin: 5,
            marginBottom: 15,
            width: width * (width <= 560 ? 0.475:0.4) - 10
          }}
        >
          <Text>Create New</Text>
        </DefaultButton>
      </View>
    </View>
  )
}

function StorageGames({isFriend, onClose}:{isFriend: boolean, onClose: () => void}) {
  const router = useRouter();
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
    <View style={{width: width * ((width <= 560) ? 0.95:0.8), backgroundColor: "rgba(255,255,255, 0.95)", height: height * 0.8, borderRadius: 25}}>
      <Pressable style={{marginTop: (width <= 560) ? 15:25, marginLeft: (width <= 560) ? 15:25}} onPress={() => {onClose()}}>
        <CloseIcon width={30} height={30}/>
      </Pressable>
      <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 2, fontSize: 25}}>Load Game</Text>
      <FlatList
        data={games}
        renderItem={(game) => (
          <DefaultButton
            style={{margin: 5, flexDirection: 'row'}}
            onPress={() => {
              if (isFriend) {
                router.push("/UTTT/friend/" + game.item.gameId)
              } else {
                router.push("/UTTT/ai/" + game.item.gameId)
              }
            }}
          >
            <Text style={{marginRight: 5}}>{game.item.gameId}</Text>
            <Text>{new Date(game.item.date).toLocaleString('en-CA', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}</Text>
          </DefaultButton>
        )}
      />
      <DefaultButton
        onPress={() => createNew()}
        style={{
          margin: 5,
          marginBottom: 15
        }}
      >
        <Text>Create New</Text>
      </DefaultButton>
    </View>
  )
}

function Overlay({online}:{online: boolean}) {
  const { gameType } = useGlobalSearchParams()
  if  (gameType === "account") {
    return <AccountPage />
  } else if (online) {
    return <Online onClose={() => router.push("/")}/>
  } else if (gameType === "ai" || gameType === "friend") {
    return <StorageGames isFriend={gameType === "friend"} onClose={() => {router.push("/")}}/>
  } else if (gameType === "account") {
    return <AccountPage />
  } else if (gameType === "friends") {
    return <FriendsPage />
  }
  return null
}

export function WelcomePage({
  online
}:{
  online: boolean
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const insets = useSafeAreaInsets()
  // text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
  //red overide: #ff9c9c //Shadow #FF5757

  return(
    <View style={{backgroundColor: "#5E17EB", width: width, overflow: "hidden", height: height}}>
      <View style={{position: "relative", height: 150, marginLeft: "5%", marginTop: insets.top}}>
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
        <Overlay online={online}/>
      </View>
    </View>
  )
}

export default function DefaultMainWelcomePage() {
  return <WelcomePage online={false}/>
}