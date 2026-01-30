import React, { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import { useTagStore } from '../../stores/tagStore';
import { TAG_COLORS, Tag } from '../../models/Tag';

interface TagDialogProps {
    isOpen: boolean;
    onClose: () => void;
    tagToEdit?: Tag;
}

export const TagDialog: React.FC<TagDialogProps> = ({ isOpen, onClose, tagToEdit }) => {
    const { addTag, updateTag } = useTagStore();
    const [name, setName] = useState('');
    const [color, setColor] = useState(TAG_COLORS[0]);

    useEffect(() => {
        if (tagToEdit) {
            setName(tagToEdit.name);
            setColor(tagToEdit.color);
        } else {
            setName('');
            setColor(TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]);
        }
    }, [tagToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (tagToEdit) {
            await updateTag(tagToEdit.id, { name: name.trim(), color });
        } else {
            await addTag(name.trim(), color);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-clipto-surface rounded-xl shadow-2xl max-w-sm w-full border border-clipto-divider">
                <div className="flex items-center justify-between px-6 py-4 border-b border-clipto-divider">
                    <h2 className="text-lg font-semibold text-clipto-text">
                        {tagToEdit ? 'Edit Tag' : 'New Tag'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-clipto-surfaceLight/50 rounded-lg text-clipto-textSecondary">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-clipto-textSecondary mb-2">Tag Name</label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-clipto-surfaceLight border border-clipto-divider rounded-lg text-clipto-text focus:outline-none focus:border-clipto-primary"
                            placeholder="Enter tag name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-clipto-textSecondary mb-2">Color</label>
                        <div className="flex flex-wrap gap-3">
                            {TAG_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-clipto-surface ring-clipto-primary' : ''}`}
                                    style={{ backgroundColor: c }}
                                >
                                    {color === c && <Check size={14} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-clipto-text hover:bg-clipto-surfaceLight rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-6 py-2 bg-clipto-primary text-white rounded-lg hover:bg-clipto-primaryDark disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
