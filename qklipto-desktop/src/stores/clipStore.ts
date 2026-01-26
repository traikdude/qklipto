import { create } from 'zustand';
import { db } from '../db/database';
import { Clip } from '../models/Clip';
import { useLiveQuery } from 'dexie-react-hooks';

interface ClipState {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    // We don't need to store clips in Zustand if we use useLiveQuery + Dexie directly in components,
    // but for complex filtering/UI state, it's useful.
    // We'll focus on UI state here.
}

export const useClipStore = create<ClipState>((set) => ({
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
}));

// Helper hook for clips with Dexie Live Query
export const useClips = () => {
    // This is a placeholder for the component-level hook
    // usage: const clips = useLiveQuery(() => db.clips.toArray())
    return {
        // ...
    };
};
