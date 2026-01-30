import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useFolderStore } from '../../stores/folderStore';
import { getFolderBreadcrumbs } from '../../models/Folder';

export const FolderBreadcrumbs: React.FC = () => {
    const { selectedFolderId, setSelectedFolder, folders } = useFolderStore();
    const breadcrumbs = getFolderBreadcrumbs(selectedFolderId, folders);

    return (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-clipto-divider bg-clipto-surface/50">
            {/* Home / All Clips */}
            <button
                onClick={() => setSelectedFolder(null)}
                className={`
                    flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors
                    ${selectedFolderId === null
                        ? 'text-clipto-primary font-medium'
                        : 'text-clipto-textSecondary hover:text-clipto-text hover:bg-clipto-surfaceLight/30'
                    }
                `}
            >
                <Home size={16} />
                <span>All Clips</span>
            </button>

            {/* Breadcrumb Trail */}
            {breadcrumbs.map((folder, index) => (
                <React.Fragment key={folder.id}>
                    <ChevronRight size={16} className="text-clipto-textSecondary" />
                    <button
                        onClick={() => setSelectedFolder(folder.id)}
                        className={`
                            flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors
                            ${index === breadcrumbs.length - 1
                                ? 'text-clipto-primary font-medium'
                                : 'text-clipto-textSecondary hover:text-clipto-text hover:bg-clipto-surfaceLight/30'
                            }
                        `}
                    >
                        {folder.icon && <span>{folder.icon}</span>}
                        <span>{folder.name}</span>
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
};
