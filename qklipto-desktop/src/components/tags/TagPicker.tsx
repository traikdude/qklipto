import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { Check } from 'lucide-react';

interface TagPickerProps {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
}

export const TagPicker = ({ selectedTags, onChange }: TagPickerProps) => {
    const tags = useLiveQuery(() => db.tags.toArray());

    if (!tags) return null;

    const toggleTag = (tagName: string) => {
        if (selectedTags.includes(tagName)) {
            onChange(selectedTags.filter(t => t !== tagName));
        } else {
            onChange([...selectedTags, tagName]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                    <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.name)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border transition-all ${isSelected
                                ? 'border-transparent text-white'
                                : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                            }`}
                        style={isSelected ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
                    >
                        {isSelected && <Check size={12} />}
                        {tag.name}
                    </button>
                );
            })}
        </div>
    );
};
