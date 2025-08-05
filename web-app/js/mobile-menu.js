// Mobile menu functionality

class MobileMenu {
  constructor() {
    this.mobileMenuOpen = false;
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      const nav = document.getElementById('nav');
      const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
      
      if (this.mobileMenuOpen && 
          !nav.contains(e.target) && 
          !mobileMenuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    const nav = document.getElementById('nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (nav && mobileMenuToggle) {
      nav.classList.add('active');
      mobileMenuToggle.classList.add('active');
      this.mobileMenuOpen = true;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
  }
  
  closeMobileMenu() {
    const nav = document.getElementById('nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (nav && mobileMenuToggle) {
      nav.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      this.mobileMenuOpen = false;
      
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }
}

// Initialize mobile menu when DOM is loaded
let mobileMenu;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    mobileMenu = new MobileMenu();
  });
} else {
  mobileMenu = new MobileMenu();
}