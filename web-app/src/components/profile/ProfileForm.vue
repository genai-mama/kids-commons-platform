<template>
  <!-- Profile Form - プロフィール編集フォーム -->
  <form @submit.prevent="handleSubmit" class="profile-form">
    <!-- Basic Information -->
    <div class="form-section">
      <h3>基本情報</h3>
      
      <div class="form-group">
        <label>名前 <span class="required">*</span></label>
        <input type="text" v-model="localProfile.name" required />
      </div>
      
      <div class="form-group">
        <label>役職 <span class="required">*</span></label>
        <input type="text" v-model="localProfile.role" required />
      </div>
      
      <div class="form-group">
        <label>自己紹介</label>
        <textarea
          v-model="localProfile.bio"
          rows="4"
          placeholder="あなたについて教えてください"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label>スキル（カンマ区切り）</label>
        <input
          type="text"
          v-model="localProfile.skillsString"
          placeholder="Vue.js, TypeScript, デザイン"
        />
      </div>
      
      <div class="form-group">
        <label>所在地</label>
        <input type="text" v-model="localProfile.location" placeholder="東京都" />
      </div>
      
      <div class="form-group">
        <label>プロフィール画像</label>
        <div class="avatar-upload">
          <div class="avatar-preview">
            <img 
              v-if="localProfile.avatar" 
              :src="localProfile.avatar" 
              :alt="localProfile.name" 
              class="avatar-image"
            />
            <div v-else class="avatar-placeholder">
              {{ localProfile.name ? localProfile.name.charAt(0) : '?' }}
            </div>
          </div>
          <div class="upload-actions">
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleImageUpload" 
              accept="image/*" 
              style="display: none"
            />
            <button type="button" class="btn-upload" @click="$refs.fileInput?.click()">
              画像を選択
            </button>
            <button 
              v-if="localProfile.avatar" 
              type="button" 
              class="btn-remove" 
              @click="removeAvatar"
            >
              削除
            </button>
          </div>
        </div>
        <small class="form-help">JPG、PNG形式の画像をアップロードできます（最大5MB）</small>
      </div>
      
      <div class="form-group">
        <label>バナー画像</label>
        <div class="banner-upload">
          <div class="banner-preview">
            <img 
              v-if="localProfile.bannerImage" 
              :src="localProfile.bannerImage" 
              :alt="localProfile.name" 
              class="banner-image"
            />
            <div v-else class="banner-placeholder">
              <span>バナー画像なし</span>
            </div>
          </div>
          <div class="upload-actions">
            <input 
              type="file" 
              ref="bannerFileInput" 
              @change="handleBannerUpload" 
              accept="image/*" 
              style="display: none"
            />
            <button type="button" class="btn-upload" @click="$refs.bannerFileInput?.click()">
              バナー画像を選択
            </button>
            <button 
              v-if="localProfile.bannerImage" 
              type="button" 
              class="btn-remove" 
              @click="removeBanner"
            >
              削除
            </button>
          </div>
        </div>
        <small class="form-help">横長のバナー画像を推奨します（最大5MB）</small>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="form-section">
      <h3>連絡先・SNS</h3>
      
      <div class="form-group">
        <label>WebサイトURL</label>
        <input type="url" v-model="localProfile.website" placeholder="https://yourwebsite.com" />
      </div>
      
      <div class="form-group">
        <label>TwitterURL</label>
        <input type="url" v-model="localProfile.twitter" placeholder="https://twitter.com/username" />
      </div>
      
      <div class="form-group">
        <label>GitHubURL</label>
        <input type="url" v-model="localProfile.github" placeholder="https://github.com/username" />
      </div>
    </div>

    <!-- Profile Card Settings -->
    <div class="form-section">
      <h3>プロフィールカード設定</h3>
      
      <div class="form-group">
        <label>アイコン（カンマ区切り、最大6個）</label>
        <input 
          type="text" 
          v-model="localProfile.iconsString" 
          placeholder="vue, typescript, figma"
        />
        <small class="form-help">利用可能: vue, react, typescript, javascript, python, figma, sketch, photoshop, illustrator, nodejs, docker, git, github, aws, firebase</small>
      </div>
      
      <div class="form-group">
        <label>アイコンの説明（カンマ区切り、アイコンと同じ順序）</label>
        <input 
          type="text" 
          v-model="localProfile.iconDescriptionsString" 
          placeholder="Vue.js, TypeScript, Figma"
        />
      </div>
    </div>

    <!-- Display Settings -->
    <div class="form-section">
      <h3>表示設定</h3>
      
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" v-model="localProfile.featured" />
          コアメンバーとして表示
        </label>
      </div>
      
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" v-model="localProfile.visible" />
          プロフィールを公開
        </label>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">
        プロフィールを保存
      </button>
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
        キャンセル
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

// Props - 親コンポーネントから受け取るデータ
interface Props {
  userProfile: {
    name: string
    role: string
    bio: string
    skills?: string[]
    skillsString?: string
    location: string
    website: string
    twitter: string
    github: string
    personalWebsite: string
    icons?: string[]
    iconsString?: string
    iconDescriptions?: string[]
    iconDescriptionsString?: string
    featured: boolean
    visible: boolean
    [key: string]: any
  }
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  save: []
  cancel: []
}>()

// Local state for form
const localProfile = ref({ ...props.userProfile })

// Handle form submission
const handleSubmit = () => {
  // Process skills
  if (localProfile.value.skillsString) {
    localProfile.value.skills = localProfile.value.skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill)
  }

  // Process icons
  if (localProfile.value.iconsString) {
    localProfile.value.icons = localProfile.value.iconsString
      .split(',')
      .map(icon => icon.trim())
      .filter(icon => icon)
      .slice(0, 6) // Maximum 6 icons
  }

  // Process icon descriptions
  if (localProfile.value.iconDescriptionsString) {
    localProfile.value.iconDescriptions = localProfile.value.iconDescriptionsString
      .split(',')
      .map(desc => desc.trim())
      .filter(desc => desc)
  }

  // Update the parent component's userProfile
  Object.assign(props.userProfile, localProfile.value)

  emit('save')
}

// Watch for prop changes to update local state
watch(() => props.userProfile, (newProfile) => {
  localProfile.value = { ...newProfile }
  initializeStringFields()
}, { deep: true })

// Initialize string fields from arrays
const initializeStringFields = () => {
  // Initialize skillsString from skills array
  if (localProfile.value.skills && Array.isArray(localProfile.value.skills) && !localProfile.value.skillsString) {
    localProfile.value.skillsString = localProfile.value.skills.join(', ')
  }

  // Initialize iconsString from icons array
  if (localProfile.value.icons && Array.isArray(localProfile.value.icons) && !localProfile.value.iconsString) {
    localProfile.value.iconsString = localProfile.value.icons.join(', ')
  }

  // Initialize iconDescriptionsString from iconDescriptions array
  if (localProfile.value.iconDescriptions && Array.isArray(localProfile.value.iconDescriptions) && !localProfile.value.iconDescriptionsString) {
    localProfile.value.iconDescriptionsString = localProfile.value.iconDescriptions.join(', ')
  }
}

// Image upload handling
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズが大きすぎます。5MB以下の画像を選択してください。')
    return
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('画像ファイルを選択してください。')
    return
  }
  
  // Convert to base64 for display and storage
  const reader = new FileReader()
  reader.onload = (e) => {
    localProfile.value.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  localProfile.value.avatar = ''
  // Clear file input
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// Banner upload handling
const handleBannerUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズが大きすぎます。5MB以下の画像を選択してください。')
    return
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('画像ファイルを選択してください。')
    return
  }
  
  // Convert to base64 for display and storage
  const reader = new FileReader()
  reader.onload = (e) => {
    localProfile.value.bannerImage = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeBanner = () => {
  localProfile.value.bannerImage = ''
  // Clear file input
  const bannerFileInput = document.querySelector('input[type="file"]:nth-of-type(2)') as HTMLInputElement
  if (bannerFileInput) {
    bannerFileInput.value = ''
  }
}

// Initialize form
onMounted(() => {
  initializeStringFields()
})
</script>

<style scoped>
/* Profile Form専用スタイル */
.profile-form {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
}

/* Form Sections */
.form-section {
  margin-bottom: var(--spacing-8);
  padding-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--gray-200);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h3 {
  margin: 0 0 var(--spacing-6) 0;
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
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

.required {
  color: var(--red-500);
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

.form-help {
  display: block;
  margin-top: var(--spacing-1);
  font-size: var(--font-size-xs);
  color: var(--gray-500);
  line-height: 1.4;
}

/* Checkbox styling */
.checkbox-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: var(--spacing-2);
  margin-bottom: 0;
}

/* Avatar Upload */
.avatar-upload {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--gray-400);
  background: var(--primary-purple-lighter);
  color: var(--primary-purple);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.btn-upload,
.btn-remove {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-upload {
  background: var(--primary-purple);
  color: var(--white);
}

.btn-upload:hover {
  background: var(--primary-purple-dark);
}

.btn-remove {
  background: var(--red-100);
  color: var(--red-600);
}

.btn-remove:hover {
  background: var(--red-200);
}

/* Banner Upload */
.banner-upload {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.banner-preview {
  width: 100%;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 2px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-placeholder {
  color: var(--gray-400);
  font-size: var(--font-size-sm);
  text-align: center;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-6);
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
  min-width: 120px;
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
  .profile-form {
    padding: var(--spacing-6);
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}
</style>