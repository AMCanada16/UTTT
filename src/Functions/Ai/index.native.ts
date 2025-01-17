/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

let model: tf.LayersModel | undefined

export async function getModel() {
  const modelJson = require('assets/main.json');
  const modelWeights = require('assets/main.bin');
  
  const result = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
  model = result
  return result
}

export async function trainModel() {
  return
}