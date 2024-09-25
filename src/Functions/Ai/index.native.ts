/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

let model: tf.LayersModel | undefined

async function getModel() {
  const modelJson = require('../../../assets/main.json');
  const modelWeights = require('../../../assets/main.bin');
  
  const result = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
  model = result
  return result
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

export async function trainModel() {
  return
}