import Dexie, { Table } from 'dexie';
import { Clip } from '../models/Clip';
import { Tag } from '../models/Tag';

export interface SyncMeta {
    id: number;
    lastLocalVersion: number;
    lastCloudVersion: number;
    lastSyncTime: string;
}

export class QKliptoDatabase extends Dexie {
    clips!: Table<Clip, string>;
    tags!: Table<Tag, string>;
    syncMeta!: Table<SyncMeta, number>;

    constructor() {
        super('qklipto');
        this.version(1).stores({
            clips: 'id, createDate, modifyDate, deleted, fav, *tags',
            tags: 'id, name',
            syncMeta: '++id'
        });
    }
}

export const db = new QKliptoDatabase();
