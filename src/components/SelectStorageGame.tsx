import { useSelector } from "react-redux";
import { addGame, getStorageGames } from "../functions/StorageFunctions";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store";
import { useRouter } from "expo-router";
import { Pressable, View, Text, FlatList, Modal } from "react-native";
import { ChevronLeft, CloseIcon, TrashIcon } from "./Icons";
import DefaultButton from "./DefaultButton";
import { DeleteText } from "./AccountPage";
import { loadingState } from "../Types";
import { deleteGame as deleteStorageGame } from "../functions/StorageFunctions";

function DeleteGame({
  deleting,
  onBack
}:{
  deleting: string;
  onBack: (gameId: string) => void
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [deleteState, setDeleteState] = useState<loadingState>(loadingState.notStarted)
  const [secondsLeft, setSecondsLeft] = useState<number>(3)

  async function deleteGame() {
    setDeleteState(loadingState.loading)
    const result = await deleteStorageGame(deleting)
    if (result === loadingState.success) {
      setDeleteState(loadingState.success)
      setDeleteState(loadingState.notStarted)
      onBack(deleting)
    } else {
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
          <Text style={{marginTop: 4, marginBottom: 4}}>This will delete the game permentaly. Are you sure you want to delete your game?</Text>
          <DefaultButton
            style={{flexDirection: 'row', marginBottom: 5, backgroundColor:  (secondsLeft !== 0) ? "gray":"red",  justifyContent: 'center'}}
            onPress={() => {
              if (secondsLeft === 0) {
                deleteGame()
              }
            }}
            disabled={secondsLeft !== 0}
          >
            <DeleteText secondsLeft={secondsLeft} deleteState={deleteState} game/>
          </DefaultButton>
          <DefaultButton style={{flexDirection: 'row'}} onPress={() => onBack("")}>
            <ChevronLeft width={20} height={20}/>
            <Text style={{marginVertical: 3}}>Go Back</Text>
          </DefaultButton>
        </View>
      </View>
    </Modal>
  )
}

export default function SelectStorageGames({isFriend, onClose}:{isFriend: boolean, onClose: () => void}) {
  const router = useRouter();
  const [games, setGames] = useState<GameType[]>([])
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [deleting, setDeleting] = useState<string>("")

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
    <>
      <DeleteGame deleting={deleting} onBack={(e) => {
        setDeleting("")
        if (e !== "") {
          let newGames = [...games].filter((x) => {return x.gameId !== e})
          setGames(newGames)
        }
      }} />
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
              <Text style={{marginRight: 5, marginVertical: 3}}>{game.item.gameId}</Text>
              <Text style={{marginVertical: 3}}>{new Date(game.item.date).toLocaleString('en-CA', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}</Text>
              <Pressable style={{marginLeft: 'auto'}} onPress={() => {setDeleting(game.item.gameId)}}>
                <TrashIcon width={20} height={20}/>
              </Pressable>
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
    </>
  )
}