import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyGame } from '../Types';
import store from '../Redux/store';

declare global{
  type gameStorageType = {
    gameType: string
    gameState: string
    lastPlayed: number
    gameId: string
    gameOver: boolean
  }
}

export async function addGame(gameType: "Friend" | "AI", gameState?: DimentionalType): Promise<string> { //If game state is empty the empty game state will be used
  try {
    //Test
    await AsyncStorage.removeItem('UTTT_Saves')
    //Text
    const value = await AsyncStorage.getItem('UTTT_Saves');
    var gameData: gameStorageType = {
      gameType: gameType,
      gameState: JSON.stringify((gameState) ? gameState:emptyGame),
      lastPlayed: Date.now(),
      gameId: Math.floor(1000000 + Math.random() * 9000000).toString(),
      gameOver: false
    }
    if (value !== null){
      var data: Map<string, string> = JSON.parse(value)
      var randomId = Math.floor(1000000 + Math.random() * 9000000)
      var randIDExists = true
      var iterations = 0
      while (randIDExists){
        console.log("This is result", data.get("YAS QUEEN"))
        if (data.has(randomId.toString())){
          randIDExists = false
        } else if (iterations >= 5000) {
          throw new Error("Could not find a empty game. Exceded game limit")
        } else {
          randomId = Math.floor(1000000 + Math.random() * 9000000)      
        }
        iterations++
      }
      data.set(randomId.toString(), JSON.stringify(gameData))
      var obj = Object.fromEntries(data);
      var jsonString = JSON.stringify(obj);
      await AsyncStorage.setItem('UTTT_Saves', jsonString);
      return randomId.toString()
    } else {
      const randomId = Math.floor(1000000 + Math.random() * 9000000)
      gameData.gameId = randomId.toString()
      const data = new Map([[randomId.toString(), JSON.stringify(gameData)]])
      var obj = Object.fromEntries(data);
      var jsonString = JSON.stringify(obj);
      await AsyncStorage.setItem('UTTT_Saves', jsonString);
      return randomId.toString()
    }
  } catch (e) {
    throw new Error("An Error Has Occured")
  }
}

export async function updateStorageGame(id: string, newState: DimentionalType) {
  try{
    const value = await AsyncStorage.getItem('UTTT_Saves');
    if (value !== null){
      var data: Map<string, string> = new Map(Object.entries((JSON.parse(value))))
      if (data.has(id)){
        const resultData: string = data.get(id)!
        var jsonResult: gameStorageType  = JSON.parse(resultData)
        jsonResult.gameState = JSON.stringify(newState)
        jsonResult.lastPlayed = Date.now()
        jsonResult.gameOver = store.getState().isGameOver
        data.set(id, JSON.stringify(jsonResult))
        var obj = Object.fromEntries(data);
        var jsonString = JSON.stringify(obj);
        await AsyncStorage.mergeItem('UTTT_Saves', jsonString);
      } else {
        //TO DO throw error
      }
    } else {
      //TO DO throw error
    }
  } catch {
    //TO DO handle/throw error
  }
}

export async function deleteGame(id: string) {
  try {
    const value = await AsyncStorage.getItem('UTTT_Saves');
    if (value !== null){
      var data: Map<string, string> =  new Map(Object.entries((JSON.parse(value))))
      if (data.has(id)){
        data.delete(id)
        var obj = Object.fromEntries(data);
        var jsonString = JSON.stringify(obj);
        await AsyncStorage.setItem('UTTT_Saves', jsonString);
      } else {
        //TO DO throw error
      }
    } else {
      //TO DO throw error
    }
  } catch(e) {
  //TO DO handle/throw error
  }
}

export async function getGames(gameType:  "Friend" | "AI"): Promise<gameStorageType[]> {
  var result: gameStorageType[] = []
  try{
    const value = await AsyncStorage.getItem('UTTT_Saves');
    console.log(value)
    if (value !== null){
      var data: Map<string, string> = new Map(Object.entries((JSON.parse(value))))
      data.forEach((gameData) => {
        console.log("This is game data", gameData)
        const parsedGameData: gameStorageType = JSON.parse(gameData)
        if (parsedGameData.gameType === gameType){
          result.push(parsedGameData)
        }
      })
    } else {
      //TO DO throw error
    }
  } catch (e) {
//TO DO handle/throw error
    throw new Error("An Error ocuured")
  }
  return result
}

export async function loadStorageGame(id: string): Promise<gameStorageType>{
  try{
    const value = await AsyncStorage.getItem('UTTT_Saves');
    console.log(value)
    if (value !== null){
      var data: Map<string, string> = new Map(Object.entries((JSON.parse(value))))
      if (data.has(id)){
        return JSON.parse(data.get(id)!)
      } else {
        //TO DO throw error
        throw new Error("The ID doesn't exist")
      }
    } else {
      //TO DO throw error
      throw new Error("Their isn't any games that exist")
    }
  } catch (e) {
    //TO DO handle/throw error
    throw new Error("An Error Occured while trying to load the game")
  }
}