import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';

const FIREBASE_CONFIG_KEY = 'vibe_check_firebase_config_v1';

// Try to read config from localStorage or Vite environment variables
export function getFirebaseConfig() {
  try {
    const stored = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.projectId) return parsed;
    }
  } catch (e) {
    console.warn("Error reading stored firebase config", e);
  }

  // Fallback to Vite env variables
  if (import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
    };
  }

  return null;
}

export function saveFirebaseConfig(config) {
  try {
    if (!config) {
      localStorage.removeItem(FIREBASE_CONFIG_KEY);
    } else {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    }
    // Reload window so Firebase app instance is re-initialized cleanly
    window.location.reload();
  } catch (e) {
    console.error("Failed to save firebase config", e);
  }
}

let dbInstance = null;

function getDb() {
  if (dbInstance) return dbInstance;
  const config = getFirebaseConfig();
  if (!config || !config.projectId) return null;

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.error("Firebase initialization failed:", err);
    return null;
  }
}

export function isFirebaseConfigured() {
  return !!getDb();
}

/**
 * Real-time listener for Party Configuration (venue, dates, photos/slides, announcement).
 * Updates automatically whenever Admin makes any changes.
 */
export function subscribeCloudConfig(onUpdate) {
  const db = getDb();
  if (!db) return () => {};

  try {
    const configDocRef = doc(db, 'party_vibe_check', 'settings');
    const unsubscribe = onSnapshot(configDocRef, (snap) => {
      if (snap.exists()) {
        const cloudData = snap.data();
        onUpdate(cloudData);
      }
    }, (error) => {
      console.warn("Cloud config subscription error:", error);
    });
    return unsubscribe;
  } catch (err) {
    console.warn("Failed to subscribe to cloud config:", err);
    return () => {};
  }
}

/**
 * Save Party Configuration to Cloud.
 */
export async function saveCloudConfig(configData) {
  const db = getDb();
  if (!db) return false;

  try {
    const configDocRef = doc(db, 'party_vibe_check', 'settings');
    await setDoc(configDocRef, configData, { merge: true });
    return true;
  } catch (err) {
    console.error("Failed to save config to cloud:", err);
    return false;
  }
}

/**
 * Real-time listener for Attendees Roster.
 * Admin and participants see new registrations appear live.
 */
export function subscribeCloudAttendees(onUpdate) {
  const db = getDb();
  if (!db) return () => {};

  try {
    const attendeesColRef = collection(db, 'party_vibe_check_attendees');
    const unsubscribe = onSnapshot(attendeesColRef, (snap) => {
      const list = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      // Sort newest first
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onUpdate(list);
    }, (error) => {
      console.warn("Cloud attendees subscription error:", error);
    });
    return unsubscribe;
  } catch (err) {
    console.warn("Failed to subscribe to cloud attendees:", err);
    return () => {};
  }
}

/**
 * Save attendee to Cloud
 */
export async function saveCloudAttendee(attendeeData) {
  const db = getDb();
  if (!db) return null;

  try {
    const docId = attendeeData.id || `att-${Date.now()}`;
    const cleanData = {
      ...attendeeData,
      id: docId,
      createdAt: attendeeData.createdAt || Date.now()
    };
    const attendeeDocRef = doc(db, 'party_vibe_check_attendees', docId);
    await setDoc(attendeeDocRef, cleanData);
    return cleanData;
  } catch (err) {
    console.error("Failed to save attendee to cloud:", err);
    return null;
  }
}

/**
 * Delete attendee from Cloud (Admin only)
 */
export async function deleteCloudAttendee(id) {
  const db = getDb();
  if (!db) return false;

  try {
    const attendeeDocRef = doc(db, 'party_vibe_check_attendees', id);
    await deleteDoc(attendeeDocRef);
    return true;
  } catch (err) {
    console.error("Failed to delete attendee from cloud:", err);
    return false;
  }
}

/**
 * Toggle check-in status in Cloud (Admin only)
 */
export async function toggleCloudAttendeeCheckIn(id, checkedIn) {
  const db = getDb();
  if (!db) return false;

  try {
    const attendeeDocRef = doc(db, 'party_vibe_check_attendees', id);
    await updateDoc(attendeeDocRef, { checkedIn: !checkedIn });
    return true;
  } catch (err) {
    console.error("Failed to toggle check-in in cloud:", err);
    return false;
  }
}
