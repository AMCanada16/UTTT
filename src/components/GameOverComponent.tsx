import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { gridStateMode } from '../Types'
import DefaultButton from './DefaultButton'
import { ChevronLeft, CircleIcon, XIcon } from './Icons'

function getFontSize(width: number, height: number) {
  if (width <= 560) {
    return width * 0.18
  }
  if (width < 950) {
    return width * 0.1
  }
  return height * 0.2
}

export default function GameOverComponent({
  onClose
}:{
  onClose: () => void
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const winner = useSelector((state: RootState) => state.gameState.gameOver)
  return (
    <View style={{position: 'absolute', width: width * ((width <= 560) ? 0.95:0.8), height: height * ((width <= 560) ? 0.95:0.8), top: 'auto', bottom: 'auto', left: 'auto', right: 'auto', backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Text
        style={{margin: 10, fontSize: getFontSize(width, height), fontFamily: "Ultimate", textAlign: 'center'}}
      >Game Over</Text>
      <View>
        { (winner === gridStateMode.O) ?
          <View style={{height: 50, alignItems: 'center'}}>
            <View>
              <CircleIcon width={50} height={50} style={{position: 'absolute'}} color="#ff9c9c"/>
              <Text style={{marginLeft: 55, marginVertical: 12, fontFamily: 'RussoOne', fontSize: 26}}>Won the Game</Text>
            </View>
          </View>:null
        }
        { (winner === gridStateMode.X) ?
          <View style={{height: 50, alignItems: 'center'}}>
            <View>
              <XIcon width={50} height={50} style={{position: 'absolute'}} color="#ff9c9c"/>
              <Text style={{marginLeft: 55, marginVertical: 12, fontFamily: 'RussoOne', fontSize: 26}}>Won the Game</Text>
            </View>
          </View>:null
        }
        { (winner === gridStateMode.Full) ?
           <Text style={{marginVertical: 12, fontFamily: 'RussoOne', fontSize: 26}}>DRAW</Text>:null
        }
      </View>
      <DefaultButton onPress={() => {
        router.push('/')
      }} style={{flexDirection: 'row', margin: 5}}>
        <ChevronLeft width={20} height={20}/>
        <Text style={{marginVertical: 3}}>Back</Text>
      </DefaultButton>
      <DefaultButton onPress={() => {
        onClose()
      }} style={{margin: 5}}>
        <Text>View Game</Text>
      </DefaultButton>
    </View>
  )
}