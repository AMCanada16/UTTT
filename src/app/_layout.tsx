import { useCallback, useEffect, useState } from 'react';
import { Dimensions, View, useWindowDimensions } from 'react-native';
import store, { RootState } from '../Redux/store';
import { dimensionsSlice } from '../Redux/reducers/dimensionsReducer';
import {Provider, useSelector} from "react-redux"
import { Slot, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import Storybook from '../../.storybook';
// import {useFonts} from "expo-fonts"

function App() {
  const dimensions = useWindowDimensions()

  const {height, width} = useSelector((state: RootState) => state.dimensions)

  useEffect(() => {
    console.log(dimensions)
    if (dimensions.height !== height) {
      store.dispatch(dimensionsSlice.actions.setHeight(dimensions.height))
    }
    if (dimensions.width !== width) {
      store.dispatch(dimensionsSlice.actions.setWidth(dimensions.width))
    }
  }, [dimensions.height, dimensions.width, height, width])

  const [fontsLoaded, fontError] = useFonts({
    "RussoOne":require("../../assets/Fonts/RussoOne.ttf"),
    "Ultimate":require("../../assets/Fonts/Ultimate.ttf"),
    "BarlowCondensed":require("../../assets/Fonts/BarlowCondensed.ttf"),
    "Glitch":require("../../assets/Fonts/Glitch.ttf"),
    "Roboto":require("../../assets/Fonts/Roboto.ttf")
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  return (
    <View onLayout={() => onLayoutRootView()} style={{flex: 1}}>
      <Slot />
    </View>
  )
}

export default function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

