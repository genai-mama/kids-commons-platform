<template>
  <!-- Admin Page - 管理画面（Products, News, Members管理） -->
  <div class="admin-page">
    <div class="container">
      <div class="admin-header">
        <h1>管理画面</h1>
        <div class="admin-actions">
          <!-- CSV Actions -->
          <div class="csv-actions">
            <button class="btn btn-outline" @click="$emit('export-csv', 'products')">
              成果物をCSVエクスポート
            </button>
            <button class="btn btn-outline" @click="$emit('import-csv', 'products')">
              成果物をCSVインポート
            </button>
          </div>
        </div>
      </div>

      <!-- タブ切り替え -->
      <div class="admin-tabs">
        <button 
          class="admin-tab" 
          :class="{ active: activeTab === 'products' }"
          @click="$emit('tab-change', 'products')"
        >
          成果物管理
        </button>
        <button 
          class="admin-tab" 
          :class="{ active: activeTab === 'news' }"
          @click="$emit('tab-change', 'news')"
        >
          ニュース管理
        </button>
        <!-- メンバー管理タブは一時的に非表示 -->
        <!-- <button 
          class="admin-tab" 
          :class="{ active: activeTab === 'members' }"
          @click="$emit('tab-change', 'members')"
        >
          メンバー管理
        </button> -->
      </div>

      <!-- Tab Content -->
      <div class="admin-content">
        <!-- 成果物管理 -->
        <div v-if="activeTab === 'products'" class="tab-content">
          <div class="content-header">
            <h2>成果物管理</h2>
            <button class="btn btn-primary" @click="$emit('show-form', 'product')">
              新規追加
            </button>
          </div>

          <!-- 成果物フォーム（新規追加・編集） -->
          <div v-if="showProductForm || editingProduct" class="admin-form">
            <h3>{{ editingProduct ? '成果物を編集' : '新しい成果物を追加' }}</h3>
            <slot name="product-form" />
          </div>

          <!-- 成果物一覧 -->
          <div class="admin-list">
            <slot name="products-list" />
          </div>
        </div>

        <!-- ニュース管理 -->
        <div v-if="activeTab === 'news'" class="tab-content">
          <div class="content-header">
            <h2>ニュース管理</h2>
            <button class="btn btn-primary" @click="$emit('show-form', 'news')">
              新規追加
            </button>
          </div>

          <!-- ニュースフォーム（新規追加・編集） -->
          <div v-if="showNewsForm || editingNews" class="admin-form">
            <h3>{{ editingNews ? 'ニュースを編集' : '新しいニュースを追加' }}</h3>
            <slot name="news-form" />
          </div>

          <!-- ニュース一覧 -->
          <div class="admin-list">
            <slot name="news-list" />
          </div>
        </div>

        <!-- メンバー管理 - 一時的に非表示 -->
        <!-- <div v-if="activeTab === 'members'" class="tab-content">
          <div class="content-header">
            <h2>メンバー管理</h2>
          </div>

          <div v-if="editingMember" class="admin-form">
            <h3>メンバーを編集</h3>
            <slot name="member-form" />
          </div>

          <div class="admin-list">
            <slot name="members-list" />
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props - 親コンポーネントから受け取るデータ
interface Props {
  activeTab: string
  showProductForm: boolean
  showNewsForm: boolean
  showMemberForm: boolean
  editingProduct: any
  editingNews: any
  editingMember: any
}

defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
defineEmits<{
  'tab-change': [tab: string]
  'show-form': [type: string]
  'export-csv': [type: string]
  'import-csv': [type: string]
}>()
</script>

<style scoped>
/* Admin Page専用スタイル */
.admin-page {
  padding: var(--spacing-12) 0;
  min-height: 80vh;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.admin-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
}

.admin-actions {
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
  flex-wrap: wrap;
}

.csv-actions {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

/* Admin Tabs */
.admin-tabs {
  display: flex;
  border-bottom: 2px solid var(--gray-200);
  margin-bottom: var(--spacing-8);
  gap: var(--spacing-1);
}

.admin-tab {
  padding: var(--spacing-4) var(--spacing-6);
  border: none;
  background: none;
  color: var(--gray-600);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.admin-tab:hover {
  color: var(--primary-purple);
  background: var(--gray-50);
}

.admin-tab.active {
  color: var(--primary-purple);
  border-bottom-color: var(--primary-purple);
  background: var(--gray-50);
}

/* Tab Content */
.admin-content {
  max-width: 1200px;
  margin: 0 auto;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
}

.content-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

/* Admin Form */
.admin-form {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  margin-bottom: var(--spacing-8);
  box-shadow: var(--shadow-sm);
}

.admin-form h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 var(--spacing-6) 0;
}

/* Admin List */
.admin-list {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: var(--spacing-4);
    align-items: stretch;
  }

  .admin-actions {
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .csv-actions {
    justify-content: center;
  }

  .admin-tabs {
    flex-direction: column;
  }

  .admin-tab {
    text-align: center;
    border-bottom: 1px solid var(--gray-200);
    border-radius: 0;
  }

  .admin-tab:last-child {
    border-bottom: none;
  }

  .admin-tab.active {
    border-bottom-color: var(--gray-200);
    background: var(--primary-purple-lighter);
  }
}
</style>