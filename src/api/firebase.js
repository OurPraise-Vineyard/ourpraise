// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCT7xqW3aLcpu7Ekwq7EOmqUAOjVkMMNq8',
  authDomain: 'songdriver-firebase.firebaseapp.com',
  projectId: 'songdriver-firebase',
  storageBucket: 'songdriver-firebase.appspot.com',
  messagingSenderId: '499412488326',
  appId: '1:499412488326:web:3f11b7f18d91f89207c107'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default app
