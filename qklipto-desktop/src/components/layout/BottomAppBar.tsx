import React, { useState } from 'react';
import { Filter, MoreVertical, SortAsc, SortDesc, Download, CheckSquare } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useClipStore } from '../../stores/clipStore';
import { exportData } from '../../services/exportService';

export const BottomAppBar: React.FC = () => {
    const { currentView, activeFilter, setActiveFilter, sortOption, setSortOption, selectAllClips } = useUIStore();
    const { clips } = useClipStore(); // We need clips to select all

    const [menuOpen, setMenuOpen] = useState(false);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);

    // Only show on clips and favorites views
    if (currentView !== 'clips' && currentView !== 'favorites') {
        return null;
    }

    const handleSortDate = () => {
        setSortOption(sortOption === 'date-desc' ? 'date-asc' : 'date-desc');
        setMenuOpen(false);
    };

    const handleSortName = () => {
        setSortOption(sortOption === 'name-asc' ? 'name-desc' : 'name-asc');
        setMenuOpen(false);
    };

    const handleExport = async () => {
        setMenuOpen(false);
        await exportData();
    };

    const handleSelectAll = () => {
        setMenuOpen(false);
        const allIds = clips.filter(c => !c.deleted).map(c => c.id);
        selectAllClips(allIds);
    };

    return (
        <div className="bg-clipto-surface border-t border-clipto-divider px-4 py-2 flex items-center justify-between relative z-20">
            {/* Left: Filter Icon */}
            <div className="relative">
                <button
                    onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                    className={`p-3 rounded-full transition-colors ${
                        activeFilter !== 'all'
                            ? 'bg-clipto-primary/20 text-clipto-primary'
                            : 'hover:bg-white/10 text-white'
                    }`}
                    aria-label="Filter"
                >
                    <Filter size={24} />
                </button>

                {/* Filter Menu Dropdown */}
                {filterMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setFilterMenuOpen(false)}
                        />
                        <div className="absolute bottom-full left-0 mb-2 bg-clipto-surfaceLight rounded-lg shadow-clipto-lg py-2 min-w-[160px] z-20">
                            <FilterMenuItem
                                label="All"
                                active={activeFilter === 'all'}
                                onClick={() => { setActiveFilter('all'); setFilterMenuOpen(false); }}
                            />
                            <FilterMenuItem
                                label="Links Only"
                                active={activeFilter === 'link'}
                                onClick={() => { setActiveFilter('link'); setFilterMenuOpen(false); }}
                            />
                            <FilterMenuItem
                                label="Favorites"
                                active={activeFilter === 'favorite'}
                                onClick={() => { setActiveFilter('favorite'); setFilterMenuOpen(false); }}
                            />
                            <FilterMenuItem
                                label="Recent"
                                active={activeFilter === 'recent'}
                                onClick={() => { setActiveFilter('recent'); setFilterMenuOpen(false); }}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Center: Space for FAB (FAB is absolutely positioned above) */}
            <div className="w-16" />

            {/* Right: Overflow Menu */}
            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-3 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="More options"
                >
                    <MoreVertical size={24} className="text-white" />
                </button>

                {/* Overflow Menu Dropdown */}
                {menuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className="absolute bottom-full right-0 mb-2 bg-clipto-surfaceLight rounded-lg shadow-clipto-lg py-2 min-w-[160px] z-20">
                            <MenuItem 
                                icon={<SortAsc size={18} />} 
                                label={sortOption.startsWith('date') ? `Sort by Date (${sortOption === 'date-desc' ? 'Newest' : 'Oldest'})` : "Sort by Date"} 
                                onClick={handleSortDate} 
                            />
                            <MenuItem 
                                icon={<SortDesc size={18} />} 
                                label={sortOption.startsWith('name') ? `Sort by Name (${sortOption === 'name-asc' ? 'A-Z' : 'Z-A'})` : "Sort by Name"} 
                                onClick={handleSortName} 
                            />
                            <div className="h-px bg-clipto-divider my-1" />
                            <MenuItem icon={<CheckSquare size={18} />} label="Select All" onClick={handleSelectAll} />
                            <MenuItem icon={<Download size={18} />} label="Export JSON" onClick={handleExport} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const MenuItem = ({ icon, label, onClick }: { icon?: React.ReactNode; label: string; onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm flex items-center gap-3"
    >
        {icon && <span className="text-clipto-textSecondary">{icon}</span>}
        {label}
    </button>
);

const FilterMenuItem = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full px-4 py-2 text-left transition-colors text-sm ${
            active ? 'text-clipto-primary bg-clipto-primary/10' : 'text-white hover:bg-white/10'
        }`}
    >
        {label}
    </button>
);
