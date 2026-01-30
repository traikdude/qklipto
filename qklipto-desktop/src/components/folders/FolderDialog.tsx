import React from 'react';
import { X, Folder as FolderIcon } from 'lucide-react';
import { useFolderStore } from '../../stores/folderStore';

interface FolderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    parentId?: string | null;
    editingFolderId?: string;
}

const FOLDER_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
];

const FOLDER_ICONS = ['📁', '📂', '📋', '📝', '💼', '🎯', '⭐', '🔖', '📌', '🏷️'];

export const FolderDialog: React.FC<FolderDialogProps> = ({
    isOpen,
    onClose,
    parentId = null,
    editingFolderId
}) => {
    const { addFolder, updateFolder, getFolderById } = useFolderStore();
    const editingFolder = editingFolderId ? getFolderById(editingFolderId) : null;

    const [name, setName] = React.useState('');
    const [color, setColor] = React.useState<string | undefined>(undefined);
    const [icon, setIcon] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        if (editingFolder) {
            setName(editingFolder.name);
            setColor(editingFolder.color);
            setIcon(editingFolder.icon);
        } else {
            setName('');
            setColor(undefined);
            setIcon(undefined);
        }
    }, [editingFolder, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (editingFolderId) {
            updateFolder(editingFolderId, { name: name.trim(), color, icon });
        } else {
            addFolder(name.trim(), parentId);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-clipto-surface rounded-xl shadow-2xl max-w-md w-full border border-clipto-divider">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-clipto-divider">
                    <h2 className="text-xl font-semibold text-clipto-text flex items-center gap-2">
                        <FolderIcon size={20} />
                        {editingFolderId ? 'Edit Folder' : 'New Folder'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-clipto-surfaceLight/50 rounded-lg transition-colors text-clipto-textSecondary"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Folder Name */}
                    <div>
                        <label className="block text-sm font-medium text-clipto-text mb-2">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter folder name..."
                            autoFocus
                            className="w-full px-4 py-2 bg-clipto-surfaceLight border border-clipto-divider rounded-lg text-clipto-text placeholder-clipto-textSecondary focus:outline-none focus:border-clipto-primary transition-colors"
                        />
                    </div>

                    {/* Icon Selector */}
                    <div>
                        <label className="block text-sm font-medium text-clipto-text mb-2">
                            Icon (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setIcon(undefined)}
                                className={`
                                    w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all
                                    ${icon === undefined
                                        ? 'border-clipto-primary bg-clipto-primary/10'
                                        : 'border-clipto-divider hover:border-clipto-primary/50'
                                    }
                                `}
                            >
                                <FolderIcon size={18} className="text-clipto-textSecondary" />
                            </button>
                            {FOLDER_ICONS.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setIcon(emoji)}
                                    className={`
                                        w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition-all
                                        ${icon === emoji
                                            ? 'border-clipto-primary bg-clipto-primary/10'
                                            : 'border-clipto-divider hover:border-clipto-primary/50'
                                        }
                                    `}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div>
                        <label className="block text-sm font-medium text-clipto-text mb-2">
                            Color (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setColor(undefined)}
                                className={`
                                    w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all
                                    ${color === undefined
                                        ? 'border-clipto-primary bg-clipto-primary/10'
                                        : 'border-clipto-divider hover:border-clipto-primary/50'
                                    }
                                `}
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-clipto-textSecondary to-clipto-divider" />
                            </button>
                            {FOLDER_COLORS.map((colorOption) => (
                                <button
                                    key={colorOption}
                                    type="button"
                                    onClick={() => setColor(colorOption)}
                                    className={`
                                        w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all
                                        ${color === colorOption
                                            ? 'border-clipto-primary'
                                            : 'border-clipto-divider hover:border-clipto-primary/50'
                                        }
                                    `}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: colorOption }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-clipto-surfaceLight text-clipto-text rounded-lg hover:bg-clipto-surfaceLight/70 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="flex-1 px-4 py-2 bg-clipto-primary text-white rounded-lg hover:bg-clipto-primaryDark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {editingFolderId ? 'Save' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
