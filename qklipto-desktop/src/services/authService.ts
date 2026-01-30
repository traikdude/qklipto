import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore, mapFirebaseUser } from '../stores/authStore';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
    const { setLoading, setError, setUser } = useAuthStore.getState();

    try {
        setLoading(true);
        setError(null);

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = mapFirebaseUser(userCredential.user);
        setUser(user);

        return { success: true, user };
    } catch (error: any) {
        const errorMessage = getAuthErrorMessage(error.code);
        setError(errorMessage);
        return { success: false, error: errorMessage };
    } finally {
        setLoading(false);
    }
};

/**
 * Create account with email and password
 */
export const signUpWithEmail = async (email: string, password: string) => {
    const { setLoading, setError, setUser } = useAuthStore.getState();

    try {
        setLoading(true);
        setError(null);

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = mapFirebaseUser(userCredential.user);
        setUser(user);

        return { success: true, user };
    } catch (error: any) {
        const errorMessage = getAuthErrorMessage(error.code);
        setError(errorMessage);
        return { success: false, error: errorMessage };
    } finally {
        setLoading(false);
    }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
    const { setLoading, setError, setUser } = useAuthStore.getState();

    try {
        setLoading(true);
        setError(null);

        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = mapFirebaseUser(userCredential.user);
        setUser(user);

        return { success: true, user };
    } catch (error: any) {
        const errorMessage = getAuthErrorMessage(error.code);
        setError(errorMessage);
        return { success: false, error: errorMessage };
    } finally {
        setLoading(false);
    }
};

/**
 * Sign out
 */
export const signOut = async () => {
    const { signOut: storeSignOut, setLoading, setError } = useAuthStore.getState();

    try {
        setLoading(true);
        setError(null);

        await firebaseSignOut(auth);
        storeSignOut();

        return { success: true };
    } catch (error: any) {
        const errorMessage = getAuthErrorMessage(error.code);
        setError(errorMessage);
        return { success: false, error: errorMessage };
    } finally {
        setLoading(false);
    }
};

/**
 * Initialize auth state listener
 * Call this once when the app starts
 */
export const initAuthListener = () => {
    const { setUser, setLoading } = useAuthStore.getState();

    setLoading(true);

    return onAuthStateChanged(auth, (firebaseUser) => {
        const user = mapFirebaseUser(firebaseUser);
        setUser(user);
        setLoading(false);
    });
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/user-disabled':
            return 'This account has been disabled';
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later';
        case 'auth/popup-closed-by-user':
            return 'Sign-in cancelled';
        default:
            return 'An error occurred. Please try again';
    }
};
