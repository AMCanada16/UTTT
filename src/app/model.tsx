import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

let model: tf.Sequential | undefined

function createModel() {
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

async function perdict(old: number[]) {
  let newOld = old.map((e) => {
    if (e === 2) {
      return 1
    }
    return e
  })
  const currentModel = getModel()
  const input = tf.tensor2d([newOld])
  let result = currentModel.predict(input) as tf.Tensor
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

const trainModel = async () => {
  const xGames = [[0,1,-1,0,1,-1,0,0,0], [-1,-1,0,0,1,0,0,0,0], [-1,1,0,0,-1,0,0,0,0], [-1,1,0,0,-1,-1,0,1,0]]
  const yGames = [[0,1,-1,0,1,-1,0,1,0], [-1,-1,1,0,1,0,0,0,0], [-1,1,0,0,-1,0,0,0,1], [-1,1,0,1,-1,-1,0,1,0]]

  // -1,1,0,0,-1,0,0,0,0
  // -1,1,0,0,-1,0,0,0,1

  const xTensors = []
  const yTensors = []
  for (var index = 0; index < xGames.length; index += 1) {
    xTensors.push(tf.tensor2d(xGames))
    yTensors.push(tf.tensor2d(yGames))
  }
  const stackedX = tf.stack(xGames);
  const stackedY = tf.stack(yGames);

  //,0,1,0,1,0,0,0,0
  //-1,0,1,0,1,0,-1,0,0

  //const stackedX = tf.stack([[1, 0, -1, 0, 1, 0, -1, 0, 0], [-1, 0, 1, 0, 1, 0, 0, 0, -1], [1,1,0,0,-1,0,0,0,0], [-1,-1,0,0,1,0,0,0,1], [-1,1,1,0,-1,1,0,0,0]]);
  //const stackedY = tf.stack([[1, 0, -1, 0, 1, 0, -1, 0, 1], [-1, 0, 1, 0, 1, 0, -1, 0, -1], [1,1,-1,0,-1,0,0,0,0], [-1,-1,-1,0,1,0,0,0,1], [-1,1,1,0,-1,1,0,0,-1]]);

  //[1,2,0,0,1,1,0,2,2]

  const allCallbacks = {
    // onTrainBegin: log => console.log(log),
    // onTrainEnd: log => console.log(log),
    // onEpochBegin: (epoch, log) => console.log(epoch, log),
    // onEpochEnd: (epoch: any, log: any) => console.log(epoch, log)
    // onBatchBegin: (batch, log) => console.log(batch, log),
    // onBatchEnd: (batch, log) => console.log(batch, log)
  };

  const currentModel = getModel()
  await currentModel.fit(stackedX, stackedY, {
    epochs: 100,
    shuffle: true,
    batchSize: 32,
    callbacks: allCallbacks
  });

  console.log("Model Trained");

  return model;
};

export default function mainModel() {
  const [gameSate, setGameState] = useState<number[]>([0,0,0,0,0,0,0,0,0])
  const [lastGameState, setLastGameState] = useState<number[]>([0,0,0,0,0,0,0,0,0])
  const [state, setState] = useState<number>(1)

  useEffect(() => {
    trainModel()
  }, [])

  return(
    <View>
      { Array(gameSate.length/3).fill(undefined).map((ite: undefined, indexA) => (
        <View style={styles.row}>
          {gameSate.slice(indexA * 3, 3 + (indexA * 3)).map((item: number, index) => (
            <View>
              <Button title={"" + item} onPress={() => {
                var newGameState = gameSate
                newGameState[(indexA * 3) + index] = state
                setLastGameState(gameSate)
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
      <Button title='Perdict' onPress={async () => {
        setLastGameState(gameSate)
        setGameState(await perdict(gameSate))
        setState(1)
      }} />
      <Button title='Reset' onPress={async () => {
        setGameState([0,0,0,0,0,0,0,0,0])
      }} />
      <Button title='Print' onPress={async () => {
        console.log(`${lastGameState.toString().replaceAll("1", "-1").replaceAll("2","1")}\n${gameSate.toString().replaceAll("1", "-1").replaceAll("2","1")}`)
      }} />
    </View>
  )
}


const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  }
});