<template>
  <!-- News List - ニュース一覧管理 -->
  <div class="news-list">
    <div v-if="news.length === 0" class="empty-state">
      <p>ニュースがありません</p>
    </div>
    
    <div v-else class="admin-items">
      <div
        v-for="newsItem in news"
        :key="newsItem.id"
        class="admin-item"
      >
        <div class="admin-item-content">
          <h4>{{ newsItem.title }}</h4>
          <p class="news-date">{{ formatDate(newsItem.date) }}</p>
          <p class="news-excerpt">{{ newsItem.excerpt }}</p>
          <div class="news-url" v-if="newsItem.url">
            <a :href="newsItem.url" target="_blank" rel="noopener noreferrer" class="url-link">
              🔗 {{ truncateUrl(newsItem.url) }}
            </a>
          </div>
        </div>
        
        <div class="admin-item-actions">
          <button 
            class="btn-action btn-edit" 
            @click="$emit('edit', newsItem)"
            title="編集"
          >
            ✏️
          </button>
          <button 
            class="btn-action btn-delete" 
            @click="handleDelete(newsItem)"
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
  news: Array<{
    id: number
    title: string
    excerpt: string
    url: string
    date: string
    [key: string]: any
  }>
}

defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  edit: [newsItem: any]
  delete: [newsId: number]
}>()

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return '不明'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return '不明'
  }
}

const truncateUrl = (url: string) => {
  if (!url) return ''
  
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    const path = urlObj.pathname
    
    if (path.length > 30) {
      return `${domain}${path.substring(0, 27)}...`
    }
    
    return `${domain}${path}`
  } catch (error) {
    return url.length > 50 ? `${url.substring(0, 47)}...` : url
  }
}

const handleDelete = (newsItem: any) => {
  if (confirm(`「${newsItem.title}」を削除しますか？この操作は取り消せません。`)) {
    emit('delete', newsItem.id)
  }
}
</script>

<style scoped>
/* News List専用スタイル */
.news-list {
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

.admin-item-content h4 {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--gray-900);
  line-height: 1.3;
}

.news-date {
  margin: 0 0 var(--spacing-2) 0;
  color: var(--primary-purple);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.news-excerpt {
  margin: 0 0 var(--spacing-3) 0;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-url {
  margin-top: var(--spacing-2);
}

.url-link {
  color: var(--gray-500);
  text-decoration: none;
  font-size: var(--font-size-xs);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  transition: color var(--transition-base);
}

.url-link:hover {
  color: var(--primary-purple);
  text-decoration: underline;
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
}
</style>