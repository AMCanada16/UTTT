/*
  UTTT
  Andrew Mainella
  8 May 2024
*/
import { View, Text, ActivityIndicator } from 'react-native';
import { Slot } from 'expo-router';
import useRedirect from '../../hooks/useRedirect';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

export default function AppContainer() {
  const isLoading = useRedirect()
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  
  if (isLoading) {
    return (
      <View style={{width, height, alignContent: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: "#5E17EB"}}>
        <ActivityIndicator size={'large'}/>
        <Text style={{
          color: "white",
          marginTop: 4
        }}>Loading</Text>
      </View>
    )
  }

  return (
    <Slot />
  )
}

