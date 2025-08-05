<template>
  <!-- Home Page - ヒーローセクション、統計、成果物、ニュース表示 -->
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">#生成AIママ部</h1>
        <p class="hero-subtitle">
          家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティです🎵<br>
          エンジニアでも、そうでなくても、経験問わずママさんなら大歓迎🙆‍♀️✨<br>
          ぜひみんなで生成AI活用していきましょう〜！
        </p>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats?.totalMembers || discordStats.memberCount || 127 }}</div>
            <div class="stat-label">アクティブメンバー</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats?.totalProducts || products.length }}</div>
            <div class="stat-label">成果物</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats?.activeDays || '---' }}</div>
            <div class="stat-label">活動日数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats?.totalLikes || '---' }}</div>
            <div class="stat-label">総いいね数</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Layout - 横幅が広いときは2列、狭いときは1列 -->
    <section class="main-content">
      <div class="container">
        <div class="content-layout">
          <div class="content-section">
            <!-- Featured Products Section -->
            <div class="section-header">
              <h2>注目の成果物</h2>
              <button class="btn-link" @click="$emit('navigate', 'products')">すべて見る →</button>
            </div>
            <div class="featured-products-grid">
              <div v-for="product in featuredProducts" :key="product.id" class="product-card featured">
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
                  <div class="product-footer">
                    <div class="product-author">
                      <div class="author-avatar">
                        <img :src="product.author.avatar || `https://via.placeholder.com/40/9B7BD8/FFFFFF?text=${product.author.name.charAt(0)}`" 
                             :alt="product.author.name" />
                      </div>
                      <div class="author-info">
                        <div class="author-name">{{ product.author.name }}</div>
                      </div>
                    </div>
                    <a v-if="product.url" :href="product.url" target="_blank" class="product-link">
                      <span>詳細</span>
                      <span class="link-icon">→</span>
                    </a>
                  </div>
                </div>
              </div>
              <div v-if="featuredProducts.length === 0" class="no-products">
                <p>注目の成果物を読み込み中...</p>
              </div>
            </div>
          </div>
          
          <div class="content-section">
            <!-- Latest News Section -->
            <div class="section-header">
              <h2>最新ニュース</h2>
              <button class="btn-link" @click="$emit('navigate', 'news')">すべて見る →</button>
            </div>
            <div class="latest-news-grid">
              <div v-for="newsItem in latestNews" :key="newsItem.id" class="news-card">
                <h3 class="news-title">{{ newsItem.title }}</h3>
                <p class="news-excerpt">{{ newsItem.excerpt }}</p>
                <div class="news-footer">
                  <div class="news-date">{{ formatDate(newsItem.date) }}</div>
                  <a v-if="newsItem.url" :href="newsItem.url" target="_blank" class="news-link">
                    <span>続きを読む</span>
                    <span class="link-icon">→</span>
                  </a>
                </div>
              </div>
              <div v-if="latestNews.length === 0" class="no-news">
                <p>最新ニュースを読み込み中...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props - 親コンポーネントから受け取るデータ
interface Props {
  products: any[]
  news: any[]
  members: any[]
  discordStats: {
    memberCount: number | null
    onlineCount?: number
    serverName?: string
    isLoading: boolean
    lastUpdated?: Date | null
    error: string | null
  }
  stats?: {
    totalMembers: number
    totalProducts: number
    activeDays: number
    totalLikes: number
  }
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
defineEmits<{
  navigate: [page: string]
}>()

// フィーチャードプロダクトと最新ニュースを取得
const featuredProducts = computed(() => {
  return props.products.filter(product => product.featured).slice(0, 6)
})

const latestNews = computed(() => {
  return props.news.slice(0, 3)
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
/* Home Page専用スタイル */
.home-page {
  width: 100%;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-pink) 100%);
  color: white;
  padding: var(--spacing-20) 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  margin-bottom: var(--spacing-6);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-10);
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: center;
  flex-wrap: wrap;
}

/* Stats Section */
.stats {
  padding: var(--spacing-20) 0;
  background: var(--gray-50);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-8);
  max-width: 1000px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--primary-purple);
  margin-bottom: var(--spacing-2);
}

.stat-label {
  font-size: var(--font-size-base);
  color: var(--gray-600);
  font-weight: 500;
}

/* Main Content */
.main-content {
  padding: var(--spacing-20) 0;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-12);
  max-width: 1400px;
  margin: 0 auto;
}

.content-section {
  min-width: 0; /* グリッドの幅制限 */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
}

.section-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-purple);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: color var(--transition-base);
}

.btn-link:hover {
  color: var(--primary-purple-dark);
  text-decoration: underline;
}

/* Featured Products Grid */
.featured-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

/* Product Card Styles */
.product-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-base);
  border: 1px solid var(--gray-200);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.product-card.featured {
  border: 2px solid var(--primary-purple);
  background: linear-gradient(135deg, var(--white) 0%, var(--primary-purple-lighter) 100%);
}

.product-image {
  position: relative;
  width: 100%;
  height: 180px;
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
  top: var(--spacing-2);
  right: var(--spacing-2);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-full);
  padding: var(--spacing-1) var(--spacing-2);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.product-content {
  padding: var(--spacing-4);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-2);
  gap: var(--spacing-2);
}

.product-title {
  font-size: var(--font-size-lg);
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
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
  font-weight: 500;
  white-space: nowrap;
}

.product-description {
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  margin-bottom: var(--spacing-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--gray-200);
}

.product-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.author-avatar {
  width: 32px;
  height: 32px;
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

.author-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-900);
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

/* News Grid */
.latest-news-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.news-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  transition: all var(--transition-base);
}

.news-card:hover {
  border-color: var(--primary-purple-light);
  box-shadow: var(--shadow-sm);
}

.news-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 var(--spacing-2) 0;
  line-height: 1.3;
}

.news-excerpt {
  color: var(--gray-600);
  font-size: var(--font-size-base);
  line-height: 1.5;
  margin-bottom: var(--spacing-3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--gray-200);
}

.news-date {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
}

.news-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--primary-purple);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color var(--transition-base);
}

.news-link:hover {
  color: var(--primary-purple-dark);
}

.news-link:hover .link-icon {
  transform: translateX(2px);
}

.no-products,
.no-news {
  text-align: center;
  padding: var(--spacing-12);
  color: var(--gray-500);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }
  
  .hero-subtitle {
    font-size: var(--font-size-lg);
  }
  
  .content-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-4);
  }
}
</style>