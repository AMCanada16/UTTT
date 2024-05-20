/*
  UTTT
  Andrew Mainella
*/
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { Platform } from 'react-native';
import '@tensorflow/tfjs-react-native';


let model: tf.LayersModel | undefined

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

async function getModel(): Promise<tf.LayersModel> {
  if (model !== undefined) {
    return model
  } else {
    if (Platform.OS === 'web') {
      let result = createModel()
      model = result
      return result
    } else {
      const modelJson = require('../../assets/main.json');
      const modelWeights = require('../../assets/main.bin');
      
      const result = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
      model = result
      return result
    }
  }
}

export async function perdict(old: number[]) {
  console.log(old.toString().replaceAll("1", "3").replaceAll("2", "1").replaceAll("3", "-1"))
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
    if (array[0][index] > highest && old[index] === 0) {
      highest = array[0][index]
      highestIndex = index
    }
  }
  newArray[highestIndex] = 2
  console.log(newArray.toString().replaceAll("1", "3").replaceAll("2", "1").replaceAll("3", "-1"))
  return newArray
}

export const trainModel = async () => {
  try {
    await tf.ready()
    if (Platform.OS !== "web") {
      return
    }
    const xGames = [[0,1,-1,0,1,-1,0,0,0], [-1,-1,0,0,1,0,0,0,0], [-1,1,0,0,-1,0,0,0,0], [-1,1,0,0,-1,-1,0,1,0], [-1,0,1,0,1,0,0,0,0], [0,-1,0,0,-1,-1,1,1,0], [-1,0,1,0,-1,0,1,0,0], [-1,0,0,0,-1,0,0,1,0], [1,0,1,0,0,0,0,0,0], [1,1,0,0,0,0,0,0,0], [1,0,0,0,1,0,0,0,0], [1,0,0,0,-1,0,0,0,0], [-1,1,0,0,0,0,0,1,1], [1,1,0,0,-1,0,1,-1,-1], [1,0,0,0,0,0,1,0,0], [1,0,0,0,0,0,0,0,0], [1,0,1,0,0,0,0,0,0], [-1,0,1,0,0,0,0,0,0], [1,0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,0,1], [1,0,0,0,0,0,0,0,0], [1,0,0,0,0,0,1,0,0], [1,1,0,0,-1,0,0,1,0], [1,0,0,0,-1,0,1,0,0], [-1,0,0,0,0,0,1,0,1], [1,0,0,0,0,0,0,0,0], [-1,-1,0,1,-1,0,0,0,0], [-1,0,0,1,0,0,0,0,0], [1,0,0,0,0,0,0,0,0], [1,0,-1,0,-1,0,0,0,0], [0,0,1,0,-1,1,0,0,0], [-1,1,0,0,1,0,0,0,0], [0,0,0,0,0,-1,0,1,1], [0,1,-1,0,1,0,0,0,0], [0,-1,-1,0,0,0,0,-1,0], [1,0,0,0,0,-1,0,0,1], [0,1,-1,1,0,-1,-1,1,1], [1,0,0,0,1,0,0,0,0], [1,0,0,1,0,0,0,0,0], [1,0,0,1,0,0,0,0,0], [0,0,-1,0,0,0,0,0,-1], [-1,0,0,1,-1,-1,0,0,0], [0,0,0,0,1,0,0,1,0], [0,0,0,0,1,0,0,0,1], [-1,-1,0,0,1,0,0,0,0], [0,-1,-1,0,1,-1,0,0,1], [0,1,-1,0,1,-1,0,0,0], [1,0,0,-1,1,0,1,0,-1]]
    const yGames = [[0,1,-1,0,1,-1,0,1,0], [-1,-1,1,0,1,0,0,0,0], [-1,1,0,0,-1,0,0,0,1], [-1,1,0,1,-1,-1,0,1,0], [-1,0,1,0,1,0,1,0,0], [0,-1,0,0,-1,-1,1,1,1], [-1,0,1,0,-1,0,1,0,1], [-1,0,0,0,-1,0,0,1,1], [1,1,1,0,0,0,0,0,0], [1,1,1,0,0,0,0,0,0], [1,0,0,0,1,0,0,0,1], [1,0,1,0,-1,0,0,0,0], [-1,1,0,0,1,0,0,1,1], [1,1,1,0,-1,0,1,-1,-1], [1,0,0,1,0,0,1,0,0], [1,0,0,0,1,0,0,0,0], [1,1,1,0,0,0,0,0,0], [-1,0,1,0,1,0,0,0,0], [1,0,0,0,1,0,0,0,0], [1,0,0,0,1,0,0,0,1], [1,0,0,0,1,0,0,0,0], [1,0,0,1,0,0,1,0,0], [1,1,1,0,-1,0,0,1,0], [1,0,0,1,-1,0,1,0,0], [-1,0,0,0,0,0,1,1,1], [1,0,0,0,1,0,0,0,0], [-1,-1,0,1,-1,0,0,0,1], [-1,0,0,1,1,0,0,0,0], [1,0,0,0,1,0,0,0,0], [1,0,-1,0,-1,0,1,0,0], [0,0,1,0,-1,1,0,0,1], [-1,1,0,0,1,0,0,1,0], [0,0,0,0,0,-1,1,1,1], [0,1,-1,0,1,0,0,1,0], [1,-1,-1,0,0,0,0,-1,0], [1,0,0,0,1,-1,0,0,1], [0,1,-1,1,1,-1,-1,1,1], [1,0,0,0,1,0,0,0,1], [1,0,0,1,0,0,1,0,0], [1,0,0,1,0,0,1,0,0], [0,0,-1,0,0,1,0,0,-1], [-1,0,0,1,-1,-1,0,0,1], [0,1,0,0,1,0,0,1,0], [1,0,0,0,1,0,0,0,1], [-1,-1,1,0,1,0,0,0,0], [1,-1,-1,0,1,-1,0,0,1], [0,1,-1,0,1,-1,0,1,0], [1,0,1,-1,1,0,1,0,-1]]
  
    const stackedX = tf.tensor2d(xGames);
    const stackedY = tf.tensor2d(yGames);
  
    let currentModel = await getModel()
    await currentModel.fit(stackedX, stackedY, {
      epochs: 100,
      shuffle: true,
      batchSize: 32
    });

    stackedX.dispose()
    stackedY.dispose()
  
    model = currentModel
  } catch (err) {
  }
};

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
