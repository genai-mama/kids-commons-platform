// Navigation System for SPA

class Navigation {
  constructor() {
    this.currentPage = 'home';
    this.pages = ['home', 'about', 'products', 'news'];
    this.mobileMenuOpen = false;
    this.mobileSearchOpen = false;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.initializeFromURL();
  }
  
  bindEvents() {
    // Navigation links
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        console.log('Link clicked:', page);
        this.navigateToPage(page);
      });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }
    
    // Mobile search toggle
    const searchToggle = document.getElementById('search-toggle');
    if (searchToggle) {
      searchToggle.addEventListener('click', () => {
        this.toggleMobileSearch();
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
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.navigateToPage(e.state.page, false);
      }
    });
    
    // Handle hash changes
    window.addEventListener('hashchange', () => {
      this.initializeFromURL();
    });
  }
  
  initializeFromURL() {
    const hash = window.location.hash.substring(1);
    if (hash && this.pages.includes(hash)) {
      this.navigateToPage(hash, false);
    }
  }
  
  navigateToPage(page, updateHistory = true) {
    console.log('Navigating to page:', page, 'Current page:', this.currentPage);
    if (!this.pages.includes(page) || page === this.currentPage) {
      console.log('Navigation cancelled - invalid page or same page');
      return;
    }
    
    // Hide current page
    const currentPageElement = document.getElementById(`page-${this.currentPage}`);
    if (currentPageElement) {
      currentPageElement.classList.remove('active');
    }
    
    // Show new page
    const newPageElement = document.getElementById(`page-${page}`);
    if (newPageElement) {
      newPageElement.classList.add('active');
    } else {
      console.error('Page element not found:', `page-${page}`);
    }
    
    // Update navigation active state
    this.updateActiveNavLink(page);
    
    // Update URL
    if (updateHistory) {
      const url = page === 'home' ? '/' : `/#${page}`;
      history.pushState({ page }, '', url);
    }
    
    // Update current page
    this.currentPage = page;
    
    // Close mobile menu
    this.closeMobileMenu();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Initialize page-specific functionality
    this.initializePage(page);
  }
  
  updateActiveNavLink(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current page link(s)
    document.querySelectorAll(`.nav-link[data-page="${page}"]`).forEach(link => {
      link.classList.add('active');
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
  
  toggleMobileSearch() {
    if (this.mobileSearchOpen) {
      this.closeMobileSearch();
    } else {
      this.openMobileSearch();
    }
  }
  
  openMobileSearch() {
    const searchBar = document.querySelector('.search-bar');
    const searchToggle = document.getElementById('search-toggle');
    
    if (searchBar && searchToggle) {
      searchBar.classList.add('mobile-active');
      searchToggle.classList.add('active');
      this.mobileSearchOpen = true;
      
      // Focus on search input
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
    }
  }
  
  closeMobileSearch() {
    const searchBar = document.querySelector('.search-bar');
    const searchToggle = document.getElementById('search-toggle');
    
    if (searchBar && searchToggle) {
      searchBar.classList.remove('mobile-active');
      searchToggle.classList.remove('active');
      this.mobileSearchOpen = false;
    }
  }
  
  initializePage(page) {
    switch (page) {
      case 'home':
        if (window.app) {
          window.app.renderFeaturedProducts();
          window.app.renderLatestNews();
          window.app.animateStats();
        }
        break;
      case 'products':
        if (window.app) {
          window.app.renderProducts();
        }
        break;
      case 'news':
        if (window.app) {
          window.app.renderNews();
        }
        break;
      case 'about':
        // About page doesn't need special initialization
        break;
    }
  }
  
  // Utility method to get current page
  getCurrentPage() {
    return this.currentPage;
  }
  
  // Utility method to check if mobile menu is open
  isMobileMenuOpen() {
    return this.mobileMenuOpen;
  }
}

// Initialize navigation when DOM is loaded
let navigation;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    navigation = new Navigation();
  });
} else {
  navigation = new Navigation();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}