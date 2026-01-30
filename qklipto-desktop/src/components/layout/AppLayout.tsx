import React, { useState } from 'react';
import { NavigationDrawer } from './NavigationDrawer';
import { useUIStore } from '../../stores/uiStore';
import { Search, Menu, Plus } from 'lucide-react';
import { FolderTree } from '../folders/FolderTree';
import { FolderDialog } from '../folders/FolderDialog';
import { AuthDialog } from '../auth/AuthDialog';
import { ClipEditorModal } from '../clips/ClipEditorModal';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const {
        searchQuery, setSearchQuery, isSearchFocused, setSearchFocused,
        toggleDrawer, currentView, authDialogOpen, setAuthDialogOpen,
        editorOpen, openEditor, closeEditor, editingClipId
    } = useUIStore();

    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [editingFolderId, setEditingFolderId] = useState<string | undefined>(undefined);

    const showFolderSidebar = currentView === 'clips';

    const handleCreateFolder = () => {
        setEditingFolderId(undefined);
        setIsFolderDialogOpen(true);
    };

    const handleRenameFolder = (folderId: string) => {
        setEditingFolderId(folderId);
        setIsFolderDialogOpen(true);
    };

    return (
        <div className="flex h-screen bg-clipto-background text-clipto-text overflow-hidden relative">
            <NavigationDrawer />

            {/* Folder Sidebar - Only show on clips view, desktop only */}
            {showFolderSidebar && (
                <aside className="w-64 border-l border-clipto-divider bg-clipto-surface flex-shrink-0 hidden lg:block border-r border-r-clipto-divider">
                    <FolderTree onCreateFolder={handleCreateFolder} onRenameFolder={handleRenameFolder} />
                </aside>
            )}

            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                {/* Header */}
                <header className="h-16 border-b border-clipto-divider bg-clipto-surface flex items-center px-4 justify-between shrink-0 z-20">
                    <div className="flex items-center gap-3 flex-1">
                        <button onClick={toggleDrawer} className="md:hidden p-2 hover:bg-black/10 rounded-lg text-clipto-text">
                            <Menu size={24} />
                        </button>

                        {/* Search Bar */}
                        <div className={`flex-1 max-w-xl mx-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 border transition-all ${isSearchFocused ? 'border-clipto-primary ring-1 ring-clipto-primary' : 'border-transparent'}`}>
                            <Search size={18} className={isSearchFocused ? 'text-clipto-primary' : 'text-clipto-textMuted'} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-clipto-textMuted text-clipto-text"
                            />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto relative">
                    {children}

                    {/* FAB - Create Clip */}
                    <button
                        onClick={() => openEditor()}
                        className="absolute bottom-8 right-8 w-14 h-14 bg-clipto-primary rounded-full shadow-fab flex items-center justify-center text-white hover:bg-clipto-primaryDark transition-all hover:scale-105 active:scale-95 z-30"
                        title="Create Clip"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </main>

            {/* Dialogs */}
            <AuthDialog
                isOpen={authDialogOpen}
                onClose={() => setAuthDialogOpen(false)}
            />

            <FolderDialog
                isOpen={isFolderDialogOpen}
                onClose={() => setIsFolderDialogOpen(false)}
            />

            <ClipEditorModal
                isOpen={editorOpen}
                onClose={closeEditor}
                editId={editingClipId || undefined}
            />
        </div>
    );
};
