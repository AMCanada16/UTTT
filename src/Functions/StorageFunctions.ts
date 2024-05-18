/*
  UTTT
  Andrew Mainella
  8 May 2024
  StorageFunctions.ts
  Storage functions for the games.
*/
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyGame, gridStateMode, loadingState } from '../Types';

/**
 * A function that creates a storage game.
 * @param gameType Storage Game Type.
 * @returns The game id of the newly created game.
 */
export async function addGame(gameType: "ai"|"friend"): Promise<string> {
  try {
    const value = await AsyncStorage.getItem('UTTT_Saves');
    if (value !== null){
      var data: Map<string, string> = new Map()
      const mapObject = JSON.parse(value)
      for (const gameId in mapObject) {
        if (!data.has(gameId)) {
          data.set(gameId, mapObject[gameId])
        }
      }
      var randomId = Math.floor(1000000 + Math.random() * 9000000)
      var randIDExists = true
      var iterations = 0
      while (randIDExists){
        if (!data.has(randomId.toString())) {
          randIDExists = false
        } else if (iterations >= 5000) {
          throw new Error("Could not find a empty game. Exceded game limit")
        } else {
          randomId = Math.floor(1000000 + Math.random() * 9000000)      
        }
        iterations++
      }
      var gameData: GameType = {
        currentTurn: gridStateMode.X,
        date: new Date().toISOString(),
        gameOver: gridStateMode.Open,
        data: emptyGame,
        selectedGrid: 0,
        gameType,
        gameId: randomId.toString()
      }
      data.set(randomId.toString(), JSON.stringify(gameData))
      var obj = Object.fromEntries(data);
      var jsonString = JSON.stringify(obj);
      await AsyncStorage.setItem('UTTT_Saves', jsonString);
      return randomId.toString()
    } else {
      const randomId = Math.floor(1000000 + Math.random() * 9000000)
      var gameData: GameType = {
        currentTurn: 0,
        date: new Date().toISOString(),
        gameOver: gridStateMode.Open,
        data: emptyGame,
        selectedGrid: 0,
        gameType,
        gameId: randomId.toString()
      }
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

/**
 * A function to update a local game.
 * @param game A AI or Friend Game
 * @returns A loading state based on the result of the operation.
 */
export async function updateStorageGame(game: GameType): Promise<loadingState> {
  try{
    const value = await AsyncStorage.getItem('UTTT_Saves');
    if (value !== null){
      var data: Map<string, string> = new Map(Object.entries((JSON.parse(value))))
      if (data.has(game.gameId)){
        data.set(game.gameId, JSON.stringify(game))
        var obj = Object.fromEntries(data);
        var jsonString = JSON.stringify(obj);
        await AsyncStorage.mergeItem('UTTT_Saves', jsonString);
        return loadingState.success
      }
    }
    return loadingState.failed
  } catch {
    return loadingState.failed
  }
}

/**
 * A function that deletes a game in local stoage
 * @param gameId The id of the game to delete
 * @returns The a loading state of the operation
 */
export async function deleteGame(gameId: string): Promise<loadingState> {
  try {
    const value = await AsyncStorage.getItem('UTTT_Saves');
    if (value !== null){
      var data: Map<string, string> =  new Map(Object.entries((JSON.parse(value))))
      if (data.has(gameId)){
        data.delete(gameId)
        var obj = Object.fromEntries(data);
        var jsonString = JSON.stringify(obj);
        await AsyncStorage.setItem('UTTT_Saves', jsonString);
        return loadingState.success
      } else {
        return loadingState.failed
      }
    } else {
      return loadingState.failed
    }
  } catch(e) {
    return loadingState.failed
  }
}

/**
 * A function that get storage games based on the filter
 * @param gameType A filter for the games
 * @returns an array of games or an error
 */
export async function getStorageGames(gameType:  "ai" | "friend"): Promise<GameType[]> {
  var result: GameType[] = []
  try{
    const value = await AsyncStorage.getItem('UTTT_Saves');
    if (value !== null){
      var data: Map<string, string> = new Map(Object.entries((JSON.parse(value))))
      data.forEach((gameData) => {
        const parsedGameData: GameType = JSON.parse(gameData)
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

export async function loadStorageGame(id: string): Promise<GameType>{
  try{
    const value = await AsyncStorage.getItem('UTTT_Saves');
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