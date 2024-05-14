/*
  UTTT
  Andrew Mainella
  OnlineFunctions.ts
  Online game functions.
*/
import { auth, db } from '../firebase';
import { and, collection, doc, getCountFromServer, getDocs, getDocsFromServer, or, orderBy, query, runTransaction, updateDoc, where } from "firebase/firestore"
import { loadingState } from '../Types';

enum gridStateMode{
  Open,
  X,
  O,
  Full
}
/**
 * Converts the Dimentional type to multiple 1D arrays to be stored in firebase
 * @param gameSate The Dimentional Type to convert
 * @returns multiple 1D arrays
 */
export function getDatafromDimentionalGrid(gameSate: DimentionalType): {activeValues: number[], innerValues: number[], innerValueActive: {
  xOne: number;
  xTwo: number;
  yOne: number;
  yTwo: number;
  firstIndex: number;
  secondIndex: number
}[]}{
  var innerValueActive: {
    xOne: number;
    xTwo: number;
    yOne: number;
    yTwo: number;
    firstIndex: number;
    secondIndex: number
  }[] = []
  var innerValues: number[] = []
  for(var index = 0; index < gameSate.inner.length; index++){
    for(var indexIn = 0; indexIn < gameSate.inner[index].length; indexIn++){
      const active = gameSate.inner[index][indexIn].active
      if (active !== undefined) {
        innerValueActive.push({
          ...active,
          firstIndex: index,
          secondIndex: indexIn
        })
      }
      for(var indexInIn = 0; indexInIn < gameSate.inner[index][indexIn].value.length; indexInIn++){
        for(var indexInInIn = 0; indexInInIn < gameSate.inner[index][indexIn].value[indexInIn].length; indexInInIn++){
          innerValues.push(gameSate.inner[index][indexIn].value[indexInIn][indexInInIn])
        }
      }
    }
  }
  var activeValues: number[] = []
  for(var indexActive = 0; indexActive < gameSate.value.length; indexActive++){
    for(var indexIn = 0; indexIn < gameSate.value[indexActive].length; indexIn++){
      activeValues.push(gameSate.value[indexActive][indexIn])
    }
  }
  return {
    activeValues: activeValues,
    innerValues: innerValues,
    innerValueActive
  }
}

/**
 * Creates a new game online
 * @param gameSate The current game, Dimentional Type
 * @param playerMode The player mode assigned to the user uid.
 * @param userUid The useruid of the player creating the game.
 * @returns nothing on failure and the game id of the newly created game.
 */
export async function createNewGame(gameSate: DimentionalType, playerMode: gridStateMode, userUid: string): Promise<string | null> {
  var date = new Date();
  const randomId = Math.floor(1000000 + Math.random() * 9000000)
  try{
    await runTransaction(db, async (transaction) => {
      const result = await transaction.get(doc(db, "Games", randomId.toString()))
      if (!result.exists()){
        const firebaseData = getDatafromDimentionalGrid(gameSate)
        transaction.set(doc(db, "Games", randomId.toString()), {
          currentTurn: playerMode,
          date: date.toISOString(),
          gameOver: false,
          gameStateValue: firebaseData.activeValues,
          gameStateInner: firebaseData.innerValues,
          gameStateActive: firebaseData.innerValueActive,
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
 */
export function updateGame(gameState: GameType){
  const firebaseData = getDatafromDimentionalGrid(gameState.data)
  updateDoc(doc(db, "Games", gameState.gameId), {
    currentTurn: gameState.currentTurn,
    date: new Date().toISOString(),
    gameOver: gameState.gameOver,
    gameStateValue: firebaseData.activeValues,
    gameStateInner: firebaseData.innerValues,
    gameStateActive: firebaseData.innerValueActive,
    selectedGird: gameState.selectedGrid,
    gameType: gameState.gameType,
    gameId: gameState.gameId
  })
}

export function getDimentionalFromData(gameStateInner: number[], gameStateValueData: number[], innerValueActive: {
  xOne: number;
  xTwo: number;
  yOne: number;
  yTwo: number;
  firstIndex: number;
  secondIndex: number
}[]): DimentionalType{
  // Get Inner
  var rootTypeFirst: RootType[][] = []
  for (let i = 0; i < gameStateInner.length; i += 27) {
    const chunk = gameStateInner.slice(i, i + 27);
    var rootTypeSecond: RootType[] = []
    for (let index = 0; index < chunk.length; index += 9){
      const innerChunk = chunk.slice(index, index + 9);
      var gridTypeFirst: gridStateMode[][] = []
      for(let innerChunkIndex = 0; innerChunkIndex < innerChunk.length; innerChunkIndex += 3){
        const innerChunkSecond = innerChunk.slice(innerChunkIndex, innerChunkIndex + 3);
        var gridTypeSecond: gridStateMode[] = []
        for(let innerChunkSecondIndex = 0; innerChunkSecondIndex < innerChunkSecond.length; innerChunkSecondIndex++){
          gridTypeSecond.push(innerChunkSecond[innerChunkSecondIndex])
        }
        gridTypeFirst.push(gridTypeSecond)
      }
      const activeValue = innerValueActive.find((e) => {
        return e.firstIndex === i && e.secondIndex === index
      })
      rootTypeSecond.push({
        value: gridTypeFirst,
        active: activeValue
      })
    }
    rootTypeFirst.push(rootTypeSecond)
  }
  // Get value
  var gameStateValue: gridStateMode[][] = []
  for(let index = 0; index < gameStateValueData.length; index += 3){
    const chunk =  gameStateValueData.slice(index, index + 3);
    var gameStateValueInner: gridStateMode[] = []
    for(let i = 0; i < chunk.length; i++){
      gameStateValueInner.push(chunk[i])
    }
    gameStateValue.push(gameStateValueInner)
  }
  const gameSate = {
    inner: rootTypeFirst,
    value: gameStateValue
  }
  return gameSate
}

/**
 * A function to add the user to the players. Will fail if two players are already in the game
 * @param gameId The id of the game to join
 * @param currentUserId The uid of the joining user
 * @returns a boolean on the result
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
            player: gridStateMode.O
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
      where("joinRule", "==", "public")
    ), orderBy("gameId"))
    if (joinRule === 'public' && currentFriends.length !== 0) {
      q = query(collection(db, "Games"), or(
        and(where("joinRule", "==", "invitations"), where("invitations", "array-contains", uid)),
        and(where("joinRule", "==", "friends"), where('owner', 'in', currentFriends)),
        and(where("joinRule", "==", "friends"), where('owner', '==', uid)),
        where("joinRule", "==", "public")
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
        data: getDimentionalFromData(data["gameStateInner"], data["gameStateValue"], data["gameStateActive"]),
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


export async function getOnlineGameStats(): Promise<loadingState.failed | OnlineStatsType> {
  let uid = auth.currentUser?.uid
  if (uid !== undefined) {
    try {
      const gamesPlayedQuery = query(collection(db, "Games"), where("users", "array-contains-any", [{
        player: gridStateMode.X,
        userId: uid
      }, {
        player: gridStateMode.O,
        userId: uid
      }]))
      const gamesPlayedResult = await getCountFromServer(gamesPlayedQuery)
      const gamesPlayed = gamesPlayedResult.data().count
      const activeGamesQuery = query(collection(db, "Games"), and(where("gameOver", "==", false), where("users", "array-contains-any", [{
        player: gridStateMode.X,
        userId: uid
      }, {
        player: gridStateMode.O,
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
    } catch {
      return loadingState.failed
    }
  }
  return loadingState.failed
}

/**
 * Gets the count of invitations
 * @returns A failed state or a number
 */
export async function getInvitationsCount(): Promise<loadingState.failed | number> {
  try {
    let uid = auth.currentUser?.uid
    if (uid === undefined) {
      return loadingState.failed
    }
    const q = query(collection(db, "Games"), where("invitations", "array-contains", uid))
    const countResult = await getCountFromServer(q)
    return countResult.data().count
  } catch {
    return loadingState.failed
  }
}