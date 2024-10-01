/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import * as tf from '@tensorflow/tfjs';
import { input, output } from './data';

let model: tf.LayersModel | undefined

export async function getModel(): Promise<tf.LayersModel> {
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

  const learningRate = 0.001;
  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });
  model.save("downloads://my-model-1")
  return model
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
