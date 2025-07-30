import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useFirestore } from '../composables/useFirestore'

export interface Product {
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

export interface NewsItem {
  id: number
  title: string
  excerpt: string
  date: string
  url: string
}

export interface Stats {
  totalMembers: number
  totalProducts: number
  totalCategories: number
  avgLikes: number
}

export const useDataStore = defineStore('data', () => {
  // Firestore composable
  const firestore = useFirestore()
  
  // Discord サーバー情報
  const discordServerId = ref('1384414582621081620')
  const discordMemberCount = ref(1247) // フォールバック値
  const discordOnlineCount = ref(0)
  const discordServerName = ref('#生成AIママ部')
  
  // State - Firestoreデータをメインに、フォールバックとしてローカルデータを使用
  const localProducts = [
    {
      id: 1,
      title: "ポストック",
      category: "仕事効率化",
      description: "SNS投稿を効率化するツール。テンプレートやスケジュール機能で、忙しいママでも継続的な情報発信が可能になります。",
      tags: ["SNS", "効率化", "スケジュール"],
      author: {
        name: "開発ママAさん",
        avatar: "A",
        role: "フルスタックエンジニア"
      },
      date: "2025-07-01",
      likes: 42,
      comments: 15,
      thumbnail: "https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=ポストック",
      featured: true,
      url: "https://postock.app/"
    },
    {
      id: 2,
      title: "⚔剣道リーグ戦チェッカー",
      category: "学校",
      description: "剣道のリーグ戦結果を管理・確認できるアプリ。子供の試合結果や順位を簡単に追跡できます。",
      tags: ["剣道", "スポーツ", "管理"],
      author: {
        name: "剣道ママBさん",
        avatar: "B",
        role: "剣道経験者ママ"
      },
      date: "2025-06-28",
      likes: 28,
      comments: 8,
      thumbnail: "https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=⚔剣道",
      featured: true,
      url: "https://kendo-league-checker.netlify.app/"
    },
    {
      id: 3,
      title: "mamaconne プロフィールメーカー",
      category: "コミュニケーション",
      description: "ママ同士のつながりを促進するプロフィール作成ツール。共通点を見つけやすく、新しい出会いをサポートします。",
      tags: ["プロフィール", "コミュニティ", "つながり"],
      author: {
        name: "コミュニティママCさん",
        avatar: "C",
        role: "コミュニティマネージャー"
      },
      date: "2025-06-25",
      likes: 35,
      comments: 12,
      thumbnail: "https://via.placeholder.com/300x200/6366F1/FFFFFF?text=mamaconne",
      featured: true,
      url: "https://mamaconne.netlify.app/profile"
    },
    {
      id: 4,
      title: "葉っぱメモアプリ",
      category: "学習",
      description: "写真を撮影したら、植物の名前を教えてくれて、写真に名前を貼り付けられるアプリです。",
      tags: ["学習", "効率化", "メモ"],
      author: {
        name: "開発ママDさん",
        avatar: "D",
        role: "iOS個人開発者"
      },
      date: "2025-07-10",
      likes: 0,
      comments: 0,
      thumbnail: "https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=葉っぱメモ",
      featured: false,
      url: "https://apps.apple.com/jp/app/%E8%91%89%E3%81%A3%E3%81%B1%E3%83%A1%E3%83%A2/id6746083452"
    }
  ]

  const localNews = [
    {
      id: 1,
      title: "生成AIママ部メンバー100人突破！",
      excerpt: "おかげさまでコミュニティメンバーが100人を突破しました。日々活発な情報交換が行われており、素晴らしい成果物も続々と生まれています。",
      date: "2025-07-05",
      url: "https://note.com/genai-mama/n/n123456789"
    },
    {
      id: 2,
      title: "第1回 AIママハッカソン開催決定",
      excerpt: "8月に第1回AIママハッカソンを開催します。家事育児の課題をAIで解決するアイデアを募集中です。",
      date: "2025-06-30",
      url: "https://note.com/genai-mama/n/n987654321"
    },
    {
      id: 3,
      title: "メンバー作成のAIツールが話題に",
      excerpt: "メンバーが作成した「育児記録AIアシスタント」がSNSで話題となり、多くの育児中のママから注目を集めています。",
      date: "2025-06-25",
      url: "https://note.com/genai-mama/n/n456789123"
    },
    {
      id: 4,
      title: "AI活用セミナー開催レポート",
      excerpt: "先月開催したAI活用セミナーには50名以上のママが参加。ChatGPTの基本的な使い方から実践的なプロンプトまで学びました。",
      date: "2025-06-20",
      url: "https://note.com/genai-mama/n/n789123456"
    },
    {
      id: 5,
      title: "新しいカテゴリ「デザイン」を追加",
      excerpt: "成果物カテゴリに「デザイン」を新たに追加しました。AIを活用したデザインワークの共有をお待ちしています。",
      date: "2025-06-15",
      url: "https://note.com/genai-mama/n/n321654987"
    }
  ]

  // メインのデータはFirestoreを優先し、フォールバックとしてローカルデータを使用
  const products = computed(() => 
    firestore.products.value.length > 0 ? firestore.products.value : localProducts
  )
  
  const news = computed(() => 
    firestore.news.value.length > 0 ? firestore.news.value : localNews
  )

  const stats = computed<Stats>(() => ({
    totalMembers: 127,
    totalProducts: products.value.length,
    totalCategories: categories.value.length,
    avgLikes: Math.round(products.value.reduce((sum, p) => sum + p.likes, 0) / products.value.length) || 0
  }))

  const likedProducts = ref<Set<number>>(new Set())

  // Getters
  const featuredProducts = computed(() => 
    products.value.filter(product => product.featured)
  )

  const categories = computed(() => 
    [...new Set(products.value.map(product => product.category))]
  )

  const latestNews = computed(() => 
    news.value.slice(0, 3)
  )

  // Actions
  function toggleLike(productId: number) {
    const product = products.value.find(p => p.id === productId)
    if (!product) return

    if (likedProducts.value.has(productId)) {
      likedProducts.value.delete(productId)
      product.likes--
    } else {
      likedProducts.value.add(productId)
      product.likes++
    }

    // Save to localStorage
    localStorage.setItem('likedProducts', JSON.stringify([...likedProducts.value]))
  }

  function isLiked(productId: number): boolean {
    return likedProducts.value.has(productId)
  }

  function loadLikedProducts() {
    const saved = localStorage.getItem('likedProducts')
    if (saved) {
      try {
        const parsedLikes = JSON.parse(saved)
        likedProducts.value = new Set(parsedLikes)
      } catch (error) {
        console.error('Failed to load liked products:', error)
      }
    }
  }

  function searchProducts(query: string): Product[] {
    if (!query.trim()) return products.value

    const searchTerm = query.toLowerCase()
    return products.value.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  function filterByCategory(category: string): Product[] {
    if (category === 'all') return products.value
    return products.value.filter(product => product.category === category)
  }

  function sortProducts(productList: Product[], sortBy: 'likes' | 'date' | 'title'): Product[] {
    return [...productList].sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
  }

  // Discord Actions
  function updateDiscordInfo(memberCount: number, onlineCount: number, serverName?: string) {
    discordMemberCount.value = memberCount
    discordOnlineCount.value = onlineCount
    if (serverName) {
      discordServerName.value = serverName
    }
  }

  // Utility functions  
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  function formatDateShort(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return '1日前'
    } else if (diffDays < 7) {
      return `${diffDays}日前`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks}週間前`
    } else {
      const months = Math.floor(diffDays / 30)
      return `${months}ヶ月前`
    }
  }

  return {
    // State
    products,
    news,
    stats,
    likedProducts,
    // Discord State
    discordServerId,
    discordMemberCount,
    discordOnlineCount,
    discordServerName,
    // Getters
    featuredProducts,
    categories,
    latestNews,
    // Actions
    toggleLike,
    isLiked,
    loadLikedProducts,
    searchProducts,
    filterByCategory,
    sortProducts,
    updateDiscordInfo,
    // Utilities
    formatDate,
    formatDateShort,
    getTimeAgo,
    // Firestore methods
    initializeFirestore: firestore.initialize,
    firestoreLoading: firestore.loading,
    firestoreError: firestore.error
  }
})