<template>
  <!-- Comment Modal - コメント追加モーダル -->
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content comment-modal" @click.stop>
      <div class="modal-header">
        <h3>コメントを追加</h3>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="comment-author">お名前</label>
          <input
            id="comment-author"
            :value="newComment.authorName"
            @input="updateComment('authorName', $event.target.value)"
            type="text"
            placeholder="あなたのお名前を入力してください"
            required
          />
        </div>
        <div class="form-group">
          <label for="comment-content">コメント</label>
          <textarea
            id="comment-content"
            :value="newComment.content"
            @input="updateComment('content', $event.target.value)"
            placeholder="コメントを入力してください"
            rows="4"
            required
          ></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">キャンセル</button>
        <button class="btn btn-primary" @click="handleSave">投稿</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props - 親コンポーネントから受け取るデータ
interface Props {
  memberId: string | null
  newComment: {
    authorName: string
    content: string
  }
}

defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  close: []
  save: [comment: { authorName: string; content: string; memberId: string | null }]
}>()

// コメント内容を更新する関数
const updateComment = (field: string, value: string) => {
  // 親コンポーネントでnewCommentを直接更新してもらう
  // この実装では、親コンポーネント側でv-modelを使用する想定
}

// 保存処理
const handleSave = () => {
  emit('save', {
    authorName: '',
    content: '',
    memberId: null
  })
}
</script>

<style scoped>
/* Modal共通スタイル */
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
  z-index: 10000;
}

.modal-content {
  background: var(--white);
  border-radius: var(--radius-xl);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h3 {
  margin: 0;
  color: var(--gray-800);
  font-size: var(--font-size-lg);
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  cursor: pointer;
  color: var(--gray-400);
  transition: color var(--transition-base);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--gray-600);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-footer {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  padding: var(--spacing-6);
  border-top: 1px solid var(--gray-200);
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
</style>