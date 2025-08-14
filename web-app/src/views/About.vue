<script setup lang="ts">
import { computed, ref } from 'vue'

// 統計データ（固定値）
const stats = ref({
  totalMembers: 127,
  totalProducts: 4,
  totalCategories: 4,
  activeDays: 200
})
</script>

<template>
  <div class="about">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">#生成AIママ部とは</h1>
        <p class="hero-subtitle">
          家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティです
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="container">
        <div class="section-content">
          <div class="text-content">
            <h2 class="section-title">コミュニティについて</h2>
            <p class="section-text">
              #生成AIママ部は、家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティです。
              エンジニアでも、そうでなくても、経験問わずママさんなら大歓迎です。
            </p>
            <p class="section-text">
              日々の生活で生成AIを活用する方法を共有し、お互いに学び合い、サポートし合うコミュニティを目指しています。
            </p>
            
            <h3 class="activity-title">活動内容</h3>
            <ul class="activity-list">
              <li>生成AIツールの活用法共有</li>
              <li>家事・育児の効率化アイデア交換</li>
              <li>プログラミング・デザインの学習サポート</li>
              <li>成果物の発表・フィードバック</li>
              <li>ママ同士の情報交換・相談</li>
            </ul>
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




  </div>
</template>

<style scoped>
.about {
  animation: fadeIn 0.6s ease-out;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary-purple-lighter), var(--white));
  padding: 0 0 var(--spacing-16) 0;
  text-align: center;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin: var(--spacing-12) 0 var(--spacing-6) 0;
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

.activity-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin: var(--spacing-6) 0 var(--spacing-4) 0;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-list li {
  color: var(--gray-600);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin-bottom: var(--spacing-3);
  padding-left: var(--spacing-6);
  position: relative;
}

.activity-list li::before {
  content: '✨';
  font-size: 1rem;
  position: absolute;
  left: 0;
  top: 0;
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