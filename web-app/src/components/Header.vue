<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const searchQuery = ref('')
const mobileMenuOpen = ref(false)

const handleSearch = () => {
  // TODO: Implement search functionality
  console.log('Search:', searchQuery.value)
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <RouterLink to="/" class="logo">
          <img
            src="/images/logo/genai-mama-logo.svg"
            alt="#生成AIママ部"
            class="logo-image"
          />
          #生成AIママ部
        </RouterLink>

        <nav class="nav" :class="{ 'nav-open': mobileMenuOpen }">
          <ul class="nav-list">
            <li>
              <RouterLink to="/" class="nav-link" @click="mobileMenuOpen = false">
                ホーム
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/about" class="nav-link" @click="mobileMenuOpen = false">
                About
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products" class="nav-link" @click="mobileMenuOpen = false">
                Products
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/news" class="nav-link" @click="mobileMenuOpen = false">
                News
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div class="header-actions">
          <div class="search-bar">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="検索..."
              @keypress.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              🔍
            </button>
          </div>

          <button
            class="mobile-menu-toggle"
            @click="toggleMobileMenu"
            aria-label="メニューを開く"
          >
            <span class="hamburger"></span>
            <span class="hamburger"></span>  
            <span class="hamburger"></span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  transition: var(--transition-base);
}

.hamburger {
  display: block;
  width: 20px;
  height: 2px;
  background-color: var(--gray-600);
  margin: 3px 0;
  transition: var(--transition-base);
}

@media (max-width: 768px) {
  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    border-top: 1px solid var(--gray-200);
    box-shadow: var(--shadow-lg);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
  }

  .nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-list {
    flex-direction: column;
    padding: var(--spacing-4) 0;
  }

  .nav-link {
    display: block;
    padding: var(--spacing-3) var(--spacing-4);
    margin: 0;
  }

  .search-input {
    width: 200px;
  }
}
</style>