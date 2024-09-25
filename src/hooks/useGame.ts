/*
  UTTT
  Andrew Mainella
*/
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { joinGame } from "../functions/OnlineFunctions"
import { useSelector } from "react-redux"
import store, { RootState } from "../redux/store"
import { loadStorageGame, updateStorageGame } from "../functions/StorageFunctions"
import { gameSlice } from "../redux/reducers/gameReducer"
import { getUsername } from "../functions/UserFunctions"

/**
 * A hook
 * @param gameId The id of the game to follow
 * @returns 
 */
function useGameLocal(gameId: string) {
  const [game, setGame] = useState<GameType | undefined>(undefined)
  const cachedGame = useSelector((state: RootState) => state.gameState)
  async function loadGame() {
    if (cachedGame.gameId === gameId) {
      setGame(cachedGame)
    } else {
      const loadedGame = await loadStorageGame(gameId)
      store.dispatch(gameSlice.actions.setGame(loadedGame))
    }
  }
  useEffect(() => {
    loadGame()
  }, [cachedGame, gameId])

  useEffect(() => {
    if (game !== undefined) {
      updateStorageGame(game)
    }
  }, [game])

  return game
}

function useGameOnline(gameId: string) {
  const [game, setGame] = useState<GameType | undefined | 'loading'>('loading')
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Games", gameId ? gameId.replace(/ /g,''):""), async (doc) => {
      if (doc.exists()){
        const data = doc.data();
        const result: GameType = {
          currentTurn: data["currentTurn"],
          date: data["date"],
          data: data["data"],
          gameOver: data["gameOver"],
          selectedGrid: data["selectedGrid"],
          gameType: "online",
          gameId: data["gameId"],
          users: data["users"],
          joinRule: data["joinRule"],
          invitations: data["invitations"],
          owner: data["owner"]
        }
        const uid = auth.currentUser?.uid
        if ((data["users"] as compressedUserType[]).some((e) => {return e.userId === uid}) === false && uid !== undefined){
          const username = await getUsername(uid)
          if (username !== undefined) {
            joinGame(gameId, uid)
          }
        }
        store.dispatch(gameSlice.actions.setGame(result))
        setGame(result)
      } else {
        setGame(undefined)
      }
    });
    return () => {
      unsub()
    }
  }, [])
  return game
}

export default function useGame(gameId: string, online: boolean) {
  if (online) {
    return useGameOnline(gameId)
  }
  return useGameLocal(gameId)
}