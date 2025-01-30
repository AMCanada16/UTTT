/*
  UTTT
  Andrew Mainella
  22 September 2024
*/
import { OfflineIcon, OnlineIcon } from "@components/Icons";
import useUserOnline from "@hooks/useUserOnline";

export default function OnlineComponent({uid}:{uid: string}) {
  const isOnline = useUserOnline(uid)
  if (isOnline) {
    return <OnlineIcon width={20} height={20}/>
  }
  return <OfflineIcon width={20} height={20}/>
}