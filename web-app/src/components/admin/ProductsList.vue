<template>
  <!-- Products List - 成果物一覧管理 -->
  <div class="products-list">
    <div v-if="products.length === 0" class="empty-state">
      <p>成果物がありません</p>
    </div>
    
    <div v-else class="admin-items">
      <div
        v-for="product in products"
        :key="product.id"
        class="admin-item"
      >
        <div class="admin-item-content">
          <div class="admin-item-header">
            <img 
              v-if="getAuthorAvatar(product)" 
              :src="getAuthorAvatar(product)" 
              :alt="getAuthorName(product)"
              class="author-avatar"
            />
            <div class="admin-item-info">
              <h4>{{ product.title }}</h4>
              <p>{{ product.category }} | {{ getAuthorName(product) }}</p>
            </div>
          </div>
          <p>{{ product.description }}</p>
          <div class="admin-item-meta">
            <div class="meta-stats">
              <span>いいね: {{ product.likes || 0 }}</span>
              <span>コメント: {{ product.comments || 0 }}</span>
              <span class="featured-badge" :class="{ active: product.featured }">
                {{ product.featured ? '注目' : '通常' }}
              </span>
            </div>
            <div class="meta-tags" v-if="product.tags && product.tags.length">
              <span 
                v-for="tag in product.tags.slice(0, 3)" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
              <span v-if="product.tags.length > 3" class="tag-more">
                +{{ product.tags.length - 3 }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="admin-item-actions">
          <button 
            class="btn-action btn-edit" 
            @click="$emit('edit', product)"
            title="編集"
          >
            ✏️
          </button>
          <button 
            class="btn-action btn-duplicate" 
            @click="$emit('duplicate', product.id)"
            title="複製"
          >
            📋
          </button>
          <button 
            class="btn-action btn-delete" 
            @click="handleDelete(product)"
            title="削除"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props - 親コンポーネントから受け取るデータ
interface Props {
  products: Array<{
    id: number
    title: string
    category: string
    description: string
    author: {
      name: string
      role?: string
      avatar?: string
    }
    authorName?: string
    likes?: number
    comments?: number
    featured: boolean
    tags?: string[]
    [key: string]: any
  }>
}

defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  edit: [product: any]
  delete: [productId: number]
  duplicate: [productId: number]
}>()

// Helper functions
const getAuthorName = (product: any) => {
  return product.author?.name || product.authorName || '不明'
}

const getAuthorAvatar = (product: any) => {
  return product.author?.avatar || product.authorAvatar || ''
}

const handleDelete = (product: any) => {
  if (confirm(`「${product.title}」を削除しますか？この操作は取り消せません。`)) {
    emit('delete', product.id)
  }
}
</script>

<style scoped>
/* Products List専用スタイル */
.products-list {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--gray-200);
}

.empty-state {
  padding: var(--spacing-12);
  text-align: center;
  color: var(--gray-500);
}

.empty-state p {
  margin: 0;
  font-size: var(--font-size-lg);
}

/* Admin Items */
.admin-items {
  display: flex;
  flex-direction: column;
}

.admin-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--gray-200);
  transition: background-color var(--transition-base);
}

.admin-item:hover {
  background: var(--gray-50);
}

.admin-item:last-child {
  border-bottom: none;
}

/* Item Content */
.admin-item-content {
  flex: 1;
  min-width: 0;
}

.admin-item-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-2);
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gray-200);
}

.admin-item-info {
  flex: 1;
}

.admin-item-info h4,
.admin-item-content h4 {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--gray-900);
  line-height: 1.3;
}

.admin-item-content p {
  margin: 0 0 var(--spacing-2) 0;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.admin-item-content p:first-of-type {
  color: var(--primary-purple);
  font-weight: 500;
}

/* Meta Information */
.admin-item-meta {
  margin-top: var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.meta-stats {
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
  flex-wrap: wrap;
}

.meta-stats span {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
}

.featured-badge {
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 500;
  background: var(--gray-100);
  color: var(--gray-600);
}

.featured-badge.active {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple);
}

.meta-tags {
  display: flex;
  gap: var(--spacing-1);
  flex-wrap: wrap;
}

.tag {
  background: var(--gray-100);
  color: var(--gray-600);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 500;
}

.tag-more {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 500;
}

/* Item Actions */
.admin-item-actions {
  display: flex;
  gap: var(--spacing-2);
  flex-shrink: 0;
  margin-left: var(--spacing-4);
}

.btn-action {
  width: 36px;
  height: 36px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all var(--transition-base);
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.btn-edit:hover {
  border-color: var(--primary-purple);
  background: var(--primary-purple-lighter);
}

.btn-duplicate:hover {
  border-color: var(--blue-500);
  background: var(--blue-50);
}

.btn-delete:hover {
  border-color: var(--red-500);
  background: var(--red-50);
}

/* Responsive */
@media (max-width: 768px) {
  .admin-item {
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .admin-item-actions {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }
  
  .meta-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
}
</style>