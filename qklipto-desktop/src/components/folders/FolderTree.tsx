import React, { useState } from 'react';
import { Folder, FolderPlus, ChevronRight, ChevronDown, MoreVertical, Edit2, Trash2, FolderInput } from 'lucide-react';
import { useFolderStore } from '../../stores/folderStore';
import { useClipActions } from '../../stores/clipStore';
import { FolderNode } from '../../models/Folder';

interface FolderTreeItemProps {
    node: FolderNode;
    onContextMenu: (folderId: string, event: React.MouseEvent) => void;
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({ node, onContextMenu }) => {
    const { selectedFolderId, setSelectedFolder, expandedFolderIds, toggleFolderExpanded } = useFolderStore();
    const { moveClipToFolder } = useClipActions();
    const [isDropTarget, setIsDropTarget] = useState(false);

    const isExpanded = expandedFolderIds.has(node.id);
    const isSelected = selectedFolderId === node.id;
    const hasChildren = node.children.length > 0;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setIsDropTarget(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDropTarget(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDropTarget(false);

        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'clip') {
                await moveClipToFolder(data.clipId, node.id);
            }
        } catch (error) {
            console.error('Failed to move clip:', error);
        }
    };

    return (
        <div className="select-none">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
                    hover:bg-clipto-surfaceLight/30
                    ${isSelected ? 'bg-clipto-primary/20 text-clipto-primary' : 'text-clipto-text'}
                    ${isDropTarget ? 'bg-clipto-primary/30 ring-2 ring-clipto-primary' : ''}
                `}
                style={{ paddingLeft: `${node.depth * 16 + 12}px` }}
                onClick={() => setSelectedFolder(node.id)}
            >
                {/* Expand/Collapse Icon */}
                {hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFolderExpanded(node.id);
                        }}
                        className="p-0.5 hover:bg-clipto-surfaceLight/50 rounded transition-colors"
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                ) : (
                    <div className="w-5" />
                )}

                {/* Folder Icon with optional color */}
                <Folder
                    size={18}
                    className="flex-shrink-0"
                    style={node.color ? { color: node.color } : undefined}
                />

                {/* Folder Name with optional emoji */}
                <span className="flex-1 truncate text-sm font-medium">
                    {node.icon && <span className="mr-1">{node.icon}</span>}
                    {node.name}
                </span>

                {/* Context Menu Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onContextMenu(node.id, e);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-clipto-surfaceLight/50 rounded transition-all"
                >
                    <MoreVertical size={14} />
                </button>
            </div>

            {/* Render Children */}
            {isExpanded && hasChildren && (
                <div className="mt-1">
                    {node.children.map((child) => (
                        <FolderTreeItem key={child.id} node={child} onContextMenu={onContextMenu} />
                    ))}
                </div>
            )}
        </div>
    );
};

interface FolderTreeProps {
    onCreateFolder: () => void;
    onRenameFolder: (folderId: string) => void;
}

export const FolderTree: React.FC<FolderTreeProps> = ({ onCreateFolder, onRenameFolder }) => {
    const { getFolderTree, selectedFolderId, setSelectedFolder } = useFolderStore();
    const { moveClipToFolder } = useClipActions();
    const [contextMenu, setContextMenu] = React.useState<{ folderId: string; x: number; y: number } | null>(null);
    const [isAllClipsDropTarget, setIsAllClipsDropTarget] = React.useState(false);
    const folderTree = getFolderTree();

    const handleContextMenu = (folderId: string, event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({ folderId, x: event.clientX, y: event.clientY });
    };

    const closeContextMenu = () => setContextMenu(null);

    const handleAllClipsDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setIsAllClipsDropTarget(true);
    };

    const handleAllClipsDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAllClipsDropTarget(false);
    };

    const handleAllClipsDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAllClipsDropTarget(false);

        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'clip') {
                await moveClipToFolder(data.clipId, null); // null = root level
            }
        } catch (error) {
            console.error('Failed to move clip:', error);
        }
    };

    React.useEffect(() => {
        if (contextMenu) {
            document.addEventListener('click', closeContextMenu);
            return () => document.removeEventListener('click', closeContextMenu);
        }
    }, [contextMenu]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-clipto-divider">
                <h3 className="text-sm font-semibold text-clipto-text">Folders</h3>
                <button
                    onClick={onCreateFolder}
                    className="p-1.5 hover:bg-clipto-surfaceLight/50 rounded-lg transition-colors text-clipto-primary"
                    title="Create new folder"
                >
                    <FolderPlus size={18} />
                </button>
            </div>

            {/* All Clips (Root) */}
            <div
                onDragOver={handleAllClipsDragOver}
                onDragLeave={handleAllClipsDragLeave}
                onDrop={handleAllClipsDrop}
                className={`
                    flex items-center gap-2 px-3 py-2 mx-2 mt-2 rounded-lg cursor-pointer transition-all
                    hover:bg-clipto-surfaceLight/30
                    ${selectedFolderId === null ? 'bg-clipto-primary/20 text-clipto-primary' : 'text-clipto-text'}
                    ${isAllClipsDropTarget ? 'bg-clipto-primary/30 ring-2 ring-clipto-primary' : ''}
                `}
                onClick={() => setSelectedFolder(null)}
            >
                <FolderInput size={18} />
                <span className="text-sm font-medium">All Clips</span>
            </div>

            {/* Folder Tree */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                {folderTree.length === 0 ? (
                    <div className="text-center py-8 text-clipto-textSecondary text-sm">
                        <Folder size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No folders yet</p>
                        <p className="text-xs mt-1">Click + to create one</p>
                    </div>
                ) : (
                    folderTree.map((node) => (
                        <FolderTreeItem key={node.id} node={node} onContextMenu={handleContextMenu} />
                    ))
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <FolderContextMenu
                    folderId={contextMenu.folderId}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={closeContextMenu}
                    onRename={onRenameFolder}
                />
            )}
        </div>
    );
};

interface FolderContextMenuProps {
    folderId: string;
    x: number;
    y: number;
    onClose: () => void;
    onRename: (folderId: string) => void;
}

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({ folderId, x, y, onClose, onRename }) => {
    const { deleteFolder, getFolderById } = useFolderStore();
    const folder = getFolderById(folderId);

    const handleDelete = () => {
        if (confirm(`Delete folder "${folder?.name}" and all subfolders?`)) {
            deleteFolder(folderId);
            onClose();
        }
    };

    const handleRename = () => {
        onRename(folderId);
        onClose();
    };

    return (
        <div
            className="fixed bg-clipto-surface border border-clipto-divider rounded-lg shadow-xl py-1 z-50 min-w-[160px]"
            style={{ left: x, top: y }}
        >
            <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-clipto-surfaceLight/50 flex items-center gap-2 text-clipto-text"
                onClick={handleRename}
            >
                <Edit2 size={14} />
                Rename
            </button>
            <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-clipto-surfaceLight/50 flex items-center gap-2 text-red-400"
                onClick={handleDelete}
            >
                <Trash2 size={14} />
                Delete
            </button>
        </div>
    );
};
