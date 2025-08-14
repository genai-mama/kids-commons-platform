<template>
  <!-- Product Form - 成果物フォーム（新規作成・編集） -->
  <form @submit.prevent="handleSubmit" class="product-form">
    <div class="form-group">
      <label>タイトル <span class="required">※必須</span></label>
      <input type="text" v-model="localProduct.title" required />
    </div>
    
    <div class="form-group">
      <label>カテゴリ <span class="required">※必須</span></label>
      <select v-model="localProduct.category" required>
        <option value="仕事効率化">仕事効率化</option>
        <option value="学校">学校</option>
        <option value="コミュニケーション">コミュニケーション</option>
        <option value="学習">学習</option>
      </select>
    </div>
    
    <div class="form-group">
      <label>説明 <span class="required">※必須</span></label>
      <textarea
        v-model="localProduct.description"
        required
        rows="4"
      ></textarea>
    </div>
    
    <div class="form-group">
      <label>タグ（カンマ区切り）</label>
      <input
        type="text"
        v-model="localProduct.tagString"
        placeholder="SNS, 効率化, スケジュール"
      />
    </div>
    
    <div class="form-group">
      <label>作者名 <span class="required">※必須</span></label>
      <input
        type="text"
        :value="authorName"
        @input="updateAuthor('name', $event.target.value)"
        required
      />
    </div>
    
    <div class="form-group">
      <label>作者の役割 <span class="required">※必須</span></label>
      <input
        type="text"
        :value="authorRole"
        @input="updateAuthor('role', $event.target.value)"
        required
      />
    </div>
    
    <div class="form-group">
      <label>URL <span class="required">※必須</span></label>
      <input type="url" v-model="localProduct.url" required />
    </div>
    
    <div class="form-group">
      <label>
        <input type="checkbox" v-model="localProduct.featured" />
        注目の成果物として表示
      </label>
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
import { ref, computed, watch, onMounted } from 'vue'

// Props - 親コンポーネントから受け取るデータ
interface Props {
  product: {
    title: string
    category: string
    description: string
    tagString?: string
    tags?: string[]
    url: string
    author: {
      name: string
      role?: string
    }
    authorName?: string
    authorRole?: string
    featured: boolean
    [key: string]: any
  }
  isEditing: boolean
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  save: [product: any]
  cancel: []
}>()

// Local state for form
const localProduct = ref({ ...props.product })

// Computed properties for author handling
const authorName = computed({
  get: () => localProduct.value.author?.name || localProduct.value.authorName || '',
  set: (value: string) => {
    if (localProduct.value.author) {
      localProduct.value.author.name = value
    }
    localProduct.value.authorName = value
  }
})

const authorRole = computed({
  get: () => localProduct.value.author?.role || localProduct.value.authorRole || '',
  set: (value: string) => {
    if (localProduct.value.author) {
      localProduct.value.author.role = value
    }
    localProduct.value.authorRole = value
  }
})

// Update author function
const updateAuthor = (field: string, value: string) => {
  if (field === 'name') {
    authorName.value = value
  } else if (field === 'role') {
    authorRole.value = value
  }
}

// Handle form submission
const handleSubmit = () => {
  // Process tags
  if (localProduct.value.tagString) {
    localProduct.value.tags = localProduct.value.tagString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag)
  }

  // Ensure author object structure
  localProduct.value.author = {
    name: authorName.value,
    role: authorRole.value
  }

  // Add timestamp for new products
  if (!props.isEditing) {
    localProduct.value.date = new Date().toISOString()
    localProduct.value.likes = 0
  }

  emit('save', { ...localProduct.value })
}

// Watch for prop changes to update local state (only when editing)
watch(() => props.product, (newProduct) => {
  // Only update if we're in editing mode and the product ID has changed
  // This prevents clearing user input during new product creation
  if (props.isEditing && newProduct.id !== localProduct.value.id) {
    localProduct.value = { ...newProduct }
  }
}, { deep: true })

// Initialize form
onMounted(() => {
  // Ensure tagString is set from tags if needed
  if (localProduct.value.tags && !localProduct.value.tagString) {
    localProduct.value.tagString = localProduct.value.tags.join(', ')
  }
})
</script>

<style scoped>
/* Product Form専用スタイル */
.product-form {
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-purple);
  box-shadow: 0 0 0 3px rgba(155, 123, 216, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* Checkbox styling */
.form-group label input[type="checkbox"] {
  display: inline;
  width: auto;
  margin-right: var(--spacing-2);
  vertical-align: middle;
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

/* Required field styling */
.required {
  color: #dc2626;
  font-weight: 600;
  font-size: var(--font-size-sm);
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