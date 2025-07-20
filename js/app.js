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
