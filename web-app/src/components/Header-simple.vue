<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const searchQuery = ref('')
</script>

<template>
  <header style="background: white; border-bottom: 1px solid #e5e7eb; padding: 1rem 0;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <!-- Logo -->
        <RouterLink to="/" style="text-decoration: none; color: #7c3aed; font-weight: 700; font-size: 1.25rem;">
          #生成AIママ部
        </RouterLink>

        <!-- Navigation -->
        <nav style="display: flex; gap: 2rem;">
          <RouterLink 
            to="/" 
            style="text-decoration: none; color: #6b7280; font-weight: 500; padding: 0.5rem 0.75rem; border-radius: 0.5rem;"
          >
            ホーム
          </RouterLink>
          <RouterLink 
            to="/about" 
            style="text-decoration: none; color: #6b7280; font-weight: 500; padding: 0.5rem 0.75rem; border-radius: 0.5rem;"
          >
            About
          </RouterLink>
          <RouterLink 
            to="/products" 
            style="text-decoration: none; color: #6b7280; font-weight: 500; padding: 0.5rem 0.75rem; border-radius: 0.5rem;"
          >
            Products
          </RouterLink>
          <RouterLink 
            to="/news" 
            style="text-decoration: none; color: #6b7280; font-weight: 500; padding: 0.5rem 0.75rem; border-radius: 0.5rem;"
          >
            News
          </RouterLink>
        </nav>

        <!-- Search -->
        <div style="display: flex; align-items: center;">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="検索..."
            style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 1.5rem; outline: none;"
          />
        </div>
      </div>
    </div>
  </header>
</template>