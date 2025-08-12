// Products page functionality

class ProductsPage {
  constructor() {
    this.currentFilter = 'all';
    this.currentSort = 'likes';
    this.searchQuery = '';
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.renderProducts();
  }
  
  bindEvents() {
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.handleFilterChange(e.target.dataset.filter);
      });
    });
    
    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.renderProducts();
      });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchQuery = e.target.value;
          this.renderProducts();
        }, 300);
      });
      
      // Handle enter key
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.searchQuery = e.target.value;
          this.renderProducts();
        }
      });
    }
    
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.searchQuery = searchInput.value;
        this.renderProducts();
      });
    }
  }
  
  handleFilterChange(filter) {
    this.currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    this.renderProducts();
  }
  
  renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    // Get filtered and sorted products
    let filteredProducts = this.currentFilter === 'all' 
      ? products 
      : filterProducts(products, this.currentFilter);
    
    // Apply search filter
    if (this.searchQuery) {
      filteredProducts = searchProducts(filteredProducts, this.searchQuery);
    }
    
    // Sort products
    const sortedProducts = sortProducts(filteredProducts, this.currentSort);
    
    // Clear container
    container.innerHTML = '';
    
    // Render products
    sortedProducts.forEach((product, index) => {
      const card = this.createProductCard(product);
      // Add animation delay
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-fade-in-up');
      container.appendChild(card);
    });
    
    // Show message if no products found
    if (sortedProducts.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <p>該当する成果物が見つかりませんでした</p>
        </div>
      `;
    }
  }
  
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
      <div class="product-header">
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${product.description}</p>
        </div>
      </div>
      
      <div class="product-tags">
        ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
      </div>
      
      <div class="product-footer">
        <div class="product-author">
          <div class="author-avatar">${product.author.avatar}</div>
          <div class="author-info">
            <div class="author-name">${product.author.name}</div>
          </div>
        </div>
      </div>
    `;
    
    card.addEventListener('click', () => {
      window.open(product.url, '_blank');
    });
    
    return card;
  }
}

// Initialize when DOM is loaded
let productsPage;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    productsPage = new ProductsPage();
  });
} else {
  productsPage = new ProductsPage();
}