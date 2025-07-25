// Main Application Logic for #生成AIママ部

class GenAIMamaApp {
  constructor() {
    this.currentFilter = "all";
    this.currentSort = "likes";
    this.searchQuery = "";
    this.likedProducts = new Set();
    this.animationDelay = 0;

    this.init();
  }

  init() {
    // Check if required functions are available
    if (
      typeof getFeaturedProducts === "undefined" ||
      typeof getLatestNews === "undefined" ||
      typeof products === "undefined"
    ) {
      console.error("Required data functions not loaded. Retrying...");
      setTimeout(() => this.init(), 100);
      return;
    }

    this.loadLikedProducts();
    this.bindEvents();
    this.setupIntersectionObserver();

    // Initialize home page content by default
    setTimeout(() => {
      this.initializePage("home");
    }, 100);
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.debounceSearch();
      });

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleSearch();
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        this.handleSearch();
      });
    }

    // Filter tabs
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const filter = e.target.dataset.filter;
        this.setFilter(filter);
      });
    });

    // Sort dropdown
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.setSort(e.target.value);
      });
    }

    // Join buttons
    document.querySelectorAll("#join-btn, #hero-join-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleJoinClick();
      });
    });

    // Global keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !e.target.matches("input, textarea")) {
        e.preventDefault();
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.focus();
        }
      }

      if (e.key === "Escape") {
        const searchInput = document.getElementById("search-input");
        if (searchInput && document.activeElement === searchInput) {
          searchInput.blur();
          searchInput.value = "";
          this.searchQuery = "";
          this.renderProducts();
        }
      }
    });
  }

  // Debounced search
  debounceSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.handleSearch();
    }, 300);
  }

  handleSearch() {
    if (navigation && navigation.getCurrentPage() !== "products") {
      navigation.navigateToPage("products");
    }
    this.renderProducts();
  }

  setFilter(filter) {
    this.currentFilter = filter;

    // Update active tab
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.remove("active");
    });

    const activeTab = document.querySelector(`[data-filter="${filter}"]`);
    if (activeTab) {
      activeTab.classList.add("active");
    }

    this.renderProducts();
  }

  setSort(sort) {
    this.currentSort = sort;
    this.renderProducts();
  }

  handleJoinClick() {
    // Simulate Discord invite
    const discordInvite = "https://discord.gg/genai-mama";

    // Create a modal or show a message
    this.showJoinModal(discordInvite);
  }

  showJoinModal(inviteUrl) {
    // Simple alert for now - in production, this would be a proper modal
    alert(`Discordコミュニティへの参加はこちら: ${inviteUrl}`);
  }

  // Render featured products on home page
  renderFeaturedProducts() {
    const container = document.getElementById("featured-products-grid");
    if (!container) return;

    const featuredProducts = getFeaturedProducts();
    container.innerHTML = "";

    if (featuredProducts.length === 0) return;

    featuredProducts.forEach((product, index) => {
      const productCard = this.createProductCard(product, index * 100);
      container.appendChild(productCard);
    });
  }

  // Render latest news on home page
  renderLatestNews() {
    const container = document.getElementById("latest-news-grid");
    if (!container) return;

    const latestNews = getLatestNews(3);
    container.innerHTML = "";

    latestNews.forEach((newsItem, index) => {
      const newsCard = this.createNewsCard(newsItem, index * 100);
      container.appendChild(newsCard);
    });
  }

  // Render all products on products page
  renderProducts() {
    const container = document.getElementById("products-grid");
    if (!container) return;

    let filteredProducts = filterProducts(products, this.currentFilter);

    if (this.searchQuery) {
      filteredProducts = searchProducts(filteredProducts, this.searchQuery);
    }

    const sortedProducts = sortProducts(filteredProducts, this.currentSort);

    container.innerHTML = "";

    if (sortedProducts.length === 0) {
      container.innerHTML =
        '<div class="no-results">該当する成果物が見つかりませんでした。</div>';
      return;
    }

    sortedProducts.forEach((product, index) => {
      const productCard = this.createProductCard(product, index * 50);
      container.appendChild(productCard);
    });
  }

  // Render all news on news page
  renderNews() {
    const container = document.getElementById("news-grid");
    if (!container) return;

    container.innerHTML = "";

    news.forEach((newsItem, index) => {
      const newsCard = this.createNewsCard(newsItem, index * 100);
      container.appendChild(newsCard);
    });
  }

  // Create product card element
  createProductCard(product, delay = 0) {
    const card = document.createElement("div");
    card.className = "product-card animate-fade-in-up";
    card.style.animationDelay = `${delay}ms`;

    card.innerHTML = `
      <div class="product-header">
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${product.description}</p>
        </div>
      </div>
      
      <div class="product-tags">
        ${product.tags
          .map((tag) => `<span class="product-tag">${tag}</span>`)
          .join("")}
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

    // Add click event for the entire card
    card.addEventListener("click", () => {
      window.open(product.url, "_blank");
    });

    return card;
  }

  // Create news card element
  createNewsCard(newsItem, delay = 0) {
    const card = document.createElement("a");
    card.href = newsItem.url;
    card.target = "_blank";
    card.className = "news-card animate-fade-in-up";
    card.style.animationDelay = `${delay}ms`;

    card.innerHTML = `
      <h3 class="news-title">${newsItem.title}</h3>
      <p class="news-excerpt">${newsItem.excerpt}</p>
      <div class="news-date">${formatDate(newsItem.date)}</div>
    `;

    return card;
  }

  // Toggle like functionality
  toggleLike(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (this.likedProducts.has(productId)) {
      this.likedProducts.delete(productId);
      product.likes--;
    } else {
      this.likedProducts.add(productId);
      product.likes++;
    }

    // Update UI
    const likeBtn = document.querySelector(`[data-product-id="${productId}"]`);
    if (likeBtn) {
      const likeIcon = likeBtn.querySelector(".like-icon");
      const likeCount = likeBtn.querySelector(".like-count");

      if (this.likedProducts.has(productId)) {
        likeBtn.classList.add("liked");
        likeIcon.textContent = "❤️";
        this.animateLike(likeBtn);
      } else {
        likeBtn.classList.remove("liked");
        likeIcon.textContent = "🤍";
      }

      likeCount.textContent = product.likes;
    }

    // Save to localStorage
    this.saveLikedProducts();
  }

  // Animate like button
  animateLike(button) {
    button.style.transform = "scale(1.2)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 200);
  }

  // Animate statistics numbers
  animateStats() {
    const statNumbers = document.querySelectorAll(".stat-number");

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.dataset.count);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const counter = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(counter);
        } else {
          stat.textContent = Math.floor(current);
        }
      }, 16);
    });
  }

  // Setup intersection observer for animations
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px 0px",
      }
    );

    // Observe all cards
    document
      .querySelectorAll(".product-card, .news-card, .stat-card")
      .forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(card);
      });
  }

  // Save liked products to localStorage
  saveLikedProducts() {
    localStorage.setItem(
      "likedProducts",
      JSON.stringify([...this.likedProducts])
    );
  }

  // Load liked products from localStorage
  loadLikedProducts() {
    const saved = localStorage.getItem("likedProducts");
    if (saved) {
      this.likedProducts = new Set(JSON.parse(saved));
    }
  }

  // Initialize page-specific content
  initializePage(page) {
    switch (page) {
      case "home":
        this.renderFeaturedProducts();
        this.renderLatestNews();
        this.animateStats();
        break;
      case "products":
        this.renderProducts();
        break;
      case "news":
        this.renderNews();
        break;
    }
  }
}

// Initialize the app
let app;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    app = new GenAIMamaApp();
    window.app = app; // Make it globally available
  });
} else {
  app = new GenAIMamaApp();
  window.app = app;
}

// Add CSS for no results
if (!document.querySelector("#no-results-style")) {
  const style = document.createElement("style");
  style.id = "no-results-style";
  style.textContent = `
    .no-results {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--gray-500);
      font-size: 1.125rem;
      grid-column: 1 / -1;
    }
    
    .no-results::before {
      content: '🔍';
      display: block;
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
  `;
  document.head.appendChild(style);
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = GenAIMamaApp;
}
