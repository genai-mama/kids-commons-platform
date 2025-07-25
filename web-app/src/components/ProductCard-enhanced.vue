<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useDataStore } from '../stores/data'
import { getThumbnailUrl, createImageLoader } from '../utils/imageUtils'
import type { Product } from '../stores/data'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const dataStore = useDataStore()

const isLiked = computed(() => dataStore.isLiked(props.product.id))
const imageLoader = createImageLoader()

// 画像の状態管理
const currentImageUrl = ref('')
const imageLoading = ref(true)
const imageError = ref(false)
const useThumbnailService = ref(true)

// 画像URLを決定
const finalImageUrl = computed(() => {
  if (!useThumbnailService.value || !props.product.url) {
    return props.product.thumbnail
  }
  return getThumbnailUrl(props.product.url)
})

const handleLike = () => {
  dataStore.toggleLike(props.product.id)
}

const openProduct = () => {
  if (props.product.url) {
    window.open(props.product.url, '_blank')
  }
}

const handleImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

const handleImageError = () => {
  imageLoading.value = false
  imageError.value = true
  
  // スクリーンショットサービスで失敗した場合、元の画像にフォールバック
  if (useThumbnailService.value) {
    console.log('Screenshot failed, falling back to original thumbnail')
    useThumbnailService.value = false
  }
}

const retryImage = () => {
  imageLoading.value = true
  imageError.value = false
  useThumbnailService.value = true
}

onMounted(() => {
  currentImageUrl.value = finalImageUrl.value
})
</script>

<template>
  <article class="product-card" @click="openProduct">
    <!-- 画像セクション -->
    <div class="product-image-container">
      <!-- ローディング表示 -->
      <div v-if="imageLoading" class="image-loading">
        <div class="loading-spinner"></div>
        <p class="loading-text">プレビュー読み込み中...</p>
      </div>
      
      <!-- エラー表示 -->
      <div v-else-if="imageError" class="image-error">
        <div class="error-icon">🖼️</div>
        <p class="error-text">画像を読み込めませんでした</p>
        <button class="retry-btn" @click.stop="retryImage">再試行</button>
      </div>
      
      <!-- 画像表示 -->
      <img
        v-else
        :src="finalImageUrl"
        :alt="product.title"
        class="product-thumbnail"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      
      <!-- スクリーンショット表示インジケーター -->
      <div v-if="useThumbnailService && product.url && !imageError" class="screenshot-badge">
        <span class="badge-icon">📸</span>
        <span class="badge-text">ライブプレビュー</span>
      </div>
      
      <!-- 元画像表示インジケーター -->
      <div v-else-if="!useThumbnailService" class="fallback-badge">
        <span class="badge-icon">🖼️</span>
        <span class="badge-text">サムネイル</span>
      </div>
    </div>

    <div class="product-content">
      <div class="product-header">
        <span class="product-category">{{ product.category }}</span>
        <div class="product-author">
          <span class="author-avatar">{{ product.author.avatar }}</span>
        </div>
      </div>
      
      <h3 class="product-title">{{ product.title }}</h3>
      <p class="product-description">{{ product.description }}</p>
      
      <!-- URL表示 -->
      <div v-if="product.url" class="product-url">
        <span class="url-icon">🔗</span>
        <span class="url-text">{{ new URL(product.url).hostname }}</span>
      </div>
      
      <div class="product-tags">
        <span
          v-for="tag in product.tags"
          :key="tag"
          class="product-tag"
        >
          #{{ tag }}
        </span>
      </div>
      
      <div class="product-footer">
        <div class="product-stats">
          <span class="stat">
            💬 {{ product.comments }}
          </span>
          <time class="product-date">{{ product.date }}</time>
        </div>
        
        <button
          class="like-btn"
          :class="{ liked: isLiked }"
          @click.stop="handleLike"
        >
          <span>{{ isLiked ? '❤️' : '🤍' }}</span>
          {{ product.likes }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: var(--transition-base);
  cursor: pointer;
  animation: slideIn 0.4s ease-out;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 画像コンテナ */
.product-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--gray-100);
}

.product-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.product-card:hover .product-thumbnail {
  transform: scale(1.05);
}

/* ローディング */
.image-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--gray-50);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--gray-200);
  border-top: 3px solid var(--primary-purple);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-2);
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* エラー表示 */
.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--gray-50);
  padding: var(--spacing-4);
}

.error-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-2);
}

.error-text {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  margin: 0 0 var(--spacing-3) 0;
  text-align: center;
}

.retry-btn {
  background: var(--primary-purple);
  color: var(--white);
  border: none;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: var(--transition-base);
}

.retry-btn:hover {
  background: var(--primary-purple-dark);
}

/* バッジ */
.screenshot-badge,
.fallback-badge {
  position: absolute;
  top: var(--spacing-2);
  right: var(--spacing-2);
  background: rgba(155, 123, 216, 0.9);
  color: var(--white);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  backdrop-filter: blur(4px);
}

.fallback-badge {
  background: rgba(107, 114, 128, 0.9);
}

.badge-icon {
  font-size: 0.75rem;
}

.badge-text {
  font-size: 0.6rem;
}

/* URL表示 */
.product-url {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-3);
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--gray-50);
  border-radius: var(--radius-sm);
}

.url-icon {
  font-size: var(--font-size-xs);
}

.url-text {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  font-family: monospace;
}

/* 既存のスタイル */
.product-content {
  padding: var(--spacing-6);
}

.product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.product-category {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple-dark);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.product-author {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--purple-gradient);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.product-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-3);
  line-height: 1.4;
}

.product-description {
  color: var(--gray-600);
  margin-bottom: var(--spacing-4);
  line-height: 1.6;
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
  color: var(--gray-600);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

.product-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  color: var(--gray-500);
  font-size: var(--font-size-sm);
}

.product-date {
  color: var(--gray-400);
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--gray-500);
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.like-btn:hover {
  background: var(--gray-100);
  transform: scale(1.05);
}

.like-btn.liked {
  color: #ef4444;
}

@media (max-width: 768px) {
  .product-content {
    padding: var(--spacing-4);
  }
  
  .product-tags {
    gap: var(--spacing-1);
  }
  
  .badge-text {
    display: none;
  }
}
</style>