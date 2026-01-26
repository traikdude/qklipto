import React, { useState } from 'react';
import { X, Save, Tag as TagIcon } from 'lucide-react';
import { useClipStore } from '../../stores/clipStore';
import { v4 as uuidv4 } from 'uuid';

interface ClipEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    editId?: string; // If provided, we are editing
}

export const ClipEditorModal: React.FC<ClipEditorModalProps> = ({ isOpen, onClose, editId }) => {
    const { addClip, updateClip, clips } = useClipStore();

    // If editing, find the clip
    const existingClip = editId ? clips.find(c => c.id === editId) : null;

    const [text, setText] = useState(existingClip?.text || '');
    const [title, setTitle] = useState(existingClip?.title || '');

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!text.trim()) return;

        if (existingClip) {
            await updateClip(existingClip.id, { text, title, modifyDate: new Date().toISOString() });
        } else {
            await addClip({
                id: uuidv4(),
                text,
                title,
                type: '0',
                createDate: new Date().toISOString(),
                modifyDate: new Date().toISOString(),
                fav: false,
                deleted: false,
                tags: []
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-clipto-surface w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-clipto-divider">
                    <input
                        type="text"
                        placeholder="Title (optional)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-transparent text-xl font-bold text-clipto-text placeholder-clipto-textSecondary flex-1 outline-none mr-4"
                    />
                    <button onClick={onClose} className="text-clipto-textSecondary hover:text-white p-1">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <textarea
                        placeholder="Type something..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-80 bg-transparent text-clipto-text resize-none outline-none text-base leading-relaxed"
                        autoFocus
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-clipto-divider flex items-center justify-between bg-clipto-surfaceLight/5">
                    <button className="flex items-center text-clipto-textSecondary hover:text-clipto-primary transition-colors">
                        <TagIcon size={20} className="mr-2" />
                        <span>Add Tag</span>
                    </button>

                    <button
                        onClick={handleSave}
                        className="flex items-center bg-clipto-primary text-white px-6 py-2 rounded shadow hover:bg-clipto-primaryDark transition-colors font-medium"
                    >
                        <Save size={20} className="mr-2" />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
