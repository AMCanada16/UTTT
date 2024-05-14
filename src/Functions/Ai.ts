import * as tf from '@tensorflow/tfjs';
import { TileButtonPress } from './TileButtonPress';

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

  console.log("Model Trained");

  model = currentModel
};

function twoDtoOneD(twoD: number[][]) {
  var newArr: number[] = [];
  
  for(var i = 0; i < twoD.length; i += 1)
  {
      newArr = newArr.concat(twoD[i]);
  }
  return newArr
}

async function perdictOnGrid(game: GameType, grid: number) {
  console.log("EREO")
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
  console.log(`
    First Index: ${firstIndex}\n
    Second Index: ${secondIndex}\n
    Third Index: ${Math.floor(index/3)}\n
    Fourth Index: ${index % 3}
  `)
  TileButtonPress(firstIndex, secondIndex, Math.floor(index/3), (index % 3), true)
}

export async function perdictMoveGame(game: GameType) {
  console.log(game)
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