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

export async function perdictMoveGame(game: GameType) {
  if (game.selectedGrid !== 0) {
    return perdictOnGrid(game, game.selectedGrid)
  } else {
    let miniGame = twoDtoOneDValue(game.data.value)
    let oldMiniGame = [...miniGame]
    let newMiniGame = await perdict(oldMiniGame)
    let index = 0;
    while (index < oldMiniGame.length) {
      if (newMiniGame[index] !== oldMiniGame[index]) {
        break
      }
      index += 1;
    }
    return perdictOnGrid(game, index + 1)
  }
}

export async function perdictOnGrid(game: GameType, grid: number) {
  let firstIndex = (grid - 1) % 3
  let secondIndex = Math.floor((grid - 1)/3)
  let miniGame = twoDtoOneD(game.data.inner[firstIndex][secondIndex].value)
  let oldMiniGame = [...miniGame]
  let newMiniGame = await perdict(miniGame)
  let index = 0;
  while (index < oldMiniGame.length) {
    if (newMiniGame[index] !== oldMiniGame[index]) {
      break
    }
    index += 1;
  }
  return {
    firstIndex,
    secondIndex,
    thirdIndex: Math.floor(index/3),
    fourthIndex: (index % 3),
    ai: true
  }
}