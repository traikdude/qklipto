import React from 'react';
import { Layout, Tag, Settings, Cloud, Smartphone, Trash2 } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useUIStore } from '../../stores/uiStore';
import { syncEngine } from '../../services/syncEngine';
import { RefreshCw } from 'lucide-react';

export const Sidebar = () => {
    const { syncMode } = useSettingsStore();
    const { currentView, setView } = useUIStore();
    const [isSyncing, setIsSyncing] = React.useState(false);

    const handleManualSync = async () => {
        setIsSyncing(true);
        await syncEngine.sync();
        setTimeout(() => setIsSyncing(false), 1000); // Min spin time
    };

    return (
        <div className="w-16 md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen text-gray-300">
            <div className="p-4 flex items-center justify-center md:justify-start gap-3 border-b border-gray-800">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                    Q
                </div>
                <span className="text-xl font-bold text-white hidden md:block">QKlipto</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-2 space-y-1">
                    <NavItem
                        icon={<Layout size={20} />}
                        label="All Clips"
                        active={currentView === 'clips'}
                        onClick={() => setView('clips')}
                    />
                    <NavItem
                        icon={<Tag size={20} />}
                        label="Tags"
                        active={currentView === 'tags'}
                        onClick={() => setView('tags')}
                    />
                    <div className="pt-4 pb-2">
                        <div className="h-px bg-gray-800 mx-2"></div>
                    </div>
                    <NavItem
                        icon={<Trash2 size={20} />}
                        label="Trash"
                        active={currentView === 'trash'}
                        onClick={() => setView('trash')}
                    />
                </div>
            </nav>

            <div className="p-2 border-t border-gray-800">
                <button
                    onClick={handleManualSync}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${syncMode === 'local' ? 'text-green-400 bg-green-900/20 hover:bg-green-900/30' :
                            syncMode === 'cloud' ? 'text-blue-400 bg-blue-900/20 hover:bg-blue-900/30' :
                                'text-gray-500 bg-gray-800'
                        }`}
                    title="Click to sync now"
                >
                    {isSyncing ? (
                        <RefreshCw size={16} className="animate-spin" />
                    ) : (
                        <>
                            {syncMode === 'local' && <Smartphone size={16} />}
                            {syncMode === 'cloud' && <Cloud size={16} />}
                        </>
                    )}

                    <span className="hidden md:block font-medium">
                        {isSyncing ? 'Syncing...' : (
                            syncMode === 'local' ? 'Local Sync' : syncMode === 'cloud' ? 'Cloud Sync' : 'Sync Off'
                        )}
                    </span>
                </button>

                <button
                    onClick={() => setView('settings')}
                    className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 mt-2 rounded-lg transition-colors ${currentView === 'settings' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-gray-800'
                        }`}
                >
                    <Settings size={20} />
                    <span className="hidden md:block">Settings</span>
                </button>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-lg transition-colors ${active ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-gray-800'
            }`}>
        {icon}
        <span className="hidden md:block font-medium">{label}</span>
    </button>
);
