<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getDiscordMemberCount, createDiscordDataFetcher } from '../utils/discordApi'

interface Props {
  serverId: string
  showDetails?: boolean
  autoUpdate?: boolean
  updateInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: true,
  autoUpdate: true,
  updateInterval: 60000 // 1分
})

// 状態管理
const loading = ref(true)
const error = ref<string | null>(null)
const serverData = ref<{
  memberCount: number
  onlineCount: number
  serverName: string
} | null>(null)

const lastUpdated = ref<Date | null>(null)

// データフェッチャー
let dataFetcher: ReturnType<typeof createDiscordDataFetcher> | null = null

// 計算されたプロパティ
const memberCount = computed(() => serverData.value?.memberCount || 0)
const onlineCount = computed(() => serverData.value?.onlineCount || 0)
const serverName = computed(() => serverData.value?.serverName || '#生成AIママ部')

const timeAgo = computed(() => {
  if (!lastUpdated.value) return ''
  
  const now = new Date()
  const diff = now.getTime() - lastUpdated.value.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'たった今'
  if (minutes < 60) return `${minutes}分前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}時間前`
  const days = Math.floor(hours / 24)
  return `${days}日前`
})

// データ取得関数
const fetchDiscordData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const data = await getDiscordMemberCount(props.serverId)
    
    if (data) {
      serverData.value = data
      lastUpdated.value = new Date()
      error.value = null
    } else {
      throw new Error('Discord サーバー情報を取得できませんでした')
    }
  } catch (err) {
    console.error('Discord data fetch error:', err)
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

// 手動更新
const refreshData = () => {
  fetchDiscordData()
}

// Discord参加リンク
const joinDiscord = () => {
  window.open(`https://discord.gg/${props.serverId}`, '_blank')
}

// ライフサイクル
onMounted(async () => {
  // 初回データ取得
  await fetchDiscordData()
  
  // 自動更新の設定
  if (props.autoUpdate && !error.value) {
    dataFetcher = createDiscordDataFetcher(props.serverId, props.updateInterval)
    
    dataFetcher.subscribe((data) => {
      if (data) {
        serverData.value = data
        lastUpdated.value = new Date()
        error.value = null
      }
    })
    
    dataFetcher.start()
  }
})

onUnmounted(() => {
  if (dataFetcher) {
    dataFetcher.stop()
  }
})
</script>

<template>
  <div class="discord-widget">
    <!-- ローディング状態 -->
    <div v-if="loading && !serverData" class="widget-loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">Discord サーバー情報を取得中...</p>
    </div>
    
    <!-- エラー状態 -->
    <div v-else-if="error && !serverData" class="widget-error">
      <div class="error-icon">⚠️</div>
      <p class="error-text">{{ error }}</p>
      <button class="retry-btn" @click="refreshData">再試行</button>
    </div>
    
    <!-- データ表示 -->
    <div v-else class="widget-content">
      <!-- ヘッダー -->
      <div class="widget-header">
        <div class="server-info">
          <div class="discord-icon">💬</div>
          <div class="server-details">
            <h3 class="server-name">{{ serverName }}</h3>
            <p class="server-subtitle">Discord コミュニティ</p>
          </div>
        </div>
        <button 
          class="refresh-btn" 
          @click="refreshData"
          :disabled="loading"
          :class="{ loading: loading }"
        >
          🔄
        </button>
      </div>
      
      <!-- 統計情報 -->
      <div class="widget-stats">
        <div class="stat-item">
          <span class="stat-icon">👥</span>
          <div class="stat-details">
            <span class="stat-number">{{ memberCount.toLocaleString() }}</span>
            <span class="stat-label">メンバー</span>
          </div>
        </div>
        
        <div class="stat-divider"></div>
        
        <div class="stat-item">
          <span class="stat-icon">🟢</span>
          <div class="stat-details">
            <span class="stat-number">{{ onlineCount.toLocaleString() }}</span>
            <span class="stat-label">オンライン</span>
          </div>
        </div>
      </div>
      
      <!-- 詳細情報 -->
      <div v-if="showDetails" class="widget-details">
        <div class="update-info">
          <span class="update-text">更新: {{ timeAgo }}</span>
        </div>
        
        <!-- 参加ボタン -->
        <button class="join-btn" @click="joinDiscord">
          <span class="join-icon">➕</span>
          <span class="join-text">コミュニティに参加</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.discord-widget {
  background: linear-gradient(135deg, #7289da, #5865f2);
  border-radius: var(--radius-xl);
  color: white;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}

.discord-widget:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* ローディング */
.widget-loading {
  padding: var(--spacing-8);
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-3);
}

.loading-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--font-size-sm);
  margin: 0;
}

/* エラー */
.widget-error {
  padding: var(--spacing-8);
  text-align: center;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-3);
}

.error-text {
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-sm);
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* メインコンテンツ */
.widget-content {
  padding: var(--spacing-6);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.server-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.discord-icon {
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-2);
  border-radius: var(--radius-lg);
}

.server-name {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.server-subtitle {
  margin: 0;
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-2);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: var(--font-size-lg);
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(180deg);
}

.refresh-btn.loading {
  animation: spin 1s linear infinite;
}

/* 統計 */
.widget-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex: 1;
  justify-content: center;
}

.stat-icon {
  font-size: var(--font-size-xl);
}

.stat-number {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.8);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 var(--spacing-4);
}

/* 詳細 */
.widget-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.update-info {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.7);
}

.join-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #5865f2;
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
}

.join-btn:hover {
  background: white;
  transform: translateY(-1px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* レスポンシブ */
@media (max-width: 768px) {
  .widget-content {
    padding: var(--spacing-4);
  }
  
  .widget-header {
    flex-direction: column;
    gap: var(--spacing-3);
    text-align: center;
  }
  
  .widget-details {
    flex-direction: column;
    text-align: center;
  }
}
</style>