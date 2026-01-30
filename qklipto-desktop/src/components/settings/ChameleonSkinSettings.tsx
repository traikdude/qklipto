import React from 'react';
import { useSettingsStore, ThemeName, FontFamily } from '../../stores/settingsStore';
import { Palette, Type, AlignJustify } from 'lucide-react';

interface ThemeOption {
    id: ThemeName;
    label: string;
    colors: {
        primary: string;
        background: string;
        surface: string;
    };
}

const themeOptions: ThemeOption[] = [
    { id: 'default', label: 'Default', colors: { primary: '#FF6B35', background: '#212121', surface: '#303030' } },
    { id: 'white', label: 'White', colors: { primary: '#2196F3', background: '#FFFFFF', surface: '#F5F5F5' } },
    { id: 'sepia', label: 'Sepia', colors: { primary: '#D4A574', background: '#F4ECD8', surface: '#EFE4CE' } },
    { id: 'green', label: 'Green', colors: { primary: '#66BB6A', background: '#E8F5E9', surface: '#C8E6C9' } },
    { id: 'pink', label: 'Pink', colors: { primary: '#EC407A', background: '#FCE4EC', surface: '#F8BBD0' } },
    { id: 'dark', label: 'Dark', colors: { primary: '#FF6B35', background: '#1E1E1E', surface: '#2D2D2D' } },
    { id: 'dark-blue', label: 'Dark Blue', colors: { primary: '#42A5F5', background: '#0D1B2A', surface: '#1B263B' } },
    { id: 'dark-green', label: 'Dark Green', colors: { primary: '#66BB6A', background: '#0D1F12', surface: '#1B3A24' } },
    { id: 'dark-blurple', label: 'Dark Blurple', colors: { primary: '#7C4DFF', background: '#1A1625', surface: '#2A2338' } },
    { id: 'amoled-black', label: 'AMOLED Black', colors: { primary: '#FF6B35', background: '#000000', surface: '#0A0A0A' } },
];

const fontOptions: { id: FontFamily; label: string; style: string }[] = [
    { id: 'default', label: 'Default', style: 'Roboto' },
    { id: 'alegreya', label: 'Alegreya', style: 'Alegreya' },
    { id: 'noto-sans', label: 'Noto Sans', style: 'Noto Sans' },
    { id: 'open-sans', label: 'Open Sans', style: 'Open Sans' },
    { id: 'ubuntu', label: 'Ubuntu', style: 'Ubuntu' },
    { id: 'roboto', label: 'Roboto', style: 'Roboto' },
    { id: 'rubik', label: 'Rubik', style: 'Rubik' },
    { id: 'montserrat', label: 'Montserrat', style: 'Montserrat' },
    { id: 'source-code-pro', label: 'Source Code Pro', style: 'Source Code Pro' },
];

export const ChameleonSkinSettings: React.FC = () => {
    const { theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize, visibleLines, setVisibleLines } = useSettingsStore();

    return (
        <div className="space-y-8">
            {/* Theme Selector */}
            <section className="bg-clipto-surface rounded-xl p-6 border border-clipto-surfaceLight">
                <h2 className="text-xl font-semibold text-clipto-text mb-4 flex items-center gap-2">
                    <Palette size={24} className="text-clipto-primary" />
                    Chameleon Skin
                </h2>
                <p className="text-sm text-clipto-textSecondary mb-6">
                    By default, the application uses a color scheme that automatically changes between light and dark depending on the system settings.
                    You can activate any other theme that will look the same regardless of the system settings.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {themeOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setTheme(option.id)}
                            className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === option.id
                                ? 'border-clipto-primary bg-clipto-primary/10'
                                : 'border-clipto-divider hover:border-clipto-textMuted'
                                }`}
                        >
                            {/* Theme Preview Card */}
                            <div
                                className="w-full h-16 rounded-lg shadow-md flex flex-col overflow-hidden"
                                style={{ backgroundColor: option.colors.background }}
                            >
                                <div
                                    className="h-4 w-full flex items-center justify-center"
                                    style={{ backgroundColor: option.colors.surface }}
                                >
                                    <div
                                        className="w-8 h-2 rounded-full"
                                        style={{ backgroundColor: option.colors.primary }}
                                    />
                                </div>
                                <div className="flex-1 flex items-center justify-center gap-1 px-2">
                                    <div className="w-full h-1 rounded" style={{ backgroundColor: option.colors.surface, opacity: 0.5 }} />
                                </div>
                            </div>

                            {/* Label */}
                            <span className={`text-xs font-medium ${theme === option.id ? 'text-clipto-primary' : 'text-clipto-textSecondary'}`}>
                                {option.label}
                            </span>

                            {/* Selected Indicator */}
                            {theme === option.id && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-clipto-primary rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Font Selector */}
            <section className="bg-clipto-surface rounded-xl p-6 border border-clipto-surfaceLight">
                <h2 className="text-xl font-semibold text-clipto-text mb-4 flex items-center gap-2">
                    <Type size={24} className="text-clipto-primary" />
                    Text Font
                </h2>

                {/* Font Preview */}
                <div className="mb-6 p-4 bg-clipto-background rounded-lg border border-clipto-divider">
                    <p className="text-clipto-text mb-2" style={{ fontFamily: fontOptions.find(f => f.id === fontFamily)?.style || 'Roboto' }}>
                        ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    </p>
                    <p className="text-clipto-textSecondary text-sm" style={{ fontFamily: fontOptions.find(f => f.id === fontFamily)?.style || 'Roboto' }}>
                        Zabcdefghijklmnopqrstuvwxyz
                    </p>
                    <p className="text-clipto-textMuted text-xs" style={{ fontFamily: fontOptions.find(f => f.id === fontFamily)?.style || 'Roboto' }}>
                        ?"!'(%)[]{'{}'}@&lt;-++×=›@©$€£¥
                    </p>
                </div>

                {/* Font Options */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                    {fontOptions.map((font) => (
                        <button
                            key={font.id}
                            onClick={() => setFontFamily(font.id)}
                            className={`px-4 py-3 rounded-lg border transition-all text-sm ${fontFamily === font.id
                                ? 'border-clipto-primary bg-clipto-primary/10 text-clipto-primary'
                                : 'border-clipto-divider text-clipto-textSecondary hover:border-clipto-textMuted hover:bg-clipto-surfaceLight/50'
                                }`}
                            style={{ fontFamily: font.style }}
                        >
                            {font.label}
                        </button>
                    ))}
                </div>

                {/* Font Size Slider */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-clipto-textSecondary">Text Size</label>
                        <span className="text-clipto-primary font-bold">{fontSize}</span>
                    </div>
                    <input
                        type="range"
                        min="12"
                        max="24"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full h-2 bg-clipto-surfaceLight rounded-lg appearance-none cursor-pointer accent-clipto-primary"
                    />
                </div>

                {/* Visible Lines Slider */}
                <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-clipto-textSecondary">Visible Text Lines</label>
                        <span className="text-clipto-primary font-bold">{visibleLines}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={visibleLines}
                        onChange={(e) => setVisibleLines(Number(e.target.value))}
                        className="w-full h-2 bg-clipto-surfaceLight rounded-lg appearance-none cursor-pointer accent-clipto-primary"
                    />
                </div>
            </section>
        </div>
    );
};
