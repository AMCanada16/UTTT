import * as tf from '@tensorflow/tfjs';
import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

function perdict(old: number[]) {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 9,
      inputShape: [9],
      activation: "relu"
    })
  );

  model.add(
    tf.layers.dense({
      units: 81,
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
  const input = tf.tensor2d([old])
  let result = model.predict(input) as tf.Tensor
  result.print()
}

export default function mainModel() {
  const [gameSate, setGameState] = useState<number[]>([0,0,0,0,0,0,0,0,0])
  const [state, setState] = useState<number>(1)
  return(
    <View>
      { Array(gameSate.length/3).fill(undefined).map((ite: undefined, indexA) => (
        <View style={styles.row}>
          {gameSate.slice(indexA * 3, 3 + (indexA * 3)).map((item: number, index) => (
            <View>
              <Button title={"" + item} onPress={() => {
                var newGameState = gameSate
                newGameState[(indexA * 3) + index] = state
                setGameState(newGameState)
                if (state === 1){
                  setState(2)
                } else {
                  setState(1)
                }
              }}/>
            </View>
          ))}
        </View>
      ))}
      <Button title='Perdict' onPress={() => {perdict(gameSate)}} />
    </View>
  )
}


const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  }
});