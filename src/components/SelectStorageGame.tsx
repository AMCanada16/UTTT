/*
  UTTT
  Andrew Mainella
  27 September 2024
*/
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View, Text, FlatList, Modal } from "react-native";
import { useSelector } from "react-redux";
import { addGame, getStorageGames } from "@functions/storageFunctions";
import store, { RootState } from "@redux/store";
import { CheckMarkIcon, ChevronLeft, CircleIcon, CloseIcon, TrashIcon } from "@components/Icons";
import DefaultButton from "@components/DefaultButton";
import { DeleteText } from "@components/AccountPage";
import { deleteGame as deleteStorageGame } from "@functions/storageFunctions";
import { aiHistorySlice } from "@redux/reducers/aiHistoryReducer";
import { loadingState } from "@types";

function DeleteGame({
  deleting,
  selectedDelete,
  onBack
}:{
  deleting: string;
  selectedDelete: string[]
  onBack: (result: loadingState) => void
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [deleteState, setDeleteState] = useState<loadingState>(loadingState.notStarted)
  const [secondsLeft, setSecondsLeft] = useState<number>(3)

  async function deleteGame() {
    setDeleteState(loadingState.loading)
    if (deleting === "array") {
      let failed = false
      for (const x of selectedDelete) {
        const result = await deleteStorageGame(x)
        if (result !== loadingState.success) {
          failed = true
          setDeleteState(loadingState.failed)
        }
      }
      if (!failed) {
        // Success
        setDeleteState(loadingState.notStarted)
        onBack(loadingState.success)
      }
    } else {
      const result = await deleteStorageGame(deleting)
      if (result === loadingState.success) {
        setDeleteState(loadingState.notStarted)
        onBack(loadingState.success)
      } else {
        setDeleteState(loadingState.failed)
      }
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
          <DefaultButton style={{flexDirection: 'row'}} onPress={() => onBack(loadingState.notStarted)}>
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
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [selectedDelete, setSelectedDelete] = useState<string[]>([])

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
      <DeleteGame deleting={deleting} selectedDelete={selectedDelete} onBack={(e) => {
        if (e = loadingState.success) {
          setDeleting("")
          if (deleting === "array") {
            let newGames = [...games].filter((x) => {return !selectedDelete.includes(x.gameId)})
            setGames(newGames)
          } else {
            let newGames = [...games].filter((x) => {return deleting !== x.gameId})
            setGames(newGames)
            setIsDeleting(false)
          }
        } else {
          setDeleting("")
        }
      }} />
      <View style={{width: width * ((width <= 560) ? 0.95:0.8), backgroundColor: "rgba(255,255,255, 0.95)", height: height * 0.8, borderRadius: 25}}>
        <View style={{marginTop: (width <= 560) ? 15:25, marginHorizontal: (width <= 560) ? 15:25, flexDirection: 'row', marginBottom: 15, justifyContent: 'center'}}>
          <Pressable onPress={() => {onClose()}} style={{position: 'absolute', left: 0}}>
            <CloseIcon width={30} height={30}/>
          </Pressable>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 25}}>Load Game</Text>
          {isDeleting ?
            <View style={{position: 'absolute', right: 0, flexDirection: 'row'}}>
              <Pressable onPress={() => {setIsDeleting(false)}}>
                <CloseIcon width={25} height={25}/>
              </Pressable>
              <Pressable style={{marginLeft: 5, width: 25, height: 25, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                setDeleting("array")
              }}>
                <CheckMarkIcon width={20} height={20}/>
              </Pressable>
            </View>:
            <Pressable onPress={() => {setIsDeleting(true)}} style={{right: 0, position: 'absolute'}}>
              <TrashIcon width={20} height={20}/>
            </Pressable> 
          }
        </View>
        <FlatList
          data={games}
          renderItem={(game) => (
            <DefaultButton
              style={{margin: 5, flexDirection: 'row'}}
              onPress={() => {
                store.dispatch(aiHistorySlice.actions.clearCache())
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
              <Pressable style={{marginLeft: 'auto', marginVertical: 'auto'}} hitSlop={(isDeleting) ? 5:20} onPress={() => {
                if (isDeleting === false) {
                  setDeleting(game.item.gameId)
                } else if (selectedDelete.includes(game.item.gameId)) {
                  setSelectedDelete([...selectedDelete].filter((x) => {return x !== game.item.gameId}))
                } else {
                  setSelectedDelete([...selectedDelete, game.item.gameId])
                }
              }}>
                { (isDeleting && !(selectedDelete.includes(game.item.gameId))) ?
                  <CircleIcon width={20} height={20}/>:null
                }
                { (isDeleting && selectedDelete.includes(game.item.gameId)) ?
                  <View style={{width: 20, height: 20, borderRadius: 20, backgroundColor: 'gray', borderWidth: 2}}/>:null
                }
                { (!isDeleting) ?
                  <TrashIcon width={20} height={20}/>:null
                }
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