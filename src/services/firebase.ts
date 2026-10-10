import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CropDiagnosis, HistoryItem } from '../types/farm';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
      return false;
    }
    // Permissions error or not-found on test doc is expected and indicates server connectivity
    return true;
  }
}

// Authentication
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Sync user profile to Firestore adhering to security rules
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(userDocRef);
    if (!existingSnap.exists()) {
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Farmer',
        createdAt: new Date().toISOString()
      });
    } else {
      const existingData = existingSnap.data();
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Farmer',
        createdAt: existingData.createdAt || new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Failed to save user profile doc:', err);
  }

  return user;
}

export async function logOut(): Promise<void> {
  await fbSignOut(auth);
}

// Scans Management
export async function saveScanToFirestore(userId: string, historyItem: HistoryItem): Promise<void> {
  const path = `users/${userId}/scans/${historyItem.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'scans', historyItem.id);
    
    // Defensive sanitization: store lightweight diagnosisData payload string
    // To ensure compliance with limits, truncate any excessive string data
    let serializedDiagnosis = '';
    try {
      serializedDiagnosis = JSON.stringify(historyItem.diagnosis || {}).slice(0, 48000);
    } catch (_e) {
      serializedDiagnosis = '{}';
    }

    // Prepare clean data matching the blueprint
    const scanData = {
      id: historyItem.id,
      userId,
      cropName: (historyItem.cropName || 'Crop').slice(0, 100),
      diagnosisName: (historyItem.diagnosisName || 'Diagnosis').slice(0, 150),
      severityLevel: (historyItem.severityLevel || 'Moderate').slice(0, 50),
      healthScore: Number(historyItem.healthScore) || 50,
      confidenceScore: Number(historyItem.diagnosis?.confidenceScore) || 90,
      imageUrl: (historyItem.imageUrl && historyItem.imageUrl.length < 9000) ? historyItem.imageUrl : '',
      locationName: 'Local Field',
      notes: (historyItem.diagnosis?.farmerVernacularSummary || '').slice(0, 950),
      diagnosisData: serializedDiagnosis,
      createdAt: historyItem.timestamp || new Date().toISOString()
    };

    await setDoc(docRef, scanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserScansFromFirestore(userId: string): Promise<HistoryItem[]> {
  const path = `users/${userId}/scans`;
  try {
    const scansCol = collection(db, 'users', userId, 'scans');
    const q = query(scansCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const items: HistoryItem[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      let parsedDiagnosis: CropDiagnosis | undefined = undefined;
      if (data.diagnosisData) {
        try {
          parsedDiagnosis = JSON.parse(data.diagnosisData);
        } catch (_e) {
          // fallback
        }
      }

      items.push({
        id: data.id || docSnap.id,
        timestamp: data.createdAt || new Date().toISOString(),
        cropName: data.cropName,
        diagnosisName: data.diagnosisName,
        severityLevel: data.severityLevel,
        healthScore: data.healthScore,
        imageUrl: data.imageUrl || undefined,
        diagnosis: parsedDiagnosis as any
      });
    });

    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteScanFromFirestore(userId: string, scanId: string): Promise<void> {
  const path = `users/${userId}/scans/${scanId}`;
  try {
    const docRef = doc(db, 'users', userId, 'scans', scanId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
