import Dexie, { Table } from 'dexie';
import { Clip } from '../models/Clip';
import { Tag } from '../models/Tag';
import { Folder } from '../models/Folder';

export interface SyncMeta {
    id: number;
    lastLocalVersion: number;
    lastCloudVersion: number;
    lastSyncTime: string;
}

export class QKliptoDatabase extends Dexie {
    clips!: Table<Clip, string>;
    tags!: Table<Tag, string>;
    folders!: Table<Folder, string>;
    syncMeta!: Table<SyncMeta, number>;

    constructor() {
        super('qklipto');

        // Version 1: Original schema
        this.version(1).stores({
            clips: 'id, createDate, modifyDate, deleted, fav, *tags',
            tags: 'id, name',
            syncMeta: '++id'
        });

        // Version 2: Add folders and folderId index
        this.version(2).stores({
            clips: 'id, createDate, modifyDate, deleted, fav, folderId, *tags',
            tags: 'id, name',
            folders: 'id, parentId, name',
            syncMeta: '++id'
        });
    }
}

export const db = new QKliptoDatabase();
