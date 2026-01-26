import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ClipList } from './components/clips/ClipList';
import { ClipEditor } from './components/clips/ClipEditor';
import { Plus } from 'lucide-react';
import { useSettingsStore } from './stores/settingsStore';
import { useUIStore } from './stores/uiStore';
import { SettingsPage } from './pages/Settings';
import { TagList } from './components/tags/TagList';

function App() {
    const [showEditor, setShowEditor] = useState(false);
    const { syncMode } = useSettingsStore();
    const { currentView } = useUIStore();

    return (
        <AppLayout>
            <div className="flex flex-col h-full max-w-4xl mx-auto w-full">

                {currentView === 'clips' && (
                    <>
                        <header className="p-6 pb-2">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-white">My Clips</h1>

                                {!showEditor && (
                                    <button
                                        onClick={() => setShowEditor(true)}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-emerald-900/20"
                                    >
                                        <Plus size={20} /> New Clip
                                    </button>
                                )}
                            </div>

                            {/* Editor Area */}
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showEditor ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'}`}>
                                <ClipEditor onCancel={() => setShowEditor(false)} />
                            </div>
                        </header>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                            <ClipList />
                        </div>
                    </>
                )}

                {currentView === 'settings' && <SettingsPage />}

                {currentView === 'tags' && <TagList />}

                {currentView === 'trash' && (
                    <div className="flex items-center justify-center h-full text-gray-500">Trash Management Coming Soon</div>
                )}

            </div>
        </AppLayout>
    );
}

export default App;
