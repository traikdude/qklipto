
import React, { useState } from 'react';
import { Clip } from '../../models/Clip';
import { useUIStore } from '../../stores/uiStore';
import { Trash2, Copy, Check, GripVertical } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

interface ClipCardProps {
    clip: Clip;
    onSelect?: (clip: Clip) => void;
    toggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({ clip, onSelect, toggleFavorite }) => {
    const [isDragging, setIsDragging] = useState(false);

    // Determine icon based on content (simple heuristic since type is always "0" for now)
    const getIcon = () => {
        // Default Text Icon
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    };

    // Color logic (Default to Indigo for text)
    const typeColorClass = 'bg-indigo-900/20 text-indigo-400';

    const handleDragStart = (e: React.DragEvent) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'clip',
            clipId: clip.id,
            currentFolderId: clip.folderId
        }));

        // Create a custom drag image
        const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
        dragImage.style.opacity = '0.5';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => !isDragging && onSelect?.(clip)}
            className={`
                group clip-card h-full flex flex-col cursor-pointer transition-all
                ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
            `}
        >
            {/* Drag Handle */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} className="text-clipto-textSecondary" />
            </div>

            {/* Header: Icon + Favorite */}
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded ${typeColorClass}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon()} />
                    </svg>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite?.(clip.id, e);
                    }}
                    className={`p-1 transition-colors ${clip.fav ? 'text-rose-500' : 'text-slate-600 hover:text-rose-400'
                        }`}
                >
                    <svg className="w-5 h-5" fill={clip.fav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-slate-200 mb-2 line-clamp-1">
                {clip.title || 'Untitled Note'}
            </h3>

            {/* Content Preview */}
            <div className="flex-1">
                <p className="text-sm text-slate-500 line-clamp-3 mb-3 font-mono">
                    {clip.text}
                </p>
            </div>

            {/* Footer: Date + Tags */}
            <div className="mt-auto pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                <span>{new Date(clip.createDate).toLocaleDateString()}</span>
                <div className="flex gap-1">
                    {clip.tags?.slice(0, 1).map(tag => (
                        <span key={tag} className="text-slate-500">#{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
