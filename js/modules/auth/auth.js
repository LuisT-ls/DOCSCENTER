// Importa as funções necessárias do Firebase Auth
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { app } from './firebase.js'

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Login com Google
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    throw error
  }
}

// Login com Email/Senha
export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    throw error
  }
}

// Cadastro com Email/Senha
export async function registerWithEmail(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    throw error
  }
}

// Logout
export async function logout() {
  try {
    await signOut(auth)
  } catch (error) {
    throw error
  }
}

// Verifica usuário autenticado
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

export { auth }
