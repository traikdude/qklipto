export interface Clip {
    id: string;
    text: string;
    title?: string;
    type: "0"; // Strict string "0" for Android LegacyJsonProcessor compatibility
    fav: boolean;
    deleted: boolean;
    tags: string[]; // Array of tag names
    createDate: string; // ISO 8601
    modifyDate: string; // ISO 8601
    syncVersion?: number;
    pendingSync?: boolean;
}

export const createClip = (text: string, title: string = ""): Clip => ({
    id: crypto.randomUUID(),
    text,
    title,
    type: "0",
    fav: false,
    deleted: false,
    tags: [],
    createDate: new Date().toISOString(),
    modifyDate: new Date().toISOString(),
    pendingSync: true
});
