// Firestore操作用のComposable
import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  getDocs, 
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase'

// 型定義
interface Product {
  id: number
  title: string
  category: string
  description: string
  tags: string[]
  author: {
    name: string
    avatar: string
    role: string
  }
  date: string
  likes: number
  comments: number
  thumbnail: string
  featured: boolean
  url: string
}

interface NewsItem {
  id: number
  title: string
  excerpt: string
  date: string
  url: string
}

export function useFirestore() {
  const products = ref<Product[]>([])
  const news = ref<NewsItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Products読み込み
  const loadProducts = async () => {
    try {
      loading.value = true
      const q = query(collection(db, 'products'), orderBy('date', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const loadedProducts = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: data.id || parseInt(doc.id),
          ...data
        }
      }) as Product[]
      
      products.value = loadedProducts
      console.log('Products loaded:', products.value.length)
    } catch (err) {
      error.value = `Products読み込みエラー: ${err}`
      console.error('Error loading products:', err)
    } finally {
      loading.value = false
    }
  }

  // News読み込み
  const loadNews = async () => {
    try {
      loading.value = true
      const q = query(collection(db, 'news'), orderBy('date', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const loadedNews = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: data.id || parseInt(doc.id),
          ...data
        }
      }) as NewsItem[]
      
      news.value = loadedNews
      console.log('News loaded:', news.value.length)
    } catch (err) {
      error.value = `News読み込みエラー: ${err}`
      console.error('Error loading news:', err)
    } finally {
      loading.value = false
    }
  }

  // Product追加
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      loading.value = true
      
      // 新しいIDを生成
      const newId = products.value.length > 0 
        ? Math.max(...products.value.map(p => p.id)) + 1 
        : 1

      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        id: newId
      })
      
      console.log('Product added with ID: ', docRef.id)
      
      // ローカルデータも更新
      products.value.push({
        id: newId,
        ...productData
      })
      
      return docRef.id
    } catch (err) {
      error.value = `Product追加エラー: ${err}`
      console.error('Error adding product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // News追加
  const addNews = async (newsData: Omit<NewsItem, 'id'>) => {
    try {
      loading.value = true
      
      // 新しいIDを生成
      const newId = news.value.length > 0 
        ? Math.max(...news.value.map(n => n.id)) + 1 
        : 1

      const docRef = await addDoc(collection(db, 'news'), {
        ...newsData,
        id: newId
      })
      
      console.log('News added with ID: ', docRef.id)
      
      // ローカルデータも更新（先頭に追加）
      news.value.unshift({
        id: newId,
        ...newsData
      })
      
      return docRef.id
    } catch (err) {
      error.value = `News追加エラー: ${err}`
      console.error('Error adding news:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 初期化
  const initialize = async () => {
    try {
      await Promise.all([loadProducts(), loadNews()])
    } catch (err) {
      console.error('Firestore initialization error:', err)
    }
  }

  return {
    products,
    news,
    loading,
    error,
    addProduct,
    addNews,
    initialize
  }
}