/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import DefaultButton from '@components/DefaultButton';
import { ChevronLeft, CircleIcon, XIcon } from '@components/Icons';
import { RootState } from '@redux/store';
import { Colors, gridStateMode } from '@types';

function getFontSize(width: number, height: number) {
  if (width <= 560) {
    return Math.round(width * 0.18);
  }
  if (width < 950) {
    return Math.round(width * 0.1);
  }
  return Math.round(height * 0.2);
}

export default function GameOverComponent({
  onClose
}:{
  onClose: () => void;
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions);
  const winner = useSelector((state: RootState) => state.gameState.gameOver);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{position: 'absolute', width: width * ((width <= 560) ? 0.95:0.8), height: (height * ((width <= 560) ? 0.95:0.8)) - insets.top - insets.bottom, top: 'auto', bottom: 'auto', left: 'auto', right: 'auto', backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Text
        style={{margin: 10, fontSize: getFontSize(width, height), fontFamily: "Ultimate", textAlign: 'center'}}
      >Game Over</Text>
      <View>
        { (winner === gridStateMode.o) ?
          <View style={{height: 50, alignItems: 'center'}}>
            <View>
              <CircleIcon width={50} height={50} style={{position: 'absolute'}} color="#ff9c9c"/>
              <Text style={{marginLeft: 55, marginVertical: 12, fontFamily: 'RussoOne', fontSize: 26}}>Won the Game</Text>
            </View>
          </View>:null
        }
        { (winner === gridStateMode.x) ?
          <View style={{height: 50, alignItems: 'center'}}>
            <View>
              <XIcon width={50} height={50} style={{position: 'absolute'}} color={Colors.blue}/>
              <Text style={{marginLeft: 55, marginVertical: 12, fontFamily: 'RussoOne', fontSize: 26}}>Won the Game</Text>
            </View>
          </View>:null
        }
        { (winner === gridStateMode.full) ?
          <Text style={{marginVertical: 12, fontFamily: 'RussoOne', fontSize: 26}}>DRAW</Text>:null
        }
      </View>
      <DefaultButton onPress={() => {
        router.push('/')
      }} style={{flexDirection: 'row', margin: 5}}>
        <ChevronLeft width={20} height={20} style={{marginVertical: 'auto'}}/>
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