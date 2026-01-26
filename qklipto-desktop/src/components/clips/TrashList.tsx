import React from 'react';
import { useClipStore } from '../../stores/clipStore';
import { TrashClipCard } from './TrashClipCard';
import { useUIStore } from '../../stores/uiStore';
import { Trash2 } from 'lucide-react';
import { Clip } from '../../models/Clip';

export const TrashList = () => {
    const { clips, loading } = useClipStore();
    const { searchQuery } = useUIStore();

    const filteredClips = clips.filter(clip => {
        if (!clip.deleted) return false;

        return searchQuery
            ? clip.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clip.title?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
    });

    if (loading) return <div className="p-8 text-center text-clipto-textSecondary">Loading trash...</div>;

    if (filteredClips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-clipto-textSecondary opacity-60">
                <Trash2 size={48} className="mb-4" />
                <p className="text-xl">Trash is empty</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
            {filteredClips.map((clip: Clip) => (
                <TrashClipCard key={clip.id} clip={clip} />
            ))}
        </div>
    );
};
