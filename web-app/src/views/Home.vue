<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '../stores/data'
import ProductCard from '../components/ProductCard-enhanced.vue'

const dataStore = useDataStore()

const featuredProducts = computed(() => dataStore.featuredProducts)
const stats = computed(() => dataStore.stats)
const latestNews = computed(() => dataStore.latestNews)
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">
          生成AIで変わる<br />ママの新しい働き方
        </h1>
        <p class="hero-subtitle">
          家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティ。
          みんなで作った成果物をProduct Hunt風に紹介します。
        </p>
        <a href="https://discord.gg/genai-mama" class="hero-cta" target="_blank">
          <span>💬</span>
          コミュニティに参加する
        </a>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalMembers.toLocaleString() }}</div>
            <div class="stat-label">メンバー数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalProducts }}</div>
            <div class="stat-label">成果物</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalCategories }}</div>
            <div class="stat-label">カテゴリ</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.avgLikes }}</div>
            <div class="stat-label">平均いいね</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">注目の成果物</h2>
          <p class="section-subtitle">
            コミュニティで特に人気の高い成果物をご紹介します
          </p>
        </div>
        <div class="products-grid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <div class="section-cta">
          <RouterLink to="/products" class="cta-button">
            すべての成果物を見る
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Latest News Section -->
    <section class="news-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">最新ニュース</h2>
          <p class="section-subtitle">
            コミュニティの最新情報をお届けします
          </p>
        </div>
        <div class="news-grid">
          <article
            v-for="newsItem in latestNews"
            :key="newsItem.id"
            class="news-card"
          >
            <img
              :src="newsItem.thumbnail"
              :alt="newsItem.title"
              class="news-thumbnail"
            />
            <div class="news-content">
              <div class="news-meta">
                <span class="news-category">{{ newsItem.category }}</span>
                <time class="news-date">{{ newsItem.date }}</time>
              </div>
              <h3 class="news-title">{{ newsItem.title }}</h3>
              <p class="news-summary">{{ newsItem.summary }}</p>
            </div>
          </article>
        </div>
        <div class="section-cta">
          <RouterLink to="/news" class="cta-button">
            すべてのニュースを見る
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  animation: fadeIn 0.6s ease-out;
}

/* Stats Section */
.stats-section {
  padding: var(--spacing-16) 0;
  background: var(--gray-50);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-6);
}

.stat-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-number {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--primary-purple-dark);
  margin-bottom: var(--spacing-2);
}

.stat-label {
  color: var(--gray-600);
  font-weight: 500;
}

/* Featured Section */
.featured-section {
  padding: var(--spacing-16) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.section-cta {
  text-align: center;
  margin-top: var(--spacing-12);
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  background: var(--purple-gradient);
  color: var(--white);
  text-decoration: none;
  padding: var(--spacing-4) var(--spacing-8);
  border-radius: var(--radius-full);
  font-weight: 600;
  transition: var(--transition-base);
  box-shadow: var(--shadow-md);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* News Section */
.news-section {
  padding: var(--spacing-16) 0;
  background: var(--gray-50);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-6);
}

.news-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  cursor: pointer;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.news-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-content {
  padding: var(--spacing-6);
}

.news-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.news-category {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple-dark);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.news-date {
  color: var(--gray-500);
  font-size: var(--font-size-sm);
}

.news-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-3);
}

.news-summary {
  color: var(--gray-600);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-4);
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>