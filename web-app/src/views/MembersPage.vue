<template>
  <!-- Members Page - フィーチャードメンバーと全メンバー表示 -->
  <div class="members-page">
    <div class="container">
      <div class="page-header">
        <h1>Members</h1>
        <p>コミュニティのアクティブメンバーをご紹介します</p>
      </div>

      <div class="members-content">
        <!-- Featured Members -->
        <section class="featured-members" v-if="featuredMembers.length > 0">
          <h2>コアメンバー</h2>
          <div class="featured-grid">
            <div v-for="member in featuredMembers" :key="member.id" class="member-card featured">
              <div class="member-card-content">
                <div class="member-avatar">
                  <img :src="member.avatar" :alt="member.name" />
                </div>
                <div class="member-info">
                  <h3 class="member-name">{{ member.name }}</h3>
                  <p class="member-role">{{ member.role }}</p>
                  <p class="member-bio">{{ member.bio }}</p>
                  <div class="member-skills" v-if="member.skills && member.skills.length > 0">
                    <span v-for="skill in member.skills" :key="skill" class="skill-tag">{{ skill }}</span>
                  </div>
                  <div class="member-social" v-if="member.website || member.twitter || member.github">
                    <a v-if="member.website" :href="member.website" target="_blank" title="Website">🌐</a>
                    <a v-if="member.twitter" :href="member.twitter" target="_blank" title="Twitter">🐦</a>
                    <a v-if="member.github" :href="member.github" target="_blank" title="GitHub">⚡</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- All Members -->
        <section class="all-members">
          <h2>すべてのメンバー</h2>
          <div class="members-grid" v-if="regularMembers.length > 0">
            <div v-for="member in regularMembers" :key="member.id" class="member-card">
              <div class="member-card-content">
                <div class="member-avatar">
                  <img :src="member.avatar" :alt="member.name" />
                </div>
                <div class="member-info">
                  <h3 class="member-name">{{ member.name }}</h3>
                  <p class="member-role">{{ member.role }}</p>
                  <p class="member-bio">{{ member.bio }}</p>
                  <div class="member-skills" v-if="member.skills && member.skills.length > 0">
                    <span v-for="skill in member.skills" :key="skill" class="skill-tag">{{ skill }}</span>
                  </div>
                  <div class="member-social" v-if="member.website || member.twitter || member.github">
                    <a v-if="member.website" :href="member.website" target="_blank" title="Website">🌐</a>
                    <a v-if="member.twitter" :href="member.twitter" target="_blank" title="Twitter">🐦</a>
                    <a v-if="member.github" :href="member.github" target="_blank" title="GitHub">⚡</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-members">
            <p>メンバーデータを読み込み中...</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props - 親コンポーネントから受け取るデータ
interface Props {
  members: any[]
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
defineEmits<{
  navigate: [page: string]
}>()

// フィーチャードメンバーと通常メンバーを分離
const featuredMembers = computed(() => {
  return props.members.filter(member => member.featured)
})

const regularMembers = computed(() => {
  return props.members.filter(member => !member.featured)
})
</script>

<style scoped>
/* Members Page専用スタイル */
.members-page {
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

.members-content {
  max-width: 1400px;
  margin: 0 auto;
}

.featured-members,
.all-members {
  margin-bottom: var(--spacing-20);
}

.featured-members h2,
.all-members h2 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-8);
  text-align: center;
}

/* フィーチャードメンバーグリッド */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: var(--spacing-12);
  margin-bottom: var(--spacing-20);
}

/* 全メンバーグリッド */
.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-10);
}

/* Member Card Styles */
.member-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-base);
  border: 1px solid var(--gray-200);
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.member-card.featured {
  border: 2px solid var(--primary-purple);
  background: linear-gradient(135deg, var(--white) 0%, var(--primary-purple-lighter) 100%);
}

.member-card-content {
  padding: var(--spacing-6);
  text-align: center;
}

.member-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto var(--spacing-4);
  overflow: hidden;
  border: 4px solid var(--white);
  box-shadow: var(--shadow-md);
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  text-align: center;
}

.member-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-2);
}

.member-role {
  font-size: var(--font-size-sm);
  color: var(--primary-purple);
  font-weight: 500;
  margin-bottom: var(--spacing-3);
}

.member-bio {
  font-size: var(--font-size-base);
  color: var(--gray-600);
  line-height: 1.5;
  margin-bottom: var(--spacing-4);
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  justify-content: center;
  margin-bottom: var(--spacing-4);
}

.skill-tag {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple-dark);
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-weight: 500;
}

.member-social {
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
}

.member-social a {
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: transform var(--transition-base);
}

.member-social a:hover {
  transform: scale(1.2);
}

.no-members {
  text-align: center;
  padding: var(--spacing-20);
  color: var(--gray-500);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .members-page {
    padding: var(--spacing-12) 0;
  }
  
  .page-header h1 {
    font-size: var(--font-size-3xl);
  }
  
  .page-header p {
    font-size: var(--font-size-lg);
  }
  
  .featured-grid,
  .members-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
  
  .member-avatar {
    width: 100px;
    height: 100px;
  }
  
  .member-card-content {
    padding: var(--spacing-4);
  }
}
</style>