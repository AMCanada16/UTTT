/*
  UTTT
  Andrew Mainella
  21 September 2024
*/
import * as tf from '@tensorflow/tfjs';
import { getModel } from '.';
import checkIfFilled from '../checkIfFilled';
import indexToGridIndex from '../indexToGridIndex';

export function twoDtoOneDValue(twoD: number[][]) {
  var newArr: number[] = [0,0,0,0,0,0,0,0,0];
  
  for(var i = 0; i < twoD.length; i += 1)
  {
    if (twoD[i].length === 3) {
      newArr[i] = twoD[i][0]
      newArr[i+3] = twoD[i][1]
      newArr[i+6] = twoD[i][2]
    }
  }
  return newArr
}

export function twoDtoOneD(twoD: number[][]) {
  var newArr: number[] = [];
  
  for(var i = 0; i < twoD.length; i += 1)
  {
      newArr = newArr.concat(twoD[i]);
  }
  return newArr
}

export async function perdictMoveGame(game: GameType): Promise<GameType> {
  let newGame = game
  let newMiniGame = await perdict(game.data.inner, game)
  newGame.data.inner = newMiniGame
  return newGame
}

export async function perdict(old: number[], game: GameType) {
  let newOld = old.map((e) => {
    if (e === 2) {
      return 1
    }
    return e
  })
  await tf.ready()
  const currentModel = await getModel()
  const input = tf.tensor2d([newOld]);


  //Crashs if not
  await tf.setBackend("cpu")
 
  let result = currentModel.predict(input) as tf.Tensor
  result.flatten()
  let array: number[][] = await result.array() as number[][]
  result.dispose()
  
  let newArray = [...old]
  let highest = 0
  let highestIndex = 0
  for (let index = 0; index < array[0].length; index += 1) {
    if (array[0][index] > highest && !checkIfFilled(game, index, indexToGridIndex(index), true)) {
      highest = array[0][index]
      highestIndex = index
    }
  }
  newArray[highestIndex] = 2
  return newArray
}