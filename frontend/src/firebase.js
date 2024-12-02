// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyA38rH9V674sIS4aMZZ-OWnXDcvLVL4k2M',
  authDomain: 'minecraftserver-62dcf.firebaseapp.com',
  projectId: 'minecraftserver-62dcf',
  storageBucket: 'minecraftserver-62dcf.firebasestorage.app',
  messagingSenderId: '269754184713',
  appId: '1:269754184713:web:f356383cf1542e9994b4d8',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
