<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '../stores/data'

const dataStore = useDataStore()
const news = computed(() => dataStore.news)
</script>

<template>
  <div class="news">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">最新ニュース</h1>
        <p class="hero-subtitle">
          #生成AIママ部の最新情報やイベント、メンバーの活動をお届けします
        </p>
      </div>
    </section>

    <!-- News Grid -->
    <section class="news-section">
      <div class="container">
        <div class="news-grid">
          <article
            v-for="newsItem in news"
            :key="newsItem.id"
            class="news-card"
          >
            <div class="news-content">
              <div class="news-meta">
                <time class="news-date">{{ dataStore.formatDate(newsItem.date) }}</time>
              </div>
              <h2 class="news-title">{{ newsItem.title }}</h2>
              <p class="news-summary">{{ newsItem.excerpt }}</p>
              <div class="news-footer">
                <a 
                  :href="newsItem.url" 
                  class="read-more-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  続きを読む →
                </a>
              </div>
            </div>
          </article>
        </div>

        <!-- Call to Action -->
        <div class="cta-section">
          <div class="cta-content">
            <h2 class="cta-title">最新情報を見逃さないように</h2>
            <p class="cta-description">
              Discordコミュニティに参加して、リアルタイムで情報をキャッチしましょう
            </p>
            <a href="https://discord.gg/genai-mama" class="cta-button" target="_blank">
              <span>💬</span>
              Discordに参加する
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.news {
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

/* News Section */
.news-section {
  padding: var(--spacing-16) 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-16);
}

.news-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  animation: slideIn 0.4s ease-out;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.news-thumbnail {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.news-content {
  padding: var(--spacing-6);
}

.news-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.news-category {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple-dark);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.news-date {
  color: var(--gray-500);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.news-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
  line-height: 1.3;
}

.news-summary {
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: var(--spacing-6);
  font-size: var(--font-size-base);
}

.news-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more-btn {
  color: var(--primary-purple-dark);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--font-size-sm);
  transition: var(--transition-base);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
}

.read-more-btn:hover {
  color: var(--primary-purple);
  transform: translateX(4px);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--primary-purple-lighter), var(--white));
  border-radius: var(--radius-2xl);
  padding: var(--spacing-16);
  text-align: center;
}

.cta-content {
  max-width: 500px;
  margin: 0 auto;
}

.cta-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
}

.cta-description {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  margin-bottom: var(--spacing-8);
  line-height: 1.6;
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
  font-size: var(--font-size-lg);
  transition: var(--transition-base);
  box-shadow: var(--shadow-lg);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .news-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }

  .news-thumbnail {
    height: 200px;
  }

  .news-content {
    padding: var(--spacing-4);
  }

  .news-title {
    font-size: var(--font-size-xl);
  }

  .cta-section {
    padding: var(--spacing-8);
  }

  .cta-title {
    font-size: var(--font-size-2xl);
  }
}

/* Animation delays for staggered effect */
.news-card:nth-child(1) {
  animation-delay: 0s;
}

.news-card:nth-child(2) {
  animation-delay: 0.1s;
}

.news-card:nth-child(3) {
  animation-delay: 0.2s;
}

.news-card:nth-child(4) {
  animation-delay: 0.3s;
}

.news-card:nth-child(5) {
  animation-delay: 0.4s;
}

.news-card:nth-child(6) {
  animation-delay: 0.5s;
}
</style>