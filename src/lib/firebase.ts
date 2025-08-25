// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "v-leap",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Only initialize Firebase if we have a valid config and we're not in SSR
function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Server-side: return null
    return { app: null, db: null, auth: null }
  }
  
  if (!firebaseConfig.apiKey) {
    console.error('Firebase API key not found')
    return { app: null, db: null, auth: null }
  }

  // Client-side: initialize normally
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  const db = getFirestore(app)
  const auth = getAuth(app)
  
  return { app, db, auth }
}

const { app, db, auth } = initializeFirebase()

export { app, db, auth }