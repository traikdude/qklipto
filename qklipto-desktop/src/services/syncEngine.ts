import { db } from '../db/database';
import { localSyncService } from './localSync';
import { firebaseSyncService } from './firebaseSync';
import { useSettingsStore } from '../stores/settingsStore';

export const syncEngine = {
    async sync() {
        const { syncMode } = useSettingsStore.getState();
        if (syncMode === 'off') return;

        try {
            // 1. Get Sync Meta
            let meta = await db.syncMeta.get(1);
            if (!meta) {
                // Initialize if first run
                meta = { id: 1, lastLocalVersion: 0, lastCloudVersion: 0, lastSyncTime: new Date().toISOString() };
                await db.syncMeta.add(meta);
            }

            if (syncMode === 'local') {
                await this.performLocalSync(meta);
            } else if (syncMode === 'cloud') {
                await this.performCloudSync(meta);
            }

            // Update Sync Time
            await db.syncMeta.update(1, { lastSyncTime: new Date().toISOString() });

        } catch (error) {
            console.error("Sync Engine Error:", error);
        }
    },

    async performLocalSync(meta: any) {
        // A. PUSH: Find pending changes
        const pendingClips = await db.clips.filter(c => !!c.pendingSync).toArray();

        if (pendingClips.length > 0) {
            console.log(`Pushing ${pendingClips.length} clips...`);
            const result = await localSyncService.push(pendingClips);

            if (result.success) {
                // Clear pending flag
                const ids = pendingClips.map(c => c.id);
                await db.transaction('rw', db.clips, async () => {
                    for (const id of ids) {
                        await db.clips.update(id, { pendingSync: false, syncVersion: result.newVersion });
                    }
                });
                // Update meta version
                await db.syncMeta.update(1, { lastLocalVersion: result.newVersion });
            }
        }

        // B. PULL: Check for updates
        const pullResult = await localSyncService.pull(meta.lastLocalVersion);
        if (pullResult.hasUpdates) {
            console.log(`Received ${pullResult.clips.length} updates...`);

            await db.transaction('rw', db.clips, async () => {
                for (const remoteClip of pullResult.clips) {
                    // LWW Resolution: Check if we have a newer local modification
                    const localClip = await db.clips.get(remoteClip.id);

                    let shouldUpdate = true;
                    if (localClip) {
                        const localDate = new Date(localClip.modifyDate).getTime();
                        const remoteDate = new Date(remoteClip.modifyDate).getTime();
                        if (localDate > remoteDate) {
                            shouldUpdate = false; // Keep local winner
                        }
                    }

                    if (shouldUpdate) {
                        await db.clips.put({
                            ...remoteClip,
                            pendingSync: false, // It came from server, so it's synced
                            syncVersion: pullResult.newVersion
                        });
                    }
                }
            });

            await db.syncMeta.update(1, { lastLocalVersion: pullResult.newVersion });
        }
    },

    async performCloudSync(meta: any) {
        const pendingClips = await db.clips.filter(c => !!c.pendingSync).toArray();
        if (pendingClips.length > 0) {
            await firebaseSyncService.push(pendingClips);
            const ids = pendingClips.map(c => c.id);
            await db.transaction('rw', db.clips, async () => {
                for (const id of ids) {
                    await db.clips.update(id, { pendingSync: false });
                }
            });
        }

        const pullResult = await firebaseSyncService.pull(meta.lastSyncTime);
        if (pullResult.hasUpdates) {
            await db.transaction('rw', db.clips, async () => {
                for (const remoteClip of pullResult.clips) {
                    await db.clips.put({ ...remoteClip, pendingSync: false });
                }
            });
        }
    }
};
