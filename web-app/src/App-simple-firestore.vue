<template>
  <div id="app">
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <!-- ヘッダー -->
      <header style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #7c3aed; margin-bottom: 20px;">#生成AIママ部</h1>
        <p style="color: #6b7280; margin-bottom: 30px;">
          家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティです
        </p>
        
        <nav style="display: flex; justify-content: center; gap: 20px; margin-bottom: 40px;">
          <button @click="currentPage = 'home'" :style="buttonStyle('home')">ホーム</button>
          <button @click="currentPage = 'products'" :style="buttonStyle('products')">Products</button>
          <button @click="currentPage = 'news'" :style="buttonStyle('news')">News</button>
          <button @click="currentPage = 'admin'" :style="buttonStyle('admin')">管理</button>
        </nav>
      </header>

      <!-- ローディング表示 -->
      <div v-if="loading" style="text-align: center; padding: 40px;">
        <p>🔄 データを読み込み中...</p>
      </div>

      <!-- エラー表示 -->
      <div v-if="error" style="text-align: center; padding: 20px; background: #fee; border: 1px solid #fcc; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #c00;">❌ {{ error }}</p>
      </div>

      <!-- ホームページ -->
      <div v-if="currentPage === 'home'">
        <h2 style="color: #374151; margin-bottom: 20px;">注目の成果物</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px;">
          <div v-for="product in featuredProducts" :key="product.id" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; background: white;">
            <h3 style="color: #374151; margin-bottom: 10px;">{{ product.title }}</h3>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">{{ product.category }}</p>
            <p style="color: #6b7280; margin-bottom: 15px;">{{ product.description }}</p>
            <div style="display: flex; gap: 5px; margin-bottom: 15px;">
              <span v-for="tag in product.tags" :key="tag" style="background: #f3f4f6; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #374151;">{{ tag }}</span>
            </div>
            <p style="color: #9ca3af; font-size: 12px;">{{ product.author.name }} | {{ formatDate(product.date) }}</p>
          </div>
        </div>

        <h2 style="color: #374151; margin-bottom: 20px;">最新ニュース</h2>
        <div style="display: grid; gap: 15px;">
          <div v-for="newsItem in latestNews" :key="newsItem.id" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background: white;">
            <h3 style="color: #374151; margin-bottom: 8px; font-size: 16px;">{{ newsItem.title }}</h3>
            <p style="color: #6b7280; margin-bottom: 8px; font-size: 14px;">{{ newsItem.excerpt }}</p>
            <p style="color: #9ca3af; font-size: 12px;">{{ formatDate(newsItem.date) }}</p>
          </div>
        </div>
      </div>

      <!-- 成果物一覧 -->
      <div v-if="currentPage === 'products'">
        <h2 style="color: #374151; margin-bottom: 20px;">成果物一覧（{{ products.length }}件）</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div v-for="product in products" :key="product.id" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; background: white;">
            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 10px;">
              <h3 style="color: #374151; margin: 0; flex: 1;">{{ product.title }}</h3>
              <span v-if="product.featured" style="background: #7c3aed; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; margin-left: 10px;">注目</span>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">{{ product.category }}</p>
            <p style="color: #6b7280; margin-bottom: 15px;">{{ product.description }}</p>
            <div style="display: flex; gap: 5px; margin-bottom: 15px;">
              <span v-for="tag in product.tags" :key="tag" style="background: #f3f4f6; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #374151;">{{ tag }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">{{ product.author.name }}</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">👍 {{ product.likes }} 💬 {{ product.comments }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ニュース一覧 -->
      <div v-if="currentPage === 'news'">
        <h2 style="color: #374151; margin-bottom: 20px;">最新ニュース（{{ news.length }}件）</h2>
        <div style="display: grid; gap: 20px;">
          <div v-for="newsItem in news" :key="newsItem.id" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; background: white;">
            <h3 style="color: #374151; margin-bottom: 10px;">{{ newsItem.title }}</h3>
            <p style="color: #6b7280; margin-bottom: 15px;">{{ newsItem.excerpt }}</p>
            <p style="color: #9ca3af; font-size: 14px;">{{ formatDate(newsItem.date) }}</p>
          </div>
        </div>
      </div>

      <!-- 管理ページ -->
      <div v-if="currentPage === 'admin'">
        <h2 style="color: #374151; margin-bottom: 20px;">🛠️ 管理ページ</h2>
        
        <!-- タブ -->
        <div style="display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb;">
          <button @click="adminTab = 'products'" :style="tabStyle('products')">成果物管理</button>
          <button @click="adminTab = 'news'" :style="tabStyle('news')">ニュース管理</button>
        </div>

        <!-- 成果物管理 -->
        <div v-if="adminTab === 'products'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0;">成果物一覧</h3>
            <button @click="showProductForm = !showProductForm" style="background: #7c3aed; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
              {{ showProductForm ? 'フォームを閉じる' : '新規追加' }}
            </button>
          </div>

          <!-- 成果物追加フォーム -->
          <div v-if="showProductForm" style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <h4 style="color: #374151; margin-bottom: 20px;">新しい成果物を追加</h4>
            <form @submit.prevent="handleAddProduct" style="display: grid; gap: 15px;">
              <div>
                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">タイトル</label>
                <input v-model="newProduct.title" type="text" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">カテゴリ</label>
                <select v-model="newProduct.category" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
                  <option value="仕事効率化">仕事効率化</option>
                  <option value="学校">学校</option>
                  <option value="コミュニケーション">コミュニケーション</option>
                  <option value="学習">学習</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">説明</label>
                <textarea v-model="newProduct.description" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; min-height: 100px;"></textarea>
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">タグ（カンマ区切り）</label>
                <input v-model="newProduct.tagsString" type="text" placeholder="SNS, 効率化, スケジュール" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">作者名</label>
                  <input v-model="newProduct.authorName" type="text" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
                </div>
                <div>
                  <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">作者の役割</label>
                  <input v-model="newProduct.authorRole" type="text" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
                </div>
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">URL</label>
                <input v-model="newProduct.url" type="url" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
              </div>
              <div>
                <label style="display: flex; align-items: center; gap: 8px; color: #374151;">
                  <input v-model="newProduct.featured" type="checkbox">
                  注目の成果物として表示
                </label>
              </div>
              <button type="submit" :disabled="submitting" style="background: #7c3aed; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
                {{ submitting ? '追加中...' : '追加' }}
              </button>
            </form>
          </div>
        </div>

        <!-- ニュース管理 -->
        <div v-if="adminTab === 'news'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0;">ニュース一覧</h3>
            <button @click="showNewsForm = !showNewsForm" style="background: #7c3aed; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
              {{ showNewsForm ? 'フォームを閉じる' : '新規追加' }}
            </button>
          </div>

          <!-- ニュース追加フォーム -->
          <div v-if="showNewsForm" style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <h4 style="color: #374151; margin-bottom: 20px;">新しいニュースを追加</h4>
            <form @submit.prevent="handleAddNews" style="display: grid; gap: 15px;">
              <div>
                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">タイトル</label>
                <input v-model="newNews.title" type="text" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">抜粋</label>
                <textarea v-model="newNews.excerpt" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; min-height: 100px;"></textarea>
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">URL</label>
                <input v-model="newNews.url" type="url" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
              </div>
              <button type="submit" :disabled="submitting" style="background: #7c3aed; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
                {{ submitting ? '追加中...' : '追加' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFirestore } from './composables/useFirestore'

// Firestore 使用
const { products, news, loading, error, addProduct, addNews, initialize } = useFirestore()

// 状態管理
const currentPage = ref('home')
const adminTab = ref('products')
const showProductForm = ref(false)
const showNewsForm = ref(false)
const submitting = ref(false)

// フォームデータ
const newProduct = ref({
  title: '',
  category: '仕事効率化',
  description: '',
  tagsString: '',
  authorName: '',
  authorRole: '',
  url: '',
  featured: false
})

const newNews = ref({
  title: '',
  excerpt: '',
  url: ''
})

// 計算プロパティ
const featuredProducts = computed(() => 
  products.value.filter(p => p.featured).slice(0, 3)
)

const latestNews = computed(() => 
  news.value.slice(0, 3)
)

// スタイル関数
const buttonStyle = (page: string) => ({
  padding: '10px 20px',
  borderRadius: '20px',
  border: currentPage.value === page ? '2px solid #7c3aed' : '1px solid #d1d5db',
  backgroundColor: currentPage.value === page ? '#f5f0ff' : '#ffffff',
  color: currentPage.value === page ? '#7c3aed' : '#6b7280',
  cursor: 'pointer',
  fontWeight: '500'
})

const tabStyle = (tab: string) => ({
  padding: '10px 20px',
  border: 'none',
  borderBottom: adminTab.value === tab ? '2px solid #7c3aed' : '2px solid transparent',
  backgroundColor: 'transparent',
  color: adminTab.value === tab ? '#7c3aed' : '#6b7280',
  cursor: 'pointer',
  fontWeight: '500'
})

// ユーティリティ関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// 成果物追加
const handleAddProduct = async () => {
  try {
    submitting.value = true
    const tags = newProduct.value.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
    
    await addProduct({
      title: newProduct.value.title,
      category: newProduct.value.category,
      description: newProduct.value.description,
      tags: tags,
      author: {
        name: newProduct.value.authorName,
        avatar: newProduct.value.authorName.charAt(0).toUpperCase(),
        role: newProduct.value.authorRole
      },
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0,
      thumbnail: `https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=${encodeURIComponent(newProduct.value.title)}`,
      featured: newProduct.value.featured,
      url: newProduct.value.url
    })
    
    // フォームリセット
    newProduct.value = {
      title: '',
      category: '仕事効率化',
      description: '',
      tagsString: '',
      authorName: '',
      authorRole: '',
      url: '',
      featured: false
    }
    
    showProductForm.value = false
    alert('成果物を追加しました！')
  } catch (err) {
    alert('エラーが発生しました: ' + err)
  } finally {
    submitting.value = false
  }
}

// ニュース追加
const handleAddNews = async () => {
  try {
    submitting.value = true
    
    await addNews({
      title: newNews.value.title,
      excerpt: newNews.value.excerpt,
      date: new Date().toISOString().split('T')[0],
      url: newNews.value.url
    })
    
    // フォームリセット
    newNews.value = {
      title: '',
      excerpt: '',
      url: ''
    }
    
    showNewsForm.value = false
    alert('ニュースを追加しました！')
  } catch (err) {
    alert('エラーが発生しました: ' + err)
  } finally {
    submitting.value = false
  }
}

// 初期化
onMounted(() => {
  initialize()
})
</script>