import { create } from 'zustand';
import { db } from '../db/database';
import { Clip } from '../models/Clip';
import { useLiveQuery } from 'dexie-react-hooks';
import { useUIStore } from './uiStore';

interface ClipActions {
    addClip: (clip: Clip) => Promise<void>;
    updateClip: (id: string, changes: Partial<Clip>) => Promise<void>;
    deleteClip: (id: string) => Promise<void>;
    restoreClip: (id: string) => Promise<void>;
    hardDeleteClip: (id: string) => Promise<void>;
}

export const useClipActions = create<ClipActions>(() => ({
    addClip: async (clip) => {
        await db.clips.add(clip);
    },
    updateClip: async (id, changes) => {
        await db.clips.update(id, { ...changes, modifyDate: new Date().toISOString(), pendingSync: true });
    },
    deleteClip: async (id) => {
        // Soft delete
        await db.clips.update(id, { deleted: true, modifyDate: new Date().toISOString(), pendingSync: true });
    },
    restoreClip: async (id) => {
        await db.clips.update(id, { deleted: false, modifyDate: new Date().toISOString(), pendingSync: true });
    },
    hardDeleteClip: async (id) => {
        await db.clips.delete(id);
    }
}));

// Separated hook for reactive data
export const useClipStore = () => {
    const { sortOption } = useUIStore();
    
    const clips = useLiveQuery(async () => {
        // Handle sorting
        // Note: 'modifyDate' is indexed, so it's fast. 'text' is not indexed, so we sort in memory for now.
        if (sortOption === 'date-desc') {
            return await db.clips.orderBy('modifyDate').reverse().toArray();
        } else if (sortOption === 'date-asc') {
            return await db.clips.orderBy('modifyDate').toArray();
        } else {
            // Sort by text/title
            const allClips = await db.clips.toArray();
            return allClips.sort((a, b) => {
                const textA = (a.title || a.text || '').toLowerCase();
                const textB = (b.title || b.text || '').toLowerCase();
                if (sortOption === 'name-asc') return textA.localeCompare(textB);
                return textB.localeCompare(textA);
            });
        }
    }, [sortOption]);

    const actions = useClipActions();

    return {
        clips: clips || [],
        loading: !clips,
        ...actions
    };
};
