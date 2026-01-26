import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    theme: 'light' | 'dark';
    syncMode: 'local' | 'cloud' | 'off';
    localServerUrl: string;
    firebaseEnabled: boolean;
    setTheme: (theme: 'light' | 'dark') => void;
    setSyncMode: (mode: 'local' | 'cloud' | 'off') => void;
    setLocalServerUrl: (url: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'dark',
            syncMode: 'local',
            localServerUrl: 'http://localhost:3000',
            firebaseEnabled: false,
            setTheme: (theme) => set({ theme }),
            setSyncMode: (syncMode) => set({ syncMode }),
            setLocalServerUrl: (localServerUrl) => set({ localServerUrl }),
        }),
        {
            name: 'qklipto-settings',
        }
    )
);
