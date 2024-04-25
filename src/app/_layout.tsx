import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import store, { RootState } from '../Redux/store';
import { dimensionsSlice } from '../Redux/reducers/dimensionsReducer';
import {Provider, useSelector} from "react-redux"
import { Slot } from 'expo-router';

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

  return <Slot />
}

export default function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

