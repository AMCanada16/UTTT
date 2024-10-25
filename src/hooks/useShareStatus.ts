import { onDisconnect, ref, set } from 'firebase/database';
import { auth, database } from '../firebase';
import { useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

export default function useShareStatus() {
  useEffect(() => {
    const unlisten = auth.onAuthStateChanged(
      authUser => {
        if (authUser !== null) {
          const onlineRef = ref(database, `/status/${authUser.uid}`) 
          set(onlineRef, {
            online: true,
            lastSeen: Timestamp.now()
          });
          onDisconnect(onlineRef).set({
            online: false,
            lastSeen: Timestamp.now()
          });
        }
      },
    );
    return () => {
      unlisten();
    }
  }, [])
  return null
}