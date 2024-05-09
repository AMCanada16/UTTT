/*
  UTTT
  Andrew Mainella
  8 May 2024
  _layout.tsx

*/
import React, { useCallback, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import store, { RootState } from '../Redux/store';
import { dimensionsSlice } from '../Redux/reducers/dimensionsReducer';
import {Provider, useSelector} from "react-redux"
import { Slot, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import Head from "expo-router/head"

/**
 * The Main Component for the app that loads fonts and handels dimensions
 * @returns A react function component
 */
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
    <>
      {/* <Head>
        <title>UTTT</title>
      </Head> */}
      <View onLayout={() => onLayoutRootView()} style={{flex: 1}}>
        <Slot />
      </View>
    </>
  )
}

/**
 * The the main function for the app holds providers.
 * @returns The app
 */
export default function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

