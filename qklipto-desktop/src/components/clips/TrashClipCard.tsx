import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { Clip } from '../../models/Clip';
import { format } from 'date-fns';
import { useClipStore } from '../../stores/clipStore';

export const TrashClipCard = ({ clip }: { clip: Clip }) => {
    const { restoreClip, hardDeleteClip } = useClipStore();

    return (
        <div className="bg-clipto-surface/50 border border-clipto-divider/20 rounded-lg p-4 relative group">
            <p className="text-clipto-textSecondary text-sm line-clamp-4 font-mono opacity-70">
                {clip.text}
            </p>
            <div className="mt-4 flex justify-between items-center text-xs text-clipto-textMuted">
                <span>Deleted {format(new Date(clip.modifyDate), 'MMM d')}</span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => restoreClip(clip.id)}
                        className="p-1.5 hover:bg-clipto-primary/20 text-clipto-primary rounded"
                        title="Restore"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={() => hardDeleteClip(clip.id)}
                        className="p-1.5 hover:bg-red-900/50 text-red-400 rounded"
                        title="Delete Forever"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
