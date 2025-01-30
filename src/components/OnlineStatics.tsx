/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActiveIcon, ControllerIcon, CrownIcon, SkullIcon } from '@components/Icons'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { getOnlineGameStats } from '@functions/OnlineFunctions'
import { loadingState } from '@types'

const styles = StyleSheet.create({
  statComponent: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: 'white'
  }
})

export default function OnlineStatics() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [onlineStats, setOnlineStats] = useState<undefined | OnlineStatsType>(undefined)
  const [onlineStatsState, setOnlineStatsState] = useState<loadingState>(loadingState.loading)

  async function loadStatics() {
    const result = await getOnlineGameStats()
    if (result !== loadingState.failed) {
      setOnlineStats(result)
      setOnlineStatsState(loadingState.success)
    } else {
      setOnlineStatsState(loadingState.failed)
    }
  }

  useEffect(() => {
    loadStatics()
  }, [])

  if (onlineStatsState === loadingState.loading) {
    return (
      <View style={{height: height * 0.3 + 30, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
        <Text>Loading</Text>
      </View>
    )
  }

  if (onlineStatsState === loadingState.success  && onlineStats !== undefined) {
    return (
      <>
        <View style={{flexDirection: 'row'}}>
          <View style={[{
            width: width * (width <= 560 ? 0.43:0.375),
            marginRight: (width * (width <= 560 ? 0.09:0.05) - 20),
            height: height * 0.15,
          }, styles.statComponent]}>
            <ControllerIcon width={50} height={50}/>
            <Text>Games Played</Text>
            <Text style={{fontFamily: 'Ultimate'}}>{onlineStats.gamesPlayed}</Text>
          </View>
          <View style={[{
            width: width * (width <= 560 ? 0.43:0.375),
            height: height * 0.15,
          }, styles.statComponent]}>
            <CrownIcon width={50} height={50}/>
            <Text>Games Won</Text>
            <Text style={{fontFamily: 'Ultimate'}}>{onlineStats.gamesWon}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={[{
            width: width * (width <= 560 ? 0.43:0.375),
            marginRight: (width * (width <= 560 ? 0.09:0.05) - 20),
            height: height * 0.15,
          }, styles.statComponent]}>
            <SkullIcon width={50} height={50}/>
            <Text>Games Lost</Text>
            <Text style={{fontFamily: 'Ultimate'}}>{onlineStats.gamesPlayed - onlineStats.activeGames - onlineStats.gamesWon}</Text>
          </View>
          <View style={[{
            width: width * (width <= 560 ? 0.43:0.375),
            height: height * 0.15,
          }, styles.statComponent]}>
            <ActiveIcon width={50} height={50}/>
            <Text>Active Games</Text>
            <Text style={{fontFamily: 'Ultimate'}}>{onlineStats.activeGames}</Text>
          </View>
        </View>
      </>
    )
  }

  return (
    <View>
      <Text>Failed</Text>
    </View>
  )
}