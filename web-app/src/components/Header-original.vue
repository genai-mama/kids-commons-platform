<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const searchQuery = ref('')
const mobileMenuOpen = ref(false)

const handleSearch = () => {
  console.log('Search:', searchQuery.value)
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const joinCommunity = () => {
  window.open('https://discord.gg/genai-mama', '_blank')
}
</script>

<template>
  <!-- Navigation -->
  <header class="header">
    <div class="container">
      <div class="logo">
        <RouterLink to="/">
          <img
            src="/images/logo/genai-mama-logo.svg"
            alt="#生成AIママ部"
            class="logo-image"
          />
        </RouterLink>
      </div>
      <nav class="nav" id="nav">
        <ul class="nav-list">
          <li>
            <RouterLink to="/" class="nav-link">ホーム</RouterLink>
          </li>
          <li>
            <RouterLink to="/about" class="nav-link">About</RouterLink>
          </li>
          <li>
            <RouterLink to="/products" class="nav-link">Products</RouterLink>
          </li>
          <li>
            <RouterLink to="/news" class="nav-link">News</RouterLink>
          </li>
        </ul>
      </nav>
      <div class="header-actions">
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="成果物を検索"
            class="search-input"
            id="search-input"
            @keypress.enter="handleSearch"
          />
          <button class="search-btn" id="search-btn" @click="handleSearch">🔍</button>
        </div>
        <a href="#" class="btn-join" id="join-btn" @click.prevent="joinCommunity">参加する</a>
      </div>
      <button 
        class="mobile-menu-toggle" 
        id="mobile-menu-toggle"
        @click="toggleMobileMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
/* このコンポーネントは元のCSS（main.css）のスタイルを使用 */
</style>