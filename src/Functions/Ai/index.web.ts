import * as tf from '@tensorflow/tfjs';

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

export async function perdict(old: number[]) {
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
  return newArray
}

export const trainModel = async () => {
  try {
    await tf.ready()
    const xGames = [[0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
    const yGames = [[0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
  
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
