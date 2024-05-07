import { db, auth } from '../Firebase/Firebase';
import { signOut as signOutFirebase } from 'firebase/auth';
import { collection, doc, getDocs, runTransaction, updateDoc } from "firebase/firestore"

enum gridStateMode{
  Open,
  X,
  O,
  Full
}

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
          selectedGrid: 0
        })
      }
    })
    return randomId.toString()
  } catch (error: any) {
    console.log(error.message)
  }
  return null
}

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

export async function joinGame(gameId: string, currentUserId: string): Promise<boolean> {
  let added = false
  try{
    await runTransaction(db, async (transaction) => {
      const result = await transaction.get(doc(db, "Games", gameId))
      if (result.exists()){
        const data = result.data()
        if (data["users"].length <= 2){
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

export async function getOnlineGames() {
  let games: GameType[] = []
  let result = await getDocs(collection(db, "Games"))
  result.docs.forEach((e) => {
    const data = e.data()
    games.push({
      currentTurn: data["currentTurn"],
      date: data["date"],
      gameOver: data["gameOver"],
      data: getDimentionalFromData(data["gameStateInner"], data["gameStateValue"], data["gameStateActive"]),
      selectedGrid: data["selectedGrid"],
      gameType: data["gameType"],
      gameId: data["gameId"]
    })
  })
  return games
}