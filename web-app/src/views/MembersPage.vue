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
            <div 
              v-for="member in allMembers" 
              :key="member.id" 
              class="member-card" 
              :class="{ 'featured': member.featured }"
              :data-member-id="member.id"
            >
              
              <!-- 左側カラム: 写真・バッジ・アイコンカテゴリ -->
              <div class="member-card-left">
                <!-- 縦長写真（スワイプ機能付き） -->
                <div class="member-photo" :class="{ 'has-multiple-photos': hasMultiplePhotos(member) }">
                  <div v-if="getMemberPhotos(member).length > 0" class="photo-carousel">
                    <div 
                      class="photo-container"
                      @touchstart="handleTouchStart($event, member.id)"
                      @touchmove="handleTouchMove"
                      @touchend="handleTouchEnd($event, member.id)"
                      @mousedown="handleMouseDown($event, member.id)"
                      @mousemove="handleMouseMove"
                      @mouseup="handleMouseEnd($event, member.id)"
                      @mouseleave="handleMouseEnd($event, member.id)"
                    >
                      <img 
                        :src="getCurrentPhoto(member)" 
                        :alt="`${member.name}の写真 ${getCurrentPhotoIndex(member.id) + 1}/${getMemberPhotos(member).length}`"
                        class="photo-image"
                      />
                      <!-- 複数写真がある場合の左右ナビゲーション -->
                      <div v-if="getMemberPhotos(member).length > 1" class="photo-navigation">
                        <button 
                          class="nav-btn nav-prev" 
                          @click="previousPhoto(member.id)"
                          :title="'前の写真'"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                          </svg>
                        </button>
                        <button 
                          class="nav-btn nav-next" 
                          @click="nextPhoto(member.id)"
                          :title="'次の写真'"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                          </svg>
                        </button>
                      </div>
                      <!-- 写真インジケーター -->
                      <div v-if="getMemberPhotos(member).length > 1" class="photo-indicators">
                        <button 
                          v-for="(photo, index) in getMemberPhotos(member)" 
                          :key="index"
                          :class="['indicator', { active: getCurrentPhotoIndex(member.id) === index }]"
                          @click="setCurrentPhoto(member.id, index)"
                        ></button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="photo-placeholder">
                    <div class="placeholder-avatar">
                      {{ member.name ? member.name.charAt(0) : '?' }}
                    </div>
                    <span class="placeholder-text">写真なし</span>
                  </div>
                </div>
                
                <!-- バナー画像またはPERSONAL WEBSITEバッジ -->
                <div v-if="member.personalWebsite">
                  <!-- バナー画像がある場合 -->
                  <div v-if="member.bannerImage" class="member-banner">
                    <a :href="member.personalWebsite" target="_blank">
                      <img 
                        :src="member.bannerImage" 
                        :alt="`${member.name}のバナー`"
                        class="banner-image"
                      />
                    </a>
                  </div>
                  <!-- バナー画像がない場合はPERSONAL WEBSITEバッジ -->
                  <div v-else class="website-badge">
                    <a :href="member.personalWebsite" target="_blank">
                      PERSONAL WEBSITE!
                    </a>
                  </div>
                </div>
                
                <!-- アイコンカテゴリ - 仕様不確定のため非表示 -->
                <!-- <div class="icon-categories">
                  <div 
                    v-for="category in getMemberCategories(member)" 
                    :key="category.id" 
                    class="category-item"
                    :title="category.name"
                  >
                    <div class="category-icon">{{ category.emoji }}</div>
                    <span class="category-label">{{ category.label }}</span>
                  </div>
                </div> -->
              </div>
              
              <!-- 中央カラム: プロフィール情報 -->
              <div class="member-card-center">
                <div class="member-profile">
                  <!-- プロフィールアバター -->
                  <div class="member-avatar">
                    <img 
                      v-if="getMemberAvatar(member)"
                      :src="getMemberAvatar(member)" 
                      :alt="`${member.name}のアバター`"
                      class="avatar-image"
                    />
                    <div v-else class="avatar-placeholder">
                      {{ member.name ? member.name.charAt(0) : '?' }}
                    </div>
                  </div>
                  
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
                  
                  <!-- SNSアイコン -->
                  <div class="social-links" v-if="member.github || member.twitter">
                    <a v-if="member.github" :href="member.github" target="_blank" class="social-link github" title="GitHub">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a v-if="member.twitter" :href="member.twitter" target="_blank" class="social-link twitter" title="X (Twitter)">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  </div>
                  
                  <!-- 参加日 -->
                  <div class="join-date">
                    <span>参加日: {{ formatJoinDate(member.joinDate) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 右側カラム: 吹き出しコメント -->
              <div class="member-card-right">
                <div class="speech-bubbles">
                  <div 
                    v-for="(comment, index) in getMemberComments(member.id).slice(0, 3)" 
                    :key="comment.id"
                    :class="['speech-bubble', index % 2 === 0 ? 'bubble-left' : 'bubble-right']"
                    @click="scrollToMemberByName(comment.authorName)"
                  >
                    <div class="bubble-content">
                      <div class="bubble-author">{{ comment.authorName }}</div>
                      <div class="bubble-text">{{ comment.content }}</div>
                      <div class="bubble-date">{{ comment.date }}</div>
                    </div>
                  </div>
                  
                  <div v-if="getMemberComments(member.id).length === 0" class="no-comments">
                    <div class="empty-comment">
                      <span>コメントがありません</span>
                    </div>
                  </div>
                </div>
                
                <!-- メッセージ送信欄風コメント追加ボタン -->
                <div class="comment-input-area">
                  <button @click="openCommentModal(member.id)" class="message-send-btn" title="コメントを追加">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </button>
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
        <!-- 自分のカードの場合は名前を自由記入、他人のカードは自分の名前で固定 -->
        <div class="form-group" v-if="isOwnCard">
          <label for="comment-author">お名前</label>
          <input
            id="comment-author"
            v-model="newComment.authorName"
            type="text"
            placeholder="あなたのお名前を入力してください"
            required
          />
        </div>
        <div class="form-group" v-else>
          <label for="comment-author">お名前</label>
          <input
            id="comment-author"
            v-model="newComment.authorName"
            type="text"
            :placeholder="currentUserName"
            readonly
            class="readonly-input"
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
  currentUser?: {
    name: string
    email: string
    [key: string]: any
  }
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

// Photo carousel state
const currentPhotoIndexes = ref<Record<number, number>>({})
const swipeState = ref({
  isSwipe: false,
  startX: 0,
  currentX: 0,
  memberId: null as number | null
})

// 全メンバーを統合表示（コアメンバーを上位に）
const allMembers = computed(() => {
  const featured = props.members.filter(member => member.featured)
  const regular = props.members.filter(member => !member.featured)
  return [...featured, ...regular]
})

// ログインユーザーの情報
const currentUserName = computed(() => props.currentUser?.name || '')

// 現在コメントしようとしているカードが自分のカードかどうか
const isOwnCard = computed(() => {
  const targetMember = props.members.find(m => m.id === commentingMemberId.value)
  return targetMember?.email === props.currentUser?.email
})

// Comment functions
const openCommentModal = (memberId: number) => {
  commentingMemberId.value = memberId
  showCommentModal.value = true
  
  // 対象メンバーを取得
  const targetMember = props.members.find(m => m.id === memberId)
  const isOwn = targetMember?.email === props.currentUser?.email
  
  // フォームを初期化
  newComment.value = {
    authorName: isOwn ? "" : (props.currentUser?.name || ""),
    content: "",
  }
}

const closeCommentModal = () => {
  showCommentModal.value = false
  commentingMemberId.value = null
}

const addComment = () => {
  // 自分のカードの場合は名前の入力チェック、他人のカードの場合は自動で名前が設定される
  if (!newComment.value.content.trim()) {
    alert("コメントを入力してください")
    return
  }
  
  if (isOwnCard.value && !newComment.value.authorName.trim()) {
    alert("名前を入力してください")
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

// メンバーの写真配列を取得
const getMemberPhotos = (member: any) => {
  if (member.photos && Array.isArray(member.photos) && member.photos.length > 0) {
    return member.photos
  }
  return []
}

// 複数写真があるかチェック
const hasMultiplePhotos = (member: any) => {
  return getMemberPhotos(member).length > 1
}

// 現在の写真インデックスを取得
const getCurrentPhotoIndex = (memberId: number) => {
  return currentPhotoIndexes.value[memberId] || 0
}

// 現在表示する写真を取得
const getCurrentPhoto = (member: any) => {
  const photos = getMemberPhotos(member)
  if (photos.length === 0) return null
  
  const index = getCurrentPhotoIndex(member.id)
  return photos[index] || photos[0]
}

// 次の写真に切り替え（ループ）
const nextPhoto = (memberId: number) => {
  const member = props.members.find(m => m.id === memberId)
  if (!member) return
  
  const photos = getMemberPhotos(member)
  if (photos.length <= 1) return
  
  const currentIndex = getCurrentPhotoIndex(memberId)
  const nextIndex = (currentIndex + 1) % photos.length
  currentPhotoIndexes.value[memberId] = nextIndex
}

// 前の写真に切り替え（ループ）
const previousPhoto = (memberId: number) => {
  const member = props.members.find(m => m.id === memberId)
  if (!member) return
  
  const photos = getMemberPhotos(member)
  if (photos.length <= 1) return
  
  const currentIndex = getCurrentPhotoIndex(memberId)
  const prevIndex = (currentIndex - 1 + photos.length) % photos.length
  currentPhotoIndexes.value[memberId] = prevIndex
}

// 特定の写真に切り替え
const setCurrentPhoto = (memberId: number, index: number) => {
  const member = props.members.find(m => m.id === memberId)
  if (!member) return
  
  const photos = getMemberPhotos(member)
  if (index >= 0 && index < photos.length) {
    currentPhotoIndexes.value[memberId] = index
  }
}

// タッチスワイプハンドラー
const handleTouchStart = (event: TouchEvent, memberId: number) => {
  swipeState.value = {
    isSwipe: true,
    startX: event.touches[0].clientX,
    currentX: event.touches[0].clientX,
    memberId
  }
}

const handleTouchMove = (event: TouchEvent) => {
  if (!swipeState.value.isSwipe) return
  swipeState.value.currentX = event.touches[0].clientX
}

const handleTouchEnd = (event: TouchEvent, memberId: number) => {
  if (!swipeState.value.isSwipe) return
  
  const deltaX = swipeState.value.currentX - swipeState.value.startX
  const threshold = 50 // スワイプの閾値
  
  if (Math.abs(deltaX) > threshold) {
    if (deltaX > 0) {
      // 右にスワイプ → 前の写真
      previousPhoto(memberId)
    } else {
      // 左にスワイプ → 次の写真
      nextPhoto(memberId)
    }
  }
  
  swipeState.value = {
    isSwipe: false,
    startX: 0,
    currentX: 0,
    memberId: null
  }
}

// マウスドラッグハンドラー（デスクトップ用）
const handleMouseDown = (event: MouseEvent, memberId: number) => {
  swipeState.value = {
    isSwipe: true,
    startX: event.clientX,
    currentX: event.clientX,
    memberId
  }
  event.preventDefault()
}

const handleMouseMove = (event: MouseEvent) => {
  if (!swipeState.value.isSwipe) return
  swipeState.value.currentX = event.clientX
}

const handleMouseEnd = (event: MouseEvent, memberId: number) => {
  if (!swipeState.value.isSwipe) return
  
  const deltaX = swipeState.value.currentX - swipeState.value.startX
  const threshold = 50
  
  if (Math.abs(deltaX) > threshold) {
    if (deltaX > 0) {
      previousPhoto(memberId)
    } else {
      nextPhoto(memberId)
    }
  }
  
  swipeState.value = {
    isSwipe: false,
    startX: 0,
    currentX: 0,
    memberId: null
  }
}

// コメント作成者のメンバー情報にスクロール
const scrollToMemberByName = (authorName: string) => {
  // 作成者名からメンバーを検索（部分一致も考慮）
  const targetMember = props.members.find(member => {
    // 完全一致を優先
    if (member.name === authorName) return true
    // 部分一致も確認（名前の一部が含まれている場合）
    if (member.name.includes(authorName) || authorName.includes(member.name)) return true
    return false
  })
  
  if (!targetMember) {
    console.log('対応するメンバーが見つかりませんでした:', authorName)
    return
  }
  
  // メンバーカードのDOM要素を検索
  const memberCard = document.querySelector(`[data-member-id="${targetMember.id}"]`) as HTMLElement
  
  if (memberCard) {
    // スムーズスクロールでメンバーカードに移動
    memberCard.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
    
    // 一時的にハイライト効果を追加
    memberCard.classList.add('highlight-member')
    setTimeout(() => {
      memberCard.classList.remove('highlight-member')
    }, 2000)
  }
}

// メンバーのアバターを取得
const getMemberAvatar = (member: any) => {
  // member.avatarがあり、プレースホルダーでない場合
  if (member.avatar && member.avatar.trim() && !member.avatar.includes('placeholder')) {
    return member.avatar
  }
  
  // アバターがない場合はnullを返してプレースホルダーを表示
  return null
}

// メンバーのカテゴリを取得 - 仕様不確定のため非表示
// const getMemberCategories = (member: any) => {
//   const categories = []
  
//   // DEV category for developers
//   if (member.skills && member.skills.some((skill: string) => 
//     ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'Python', 'Node.js'].includes(skill)
//   )) {
//     categories.push({ id: 'dev', emoji: '👩‍💻', label: 'DEV', name: 'Developer' })
//   }
  
//   // MOM category for all members (assuming this is a mom community)
//   categories.push({ id: 'mom', emoji: '👩‍👧‍👦', label: 'MOM', name: 'Mom' })
  
//   // DESIGN category for designers
//   if (member.skills && member.skills.some((skill: string) => 
//     ['Figma', 'Sketch', 'Photoshop', 'Illustrator'].includes(skill)
//   )) {
//     categories.push({ id: 'design', emoji: '🎨', label: 'DESIGN', name: 'Designer' })
//   }
  
//   // AI category for AI enthusiasts
//   if (member.bio && member.bio.toLowerCase().includes('ai') || 
//       member.role && member.role.toLowerCase().includes('ai')) {
//     categories.push({ id: 'ai', emoji: '🤖', label: 'AI', name: 'AI Enthusiast' })
//   }
  
//   return categories.slice(0, 3) // 最大3個まで
// }

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

// プロフィールアイコン関連の関数は削除

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

/* 1列レイアウト */
.members-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  max-width: 800px;
  margin: 0 auto;
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
  grid-template-columns: 140px 1fr 200px;
  min-height: 300px;
  padding: var(--spacing-6);
  gap: var(--spacing-6);
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

.photo-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.photo-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  user-select: none;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  pointer-events: none;
}

.member-card:hover .photo-image {
  transform: scale(1.05);
}

/* フォトナビゲーション */
.photo-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.has-multiple-photos:hover .photo-navigation {
  opacity: 1;
}

.nav-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
  transition: all 0.2s ease;
  pointer-events: all;
  backdrop-filter: blur(4px);
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.nav-btn svg {
  width: 16px;
  height: 16px;
}

/* フォトインジケーター */
.photo-indicators {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.has-multiple-photos:hover .photo-indicators {
  opacity: 1;
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}

/* 写真プレースホルダー */
.photo-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-purple-lighter) 0%, var(--primary-purple-light) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
}

.placeholder-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-purple);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(155, 123, 216, 0.3);
}

.placeholder-text {
  font-size: var(--font-size-xs);
  color: var(--primary-purple);
  font-weight: 500;
  opacity: 0.8;
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

/* メンバーHPバナー画像 */
.member-banner {
  margin-top: var(--spacing-3);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(155, 123, 216, 0.2);
  transition: all 0.2s ease;
}

.member-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(155, 123, 216, 0.3);
}

.banner-image {
  width: 100%;
  height: 60px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.member-banner:hover .banner-image {
  transform: scale(1.02);
}

.member-banner a {
  display: block;
  text-decoration: none;
  cursor: pointer;
}

/* icon-categories - 仕様不確定のため非表示 */
/* .icon-categories {
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
} */

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

/* メンバーアバター */
.member-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto var(--spacing-4) auto;
  border: 3px solid var(--primary-purple);
  box-shadow: 0 4px 12px rgba(155, 123, 216, 0.3);
  transition: all 0.2s ease;
  background: var(--white);
}

.member-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(155, 123, 216, 0.4);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-purple-dark) 100%);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
}

/* プロフィールアイコンは削除 */

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

/* SNSアイコン */
.social-links {
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.social-link {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;
  border: 2px solid transparent;
}

.social-link svg {
  width: 18px;
  height: 18px;
}

.social-link.github {
  background: #333;
  color: white;
}

.social-link.github:hover {
  background: #24292e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(51, 51, 51, 0.3);
}

.social-link.twitter {
  background: #000;
  color: white;
}

.social-link.twitter:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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
  justify-content: space-between;
  position: relative;
  min-height: 100%;
}

/* メッセージ送信欄風UI */
.comment-input-area {
  margin-top: auto;
  padding-top: var(--spacing-2);
  border-top: 1px solid rgba(155, 123, 216, 0.1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: var(--spacing-2);
  backdrop-filter: blur(4px);
}

.message-send-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--primary-purple) 0%, #8b5cf6 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(155, 123, 216, 0.3);
}

.message-send-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(155, 123, 216, 0.4);
  background: linear-gradient(135deg, #8b5cf6 0%, var(--primary-purple-dark) 100%);
}

.message-send-btn:active {
  transform: scale(0.95);
}

.message-send-btn svg {
  width: 14px;
  height: 14px;
  transform: rotate(0deg);
  transition: transform 0.2s ease;
}

.message-send-btn:hover svg {
  transform: rotate(15deg);
}

.speech-bubbles {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.speech-bubble {
  position: relative;
  max-width: 140px;
  animation: fadeInUp 0.3s ease;
  cursor: pointer;
  transition: all 0.2s ease;
}

.speech-bubble:hover {
  transform: scale(1.02);
  filter: brightness(1.1);
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
  border-radius: 16px 16px 16px 0; /* 左下を直角に */
  font-size: 11px;
  line-height: 1.4;
  box-shadow: 0 2px 8px rgba(232, 121, 249, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.bubble-right .bubble-content {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);
  border-radius: 16px 16px 0 16px; /* 右下を直角に */
}

/* Tailは削除 - シンプルな角丸デザインに変更 */

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

.readonly-input {
  background-color: var(--gray-100) !important;
  cursor: not-allowed !important;
  color: var(--gray-600) !important;
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
    gap: var(--spacing-4);
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
    max-height: 140px;
  }
  
  .comment-input-area {
    padding: var(--spacing-1);
  }
  
  .message-send-btn {
    width: 24px;
    height: 24px;
  }
  
  .message-send-btn svg {
    width: 12px;
    height: 12px;
  }
  
  .speech-bubbles {
    flex-direction: row;
    gap: var(--spacing-1);
    overflow-x: auto;
    padding-bottom: var(--spacing-1);
    flex: none;
    height: auto;
  }
  
  .speech-bubble {
    flex-shrink: 0;
    max-width: 120px;
  }
  
  .comment-input-area {
    margin-top: var(--spacing-2);
    justify-content: center;
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

/* メンバーハイライト効果 */
.member-card.highlight-member {
  animation: highlightPulse 2s ease-in-out;
  z-index: 10;
}

@keyframes highlightPulse {
  0%, 100% { 
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(155, 123, 216, 0.2);
  }
  50% { 
    transform: translateY(-12px);
    box-shadow: 0 25px 50px rgba(155, 123, 216, 0.4);
  }
}
</style>