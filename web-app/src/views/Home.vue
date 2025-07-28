<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDataStore } from '../stores/data'
import ProductCard from '../components/ProductCard-enhanced.vue'
import DiscordWidget from '../components/DiscordWidget.vue'

const dataStore = useDataStore()

const featuredProducts = computed(() => dataStore.featuredProducts)
const stats = computed(() => dataStore.stats)
const latestNews = computed(() => dataStore.latestNews)
const discordServerId = computed(() => dataStore.discordServerId)

// Discord情報更新のハンドラー
const handleDiscordUpdate = (data: any) => {
  if (data) {
    dataStore.updateDiscordInfo(data.memberCount, data.onlineCount, data.serverName)
  }
}

// Initialize liked products from localStorage
onMounted(() => {
  dataStore.loadLikedProducts()
})
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">
          #生成AIママ部
        </h1>
        <p class="hero-subtitle">
          家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティです🎵<br>
          エンジニアでも、そうでなくても、経験問わずママさんなら大歓迎🙆‍♀️✨<br>
          ぜひみんなで生成AI活用していきましょう〜！
        </p>
        <a href="https://discord.gg/genai-mama" class="btn-join" target="_blank">
          参加する
        </a>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-layout">
          <!-- 統計カード -->
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
          
          <!-- Discord ウィジェット -->
          <div class="discord-section">
            <DiscordWidget 
              :server-id="discordServerId"
              :show-details="true"
              :auto-update="true"
              @update="handleDiscordUpdate"
            />
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
          <RouterLink to="/products" class="btn-secondary">
            すべての成果物を見る
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Latest News Section -->
    <section class="news-section">
      <div class="container">
        <div class="section-header-flex">
          <h2 class="section-title">最新ニュース</h2>
          <RouterLink to="/news" class="view-all-link">
            すべて見る→
          </RouterLink>
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

.stats-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-8);
  align-items: start;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-6);
}

.discord-section {
  position: sticky;
  top: var(--spacing-8);
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

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-12);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
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

/* セクションのCTAボタンは btn-secondary クラスを使用 */

.view-all-link {
  color: var(--primary-purple-dark);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--font-size-lg);
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.view-all-link:hover {
  color: var(--primary-purple);
  transform: translateX(4px);
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

  .stats-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-4);
  }

  .discord-section {
    position: static;
    order: -1;
  }

  .section-header-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
  }

  .view-all-link {
    align-self: flex-end;
    font-size: var(--font-size-base);
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>