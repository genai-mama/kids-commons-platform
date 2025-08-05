// Firestoreにテストデータを追加するスクリプト
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyCSoIySPtnNJHz_lN5bLSLhJrDFPfCbRsY",
  authDomain: "gemaimamastoreproject.firebaseapp.com",
  projectId: "gemaimamastoreproject",
  storageBucket: "gemaimamastoreproject.firebasestorage.app",
  messagingSenderId: "727225892227",
  appId: "1:727225892227:web:0958adf8c85a3487b30ab6",
  measurementId: "G-M3VBTG516S"
};

// Firebase初期化
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// テストデータ
const testProducts = [
  {
    id: 1,
    title: "ChatGPTで家事効率化",
    category: "仕事効率化",
    description: "ChatGPTを使って毎日の家事リストを自動生成し、効率的に家事をこなす方法をまとめました。",
    tags: ["ChatGPT", "家事", "効率化"],
    author: {
      name: "田中ママ",
      avatar: "https://via.placeholder.com/150/9B7BD8/FFFFFF?text=田",
      role: "コミュニティリーダー"
    },
    date: "2024-12-01",
    likes: 25,
    comments: 8,
    thumbnail: "https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=ChatGPT家事効率化",
    featured: true,
    url: "https://example.com/chatgpt-housework"
  },
  {
    id: 2,
    title: "子どもの宿題管理アプリ",
    category: "学校",
    description: "Notionを使って子どもの宿題と提出期限を管理するテンプレートを作成しました。",
    tags: ["Notion", "宿題", "管理"],
    author: {
      name: "佐藤ママ",
      avatar: "https://via.placeholder.com/150/9B7BD8/FFFFFF?text=佐",
      role: "メンバー"
    },
    date: "2024-11-28",
    likes: 18,
    comments: 5,
    thumbnail: "https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=宿題管理アプリ",
    featured: false,
    url: "https://example.com/homework-manager"
  }
];

const testNews = [
  {
    id: 1,
    title: "コミュニティ月次勉強会開催のお知らせ",
    excerpt: "12月の月次勉強会では「生成AIを使った年末大掃除効率化術」をテーマに開催します。参加者募集中！",
    date: "2024-12-01",
    url: "https://discord.gg/genai-mama"
  },
  {
    id: 2,
    title: "新メンバー紹介",
    excerpt: "今月は10名の新しいメンバーがコミュニティに参加されました。みなさんで温かく迎えましょう！",
    date: "2024-11-30",
    url: "https://discord.gg/genai-mama"
  }
];

const testMembers = [
  {
    id: 1,
    name: "田中ママ",
    role: "コミュニティリーダー",
    bio: "3児の母。生成AIを活用した家事効率化に詳しく、コミュニティの運営を行っています。",
    avatar: "https://via.placeholder.com/150/9B7BD8/FFFFFF?text=田中",
    skills: ["ChatGPT", "家事効率化", "コミュニティ運営"],
    location: "東京都",
    website: "https://example.com/tanaka",
    twitter: "https://twitter.com/tanaka_mama",
    github: "",
    visible: true,
    email: "tanaka@example.com",
    photos: [],
    icons: [],
    iconDescriptions: [],
    joinDate: "2024-06-24",
    featured: true
  },
  {
    id: 2,
    name: "佐藤ママ",
    role: "メンバー",
    bio: "小学生2人の母。Notionを使った家庭管理が得意です。",
    avatar: "https://via.placeholder.com/150/9B7BD8/FFFFFF?text=佐藤",
    skills: ["Notion", "家庭管理", "データ整理"],
    location: "大阪府",
    website: "",
    twitter: "",
    github: "",
    visible: true,
    email: "sato@example.com",
    photos: [],
    icons: [],
    iconDescriptions: [],
    joinDate: "2024-08-15",
    featured: false
  }
];

// データ追加関数
async function addTestData() {
  try {
    console.log('Adding test products...');
    for (const product of testProducts) {
      await addDoc(collection(db, 'products'), product);
      console.log(`Added product: ${product.title}`);
    }

    console.log('Adding test news...');
    for (const newsItem of testNews) {
      await addDoc(collection(db, 'news'), newsItem);
      console.log(`Added news: ${newsItem.title}`);
    }

    console.log('Adding test members...');
    for (const member of testMembers) {
      await addDoc(collection(db, 'members'), member);
      console.log(`Added member: ${member.name}`);
    }

    console.log('All test data added successfully!');
  } catch (error) {
    console.error('Error adding test data:', error);
  }
}

// 実行
addTestData();