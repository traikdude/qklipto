import { Clip } from '../models/Clip';
import { useSettingsStore } from '../stores/settingsStore';
import axios from 'axios';

interface SyncResponse {
    status: 'update' | 'uptodate' | 'success';
    version: number;
    data?: Clip[];
}

export const localSyncService = {
    async pull(currentVersion: number): Promise<{ hasUpdates: boolean; clips: Clip[]; newVersion: number }> {
        const { localServerUrl } = useSettingsStore.getState();
        try {
            const response = await axios.get<SyncResponse>(`${localServerUrl}/sync`, {
                params: { version: currentVersion }
            });

            if (response.data.status === 'update' && response.data.data) {
                return {
                    hasUpdates: true,
                    clips: response.data.data,
                    newVersion: response.data.version
                };
            }

            return { hasUpdates: false, clips: [], newVersion: response.data.version };
        } catch (error) {
            console.error('Local Sync Pull Failed:', error);
            throw error;
        }
    },

    async push(clips: Clip[]): Promise<{ success: boolean; newVersion: number }> {
        const { localServerUrl } = useSettingsStore.getState();
        try {
            // Filter out only what Android LegacyJsonProcessor expects if needed, 
            // but our model is already strictly typed.
            // Ensure type is "0" string.
            const payload = {
                clips: clips.map(c => ({
                    ...c,
                    type: "0" // Enforce strict string type
                }))
            };

            const response = await axios.post<SyncResponse>(`${localServerUrl}/sync`, payload);

            if (response.data.status === 'success') {
                return { success: true, newVersion: response.data.version };
            }

            return { success: false, newVersion: 0 };
        } catch (error) {
            console.error('Local Sync Push Failed:', error);
            throw error;
        }
    },

    async healthCheck(): Promise<boolean> {
        const { localServerUrl } = useSettingsStore.getState();
        try {
            await axios.get(`${localServerUrl}/health`, { timeout: 2000 });
            return true;
        } catch (e) {
            return false;
        }
    }
};
