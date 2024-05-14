import { onDisconnect, ref, set } from 'firebase/database';
import { auth, database } from '../firebase';
import { useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

export default function useShareStatus() {
  useEffect(() => {
    let pastUid = ""
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
          pastUid = authUser.uid
        } else {
          if (pastUid !== "") {
            const onlineRef = ref(database, `/status/${pastUid}`) 
            set(onlineRef, {
              online: false,
              lastSeen: Timestamp.now()
            });
            pastUid = ""
          }
        }
      },
    );
    return () => {
      unlisten();
    }
  }, [])
  return null
}