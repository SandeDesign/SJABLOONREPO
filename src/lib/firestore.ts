import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  getDocs,
  onSnapshot,
  orderBy,
  where,
  DocumentData,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// ============================================================
// Typed Firestore CRUD helpers
// ============================================================

export async function getDocument<T>(path: string): Promise<T | null> {
  const snap = await getDoc(doc(db, path))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as T
}

export async function setDocument(path: string, data: DocumentData): Promise<void> {
  await setDoc(doc(db, path), data, { merge: true })
}

export async function addDocument(collectionPath: string, data: DocumentData): Promise<string> {
  const ref = await addDoc(collection(db, collectionPath), data)
  return ref.id
}

export async function updateDocument(path: string, data: DocumentData): Promise<void> {
  await updateDoc(doc(db, path), data)
}

export async function deleteDocument(path: string): Promise<void> {
  await deleteDoc(doc(db, path))
}

export async function getCollection<T>(
  collectionPath: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const q = query(collection(db, collectionPath), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
}

export function subscribeToCollection<T>(
  collectionPath: string,
  callback: (items: T[]) => void,
  ...constraints: QueryConstraint[]
): () => void {
  const q = query(collection(db, collectionPath), ...constraints)
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
    callback(items)
  })
}

export function subscribeToDocument<T>(
  path: string,
  callback: (data: T | null) => void,
): () => void {
  return onSnapshot(doc(db, path), (snap) => {
    if (!snap.exists()) {
      callback(null)
      return
    }
    callback({ id: snap.id, ...snap.data() } as T)
  })
}

// Re-export useful Firestore utilities
export { orderBy, where, Timestamp }
