import { defineStore } from 'pinia'
import { auth } from '../firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { ref, watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Initialize userNumber from localStorage if available
  const user = ref(null)
  const userNumber = ref(localStorage.getItem('userNumber') || null)
  const isAuthResolved = ref(false)

  // Watch userNumber and update localStorage whenever it changes
  watch(userNumber, (newValue) => {
    if (newValue) {
      localStorage.setItem('userNumber', newValue)
    } else {
      localStorage.removeItem('userNumber')
    }
  })

  const login = async () => {
    const provider = new GoogleAuthProvider()
    try {
      console.log('Attempting to log in with Google provider...')
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
      console.log('Login successful. User: ', result.user)

      // Create user in the backend using Fetch API
      const userPayload = {
        username: result.user.displayName,
        email: result.user.email,
        first_name: result.user.displayName?.split(' ')[0] || '',
        last_name: result.user.displayName?.split(' ')[1] || '',
        password: 'N/A', // Password is not available for Google login
      }
      console.log('Sending user data to backend to create user record...')
      const response = await fetch('http://147.79.74.105:3000/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload),
      })
      const data = await response.json()
      if (response.ok) {
        userNumber.value = data.user_number
        console.log('User created in backend. User number: ', data.user_number)
      } else {
        console.error('Failed to create user in backend: ', data)
      }
    } catch (error) {
      console.error('Login failed: ', error)
    }
  }

  const register = async (email, password, username, firstName, lastName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      user.value = result.user

      // Create user in the backend using Fetch API
      const userPayload = {
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      }
      const response = await fetch('http://147.79.74.105:3000/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload),
      })
      const data = await response.json()
      if (response.ok) {
        userNumber.value = data.user_number
        console.log('User created in backend. User number: ', data.user_number)
      } else {
        console.error('Failed to create user in backend: ', data)
      }
    } catch (error) {
      console.error('Registration failed: ', error)
    }
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
    userNumber.value = null
  }

  // Create a promise that resolves when Firebase auth state is known
  const authReady = new Promise((resolve) => {
    auth.onAuthStateChanged((currentUser) => {
      user.value = currentUser
      isAuthResolved.value = true

      // If the user is authenticated, try to fetch userNumber from localStorage
      if (currentUser && !userNumber.value) {
        userNumber.value = localStorage.getItem('userNumber')
      }

      resolve()
    })
  })

  return { user, userNumber, login, logout, register, isAuthResolved, authReady }
})
