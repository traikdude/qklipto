import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { createTag } from '../../models/Tag';
import { Plus, Tag as TagIcon, Trash2 } from 'lucide-react';

export const TagList = () => {
    const tags = useLiveQuery(() => db.tags.toArray());
    const [newTagName, setNewTagName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;
        try {
            const existing = await db.tags.where('name').equals(newTagName).first();
            if (existing) {
                alert('Tag already exists!');
                return;
            }

            const newTag = createTag(newTagName);
            await db.tags.add(newTag);
            setNewTagName('');
            setIsCreating(false);
        } catch (e) {
            console.error("Failed to create tag:", e);
        }
    };

    const deleteTag = async (id: string) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            await db.tags.delete(id);
        }
    };

    if (!tags) return <div className="p-8 text-center text-clipto-textSecondary">Loading tags...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-clipto-text flex items-center gap-2">
                    <TagIcon /> Tags
                </h1>

                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-clipto-primary hover:bg-clipto-primaryDark text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                    >
                        <Plus size={20} /> New Tag
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="mb-8 bg-clipto-surface border border-clipto-divider p-4 rounded-xl flex gap-3 animate-in fade-in">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Tag name..."
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="flex-1 bg-clipto-surfaceLight border-clipto-divider rounded-lg px-4 py-2 text-clipto-text focus:outline-none focus:border-clipto-primary"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                    />
                    <button onClick={handleCreateTag} className="px-4 py-2 bg-clipto-primary rounded-lg text-white">Add</button>
                    <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-clipto-surfaceLight rounded-lg text-clipto-textSecondary">Cancel</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.map(tag => (
                    <div key={tag.id} className="bg-clipto-surface border border-clipto-divider p-4 rounded-xl flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }}></div>
                            <span className="text-clipto-text font-medium">{tag.name}</span>
                        </div>
                        <button
                            onClick={() => deleteTag(tag.id)}
                            className="p-2 text-clipto-textSecondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {tags.length === 0 && !isCreating && (
                <div className="flex flex-col items-center justify-center flex-1 text-clipto-textSecondary">
                    <TagIcon size={48} className="mb-4 opacity-50" />
                    <p>No tags created yet.</p>
                </div>
            )}
        </div>
    );
};
