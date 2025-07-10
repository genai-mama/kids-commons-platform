// Sample Data for #生成AIママ部

// Products Data
const products = [
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
  }
];

// Statistics Data
const stats = {
  totalMembers: 127,
  totalProducts: 3,
  activeDays: 156,
  totalLikes: 105
};

// News Data
const news = [
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
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'すべて', count: products.length },
  { id: '仕事効率化', name: '仕事効率化', count: products.filter(p => p.category === '仕事効率化').length },
  { id: '学校', name: '学校', count: products.filter(p => p.category === '学校').length },
  { id: 'コミュニケーション', name: 'コミュニケーション', count: products.filter(p => p.category === 'コミュニケーション').length }
];

// Utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', { 
    month: 'short', 
    day: 'numeric' 
  });
};

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1日前';
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}週間前`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months}ヶ月前`;
  }
};

// Filter and sort functions
const filterProducts = (products, category) => {
  if (category === 'all') {
    return products;
  }
  return products.filter(product => product.category === category);
};

const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'likes':
      return sorted.sort((a, b) => b.likes - a.likes);
    case 'comments':
      return sorted.sort((a, b) => b.comments - a.comments);
    case 'date':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    default:
      return sorted;
  }
};

const searchProducts = (products, query) => {
  if (!query) return products;
  
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.title.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    product.author.name.toLowerCase().includes(lowerQuery)
  );
};

// Get featured products
const getFeaturedProducts = () => {
  return products.filter(product => product.featured);
};

// Get latest news
const getLatestNews = (count = 3) => {
  return news.slice(0, count);
};

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    products,
    stats,
    news,
    categories,
    formatDate,
    formatDateShort,
    getTimeAgo,
    filterProducts,
    sortProducts,
    searchProducts,
    getFeaturedProducts,
    getLatestNews
  };
} else {
  // Browser environment - expose as global variables
  window.products = products;
  window.stats = stats;
  window.news = news;
  window.categories = categories;
  window.formatDate = formatDate;
  window.formatDateShort = formatDateShort;
  window.getTimeAgo = getTimeAgo;
  window.filterProducts = filterProducts;
  window.sortProducts = sortProducts;
  window.searchProducts = searchProducts;
  window.getFeaturedProducts = getFeaturedProducts;
  window.getLatestNews = getLatestNews;
}