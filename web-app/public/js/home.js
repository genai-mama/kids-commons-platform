// Home page functionality

// Initialize home page
function initializeHomePage() {
  console.log('Initializing home page...');
  
  // Check if data is available
  if (typeof products === 'undefined') {
    console.error('Products data not available');
    return;
  }
  if (typeof news === 'undefined') {
    console.error('News data not available');
    return;
  }
  if (typeof getFeaturedProducts === 'undefined') {
    console.error('getFeaturedProducts function not available');
    return;
  }
  if (typeof getLatestNews === 'undefined') {
    console.error('getLatestNews function not available');
    return;
  }
  
  renderFeaturedProducts();
  renderLatestNews();
}

// Render featured products
function renderFeaturedProducts() {
  console.log('Rendering featured products...');
  const container = document.getElementById('featured-products-grid');
  if (!container) {
    console.error('Featured products container not found');
    return;
  }

  const featuredProducts = getFeaturedProducts();
  console.log('Featured products:', featuredProducts);
  container.innerHTML = '';

  featuredProducts.forEach((product, index) => {
    const card = createProductCard(product);
    // Add animation delay
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('animate-fade-in-up');
    container.appendChild(card);
  });
}

// Render latest news
function renderLatestNews() {
  console.log('Rendering latest news...');
  const container = document.getElementById('latest-news-grid');
  if (!container) {
    console.error('Latest news container not found');
    return;
  }

  const latestNews = getLatestNews();
  console.log('Latest news:', latestNews);
  container.innerHTML = '';

  latestNews.forEach((newsItem, index) => {
    const card = createNewsCard(newsItem);
    // Add animation delay
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('animate-fade-in-up');
    container.appendChild(card);
  });
}

// Create product card
function createProductCard(product) {
  const card = document.createElement('a');
  card.href = product.url;
  card.target = '_blank';
  card.className = 'product-card';
  
  card.innerHTML = `
    <div class="product-header">
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.title}</h3>
      </div>
    </div>
    <p class="product-description">${product.description}</p>
    <div class="product-tags">
      ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
    </div>
    <div class="product-footer">
      <div class="product-author">
        <div class="author-avatar">${product.author.avatar}</div>
        <div class="author-info">
          <span class="author-name">${product.author.name}</span>
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// Create news card (compact version for sidebar)
function createNewsCard(newsItem) {
  const card = document.createElement('a');
  card.href = newsItem.url;
  card.target = '_blank';
  card.className = 'news-card';
  
  card.innerHTML = `
    <h3 class="news-title">${newsItem.title}</h3>
    <p class="news-excerpt">${newsItem.excerpt}</p>
    <span class="news-date">${formatDate(newsItem.date)}</span>
  `;
  
  return card;
}

// Initialize when DOM is loaded
console.log('home.js loaded, document ready state:', document.readyState);

if (document.readyState === 'loading') {
  console.log('Waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    initializeHomePage();
  });
} else {
  console.log('DOM already loaded, initializing immediately');
  initializeHomePage();
}