<template>
  <!-- Login Modal - ログインモーダル -->
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content login-modal" @click.stop>
      <div class="modal-body">
        <div class="login-form-container">
          <div class="login-header">
            <h3>ログイン</h3>
            <button class="modal-close" @click="$emit('close')">&times;</button>
          </div>
          
          <!-- X (Twitter) ログイン - 条件付き表示 -->
          <div v-if="isXAuthAvailable" class="x-login-section">
            <button 
              class="btn btn-x-login" 
              @click="$emit('x-login')"
              :disabled="isXAuthLoading"
            >
              <span v-if="isXAuthLoading">認証中...</span>
              <span v-else>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Xアカウントでログイン
              </span>
            </button>
          </div>
          
          <div v-if="isXAuthAvailable" class="login-divider">
            <span>または</span>
          </div>
          
          <!-- 従来のメール/パスワードログイン -->
          <div class="form-group">
            <label for="login-email">メールアドレス</label>
            <input
              id="login-email"
              v-model="localLoginForm.email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div class="form-group">
            <label for="login-password">パスワード</label>
            <input
              id="login-password"
              v-model="localLoginForm.password"
              type="password"
              placeholder="パスワードを入力"
              required
            />
          </div>
          
          <div class="login-form-actions">
            <button class="btn btn-secondary" @click="$emit('close')">キャンセル</button>
            <button class="btn btn-primary" @click="handleLogin">ログイン</button>
          </div>
          
          <div class="signup-link">
            <p>アカウントをお持ちでない方は <a href="#" @click.prevent="$emit('show-signup')" class="signup-link-text">新規登録</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props - 親コンポーネントから受け取るデータ
interface Props {
  loginForm: {
    email: string
    password: string
  }
  isXAuthLoading: boolean
  isXAuthAvailable: boolean
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  close: []
  login: [formData: { email: string, password: string }]
  'x-login': []
  'show-signup': []
}>()

// ローカルフォームデータ
const localLoginForm = ref({
  email: props.loginForm.email,
  password: props.loginForm.password
})

// propsの変更を監視してローカルフォームを更新
watch(() => props.loginForm, (newForm) => {
  localLoginForm.value = {
    email: newForm.email,
    password: newForm.password
  }
}, { immediate: true })

// ログイン処理
const handleLogin = () => {
  emit('login', localLoginForm.value)
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

.modal-body {
  padding: var(--spacing-6);
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

/* Login Form Container */
.login-form-container {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
  margin: var(--spacing-4) 0;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--gray-200);
}

.login-header h3 {
  margin: 0;
  color: var(--gray-800);
  font-size: 1.5rem;
  font-weight: 600;
}

/* X Login */
.x-login-section {
  margin-bottom: var(--spacing-6);
}

.btn-x-login {
  width: 100%;
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
}

.btn-x-login:hover:not(:disabled) {
  background: #1a1a1a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-x-login:disabled {
  background: #666666;
  cursor: not-allowed;
  transform: none;
}

.btn-x-login svg {
  flex-shrink: 0;
}

.login-divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-6) 0;
}

.login-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gray-300);
}

.login-divider span {
  background: var(--white);
  padding: 0 var(--spacing-4);
  color: var(--gray-500);
  font-size: var(--font-size-sm);
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

.form-group input {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-purple);
  box-shadow: 0 0 0 3px rgba(155, 123, 216, 0.1);
}

/* Form Actions */
.login-form-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--gray-200);
}

.login-form-actions .btn {
  min-width: 100px;
}

/* Signup Link */
.signup-link {
  text-align: center;
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

.signup-link p {
  margin: 0;
  color: var(--gray-600);
  font-size: 14px;
}

.signup-link-text {
  color: var(--primary-purple);
  text-decoration: none;
  font-weight: 600;
}

.signup-link-text:hover {
  text-decoration: underline;
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