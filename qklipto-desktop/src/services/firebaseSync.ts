import { Clip } from '../models/Clip';
import { firestore, auth } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

export const firebaseSyncService = {
    async push(clips: Clip[]) {
        if (!firestore || !auth?.currentUser) return;

        const userId = auth.currentUser.uid;
        const batch = []; // Firestore batching logic would go here

        for (const clip of clips) {
            const clipRef = doc(firestore, 'users', userId, 'clips', clip.id);
            await setDoc(clipRef, {
                ...clip,
                userId,
                modifyDate: Timestamp.fromDate(new Date(clip.modifyDate))
            }, { merge: true });
        }
    },

    async pull(lastSyncTime: string) {
        if (!firestore || !auth?.currentUser) return { hasUpdates: false, clips: [] };

        const userId = auth.currentUser.uid;
        const clipsRef = collection(firestore, 'users', userId, 'clips');

        // Query for clips modified after last sync
        const q = query(clipsRef, where('modifyDate', '>', Timestamp.fromDate(new Date(lastSyncTime))));
        const snapshot = await getDocs(q);

        const clips: Clip[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            clips.push({
                id: doc.id,
                text: data.text,
                title: data.title,
                type: "0",
                fav: data.fav,
                deleted: data.deleted,
                tags: data.tags || [],
                createDate: data.createDate instanceof Timestamp ? data.createDate.toDate().toISOString() : data.createDate,
                modifyDate: data.modifyDate instanceof Timestamp ? data.modifyDate.toDate().toISOString() : data.modifyDate
            });
        });

        return { hasUpdates: clips.length > 0, clips };
    }
};
