import React from 'react';
import { NavigationDrawer } from './NavigationDrawer';
import { TopAppBar } from './TopAppBar';
import { BottomAppBar } from './BottomAppBar';
import { FloatingActionButton } from './FloatingActionButton';
import { ClipEditorModal } from '../clips/ClipEditorModal';
import { useUIStore } from '../../stores/uiStore';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { editorOpen, openEditor, closeEditor, editingClipId } = useUIStore();

    return (
        <div className="flex h-screen w-full bg-clipto-background text-clipto-text overflow-hidden font-sans relative">

            <NavigationDrawer />

            <div className="flex-1 flex flex-col h-full min-w-0 bg-clipto-background relative">
                <TopAppBar />

                <main className="flex-1 overflow-y-auto relative p-4 pb-24 scroll-smooth scrollbar-clipto">
                    {children}
                </main>

                <BottomAppBar />
                <FloatingActionButton onClick={() => openEditor()} />
            </div>

            {editorOpen && (
                <ClipEditorModal
                    isOpen={editorOpen}
                    onClose={closeEditor}
                    editId={editingClipId || undefined}
                />
            )}
        </div>
    );
};
