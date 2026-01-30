import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName =
    | 'default'
    | 'white'
    | 'sepia'
    | 'green'
    | 'pink'
    | 'dark'
    | 'dark-blue'
    | 'dark-green'
    | 'dark-blurple'
    | 'amoled-black';

export type FontFamily =
    | 'default'
    | 'alegreya'
    | 'noto-sans'
    | 'open-sans'
    | 'ubuntu'
    | 'roboto'
    | 'rubik'
    | 'montserrat'
    | 'source-code-pro';

export type ListStyle = 'comfortable' | 'condensed' | 'preview';

interface SettingsState {
    theme: ThemeName;
    fontFamily: FontFamily;
    fontSize: number;
    visibleLines: number;
    listStyle: ListStyle;
    syncMode: 'local' | 'cloud' | 'off';
    localServerUrl: string;
    firebaseEnabled: boolean;
    setTheme: (theme: ThemeName) => void;
    setFontFamily: (font: FontFamily) => void;
    setFontSize: (size: number) => void;
    setVisibleLines: (lines: number) => void;
    setListStyle: (style: ListStyle) => void;
    setSyncMode: (mode: 'local' | 'cloud' | 'off') => void;
    setLocalServerUrl: (url: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'default',
            fontFamily: 'default',
            fontSize: 16,
            visibleLines: 3,
            listStyle: 'comfortable',
            syncMode: 'local',
            localServerUrl: 'http://localhost:3000',
            firebaseEnabled: false,
            setTheme: (theme) => set({ theme }),
            setFontFamily: (fontFamily) => set({ fontFamily }),
            setFontSize: (fontSize) => set({ fontSize }),
            setVisibleLines: (visibleLines) => set({ visibleLines }),
            setListStyle: (listStyle) => set({ listStyle }),
            setSyncMode: (syncMode) => set({ syncMode }),
            setLocalServerUrl: (localServerUrl) => set({ localServerUrl }),
        }),
        {
            name: 'qklipto-settings',
        }
    )
);
