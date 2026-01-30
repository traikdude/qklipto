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
        // 1. PUSH Changes
        const pendingClips = await db.clips.filter(c => !!c.pendingSync).toArray();
        const pendingFolders = await db.folders.filter(f => !!f.pendingSync).toArray();

        if (pendingClips.length > 0 || pendingFolders.length > 0) {
            console.log(`Pushing ${pendingClips.length} clips and ${pendingFolders.length} folders...`);
            await firebaseSyncService.push(pendingClips, pendingFolders);

            // A. Clear pending flag for Clips
            if (pendingClips.length > 0) {
                const ids = pendingClips.map(c => c.id);
                await db.transaction('rw', db.clips, async () => {
                    for (const id of ids) {
                        await db.clips.update(id, { pendingSync: false });
                    }
                });
            }

            // B. Clear pending flag for Folders
            if (pendingFolders.length > 0) {
                const ids = pendingFolders.map(f => f.id);
                await db.transaction('rw', db.folders, async () => {
                    for (const id of ids) {
                        await db.folders.update(id, { pendingSync: false });
                    }
                });
            }
        }

        // 2. PULL Changes
        const pullResult = await firebaseSyncService.pull(meta.lastSyncTime);

        if (pullResult.hasUpdates) {
            console.log(`Received ${pullResult.clips.length} clip updates and ${pullResult.folders.length} folder updates...`);

            // Process Clip Updates
            if (pullResult.clips.length > 0) {
                await db.transaction('rw', db.clips, async () => {
                    for (const remoteClip of pullResult.clips) {
                        const localClip = await db.clips.get(remoteClip.id);
                        let shouldUpdate = true;

                        if (localClip) {
                            // Conflict Resolution: Last Write Wins
                            // If local has unscynced changes, check timestamps
                            if (localClip.pendingSync) {
                                const localDate = new Date(localClip.modifyDate).getTime();
                                const remoteDate = new Date(remoteClip.modifyDate).getTime();
                                if (localDate > remoteDate) {
                                    shouldUpdate = false; // Local is newer, keep it
                                }
                            }
                        }

                        if (shouldUpdate) {
                            await db.clips.put({ ...remoteClip, pendingSync: false });
                        }
                    }
                });
            }

            // Process Folder Updates
            if (pullResult.folders.length > 0) {
                await db.transaction('rw', db.folders, async () => {
                    for (const remoteFolder of pullResult.folders) {
                        const localFolder = await db.folders.get(remoteFolder.id);
                        let shouldUpdate = true;

                        if (localFolder) {
                            if (localFolder.pendingSync) {
                                const localDate = new Date(localFolder.updatedAt).getTime();
                                const remoteDate = new Date(remoteFolder.updatedAt).getTime();
                                if (localDate > remoteDate) {
                                    shouldUpdate = false;
                                }
                            }
                        }

                        if (shouldUpdate) {
                            await db.folders.put({ ...remoteFolder, pendingSync: false });
                        }
                    }
                });
            }
        }
    }
};
