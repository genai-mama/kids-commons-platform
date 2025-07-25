<template>
  <div id="app">
    <div style="padding: 20px; text-align: center;">
      <h1 style="color: #7c3aed; margin-bottom: 20px;">#生成AIママ部</h1>
      <p style="color: #6b7280; margin-bottom: 30px;">
        家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティです
      </p>
      
      <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 40px;">
        <button @click="currentPage = 'home'" :style="buttonStyle('home')">ホーム</button>
        <button @click="currentPage = 'about'" :style="buttonStyle('about')">About</button>
        <button @click="currentPage = 'products'" :style="buttonStyle('products')">Products</button>
        <button @click="currentPage = 'news'" :style="buttonStyle('news')">News</button>
      </div>

      <div v-if="currentPage === 'home'">
        <h2 style="color: #374151; margin-bottom: 20px;">ホームページ</h2>
        <p style="color: #6b7280;">Vueアプリが正常に動作しています！</p>
      </div>

      <div v-if="currentPage === 'about'">
        <h2 style="color: #374151; margin-bottom: 20px;">About</h2>
        <p style="color: #6b7280;">コミュニティについての情報です。</p>
      </div>

      <div v-if="currentPage === 'products'">
        <h2 style="color: #374151; margin-bottom: 20px;">Products</h2>
        <p style="color: #6b7280;">成果物一覧ページです。</p>
      </div>

      <div v-if="currentPage === 'news'">
        <h2 style="color: #374151; margin-bottom: 20px;">News</h2>
        <p style="color: #6b7280;">最新ニュースページです。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentPage = ref('home')

const buttonStyle = (page: string) => ({
  padding: '10px 20px',
  borderRadius: '20px',
  border: currentPage.value === page ? '2px solid #7c3aed' : '1px solid #d1d5db',
  backgroundColor: currentPage.value === page ? '#f5f0ff' : '#ffffff',
  color: currentPage.value === page ? '#7c3aed' : '#6b7280',
  cursor: 'pointer',
  fontWeight: '500'
})
</script>