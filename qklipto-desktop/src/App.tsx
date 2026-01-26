import React, { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ClipList } from './components/clips/ClipList';
import { useUIStore } from './stores/uiStore';
import { SettingsPage } from './pages/Settings';
import { TagList } from './components/tags/TagList';
import { FavoritesList } from './components/clips/FavoritesList';
import { TrashList } from './components/clips/TrashList';
import { syncEngine } from './services/syncEngine';
import { useSettingsStore } from './stores/settingsStore';

function App() {
    const { currentView } = useUIStore();
    const { syncMode } = useSettingsStore();

    // Sync Loop
    useEffect(() => {
        // Initial sync
        syncEngine.sync();

        // Periodic sync (every 30s)
        const interval = setInterval(() => {
            syncEngine.sync();
        }, 30000);

        return () => clearInterval(interval);
    }, [syncMode]); // Re-run if sync mode changes

    return (
        <AppLayout>
            <div className="h-full w-full max-w-7xl mx-auto">
                {currentView === 'clips' && <ClipList />}

                {currentView === 'favorites' && <FavoritesList />}

                {currentView === 'tags' && <TagList />}

                {currentView === 'trash' && <TrashList />}

                {currentView === 'settings' && <SettingsPage />}
            </div>
        </AppLayout>
    );
}

export default App;
