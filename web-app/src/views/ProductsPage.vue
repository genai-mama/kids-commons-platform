<template>
  <!-- Products Page - 成果物一覧とフィルター機能 -->
  <div class="products-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">成果物一覧</h1>
      </div>

      <div class="products-content">
        <!-- Filters - レスポンシブ対応 -->
        <div class="filters">
          <div class="filters-inner">
            <div class="filter-tabs">
              <button
                v-for="category in (categories || defaultCategories)"
                :key="category.id"
                class="filter-tab"
                :class="{ active: activeFilter === category.id }"
                @click="$emit('filter-change', category.id)"
              >
                {{ category.name }}
              </button>
            </div>

            <div class="sort-section">
              <div class="sort-options">
                <select
                  class="sort-select"
                  :value="currentSort"
                  @change="$emit('sort-change', ($event.target as HTMLSelectElement).value)"
                >
                  <option value="likes">いいね数順</option>
                  <option value="comments">コメント数順</option>
                  <option value="date">新着順</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" v-if="filteredAndSortedProducts.length > 0">
          <div v-for="product in filteredAndSortedProducts" :key="product.id" class="product-card">
            <div class="product-image">
              <img :src="product.thumbnail || product.image || `https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=${encodeURIComponent(product.title)}`" 
                   :alt="product.title" />
              <div class="product-likes">
                <span class="like-icon">❤️</span>
                <span class="like-count">{{ product.likes || 0 }}</span>
              </div>
            </div>
            <div class="product-content">
              <div class="product-header">
                <h3 class="product-title">{{ product.title }}</h3>
                <span class="product-category">{{ product.category }}</span>
              </div>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-tags" v-if="product.tags && product.tags.length > 0">
                <span v-for="tag in product.tags" :key="tag" class="product-tag">{{ tag }}</span>
              </div>
              <div class="product-footer">
                <div class="product-author">
                  <div class="author-avatar">
                    <img :src="product.author.avatar || `https://via.placeholder.com/40/9B7BD8/FFFFFF?text=${product.author.name.charAt(0)}`" 
                         :alt="product.author.name" />
                  </div>
                  <div class="author-info">
                    <div class="author-name">{{ product.author.name }}</div>
                    <div class="product-date">{{ formatDate(product.date) }}</div>
                  </div>
                </div>
                <a v-if="product.url" :href="product.url" target="_blank" class="product-link">
                  <span>詳細を見る</span>
                  <span class="link-icon">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="products.length === 0" class="no-products">
          <p>成果物データを読み込み中...</p>
        </div>
        <div v-else class="no-products">
          <p>該当する成果物が見つかりませんでした。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props - 親コンポーネントから受け取るデータ
interface Props {
  products: any[]
  categories?: Array<{
    id: string
    name: string
    count: number
  }>
  activeFilter: string
  currentSort: string
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
defineEmits<{
  'filter-change': [filter: string]
  'sort-change': [sort: string]
  navigate: [page: string]
}>()

// Default categories fallback
const defaultCategories = [
  { id: "all", name: "すべて", count: 0 },
  { id: "仕事効率化", name: "仕事効率化", count: 0 },
  { id: "学校", name: "学校", count: 0 },
  { id: "コミュニケーション", name: "コミュニケーション", count: 0 },
  { id: "学習", name: "学習", count: 0 }
]

// フィルタリングとソート処理
const filteredAndSortedProducts = computed(() => {
  let filtered = props.products || []
  
  // カテゴリフィルタリング
  if (props.activeFilter && props.activeFilter !== 'all') {
    filtered = filtered.filter(product => product.category === props.activeFilter)
  }
  
  // ソート処理
  const sorted = [...filtered]
  switch (props.currentSort) {
    case 'likes':
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    case 'date':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
})

// 日付フォーマット関数
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* Products Page専用スタイル */
.products-page {
  padding: var(--spacing-20) 0;
  min-height: 80vh;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-16);
}

.page-header h1 {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
}

.page-header p {
  font-size: var(--font-size-xl);
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.products-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Filters */
.filters {
  margin-bottom: var(--spacing-12);
}

.filters-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.filter-tab {
  padding: var(--spacing-3) var(--spacing-6);
  border: 2px solid var(--gray-200);
  background: var(--white);
  color: var(--gray-700);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.filter-tab:hover {
  border-color: var(--primary-purple-light);
  color: var(--primary-purple);
}

.filter-tab.active {
  background: var(--primary-purple);
  color: var(--white);
  border-color: var(--primary-purple);
}

.category-count {
  margin-left: var(--spacing-1);
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

/* Sort Section */
.sort-section {
  flex-shrink: 0;
}

.sort-options {
  display: flex;
  align-items: center;
}

.sort-select {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: var(--white);
  font-size: var(--font-size-sm);
  cursor: pointer;
  min-width: 120px;
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary-purple);
  box-shadow: 0 0 0 3px rgba(155, 123, 216, 0.1);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-8);
}

/* Product Card Styles */
.product-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-base);
  border: 1px solid var(--gray-200);
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-likes {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-full);
  padding: var(--spacing-2) var(--spacing-3);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.like-icon {
  font-size: var(--font-size-base);
}

.product-content {
  padding: var(--spacing-6);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-3);
  gap: var(--spacing-3);
}

.product-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.product-category {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple-dark);
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-weight: 500;
  white-space: nowrap;
}

.product-description {
  color: var(--gray-600);
  font-size: var(--font-size-base);
  line-height: 1.5;
  margin-bottom: var(--spacing-4);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
}

.product-tag {
  background: var(--gray-100);
  color: var(--gray-700);
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-md);
  font-weight: 500;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

.product-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--white);
  box-shadow: var(--shadow-sm);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-900);
  margin-bottom: var(--spacing-1);
}

.product-date {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
}

.product-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--primary-purple);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color var(--transition-base);
}

.product-link:hover {
  color: var(--primary-purple-dark);
}

.link-icon {
  transition: transform var(--transition-base);
}

.product-link:hover .link-icon {
  transform: translateX(2px);
}

.no-products {
  text-align: center;
  padding: var(--spacing-20);
  color: var(--gray-500);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .products-page {
    padding: var(--spacing-12) 0;
  }
  
  .page-header h1 {
    font-size: var(--font-size-3xl);
  }
  
  .page-header p {
    font-size: var(--font-size-lg);
  }
  
  .filters-inner {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-2);
    width: 100%;
    justify-content: stretch;
    margin-bottom: var(--spacing-4);
  }
  
  .filter-tab {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-xs);
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
}
</style>