// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyARgwkry_0zIy7fBwO_MeLO5bnZwq62W_c',
  authDomain: 'netflix-clone-muneebahmaddev.firebaseapp.com',
  projectId: 'netflix-clone-muneebahmaddev',
  storageBucket: 'netflix-clone-muneebahmaddev.appspot.com',
  messagingSenderId: '895989885196',
  appId: '1:895989885196:web:e18a20a9ebb5cc63840129',
  measurementId: 'G-63FP7CFKCQ',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { db, auth }
