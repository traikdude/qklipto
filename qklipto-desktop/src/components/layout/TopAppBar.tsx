import React from 'react';
import { Menu, Search, X, Trash2, XCircle } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useClipStore } from '../../stores/clipStore';

export const TopAppBar: React.FC = () => {
    const {
        toggleDrawer,
        searchQuery,
        setSearchQuery,
        isSearchFocused,
        setSearchFocused,
        currentView,
        selectionMode,
        selectedClipIds,
        clearSelection
    } = useUIStore();
    
    const { deleteClip } = useClipStore();

    // Bulk Actions
    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedClipIds.length} items?`)) {
            selectedClipIds.forEach(id => deleteClip(id));
            clearSelection();
        }
    };

    // Get the title based on current view
    const getTitle = () => {
        switch (currentView) {
            case 'clips': return 'All Clips';
            case 'favorites': return 'Favorites';
            case 'tags': return 'Tags';
            case 'trash': return 'Trash';
            case 'settings': return 'Settings';
            default: return 'QKlipto';
        }
    };

    const showSearch = !selectionMode && (currentView === 'clips' || currentView === 'favorites');

    if (selectionMode) {
        return (
            <div className="h-14 bg-clipto-surface flex items-center px-3 shadow-clipto z-20 relative border-b border-clipto-divider">
                <button
                    onClick={clearSelection}
                    className="p-2 rounded-full hover:bg-white/10 text-clipto-text mr-3 flex-shrink-0"
                    aria-label="Cancel selection"
                >
                    <XCircle size={24} />
                </button>
                
                <div className="flex-1">
                    <h1 className="text-lg font-medium text-white">{selectedClipIds.length} Selected</h1>
                </div>

                <button 
                    onClick={handleBulkDelete}
                    className="p-2 rounded-full hover:bg-white/10 text-clipto-text ml-2"
                    title="Delete Selected"
                >
                    <Trash2 size={24} />
                </button>
            </div>
        );
    }

    return (
        <div className="h-14 bg-clipto-surface flex items-center px-3 shadow-clipto z-20 relative border-b border-clipto-divider">
            {/* Hamburger Menu */}
            <button
                onClick={toggleDrawer}
                className="p-2 rounded-full hover:bg-white/10 text-clipto-text mr-3 flex-shrink-0"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            {/* Search Bar or Title */}
            {showSearch ? (
                <div className={`flex-1 flex items-center bg-clipto-background rounded-lg px-3 py-2 transition-all ${
                    isSearchFocused ? 'ring-2 ring-clipto-primary' : ''
                }`}>
                    <Search size={20} className="text-clipto-textMuted mr-2 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search your notes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="flex-1 bg-transparent text-clipto-text placeholder-clipto-textMuted text-base focus:outline-none min-w-0"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="p-1 hover:bg-white/10 rounded-full flex-shrink-0"
                        >
                            <X size={18} className="text-clipto-textMuted" />
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex-1">
                    <h1 className="text-lg font-medium text-white">{getTitle()}</h1>
                </div>
            )}
        </div>
    );
};
