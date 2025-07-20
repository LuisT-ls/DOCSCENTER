// Este arquivo assume que o Firebase foi carregado via CDN e está disponível em window.firebase
import { app } from './firebase.js'

const auth = window.firebase.auth.getAuth(app)
const googleProvider = new window.firebase.auth.GoogleAuthProvider()

// Login com Google
export async function loginWithGoogle() {
  try {
    const result = await window.firebase.auth.signInWithPopup(
      auth,
      googleProvider
    )
    return result.user
  } catch (error) {
    throw error
  }
}

// Login com Email/Senha
export async function loginWithEmail(email, password) {
  try {
    const result = await window.firebase.auth.signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return result.user
  } catch (error) {
    throw error
  }
}

// Cadastro com Email/Senha
export async function registerWithEmail(email, password) {
  try {
    const result = await window.firebase.auth.createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    return result.user
  } catch (error) {
    throw error
  }
}

// Logout
export async function logout() {
  try {
    await window.firebase.auth.signOut(auth)
  } catch (error) {
    throw error
  }
}

// Verifica usuário autenticado
export function onAuthChange(callback) {
  return window.firebase.auth.onAuthStateChanged(auth, callback)
}

export { auth }
