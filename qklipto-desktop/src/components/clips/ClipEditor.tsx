import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { createClip } from '../../models/Clip';
import { db } from '../../db/database';
import { TagPicker } from '../tags/TagPicker';

interface ClipEditorProps {
    onCancel: () => void;
    onSave?: () => void;
}

export const ClipEditor = ({ onCancel, onSave }: ClipEditorProps) => {
    const [text, setText] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!text.trim()) return;

        setIsSaving(true);
        try {
            const newClip = createClip(text);
            newClip.tags = selectedTags;
            await db.clips.add(newClip);
            setText('');
            setSelectedTags([]);
            onSave?.();
            onCancel(); // Close editor after save if needed
        } catch (error) {
            console.error("Failed to save clip:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="border border-gray-800 rounded-lg bg-gray-900 p-4 shadow-xl mb-6">
            <textarea
                className="w-full bg-transparent text-gray-200 placeholder-gray-500 text-lg resize-none focus:outline-none min-h-[120px]"
                placeholder="Type or paste something..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                        handleSave();
                    }
                }}
            />

            <div className="mt-2">
                <TagPicker selectedTags={selectedTags} onChange={setSelectedTags} />
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-800">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-md hover:bg-gray-800 text-gray-400 transition-colors flex items-center gap-2"
                >
                    <X size={18} /> Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!text.trim() || isSaving}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={18} /> Save Clip
                </button>
            </div>
        </div>
    );
};
