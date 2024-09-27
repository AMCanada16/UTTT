/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import * as tf from '@tensorflow/tfjs';
import { input, output } from './data';
import checkIfFilled from '../checkIfFilled';
import indexToGridIndex from '../indexToGridIndex';

let model: tf.LayersModel | undefined

async function getModel(): Promise<tf.LayersModel> {
  if (model !== undefined) {
    return model
  } else {
    let result = createModel()
    model = result
    return result
  }
}


function createModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [81],
      units: 64,
      activation: "relu"
    })
  );

  model.add(
    tf.layers.dense({
      units: 729,
      activation: "relu"
    })
  );

  model.add(
    tf.layers.dense({
      units: 81,
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
  console.log(highestIndex)
  newArray[highestIndex] = 2
  return newArray
}

export const trainModel = async () => {
  try {
    await tf.ready()
  
    const stackedX = tf.tensor2d(input);
    const stackedY = tf.tensor2d(output);
  
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
