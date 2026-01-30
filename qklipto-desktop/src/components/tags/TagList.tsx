import React, { useEffect, useState } from 'react';
import { useTagStore } from '../../stores/tagStore';
import { Tag } from '../../models/Tag';
import { Plus, Tag as TagIcon, Trash2, Edit2 } from 'lucide-react';
import { TagDialog } from './TagDialog';

export const TagList = () => {
    const { tags, loadTags, deleteTag } = useTagStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | undefined>(undefined);

    useEffect(() => {
        loadTags();
    }, []);

    const handleCreateClick = () => {
        setEditingTag(undefined);
        setIsDialogOpen(true);
    };

    const handleEditClick = (tag: Tag) => {
        setEditingTag(tag);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (id: string, name: string) => {
        if (confirm(`Delete tag "${name}"?`)) {
            deleteTag(id);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-clipto-text flex items-center gap-2">
                    <TagIcon /> Manage Tags
                </h1>

                <button
                    onClick={handleCreateClick}
                    className="bg-clipto-primary hover:bg-clipto-primaryDark text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus size={20} /> New Tag
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.map(tag => (
                    <div key={tag.id} className="bg-clipto-surface border border-clipto-divider p-4 rounded-xl flex justify-between items-center group hover:bg-clipto-surfaceLight/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-5 h-5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: tag.color }}
                            />
                            <span className="text-clipto-text font-medium truncate">{tag.name}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEditClick(tag)}
                                className="p-2 text-clipto-textSecondary hover:text-clipto-primary rounded-lg hover:bg-clipto-surface"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(tag.id, tag.name)}
                                className="p-2 text-clipto-textSecondary hover:text-red-400 rounded-lg hover:bg-clipto-surface"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {tags.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 text-clipto-textSecondary">
                    <TagIcon size={48} className="mb-4 opacity-50" />
                    <p>No tags created yet.</p>
                </div>
            )}

            <TagDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                tagToEdit={editingTag}
            />
        </div>
    );
};
