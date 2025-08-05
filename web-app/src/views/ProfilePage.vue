<template>
  <!-- Profile Page - ユーザープロフィール編集画面 -->
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <h1>プロフィール</h1>
        <p>あなたの情報を編集できます</p>
      </div>

      <div class="profile-content">
        <!-- 左側カラム: プロフィールカード -->
        <div class="profile-card-left">
          <!-- 写真カルーセル -->
          <div class="photo-carousel-section">
            <h3>写真</h3>
            <div class="photo-carousel-container">
              <div v-if="userProfile.photos && userProfile.photos.length > 0" class="photo-carousel">
                <div class="carousel-main">
                  <div class="carousel-image-container">
                    <img 
                      :src="userProfile.photos[currentPhotoIndex]" 
                      :alt="`Photo ${currentPhotoIndex + 1}`"
                      class="carousel-image"
                    />
                    <!-- 写真番号表示 -->
                    <div class="photo-counter">
                      Photo{{ currentPhotoIndex + 1 }} / {{ userProfile.photos.length }}
                    </div>
                  </div>
                  <!-- ナビゲーションボタン（複数枚の場合のみ） -->
                  <div v-if="userProfile.photos.length > 1" class="carousel-controls">
                    <button 
                      class="carousel-btn prev"
                      @click="$emit('photo-prev')"
                      :disabled="currentPhotoIndex === 0"
                    >
                      ‹
                    </button>
                    <button 
                      class="carousel-btn next"
                      @click="$emit('photo-next')"
                      :disabled="currentPhotoIndex === userProfile.photos.length - 1"
                    >
                      ›
                    </button>
                  </div>
                </div>
                <!-- インジケーター（複数枚の場合のみ） -->
                <div v-if="userProfile.photos.length > 1" class="carousel-indicators">
                  <button
                    v-for="(_, index) in userProfile.photos"
                    :key="index"
                    class="carousel-indicator"
                    :class="{ active: index === currentPhotoIndex }"
                    @click="$emit('photo-goto', index)"
                  ></button>
                </div>
              </div>
              <div v-else class="photo-placeholder">
                <!-- 写真なしの場合のプレースホルダー -->
                <div class="placeholder-content">
                  <span class="placeholder-icon">📸</span>
                  <p>写真を追加してください</p>
                </div>
              </div>
            </div>
            
            <!-- 画像選択ボタン -->
            <div class="photo-upload-controls">
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                style="display: none"
                @change="$emit('photo-upload', $event)"
              />
              <button 
                class="photo-upload-btn"
                @click="$refs.fileInput?.click()"
              >
                📸 写真を追加 ({{ userProfile.photos?.length || 0 }}/4)
              </button>
              <button 
                v-if="userProfile.photos && userProfile.photos.length > 0"
                class="photo-remove-btn"
                @click="$emit('photo-remove', currentPhotoIndex + 1)"
              >
                🗑️ Photo{{ currentPhotoIndex + 1 }}を削除
              </button>
            </div>
          </div>

          <!-- PERSONAL WEBSITEバナー -->
          <div class="personal-website-section">
            <h3>Personal Website</h3>
            <div v-if="userProfile.personalWebsite" class="personal-website-banner">
              <div class="pixel-banner">
                <span class="banner-text">PERSONAL WEBSITE!</span>
              </div>
            </div>
            <div v-else class="website-placeholder">
              <p>Personal WebsiteのURLを設定してください</p>
            </div>
          </div>

          <!-- アイコン表示領域 -->
          <div class="icons-section">
            <h3>アイコン</h3>
            <div v-if="userProfile.icons && userProfile.icons.length > 0" class="icons-grid">
              <div 
                v-for="(icon, index) in userProfile.icons.slice(0, 6)"
                :key="index"
                class="icon-item"
                :title="userProfile.iconDescriptions?.[index] || `アイコン${index + 1}`"
              >
                <div class="icon-circle">
                  <span class="icon-emoji">{{ getIconEmoji(icon) }}</span>
                </div>
                <span class="icon-label">{{ userProfile.iconDescriptions?.[index] || `アイコン${index + 1}` }}</span>
              </div>
            </div>
            <div v-else class="icons-placeholder">
              <p>アイコンを設定してください（最大6個）</p>
            </div>
          </div>
        </div>

        <!-- 右側カラム: フォーム -->
        <div class="profile-form-right">
          <slot name="profile-form" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props - 親コンポーネントから受け取るデータ
interface Props {
  userProfile: {
    photos?: string[]
    personalWebsite?: string
    icons?: string[]
    iconDescriptions?: string[]
    [key: string]: any
  }
  currentPhotoIndex: number
}

defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
defineEmits<{
  'photo-prev': []
  'photo-next': []
  'photo-goto': [index: number]
  'photo-upload': [event: Event]
  'photo-remove': [photoNumber: number]
}>()

// アイコンファイル名からemojiを取得するヘルパー関数
const getIconEmoji = (iconName: string) => {
  const iconMap: { [key: string]: string } = {
    'vue.svg': '🟢', 'vue': '🟢',
    'react.svg': '⚛️', 'react': '⚛️',
    'typescript.svg': '🔷', 'typescript': '🔷',
    'javascript.svg': '🟨', 'javascript': '🟨',
    'python.svg': '🐍', 'python': '🐍',
    'figma.svg': '🎨', 'figma': '🎨',
    'sketch.svg': '💎', 'sketch': '💎',
    'photoshop.svg': '🖼️', 'photoshop': '🖼️',
    'illustrator.svg': '🎭', 'illustrator': '🎭',
    'nodejs.svg': '🟩', 'nodejs': '🟩',
    'docker.svg': '🐳', 'docker': '🐳',
    'git.svg': '📝', 'git': '📝',
    'github.svg': '🐙', 'github': '🐙',
    'aws.svg': '☁️', 'aws': '☁️',
    'firebase.svg': '🔥', 'firebase': '🔥'
  }
  
  const normalizedName = iconName.toLowerCase().replace(/\.(svg|png|jpg|jpeg)$/i, '')
  return iconMap[normalizedName] || iconMap[iconName.toLowerCase()] || '⚡'
}
</script>

<style scoped>
/* Profile Page専用スタイル */
.profile-page {
  padding: var(--spacing-12) 0;
  min-height: 80vh;
}

.profile-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.profile-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-2);
}

.profile-header p {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
}

.profile-content {
  display: flex;
  gap: var(--spacing-8);
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
}

/* 左側カラム */
.profile-card-left {
  flex: 0 0 400px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

.profile-card-left h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
}

/* 写真カルーセル */
.photo-carousel-section {
  margin-bottom: var(--spacing-8);
}

.photo-carousel-container {
  margin-bottom: var(--spacing-4);
}

.photo-carousel {
  width: 100%;
}

.carousel-main {
  position: relative;
  margin-bottom: var(--spacing-3);
}

.carousel-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--gray-100);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-counter {
  position: absolute;
  top: var(--spacing-2);
  right: var(--spacing-2);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 10px;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-2);
}

.carousel-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
}

.carousel-btn:hover:not(:disabled) {
  background: white;
  transform: scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: var(--spacing-2);
}

.carousel-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--gray-300);
  cursor: pointer;
  transition: all 0.2s ease;
}

.carousel-indicator.active {
  background: var(--primary-purple);
  transform: scale(1.2);
}

.photo-placeholder,
.website-placeholder,
.icons-placeholder {
  aspect-ratio: 4/5;
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
}

.placeholder-content {
  text-align: center;
  color: var(--gray-500);
}

.placeholder-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-2);
}

/* 写真アップロードコントロール */
.photo-upload-controls {
  display: flex;
  gap: var(--spacing-3);
  flex-direction: column;
}

.photo-upload-btn,
.photo-remove-btn {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: var(--white);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all var(--transition-base);
}

.photo-upload-btn:hover {
  background: var(--primary-purple-lighter);
  border-color: var(--primary-purple);
}

.photo-remove-btn:hover {
  background: var(--red-50);
  border-color: var(--red-300);
  color: var(--red-600);
}

/* Personal Website */
.personal-website-section {
  margin-bottom: var(--spacing-8);
}

.personal-website-banner {
  cursor: pointer;
  transition: transform var(--transition-base);
}

.personal-website-banner:hover {
  transform: scale(1.02);
}

.pixel-banner {
  background: linear-gradient(45deg, #FF6B9D, #4ECDC4, #9B7BD8);
  background-size: 400% 400%;
  animation: gradientAnimation 3s ease infinite;
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  text-align: center;
  color: white;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* アイコン */
.icons-section {
  margin-bottom: var(--spacing-8);
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-3);
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.icon-item:hover {
  background: var(--gray-50);
  transform: translateY(-2px);
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-purple-lighter);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-1);
}

.icon-emoji {
  font-size: 20px;
}

.icon-label {
  font-size: 10px;
  color: var(--gray-600);
  font-weight: 500;
}

/* 右側フォーム */
.profile-form-right {
  flex: 1;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  min-height: 600px;
  box-shadow: var(--shadow-sm);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }
  
  .profile-card-left {
    flex: none;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .photo-upload-controls {
    flex-direction: column;
  }
  
  .photo-upload-btn,
  .photo-remove-btn {
    width: 100%;
    min-width: unset;
  }
}
</style>