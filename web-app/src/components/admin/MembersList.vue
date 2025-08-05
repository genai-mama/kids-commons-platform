<template>
  <!-- Members List - メンバー一覧管理 -->
  <div class="members-list">
    <div v-if="members.length === 0" class="empty-state">
      <p>メンバーがいません</p>
    </div>
    
    <div v-else class="admin-items">
      <div
        v-for="member in members"
        :key="member.id"
        class="admin-item"
      >
        <div class="admin-item-content">
          <div class="member-header">
            <div class="member-avatar-small" v-if="member.avatar">
              <img :src="member.avatar" :alt="member.name" />
            </div>
            <div class="member-avatar-small member-avatar-fallback" v-else>
              {{ getInitials(member.name) }}
            </div>
            
            <div class="member-info">
              <h4>{{ member.name }}</h4>
              <p class="member-role">{{ member.role }}</p>
            </div>
            
            <div class="member-badges">
              <span v-if="member.featured" class="badge badge-featured">コア</span>
              <span v-if="!member.visible" class="badge badge-hidden">非公開</span>
            </div>
          </div>
          
          <p class="member-bio">{{ member.bio }}</p>
          
          <div class="member-meta">
            <div class="meta-row">
              <span class="meta-label">参加日:</span>
              <span>{{ formatDate(member.joinDate) }}</span>
            </div>
            
            <div class="meta-row" v-if="member.skills && member.skills.length">
              <span class="meta-label">スキル:</span>
              <div class="skills-tags">
                <span 
                  v-for="skill in member.skills.slice(0, 3)" 
                  :key="skill" 
                  class="skill-tag"
                >
                  {{ skill }}
                </span>
                <span v-if="member.skills.length > 3" class="skill-more">
                  +{{ member.skills.length - 3 }}
                </span>
              </div>
            </div>
            
            <div class="meta-row" v-if="member.location">
              <span class="meta-label">所在地:</span>
              <span>{{ member.location }}</span>
            </div>
            
            <div class="meta-row" v-if="hasContactInfo(member)">
              <span class="meta-label">連絡先:</span>
              <div class="contact-links">
                <a v-if="member.website" :href="member.website" target="_blank" title="Website">🌐</a>
                <a v-if="member.twitter" :href="member.twitter" target="_blank" title="Twitter">🐦</a>
                <a v-if="member.github" :href="member.github" target="_blank" title="GitHub">🐙</a>
              </div>
            </div>
            
            <div class="meta-row" v-if="hasProfileExtras(member)">
              <span class="meta-label">プロフィール:</span>
              <div class="profile-extras">
                <span v-if="member.photos && member.photos.length" class="extra-item">
                  📷 {{ member.photos.length }}枚
                </span>
                <span v-if="member.icons && member.icons.length" class="extra-item">
                  🧩 {{ member.icons.length }}個
                </span>
                <span v-if="member.personalWebsite" class="extra-item">
                  🎨 個人サイト
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="admin-item-actions">
          <button 
            class="btn-action btn-edit" 
            @click="$emit('edit', member)"
            title="編集"
          >
            ✏️
          </button>
          <button 
            class="btn-action btn-duplicate" 
            @click="$emit('duplicate', member.id)"
            title="複製"
          >
            📋
          </button>
          <button 
            class="btn-action btn-delete" 
            @click="handleDelete(member)"
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
  members: Array<{
    id: number
    name: string
    role: string
    bio: string
    avatar?: string
    skills?: string[]
    location?: string
    website?: string
    twitter?: string
    github?: string
    personalWebsite?: string
    photos?: string[]
    icons?: string[]
    joinDate: string
    featured: boolean
    visible: boolean
    [key: string]: any
  }>
}

defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  edit: [member: any]
  delete: [memberId: number]
  duplicate: [memberId: number]
}>()

// Helper functions
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

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

const hasContactInfo = (member: any) => {
  return member.website || member.twitter || member.github
}

const hasProfileExtras = (member: any) => {
  return (member.photos && member.photos.length) || 
         (member.icons && member.icons.length) || 
         member.personalWebsite
}

const handleDelete = (member: any) => {
  if (confirm(`メンバー「${member.name}」を削除しますか？この操作は取り消せません。`)) {
    emit('delete', member.id)
  }
}
</script>

<style scoped>
/* Members List専用スタイル */
.members-list {
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

/* Member Header */
.member-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.member-avatar-small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid var(--gray-200);
}

.member-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-avatar-fallback {
  background: var(--primary-purple);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-info h4 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--gray-900);
}

.member-role {
  margin: 0;
  color: var(--primary-purple);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.member-badges {
  display: flex;
  gap: var(--spacing-2);
  flex-shrink: 0;
}

.badge {
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-featured {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple);
}

.badge-hidden {
  background: var(--gray-200);
  color: var(--gray-600);
}

/* Member Bio */
.member-bio {
  margin: 0 0 var(--spacing-4) 0;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Member Meta */
.member-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.meta-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
}

.meta-label {
  color: var(--gray-500);
  font-weight: 500;
  min-width: 60px;
  flex-shrink: 0;
}

.skills-tags {
  display: flex;
  gap: var(--spacing-1);
  flex-wrap: wrap;
}

.skill-tag {
  background: var(--gray-100);
  color: var(--gray-600);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 500;
}

.skill-more {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 500;
}

.contact-links {
  display: flex;
  gap: var(--spacing-2);
}

.contact-links a {
  text-decoration: none;
  font-size: 16px;
  transition: transform var(--transition-base);
}

.contact-links a:hover {
  transform: scale(1.2);
}

.profile-extras {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.extra-item {
  color: var(--gray-600);
  font-size: 10px;
  background: var(--gray-100);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-sm);
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
  
  .member-header {
    flex-wrap: wrap;
  }
  
  .meta-row {
    flex-direction: column;
    gap: var(--spacing-1);
  }
  
  .meta-label {
    min-width: auto;
  }
}
</style>