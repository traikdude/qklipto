import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    Timestamp,
    writeBatch
} from 'firebase/firestore';
import { firestore, auth } from '../lib/firebase';
import { Clip } from '../models/Clip';
import { Folder } from '../models/Folder';

// Helper to get current user ID
const getUserId = () => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    return auth.currentUser.uid;
};

// --- Clips ---

export const pushClipToFirestore = async (clip: Clip) => {
    try {
        const userId = getUserId();
        const clipRef = doc(firestore, `users/${userId}/clips`, clip.id);

        // Convert dates to Firestore Timestamps or ISO strings
        const data = {
            ...clip,
            updatedAt: Timestamp.now(),
            // Ensure we don't sync local-only fields if any
        };

        await setDoc(clipRef, data, { merge: true });
        console.log(`Synced clip ${clip.id} to Firestore`);
    } catch (error) {
        console.error("Error syncing clip to Firestore:", error);
        throw error;
    }
};

export const deleteClipFromFirestore = async (clipId: string) => {
    try {
        const userId = getUserId();
        const clipRef = doc(firestore, `users/${userId}/clips`, clipId);
        await deleteDoc(clipRef);
        console.log(`Deleted clip ${clipId} from Firestore`);
    } catch (error) {
        console.error("Error deleting clip from Firestore:", error);
        throw error;
    }
};

// --- Folders ---

export const pushFolderToFirestore = async (folder: Folder) => {
    try {
        const userId = getUserId();
        const folderRef = doc(firestore, `users/${userId}/folders`, folder.id);

        const data = {
            ...folder,
            updatedAt: Timestamp.now(),
        };

        await setDoc(folderRef, data, { merge: true });
        console.log(`Synced folder ${folder.id} to Firestore`);
    } catch (error) {
        console.error("Error syncing folder to Firestore:", error);
        throw error;
    }
};

export const deleteFolderFromFirestore = async (folderId: string) => {
    try {
        const userId = getUserId();
        const folderRef = doc(firestore, `users/${userId}/folders`, folderId);
        await deleteDoc(folderRef);
        console.log(`Deleted folder ${folderId} from Firestore`);
    } catch (error) {
        console.error("Error deleting folder from Firestore:", error);
        throw error;
    }
};

// --- Batch Operations ---

export const pushClipsBatch = async (clips: Clip[]) => {
    if (clips.length === 0) return;

    const userId = getUserId();
    const batch = writeBatch(firestore);

    clips.forEach(clip => {
        const ref = doc(firestore, `users/${userId}/clips`, clip.id);
        batch.set(ref, {
            ...clip,
            updatedAt: Timestamp.now()
        }, { merge: true });
    });

    await batch.commit();
    console.log(`Batch synced ${clips.length} clips`);
};
