import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { getUsername } from '../Functions/UserFunctions'

export default function PlayersPage({
  accounts
}:{
  accounts: compressedUserType[]
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  let [players, setPlayers] = useState<userType[]>([])

  async function loadUsers() {
    let newPlayers: userType[] = []
    for (let index = 0; index < accounts.length; index += 1) {
      let username = await getUsername(accounts[index].userId)
      if (username !== undefined) {
        newPlayers.push({
          ...accounts[index],
          username
        })
      } else {
        newPlayers.push({
          ...accounts[index],
          username: 'Error'
        })
      }
    }
    setPlayers(newPlayers)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <View style={{position: 'absolute', width: width * 0.8, height: height * 0.8, top: 'auto', bottom: 'auto', left: 'auto', right: 'auto', backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25}}>
      <Text
        style={{margin: 10, fontSize: 80, fontFamily: "Ultimate", textAlign: 'center'}}
      >Players Page</Text>
      <FlatList
        data={players}
        renderItem={(player) => (
          <View>
            <Text>{player.item.username}</Text>
          </View>
        )}
      />
      <Pressable>
        <Text>Back</Text>
      </Pressable>
    </View>
  )
}