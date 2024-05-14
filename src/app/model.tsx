import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { perdict, trainModel } from '../functions/Ai';

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