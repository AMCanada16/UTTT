/*
  Ultimate Tic Tac Toe
  Andrew Mainella
  18 November 2023
  Welcome.tsx
*/
import { View, Text, Pressable, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { router, useGlobalSearchParams, useRouter } from "expo-router";
import AccountPage from "../components/AccountPage";
import BottomComponent from "../components/BottomComponent";
import FriendsPage from "../components/FriendsPage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectOnlineGame from "../components/SelectOnlineGame"
import SelectStorageGames from "../components/SelectStorageGame";

function Overlay({online}:{online: boolean}) {
  const { gameType } = useGlobalSearchParams()
  if  (gameType === "account") {
    return <AccountPage />
  } else if (online) {
    return <SelectOnlineGame onClose={() => router.push("/")}/>
  } else if (gameType === "ai" || gameType === "friend") {
    return <SelectStorageGames isFriend={gameType === "friend"} onClose={() => {router.push("/")}}/>
  } else if (gameType === "friends") {
    return <FriendsPage />
  }
  return null
}

export function WelcomePage({
  online
}:{
  online: boolean
}) {
  const {height, width} = useSelector((state: RootState) => state.dimensions)
  const insets = useSafeAreaInsets()
  // text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
  //red overide: #ff9c9c //Shadow #FF5757

  return(
    <View style={{backgroundColor: "#5E17EB", width: width, overflow: "hidden", height: height}}>
      <View style={{height: (width > 560) ? 150:((width * 0.255) - 10), width, alignItems: 'center', marginTop: insets.top}}>
        <Text numberOfLines={1} selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 560) ? 150:((width * 0.255) - 10), position: "absolute"}}>ULTIMATE</Text>
        <Text numberOfLines={1} selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 560) ? 150:((width * 0.255) - 10), color: "#00fffc", transform: [{translateX: -2}, {translateY: -1}], position: "absolute", zIndex: -1, textAlign: 'center'}}>ULTIMATE</Text>
        <Text numberOfLines={1} selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 560) ? 150:((width * 0.255) - 10), color: "#fc00ff", transform: [{translateX: -2}, {translateY: 2}], position: "absolute", zIndex: -2, textAlign: 'center'}}>ULTIMATE</Text>
        <Text numberOfLines={1} selectable={false} style={{fontFamily: "Ultimate", fontSize: (width > 560) ? 150:((width * 0.255) - 10), color: "#fffc00", transform: [{translateX: 1}, {translateY: 4}], position: "absolute", zIndex: -3, textAlign: 'center'}}>ULTIMATE</Text>
      </View>
      <Text style={{flexDirection: "row", textAlign: 'center'}}>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 390) ? 50:(width * 0.13) - 10, color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25, textAlign: 'center'}}>TICK </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 390) ? 50:(width * 0.13) - 10, color: "#a0f4f7", textShadowColor: "#5CE1E6", textShadowRadius: 25, textAlign: 'center'}}>TAC </Text>
        <Text selectable={false} style={{fontFamily: "RussoOne", fontSize: (width > 390) ? 50:(width * 0.13) - 10, color: "#ff9c9c", textShadowColor: "#FF5757", textShadowRadius: 25, textAlign: 'center'}}>TOE </Text>
      </Text>
      <View>
        <Text style={{marginLeft: '5%', marginTop: 10, marginBottom: 10, color: 'white', marginRight: "5%"}}>Ultimate Tic Tac Toe takes tic tac toe to the next level. Battle it out with your friends or AI. Online gameplay is also avaliable.</Text>
        <View>
          
        </View>
      </View>
      <BottomComponent />
      <View style={{alignContent: "center", alignItems: "center", justifyContent: "center", position: "absolute", width: width, height: height}} pointerEvents='box-none'>
        <Overlay online={online}/>
      </View>
    </View>
  )
}

export default function DefaultMainWelcomePage() {
  return <WelcomePage online={false}/>
}