<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '../stores/data'

const dataStore = useDataStore()
const stats = computed(() => dataStore.stats)
</script>

<template>
  <div class="about">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">#生成AIママ部について</h1>
        <p class="hero-subtitle">
          家事育児からコーディングまで、生成AIを活用して新しい働き方を創造するママたちのコミュニティです
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="container">
        <div class="section-content">
          <div class="text-content">
            <h2 class="section-title">私たちのミッション</h2>
            <p class="section-text">
              生成AIの力で、ママたちの日常をもっと豊かに、もっと効率的に。
              家事や育児の合間に、新しいスキルを身につけ、創造的な活動に取り組むママたちを支援します。
            </p>
            <p class="section-text">
              技術の力で子育てと仕事の両立を実現し、ママ一人ひとりが持つ可能性を最大限に引き出すことを目指しています。
            </p>
          </div>
          <div class="image-content">
            <div class="mission-image">
              <span class="emoji">🤱</span>
              <span class="emoji">💻</span>
              <span class="emoji">🤖</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title center">コミュニティの特徴</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3 class="feature-title">サポート体制</h3>
            <p class="feature-description">
              初心者からエキスパートまで、レベルに応じたサポートを提供。質問や相談はいつでもOK！
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">実践的な学び</h3>
            <p class="feature-description">
              実際の生活に役立つツールやアプリを作りながら、楽しく生成AIを学べます。
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌟</div>
            <h3 class="feature-title">成果の共有</h3>
            <p class="feature-description">
              作った作品をコミュニティで共有し、フィードバックをもらって更なる改善を。
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3 class="feature-title">キャリア支援</h3>
            <p class="feature-description">
              スキルアップから転職まで、ママたちの新しいキャリア形成をサポートします。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <h2 class="section-title center">コミュニティの実績</h2>
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
            <div class="stat-number">15+</div>
            <div class="stat-label">開催イベント</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">一緒に始めませんか？</h2>
          <p class="cta-description">
            生成AIを活用して、新しい可能性を見つけましょう。
            初心者歓迎、子育て中のママも安心して参加できます。
          </p>
          <a href="https://discord.gg/genai-mama" class="cta-button" target="_blank">
            <span>💬</span>
            Discordコミュニティに参加
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about {
  animation: fadeIn 0.6s ease-out;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary-purple-lighter), var(--white));
  padding: var(--spacing-16) 0;
  text-align: center;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-6);
  background: var(--purple-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Mission Section */
.mission-section {
  padding: var(--spacing-16) 0;
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-12);
  align-items: center;
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-6);
}

.section-title.center {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.section-text {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  line-height: 1.7;
  margin-bottom: var(--spacing-4);
}

.mission-image {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-6);
  background: linear-gradient(135deg, var(--primary-purple-lighter), var(--white));
  border-radius: var(--radius-2xl);
  padding: var(--spacing-16);
}

.emoji {
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
}

.emoji:nth-child(2) {
  animation-delay: -1s;
}

.emoji:nth-child(3) {
  animation-delay: -2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Features Section */
.features-section {
  padding: var(--spacing-16) 0;
  background: var(--gray-50);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-8);
}

.feature-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-4);
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-3);
}

.feature-description {
  color: var(--gray-600);
  line-height: 1.6;
}

/* Stats Section */
.stats-section {
  padding: var(--spacing-16) 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-6);
}

.stat-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
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

/* CTA Section */
.cta-section {
  padding: var(--spacing-16) 0;
  background: linear-gradient(135deg, var(--primary-purple-lighter), var(--white));
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-6);
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

  .section-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }

  .mission-image {
    padding: var(--spacing-8);
  }

  .emoji {
    font-size: 3rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>