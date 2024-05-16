/*
  UTTT
  Andrew Mainella
*/
import store from "../redux/store"
import { gridStateMode } from "../Types"
import { setCurrentTurn, setGridState, setIsGameOver, setSelectedGrid } from "./gameActions";
import * as tf from '@tensorflow/tfjs';

let model: tf.Sequential | undefined

function createModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [9],
      units: 64,
      activation: "relu"
    })
  );

  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu"
    })
  );

  model.add(
    tf.layers.dense({
      units: 9,
      activation: "softmax"
    })
  );

  const learningRate = 0.005;
  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });
  return model
}

function getModel(): tf.Sequential {
  if (model !== undefined) {
    return model
  } else {
    let result = createModel()
    model = result
    return result
  }
}

export async function perdict(old: number[]) {
  let newOld = old.map((e) => {
    if (e === 2) {
      return 1
    }
    return e
  })
  const currentModel = getModel()
  const input = tf.tensor([newOld]);
  let result = currentModel.predict(input) as tf.Tensor
  result.print()
  result.flatten()
  let array: number[][] = await result.array() as number[][]

  
  let newArray = [...old]
  let highest = 0
  let highestIndex = 0
  for (let index = 0; index < array[0].length; index += 1) {
    if (array[0][index] > highest && old[index] === 0) {
      highest = array[0][index]
      highestIndex = index
    }
  }
  newArray[highestIndex] = 2
  return newArray
}

export const trainModel = async () => {
  const xGames = [[0,1,-1,0,1,-1,0,0,0], [-1,-1,0,0,1,0,0,0,0], [-1,1,0,0,-1,0,0,0,0], [-1,1,0,0,-1,-1,0,1,0], [-1,0,1,0,1,0,0,0,0], [0,-1,0,0,-1,-1,1,1,0], [-1,0,1,0,-1,0,1,0,0], [-1,0,0,0,-1,0,0,1,0]]
  const yGames = [[0,1,-1,0,1,-1,0,1,0], [-1,-1,1,0,1,0,0,0,0], [-1,1,0,0,-1,0,0,0,1], [-1,1,0,1,-1,-1,0,1,0], [-1,0,1,0,1,0,1,0,0], [0,-1,0,0,-1,-1,1,1,1], [-1,0,1,0,-1,0,1,0,1], [-1,0,0,0,-1,0,0,1,1]]

  const xTensors = []
  const yTensors = []
  for (var index = 0; index < xGames.length; index += 1) {
    xTensors.push(tf.tensor1d(xGames[index]))
    yTensors.push(tf.tensor1d(yGames[index]))
  }
  const stackedX = tf.stack(xGames);
  const stackedY = tf.stack(yGames);

  //const stackedX = tf.stack([[1, 0, -1, 0, 1, 0, -1, 0, 0], [-1, 0, 1, 0, 1, 0, 0, 0, -1], [1,1,0,0,-1,0,0,0,0], [-1,-1,0,0,1,0,0,0,1], [-1,1,1,0,-1,1,0,0,0]]);
  //const stackedY = tf.stack([[1, 0, -1, 0, 1, 0, -1, 0, 1], [-1, 0, 1, 0, 1, 0, -1, 0, -1], [1,1,-1,0,-1,0,0,0,0], [-1,-1,-1,0,1,0,0,0,1], [-1,1,1,0,-1,1,0,0,-1]]);

  const allCallbacks = {
    // onTrainBegin: log => console.log(log),
    // onTrainEnd: log => console.log(log),
    // onEpochBegin: (epoch, log) => console.log(epoch, log),
    // onEpochEnd: (epoch: any, log: any) => console.log(epoch, log)
    // onBatchBegin: (batch, log) => console.log(batch, log),
    // onBatchEnd: (batch, log) => console.log(batch, log)
  };

  let currentModel = getModel()
  await currentModel.fit(stackedX, stackedY, {
    epochs: 100,
    shuffle: true,
    batchSize: 32,
    callbacks: allCallbacks
  });


  model = currentModel
};

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
    perdictOnGrid(game, game.selectedGrid)
  } else {
    let miniGame = twoDtoOneD(game.data.value)
    let oldMiniGame = [...miniGame]
    let newMiniGame = await perdict(miniGame)
    let index = 0;
    while (index < oldMiniGame.length) {
      if (newMiniGame[index] !== oldMiniGame[index]) {
        break
      }
      index += 1;
    }
    perdictOnGrid(game, index)
  }
}

function setGameTile(original: DimentionalType, firstIndex: number, secondIndex: number, thirdIndex: number, forthIndex: number, currentTurn: gridStateMode) {
  let newValue = [...original.inner[firstIndex][secondIndex].value]
  let newValueOne = [...newValue[thirdIndex]]
  newValueOne[forthIndex] = currentTurn
  newValue[thirdIndex] = newValueOne
  let newInner = [...original.inner]
  let newInnerOne = [...original.inner[firstIndex]]
  newInnerOne[secondIndex] = {
    ...newInner[firstIndex][secondIndex],
    value: newValue
  }
  newInner[firstIndex] = newInnerOne
  return {
    ...original,
    inner: newInner
  }
}

function setActive(original: DimentionalType, firstIndex: number, secondIndex: number, active?: {
  xOne: number;
  xTwo: number;
  yOne: number;
  yTwo: number;
} | undefined) {
  let newInner = [...original.inner]
  let newInnerOne = [...original.inner[firstIndex]]
  newInnerOne[secondIndex] = {
    ...newInner[firstIndex][secondIndex],
    active
  }
  newInner[firstIndex] = newInnerOne
  return {
    ...original,
    inner: newInner
  }
}

function setValue(original: DimentionalType, firstIndex: number, secondIndex: number, value: gridStateMode) {
  let newValue = [...original.value]
  let newValueOne = [...original.value[firstIndex]]
  newValueOne[secondIndex] = value
  newValue[firstIndex] = newValueOne
  return {
    ...original,
    value: newValue
  }
}

function checkIfGameOver(gridState: DimentionalType, playerMode: gridStateMode, firstIndex: number, secondIndex: number): boolean {
  var change: boolean = false
  for(var index = 0; index < 3; index++){//Check Horizontal
    if (gridState.value[firstIndex][index] === playerMode){
      if (index === 2){
        //It's A Match
        change = true
      }
    } else {
      break
    }
  }
  for(var index = 0; index < 3; index++){//Check Vertical
    if (gridState.value[index][secondIndex] === playerMode) {
      if (index === 2){
        change = true
      } 
    } else {
      break
    } 
  }
  for(var index = 0; index < 3; index++){//Check Diagnal Left Right
    if (gridState.value[index][index] === playerMode) {
      if (index === 2){
        change = true
      }
    } else {
      break
    }
  }
  for(var index = 0; index < 3; index++){//Check Diagnal Right Left
    if (gridState.value[2-index][index] === playerMode) {
      if (index === 2){
        change = true
      }
    } else {
      break
    }
  }
  
  return change
}

export function TileButtonPress(
  firstIndex: number, 
  secondIndex: number,
  thirdIndex: number, 
  forthIndex: number,
  ai?: boolean
) {
  const onlineGameId = (store.getState().gameState.gameType === 'online') ? store.getState().gameState.gameId:undefined
  const playerMode = store.getState().gameState.currentTurn
  const newGrid = (thirdIndex === 0) ? (forthIndex === 0) ? 1:(forthIndex === 1) ? 2:3: (thirdIndex === 1) ?  (forthIndex === 0) ? 4:(forthIndex === 1) ? 5:6: (forthIndex === 0) ? 7:(forthIndex === 1) ? 8:9
  const bigTileIndex = (firstIndex === 0) ? (secondIndex === 0) ? 1:(secondIndex === 1) ? 4:7:(firstIndex === 1) ? (secondIndex === 0) ? 2:(secondIndex === 1) ? 5:8:(secondIndex === 0) ? 3:(secondIndex=== 1) ? 6:9

  var newGridState: DimentionalType = {...store.getState().gameState.data}
  const isNewGridPositionFull = newGridState.value[forthIndex][thirdIndex] === gridStateMode.O || newGridState.value[forthIndex][thirdIndex] === gridStateMode.X || newGridState.value[forthIndex][thirdIndex] === gridStateMode.Full
  //updating
  if (playerMode === gridStateMode.X || playerMode === gridStateMode.O){
    newGridState = setGameTile(newGridState, firstIndex, secondIndex, thirdIndex, forthIndex, playerMode)
    if (isNewGridPositionFull){
      setSelectedGrid(0, onlineGameId)
    } else {
      setSelectedGrid(newGrid, onlineGameId)
    }
    var change: boolean = false
    for(var index = 0; index < 3; index++){//Check Horizontal
      if (newGridState.inner[firstIndex][secondIndex].value[thirdIndex][index] === playerMode){
        if (index === 2){
          //It's A Match
          change = true
          if (forthIndex > 1){
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: 0,
              xTwo: 2,
              yOne: thirdIndex,
              yTwo: thirdIndex
            })
          } else {
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: 2,
              xTwo: 0,
              yOne: thirdIndex,
              yTwo: thirdIndex
            })
          }
        }
      } else {
        break
      }
    }
    for(var index = 0; index < 3; index++){//Check Vertical
      if (newGridState.inner[firstIndex][secondIndex].value[index][forthIndex] === playerMode) {
        if (index === 2){
          change = true
          if (thirdIndex > 1){
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: forthIndex,
              xTwo: forthIndex,
              yOne: 2,
              yTwo: 0
            })
          } else {
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: forthIndex,
              xTwo: forthIndex,
              yOne: 0,
              yTwo: 2
            })
          }
        } 
      } else {
        break
      }
    }
    for(var index = 0; index < 3; index++){//Check Diagnal Left Right
      if (newGridState.inner[firstIndex][secondIndex].value[index][index] === playerMode) {
        if (index === 2){
          change = true
          if (forthIndex > 1){
            //Line moves left to right
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: 0,
              xTwo: 2,
              yOne: 0,
              yTwo: 2
            })
          } else {
            //Line moves right to left
            newGridState = setActive(newGridState, firstIndex, secondIndex, {
              xOne: 2,
              xTwo: 0,
              yOne: 2,
              yTwo: 0
            })
          }
        }
      } else {
        break
      }
    }
    for(var index = 0; index < 3; index++){//Check Diagnal Right Left
      if (newGridState.inner[firstIndex][secondIndex].value[2-index][index] === playerMode) {
        //Checking is right 
        if (index === 2){
          change = true
          newGridState = setActive(newGridState, firstIndex, secondIndex, {
            xOne: 2,
            xTwo: 0,
            yOne: 0,
            yTwo: 2
          })
        }
      } else {
        break
      }
    }

    if (!change){
      //Checks if the sqaure is full meaning the tic tac toe has ended in a draw
      for(var indexOne = 0; index < 3; index++){
        var complete = true
        for(var index = 0; index < 3; index++){
          if (newGridState.inner[firstIndex][secondIndex].value[indexOne][index] === gridStateMode.Open){
            complete = false
            break              
          }
        }
        if (!complete){
          break
        } else if (index === 2){
          change = true
          newGridState = setValue(newGridState, firstIndex, secondIndex, gridStateMode.Full)
          if (newGrid === bigTileIndex){
            setSelectedGrid(0, onlineGameId)//TO DO fix this
          }
        }
      }
      setGridState(newGridState, onlineGameId)
    } else {
      newGridState = setValue(newGridState, firstIndex, secondIndex, playerMode)
      setIsGameOver(checkIfGameOver(newGridState, playerMode, firstIndex, secondIndex), onlineGameId)
      setGridState(newGridState, onlineGameId)
      if (newGrid === bigTileIndex){
        setSelectedGrid(0, onlineGameId)
      }
    }
  }

  // Set the new plater mode
  if (playerMode === gridStateMode.O){
    setCurrentTurn(gridStateMode.X, onlineGameId)
  } else if (playerMode === gridStateMode.X) {
    setCurrentTurn(gridStateMode.O, onlineGameId)
  }

  if (store.getState().gameState.gameType === 'ai' && ai !== true) {
    perdictMoveGame(store.getState().gameState)
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
  TileButtonPress(firstIndex, secondIndex, Math.floor(index/3), (index % 3), true)
}
