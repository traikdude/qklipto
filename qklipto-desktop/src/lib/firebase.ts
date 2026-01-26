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
    apiKey: "AIzaSyASc7BqnRTnY5lFONxiaAhO5xBR0iIaGGg",
    authDomain: "qklipto.firebaseapp.com",
    projectId: "qklipto",
    storageBucket: "qklipto.firebasestorage.app",
    messagingSenderId: "766740489019",
    appId: "1:766740489019:web:6bd3a6534721f70e864d1e",
    measurementId: "G-1M4T202WF9"
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
