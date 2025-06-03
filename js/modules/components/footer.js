/* ===================================
   FOOTER FUNCTIONALITY - DOCSCENTER
   Arquivo: footer.js
   =================================== */

class FooterManager {
  constructor() {
    this.init()
  }

  init() {
    this.initBackToTop()
    this.initNewsletter()
    this.initStatsAnimation()
    this.updateFooterStats()
  }

  // Back to Top Button
  initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop')

    if (!backToTopBtn) return

    // Show/Hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show')
      } else {
        backToTopBtn.classList.remove('show')
      }
    })

    // Smooth scroll to top
    backToTopBtn.addEventListener('click', e => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }

  // Newsletter Subscription
  initNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form')

    if (!newsletterForm) return

    newsletterForm.addEventListener('submit', async e => {
      e.preventDefault()

      const emailInput = newsletterForm.querySelector('input[type="email"]')
      const submitBtn = newsletterForm.querySelector('button[type="submit"]')
      const email = emailInput.value.trim()

      if (!this.validateEmail(email)) {
        this.showToast('Por favor, insira um e-mail válido', 'error')
        return
      }

      // Disable button and show loading
      const originalText = submitBtn.innerHTML
      submitBtn.disabled = true
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin me-1"></i> Inscrevendo...'

      try {
        // Simulate API call
        await this.subscribeNewsletter(email)

        this.showToast('Inscrição realizada com sucesso!', 'success')
        emailInput.value = ''

        // Update button text temporarily
        submitBtn.innerHTML = '<i class="fas fa-check me-1"></i> Inscrito!'

        setTimeout(() => {
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
        }, 2000)
      } catch (error) {
        this.showToast('Erro ao realizar inscrição. Tente novamente.', 'error')
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }
    })
  }

  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Newsletter subscription (simulate API call)
  async subscribeNewsletter(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        Math.random() > 0.1 ? resolve() : reject()
      }, 1500)
    })
  }

  // Update footer statistics
  updateFooterStats() {
    // Get stats from main page or API
    const mainStats = {
      docs: document.getElementById('total-docs')?.textContent || '0',
      downloads: document.getElementById('total-downloads')?.textContent || '0',
      users: document.getElementById('total-users')?.textContent || '0'
    }

    // Update footer stats
    const footerDocs = document.getElementById('footer-total-docs')
    const footerDownloads = document.getElementById('footer-total-downloads')
    const footerUsers = document.getElementById('footer-total-users')

    if (footerDocs) footerDocs.textContent = mainStats.docs
    if (footerDownloads) footerDownloads.textContent = mainStats.downloads
    if (footerUsers) footerUsers.textContent = mainStats.users
  }

  // Animate statistics on scroll
  initStatsAnimation() {
    const statsSection = document.querySelector('.footer-stats')
    if (!statsSection) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStats()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(statsSection)
  }

  // Animate statistics numbers
  animateStats() {
    const statNumbers = document.querySelectorAll('.footer-stats .stat-number')

    statNumbers.forEach(stat => {
      const target = parseInt(stat.textContent) || 0
      const duration = 2000 // 2 seconds
      const start = performance.now()
      const startValue = 0

      const animate = currentTime => {
        const elapsed = currentTime - start
        const progress = Math.min(elapsed / duration, 1)

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(startValue + target * easeOutQuart)

        stat.textContent = currentValue.toLocaleString()

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          stat.textContent = target.toLocaleString()
        }
      }

      requestAnimationFrame(animate)
    })
  }

  // Toast notification system
  showToast(message, type = 'info') {
    const toastContainer =
      document.getElementById('toast-container') || this.createToastContainer()

    const toast = document.createElement('div')
    toast.className = `toast align-items-center text-white bg-${
      type === 'error' ? 'danger' : 'success'
    } border-0`
    toast.setAttribute('role', 'alert')
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas fa-${
            type === 'error' ? 'exclamation-circle' : 'check-circle'
          } me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `

    toastContainer.appendChild(toast)

    const bsToast = new bootstrap.Toast(toast)
    bsToast.show()

    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove()
    })
  }

  // Create toast container if it doesn't exist
  createToastContainer() {
    const container = document.createElement('div')
    container.id = 'toast-container'
    container.className = 'toast-container position-fixed top-0 end-0 p-3'
    container.style.zIndex = '9999'
    document.body.appendChild(container)
    return container
  }

  // Social media sharing functionality
  initSocialSharing() {
    const socialLinks = document.querySelectorAll('.social-link')

    socialLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()

        const icon = link.querySelector('i')
        const url = window.location.href
        const title = document.title

        if (icon.classList.contains('fa-facebook-f')) {
          this.openShareWindow(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`
          )
        } else if (icon.classList.contains('fa-linkedin-in')) {
          this.openShareWindow(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`
          )
        } else if (icon.classList.contains('fa-whatsapp')) {
          this.openShareWindow(
            `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`
          )
        } else if (icon.classList.contains('fa-github')) {
          window.open('https://github.com/docscenter', '_blank')
        } else if (icon.classList.contains('fa-instagram')) {
          window.open('https://instagram.com/docscenter', '_blank')
        }
      })
    })
  }

  // Open social share window
  openShareWindow(url) {
    const width = 600
    const height = 400
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    window.open(
      url,
      'share',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    )
  }

  // Lazy load footer content
  initLazyLoading() {
    const footerElements = document.querySelectorAll(
      '.footer-content [data-lazy]'
    )

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target
          const src = element.dataset.lazy

          if (element.tagName === 'IMG') {
            element.src = src
          } else {
            element.style.backgroundImage = `url(${src})`
          }

          element.removeAttribute('data-lazy')
          observer.unobserve(element)
        }
      })
    })

    footerElements.forEach(el => observer.observe(el))
  }

  // Contact form functionality
  initContactForm() {
    const contactForm = document.getElementById('contact-form')
    if (!contactForm) return

    contactForm.addEventListener('submit', async e => {
      e.preventDefault()

      const formData = new FormData(contactForm)
      const data = Object.fromEntries(formData)

      try {
        await this.sendContactMessage(data)
        this.showToast('Mensagem enviada com sucesso!', 'success')
        contactForm.reset()
      } catch (error) {
        this.showToast('Erro ao enviar mensagem. Tente novamente.', 'error')
      }
    })
  }

  // Send contact message (simulate API call)
  async sendContactMessage(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.1 ? resolve() : reject()
      }, 1000)
    })
  }

  // Initialize accessibility features
  initAccessibility() {
    // Add keyboard navigation for footer links
    const footerLinks = document.querySelectorAll(
      '.footer-links a, .social-link'
    )

    footerLinks.forEach(link => {
      link.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          link.click()
        }
      })
    })

    // Add focus indicators
    const focusableElements = document.querySelectorAll(
      '.main-footer button, .main-footer a, .main-footer input'
    )

    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid #3b82f6'
        element.style.outlineOffset = '2px'
      })

      element.addEventListener('blur', () => {
        element.style.outline = ''
        element.style.outlineOffset = ''
      })
    })
  }

  // Track footer interactions
  trackFooterInteractions() {
    const trackableElements = document.querySelectorAll(
      '.footer-links a, .social-link, .newsletter-form button'
    )

    trackableElements.forEach(element => {
      element.addEventListener('click', e => {
        const action = this.getTrackingAction(element)

        // Send to analytics (example with Google Analytics)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'footer_interaction', {
            event_category: 'Footer',
            event_label: action,
            value: 1
          })
        }

        // Console log for development
        console.log('Footer interaction:', action)
      })
    })
  }

  // Get tracking action name
  getTrackingAction(element) {
    if (element.classList.contains('social-link')) {
      const icon = element.querySelector('i')
      if (icon.classList.contains('fa-facebook-f')) return 'social_facebook'
      if (icon.classList.contains('fa-instagram')) return 'social_instagram'
      if (icon.classList.contains('fa-linkedin-in')) return 'social_linkedin'
      if (icon.classList.contains('fa-github')) return 'social_github'
      if (icon.classList.contains('fa-whatsapp')) return 'social_whatsapp'
      return 'social_unknown'
    }

    if (element.closest('.newsletter-form')) {
      return 'newsletter_subscribe'
    }

    return (
      element.textContent?.trim().toLowerCase().replace(/\s+/g, '_') ||
      'unknown_link'
    )
  }

  // Update footer based on user preferences
  updateFooterPreferences() {
    const savedTheme = localStorage.getItem('theme')
    const footer = document.querySelector('.main-footer')

    if (savedTheme === 'dark') {
      footer?.classList.add('dark-theme')
    }
  }

  // Initialize responsive behavior
  initResponsiveBehavior() {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      const socialLinks = document.querySelector('.social-links')

      if (socialLinks) {
        if (isMobile) {
          socialLinks.style.justifyContent = 'center'
        } else {
          socialLinks.style.justifyContent = 'flex-start'
        }
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial call
  }

  // Performance optimization
  optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout
    const originalScrollHandler = window.onscroll

    window.onscroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (originalScrollHandler) originalScrollHandler()
      }, 10)
    }

    // Preload critical footer resources
    this.preloadResources()
  }

  // Preload resources
  preloadResources() {
    const criticalImages = [
      // Add any critical footer images here
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }

  // Initialize all footer functionality
  initializeAll() {
    this.initSocialSharing()
    this.initLazyLoading()
    this.initContactForm()
    this.initAccessibility()
    this.trackFooterInteractions()
    this.updateFooterPreferences()
    this.initResponsiveBehavior()
    this.optimizePerformance()
  }
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const footerManager = new FooterManager()
  footerManager.initializeAll()
})

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FooterManager
}
