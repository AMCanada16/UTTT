import { View, Text } from 'react-native';
import { Slot } from 'expo-router';
import useRedirect from '../../hooks/useRedirect';

export default function AppContainer() {
  const isLoading = useRedirect()

  if (isLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    )
  }

  return (
    <Slot />
  )
}

