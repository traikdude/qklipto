
import React from 'react';
import { Clip, ClipType } from '../types';

interface ClipCardProps {
  clip: Clip;
  onClick: (clip: Clip) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const ClipCard: React.FC<ClipCardProps> = ({ clip, onClick, onToggleFavorite }) => {
  const getIcon = () => {
    switch (clip.type) {
      case ClipType.CODE:
        return 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4';
      case ClipType.IMAGE:
        return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
      default:
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    }
  };

  return (
    <div 
      onClick={() => onClick(clip)}
      className="group bg-sidebar rounded-lg border border-subtle p-4 hover:border-slate-600 transition-all cursor-pointer flex flex-col h-full relative"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded ${
          clip.type === ClipType.CODE ? 'bg-amber-900/20 text-amber-500' :
          clip.type === ClipType.IMAGE ? 'bg-emerald-900/20 text-emerald-500' :
          'bg-indigo-900/20 text-indigo-400'
        }`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon()} />
          </svg>
        </div>
        <button 
          onClick={(e) => onToggleFavorite(clip.id, e)}
          className={`p-1 transition-colors ${
            clip.isFavorite ? 'text-rose-500' : 'text-slate-600 hover:text-rose-400'
          }`}
        >
          <svg className="w-5 h-5" fill={clip.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <h3 className="font-semibold text-slate-200 mb-2 line-clamp-1">{clip.title}</h3>
      
      <div className="flex-1">
        {clip.type === ClipType.IMAGE && clip.metadata?.imageSrc ? (
          <div className="w-full h-32 rounded bg-black/20 mb-2 overflow-hidden">
            <img src={clip.metadata.imageSrc} alt={clip.title} className="w-full h-full object-cover opacity-80" />
          </div>
        ) : (
          <p className={`text-sm text-slate-500 line-clamp-3 mb-3 ${clip.type === ClipType.CODE ? 'font-mono bg-black/20 p-2 rounded' : ''}`}>
            {clip.content}
          </p>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-subtle flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-wider">
        <span>{new Date(clip.timestamp).toLocaleDateString()}</span>
        <div className="flex gap-1">
          {clip.tags.slice(0, 1).map(tag => (
            <span key={tag} className="text-slate-500">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClipCard;
