/*
  UTTT
  Andrew Mainella
*/
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../Firebase/Firebase"
import { getDimentionalFromData, joinGame } from "../Functions/OnlineFunctions"
import { useSelector } from "react-redux"
import store, { RootState } from "../Redux/store"
import { loadStorageGame, updateStorageGame } from "../Functions/StorageFunctions"
import { gameSlice } from "../Redux/reducers/gameReducer"

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
  const [game, setGame] = useState<GameType | undefined>(undefined)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Games", gameId ? gameId.replace(/ /g,''):""), (doc) => {
      if (doc.exists()){
        const data = doc.data();
        const result: GameType = {
          currentTurn: data["currentTurn"],
          date: data["date"],
          data: getDimentionalFromData(data["gameStateInner"], data["gameStateValue"], data["gameStateActive"]),
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
          joinGame(gameId, uid)
        }
        store.dispatch(gameSlice.actions.setGame(result))
        setGame(result)
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