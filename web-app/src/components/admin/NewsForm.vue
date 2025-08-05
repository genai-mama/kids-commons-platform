<template>
  <!-- News Form - ニュースフォーム（新規作成・編集） -->
  <form @submit.prevent="handleSubmit" class="news-form">
    <div class="form-group">
      <label>タイトル</label>
      <input type="text" v-model="localNewsItem.title" required />
    </div>
    
    <div class="form-group">
      <label>抜粋</label>
      <textarea
        v-model="localNewsItem.excerpt"
        required
        rows="4"
        placeholder="ニュースの要約を入力してください"
      ></textarea>
    </div>
    
    <div class="form-group">
      <label>URL</label>
      <input type="url" v-model="localNewsItem.url" required placeholder="https://example.com" />
    </div>
    
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">
        {{ isEditing ? '更新' : '追加' }}
      </button>
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
        キャンセル
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props - 親コンポーネントから受け取るデータ
interface Props {
  newsItem: {
    title: string
    excerpt: string
    url: string
    date?: string
    [key: string]: any
  }
  isEditing: boolean
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  save: [newsItem: any]
  cancel: []
}>()

// Local state for form
const localNewsItem = ref({ ...props.newsItem })

// Handle form submission
const handleSubmit = () => {
  // Add timestamp for new news items
  if (!props.isEditing) {
    localNewsItem.value.date = new Date().toISOString()
  }

  emit('save', { ...localNewsItem.value })
}

// Watch for prop changes to update local state
watch(() => props.newsItem, (newNewsItem) => {
  localNewsItem.value = { ...newNewsItem }
}, { deep: true })
</script>

<style scoped>
/* News Form専用スタイル */
.news-form {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
}

/* Form styles */
.form-group {
  margin-bottom: var(--spacing-4);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-2);
  color: var(--gray-700);
  font-weight: 500;
  font-size: var(--font-size-sm);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-purple);
  box-shadow: 0 0 0 3px rgba(155, 123, 216, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  gap: var(--spacing-2);
  min-width: 100px;
}

.btn-primary {
  background: var(--primary-purple);
  color: var(--white);
}

.btn-primary:hover {
  background: var(--primary-purple-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-200);
}

/* Responsive */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}
</style>