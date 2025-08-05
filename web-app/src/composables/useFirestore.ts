// Firestore操作用のComposable
import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  onSnapshot,
  where
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

interface Member {
  id: number
  name: string
  role: string
  bio: string
  avatar: string
  skills: string[]
  joinDate: string
  location?: string
  website?: string
  twitter?: string
  github?: string
  featured: boolean
  // 左エリア用のProfile情報
  photos?: string[] // 写真カルーセル用（Base64またはURL）
  personalWebsite?: string // PERSONAL WEBSITEバナー用のURL
  icons?: string[] // アイコン表示用（6個まで、ファイル名やURL）
  iconDescriptions?: string[] // アイコンの説明（ホバー時表示用）
}

export function useFirestore() {
  const products = ref<Product[]>([])
  const news = ref<NewsItem[]>([])
  const members = ref<Member[]>([])
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

  // Product更新
  const updateProduct = async (productId: number, productData: Partial<Product>) => {
    try {
      loading.value = true
      
      // Firestoreドキュメントを探す
      const q = query(collection(db, 'products'), where('id', '==', productId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('Product not found')
      }
      
      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, productData)
      
      // ローカルデータも更新
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...productData }
      }
      
      console.log('Product updated:', productId)
    } catch (err) {
      error.value = `Product更新エラー: ${err}`
      console.error('Error updating product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Product削除
  const deleteProduct = async (productId: number) => {
    try {
      loading.value = true
      
      // Firestoreドキュメントを探す
      const q = query(collection(db, 'products'), where('id', '==', productId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('Product not found')
      }
      
      const docRef = querySnapshot.docs[0].ref
      await deleteDoc(docRef)
      
      // ローカルデータからも削除
      products.value = products.value.filter(p => p.id !== productId)
      
      console.log('Product deleted:', productId)
    } catch (err) {
      error.value = `Product削除エラー: ${err}`
      console.error('Error deleting product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Product複製
  const duplicateProduct = async (productId: number) => {
    try {
      const originalProduct = products.value.find(p => p.id === productId)
      if (!originalProduct) {
        throw new Error('Product not found')
      }
      
      const duplicatedProduct = {
        ...originalProduct,
        title: `${originalProduct.title} (コピー)`,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: 0,
        featured: false
      }
      
      // idを除外してから追加
      const { id, ...productDataWithoutId } = duplicatedProduct
      await addProduct(productDataWithoutId)
      
      console.log('Product duplicated:', productId)
    } catch (err) {
      error.value = `Product複製エラー: ${err}`
      console.error('Error duplicating product:', err)
      throw err
    }
  }

  // News更新
  const updateNews = async (newsId: number, newsData: Partial<NewsItem>) => {
    try {
      loading.value = true
      
      // Firestoreドキュメントを探す
      const q = query(collection(db, 'news'), where('id', '==', newsId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('News not found')
      }
      
      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, newsData)
      
      // ローカルデータも更新
      const index = news.value.findIndex(n => n.id === newsId)
      if (index !== -1) {
        news.value[index] = { ...news.value[index], ...newsData }
      }
      
      console.log('News updated:', newsId)
    } catch (err) {
      error.value = `News更新エラー: ${err}`
      console.error('Error updating news:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // News削除
  const deleteNews = async (newsId: number) => {
    try {
      loading.value = true
      
      // Firestoreドキュメントを探す
      const q = query(collection(db, 'news'), where('id', '==', newsId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('News not found')
      }
      
      const docRef = querySnapshot.docs[0].ref
      await deleteDoc(docRef)
      
      // ローカルデータからも削除
      news.value = news.value.filter(n => n.id !== newsId)
      
      console.log('News deleted:', newsId)
    } catch (err) {
      error.value = `News削除エラー: ${err}`
      console.error('Error deleting news:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // News複製
  const duplicateNews = async (newsId: number) => {
    try {
      const originalNews = news.value.find(n => n.id === newsId)
      if (!originalNews) {
        throw new Error('News not found')
      }
      
      const duplicatedNews = {
        ...originalNews,
        title: `${originalNews.title} (コピー)`,
        date: new Date().toISOString().split('T')[0]
      }
      
      // idを除外してから追加
      const { id, ...newsDataWithoutId } = duplicatedNews
      await addNews(newsDataWithoutId)
      
      console.log('News duplicated:', newsId)
    } catch (err) {
      error.value = `News複製エラー: ${err}`
      console.error('Error duplicating news:', err)
      throw err
    }
  }

  // Members読み込み
  const loadMembers = async () => {
    try {
      loading.value = true
      const q = query(collection(db, 'members'), orderBy('joinDate', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const loadedMembers = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: data.id || parseInt(doc.id),
          ...data
        }
      }) as Member[]
      
      members.value = loadedMembers
      console.log('Members loaded:', members.value.length)
    } catch (err) {
      error.value = `Members読み込みエラー: ${err}`
      console.error('Error loading members:', err)
    } finally {
      loading.value = false
    }
  }

  // Member追加
  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      loading.value = true
      
      // 新しいIDを生成
      const newId = members.value.length > 0 
        ? Math.max(...members.value.map(m => m.id)) + 1 
        : 1

      const docRef = await addDoc(collection(db, 'members'), {
        ...memberData,
        id: newId
      })
      
      console.log('Member added with ID: ', docRef.id)
      
      // ローカルデータも更新
      members.value.unshift({
        id: newId,
        ...memberData
      })
      
      return docRef.id
    } catch (err) {
      error.value = `Member追加エラー: ${err}`
      console.error('Error adding member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Member更新
  const updateMember = async (memberId: number, memberData: Partial<Member>) => {
    try {
      loading.value = true
      
      // Firestoreドキュメントを探す
      const q = query(collection(db, 'members'), where('id', '==', memberId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('Member not found')
      }
      
      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, memberData)
      
      // ローカルデータも更新
      const index = members.value.findIndex(m => m.id === memberId)
      if (index !== -1) {
        members.value[index] = { ...members.value[index], ...memberData }
      }
      
      console.log('Member updated:', memberId)
    } catch (err) {
      error.value = `Member更新エラー: ${err}`
      console.error('Error updating member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Member削除
  const deleteMember = async (memberId: number) => {
    try {
      loading.value = true
      
      // Firestoreドキュメントを探す
      const q = query(collection(db, 'members'), where('id', '==', memberId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('Member not found')
      }
      
      const docRef = querySnapshot.docs[0].ref
      await deleteDoc(docRef)
      
      // ローカルデータからも削除
      members.value = members.value.filter(m => m.id !== memberId)
      
      console.log('Member deleted:', memberId)
    } catch (err) {
      error.value = `Member削除エラー: ${err}`
      console.error('Error deleting member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 初期化
  const initialize = async () => {
    try {
      await Promise.all([loadProducts(), loadNews(), loadMembers()])
    } catch (err) {
      console.error('Firestore initialization error:', err)
    }
  }

  return {
    products,
    news,
    members,
    loading,
    error,
    addProduct,
    addNews,
    addMember,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    updateNews,
    deleteNews,
    duplicateNews,
    updateMember,
    deleteMember,
    initialize
  }
}