import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { RootState } from "../redux/store"
import { useSelector } from "react-redux"
import useUsernameExists from "../hooks/useUsernameExists"
import useIsConnected from "../hooks/useIsConnected"
import { createNewGame, getOnlineGames } from "../functions/OnlineFunctions"
import { emptyGame, gridStateMode, joinRulesArray, loadingState } from "../Types"
import { auth, db } from "../firebase"
import { ActivityIndicator, Pressable, View, Text, TextInput, Modal, FlatList } from "react-native"
import OnlineAuthenticationComponent from "./OnlineAuthenticationComponent"
import { ChevronLeft, CloseIcon, OfflineIcon, TrashIcon } from "./Icons"
import DefaultButton from "./DefaultButton"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import UsernameComponent from "./AddUserComponent"
import { getFriends } from "../functions/UserFunctions"
import { DeleteText } from "./AccountPage"
import { deleteDoc, doc } from "firebase/firestore"

function DeleteGame({
  deleting,
  onBack
}:{
  deleting: string;
  onBack: () => void
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [deleteState, setDeleteState] = useState<loadingState>(loadingState.notStarted)
  const [secondsLeft, setSecondsLeft] = useState<number>(3)

  async function deleteGame() {
    setDeleteState(loadingState.loading)
    try {
      await deleteDoc(doc(db, "Games", deleting))
      setDeleteState(loadingState.success)
      onBack()
    } catch {
      setDeleteState(loadingState.failed)
    }
  }
  
  useEffect(() => {
    setSecondsLeft(3)
    let time = 3
    const id = setInterval(() => {
      if (time < 1) {
        clearInterval(id)
      } else {
        setSecondsLeft(time - 1)
        time -= 1
      }
    }, 1000)
    return () => {
      clearInterval(id)
    }
  }, [deleting])

  return (
    <Modal visible={deleting !== ""} transparent>
      <View style={{width, height, alignContent: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(169,169,169,0.9)'}}>
        <View style={{padding: 10, borderRadius: 4, borderWidth: 1, borderColor: 'black', width: width * ((width <= 560) ? 0.95:0.8), backgroundColor: 'white'}}>
          <Text style={{fontSize: 30, textAlign: 'center'}}>Are you sure?</Text>
          <Text style={{marginTop: 4, marginBottom: 4}}>This will delete the game permentaly, this will also remove it from your statics. Are you sure you want to delete your game?</Text>
          <DefaultButton
            style={{flexDirection: 'row', marginBottom: 5, backgroundColor:  (secondsLeft !== 0) ? "gray":"red",  justifyContent: 'center'}}
            onPress={() => {
              deleteGame()
            }}
          >
            <DeleteText secondsLeft={secondsLeft} deleteState={deleteState} game/>
          </DefaultButton>
          <DefaultButton style={{flexDirection: 'row'}} onPress={() => onBack()}>
            <ChevronLeft width={20} height={20}/>
            <Text style={{marginVertical: 3}}>Go Back</Text>
          </DefaultButton>
        </View>
      </View>
    </Modal>
  )
}

export default function SelectOnlineGame({onClose}:{onClose: () => void}){
  const router = useRouter()
  const [gameId, setGameID] = useState<string>("")
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [games, setGames] = useState<GameType[]>([])
  const [isAuth, setIsAuth] = useState(false)
  const usernameExists = useUsernameExists().exists
  const [searchMode, setSearchMode] = useState<joinRules>("public")
  const isConnected = useIsConnected()
  const [deleting, setDeleting] = useState<string>("")

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
    <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
      <Pressable style={{position: 'absolute', top: (width <= 560) ? 25:35, left: (width <= 560) ? 25:35}} onPress={() => {
        router.push("/")
      }}>
        <CloseIcon width={30} height={30}/>
      </Pressable>
      <OfflineIcon width={30} height={30}/>
      <Text>Offline</Text>
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
    <>
      <DeleteGame deleting={deleting} onBack={() => {setDeleting("")}}/>
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
              <Text style={{marginRight: 5, marginVertical: 3}}>{game.item.gameId}</Text>
              <Text style={{marginVertical: 3}}>{new Date(game.item.date).toLocaleString('en-CA', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}</Text>
              {game.item.gameType === 'online' && game.item.owner === auth.currentUser?.uid ?
                <Pressable style={{marginLeft: 'auto'}} onPress={() => {
                  setDeleting(game.item.gameId)
                }}>
                  <TrashIcon width={20} height={20}/>
                </Pressable>:null
              }
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
    </>
  )
}