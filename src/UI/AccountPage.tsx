import { View, Text, Pressable, ActivityIndicator, TextInput, Platform, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { router } from 'expo-router'
import { deleteUser, signOut } from '../Functions/AuthenticationFunctions'
import { checkIfUsernameValid, getUsername, updateUsername } from '../Functions/UserFunctions'
import { auth } from '../Firebase/Firebase'
import DefaultButton from './DefaultButton'
import OnlineAuthenticationComponent from './OnlineAuthenticationComponent'
import { loadingState } from '../Types'
import UsernameComponent from './AddUserComponent'
import useUsernameExists from '../hooks/useUsernameExists'
import { ChevronLeft, CloseIcon, FriendIcon, OnlineIcon, SignOutIcon, TrashIcon } from './Icons'
import OnlineStatics from './OnlineStatics'

function DeleteText({
  secondsLeft,
  deleteState
}:{
  secondsLeft: number,
  deleteState: loadingState
}) {
  if (secondsLeft === 0 && deleteState === loadingState.notStarted) {
    return (
      <>
        <TrashIcon width={20} height={20} color={"white"}/>
        <Text style={{
          fontWeight: "bold",
          color: "white",
          fontSize: 17
        }}>DELETE EVERYTHING</Text>
      </>
    )
  }

  if (deleteState === loadingState.success) {
    return (
      <Text>Your Account Has Been Deleted</Text>
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

function SignOutButton() {
  const [signOutLoading, setSignOutLoading] = useState<boolean>(false)
  const [signOutFailed, setSignOutFailed] = useState<boolean>(false)
  
  async function loadSignOut() {
    setSignOutLoading(true)
    let result = await signOut()
    if (!result) {
      setSignOutFailed(true)
    }
    setSignOutLoading(false)
  }

  if (signOutFailed) {
    return (
      <View>
        <Text>Failed</Text>
      </View>
    )
  }

  if (signOutLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    )
  }

  return (
    <DefaultButton
      onPress={() => loadSignOut()}
      style={{marginBottom: 5, flexDirection: 'row'}}
    >
      <SignOutIcon width={19} height={19}/>
      <Text style={{
        fontSize: 16
      }}>Sign Out</Text>
    </DefaultButton>
  )
}

export default function AccountPage() {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const [username, setUsername] = useState<string>("");
  const [editingUsername, setEditingUsername] = useState<string>("")
  const [isAuth, setIsAuth] = useState(false)
  const usernameExists = useUsernameExists()
  const [isUpdatingUsername, setIsUpdatingUsername] = useState<boolean>(false)
  const [usernameState, setUsernameState] = useState<loadingState>(loadingState.loading)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  async function loadUpdateUsername() {
    let uid = auth.currentUser?.uid
    if (uid !== undefined) {
      setUsernameState(loadingState.loading)
      const result = await updateUsername(uid, editingUsername)
      if (result === true) {
        setUsernameState(loadingState.success)
        setUsername(editingUsername)
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
    check()
  }, [editingUsername])

  async function loadUserData() {
    const uid = auth.currentUser?.uid
    if (uid !== undefined) {
      const onlineUsername = await getUsername(uid)
      if (onlineUsername!== undefined) {
        setUsername(onlineUsername)
        setEditingUsername(onlineUsername)
      }
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() =>{
    const unlisten = auth.onAuthStateChanged(
      authUser => {
        if (authUser !== null) {
          setIsAuth(true)
        } else {
          setIsAuth(false)
        }
      },
    );
    return () => {
      unlisten();
    }
 }, []);

  if (!isAuth) {
    return <OnlineAuthenticationComponent onClose={() => {
      router.push("/")
    }}/>
  }

  if (usernameExists === loadingState.loading) {
    return (
      <View style={{width: width * ((width <= 560) ? 0.95:0.8), height: height * 0.8, backgroundColor: 'rgba(255,255,255, 0.95)', borderRadius: 25, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
        <Text>Loading</Text>
      </View>
    )
  }

  if (usernameExists === loadingState.failed) {
    return <UsernameComponent onClose={() => {
      router.push("/")
    }}/>
  }
  
  return (
    <View style={{width: width * (width <= 560 ? 0.95:0.8), backgroundColor: "rgba(255,255,255, 0.95)", height: height * 0.8, borderRadius: 25, padding: 10}}>
      <Pressable style={{marginTop: 25, marginLeft: 25}} onPress={() => {
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
              marginHorizontal: 4,
              fontFamily: 'RussoOne'
            }]}
          />:<Text style={{fontFamily: 'RussoOne', marginVertical: 3}}>{username}</Text>
        }
        <Pressable
          onPress={() => {
            if (!isUpdatingUsername) {
              setIsUpdatingUsername(true)
            } else {
              if (usernameState === loadingState.success) {
                loadUpdateUsername()
                setIsUpdatingUsername(false)
              } else if (usernameState === loadingState.exists && username === editingUsername) {
                setIsUpdatingUsername(false)
              } else if (usernameState === loadingState.failed) {
                setEditingUsername(username)
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
              {((usernameState === loadingState.success || username === editingUsername) && usernameState !== loadingState.loading) ?
                <Text style={{marginVertical: 3}}>Update Username</Text>:null
              }
              {(usernameState === loadingState.failed) ?
                <Text style={{marginVertical: 3}}>Something went wrong updating the username</Text>:null
              }
            </>:
            <>
              {(usernameState === loadingState.success || username === editingUsername) ?
                <Text style={{marginVertical: 3}}>Continue</Text>:null
              }
              {(usernameState === loadingState.exists && username !== editingUsername) ?
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
        router.push("/UTTT/friends")
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
  )
}