/*
  UTTT
  Andrew Mainella
  8 May 2024
  _layout.tsx

*/
import { Slot, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import Head from "expo-router/head"
import React, { useCallback, useEffect } from 'react';
import { StatusBar, View, useWindowDimensions } from 'react-native';
import {Provider, useSelector} from "react-redux"
import GoogleProvider from '@components/GoogleProvider';
import useShareStatus from '@hooks/useShareStatus';
import store, { RootState } from '@redux/store';
import { dimensionsSlice } from '@redux/reducers/dimensionsReducer';

SplashScreen.preventAutoHideAsync();

/**
 * The Main Component for the app that loads fonts and handels dimensions
 * @returns A react function component
 */
function App() {
  const dimensions = useWindowDimensions()
  useShareStatus()

  const {height, width} = useSelector((state: RootState) => state.dimensions)

  useEffect(() => {
    if (dimensions.height !== height) {
      store.dispatch(dimensionsSlice.actions.setHeight(dimensions.height))
    }
    if (dimensions.width !== width) {
      store.dispatch(dimensionsSlice.actions.setWidth(dimensions.width))
    }
  }, [dimensions.height, dimensions.width, height, width])

  const [fontsLoaded, fontError] = useFonts({
    "RussoOne":require("assets/Fonts/RussoOne.ttf"),
    "Ultimate":require("assets/Fonts/Ultimate.ttf"),
    "BarlowCondensed":require("assets/Fonts/BarlowCondensed.ttf"),
    "Glitch":require("assets/Fonts/Glitch.ttf"),
    "Roboto":require("assets/Fonts/Roboto.ttf")
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
      <Head>
        <title>UTTT</title>
      </Head>
      <StatusBar barStyle={'light-content'}/>
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
      <GoogleProvider>
        <App />
      </GoogleProvider>
    </Provider>
  )
}
