<template>
  <!-- Members Page - フィーチャードメンバーと全メンバー表示 -->
  <div class="members-page">
    <div class="container">
      <div class="page-header">
        <h1>Members</h1>
        <p>コミュニティのアクティブメンバーをご紹介します</p>
      </div>

      <div class="members-content">
        <!-- All Members (統合表示) -->
        <section class="all-members">
          <div class="members-grid" v-if="allMembers.length > 0">
            <div v-for="member in allMembers" :key="member.id" class="member-card" :class="{ 'featured': member.featured }">
              
              <!-- 左側カラム: 写真・バッジ・アイコンカテゴリ -->
              <div class="member-card-left">
                <!-- 縦長写真 -->
                <div class="member-photo">
                  <img 
                    :src="getRandomPhoto(member.id)" 
                    :alt="`${member.name}の写真`"
                    class="photo-image"
                  />
                </div>
                
                <!-- PERSONAL WEBSITE バッジ -->
                <div v-if="member.personalWebsite" class="website-badge">
                  <a :href="member.personalWebsite" target="_blank">
                    PERSONAL WEBSITE!
                  </a>
                </div>
                
                <!-- アイコンカテゴリ -->
                <div class="icon-categories">
                  <div 
                    v-for="category in getMemberCategories(member)" 
                    :key="category.id" 
                    class="category-item"
                    :title="category.name"
                  >
                    <div class="category-icon">{{ category.emoji }}</div>
                    <span class="category-label">{{ category.label }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 中央カラム: プロフィール情報 -->
              <div class="member-card-center">
                <div class="member-profile">
                  <h3 class="member-name">{{ member.name }}</h3>
                  <p class="member-role">{{ member.role }}</p>
                  <p class="member-bio" v-if="member.bio">{{ member.bio }}</p>
                  
                  <!-- 技術タグ -->
                  <div class="tech-tags" v-if="member.skills && member.skills.length > 0">
                    <span v-for="skill in member.skills.slice(0, 4)" :key="skill" class="tech-tag">
                      {{ skill }}
                    </span>
                    <span v-if="member.skills.length > 4" class="tech-tag more">+{{ member.skills.length - 4 }}</span>
                  </div>
                  
                  <!-- 参加日 -->
                  <div class="join-date">
                    <span>参加日: {{ formatJoinDate(member.joinDate) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 右側カラム: 吹き出しコメント -->
              <div class="member-card-right">
                <div class="comment-add-button">
                  <button @click="openCommentModal(member.id)" class="add-comment-btn" title="コメントを追加">
                    💬
                  </button>
                </div>
                
                <div class="speech-bubbles">
                  <div 
                    v-for="(comment, index) in getMemberComments(member.id).slice(0, 3)" 
                    :key="comment.id"
                    :class="['speech-bubble', index % 2 === 0 ? 'bubble-left' : 'bubble-right']"
                  >
                    <div class="bubble-content">
                      <div class="bubble-author">{{ comment.authorName }}</div>
                      <div class="bubble-text">{{ comment.content }}</div>
                      <div class="bubble-date">{{ comment.date }}</div>
                    </div>
                    <div class="bubble-tail"></div>
                  </div>
                  
                  <div v-if="getMemberComments(member.id).length === 0" class="no-comments">
                    <div class="empty-comment">
                      <span>コメントがありません</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          <div v-else class="no-members">
            <p>メンバーデータを読み込み中...</p>
          </div>
        </section>
      </div>
    </div>
  </div>
  
  <!-- Comment Modal -->
  <div v-if="showCommentModal" class="modal-overlay" @click="closeCommentModal">
    <div class="modal-content comment-modal" @click.stop>
      <div class="modal-header">
        <h3>コメントを追加</h3>
        <button class="modal-close" @click="closeCommentModal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="comment-author">お名前</label>
          <input
            id="comment-author"
            v-model="newComment.authorName"
            type="text"
            placeholder="あなたのお名前を入力してください"
            required
          />
        </div>
        <div class="form-group">
          <label for="comment-content">コメント</label>
          <textarea
            id="comment-content"
            v-model="newComment.content"
            placeholder="コメントを入力してください"
            rows="4"
            required
          ></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeCommentModal">キャンセル</button>
        <button class="btn btn-primary" @click="addComment">投稿</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

// Props - 親コンポーネントから受け取るデータ
interface Props {
  members: any[]
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
defineEmits<{
  navigate: [page: string]
}>()

// Comment system
const showCommentModal = ref(false)
const commentingMemberId = ref<number | null>(null)
const newComment = ref({
  authorName: "",
  content: "",
})
const memberComments = ref<any[]>([])

// 全メンバーを統合表示（コアメンバーを上位に）
const allMembers = computed(() => {
  const featured = props.members.filter(member => member.featured)
  const regular = props.members.filter(member => !member.featured)
  return [...featured, ...regular]
})

// Comment functions
const openCommentModal = (memberId: number) => {
  commentingMemberId.value = memberId
  showCommentModal.value = true
  // フォームをリセット
  newComment.value = {
    authorName: "",
    content: "",
  }
}

const closeCommentModal = () => {
  showCommentModal.value = false
  commentingMemberId.value = null
}

const addComment = () => {
  if (!newComment.value.authorName.trim() || !newComment.value.content.trim()) {
    alert("名前とコメントを入力してください")
    return
  }
  
  const comment = {
    id: Date.now(),
    memberId: commentingMemberId.value,
    authorName: newComment.value.authorName.trim(),
    content: newComment.value.content.trim(),
    date: new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    position: Math.random() < 0.5 ? 'left' : 'right' // ランダムに左右を決定
  }
  
  memberComments.value.push(comment)
  
  // localStorage に保存
  localStorage.setItem('memberComments', JSON.stringify(memberComments.value))
  
  closeCommentModal()
  
  // 成功メッセージを表示
  alert("コメントを追加しました！")
}

const getMemberComments = (memberId: number) => {
  return memberComments.value.filter(comment => comment.memberId === memberId)
}

// ランダム写真を取得
const getRandomPhoto = (memberId: number) => {
  const photoIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const photoId = photoIds[memberId % photoIds.length]
  return `https://picsum.photos/200/280?random=${photoId}`
}

// メンバーのカテゴリを取得
const getMemberCategories = (member: any) => {
  const categories = []
  
  // DEV category for developers
  if (member.skills && member.skills.some((skill: string) => 
    ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'Python', 'Node.js'].includes(skill)
  )) {
    categories.push({ id: 'dev', emoji: '👩‍💻', label: 'DEV', name: 'Developer' })
  }
  
  // MOM category for all members (assuming this is a mom community)
  categories.push({ id: 'mom', emoji: '👩‍👧‍👦', label: 'MOM', name: 'Mom' })
  
  // DESIGN category for designers
  if (member.skills && member.skills.some((skill: string) => 
    ['Figma', 'Sketch', 'Photoshop', 'Illustrator'].includes(skill)
  )) {
    categories.push({ id: 'design', emoji: '🎨', label: 'DESIGN', name: 'Designer' })
  }
  
  // AI category for AI enthusiasts
  if (member.bio && member.bio.toLowerCase().includes('ai') || 
      member.role && member.role.toLowerCase().includes('ai')) {
    categories.push({ id: 'ai', emoji: '🤖', label: 'AI', name: 'AI Enthusiast' })
  }
  
  return categories.slice(0, 3) // 最大3個まで
}

// 参加日をフォーマット
const formatJoinDate = (joinDate: string) => {
  if (!joinDate) return '不明'
  
  try {
    const date = new Date(joinDate)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return '不明'
  }
}

// Load comments from localStorage on mount
onMounted(() => {
  const savedComments = localStorage.getItem('memberComments')
  if (savedComments) {
    try {
      memberComments.value = JSON.parse(savedComments)
    } catch (error) {
      console.error('Failed to load comments:', error)
      memberComments.value = []
    }
  }
})
</script>

<style scoped>
/* Members Page専用スタイル */
.members-page {
  padding: var(--spacing-12) 0;
  min-height: 80vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.page-header h1 {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
}

.page-header p {
  font-size: var(--font-size-xl);
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.members-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.all-members {
  margin-bottom: var(--spacing-20);
}

/* レスポンシブグリッド */
.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--spacing-8);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: var(--spacing-10);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: var(--spacing-8);
  }
  
  @media (min-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-10);
  }
}

/* Member Card Styles */
.member-card {
  background: linear-gradient(135deg, #fdfbfb 0%, #faf8ff 100%);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(155, 123, 216, 0.12);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(155, 123, 216, 0.1);
  position: relative;
  display: grid;
  grid-template-columns: 140px 1fr 180px;
  min-height: 360px;
  padding: var(--spacing-6);
  gap: var(--spacing-4);
}

.member-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(155, 123, 216, 0.2);
}

.member-card.featured {
  border: 2px solid var(--primary-purple);
  background: linear-gradient(135deg, #fdfbfb 0%, #f3f0ff 100%);
  box-shadow: 0 12px 40px rgba(155, 123, 216, 0.25);
}

.member-card.featured::before {
  content: '⭐';
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 20px;
  opacity: 0.7;
}

/* 左側カラム: 写真・バッジ・アイコンカテゴリ */
.member-card-left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.member-photo {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 5/7; /* 縦長 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.member-card:hover .photo-image {
  transform: scale(1.05);
}

.website-badge {
  position: relative;
  margin-top: var(--spacing-2);
}

.website-badge a {
  display: inline-block;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  color: #333;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 8px rgba(255, 107, 107, 0.3);
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
  border: 2px solid #fff;
}

.website-badge a:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

.icon-categories {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.category-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(155, 123, 216, 0.1);
  transition: all 0.2s ease;
}

.category-item:hover {
  background: rgba(155, 123, 216, 0.1);
  transform: translateX(4px);
}

.category-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.category-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 中央カラム: プロフィール情報 */
.member-card-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-2) 0;
}

.member-profile {
  text-align: left;
}

.member-name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-1);
  line-height: 1.2;
}

.member-role {
  font-size: var(--font-size-base);
  color: var(--primary-purple);
  font-weight: 600;
  margin-bottom: var(--spacing-3);
}

.member-bio {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: var(--spacing-4);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-4);
}

.tech-tag {
  background: linear-gradient(135deg, var(--primary-purple) 0%, #8b5cf6 100%);
  color: white;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(155, 123, 216, 0.3);
}

.tech-tag.more {
  background: var(--gray-200);
  color: var(--gray-600);
}

.join-date {
  margin-top: auto;
  padding-top: var(--spacing-2);
}

.join-date span {
  font-size: 11px;
  color: var(--gray-500);
  font-weight: 500;
}

/* 右側カラム: 吹き出しコメント */
.member-card-right {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  position: relative;
}

.comment-add-button {
  display: flex;
  justify-content: center;
}

.add-comment-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--primary-purple) 0%, #8b5cf6 100%);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(155, 123, 216, 0.3);
}

.add-comment-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(155, 123, 216, 0.4);
}

.speech-bubbles {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  height: 100%;
}

.speech-bubble {
  position: relative;
  max-width: 140px;
  animation: fadeInUp 0.3s ease;
}

.bubble-left {
  align-self: flex-start;
}

.bubble-right {
  align-self: flex-end;
}

.bubble-content {
  background: linear-gradient(135deg, #e879f9 0%, #c084fc 100%);
  color: white;
  padding: 8px 10px;
  border-radius: 16px;
  font-size: 11px;
  line-height: 1.4;
  box-shadow: 0 2px 8px rgba(232, 121, 249, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.bubble-right .bubble-content {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);
}

.bubble-tail {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.bubble-left .bubble-tail {
  left: 8px;
  bottom: -8px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #c084fc;
}

.bubble-right .bubble-tail {
  right: 8px;
  bottom: -8px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #0891b2;
}

.bubble-author {
  font-weight: 600;
  margin-bottom: 2px;
  opacity: 0.9;
}

.bubble-text {
  margin-bottom: 2px;
}

.bubble-date {
  font-size: 9px;
  opacity: 0.7;
}

.no-comments .empty-comment {
  background: rgba(155, 123, 216, 0.1);
  color: var(--gray-500);
  padding: 8px;
  border-radius: 12px;
  font-size: 11px;
  text-align: center;
  border: 1px dashed rgba(155, 123, 216, 0.3);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Comment Section */
.comment-section-header {
  text-align: center;
  margin-bottom: var(--spacing-3);
  padding: var(--spacing-3);
}

.comment-section-header .comment-icon {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-xs);
  font-weight: 500;
  transition: all var(--transition-base);
  display: inline-block;
}

.comment-section-header .comment-icon:hover {
  background: var(--primary-purple);
  color: white;
  transform: translateY(-2px);
}

/* Member Messages Container */
.member-messages-container {
  position: absolute;
  top: 60px;
  right: var(--spacing-4);
  bottom: 8px;
  left: var(--spacing-4);
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.member-messages-scroll {
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

/* Message Bubbles */
.message-bubble {
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  background: var(--white);
  border: 1px solid var(--gray-200);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.message-bubble:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.message-left {
  margin-right: var(--spacing-4);
  border-left: 3px solid var(--primary-purple);
}

.message-right {
  margin-left: var(--spacing-4);
  border-right: 3px solid var(--primary-purple-light);
}

.message-content {
  font-size: var(--font-size-xs);
}

.message-author {
  font-weight: 600;
  color: var(--primary-purple);
  margin-bottom: var(--spacing-1);
}

.message-text {
  color: var(--gray-700);
  line-height: 1.3;
  margin-bottom: var(--spacing-1);
}

.message-date {
  color: var(--gray-500);
  font-size: 10px;
}

/* No Comments State */
.no-comments {
  padding: var(--spacing-4);
  text-align: center;
  color: var(--gray-500);
  font-style: italic;
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-4);
}

.no-members {
  text-align: center;
  padding: var(--spacing-20);
  color: var(--gray-500);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--gray-500);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.modal-close:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-footer {
  padding: var(--spacing-6);
  border-top: 1px solid var(--gray-200);
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

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

.no-members {
  text-align: center;
  padding: var(--spacing-20);
  color: var(--gray-500);
  font-size: var(--font-size-lg);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .members-page {
    padding: var(--spacing-8) 0;
  }
  
  .page-header h1 {
    font-size: var(--font-size-3xl);
  }
  
  .page-header p {
    font-size: var(--font-size-lg);
  }
  
  .members-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
  
  .member-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    min-height: auto;
    padding: var(--spacing-4);
  }
  
  .member-card-left,
  .member-card-center,
  .member-card-right {
    grid-column: 1;
  }
  
  .member-card-left {
    grid-row: 1;
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-template-rows: auto auto;
    gap: var(--spacing-2);
  }
  
  .member-photo {
    grid-column: 1;
    grid-row: 1 / 3;
    aspect-ratio: 4/5;
  }
  
  .website-badge {
    grid-column: 2;
    grid-row: 1;
    align-self: start;
    margin-top: 0;
  }
  
  .icon-categories {
    grid-column: 2;
    grid-row: 2;
    align-self: end;
  }
  
  .member-card-center {
    grid-row: 2;
    padding: var(--spacing-3) 0;
  }
  
  .member-card-right {
    grid-row: 3;
    max-height: 120px;
  }
  
  .speech-bubbles {
    flex-direction: row;
    gap: var(--spacing-1);
    overflow-x: auto;
    padding-bottom: var(--spacing-1);
  }
  
  .speech-bubble {
    flex-shrink: 0;
    max-width: 120px;
  }
  
  .modal-content {
    margin: var(--spacing-4);
    width: calc(100% - 2 * var(--spacing-4));
  }
  
  .modal-footer {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}
</style>