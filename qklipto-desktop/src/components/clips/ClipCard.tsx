import React from 'react';
import { Star, Copy, Trash2, Link as LinkIcon, Check } from 'lucide-react';
import { Clip } from '../../models/Clip';
import { format } from 'date-fns';
import { useClipStore } from '../../stores/clipStore';
import { useUIStore } from '../../stores/uiStore';
import { clsx } from 'clsx';

interface ClipCardProps {
    clip: Clip;
    onEdit: (clip: Clip) => void;
    isSelected: boolean;
    selectionMode: boolean;
    onToggleSelection: (id: string) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({ clip, onEdit, isSelected, selectionMode, onToggleSelection }) => {
    const { updateClip, deleteClip } = useClipStore();
    const { setSelectionMode } = useUIStore();

    const handleClick = (e: React.MouseEvent) => {
        if (selectionMode) {
            e.stopPropagation();
            onToggleSelection(clip.id);
        } else {
            onEdit(clip);
        }
    };

    const handleLongPress = (e: React.MouseEvent) => {
        // Simple long press simulation for desktop? 
        // Or just let user rely on 'Select All' or a dedicated select button.
        // For now, let's allow right click to start selection
        e.preventDefault();
        setSelectionMode(true);
        onToggleSelection(clip.id);
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(clip.text);
    };

    const toggleStar = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateClip(clip.id, { fav: !clip.fav });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteClip(clip.id);
    };

    const isUrl = (text: string) => {
        return /^(http|https):\/\/[^ "]+$/.test(text);
    };

    return (
        <div
            onClick={handleClick}
            onContextMenu={handleLongPress}
            className={clsx(
                "group bg-clipto-surface transition-all rounded-lg flex flex-col shadow-sm border cursor-pointer overflow-hidden relative select-none",
                isSelected ? "border-clipto-primary ring-2 ring-clipto-primary bg-clipto-primary/5" : "border-clipto-divider/10 hover:bg-clipto-surfaceLight"
            )}
        >
            {/* Selection Checkbox Overlay */}
            {selectionMode && (
                <div className="absolute top-2 right-2 z-10">
                    <div className={clsx(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        isSelected ? "bg-clipto-primary border-clipto-primary" : "border-clipto-textSecondary bg-black/20"
                    )}>
                        {isSelected && <Check size={14} className="text-white" />}
                    </div>
                </div>
            )}

            <div className="p-4">
                {/* Header: Title or Link Hint */}
                <div className="flex justify-between items-start mb-2 pr-6">
                    {clip.title ? (
                        <h3 className="font-bold text-lg text-clipto-text line-clamp-1">{clip.title}</h3>
                    ) : isUrl(clip.text) ? (
                        <div className="flex items-center text-clipto-primary text-sm font-medium">
                            <LinkIcon size={14} className="mr-1" />
                            <span>Link</span>
                        </div>
                    ) : null}

                    {/* Timestamp */}
                    <span className="text-xs text-clipto-textSecondary whitespace-nowrap ml-2">
                        {format(new Date(clip.modifyDate), 'MMM d, yyyy h:mm a')}
                    </span>
                </div>

                {/* Content */}
                <p className="text-clipto-textSecondary text-sm line-clamp-4 whitespace-pre-wrap font-mono">
                    {clip.text}
                </p>

                {/* Footer / Actions */}
                <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                        {clip.tags?.map(tag => (
                            <span key={tag} className="bg-clipto-primary/20 text-clipto-primary text-xs px-2 py-0.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center space-x-1">
                        <button onClick={handleCopy} className="p-2 text-clipto-textSecondary hover:text-white rounded-full hover:bg-white/10" title="Copy">
                            <Copy size={16} />
                        </button>
                        <button onClick={toggleStar} className={clsx("p-2 rounded-full hover:bg-white/10", clip.fav ? "text-clipto-primary" : "text-clipto-textSecondary hover:text-white")} title="Star">
                            <Star size={16} fill={clip.fav ? "currentColor" : "none"} />
                        </button>
                        <button onClick={handleDelete} className="p-2 text-clipto-textSecondary hover:text-red-400 rounded-full hover:bg-white/10" title="Delete">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
