<script setup lang="ts">
import type { Product } from '../stores/data'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const handleLike = () => {
  // いいね機能（将来実装）
  console.log('Like:', props.product.id)
}

const openProduct = () => {
  if (props.product.url) {
    window.open(props.product.url, '_blank')
  }
}
</script>

<template>
  <article class="product-card" @click="openProduct">
    <div class="product-content">
      <div class="product-header">
        <span class="product-category">{{ product.category }}</span>
        <div class="product-author">
          <span class="author-avatar">{{ product.author.avatar }}</span>
        </div>
      </div>
      
      <h3 class="product-title">{{ product.title }}</h3>
      <p class="product-description">{{ product.description }}</p>
      
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
          @click.stop="handleLike"
        >
          <span>🤍</span>
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
}
</style>