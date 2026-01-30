import { useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Hook to apply theme and font settings to the document
 */
export const useTheme = () => {
    const { theme, fontFamily, fontSize } = useSettingsStore();

    useEffect(() => {
        // Apply theme
        document.documentElement.setAttribute('data-theme', theme);

        // Apply font
        document.body.setAttribute('data-font', fontFamily);

        // Apply font size to root (affects rem units)
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [theme, fontFamily, fontSize]);
};
