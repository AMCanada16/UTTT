import { db, auth } from '../Firebase/Firebase';
import { signInAnonymously } from 'firebase/auth';
import {doc, runTransaction, updateDoc} from "firebase/firestore"

enum gridStateMode{
  Open,
  X,
  O,
  Full
}

export function getDatafromDimentionalGrid(gameSate: DimentionalType): {activeValues: number[], innerValues: number[]}{
  var innerValues: any[] = []
  for(var index = 0; index < gameSate.inner.length; index++){
    for(var indexIn = 0; indexIn < gameSate.inner[index].length; indexIn++){
      for(var indexInIn = 0; indexInIn < gameSate.inner[index][indexIn].value.length; indexInIn++){
        for(var indexInInIn = 0; indexInInIn < gameSate.inner[index][indexIn].value[indexInIn].length; indexInInIn++){
          innerValues.push(gameSate.inner[index][indexIn].value[indexInIn][indexInInIn])
        }
      }
    }
  }
  var activeValues: any[] = []
  for(var indexActive = 0; indexActive < gameSate.value.length; indexActive++){
    for(var indexIn = 0; indexIn < gameSate.value[indexActive].length; indexIn++){
      activeValues.push(gameSate.value[indexActive][indexIn])
    }
  }
  return {
    activeValues: activeValues,
    innerValues: innerValues
  }
}

export async function createNewGame(gameSate: DimentionalType, playerMode: gridStateMode): Promise<string | null> {
  var date = new Date();
  const randomId = Math.floor(1000000 + Math.random() * 9000000)
  var userUid = ""
  try{
    const result = await signInAnonymously(auth)
    userUid = result.user.uid
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("error", errorMessage)
  }
  if (userUid !== ""){
    try{
      await runTransaction(db, async (transaction) => {
        const result = await transaction.get(doc(db, "Games", randomId.toString()))
        if (!result.exists()){
          const firebaseData = getDatafromDimentionalGrid(gameSate)
          transaction.set(doc(db, "Games", randomId.toString()), {
            date: date,
            gameStateActive: (gameSate.active === undefined) ? null: gameSate.active,
            gameStateValue: firebaseData.activeValues,
            gameStateInner: firebaseData.innerValues,
            currentTurn: playerMode,
            users: [{
              userID: userUid,
              player: playerMode
            }]
          })
        }
      })
      return randomId.toString()
    } catch (error: any) {
      console.log(error.message)
    }
  }
  return null
}

export function updateGame(gameId: string, gameSate: DimentionalType, playerMode: gridStateMode){
  const firebaseData = getDatafromDimentionalGrid(gameSate)
  updateDoc(doc(db, "Games", gameId), {
      gameStateActive: (gameSate.active === undefined) ? null: gameSate.active,
      gameStateValue: firebaseData.activeValues,
      gameStateInner: firebaseData.innerValues,
      currentTurn: playerMode,
    })
}

export function getDimentionalFromData(gameStateInner: number[], gameStateValueData: number[]): DimentionalType{
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
      rootTypeSecond.push({
        value: gridTypeFirst
      })
    }
    rootTypeFirst.push(rootTypeSecond)
  }
  var gameStateValue: gridStateMode[][] = []
  for(let index = 0; index < gameStateValueData.length; index += 3){
    const chunk =  gameStateValueData.slice(index, index + 27);
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
  console.log(gameSate)
  return gameSate
}

export async function loadGame(inputID: string): Promise<DimentionalType | undefined> {
  var gameSate: DimentionalType | undefined = undefined
  try{
    await runTransaction(db, async (transaction) => {
      const result = await transaction.get(doc(db, "Games", inputID))
      if (result.exists()){
        const data = result.data()
        if (data["users"].length <= 2){
          gameSate = getDimentionalFromData(data["gameStateInner"], data["gameStateValue"])
        }
      } else {
          console.log("This document", inputID, "does not exist")
      }
    })
  } catch (error: any) {
    console.log("error", error.message)
  }
  return gameSate
}