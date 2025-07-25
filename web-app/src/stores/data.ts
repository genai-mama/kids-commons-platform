import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  summary: string
  date: string
  category: string
  thumbnail: string
  url: string
}

export interface Stats {
  totalMembers: number
  totalProducts: number
  totalCategories: number
  avgLikes: number
}

export const useDataStore = defineStore('data', () => {
  // State
  const products = ref<Product[]>([
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
      featured: false,
      url: "https://mamaconne-profile.netlify.app/"
    },
    {
      id: 4,
      title: "レシピAI助手",
      category: "料理",
      description: "冷蔵庫の余り物を入力するだけで、AIが美味しいレシピを提案。食材の無駄を減らしながら料理のレパートリーが広がります。",
      tags: ["料理", "AI", "節約"],
      author: {
        name: "料理好きママDさん",
        avatar: "D",
        role: "管理栄養士"
      },
      date: "2025-06-20",
      likes: 67,
      comments: 23,
      thumbnail: "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=レシピAI",
      featured: false,
      url: "https://recipe-ai-assistant.netlify.app/"
    },
    {
      id: 5,
      title: "子どもの成長記録アプリ",
      category: "育児",
      description: "写真と共に子どもの成長を記録・分析できるアプリ。発達の節目や記念日を自動で通知してくれます。",
      tags: ["育児", "記録", "成長"],
      author: {
        name: "新米ママEさん",
        avatar: "E",
        role: "UI/UXデザイナー"
      },
      date: "2025-06-15",
      likes: 89,
      comments: 31,
      thumbnail: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=成長記録",
      featured: true,
      url: "https://kids-growth-tracker.netlify.app/"
    },
    {
      id: 6,
      title: "家計簿スマートBot",
      category: "家計管理",
      description: "レシートを撮影するだけで自動的に家計簿に記録。AIが支出パターンを分析して節約のコツを教えてくれます。",
      tags: ["家計簿", "節約", "AI"],
      author: {
        name: "節約ママFさん",
        avatar: "F",
        role: "ファイナンシャルプランナー"
      },
      date: "2025-06-10",
      likes: 54,
      comments: 18,
      thumbnail: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=家計簿Bot",
      featured: false,
      url: "https://household-bot.netlify.app/"
    }
  ])

  const news = ref<NewsItem[]>([
    {
      id: 1,
      title: "#生成AIママ部 メンバー数1000人突破！",
      summary: "コミュニティ開設から6ヶ月で1000人のママが参加。様々な分野でAI活用が進んでいます。",
      date: "2025-07-01",
      category: "お知らせ",
      thumbnail: "https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=1000人突破",
      url: "#"
    },
    {
      id: 2,
      title: "第1回ママハッカソン開催決定",
      summary: "8月に開催予定の初のハッカソンイベント。テーマは「子育てを楽にするAIツール」です。",
      date: "2025-06-28",
      category: "イベント",
      thumbnail: "https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=ハッカソン",
      url: "#"
    },
    {
      id: 3,
      title: "AIプロンプト集を無料公開",
      summary: "メンバーが作成した育児・家事に役立つプロンプト集をGitHubで公開開始しました。",
      date: "2025-06-25",
      category: "リソース",
      thumbnail: "https://via.placeholder.com/300x200/6366F1/FFFFFF?text=プロンプト集",
      url: "#"
    }
  ])

  const stats = ref<Stats>({
    totalMembers: 1247,
    totalProducts: 23,
    totalCategories: 8,
    avgLikes: 45
  })

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

  return {
    // State
    products,
    news,
    stats,
    likedProducts,
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
    sortProducts
  }
})