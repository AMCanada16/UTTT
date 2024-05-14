import { View, Text, Pressable, FlatList, ListRenderItemInfo, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../Firebase/Firebase'
import { Redirect, router } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { approveFriendRequest, getFriends, requestFriend } from '../Functions/UserFunctions'
import DefaultButton from './DefaultButton'
import { CheckMarkIcon, ChevronLeft, CloseIcon, OfflineIcon, OnlineIcon, XIcon } from './Icons'
import useFriends from '../hooks/useFriends'
import useUserOnline from '../hooks/useUserOnline'
import OnlineComponent from './OnlineComponent'

function FriendButtonComponent({
  friend
}:{
  friend: ListRenderItemInfo<friendType>
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function falseLoading() {
    // While this isn't pleasent, it works most of the time. If it does fail the user will be delivered to the user later down. And the component will update.
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  if (isLoading) {
    return <ActivityIndicator style={{marginLeft: 'auto'}}/>
  }

  if (friend.item.isFriend) {
    return (
      <View style={{
        marginLeft: 'auto'
      }}>
        <Text>Friend</Text>
      </View>
    )
  }

  if (friend.item.isRequesting) {
    return (
      <View style={{
        flexDirection: 'row',
        marginLeft: 'auto'
      }}>
        <Pressable
          onPress={async () => {
            const uid = auth.currentUser?.uid
            if (uid !== undefined) {
              setIsLoading(true)
              await approveFriendRequest(uid, friend.item.uid)
              falseLoading()
            }
          }}
          style={{marginRight: 15}}
        >
          <CheckMarkIcon width={20} height={25}/>
        </Pressable>
        <Pressable onPress={async () => {
          const uid = auth.currentUser?.uid
          if (uid !== undefined) {
            setIsLoading(true)
            await approveFriendRequest(uid, friend.item.uid)
            falseLoading()
          }

        }}>
          <XIcon width={25} height={25}/>
        </Pressable>
      </View>
    )
  }
  if (friend.item.isRequested) {
    return (
      <View style={{
        marginLeft: 'auto'
      }}>
        <Text>Friend Request Sent</Text>
      </View>
    )
  }
  return (
    <Pressable
      onPress={async () => {
        const uid = auth.currentUser?.uid
        if (uid !== undefined) {
          setIsLoading(true)
          await requestFriend(uid, friend.item.uid)
          falseLoading()
        }
      }}
      style={{
        marginLeft: 'auto'
      }}
    >
      <Text>Request Friend</Text>
    </Pressable>
  )
}

export default function FriendsPage() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const friends = useFriends()


  if (auth.currentUser === null) {
    return <Redirect href={"/UTTT/account"}/>
  }

  return (
    <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, padding: 10}}>
      <Pressable
        onPress={() => {
          router.replace("/UTTT/account")
        }}
        style={{
          marginTop: 25,
          marginLeft: 25
        }}
      >
        <ChevronLeft width={30} height={30} />
      </Pressable>
      <Text style={{
        fontWeight: "bold",
        fontSize: 25,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 15
      }}>Friends</Text>
      <FlatList
        data={friends}
        renderItem={(friend) => (
          <DefaultButton style={{flexDirection: 'row', width: width * ((width <= 560) ? 0.95:0.8) - 50, marginBottom: 5, marginLeft: 15}}>
            <Text>{friend.item.username}</Text>
            <FriendButtonComponent friend={friend}/>
            <OnlineComponent uid={friend.item.uid}/>
          </DefaultButton>
        )}  
      />
    </View>
  )
}