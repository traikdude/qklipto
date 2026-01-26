import React from 'react';
import { useUIStore, View } from '../../stores/uiStore';
import { useClipStore } from '../../stores/clipStore';
import {
    StickyNote, Star, Tag, Trash2, Settings,
    Infinity as InfinityIcon, Clipboard, FileText
} from 'lucide-react';
import { clsx } from 'clsx';

export const NavigationDrawer: React.FC = () => {
    const { drawerOpen, setDrawerOpen, currentView, setView } = useUIStore();
    const { clips } = useClipStore();

    // Calculate counts
    const totalCount = clips.length;
    const starredCount = clips.filter(c => c.fav && !c.deleted).length;

    // Close drawer when clicking outside or selecting an item
    const handleSelect = (view: View) => {
        setView(view);
        setDrawerOpen(false);
    };

    const NavItem = ({
        icon: Icon,
        label,
        count,
        view,
        onClick
    }: {
        icon: any,
        label: string,
        count?: number,
        view?: View,
        onClick?: () => void
    }) => {
        const isActive = currentView === view;
        return (
            <button
                onClick={onClick || (() => view && handleSelect(view))}
                className={clsx(
                    "w-full flex items-center px-6 py-3 text-sm font-medium transition-colors",
                    isActive
                        ? "text-clipto-primary bg-clipto-primary/10 border-r-4 border-clipto-primary"
                        : "text-clipto-text hover:bg-white/5"
                )}
            >
                <Icon size={20} className={clsx("mr-4", isActive ? "text-clipto-primary" : "text-clipto-textSecondary")} />
                <span className="flex-1 text-left">{label}</span>
                {count !== undefined && (
                    <span className="text-xs text-clipto-textSecondary">{count}</span>
                )}
            </button>
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 z-30 transition-opacity duration-300",
                    drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer Panel */}
            <div
                className={clsx(
                    "fixed top-0 left-0 h-full w-80 bg-clipto-surface z-40 transform transition-transform duration-300 shadow-2xl flex flex-col",
                    drawerOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="h-32 flex flex-col justify-end p-6 bg-clipto-surfaceLight/10">
                    <div className="flex items-center text-clipto-primary mb-1">
                        <div className="bg-clipto-primary/20 p-2 rounded-full mr-3">
                            <InfinityIcon size={24} />
                        </div>
                        <span className="text-xl font-bold text-white">QKlipto</span>
                    </div>
                    <div className="text-xs text-clipto-textSecondary pl-12">Universal Clipboard</div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">

                    {/* Notes Section */}
                    {/* All */}
                    <NavItem
                        icon={InfinityIcon}
                        label="All"
                        count={totalCount}
                        view="clips"
                    />

                    {/* Starred */}
                    <NavItem
                        icon={Star}
                        label="Starred"
                        count={starredCount}
                        view="favorites"
                    />

                    {/* Untagged (future) */}
                    <NavItem
                        icon={StickyNote}
                        label="Untagged"
                        count={0}
                        onClick={() => { }}
                    />

                    {/* Clipboard Manager Section */}
                    <div className="my-2 border-t border-clipto-divider/10 mx-4" />

                    <NavItem
                        icon={Clipboard}
                        label="Clipboard"
                        count={totalCount} // Placeholder
                        onClick={() => { }}
                    />

                    <NavItem
                        icon={FileText}
                        label="Snippets"
                        count={0}
                        onClick={() => { }}
                    />

                    <div className="my-2 border-t border-clipto-divider/10 mx-4" />

                    {/* Trash */}
                    <NavItem
                        icon={Trash2}
                        label="Recycle Bin"
                        view="trash"
                    />

                    <NavItem
                        icon={Settings}
                        label="Settings"
                        view="settings"
                    />

                </div>
            </div>
        </>
    );
};
