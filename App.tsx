import { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import Modle from "./src/Model"
import { NativeRouter, Route, Link, Routes, useNavigate, useParams } from "react-router-native";
import * as SplashScreen from 'expo-splash-screen';
import WelcomePage from './src/Componets/Welcome';
import { loadStorageGame, updateStorageGame } from './src/Functions/StorageFunctions';
import store, { RootState } from './src/Redux/store';
import { dimensionsSlice } from './src/Redux/reducers/dimensionsReducer';
import {Provider, useSelector} from "react-redux"
import { UltimateTicTacToe } from './src/Componets/UltimateTicTacToe';

SplashScreen.preventAutoHideAsync();

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

function App() {

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    return () => subscription?.remove();
  });

  const {height, width} = useSelector((state: RootState) => state.dimensions)

  useEffect(() => {
    if (dimensions.window.height !== height) {
      store.dispatch(dimensionsSlice.actions.setHeight(dimensions.window.height))
    }
    if (dimensions.window.width !== width) {
      store.dispatch(dimensionsSlice.actions.setWidth(dimensions.window.width))
    }
  }, [dimensions.window.height, dimensions.window.width])

  return (
    <NativeRouter>
      <View style={{backgroundColor: "#5E17EB", alignItems: 'center', justifyContent: 'center', margin: "auto"}}>
        <Routes>
          <Route path="/" element={<WelcomePage/>} />
          <Route path="/UTTT/:gameType/:gameId" element={<UltimateTicTacToe />} />
          <Route path="/modle" element={<Modle/>} />
        </Routes>
      </View>
    </NativeRouter>
  );
}

export default function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

