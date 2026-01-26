import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { Copy, Trash2, Smartphone, Cloud } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ClipList = () => {
    // Real-time subscription to Dexie
    const clips = useLiveQuery(
        () => db.clips.orderBy('createDate').reverse().toArray()
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Add toast notification later
    };

    const deleteClip = async (id: string) => {
        // Soft delete
        await db.clips.update(id, { deleted: true, modifyDate: new Date().toISOString(), pendingSync: true });
    }

    if (!clips) return <div className="p-8 text-center text-gray-500">Loading clips...</div>;

    if (clips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 opacity-60">
                <Copy size={48} className="mb-4" />
                <p className="text-xl">No clips yet</p>
                <p className="text-sm">Create one above to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            {clips.filter(c => !c.deleted).map((clip) => (
                <div
                    key={clip.id}
                    className="group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-lg p-5 transition-all shadow-sm hover:shadow-md"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                            {formatDistanceToNow(new Date(clip.createDate), { addSuffix: true })}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => copyToClipboard(clip.text)}
                                className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                            <button
                                onClick={() => deleteClip(clip.id)}
                                className="p-1.5 hover:bg-red-900/50 rounded text-gray-400 hover:text-red-400"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <pre className="font-sans text-gray-300 whitespace-pre-wrap break-words leading-relaxed max-h-60 overflow-hidden text-base">
                        {clip.text}
                    </pre>

                    <div className="mt-4 pt-3 border-t border-gray-800/50 flex justify-between items-center text-xs text-gray-600">
                        <div className="flex gap-2">
                            {/* Sync Status Indicators */}
                            {clip.pendingSync && <span className="flex items-center gap-1 text-emerald-500/80"><Smartphone size={12} /> Pending</span>}
                        </div>
                        <div>
                            {clip.type === "0" ? "Text" : "Markdown"}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
