// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCBfNSkzwlXjavTRNq-TmVo7QpcHrZYvgE',
  authDomain: 'ourpraise-fb.firebaseapp.com',
  projectId: 'ourpraise-fb',
  storageBucket: 'ourpraise-fb.appspot.com',
  messagingSenderId: '485823144275',
  appId: '1:485823144275:web:a6eae91b382d7ebefc41a6'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
}

export default app
