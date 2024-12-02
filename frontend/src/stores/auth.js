// src/stores/auth.js
import { defineStore } from 'pinia'
import { auth } from '../firebase'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthResolved = ref(false)

  const login = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
  }

  // Create a promise that resolves when Firebase auth state is known
  const authReady = new Promise((resolve) => {
    auth.onAuthStateChanged((currentUser) => {
      user.value = currentUser
      isAuthResolved.value = true
      resolve()
    })
  })

  return { user, login, logout, isAuthResolved, authReady }
})
