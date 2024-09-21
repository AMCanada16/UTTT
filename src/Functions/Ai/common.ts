/*
  UTTT
  Andrew Mainella
  September 21 2024
*/
import { perdict } from "./index";

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
  let newMiniGame = await perdict(game.data.inner)
  newGame.data.inner = newMiniGame
  return newGame
}