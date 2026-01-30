import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Folder, createFolder, buildFolderTree, FolderNode } from '../models/Folder';

interface FolderState {
    folders: Folder[];
    selectedFolderId: string | null; // null = "All Clips" view
    expandedFolderIds: Set<string>;

    // Actions
    addFolder: (name: string, parentId: string | null) => Folder;
    updateFolder: (id: string, updates: Partial<Folder>) => void;
    deleteFolder: (id: string) => void;
    moveFolder: (folderId: string, newParentId: string | null) => void;
    setSelectedFolder: (folderId: string | null) => void;
    toggleFolderExpanded: (folderId: string) => void;
    expandFolder: (folderId: string) => void;
    collapseFolder: (folderId: string) => void;

    // Computed
    getFolderTree: () => FolderNode[];
    getFolderById: (id: string) => Folder | undefined;
    getSubfolders: (parentId: string | null) => Folder[];
}

export const useFolderStore = create<FolderState>()(
    persist(
        (set, get) => ({
            folders: [],
            selectedFolderId: null,
            expandedFolderIds: new Set<string>(),

            addFolder: (name: string, parentId: string | null = null) => {
                const newFolder = createFolder(name, parentId);
                set((state) => ({
                    folders: [...state.folders, newFolder]
                }));
                return newFolder;
            },

            updateFolder: (id: string, updates: Partial<Folder>) => {
                set((state) => ({
                    folders: state.folders.map((folder) =>
                        folder.id === id
                            ? { ...folder, ...updates, modifyDate: new Date().toISOString() }
                            : folder
                    )
                }));
            },

            deleteFolder: (id: string) => {
                // Get all descendant folder IDs
                const getDescendants = (folderId: string): string[] => {
                    const children = get().folders.filter(f => f.parentId === folderId);
                    return [
                        folderId,
                        ...children.flatMap(child => getDescendants(child.id))
                    ];
                };

                const toDelete = getDescendants(id);

                set((state) => ({
                    folders: state.folders.filter(f => !toDelete.includes(f.id)),
                    selectedFolderId: toDelete.includes(state.selectedFolderId || '')
                        ? null
                        : state.selectedFolderId
                }));
            },

            moveFolder: (folderId: string, newParentId: string | null) => {
                // Prevent moving a folder into itself or its descendants
                const getDescendants = (id: string): string[] => {
                    const children = get().folders.filter(f => f.parentId === id);
                    return [id, ...children.flatMap(child => getDescendants(child.id))];
                };

                const descendants = getDescendants(folderId);
                if (newParentId && descendants.includes(newParentId)) {
                    console.warn('Cannot move folder into itself or its descendants');
                    return;
                }

                get().updateFolder(folderId, { parentId: newParentId });
            },

            setSelectedFolder: (folderId: string | null) => {
                set({ selectedFolderId: folderId });
            },

            toggleFolderExpanded: (folderId: string) => {
                set((state) => {
                    const newExpanded = new Set(state.expandedFolderIds);
                    if (newExpanded.has(folderId)) {
                        newExpanded.delete(folderId);
                    } else {
                        newExpanded.add(folderId);
                    }
                    return { expandedFolderIds: newExpanded };
                });
            },

            expandFolder: (folderId: string) => {
                set((state) => ({
                    expandedFolderIds: new Set([...state.expandedFolderIds, folderId])
                }));
            },

            collapseFolder: (folderId: string) => {
                set((state) => {
                    const newExpanded = new Set(state.expandedFolderIds);
                    newExpanded.delete(folderId);
                    return { expandedFolderIds: newExpanded };
                });
            },

            getFolderTree: () => {
                return buildFolderTree(get().folders);
            },

            getFolderById: (id: string) => {
                return get().folders.find(f => f.id === id);
            },

            getSubfolders: (parentId: string | null) => {
                return get().folders.filter(f => f.parentId === parentId);
            }
        }),
        {
            name: 'qklipto-folders',
            partialize: (state) => ({
                folders: state.folders,
                selectedFolderId: state.selectedFolderId,
                expandedFolderIds: Array.from(state.expandedFolderIds) // Convert Set to Array for serialization
            }),
            // Custom merge to handle Set deserialization
            merge: (persistedState: any, currentState) => ({
                ...currentState,
                ...persistedState,
                expandedFolderIds: new Set(persistedState?.expandedFolderIds || [])
            })
        }
    )
);
