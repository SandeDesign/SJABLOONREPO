import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  updatePassword,
} from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  role: 'klant' | 'admin'
  photoURL?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string, role?: 'klant' | 'admin') => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
  updateUserPassword: (newPassword: string) => Promise<void>
  getAllUsers: () => Promise<AuthUser[]>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const initializedRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence)

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!isMounted) return

          try {
            if (firebaseUser) {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

              let userData
              if (userDoc.exists()) {
                userData = userDoc.data()
              } else {
                userData = {
                  role: 'klant',
                  naam: firebaseUser.displayName || '',
                  email: firebaseUser.email,
                  createdAt: new Date(),
                }
                await setDoc(doc(db, 'users', firebaseUser.uid), userData)
              }

              const authUser: AuthUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                role: userData.role || 'klant',
                photoURL: firebaseUser.photoURL || undefined,
              }

              setUser(authUser)
            } else {
              setUser(null)
            }
          } catch {
            if (firebaseUser) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                role: 'klant',
              })
            } else {
              setUser(null)
            }
          } finally {
            if (!initializedRef.current) {
              initializedRef.current = true
              setLoading(false)
            }
          }
        })

        return unsubscribe
      } catch {
        setLoading(false)
        return () => {}
      }
    }

    const unsubscribePromise = initializeAuth()

    return () => {
      isMounted = false
      unsubscribePromise.then((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
    }
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: 'klant' | 'admin' = 'klant',
  ) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(firebaseUser, { displayName })

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      naam: displayName,
      role,
      createdAt: new Date(),
    })
  }

  const logout = async () => {
    await signOut(auth)
  }

  const updateUserProfile = async (displayName: string) => {
    if (!auth.currentUser) throw new Error('Geen ingelogde gebruiker')

    await updateProfile(auth.currentUser, { displayName })
    await updateDoc(doc(db, 'users', auth.currentUser.uid), { naam: displayName })
    setUser((prev) => (prev ? { ...prev, displayName } : null))
  }

  const updateUserPassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error('Geen ingelogde gebruiker')
    await updatePassword(auth.currentUser, newPassword)
  }

  const getAllUsers = async (): Promise<AuthUser[]> => {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    return usersSnapshot.docs.map(
      (d) =>
        ({
          uid: d.id,
          ...d.data(),
        }) as AuthUser,
    )
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    updateUserPassword,
    getAllUsers,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
