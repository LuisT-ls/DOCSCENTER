// Importa a configuração e inicialização do Firebase
import { app, analytics } from './modules/auth/firebase.js'
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  onAuthChange
} from './modules/auth/auth.js'

document.addEventListener('DOMContentLoaded', () => {
  const googleBtn = document.getElementById('google-login-btn')
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      const spinner = document.getElementById('loading-spinner')
      if (spinner) spinner.classList.remove('d-none')
      try {
        const user = await loginWithGoogle()
        // Fechar modal de login
        const modal = document.getElementById('loginModal')
        if (modal) {
          const bsModal = window.bootstrap
            ? window.bootstrap.Modal.getInstance(modal)
            : null
          if (bsModal) bsModal.hide()
        }
        // Exibir toast de sucesso
        showToast('Login com Google realizado com sucesso!', 'success')
      } catch (err) {
        showToast('Erro ao logar com Google: ' + (err.message || err), 'danger')
      } finally {
        if (spinner) spinner.classList.add('d-none')
      }
    })
  }

  // Alternar entre modais
  const loginLink = document.getElementById('login-link')
  if (loginLink) {
    loginLink.addEventListener('click', e => {
      e.preventDefault()
      const registerModal = document.getElementById('registerModal')
      const loginModal = document.getElementById('loginModal')
      if (registerModal && window.bootstrap) {
        const bsRegister =
          window.bootstrap.Modal.getInstance(registerModal) ||
          new window.bootstrap.Modal(registerModal)
        bsRegister.hide()
      }
      if (loginModal && window.bootstrap) {
        const bsLogin =
          window.bootstrap.Modal.getInstance(loginModal) ||
          new window.bootstrap.Modal(loginModal)
        bsLogin.show()
      }
    })
  }

  // Cadastro
  const registerForm = document.getElementById('register-form')
  if (registerForm) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault()
      const name = document.getElementById('register-name').value.trim()
      const email = document.getElementById('register-email').value.trim()
      const password = document.getElementById('register-password').value
      const password2 = document.getElementById('register-password2').value
      if (password !== password2) {
        showToast('As senhas não coincidem.', 'danger')
        return
      }
      const spinner = document.getElementById('loading-spinner')
      if (spinner) spinner.classList.remove('d-none')
      try {
        const user = await registerWithEmail(email, password)
        // Atualizar nome do usuário
        if (user && name) {
          await window.firebase.auth.updateProfile(user, { displayName: name })
        }
        showToast('Cadastro realizado com sucesso!', 'success')
        // Fechar modal de cadastro
        const registerModal = document.getElementById('registerModal')
        if (registerModal && window.bootstrap) {
          const bsRegister =
            window.bootstrap.Modal.getInstance(registerModal) ||
            new window.bootstrap.Modal(registerModal)
          bsRegister.hide()
        }
      } catch (err) {
        showToast('Erro ao cadastrar: ' + (err.message || err), 'danger')
      } finally {
        if (spinner) spinner.classList.add('d-none')
      }
    })
  }
})

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container')
  if (!container) return
  const toast = document.createElement('div')
  toast.className = `toast align-items-center text-bg-${type} border-0 show`
  toast.role = 'alert'
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`
  container.appendChild(toast)
  setTimeout(() => toast.remove(), 4000)
}

// Atualiza a interface do usuário conforme o estado de autenticação
function updateUserUI(user) {
  const navbar = document.querySelector('.navbar .d-flex.align-items-center')
  if (!navbar) return
  // Remove elementos antigos
  navbar.innerHTML = ''
  // Botão de tema sempre visível
  const themeBtn = document.createElement('button')
  themeBtn.className = 'btn btn-outline-light me-2'
  themeBtn.id = 'theme-toggle'
  themeBtn.setAttribute('aria-label', 'Alternar tema')
  themeBtn.innerHTML = '<i class="fas fa-moon" id="theme-icon"></i>'
  navbar.appendChild(themeBtn)
  if (user) {
    // Usuário autenticado
    const avatar = document.createElement('img')
    avatar.src =
      user.photoURL ||
      'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(user.displayName || user.email)
    avatar.alt = 'Avatar'
    avatar.style.width = '32px'
    avatar.style.height = '32px'
    avatar.style.borderRadius = '50%'
    avatar.style.objectFit = 'cover'
    avatar.className = 'me-2'
    const nameSpan = document.createElement('span')
    nameSpan.textContent = user.displayName || user.email
    nameSpan.className = 'me-3 text-white fw-semibold'
    const logoutBtn = document.createElement('button')
    logoutBtn.className = 'btn btn-outline-light'
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt me-1"></i>Sair'
    logoutBtn.onclick = async () => {
      await logout()
      showToast('Logout realizado com sucesso!', 'success')
    }
    navbar.appendChild(avatar)
    navbar.appendChild(nameSpan)
    navbar.appendChild(logoutBtn)
  } else {
    // Não autenticado
    const loginBtn = document.createElement('button')
    loginBtn.className = 'btn btn-success'
    loginBtn.setAttribute('data-bs-toggle', 'modal')
    loginBtn.setAttribute('data-bs-target', '#loginModal')
    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-1"></i>Entrar'
    navbar.appendChild(loginBtn)
  }
}

// Escuta mudanças de autenticação
onAuthChange(updateUserUI)

// Darkmode global
function setDarkMode(enabled) {
  const body = document.body
  if (enabled) {
    body.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
    setThemeIcon('dark')
  } else {
    body.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
    setThemeIcon('light')
  }
}

function setThemeIcon(theme) {
  const icon = document.getElementById('theme-icon')
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
  }
}

function initDarkMode() {
  // Detecta preferência salva ou do sistema
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  setDarkMode(saved === 'dark' || (!saved && prefersDark))

  document.addEventListener('click', e => {
    const btn = e.target.closest('#theme-toggle')
    if (btn) {
      const isDark = document.body.classList.contains('dark-mode')
      setDarkMode(!isDark)
    }
  })
}

initDarkMode()

// Ao atualizar UI do usuário, manter o botão de tema funcional
const origUpdateUserUI = updateUserUI
updateUserUI = function (user) {
  origUpdateUserUI(user)
  // Garante que o botão de tema continue funcionando após troca de UI
  initDarkMode()
}

// Função para salvar metadados no Firestore
async function salvarDocumentoFirestore(dados) {
  const db = window.firebase.firestore.getFirestore(window.firebaseApp)
  const docRef = window.firebase.firestore.collection(db, 'documentos')
  await window.firebase.firestore.addDoc(docRef, dados)
}

// Upload de documentos para o Firebase Storage
function setupUploadForm() {
  const uploadForm = document.getElementById('upload-form')
  const fileInput = document.getElementById('file-input')
  const previewDiv = document.createElement('div')
  previewDiv.id = 'file-preview'
  previewDiv.className = 'mb-3'
  fileInput.parentNode.insertBefore(previewDiv, fileInput.nextSibling)

  // Pré-visualização do arquivo
  fileInput.addEventListener('change', () => {
    previewDiv.innerHTML = ''
    const file = fileInput.files[0]
    if (!file) return
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img')
      img.src = URL.createObjectURL(file)
      img.style.maxWidth = '200px'
      img.style.maxHeight = '200px'
      img.onload = () => URL.revokeObjectURL(img.src)
      previewDiv.appendChild(img)
    } else if (file.type === 'application/pdf') {
      const pdfIcon = document.createElement('i')
      pdfIcon.className = 'fas fa-file-pdf fa-3x text-danger'
      previewDiv.appendChild(pdfIcon)
      const span = document.createElement('span')
      span.textContent = ' ' + file.name
      previewDiv.appendChild(span)
    } else {
      const fileIcon = document.createElement('i')
      fileIcon.className = 'fas fa-file-alt fa-3x text-primary'
      previewDiv.appendChild(fileIcon)
      const span = document.createElement('span')
      span.textContent = ' ' + file.name
      previewDiv.appendChild(span)
    }
  })

  if (!uploadForm) return
  uploadForm.addEventListener('submit', async e => {
    e.preventDefault()
    const spinner = document.getElementById('loading-spinner')
    if (spinner) spinner.classList.remove('d-none')
    try {
      // Pega os campos do formulário
      const curso = document.getElementById('course-select').value
      const disciplina = document.getElementById('subject-input').value
      const tipo = document.getElementById('doc-type').value
      const titulo = document.getElementById('doc-title').value
      const descricao = document.getElementById('doc-description').value
      const file = fileInput.files[0]
      if (!file) throw new Error('Selecione um arquivo para enviar.')
      // Verifica se usuário está logado
      const user = window.firebase.auth.getAuth(window.firebaseApp).currentUser
      if (!user)
        throw new Error('Você precisa estar logado para enviar documentos.')
      // Caminho no Storage
      const storage = window.firebase.storage.getStorage(window.firebaseApp)
      const filePath = `documentos/${curso}/${disciplina}/${Date.now()}-${
        file.name
      }`
      const storageRef = window.firebase.storage.ref(storage, filePath)
      // Faz upload
      await window.firebase.storage.uploadBytes(storageRef, file)
      // Pega a URL de download
      const url = await window.firebase.storage.getDownloadURL(storageRef)
      // Salva metadados no Firestore
      await salvarDocumentoFirestore({
        curso,
        disciplina,
        tipo,
        titulo,
        descricao,
        url,
        uploadedBy: user.uid,
        uploaderName: user.displayName || user.email,
        createdAt: window.firebase.firestore.serverTimestamp()
      })
      showToast('Documento enviado com sucesso!', 'success')
      uploadForm.reset()
      previewDiv.innerHTML = ''
    } catch (err) {
      showToast('Erro ao enviar documento: ' + (err.message || err), 'danger')
    } finally {
      if (spinner) spinner.classList.add('d-none')
    }
  })
}
setupUploadForm()

// Botão de voltar ao topo
function setupBackToTop() {
  const btn = document.getElementById('backToTop')
  if (!btn) return
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible')
    } else {
      btn.classList.remove('visible')
    }
  })
  btn.addEventListener('click', e => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
setupBackToTop()
