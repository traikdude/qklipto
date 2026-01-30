export interface Folder {
    id: string;
    name: string;
    parentId: string | null; // null for root folders
    color?: string; // Optional color for visual organization
    icon?: string; // Optional emoji icon
    createDate: string; // ISO 8601
    modifyDate: string; // ISO 8601
    syncVersion?: number;
    pendingSync?: boolean;
}

export const createFolder = (name: string, parentId: string | null = null): Folder => ({
    id: crypto.randomUUID(),
    name,
    parentId,
    createDate: new Date().toISOString(),
    modifyDate: new Date().toISOString(),
    pendingSync: true
});

/**
 * Helper to build folder tree from flat array
 */
export interface FolderNode extends Folder {
    children: FolderNode[];
    depth: number;
}

export const buildFolderTree = (folders: Folder[]): FolderNode[] => {
    const folderMap = new Map<string, FolderNode>();
    const rootFolders: FolderNode[] = [];

    // First pass: create nodes
    folders.forEach(folder => {
        folderMap.set(folder.id, { ...folder, children: [], depth: 0 });
    });

    // Second pass: build tree
    folders.forEach(folder => {
        const node = folderMap.get(folder.id)!;

        if (folder.parentId === null) {
            rootFolders.push(node);
        } else {
            const parent = folderMap.get(folder.parentId);
            if (parent) {
                node.depth = parent.depth + 1;
                parent.children.push(node);
            } else {
                // Parent not found, treat as root
                rootFolders.push(node);
            }
        }
    });

    // Sort by name
    const sortByName = (a: FolderNode, b: FolderNode) => a.name.localeCompare(b.name);
    rootFolders.sort(sortByName);
    folderMap.forEach(node => node.children.sort(sortByName));

    return rootFolders;
};

/**
 * Get all ancestor folder IDs for a given folder
 */
export const getFolderAncestors = (folderId: string, folders: Folder[]): string[] => {
    const ancestors: string[] = [];
    const folderMap = new Map(folders.map(f => [f.id, f]));

    let currentId: string | null = folderId;
    while (currentId) {
        const folder = folderMap.get(currentId);
        if (!folder) break;
        ancestors.push(currentId);
        currentId = folder.parentId;
    }

    return ancestors.reverse(); // Root first
};

/**
 * Get breadcrumb path for a folder
 */
export const getFolderBreadcrumbs = (folderId: string | null, folders: Folder[]): Folder[] => {
    if (!folderId) return [];

    const breadcrumbs: Folder[] = [];
    const folderMap = new Map(folders.map(f => [f.id, f]));

    let currentId: string | null = folderId;
    while (currentId) {
        const folder = folderMap.get(currentId);
        if (!folder) break;
        breadcrumbs.unshift(folder);
        currentId = folder.parentId;
    }

    return breadcrumbs;
};
