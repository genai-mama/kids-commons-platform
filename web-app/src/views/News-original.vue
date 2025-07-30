<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '../stores/data'

const dataStore = useDataStore()
const news = computed(() => dataStore.news)
</script>

<template>
  <!-- Main Content -->
  <main class="main">
    <section class="news">
      <div class="container">
        <h1 class="page-title">ニュース</h1>
        <div class="news-grid" id="news-grid">
          <article
            v-for="newsItem in news"
            :key="newsItem.id"
            class="news-item"
          >
            <img
              :src="newsItem.thumbnail"
              :alt="newsItem.title"
              class="news-thumbnail"
            />
            <div class="news-content">
              <div class="news-meta">
                <span class="news-category">{{ newsItem.category }}</span>
                <time class="news-date">{{ newsItem.date }}</time>
              </div>
              <h2 class="news-title">{{ newsItem.title }}</h2>
              <p class="news-summary">{{ newsItem.summary }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* 元のCSSスタイルを使用 */
</style>