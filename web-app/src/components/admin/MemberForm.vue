<template>
  <!-- Member Form - メンバーフォーム（編集のみ） -->
  <form @submit.prevent="handleSubmit" class="member-form">
    <!-- Basic Information -->
    <div class="form-section">
      <h4>基本情報</h4>
      
      <div class="form-group">
        <label>名前</label>
        <input type="text" v-model="localMember.name" required />
      </div>
      
      <div class="form-group">
        <label>役割</label>
        <input type="text" v-model="localMember.role" required />
      </div>
      
      <div class="form-group">
        <label>自己紹介</label>
        <textarea
          v-model="localMember.bio"
          required
          rows="4"
          placeholder="自己紹介を入力してください"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label>アバターURL</label>
        <input type="url" v-model="localMember.avatar" placeholder="https://example.com/avatar.jpg" />
      </div>
      
      <div class="form-group">
        <label>スキル（カンマ区切り）</label>
        <input
          type="text"
          v-model="localMember.skillsString"
          placeholder="Vue.js, TypeScript, デザイン"
        />
      </div>
      
      <div class="form-group">
        <label>所在地</label>
        <input type="text" v-model="localMember.location" placeholder="東京都" />
      </div>
    </div>

    <!-- Contact Information -->
    <div class="form-section">
      <h4>連絡先・SNS</h4>
      
      <div class="form-group">
        <label>WebサイトURL</label>
        <input type="url" v-model="localMember.website" placeholder="https://yourwebsite.com" />
      </div>
      
      <div class="form-group">
        <label>TwitterURL</label>
        <input type="url" v-model="localMember.twitter" placeholder="https://twitter.com/username" />
      </div>
      
      <div class="form-group">
        <label>GitHubURL</label>
        <input type="url" v-model="localMember.github" placeholder="https://github.com/username" />
      </div>
    </div>

    <!-- Profile Card Information -->
    <div class="form-section">
      <h4>プロフィールカード設定</h4>
      
      <div class="form-group">
        <label>PERSONAL WEBSITE URL</label>
        <input type="url" v-model="localMember.personalWebsite" placeholder="個人サイトのURL" />
        <small class="form-help">ピクセルアートバナーで表示されます</small>
      </div>
      
      <div class="form-group">
        <label>技術アイコン（カンマ区切り、最大6個）</label>
        <input 
          type="text" 
          v-model="localMember.iconsString" 
          placeholder="vue, react, typescript, figma, nodejs, python"
        />
        <small class="form-help">利用可能: vue, react, typescript, javascript, python, figma, sketch, photoshop, illustrator, nodejs, docker, git, github, aws, firebase</small>
      </div>
      
      <div class="form-group">
        <label>写真（Base64またはURL、カンマ区切り、最大4枚）</label>
        <textarea
          v-model="localMember.photosString"
          rows="3"
          placeholder="写真のURLやBase64データをカンマ区切りで入力"
        ></textarea>
        <small class="form-help">4:5のアスペクト比で表示されます</small>
      </div>
    </div>

    <!-- Display Options -->
    <div class="form-section">
      <h4>表示設定</h4>
      
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="localMember.featured" />
          コアメンバーとして表示
        </label>
      </div>
      
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="localMember.visible" />
          プロフィールを公開
        </label>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">
        更新
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
  member: {
    name: string
    role: string
    bio: string
    avatar: string
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
    photos?: string[]
    photosString?: string
    featured: boolean
    visible: boolean
    [key: string]: any
  }
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  save: [member: any]
  cancel: []
}>()

// Local state for form
const localMember = ref({ ...props.member })

// Predefined icon configurations
const getIconConfig = (iconId: string) => {
  const iconConfigs = {
    vue: { name: 'Vue.js', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    react: { name: 'React', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    typescript: { name: 'TypeScript', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    javascript: { name: 'JavaScript', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    python: { name: 'Python', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    nodejs: { name: 'Node.js', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    figma: { name: 'Figma', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
    sketch: { name: 'Sketch', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg' },
    photoshop: { name: 'Photoshop', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg' },
    illustrator: { name: 'Illustrator', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
    docker: { name: 'Docker', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    git: { name: 'Git', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    github: { name: 'GitHub', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    aws: { name: 'AWS', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
    firebase: { name: 'Firebase', thumbnailUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' }
  }
  return iconConfigs[iconId] || { name: iconId, thumbnailUrl: `https://via.placeholder.com/32/9B7BD8/FFFFFF?text=${iconId.charAt(0).toUpperCase()}` }
}

// Handle form submission
const handleSubmit = () => {
  // Process skills
  if (localMember.value.skillsString) {
    localMember.value.skills = localMember.value.skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill)
  }

  // Process icons with new format
  if (localMember.value.iconsString) {
    const iconIds = localMember.value.iconsString
      .split(',')
      .map(icon => icon.trim())
      .filter(icon => icon)
      .slice(0, 6) // Maximum 6 icons
    
    localMember.value.icons = iconIds.map(iconId => ({
      id: iconId,
      ...getIconConfig(iconId)
    }))
  }

  // Process photos
  if (localMember.value.photosString) {
    localMember.value.photos = localMember.value.photosString
      .split(',')
      .map(photo => photo.trim())
      .filter(photo => photo)
      .slice(0, 4) // Maximum 4 photos
  }

  emit('save', { ...localMember.value })
}

// Watch for prop changes to update local state
watch(() => props.member, (newMember) => {
  localMember.value = { ...newMember }
  initializeStringFields()
}, { deep: true })

// Initialize string fields from arrays
const initializeStringFields = () => {
  // Initialize skillsString from skills array
  if (localMember.value.skills && !localMember.value.skillsString) {
    localMember.value.skillsString = localMember.value.skills.join(', ')
  }

  // Initialize iconsString from icons array (new format)
  if (localMember.value.icons && !localMember.value.iconsString) {
    localMember.value.iconsString = localMember.value.icons.map(icon => icon.id || icon).join(', ')
  }

  // Initialize photosString from photos array
  if (localMember.value.photos && !localMember.value.photosString) {
    localMember.value.photosString = localMember.value.photos.join(', ')
  }
}

// Initialize form
onMounted(() => {
  initializeStringFields()
})
</script>

<style scoped>
/* Member Form専用スタイル */
.member-form {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
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

.form-section h4 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-lg);
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