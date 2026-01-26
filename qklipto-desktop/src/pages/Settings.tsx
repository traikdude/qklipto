import React from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { Smartphone, Cloud, Save, AlertCircle, LogOut, User } from 'lucide-react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';

export const SettingsPage = () => {
    const {
        syncMode, setSyncMode,
        localServerUrl, setLocalServerUrl,
        theme, setTheme
    } = useSettingsStore();

    const [urlInput, setUrlInput] = React.useState(localServerUrl);
    const [user, setUser] = React.useState<FirebaseUser | null>(null);

    React.useEffect(() => {
        if (!auth) return;
        return auth.onAuthStateChanged((u) => setUser(u));
    }, []);

    const handleGoogleSignIn = async () => {
        if (!auth) {
            alert("Firebase not initialized. Check console.");
            return;
        }
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (e) {
            console.error("Sign in failed", e);
            alert("Sign in failed. See console.");
        }
    };

    const handleSignOut = () => {
        auth?.signOut();
    };

    const handleSaveUrl = () => {
        setLocalServerUrl(urlInput);
        // Trigger a sync or health check here?
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

            {/* Sync Mode Section */}
            <section className="mb-10 bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                    Connectivity Mode
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setSyncMode('local')}
                        className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-all ${syncMode === 'local'
                            ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'
                            }`}
                    >
                        <Smartphone size={32} />
                        <span className="font-medium">Local Sync</span>
                    </button>

                    <button
                        onClick={() => setSyncMode('cloud')}
                        className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-all ${syncMode === 'cloud'
                            ? 'bg-blue-900/20 border-blue-500 text-blue-400'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'
                            }`}
                    >
                        <Cloud size={32} />
                        <span className="font-medium">Firebase Cloud</span>
                    </button>

                    <button
                        onClick={() => setSyncMode('off')}
                        className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-all ${syncMode === 'off'
                            ? 'bg-gray-800 border-gray-500 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'
                            }`}
                    >
                        <AlertCircle size={32} />
                        <span className="font-medium">Offline</span>
                    </button>
                </div>
            </section>

            {/* Local Sync Config */}
            {syncMode === 'local' && (
                <section className="mb-10 bg-gray-900 rounded-xl p-6 border border-gray-800 animate-fadeIn">
                    <h2 className="text-xl font-semibold text-white mb-4">Local Server Configuration</h2>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-2">Sync Server URL</label>
                            <input
                                type="text"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                placeholder="http://localhost:3000"
                            />
                        </div>
                        <button
                            onClick={handleSaveUrl}
                            className="mt-7 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Save size={18} /> Save
                        </button>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                        Ensure your Android Sync Server is running (`node server.js`) and accessible at this URL.
                    </p>
                </section>
            )}

            {/* Cloud Config */}
            {syncMode === 'cloud' && (
                <section className="mb-10 bg-gray-900 rounded-xl p-6 border border-gray-800 animate-fadeIn">
                    <h2 className="text-xl font-semibold text-white mb-4">Cloud Account</h2>

                    {!auth ? (
                        <div className="p-4 bg-red-900/20 text-red-300 rounded-lg text-sm border border-red-800">
                            Firebase Configuration Invalid. Check src/lib/firebase.ts
                        </div>
                    ) : user ? (
                        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center gap-3">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                        <User size={20} />
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium text-white">{user.displayName || "User"}</div>
                                    <div className="text-sm text-gray-400">{user.email}</div>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-gray-800/50 rounded-lg border border-gray-800 border-dashed">
                            <p className="text-gray-400 mb-4">Sign in to sync your clips across devices</p>
                            <button
                                onClick={handleGoogleSignIn}
                                className="px-6 py-2.5 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Theme Config */}
            <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400">Theme Mode:</span>
                    <div className="flex bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setTheme('light')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'light' ? 'bg-white text-gray-900 shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            Light
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'dark' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            Dark
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
