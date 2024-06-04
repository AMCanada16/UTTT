import { View, Text, Pressable, FlatList, ListRenderItemInfo, ActivityIndicator, TextInput, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { Redirect, useRouter  } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { approveFriendRequest, requestFriend } from '../functions/UserFunctions';
import DefaultButton from './DefaultButton';
import { CheckMarkIcon, ChevronLeft, CloseIcon, OfflineIcon, XIcon } from './Icons';
import useFriends from '../hooks/useFriends';
import OnlineComponent from './OnlineComponent';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import useIsConnected from '../hooks/useIsConnected';
import useIsAuth from '../hooks/useIsAuth';

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
        marginLeft: 'auto',
        height: 20
      }}>
        <Text style={{
          fontSize: 14,
          marginTop: 2.5,
          marginBottom: 3.5
        }}>Friend</Text>
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
        <Text style={{marginVertical: 3}}>Friend Request Sent</Text>
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
      <Text style={{marginVertical: 3}}>Request Friend</Text>
    </Pressable>
  )
}

export default function FriendsPage() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [search, setSearch] = useState<string>("")
  const [isFriends, setIsFriends] = useState<boolean>(false)
  const [page, setPgae] = useState<number>(0)
  const friends = useFriends(search, isFriends, page)
  const isConnected = useIsConnected()
  const router = useRouter()
  const isAuth = useIsAuth()

  useEffect(() => {
    if (friends.friendsCount < 1) {
      setIsFriends(false)
    }
  }, [friends.friendsCount])

  if (!isConnected) {
    return (
      <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
        <Pressable style={{position: 'absolute', top: (width <= 560) ? 25:35, left: (width <= 560) ? 25:35}} onPress={() => {
          router.push("/")
        }}>
          <CloseIcon width={30} height={30}/>
        </Pressable>
        <OfflineIcon width={30} height={30}/>
        <Text>Offline</Text>
      </View>
    )
  }

  if (!isAuth.isLoading && !isAuth.isAuth) {
    return <Redirect href={"/UTTT/account"}/>
  }

  return (
    <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, padding: 10}}>
      <Pressable
        onPress={() => {
          router.replace("/UTTT/account")
        }}
        style={{
          marginTop: (width <= 560) ? 15:25,
          marginLeft: (width <= 560) ? 15:25
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
      <TextInput
        value={search}
        onChangeText={setSearch}
        //@ts-expect-error
        style={[Platform.select({
          web: {
            outlineStyle: 'none'
          }
        }), {
          padding: 5,
          fontSize: 20,
          marginHorizontal: 15,
          marginBottom: 5,
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 4,
          fontFamily: 'RussoOne'
        }]}
        placeholder={"Search"}
        placeholderTextColor={'black'}
      />
      {friends.friendsCount >= 1 ?
        <SegmentedControl
          values={['Friends', 'All']}
          selectedIndex={isFriends ? 0:1}
          onChange={(e) => {
            if (e.nativeEvent.selectedSegmentIndex === 0) {
              setIsFriends(true)
            } else {
              setIsFriends(false)
            }
          }}
          style={{margin: 5, marginBottom: 10, borderWidth: 1, borderColor: 'black'}}
        />:null
      }
      <FlatList
        data={friends.friends}
        renderItem={(friend) => (
          <DefaultButton style={{flexDirection: 'row', width: width * ((width <= 560) ? 0.95:0.8) - 50, marginBottom: 5, marginLeft: 15}}>
            <Text style={{marginVertical: 3}}>{friend.item.username}</Text>
            <FriendButtonComponent friend={friend}/>
            <View style={{
              marginLeft: 5
            }}>
              <OnlineComponent uid={friend.item.uid}/>
            </View>
          </DefaultButton>
        )}  
      />
    </View>
  )
}