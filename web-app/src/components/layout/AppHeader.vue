<template>
  <!-- Application Header - ナビゲーション、検索、ログイン機能 -->
  <header class="header">
    <div class="container">
      <div class="logo">
        <a href="#" @click="$emit('navigate', 'home')">
          <img
            src="/images/logo/genai-mama-logo.svg"
            alt="#生成AIママ部"
            class="logo-image"
          />
        </a>
      </div>
      
      <nav class="nav" id="nav" :class="{ active: mobileMenuOpen }">
        <ul class="nav-list">
          <li>
            <a
              href="#"
              @click="$emit('navigate', 'home')"
              class="nav-link"
              :class="{ active: currentPage === 'home' }"
            >ホーム</a>
          </li>
          <li>
            <a
              href="#"
              @click="$emit('navigate', 'about')"
              class="nav-link"
              :class="{ active: currentPage === 'about' }"
            >About</a>
          </li>
          <li>
            <a
              href="#"
              @click="$emit('navigate', 'members')"
              class="nav-link"
              :class="{ active: currentPage === 'members' }"
            >Members</a>
          </li>
          <li>
            <a
              href="#"
              @click="$emit('navigate', 'products')"
              class="nav-link"
              :class="{ active: currentPage === 'products' }"
            >Products</a>
          </li>
          <li>
            <a
              href="#"
              @click="$emit('navigate', 'news')"
              class="nav-link"
              :class="{ active: currentPage === 'news' }"
            >News</a>
          </li>
          <li v-if="isLoggedIn">
            <a
              href="#"
              @click="$emit('navigate', 'admin')"
              class="nav-link"
              :class="{ active: currentPage === 'admin' }"
            >Managed</a>
          </li>
          <li v-if="isLoggedIn">
            <a
              href="#"
              @click="$emit('navigate', 'profile')"
              class="nav-link"
              :class="{ active: currentPage === 'profile' }"
            >Profile</a>
          </li>
        </ul>
      </nav>
      
      <div class="header-actions">
        <div
          class="search-bar"
          :class="{ 'mobile-active': mobileSearchActive }"
        >
          <input
            type="text"
            placeholder="成果物を検索"
            class="search-input"
            id="search-input"
            :value="searchQuery"
            @keypress="$emit('search-keypress', $event)"
            @input="$emit('debounce-search')"
          />
          <button class="search-btn" id="search-btn" @click="$emit('search')">
            🔍
          </button>
        </div>
        
        <button
          class="mobile-search-toggle"
          @click="$emit('toggle-mobile-search')"
        >
          🔍
        </button>
        
        <div class="auth-actions">
          <button v-if="!isLoggedIn" class="btn-login" @click="$emit('login')">
            ログイン
          </button>
          <button v-if="isLoggedIn" class="btn-logout" @click="$emit('logout')">
            ログアウト
          </button>
        </div>
        
        <button
          class="mobile-menu-toggle"
          @click="$emit('toggle-mobile-menu')"
          :class="{ active: mobileMenuOpen }"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Props - 親コンポーネントから受け取るデータ
interface Props {
  currentPage: string
  isLoggedIn: boolean
  mobileMenuOpen: boolean
  mobileSearchActive: boolean
  searchQuery: string
}

defineProps<Props>()

// Events - 親コンポーネントに送信するイベント
defineEmits<{
  navigate: [page: string]
  'toggle-mobile-menu': []
  'toggle-mobile-search': []
  search: []
  'search-keypress': [event: KeyboardEvent]
  'debounce-search': []
  login: []
  logout: []
}>()
</script>

<style scoped>
/* Header Component専用スタイル */
.header {
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

/* Logo */
.logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-image {
  height: 20px;
  width: auto;
}

/* Navigation */
.nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-6);
}

.nav-link {
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  position: relative;
}

.nav-link:hover {
  color: var(--primary-purple);
}

.nav-link.active {
  color: var(--primary-purple);
}

/* デスクトップ版のみアンダーバー表示 */
@media (min-width: 1025px) {
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 2px;
    background: var(--primary-purple);
    border-radius: 1px;
  }
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  padding: var(--spacing-2);
  transition: all var(--transition-base);
}

.search-bar:focus-within {
  background: var(--white);
  box-shadow: 0 0 0 2px var(--primary-purple-light);
}

.search-input {
  border: none;
  background: transparent;
  padding: var(--spacing-2) var(--spacing-3);
  outline: none;
  width: 200px;
  font-size: var(--font-size-sm);
}

.search-btn {
  background: none;
  border: none;
  padding: var(--spacing-2);
  cursor: pointer;
  border-radius: 50%;
  transition: background var(--transition-base);
}

.search-btn:hover {
  background: var(--gray-200);
}

.mobile-search-toggle {
  display: none;
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: var(--spacing-2);
}

/* Auth Actions */
.auth-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.btn-login,
.btn-logout {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--primary-purple);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-base);
}

.btn-login {
  background: var(--primary-purple);
  color: var(--white);
}

.btn-login:hover {
  background: var(--primary-purple-dark);
  transform: translateY(-2px);
}

.btn-logout {
  background: var(--white);
  color: var(--primary-purple);
}

.btn-logout:hover {
  background: var(--primary-purple-lighter);
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2);
  width: 32px;
  height: 32px;
  gap: 4px;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: var(--gray-700);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
}

.mobile-menu-toggle:hover .hamburger-line {
  background: var(--primary-purple);
}

/* アクティブ状態（バツボタン） */
.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(3px, 3px);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(3px, -3px);
}

/* レスポンシブ対応 */
@media (max-width: 1024px) {
  .container {
    padding: 0 var(--spacing-4);
    height: 70px;
  }
}

@media (max-width: 768px) {
  /* デスクトップ版の検索バーを非表示 */
  .search-bar:not(.mobile-active) {
    display: none;
  }
  
  /* モバイル版の検索アイコンとハンバーガーメニューを表示 */
  .mobile-search-toggle,
  .mobile-menu-toggle {
    display: flex;
  }

  /* ナビゲーションメニューをモバイル用に変更 */
  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    border-top: 1px solid var(--gray-200);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .nav.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-list {
    flex-direction: column;
    padding: var(--spacing-4);
    gap: var(--spacing-2);
  }

  .nav-link {
    display: block;
    padding: var(--spacing-3);
    text-align: center;
    position: relative;
  }

  /* アコーディオンメニュー内ではアンダーバーを非表示 */
  .nav-link.active::after {
    display: none;
  }

  /* モバイル検索バーのスタイル */
  .search-bar.mobile-active {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    border-top: 1px solid var(--gray-200);
    border-radius: 0;
    padding: var(--spacing-4);
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
    display: flex;
    z-index: 999;
  }

  .search-bar.mobile-active .search-input {
    width: 100%;
  }
}
</style>