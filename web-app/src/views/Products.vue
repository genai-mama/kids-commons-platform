<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '../stores/data'
import ProductCard from '../components/ProductCard-enhanced.vue'

const dataStore = useDataStore()

const searchQuery = ref('')
const selectedCategory = ref('all')
const sortBy = ref<'likes' | 'date' | 'title'>('likes')

const categories = computed(() => ['all', ...dataStore.categories])

const filteredProducts = computed(() => {
  let products = dataStore.products

  // Search filter
  if (searchQuery.value.trim()) {
    products = dataStore.searchProducts(searchQuery.value)
  }

  // Category filter
  products = dataStore.filterByCategory(selectedCategory.value)

  // Apply search filter to category results
  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase()
    products = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  return dataStore.sortProducts(products, sortBy.value)
})

const clearSearch = () => {
  searchQuery.value = ''
}

const handleCategoryChange = (category: string) => {
  selectedCategory.value = category
}

onMounted(() => {
  // Focus search on '/' key press
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      const searchInput = document.getElementById('search-input') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    }
    if (e.key === 'Escape') {
      clearSearch()
    }
  }

  document.addEventListener('keydown', handleKeyPress)

  return () => {
    document.removeEventListener('keydown', handleKeyPress)
  }
})
</script>

<template>
  <div class="products">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">成果物一覧</h1>
        <p class="hero-subtitle">
          ママたちが生成AIを活用して作成した様々なプロダクトをご紹介します
        </p>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-wrapper">
          <!-- Search Bar -->
          <div class="search-wrapper">
            <div class="search-bar">
              <input
                id="search-input"
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="成果物を検索... (/ キーでフォーカス)"
              />
              <button
                v-if="searchQuery"
                class="clear-btn"
                @click="clearSearch"
                aria-label="検索をクリア"
              >
                ✕
              </button>
              <div class="search-icon">🔍</div>
            </div>
            <div class="search-hint">
              💡 タイトル、説明、カテゴリ、タグで検索できます
            </div>
          </div>

          <!-- Category Filter -->
          <div class="category-filter">
            <h3 class="filter-title">カテゴリ</h3>
            <div class="category-buttons">
              <button
                v-for="category in categories"
                :key="category"
                class="category-btn"
                :class="{ active: selectedCategory === category }"
                @click="handleCategoryChange(category)"
              >
                {{ category === 'all' ? 'すべて' : category }}
              </button>
            </div>
          </div>

          <!-- Sort Options -->
          <div class="sort-options">
            <label for="sort-select" class="sort-label">並び順:</label>
            <select
              id="sort-select"
              v-model="sortBy"
              class="sort-select"
            >
              <option value="likes">いいね数順</option>
              <option value="date">新着順</option>
              <option value="title">タイトル順</option>
            </select>
          </div>
        </div>

        <!-- Results Info -->
        <div class="results-info">
          <span class="results-count">
            {{ filteredProducts.length }}件の成果物
          </span>
          <span v-if="searchQuery" class="search-term">
            「{{ searchQuery }}」の検索結果
          </span>
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="products-section">
      <div class="container">
        <div v-if="filteredProducts.length > 0" class="products-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">成果物が見つかりませんでした</h3>
          <p class="empty-description">
            検索条件を変更するか、カテゴリを「すべて」に設定してお試しください。
          </p>
          <button class="reset-btn" @click="searchQuery = ''; selectedCategory = 'all'">
            フィルターをリセット
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.products {
  animation: fadeIn 0.6s ease-out;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary-purple-lighter), var(--white));
  padding: var(--spacing-12) 0;
  text-align: center;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
  background: var(--purple-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

/* Filters Section */
.filters-section {
  padding: var(--spacing-8) 0;
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
}

.filters-wrapper {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--spacing-8);
  align-items: start;
  margin-bottom: var(--spacing-6);
}

.search-wrapper {
  flex: 1;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.search-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-12) var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  outline: none;
  transition: var(--transition-base);
}

.search-input:focus {
  border-color: var(--primary-purple);
  box-shadow: 0 0 0 3px rgba(155, 123, 216, 0.1);
}

.search-icon {
  position: absolute;
  right: var(--spacing-4);
  color: var(--gray-400);
  pointer-events: none;
}

.clear-btn {
  position: absolute;
  right: var(--spacing-10);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gray-400);
  font-size: var(--font-size-lg);
  padding: var(--spacing-1);
  transition: var(--transition-base);
}

.clear-btn:hover {
  color: var(--gray-600);
}

.search-hint {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  margin-top: var(--spacing-1);
}

.category-filter {
  min-width: 200px;
}

.filter-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: var(--spacing-3);
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.category-btn {
  background: var(--gray-100);
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-600);
  cursor: pointer;
  transition: var(--transition-base);
  white-space: nowrap;
}

.category-btn:hover {
  background: var(--gray-200);
}

.category-btn.active {
  background: var(--primary-purple);
  color: var(--white);
}

.sort-options {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.sort-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-700);
}

.sort-select {
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  background: var(--white);
  cursor: pointer;
}

.results-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

.results-count {
  font-weight: 600;
}

.search-term {
  color: var(--primary-purple-dark);
  font-weight: 500;
}

/* Products Section */
.products-section {
  padding: var(--spacing-8) 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-6);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-16) var(--spacing-4);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-4);
  opacity: 0.5;
}

.empty-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: var(--spacing-3);
}

.empty-description {
  font-size: var(--font-size-lg);
  color: var(--gray-500);
  margin-bottom: var(--spacing-6);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.reset-btn {
  background: var(--purple-gradient);
  color: var(--white);
  border: none;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Responsive */
@media (max-width: 768px) {
  .filters-wrapper {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  .category-buttons {
    justify-content: flex-start;
  }

  .sort-options {
    justify-content: flex-start;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  .results-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
}
</style>