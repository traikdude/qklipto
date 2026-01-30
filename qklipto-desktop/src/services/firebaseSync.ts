import { Clip } from '../models/Clip';
import { Folder } from '../models/Folder';
import {
    pushClipsBatch,
    pushFolderToFirestore,
    deleteFolderFromFirestore
} from './firestoreService';
import { firestore, auth } from '../lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

export const firebaseSyncService = {
    async push(clips: Clip[], folders: Folder[] = []) {
        if (!firestore || !auth?.currentUser) return;

        // Push Clips (Batch)
        if (clips.length > 0) {
            await pushClipsBatch(clips);
        }

        // Push Folders (One by one for now, or add batch to firestoreService)
        // TODO: Add batch folder push
        for (const folder of folders) {
            await pushFolderToFirestore(folder);
        }
    },

    async pull(lastSyncTime: string) {
        if (!firestore || !auth?.currentUser) return { hasUpdates: false, clips: [], folders: [] };

        const userId = auth.currentUser.uid;
        const lastSyncDate = new Date(lastSyncTime);
        const timestamp = Timestamp.fromDate(lastSyncDate);

        // Pull Clips
        const clipsRef = collection(firestore, 'users', userId, 'clips');
        const clipsQuery = query(clipsRef, where('updatedAt', '>', timestamp));
        const clipsSnapshot = await getDocs(clipsQuery);

        const clips: Clip[] = [];
        clipsSnapshot.forEach(doc => {
            const data = doc.data();
            clips.push({
                ...data,
                id: doc.id,
                createDate: data.createDate instanceof Timestamp ? data.createDate.toDate().toISOString() : data.createDate,
                modifyDate: data.modifyDate instanceof Timestamp ? data.modifyDate.toDate().toISOString() : data.modifyDate
            } as Clip);
        });

        // Pull Folders
        const foldersRef = collection(firestore, 'users', userId, 'folders');
        const foldersQuery = query(foldersRef, where('updatedAt', '>', timestamp));
        const foldersSnapshot = await getDocs(foldersQuery);

        const folders: Folder[] = [];
        foldersSnapshot.forEach(doc => {
            const data = doc.data();
            folders.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt
            } as Folder);
        });

        return {
            hasUpdates: clips.length > 0 || folders.length > 0,
            clips,
            folders
        };
    }
};
