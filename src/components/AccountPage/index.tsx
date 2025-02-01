/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, TextInput, Platform, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '@components/DefaultButton';
import OnlineAuthenticationComponent from '@components/OnlineAuthenticationComponent';
import UsernameComponent from '@components/AddUserComponent';
import { ChevronLeft, CloseIcon, FriendIcon, OfflineIcon, OnlineIcon, PencilIcon, TrashIcon } from '@components/Icons';
import OnlineStatics from '@components/OnlineStatics';
import SignOutButton from '@components/AccountPage/SignOutButton';
import { deleteUser } from '@functions/auth';
import { checkIfUsernameValid, updateUsername } from '@functions/UserFunctions';
import { auth } from '@functions/firebase';
import useUsername from '@hooks/useUsernameExists';
import useIsConnected from '@hooks/useIsConnected';
import useIsAuth from '@hooks/useIsAuth';
import { RootState } from '@redux/store';
import { loadingState } from '@types';

export function DeleteText({
  secondsLeft,
  deleteState,
  game
}:{
  secondsLeft: number,
  deleteState: loadingState,
  game?: boolean
}) {
  if (secondsLeft === 0 && deleteState === loadingState.notStarted) {
    return (
      <>
        <TrashIcon width={20} height={20} color={"white"}/>
        <Text style={{
          fontWeight: "bold",
          color: "white",
          fontSize: 17
        }}>{game === true ? "DELETE GAME":"DELETE EVERYTHING"}</Text>
      </>
    )
  }

  if (deleteState === loadingState.success) {
    return (
      <Text>{game === true ? "The Game Has Been Deleted":"Your Account Has Been Deleted"}</Text>
    )
  }

  if (deleteState === loadingState.failed) {
    return (
      <Text>Something Has Gone Wrong</Text>
    )
  }

  if (deleteState === loadingState.loading) {
    return <ActivityIndicator />
  }

  return (
    <Text style={{fontSize: 17, color: "white"}}>{secondsLeft}</Text>
  )
}

function ConfirmingDelete({
  onBack
}:{
  onBack: () => void
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [secondsLeft, setSecondsLeft] = useState<number>(5)
  const [deleteState, setDeleteState] = useState<loadingState>(loadingState.notStarted)
  const [boxHeight, setBoxHeight] = useState(0);

  async function deleteAccount() {
    setDeleteState(loadingState.loading)
    const result = await deleteUser()
    if (result === true) {
      setDeleteState(loadingState.success)
      onBack()
    } else {
      setDeleteState(loadingState.failed)
    }
  }

  useEffect(() => {
    let time = 5
    const id = setInterval(() => {
      if (time < 1) {
        clearInterval(id)
      } else {
        setSecondsLeft(time - 1)
        time -= 1
      }
    }, 1000)
  }, [])
  
  return (
    <View style={{
      height,
      width,
      backgroundColor: 'rgba(169,169,169,0.9)'
    }}>
      <View
        style={{
          width: width * ((width <= 560) ? 0.95:0.8),
          backgroundColor: "white",
          padding: 10,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: "black",
          marginLeft: width * ((width <= 560) ? 0.025:0.1),
          marginTop: (height - boxHeight)/2
        }}
        onLayout={(e) => {
          setBoxHeight(e.nativeEvent.layout.height)
        }}
      >
        <Text style={{fontSize: 30, textAlign: 'center'}}>Are you sure?</Text>
        <Text style={{
          margin: 5,
          fontSize: 17
        }}>THIS CANNOT BE UNDONE, ARE YOU SURE YOU WANT TO <Text style={{color: 'red', fontWeight: 'bold'}}>DELETE</Text> YOUR ACCOUNT?</Text>
        {(deleteState === loadingState.failed) ?
          <Text style={{
            marginBottom: 5
          }}>Something has gone wrong deleting your account. If this issue persists and you would like your account deleted, please email <Text style={{
            fontWeight: 'bold'
          }}>andrewmainella@icloud.com</Text>.</Text>:null
        }
        <DefaultButton
          onPress={() => {
            if (secondsLeft === 0) {
              deleteAccount()
            }
          }}
          disabled={secondsLeft !== 0 || (deleteState !== loadingState.failed && deleteState !== loadingState.notStarted)}
          style={{
            backgroundColor: (secondsLeft !== 0) ? "gray":"red",
            flexDirection: 'row',
            justifyContent: 'center'
          }}
        >
          <DeleteText secondsLeft={secondsLeft} deleteState={deleteState} />
        </DefaultButton>
        <DefaultButton
          style={{
            flexDirection: 'row',
            marginTop: 5
          }}
          onPress={() => {
            onBack()
          }}
        >
          <ChevronLeft width={20} height={20}/>
          <Text style={{
            fontSize: 17
          }}>No Go Back</Text>
        </DefaultButton>
      </View>
    </View>
  )
}

export default function AccountPage() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [editingUsername, setEditingUsername] = useState<string>("")
  const username = useUsername()
  const [isUpdatingUsername, setIsUpdatingUsername] = useState<boolean>(false)
  const [usernameState, setUsernameState] = useState<loadingState>(loadingState.loading)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const isConnected = useIsConnected()
  const [pageHeight, setPageHeight] = useState<number>(0)
  const router = useRouter()
  const {isAuth, isLoading} = useIsAuth()

  async function loadUpdateUsername() {
    let uid = auth.currentUser?.uid
    if (uid !== undefined) {
      setUsernameState(loadingState.loading)
      const result = await updateUsername(uid, editingUsername)
      if (result === true) {
        setUsernameState(loadingState.success)
      } else {
        setUsernameState(loadingState.failed)
      }
    }
  }

  async function check() {
    setUsernameState(loadingState.loading)
    if (editingUsername.length > 2) {
      setUsernameState(await checkIfUsernameValid(editingUsername))
    } else {
      setUsernameState(loadingState.loading)
    }
  }

  useEffect(() => {
    if (isAuth) {
      check()
    }
  }, [editingUsername, isAuth])

  useEffect(() => {
    setEditingUsername(username.username)
  }, [username.username])

  if (isLoading) {
    return (
      <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
        <Text>Loading</Text>
      </View>
    )
  }

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

  if (!isAuth) {
    return <OnlineAuthenticationComponent onClose={() => {
      router.push("/")
    }}/>
  }

  if (username.exists === loadingState.loading) {
    return (
      <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
        <Text>Loading</Text>
      </View>
    )
  }

  if (username.exists === loadingState.failed) {
    return <UsernameComponent onClose={() => {
      router.push("/")
    }}/>
  }
  
  return (
    <View style={{width: width * (width <= 560 ? 0.95:0.8), backgroundColor: "rgba(255,255,255, 0.95)", height: (pageHeight > (height * 0.8)) ? height * 0.9:height * 0.8, borderRadius: 25, padding: 10}}>
      <View onLayout={(e) => {setPageHeight(e.nativeEvent.layout.height)}}>
        <Pressable style={{marginTop: (width <= 560) ? 15:25, marginLeft: (width <= 560) ? 15:25}} onPress={() => {
          router.push("/")
        }}>
          <CloseIcon width={30} height={30}/>
        </Pressable>
        <Text style={{
          fontWeight: "bold",
          fontSize: 25,
          textAlign: 'center'
        }}>Account Page</Text>
        <View style={{flexDirection: 'row', backgroundColor: "white", padding: 10, borderRadius: 4, borderWidth: 1, borderColor: 'black', marginTop: 10}}>
          <Text style={{marginVertical: 3}}>Username: </Text>
          { isUpdatingUsername ?
            <TextInput
              value={editingUsername}
              onChangeText={setEditingUsername}
              // @ts-expect-error
              style={[Platform.select({
                web: {
                  outlineStyle: 'none'
                }
              }), {
                width: "100%",
                marginHorizontal: (Platform.OS === "ios") ? 0:4,
                fontFamily: 'RussoOne',
                fontSize: 14
              }]}
            />:<Text style={{fontFamily: 'RussoOne', marginVertical: 3, fontSize: 14}}>{username.username}</Text>
          }
          <Pressable
            onPress={() => {
              if (!isUpdatingUsername) {
                setIsUpdatingUsername(true)
              } else {
                if (usernameState === loadingState.success) {
                  loadUpdateUsername()
                  setIsUpdatingUsername(false)
                } else if (usernameState === loadingState.exists && username.username === editingUsername) {
                  setIsUpdatingUsername(false)
                } else if (usernameState === loadingState.failed) {
                  setEditingUsername(username.username)
                  setIsUpdatingUsername(false)
                }
              }
            }}
            style={{
              marginLeft: 'auto'
            }}
            hitSlop={10}
          >
            {!isUpdatingUsername ?
              <>
                {(usernameState === loadingState.loading) ?
                  <ActivityIndicator/>:null
                }
                {((usernameState === loadingState.success || username.username === editingUsername) && usernameState !== loadingState.loading && width < 576) ?
                  <PencilIcon width={20} height={20}/>:null
                }
                 {((usernameState === loadingState.success || username.username === editingUsername) && usernameState !== loadingState.loading && width >= 576) ?
                  <Text style={{marginVertical: 3}}>Update Username</Text>:null
                }
                {(usernameState === loadingState.failed) ?
                  <Text style={{marginVertical: 3}}>Something went wrong updating the username</Text>:null
                }
              </>:
              <>
                {(usernameState === loadingState.success || username.username === editingUsername) ?
                  <Text style={{marginVertical: 3}}>Continue</Text>:null
                }
                {(usernameState === loadingState.exists && username.username !== editingUsername) ?
                  <Text style={{marginVertical: 3}}>Username Already Exists</Text>:null
                }
                {(usernameState === loadingState.failed) ?
                  <Text style={{marginVertical: 3}}>Failed</Text>:null
                }
              </>
            }
          </Pressable>
        </View>
        <View style={{
          flexDirection: 'row',
          marginVertical: 15
        }}>
          <OnlineIcon width={20} height={20} style={{
            marginRight: 5
          }}/>
          <Text style={{
            fontSize: 16, marginTop: 2
          }}>Online Stats</Text>
        </View>
        <OnlineStatics />
        <DefaultButton onPress={() => {
          if (Platform.OS === "web") {
            router.push("/UTTT/friends")
          } else {
            router.replace("/UTTT/friends")
          }
        }}
          style={{
            marginBottom: 5,
            flexDirection: 'row'
          }}
        >
          <FriendIcon width={20} height={20}/>
          <Text style={{marginVertical: 3}}>Friends</Text>
        </DefaultButton>
        <SignOutButton />
        <DefaultButton style={{backgroundColor: "red", flexDirection: 'row'}} onPress={() => {
          setIsConfirmingDelete(true)
        }}>
          <TrashIcon width={20} height={20} color='white'/>
          <Text style={{fontWeight: 'bold', color: 'white', marginVertical: 3}}>Delete Account</Text>
        </DefaultButton>
        <Modal visible={isConfirmingDelete} transparent>
          <ConfirmingDelete onBack={() => {
            setIsConfirmingDelete(false)
          }}/>
        </Modal>
      </View>
    </View>
  )
}