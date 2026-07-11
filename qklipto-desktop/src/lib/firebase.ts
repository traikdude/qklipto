import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { useSettingsStore } from '../stores/settingsStore';

// Initialize Firebase only if config is valid
export const initializeFirebase = (): { auth?: Auth; firestore?: Firestore } => {
    // This function will be called by the settings store or sync engine
    // For now, we return null until the user provides config
    // In a real app, we might store this in localStorage or a separate config file
    return {};
};

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDeOcalVSuGg7BJwf5GD49HBUfBaXNxmc0',
    authDomain: 'synapse-brigade.firebaseapp.com',
    projectId: 'synapse-brigade',
    storageBucket: 'synapse-brigade.firebasestorage.app',
    messagingSenderId: '46376557580',
    appId: '1:46376557580:web:abd5ba83c51bdeee382229'
};

// Singleton instance
let app;
let auth: Auth;
let firestore: Firestore;
let analytics;

try {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }

    auth = getAuth(app);
    firestore = getFirestore(app);

    if (typeof window !== 'undefined') {
        import('firebase/analytics').then(({ getAnalytics }) => {
            analytics = getAnalytics(app);
        }).catch(e => console.log("Analytics not supported in this environment"));
    }

} catch (e) {
    console.error("Firebase initialization error:", e);
}

export { auth, firestore, analytics };
