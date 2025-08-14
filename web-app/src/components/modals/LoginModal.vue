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
          
          <!-- Google ログイン -->
          <div class="google-login-section">
            <button 
              class="btn btn-google-login" 
              @click="$emit('google-login')"
              :disabled="isGoogleLoading"
            >
              <span v-if="isGoogleLoading">認証中...</span>
              <span v-else>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Googleアカウントでログイン
              </span>
            </button>
          </div>
          
          <div class="login-divider">
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
  isGoogleLoading: boolean
}

const props = defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  close: []
  login: [formData: { email: string, password: string }]
  'google-login': []
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

/* Google Login */
.google-login-section {
  margin-bottom: var(--spacing-6);
}

.btn-google-login {
  width: 100%;
  background: #ffffff;
  color: #3c4043;
  border: 1px solid #dadce0;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.btn-google-login:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #d2e3fc;
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
  transform: translateY(-1px);
}

.btn-google-login:disabled {
  background: #f8f9fa;
  color: #5f6368;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.btn-google-login svg {
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