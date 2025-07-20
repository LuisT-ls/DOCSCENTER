// Importa a configuração e inicialização do Firebase
import { app, analytics } from './modules/auth/firebase.js'
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  onAuthChange
} from './modules/auth/auth.js'
