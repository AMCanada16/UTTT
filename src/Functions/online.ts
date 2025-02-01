/*
  UTTT
  Andrew Mainella
  22 September 2024
  online.ts
  Online game functions.
*/
import { and, collection, doc, getCountFromServer, getDocsFromServer, or, orderBy, query, runTransaction, updateDoc, where } from "firebase/firestore";
import { auth, db } from '@functions/firebase';
import { gridStateMode, loadingState } from '@types';

/**
 * Creates a new game online
 * @param gameSate The current game, Dimentional Type
 * @param playerMode The player mode assigned to the user uid.
 * @param userUid The useruid of the player creating the game.
 * @returns nothing on failure and the game id of the newly created game.
 */
export async function createGame(gameSate: DimentionalType, playerMode: gridStateMode, userUid: string): Promise<string | null> {
  var date = new Date();
  const randomId = Math.floor(1000000 + Math.random() * 9000000)
  try{
    await runTransaction(db, async (transaction) => {
      const result = await transaction.get(doc(db, "Games", randomId.toString()))
      if (!result.exists()){
        transaction.set(doc(db, "Games", randomId.toString()), {
          currentTurn: playerMode,
          date: date.toISOString(),
          gameOver: gridStateMode.open,
          data: gameSate,
          users: [{
            userId: userUid,
            player: playerMode
          }],
          gameId: randomId.toString(),
          gameType: "online",
          selectedGrid: 0,
          joinRule: 'friends',
          invitations: [],
          owner: userUid
        })
      }
    })
    return randomId.toString()
  } catch (error: any) {
  }
  return null
}

/**
 * A function that updates an online game given a game type
 * @param gameState the state of the current game
 * @returns a loading state if it failed
 */
export async function updateGame(gameState: GameType): Promise<loadingState.failed | loadingState.success> {
  try {
    await updateDoc(doc(db, "Games", gameState.gameId), {
      currentTurn: gameState.currentTurn,
      date: new Date().toISOString(),
      gameOver: gameState.gameOver,
      data: gameState.data,
      selectedGrid: gameState.selectedGrid,
      gameType: gameState.gameType,
      gameId: gameState.gameId
    })
    return loadingState.success
  } catch {
    return loadingState.failed
  }
}

/**
 * A function to add the user to the players. Will fail if two players are already in the game
 * @param gameId The id of the game to join
 * @param currentUserId The uid of the joining user
 * @returns a boolean on the result
 * @todo Add a check to see if the user is already in the game
 */
export async function joinGame(gameId: string, currentUserId: string): Promise<boolean> {
  let added = false
  try{
    await runTransaction(db, async (transaction) => {
      const result = await transaction.get(doc(db, "Games", gameId))
      if (result.exists()){
        const data = result.data()
        if (data["users"].length < 2){
          let newUsers: compressedUserType[] = [...data["users"]]
          newUsers.push({
            userId: currentUserId,
            player: gridStateMode.o
          })
          await transaction.update(doc(db, "Games", gameId), {
            users: newUsers
          })
          added = true
        }
      } else {
        added = false
      }
    })
  } catch (error: any) {
    return false
  }
  return added
}

/**
 * Gets the online tic tac toe games that are avaliable to the user
 * @param joinRule The join rule of the game
 * @param currentFriends The current friends of the user as an array of ids.
 * @returns An array of games or a failed state
 */
export async function getOnlineGames(joinRule: joinRules, currentFriends: string[]): Promise<GameType[] | loadingState.failed> {
  try {
    let uid = auth.currentUser?.uid
    if (uid === undefined) {
      return loadingState.failed
    }
    let games: GameType[] = []
    let q = query(collection(db, "Games"), or(
      and(where("joinRule", "==", "invitations"), where("invitations", "array-contains", uid)),
      where("joinRule", "==", "public"),
      where('owner', '==', uid)
    ), orderBy("gameId"))
    if (joinRule === 'public' && currentFriends.length !== 0) {
      q = query(collection(db, "Games"), or(
        and(where("joinRule", "==", "invitations"), where("invitations", "array-contains", uid)),
        and(where("joinRule", "==", "friends"), where('owner', 'in', currentFriends)),
        where("joinRule", "==", "public"),
        where('owner', '==', uid)
      ), orderBy("gameId"))
    }
    if (joinRule === 'invitation') {
      q = query(collection(db, "Games"), where("invitations", "array-contains-any", [uid]), orderBy("gameId"))
    }
    if (joinRule === 'friends') {
      if (currentFriends.length === 0) {
        return []
      }
      q = query(collection(db, "Games"), and(or(where("joinRule", "==", "public"), where("joinRule", "==", "friends")), or(where('owner', 'in', currentFriends), where('owner', '==', uid))), orderBy("gameId"))
    }
    let result = await getDocsFromServer(q)
    result.docs.forEach((e) => {
      const data = e.data()
      games.push({
        currentTurn: data["currentTurn"],
        date: data["date"],
        gameOver: data["gameOver"],
        data: data["data"],
        selectedGrid: data["selectedGrid"],
        gameType: data["gameType"],
        gameId: data["gameId"],
        owner: data["owner"],
        joinRule: data["joinRule"]
      })
    })
    return games
  } catch (e) {
    console.log(e)
    return loadingState.failed
  }
}


/**
 * Get the online stats of the logged in user
 * @returns A failed state or the online stats of the user
 */
export async function getOnlineGameStats(): Promise<loadingState.failed | OnlineStatsType> {
  let uid = auth.currentUser?.uid
  if (uid !== undefined) {
    try {
      const gamesPlayedQuery = query(collection(db, "Games"), where("users", "array-contains-any", [{
        player: gridStateMode.x,
        userId: uid
      }, {
        player: gridStateMode.o,
        userId: uid
      }]))
      const gamesPlayedResult = await getCountFromServer(gamesPlayedQuery)
      const gamesPlayed = gamesPlayedResult.data().count
      const activeGamesQuery = query(collection(db, "Games"), and(where("gameOver", "==", false), where("users", "array-contains-any", [{
        player: gridStateMode.x,
        userId: uid
      }, {
        player: gridStateMode.o,
        userId: uid
      }])))
      const activePlayedResult = await getCountFromServer(activeGamesQuery)
      const activeGames = activePlayedResult.data().count
      const wonGamesQuery = query(collection(db, "Games"), where("userWon", "==", uid))
      const wonGamesResult = await getCountFromServer(wonGamesQuery)
      const gamesWon = wonGamesResult.data().count
      return {
        gamesPlayed,
        activeGames,
        gamesWon
      }
    } catch (error) {
      return loadingState.failed
    }
  }
  return loadingState.failed
}

/**
 * Gets the count of invitations
 * @returns A failed state or a number
 */
export async function getInvitationsCount(): Promise<{
  result: loadingState.failed
} | {
  result: loadingState.success,
  data: number
}> {
  try {
    let uid = auth.currentUser?.uid
    if (uid === undefined) {
      return {
        result: loadingState.failed
      }
    }
    const q = query(collection(db, "Games"), where("invitations", "array-contains", uid))
    const countResult = await getCountFromServer(q)
    return {
      result: loadingState.success,
      data: countResult.data().count 
    }
  } catch (error) {
    return {
      result: loadingState.failed
    }
  }
}