/*
  UTTT
  Andrew Mainella
  PlayersPage.tsx
  A page to show the players in a game.
*/
import { View, Text, Pressable, FlatList, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { getUsername } from '../functions/UserFunctions'
import DefaultButton from './DefaultButton'
import OnlineComponent from './OnlineComponent'
import { ChevronLeft, CloseIcon, FriendIcon, TrashIcon } from './Icons'
import { auth, db } from '../firebase'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { joinRulesArray } from '../Types'
import useInvitations from '../hooks/useInvitations'
import { doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'expo-router'

function Invitations({
  height
}:{
  height: number
}) {
  const [isInvitationModeFriends, setIsInvitationModeFriends] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("")
  const users = useInvitations(search, isInvitationModeFriends)
  const game = useSelector((state: RootState) => state.gameState)
  const [topHeight, setTopHeight] = useState<number>(0)

  if (game.gameType !== "online") {
    return null
  }

  return (
    <KeyboardAvoidingView
      style={{
        marginBottom: 15,
        marginHorizontal: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingTop: 5,
        height
      }}
      behavior='position'
      contentContainerStyle={{
        backgroundColor: "rgba(255,255,255, 0.95)",
        borderRadius: 5,
        paddingTop: 5
      }}
    >
      <View onLayout={(e) => {setTopHeight(e.nativeEvent.layout.height)}}>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 20,
          marginLeft: 5
        }}>Invite Players</Text>
        <SegmentedControl
          values={['Friends', 'All']}
          selectedIndex={isInvitationModeFriends ? 0:1}
          onChange={(e) => {
            if (e.nativeEvent.selectedSegmentIndex === 0) {
              setIsInvitationModeFriends(true)
            } else {
              setIsInvitationModeFriends(false)
            }
          }}
          style={{margin: 5, marginBottom: 10, borderWidth: 1, borderColor: 'black'}}
        />
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'black',
            marginBottom: 5,
            padding: 5,
            borderRadius: 5,
            fontSize: 16
          }}
        />
      </View>
      <FlatList
        data={users.users}
        renderItem={(user) => (
          <DefaultButton
            style={{
              flexDirection: 'row',
              marginBottom: 5
            }}
          >
            <Text style={{marginVertical: 3}}>{user.item.username}</Text>
            {user.item.isFriend ?
              <FriendIcon width={20} height={20} style={{marginLeft: 'auto', marginRight: 4}}/>:null
            }
            {game.invitations.includes(user.item.uid) ?
              <View style={{
                marginLeft: user.item.isFriend ? undefined:'auto'
              }}>
                <Text style={{marginVertical: 3}}>Invitation Sent</Text>
              </View>:
              <Pressable
                onPress={() => {
                  updateDoc(doc(db, "Games", game.gameId), {
                    invitations: [...game.invitations, user.item.uid]
                  })
                }}
                style={{
                  marginLeft: user.item.isFriend ? undefined:'auto'
                }}
              >
                <Text style={{marginVertical: 3}}>Invite</Text>
              </Pressable>
            }
          </DefaultButton>
        )}
        style={{
          height: height - topHeight
        }}
      />
    </KeyboardAvoidingView>
  )
}

export default function PlayersPage({
  accounts,
  onClose
}:{
  accounts: compressedUserType[]
  onClose: () => void
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  let [players, setPlayers] = useState<gameUserType[]>([])
  const joinRule = useSelector((state: RootState) => state.gameState.joinRule)
  const gameId = useSelector((state: RootState) => state.gameState.gameId)
  const router = useRouter()
  const [invitationHeight, setInvitationHeight] = useState<number>(0)

  async function loadUsers() {
    let newPlayers: gameUserType[] = []
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

  if (joinRule === undefined) {
      // This should be unreachable this component is only viewed when a game exists and is of an online type
    return (
      <View>
        <Text>Something Wrong</Text>
      </View>
    )
  }

  return (
    <View style={{position: 'absolute', width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, top: 'auto', bottom: 'auto', left: 'auto', right: 'auto', backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, overflow: 'hidden'}}>
      <View onLayout={(e) =>  setInvitationHeight((height * 0.8) - e.nativeEvent.layout.height)}>
        {players.length >= 2 ?
          <Pressable style={{marginTop: 25, marginLeft: 25}} onPress={() => {
            onClose()
          }}>
            <CloseIcon width={30} height={30}/>
          </Pressable>:
          <Pressable style={{marginTop: (width <= 560) ? 15:25, marginLeft: (width <= 560) ? 15:25}} onPress={() => {
            router.replace("/UTTT/online")
          }}>
            <ChevronLeft width={30} height={30}/>
          </Pressable>
        }
        <Text
          style={{margin: 10, marginTop: 0, fontSize: 80, fontFamily: "Ultimate", textAlign: 'center'}}
        >Players</Text>
        <Text style={{marginLeft: 5}}>Game Open To...</Text>
        <SegmentedControl
          values={['Public', 'Friends', 'Invitations']}
          selectedIndex={joinRulesArray.indexOf(joinRule)}
          onChange={(e) => {
            if (e.nativeEvent.selectedSegmentIndex === 0) {
              updateDoc(doc(db, "Games", gameId), {
                joinRule: 'public'
              })
            } else if (e.nativeEvent.selectedSegmentIndex === 1) {
              updateDoc(doc(db, "Games", gameId), {
                joinRule: 'friends'
              })
            } else {
              updateDoc(doc(db, "Games", gameId), {
                joinRule: 'invitation'
              })
            }
          }}
          style={{margin: 5, marginBottom: 10, borderWidth: 1, borderColor: 'black'}}
        />
        <View style={{
          height: 90
        }}>
          <FlatList
            data={players}
            renderItem={(player) => (
              <DefaultButton style={{
                flexDirection: 'row',
                marginHorizontal: 5,
                marginBottom: 5
              }}>
                <Text style={{marginRight: 'auto'}}>{player.item.username}</Text>
                {player.item.userId !== auth.currentUser?.uid ?
                  <OnlineComponent uid={player.item.userId}/>:<Text>You</Text>
                }
                {player.item.userId !== auth.currentUser?.uid && players[0].userId === auth.currentUser?.uid ?
                  <Pressable onPress={() => {
                              
                  }}>
                    <TrashIcon width={20} height={20}/>
                  </Pressable>:null
                }
              </DefaultButton>
            )}
            style={{
              height: 90,
              marginBottom: 0,
            }}
          />
        </View>
      </View>
      <Invitations height={invitationHeight}/>
    </View>
  )
}