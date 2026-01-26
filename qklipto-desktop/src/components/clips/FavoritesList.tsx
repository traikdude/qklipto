import React from 'react';
import { useClipStore } from '../../stores/clipStore';
import { ClipCard } from './ClipCard';
import { useUIStore } from '../../stores/uiStore';
import { Star } from 'lucide-react';
import { Clip } from '../../models/Clip';

export const FavoritesList = () => {
    const { clips, loading } = useClipStore();
    const { searchQuery, openEditor } = useUIStore();

    const filteredClips = clips.filter(clip => {
        if (!clip.fav || clip.deleted) return false;

        return searchQuery
            ? clip.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clip.title?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
    });

    if (loading) return <div className="p-8 text-center text-clipto-textSecondary">Loading favorites...</div>;

    if (filteredClips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-clipto-textSecondary opacity-60">
                <Star size={48} className="mb-4 text-clipto-primary" />
                <p className="text-xl">No favorites yet</p>
                <p className="text-sm">Star clipts to see them here</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
            {filteredClips.map((clip: Clip) => (
                <ClipCard
                    key={clip.id}
                    clip={clip}
                    onEdit={() => openEditor(clip.id)}
                />
            ))}
        </div>
    );
};
