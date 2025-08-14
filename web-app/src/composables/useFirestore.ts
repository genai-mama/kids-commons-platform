// Firestore操作用のComposable
import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
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
  
  // Profile連携用
  email: string // Profile連携用（必須）
  visible: boolean // 公開/非表示フラグ
  authUid?: string // Firebase Auth UUID（新規ユーザーのみ）
  
  // Profile拡張情報
  photos?: string[] // 写真カルーセル用（Base64またはURL）
  personalWebsite?: string // PERSONAL WEBSITEバナー用のURL
  
  // アイコン情報（詳細化）
  icons?: {
    id: string // アイコンID（例: "vue", "react", "typescript"）
    name: string // アイコン表示名（例: "Vue.js", "React", "TypeScript"）
    thumbnailUrl: string // サムネイルURL
    description?: string // アイコンの説明
    link?: string // クリック時のリンクURL
  }[]
}

// Firestore用のユーティリティ関数
const removeUndefinedFields = (obj: any): any => {
  const cleanedObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      // 配列の場合はサイズをチェック
      if (Array.isArray(value)) {
        const arraySize = JSON.stringify(value).length
        if (arraySize > 1048576) { // 1MB
          console.warn(`Array field '${key}' is too large: ${arraySize} bytes`)
          // 大きすぎる配列は除外するか、警告を出す
          continue
        }
      }
      cleanedObj[key] = value
    }
  }
  return cleanedObj
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
          email: data.email || `member${data.id || parseInt(doc.id)}@example.com`, // デフォルトemail
          visible: data.visible !== undefined ? data.visible : true, // デフォルトtrue
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

  // Member追加 (Firebase Auth UUIDをドキュメントIDとして使用)
  const addMemberWithAuthId = async (authUid: string, memberData: Omit<Member, 'id'>) => {
    try {
      loading.value = true
      
      // undefined値を除去したデータを作成
      const cleanedMemberData = removeUndefinedFields(memberData)
      
      // Firebase AuthのUUIDをドキュメントIDとして使用
      const memberDocRef = doc(db, 'members', authUid)
      
      const memberWithId = {
        ...cleanedMemberData,
        id: Date.now(), // 内部IDとして使用
        authUid: authUid // Firebase Auth UIDを記録
      }
      
      // データサイズをチェック（1MB制限）
      const dataSize = JSON.stringify(memberWithId).length
      console.log(`Member data size: ${dataSize} bytes`)
      
      if (dataSize > 1048576) { // 1MB = 1048576 bytes
        throw new Error(`データサイズが大きすぎます（${dataSize} bytes）。写真やアイコンの数を減らしてください。`)
      }
      
      console.log('Adding member with cleaned data:', memberWithId)
      
      await setDoc(memberDocRef, memberWithId)
      
      console.log('Member added with Auth UID: ', authUid)
      
      // ローカルデータも更新
      members.value.unshift(memberWithId)
      
      return authUid
    } catch (err) {
      // Firestoreの詳細エラーを解析
      let errorMessage = 'Member追加エラー'
      
      if (err.message) {
        if (err.message.includes('1048487 bytes') || err.message.includes('1048576')) {
          errorMessage = 'データサイズが上限（1MB）を超えています。写真やアイコンの数を減らしてください。'
        } else if (err.message.includes('PERMISSION_DENIED')) {
          errorMessage = 'データベースへのアクセス権限がありません。'
        } else if (err.message.includes('UNAVAILABLE')) {
          errorMessage = 'データベースに接続できません。インターネット接続を確認してください。'
        } else {
          errorMessage = `Member追加エラー: ${err.message}`
        }
      }
      
      error.value = errorMessage
      console.error('Error adding member with auth ID:', err)
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      })
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  // Member更新
  const updateMember = async (memberId: number, memberData: Partial<Member>) => {
    try {
      loading.value = true
      
      // undefined値を除去したデータを作成
      const cleanedMemberData = removeUndefinedFields(memberData)
      
      // データサイズをチェック（1MB制限）
      const dataSize = JSON.stringify(cleanedMemberData).length
      console.log(`Member data size: ${dataSize} bytes`)
      
      if (dataSize > 1048576) { // 1MB = 1048576 bytes
        throw new Error(`データサイズが大きすぎます（${dataSize} bytes）。写真やアイコンの数を減らしてください。`)
      }
      
      console.log('Original memberData:', memberData)
      console.log('Cleaned memberData:', cleanedMemberData)
      
      // Firestoreドキュメントを探す
      const q = query(collection(db, 'members'), where('id', '==', memberId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('Member not found')
      }
      
      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, cleanedMemberData)
      
      // ローカルデータも更新
      const index = members.value.findIndex(m => m.id === memberId)
      if (index !== -1) {
        members.value[index] = { ...members.value[index], ...cleanedMemberData }
      }
      
      console.log('Member updated:', memberId)
    } catch (err) {
      // Firestoreの詳細エラーを解析
      let errorMessage = 'Member更新エラー'
      
      if (err.message) {
        if (err.message.includes('1048487 bytes') || err.message.includes('1048576')) {
          errorMessage = 'データサイズが上限（1MB）を超えています。写真やアイコンの数を減らしてください。'
        } else if (err.message.includes('PERMISSION_DENIED')) {
          errorMessage = 'データベースへのアクセス権限がありません。'
        } else if (err.message.includes('UNAVAILABLE')) {
          errorMessage = 'データベースに接続できません。インターネット接続を確認してください。'
        } else {
          errorMessage = `Member更新エラー: ${err.message}`
        }
      }
      
      error.value = errorMessage
      console.error('Error updating member:', err)
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      })
      throw new Error(errorMessage)
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
    addMemberWithAuthId,
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