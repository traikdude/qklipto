import { create } from 'zustand';

export type View = 'clips' | 'tags' | 'trash' | 'settings' | 'favorites';
export type FilterType = 'all' | 'text' | 'link' | 'favorite' | 'recent';
export type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

interface UIState {
    currentView: View;
    setView: (view: View) => void;

    // Drawer State
    drawerOpen: boolean;
    toggleDrawer: () => void;
    setDrawerOpen: (open: boolean) => void;

    // Search & Filter
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isSearchFocused: boolean;
    setSearchFocused: (focused: boolean) => void;

    // Filters
    activeFilter: FilterType;
    setActiveFilter: (filter: FilterType) => void;
    sortOption: SortOption;
    setSortOption: (option: SortOption) => void;
    selectedTags: string[];
    setSelectedTags: (tags: string[]) => void;
    toggleTagFilter: (tagName: string) => void;

    // Selection Mode
    selectionMode: boolean;
    selectedClipIds: string[];
    setSelectionMode: (active: boolean) => void;
    toggleClipSelection: (clipId: string) => void;
    selectAllClips: (clipIds: string[]) => void;
    clearSelection: () => void;

    // Editor Modal
    editorOpen: boolean;
    editingClipId: string | null;
    openEditor: (clipId?: string) => void;
    closeEditor: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    currentView: 'clips',
    setView: (view) => set({ currentView: view, drawerOpen: false }),

    drawerOpen: false,
    toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
    setDrawerOpen: (open) => set({ drawerOpen: open }),

    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    isSearchFocused: false,
    setSearchFocused: (focused) => set({ isSearchFocused: focused }),

    activeFilter: 'all',
    setActiveFilter: (filter) => set({ activeFilter: filter }),
    sortOption: 'date-desc',
    setSortOption: (option) => set({ sortOption: option }),
    selectedTags: [],
    setSelectedTags: (tags) => set({ selectedTags: tags }),
    toggleTagFilter: (tagName) => set((state) => ({
        selectedTags: state.selectedTags.includes(tagName)
            ? state.selectedTags.filter(t => t !== tagName)
            : [...state.selectedTags, tagName]
    })),

    selectionMode: false,
    selectedClipIds: [],
    setSelectionMode: (active) => set({ selectionMode: active, selectedClipIds: active ? [] : [] }),
    toggleClipSelection: (clipId) => set((state) => {
        const isSelected = state.selectedClipIds.includes(clipId);
        const newSelected = isSelected
            ? state.selectedClipIds.filter(id => id !== clipId)
            : [...state.selectedClipIds, clipId];
        
        // Auto-exit selection mode if deselecting last item? (Optional, maybe keep it sticky for now)
        return { 
            selectedClipIds: newSelected,
            selectionMode: newSelected.length > 0 || state.selectionMode 
        };
    }),
    selectAllClips: (clipIds) => set({ selectionMode: true, selectedClipIds: clipIds }),
    clearSelection: () => set({ selectionMode: false, selectedClipIds: [] }),

    editorOpen: false,
    editingClipId: null,
    openEditor: (clipId) => set({ editorOpen: true, editingClipId: clipId || null }),
    closeEditor: () => set({ editorOpen: false, editingClipId: null }),
}));
