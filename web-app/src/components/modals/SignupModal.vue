<template>
  <!-- Signup Modal - 新規登録モーダル -->
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content signup-modal" @click.stop>
      <div class="modal-body">
        <div class="signup-form-container">
          <div class="signup-header">
            <h3>新規登録</h3>
            <button class="modal-close" @click="$emit('close')">&times;</button>
          </div>
          
          <!-- Google 登録 -->
          <div class="google-signup-section">
            <button 
              class="btn btn-google-login" 
              @click="$emit('google-signup')"
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
                Googleアカウントで登録
              </span>
            </button>
          </div>
          
          <div class="signup-divider">
            <span>または</span>
          </div>
          
          <!-- メール/パスワード新規登録 -->
          <div class="form-group">
            <label for="signup-name">お名前</label>
            <input
              id="signup-name"
              :value="signupForm.name"
              @input="updateForm('name', $event.target.value)"
              type="text"
              placeholder="お名前を入力"
              required
            />
          </div>
          <div class="form-group">
            <label for="signup-email">メールアドレス</label>
            <input
              id="signup-email"
              :value="signupForm.email"
              @input="updateForm('email', $event.target.value)"
              type="email"
              placeholder="メールアドレスを入力"
              required
            />
          </div>
          <div class="form-group">
            <label for="signup-password">パスワード</label>
            <input
              id="signup-password"
              :value="signupForm.password"
              @input="updateForm('password', $event.target.value)"
              type="password"
              placeholder="パスワードを入力（8文字以上）"
              required
            />
          </div>
          <div class="form-group">
            <label for="signup-password-confirm">パスワード確認</label>
            <input
              id="signup-password-confirm"
              :value="signupForm.passwordConfirm"
              @input="updateForm('passwordConfirm', $event.target.value)"
              type="password"
              placeholder="パスワードを再入力"
              required
            />
          </div>
          
          <div class="signup-form-actions">
            <button class="btn btn-secondary" @click="$emit('close')">キャンセル</button>
            <button class="btn btn-primary" @click="$emit('signup')">新規登録</button>
          </div>
          
          <div class="login-link">
            <p>既にアカウントをお持ちの方は <a href="#" @click.prevent="$emit('show-login')" class="login-link-text">ログイン</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props - 親コンポーネントから受け取るデータ
interface Props {
  signupForm: {
    name: string
    email: string
    password: string
    passwordConfirm: string
  }
  isGoogleLoading: boolean
}

defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
const emit = defineEmits<{
  close: []
  signup: []
  'google-signup': []
  'show-login': []
  'update-form': [field: string, value: string]
}>()

// フォーム内容を更新する関数
const updateForm = (field: string, value: string) => {
  emit('update-form', field, value)
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

/* Signup Form Container */
.signup-form-container {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
  margin: var(--spacing-4) 0;
}

.signup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--gray-200);
}

.signup-header h3 {
  margin: 0;
  color: var(--gray-800);
  font-size: 1.5rem;
  font-weight: 600;
}

/* Google Signup */
.google-signup-section {
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

.signup-divider {
  display: flex;
  align-items: center;
  margin: var(--spacing-6) 0;
  text-align: center;
}

.signup-divider::before,
.signup-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gray-300);
}

.signup-divider span {
  padding: 0 var(--spacing-4);
  color: var(--gray-500);
  font-size: 14px;
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
.signup-form-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--gray-200);
}

.signup-form-actions .btn {
  min-width: 100px;
}

/* Login Link */
.login-link {
  text-align: center;
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

.login-link p {
  margin: 0;
  color: var(--gray-600);
  font-size: 14px;
}

.login-link-text {
  color: var(--primary-purple);
  text-decoration: none;
  font-weight: 600;
}

.login-link-text:hover {
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