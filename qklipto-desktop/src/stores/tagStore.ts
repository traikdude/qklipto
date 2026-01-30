import { create } from 'zustand';
import { db } from '../db/database';
import { Tag, createTag } from '../models/Tag';
import { useLiveQuery } from 'dexie-react-hooks';

interface TagState {
    tags: Tag[];
    selectedTagId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadTags: () => Promise<void>;
    addTag: (name: string, color?: string) => Promise<void>;
    updateTag: (id: string, updates: Partial<Tag>) => Promise<void>;
    deleteTag: (id: string) => Promise<void>;
    setSelectedTag: (id: string | null) => void;
    getTagById: (id: string) => Tag | undefined;
}

export const useTagStore = create<TagState>((set, get) => ({
    tags: [],
    selectedTagId: null,
    isLoading: false,
    error: null,

    loadTags: async () => {
        set({ isLoading: true });
        try {
            const tags = await db.tags.toArray();
            set({ tags, isLoading: false });
        } catch (error) {
            console.error('Failed to load tags:', error);
            set({ error: 'Failed to load tags', isLoading: false });
        }
    },

    addTag: async (name: string, color?: string) => {
        const newTag = createTag(name, color);
        try {
            await db.tags.add(newTag);
            // Refresh state
            const tags = await db.tags.toArray();
            set({ tags });
        } catch (error) {
            console.error('Failed to add tag:', error);
            set({ error: 'Failed to create tag' });
        }
    },

    updateTag: async (id: string, updates: Partial<Tag>) => {
        try {
            const oldTag = await db.tags.get(id);
            if (!oldTag) return;

            await db.transaction('rw', db.tags, db.clips, async () => {
                await db.tags.update(id, updates);

                // If name changed, update all clips using this tag
                if (updates.name && updates.name !== oldTag.name) {
                    const clips = await db.clips.filter(c => c.tags?.includes(oldTag.name || '')).toArray();
                    for (const clip of clips) {
                        const newTags = clip.tags?.map(t => t === oldTag.name ? updates.name! : t) || [];
                        await db.clips.update(clip.id, {
                            tags: newTags,
                            modifyDate: new Date().toISOString(),
                            pendingSync: true
                        });
                    }
                }
            });

            // Refresh state
            const tags = await db.tags.toArray();
            set({ tags });
        } catch (error) {
            console.error('Failed to update tag:', error);
            set({ error: 'Failed to update tag' });
        }
    },

    deleteTag: async (id: string) => {
        try {
            const tag = await db.tags.get(id);
            if (!tag) return;

            await db.transaction('rw', db.tags, db.clips, async () => {
                await db.tags.delete(id);

                // Remove this tag from all clips
                const clips = await db.clips.filter(c => c.tags?.includes(tag.name)).toArray();
                for (const clip of clips) {
                    const newTags = clip.tags?.filter(t => t !== tag.name) || [];
                    await db.clips.update(clip.id, {
                        tags: newTags,
                        modifyDate: new Date().toISOString(),
                        pendingSync: true
                    });
                }
            });

            // Refresh state
            const tags = await db.tags.toArray();
            set({ tags, selectedTagId: get().selectedTagId === id ? null : get().selectedTagId });
        } catch (error) {
            console.error('Failed to delete tag:', error);
            set({ error: 'Failed to delete tag' });
        }
    },

    setSelectedTag: (id) => set({ selectedTagId: id }),

    getTagById: (id) => get().tags.find(t => t.id === id)
}));
