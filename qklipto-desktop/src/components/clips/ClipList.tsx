import React, { useMemo } from 'react';
import { useClipStore } from '../../stores/clipStore';
import { ClipCard } from './ClipCard';
import { useUIStore } from '../../stores/uiStore';
import { Copy } from 'lucide-react';
import { Clip } from '../../models/Clip';

export const ClipList = () => {
    const { clips, loading } = useClipStore();
    const { searchQuery, activeFilter, selectedTags, openEditor, selectionMode, selectedClipIds, toggleClipSelection } = useUIStore();

    // Filter Logic with memoization
    const filteredClips = useMemo(() => {
        return clips.filter(clip => {
            // Exclude deleted clips
            if (clip.deleted) return false;

            // Search filter
            const matchesSearch = searchQuery
                ? clip.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  clip.title?.toLowerCase().includes(searchQuery.toLowerCase())
                : true;

            // Type filter
            let matchesFilter = true;
            if (activeFilter === 'link') {
                matchesFilter = /^(http|https):\/\/[^ "]+$/.test(clip.text) ||
                                clip.text.includes('http://') ||
                                clip.text.includes('https://');
            } else if (activeFilter === 'favorite') {
                matchesFilter = clip.fav === true;
            }

            // Tag filter
            const matchesTags = selectedTags.length === 0 ||
                selectedTags.some(tag => clip.tags?.includes(tag));

            return matchesSearch && matchesFilter && matchesTags;
        });
    }, [clips, searchQuery, activeFilter, selectedTags]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-clipto-textSecondary">Loading clips...</div>
            </div>
        );
    }

    if (filteredClips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-clipto-textSecondary opacity-60">
                <Copy size={48} className="mb-4" />
                <p className="text-xl">
                    {searchQuery ? 'No matching clips' : 'No clips yet'}
                </p>
                <p className="text-sm">
                    {searchQuery
                        ? 'Try a different search term'
                        : 'Tap the + button to create one'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max pb-24">
            {filteredClips.map((clip: Clip) => (
                <ClipCard
                    key={clip.id}
                    clip={clip}
                    onEdit={() => openEditor(clip.id)}
                    isSelected={selectedClipIds.includes(clip.id)}
                    selectionMode={selectionMode}
                    onToggleSelection={toggleClipSelection}
                />
            ))}
        </div>
    );
};
