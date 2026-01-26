import { create } from 'zustand';

type View = 'clips' | 'tags' | 'trash' | 'settings';

interface UIState {
    currentView: View;
    setView: (view: View) => void;
}

export const useUIStore = create<UIState>((set) => ({
    currentView: 'clips',
    setView: (view) => set({ currentView: view }),
}));
