import React from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { Smartphone, Cloud, Save, AlertCircle, LogOut, User, Upload, Download } from 'lucide-react';
import { signOut } from '../services/authService';
import { importData } from '../services/importService';
import { exportData } from '../services/exportService';
import { syncEngine } from '../services/syncEngine';
import { ChameleonSkinSettings } from '../components/settings/ChameleonSkinSettings';

export const SettingsPage = () => {
    const {
        syncMode, setSyncMode,
        localServerUrl, setLocalServerUrl
    } = useSettingsStore();

    const { user, isAuthenticated } = useAuthStore();
    const { setAuthDialogOpen } = useUIStore();

    const [urlInput, setUrlInput] = React.useState(localServerUrl);

    const handleSignOut = () => {
        signOut();
    };

    const handleSaveUrl = () => {
        setLocalServerUrl(urlInput);
        // Trigger a sync or health check here?
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-clipto-text mb-8">Settings</h1>

            {/* Sync Mode Section */}
            <section className="mb-10 bg-clipto-surface rounded-xl p-6 border border-clipto-surfaceLight">
                <h2 className="text-xl font-semibold text-clipto-primary mb-4 flex items-center gap-2">
                    Connectivity Mode
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setSyncMode('local')}
                        className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-all ${syncMode === 'local'
                            ? 'bg-clipto-primary/10 border-clipto-primary text-clipto-primary'
                            : 'bg-clipto-surfaceLight/10 border-clipto-divider text-clipto-textSecondary hover:bg-clipto-surfaceLight/30'
                            }`}
                    >
                        <Smartphone size={32} />
                        <span className="font-medium">Local Sync</span>
                    </button>

                    <button
                        onClick={() => setSyncMode('cloud')}
                        className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-all ${syncMode === 'cloud'
                            ? 'bg-blue-900/20 border-blue-500 text-blue-400'
                            : 'bg-clipto-surfaceLight/10 border-clipto-divider text-clipto-textSecondary hover:bg-clipto-surfaceLight/30'
                            }`}
                    >
                        <Cloud size={32} />
                        <span className="font-medium">Firebase Cloud</span>
                    </button>

                    <button
                        onClick={() => setSyncMode('off')}
                        className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-all ${syncMode === 'off'
                            ? 'bg-clipto-surfaceLight/10 border-clipto-text text-clipto-text'
                            : 'bg-clipto-surfaceLight/10 border-clipto-divider text-clipto-textSecondary hover:bg-clipto-surfaceLight/30'
                            }`}
                    >
                        <AlertCircle size={32} />
                        <span className="font-medium">Offline</span>
                    </button>
                </div>

                {/* Manual Sync Trigger */}
                {syncMode !== 'off' && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => {
                                syncEngine.sync();
                                alert("Sync started...");
                            }}
                            className="text-sm text-clipto-primary hover:text-clipto-primaryLight flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Sync Now
                        </button>
                    </div>
                )}
            </section>

            {/* Local Sync Config */}
            {syncMode === 'local' && (
                <section className="mb-10 bg-clipto-surface rounded-xl p-6 border border-clipto-surfaceLight animate-in fade-in">
                    <h2 className="text-xl font-semibold text-clipto-text mb-4">Local Server Configuration</h2>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-clipto-textSecondary mb-2">Sync Server URL</label>
                            <input
                                type="text"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="w-full bg-clipto-surfaceLight border border-clipto-divider rounded-lg p-3 text-clipto-text focus:outline-none focus:border-clipto-primary transition-colors"
                                placeholder="http://localhost:3000"
                            />
                        </div>
                        <button
                            onClick={handleSaveUrl}
                            className="mt-7 px-6 bg-clipto-primary hover:bg-clipto-primaryDark text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Save size={18} /> Save
                        </button>
                    </div>
                    <p className="mt-3 text-sm text-clipto-textSecondary">
                        Ensure your Android Sync Server is running (`node server.js`) and accessible at this URL.
                    </p>
                </section>
            )}

            {/* Cloud Config */}
            {syncMode === 'cloud' && (
                <section className="mb-10 bg-clipto-surface rounded-xl p-6 border border-clipto-surfaceLight animate-in fade-in">
                    <h2 className="text-xl font-semibold text-clipto-text mb-4">Cloud Account</h2>

                    {isAuthenticated && user ? (
                        <div className="flex items-center justify-between bg-clipto-surfaceLight p-4 rounded-lg border border-clipto-divider">
                            <div className="flex items-center gap-3">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                        <User size={20} />
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium text-clipto-text">{user.displayName || "User"}</div>
                                    <div className="text-sm text-clipto-textSecondary">{user.email}</div>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 bg-clipto-surface text-clipto-text border border-clipto-divider hover:bg-clipto-surfaceLight rounded-lg transition-colors flex items-center gap-2 text-sm"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-clipto-surfaceLight/30 rounded-lg border border-clipto-divider border-dashed">
                            <p className="text-clipto-textSecondary mb-4">Sign in to sync your clips across devices</p>
                            <button
                                onClick={() => setAuthDialogOpen(true)}
                                className="px-6 py-2.5 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                            >
                                <User size={20} />
                                Sign in / Create Account
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Data Management */}
            <section className="mb-10 bg-clipto-surface rounded-xl p-6 border border-clipto-surfaceLight">
                <h2 className="text-xl font-semibold text-clipto-text mb-4">Data Management</h2>
                <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-clipto-textSecondary mb-1">Export Format</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => exportData('json')}
                                className="px-3 py-2 bg-clipto-surfaceLight hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                            >
                                <Download size={16} /> JSON
                            </button>
                            <button
                                onClick={() => exportData('txt')}
                                className="px-3 py-2 bg-clipto-surfaceLight hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                            >
                                <Download size={16} /> Text
                            </button>
                            <button
                                onClick={() => exportData('md')}
                                className="px-3 py-2 bg-clipto-surfaceLight hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                            >
                                <Download size={16} /> Markdown
                            </button>
                            <button
                                onClick={() => exportData('html')}
                                className="px-3 py-2 bg-clipto-surfaceLight hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                            >
                                <Download size={16} /> HTML
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".json"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (confirm(`Import clips from ${file.name}?`)) {
                                        const result = await importData(file);
                                        if (result.success) {
                                            alert(`Successfully imported ${result.count} clips.`);
                                        } else {
                                            alert(`Import failed: ${result.error}`);
                                        }
                                    }
                                    // Reset input
                                    e.target.value = '';
                                }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button className="px-4 py-2 bg-clipto-primary hover:bg-clipto-primaryDark text-white rounded-lg flex items-center gap-2 transition-colors">
                            <Upload size={18} />
                            Import JSON
                        </button>
                    </div>
                </div>
                <p className="mt-3 text-sm text-clipto-textSecondary">
                    Import clips from a .json backup file (QKlipto format).
                </p>
            </section>

            {/* Chameleon Skin - Appearance & Theme Config */}
            <ChameleonSkinSettings />
        </div>
    );
};
