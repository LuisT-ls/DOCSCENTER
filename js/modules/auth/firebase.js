// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC_B7hFIpd5xSDbGsTvQSeOv2_rf8FrLUI',
  authDomain: 'docscenter-80c00.firebaseapp.com',
  projectId: 'docscenter-80c00',
  storageBucket: 'docscenter-80c00.firebasestorage.app',
  messagingSenderId: '808134115023',
  appId: '1:808134115023:web:e09c170659076d818441ba',
  measurementId: 'G-YXDGL7VNVR'
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export { app, analytics }
