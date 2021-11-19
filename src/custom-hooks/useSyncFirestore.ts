import { useEffect } from 'react';
import { useFirebaseContext } from '../firebase/FirebaseAuthProvider';
import Firebase from '../firebase/firebase';
import { store } from '../app/store';

export function useSyncFirestore() {
    const { user } = useFirebaseContext()
    const db = Firebase.firestore();
    useEffect(() => {
        store.subscribe(() => {
            const newState = store.getState();
            if (user) {
                const {uid } = user;
                db.collection('users').doc(uid).set(newState)
                    .catch((err) => console.log('firebase error' ,err))
            }  
        })
    }, [user, db])
}