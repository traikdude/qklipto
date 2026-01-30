import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useFolderStore } from '../../stores/folderStore';
import { useClipActions } from '../../stores/clipStore';
import { useAuthStore } from '../../stores/authStore';
import { useTagStore } from '../../stores/tagStore';
import { signOut as handleSignOut } from '../../services/authService';
import { ChevronDown, ChevronRight, Folder, FolderPlus, FolderInput, LogIn, LogOut, User, Tag as TagIcon, Settings } from 'lucide-react';

interface NavigationDrawerProps {
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = () => {
    const {
        currentView, setView, drawerOpen, setDrawerOpen,
        toggleTagFilter, selectedTags, setSelectedTags,
        setSearchQuery, setAuthDialogOpen
    } = useUIStore();
    const { user, isAuthenticated } = useAuthStore();
    const { getFolderTree, selectedFolderId, setSelectedFolder, expandedFolderIds, toggleFolderExpanded } = useFolderStore();
    const { tags, loadTags } = useTagStore();
    const { moveClipToFolder } = useClipActions();
    const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        loadTags();
    }, []);

    const folderTree = getFolderTree() || [];

    const handleTagClick = (tagName: string) => {
        // Toggle tag filter
        toggleTagFilter(tagName);
        // Ensure we are in clips view
        if (currentView !== 'clips') {
            setView('clips');
        }
    };

    const navItems = [
        {
            title: 'NOTES',
            items: [
                { id: 'clips', label: 'All', iconPath: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', count: 'ALL', view: 'clips' },
                { id: 'favorites', label: 'Starred', iconPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', count: '', view: 'favorites' },
                { id: 'trash', label: 'Recycle Bin', iconPath: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', count: '', view: 'trash' },
            ]
        },
        {
            title: 'TAGS',
            items: [
                ...tags.map(tag => ({
                    id: `tag-${tag.id}`,
                    label: tag.name,
                    iconType: 'color',
                    color: tag.color,
                    isTag: true,
                    tagName: tag.name,
                    view: 'clips' // Clicking a tag goes to clips view
                })),
                { id: 'manage-tags', label: 'Manage Tags', iconElement: <TagIcon size={18} />, count: '', view: 'tags' }
            ]
        },
        {
            title: 'SETTINGS',
            items: [
                { id: 'settings', label: 'Settings', iconElement: <Settings size={18} />, count: '', view: 'settings' }
            ]
        }
    ];

    const handleFolderDragOver = (e: React.DragEvent, folderId: string | null) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setDropTargetId(folderId);
    };

    const handleFolderDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTargetId(null);
    };

    const handleFolderDrop = async (e: React.DragEvent, folderId: string | null) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTargetId(null);

        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'clip') {
                await moveClipToFolder(data.clipId, folderId);
            }
        } catch (error) {
            console.error('Failed to move clip:', error);
        }
    };

    const handleFolderClick = (folderId: string | null) => {
        setSelectedFolder(folderId);
        setView('clips');
        setDrawerOpen(false); // Close drawer on mobile after selection
    };

    const renderFolderNode = (node: any, depth: number = 0) => {
        const isExpanded = expandedFolderIds.has(node.id);
        const isSelected = selectedFolderId === node.id;
        const hasChildren = node.children && node.children.length > 0;
        const isDropTarget = dropTargetId === node.id;

        return (
            <div key={node.id} className="select-none">
                <div
                    onDragOver={(e) => handleFolderDragOver(e, node.id)}
                    onDragLeave={handleFolderDragLeave}
                    onDrop={(e) => handleFolderDrop(e, node.id)}
                    onClick={() => handleFolderClick(node.id)}
                    className={`
                        flex items-center gap-2 px-6 py-2 cursor-pointer transition-all border-l-4
                        ${isSelected
                            ? 'bg-clipto-surfaceLight text-clipto-primary border-clipto-primary'
                            : 'border-transparent text-clipto-textSecondary hover:bg-black/10 hover:text-clipto-text'
                        }
                        ${isDropTarget ? 'bg-clipto-primary/30 ring-2 ring-clipto-primary ring-inset' : ''}
                    `}
                    style={{ paddingLeft: `${24 + depth * 16}px` }}
                >
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFolderExpanded(node.id);
                            }}
                            className="p-0.5"
                        >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    )}
                    {!hasChildren && <div className="w-5" />}
                    <Folder size={16} style={node.color ? { color: node.color } : undefined} />
                    <span className="text-[13px] font-medium tracking-wide flex-1 truncate">
                        {node.icon && <span className="mr-1">{node.icon}</span>}
                        {node.name}
                    </span>
                </div>
                {isExpanded && hasChildren && (
                    <div>
                        {node.children.map((child: any) => renderFolderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* Main Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-clipto-surface border-r border-clipto-divider h-screen
                transition-transform duration-300 transform 
                ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:flex flex-col shadow-2xl md:shadow-none
            `}>
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-clipto-divider h-16 bg-clipto-surface">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-clipto-primary flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-clipto-primary animate-pulse"></div>
                        </div>
                        <span className="font-bold text-lg text-clipto-text uppercase tracking-tighter">QKlipto</span>
                    </div>
                </div>

                {/* Scroller */}
                <div className="flex-1 overflow-y-auto py-2 scrollbar-clipto">
                    {navItems.map((section, idx) => (
                        <div key={idx} className="mb-4">
                            <div className="px-6 py-2 flex items-center justify-between group cursor-pointer mb-1">
                                <span className="text-[10px] font-extrabold text-clipto-textMuted uppercase tracking-[0.2em]">{section.title}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {section.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.tagName) {
                                                handleTagClick(item.tagName);
                                            } else if (item.view) {
                                                setView(item.view as any);
                                            }
                                            setDrawerOpen(false);
                                        }}
                                        className={`
                                            flex items-center justify-between px-6 py-3 cursor-pointer transition-all border-l-4
                                            ${(item.tagName ? selectedTags.includes(item.tagName) : currentView === item.view)
                                                ? 'bg-clipto-surfaceLight text-clipto-primary border-clipto-primary'
                                                : 'border-transparent text-clipto-textSecondary hover:bg-black/10 hover:text-clipto-text'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            {item.iconType === 'color' ? (
                                                <div
                                                    className="w-5 h-5 rounded-full border border-black/20"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                            ) : item.iconElement ? (
                                                <div className={`${(item.tagName ? selectedTags.includes(item.tagName) : currentView === item.view) ? 'text-clipto-primary' : 'opacity-70'} `}>
                                                    {item.iconElement}
                                                </div>
                                            ) : (
                                                <svg className={`w-5 h-5 flex-shrink-0 ${(item.tagName ? selectedTags.includes(item.tagName) : currentView === item.view) ? 'text-clipto-primary' : 'opacity-70'} `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconPath} />
                                                </svg>
                                            )}
                                            <span className="text-[13px] font-medium tracking-wide truncate">{item.label}</span>
                                        </div>
                                        {item.count && (
                                            <span className="text-[10px] opacity-30 font-bold bg-black/20 px-2 py-0.5 rounded">{item.count}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Folders Section */}
                    <div className="mb-4">
                        <div
                            className="px-6 py-2 flex items-center justify-between group cursor-pointer mb-1"
                            onClick={() => setIsFoldersExpanded(!isFoldersExpanded)}
                        >
                            <span className="text-[10px] font-extrabold text-clipto-textMuted uppercase tracking-[0.2em]">FOLDERS</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Open folder dialog
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-clipto-surfaceLight/50 rounded transition-all"
                                >
                                    <FolderPlus size={14} className="text-clipto-primary" />
                                </button>
                                {isFoldersExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </div>
                        </div>
                        {isFoldersExpanded && (
                            <div className="flex flex-col gap-0.5">
                                {/* All Clips */}
                                <div
                                    onDragOver={(e) => handleFolderDragOver(e, null)}
                                    onDragLeave={handleFolderDragLeave}
                                    onDrop={(e) => handleFolderDrop(e, null)}
                                    onClick={() => handleFolderClick(null)}
                                    className={`
                                        flex items-center gap-4 px-6 py-3 cursor-pointer transition-all border-l-4
                                        ${selectedFolderId === null && currentView === 'clips'
                                            ? 'bg-clipto-surfaceLight text-clipto-primary border-clipto-primary'
                                            : 'border-transparent text-clipto-textSecondary hover:bg-black/10 hover:text-clipto-text'
                                        }
                                        ${dropTargetId === null ? 'bg-clipto-primary/30 ring-2 ring-clipto-primary ring-inset' : ''}
                                    `}
                                >
                                    <FolderInput size={16} />
                                    <span className="text-[13px] font-medium tracking-wide">All Clips</span>
                                </div>

                                {/* Folder Tree */}
                                {folderTree.map((node) => renderFolderNode(node))}

                                {folderTree.length === 0 && (
                                    <div className="px-6 py-4 text-center text-clipto-textSecondary text-xs">
                                        No folders yet
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer User Profile / Sync Status */}
                <div className="p-4 border-t border-clipto-divider bg-black/20">
                    {isAuthenticated && user ? (
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-clipto-primary flex items-center justify-center text-xs font-bold text-white">
                                        {user.displayName?.[0]?.toUpperCase() || <User size={14} />}
                                    </div>
                                )}
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs font-bold text-clipto-text truncate">{user.displayName || 'User'}</span>
                                    <span className="text-[10px] text-clipto-textSecondary truncate">{user.email}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-clipto-textSecondary opacity-0 group-hover:opacity-100"
                                title="Sign Out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAuthDialogOpen(true)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-clipto-surfaceLight/50 text-clipto-text transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-clipto-divider flex items-center justify-center text-clipto-textSecondary group-hover:bg-clipto-primary/20 group-hover:text-clipto-primary transition-colors">
                                <LogIn size={14} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-bold">Sign In</span>
                                <span className="text-[10px] text-clipto-textSecondary">Sync your data</span>
                            </div>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};
