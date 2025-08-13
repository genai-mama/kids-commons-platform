<template>
  <div id="app" class="app-container">
    <!-- Header -->
    <AppHeader 
      :current-page="currentPage"
      :is-logged-in="isLoggedIn"
      :mobile-menu-open="mobileMenuOpen"
      :mobile-search-active="mobileSearchActive"
      :search-query="searchQuery"
      @navigate="navigateToPage"
      @toggle-mobile-menu="mobileMenuOpen = !mobileMenuOpen"
      @toggle-mobile-search="mobileSearchActive = !mobileSearchActive"
      @search="handleSearch"
      @search-keypress="handleSearchKeypress"
      @debounce-search="debounceSearch"
      @login="openLoginModal"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Home Page -->
      <HomePage 
        v-if="currentPage === 'home'"
        :products="products"
        :news="news" 
        :members="members"
        :discord-stats="discordStats"
        :stats="stats"
        @navigate="navigateToPage"
      />

      <!-- About Page -->
      <div v-else-if="currentPage === 'about'" class="page-content">
        <About />
      </div>

      <!-- Members Page -->
      <MembersPage 
        v-else-if="currentPage === 'members'"
        :members="members"
        :currentUser="currentUser"
        @navigate="navigateToPage"
      />

      <!-- Products Page -->
      <ProductsPage 
        v-else-if="currentPage === 'products'"
        :products="products"
        :categories="categories"
        :active-filter="currentFilter"
        :current-sort="currentSort"
        @filter-change="handleFilterChange"
        @sort-change="handleSortChange"
        @navigate="navigateToPage"
      />

      <!-- News Page -->
      <News 
        v-else-if="currentPage === 'news'"
        :news="news"
        @navigate="navigateToPage"
      />

      <!-- Admin Page -->
      <AdminPage 
        v-else-if="currentPage === 'admin' && isLoggedIn"
        :active-tab="activeTab"
        :show-product-form="showProductForm"
        :show-news-form="showNewsForm"
        :show-member-form="showMemberForm"
        :editing-product="editingProduct"
        :editing-news="editingNews"
        :editing-member="editingMember"
        @tab-change="activeTab = $event"
        @show-form="handleShowForm"
        @export-csv="handleExportCSV"
        @import-csv="handleImportCSV"
      >
        <!-- Admin Page Slots -->
        <template #product-form>
          <ProductForm 
            :product="editingProduct || newProduct"
            :is-editing="!!editingProduct"
            @save="handleSaveProduct"
            @cancel="handleCancelProductEdit"
          />
        </template>
        
        <template #products-list>
          <ProductsList 
            :products="products"
            @edit="editProduct"
            @delete="deleteProduct"
            @duplicate="handleDuplicateProduct"
          />
        </template>

        <template #news-form>
          <NewsForm 
            :news-item="editingNews || newNews"
            :is-editing="!!editingNews"
            @save="handleSaveNews"
            @cancel="handleCancelNewsEdit"
          />
        </template>
        
        <template #news-list>
          <NewsList 
            :news="news"
            @edit="editNews"
            @delete="deleteNews"
          />
        </template>

        <template #member-form>
          <MemberForm 
            :member="editingMember"
            @save="handleUpdateMember"
            @cancel="cancelEditMember"
          />
        </template>
        
        <template #members-list>
          <MembersList 
            :members="members"
            @edit="editMember"
            @delete="deleteMember"
            @duplicate="handleDuplicateMember"
          />
        </template>
      </AdminPage>

      <!-- Profile Page -->
      <ProfilePage 
        v-else-if="currentPage === 'profile' && isLoggedIn"
        :user-profile="userProfile"
        :current-photo-index="currentPhotoIndex"
        @photo-prev="handlePhotoPrev"
        @photo-next="handlePhotoNext" 
        @photo-goto="handlePhotoGoto"
        @photo-upload="handlePhotoUpload"
        @photo-remove="handlePhotoRemove"
      >
        <template #profile-form>
          <ProfileForm 
            :user-profile="userProfile"
            @save="updateProfile"
            @cancel="navigateToPage('home')"
          />
        </template>
      </ProfilePage>
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Modals -->
    <CommentModal 
      v-if="showCommentModal"
      :member-id="commentingMemberId"
      :new-comment="newComment"
      @close="closeCommentModal"
      @save="handleSaveComment"
    />

    <LoginModal 
      v-if="showLoginModal"
      :login-form="loginForm"
      :is-x-auth-loading="isXAuthLoading"
      :is-x-auth-available="isXAuthAvailable()"
      @close="closeLoginModal"
      @login="handleLoginWithForm"
      @x-login="handleXLogin"
      @show-signup="showSignupModal = true; showLoginModal = false"
    />

    <SignupModal 
      v-if="showSignupModal"
      :signup-form="signupForm"
      :is-x-auth-loading="isXAuthLoading"
      :is-x-auth-available="isXAuthAvailable()"
      @close="closeSignupModal"
      @signup="handleSignup"
      @x-login="handleXLogin"
      @show-login="showLoginModal = true; showSignupModal = false"
      @update-form="handleSignupFormUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from "vue";
import { useFirestore } from "./composables/useFirestore";
import { useAuth } from "./composables/useAuth";
import { initiateXLogin, handleXCallback, mockXLogin, isXAuthAvailable } from "./utils/xAuth";
import { getDiscordMemberCount, createDiscordDataFetcher } from "./utils/discordApi";

// Components
import AppHeader from "./components/layout/AppHeader.vue";
import Footer from "./components/Footer.vue";
import HomePage from "./views/HomePage.vue";
import About from "./views/About.vue";
import MembersPage from "./views/MembersPage.vue";
import ProductsPage from "./views/ProductsPage.vue";
import News from "./views/News.vue";
import AdminPage from "./views/AdminPage.vue";
import ProfilePage from "./views/ProfilePage.vue";

// Modal Components (これらは後でPhase2で作成)
import CommentModal from "./components/modals/CommentModal.vue";
import LoginModal from "./components/modals/LoginModal.vue";
import SignupModal from "./components/modals/SignupModal.vue";

// Form Components (これらは後でPhase2で作成)
import ProductForm from "./components/admin/ProductForm.vue";
import ProductsList from "./components/admin/ProductsList.vue";
import NewsForm from "./components/admin/NewsForm.vue";
import NewsList from "./components/admin/NewsList.vue";
import MemberForm from "./components/admin/MemberForm.vue";
import MembersList from "./components/admin/MembersList.vue";
import ProfileForm from "./components/profile/ProfileForm.vue";

// Firestore composable
const {
  products,
  news,
  members,
  loading,
  error,
  loadProducts,
  loadNews,
  loadMembers,
  addProduct,
  addNews,
  addMemberWithAuthId,
  updateProduct,
  updateNews,
  updateMember,
  deleteProduct: firestoreDeleteProduct,
  deleteNews: firestoreDeleteNews,
  deleteMember: firestoreDeleteMember,
  initialize
} = useFirestore();

// Firebase Authentication
const {
  currentUser: authUser,
  isLoading: authLoading,
  error: authError,
  login: firebaseLogin,
  signup: firebaseSignup,
  logout: firebaseLogout,
  getUserProfile,
  initializeAuth
} = useAuth();

// Core State
const currentPage = ref("home");
const mobileMenuOpen = ref(false);
const mobileSearchActive = ref(false);
const searchQuery = ref("");
const currentFilter = ref("all");
const currentSort = ref("likes");
const likedProducts = ref<Set<number>>(new Set());
let searchTimeout: number | null = null;

// Comment system
const showCommentModal = ref(false);
const commentingMemberId = ref(null);
const newComment = ref({
  authorName: "",
  content: "",
});
const memberComments = ref([]);

// Login system
const isLoggedIn = ref(false);
const showLoginModal = ref(false);
const showSignupModal = ref(false);
const currentUser = ref(null);
const loginForm = ref({
  email: "",
  password: "",
});
const signupForm = ref({
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
});

// User Profile
const userProfile = ref({
  id: null,
  name: "",
  role: "",
  bio: "",
  avatar: "",
  skills: [],
  location: "",
  website: "", // 既存のwebsite（フォーム用）
  personalWebsite: "https://example.com", // バナー表示用の個人サイトURL
  twitter: "",
  github: "",
  visible: true,
  email: "",
  skillsString: "",
  photos: [], // 写真データは別途読み込み
  icons: [], // 新形式: {id, name, thumbnailUrl, description?, link?}[]
  photosString: "",
  iconsString: "",
  joinDate: new Date().toISOString(),
  featured: false,
  iconList: [
    // サンプルデータ
    { id: "mom", emoji: "🧸", label: "MOM", link: "/mom" },
    { id: "diy", emoji: "🌷", label: "DIY", link: "/diy" },
    { id: "book", emoji: "📘", label: "BOOK", link: "/book" },
    { id: "travel", emoji: "🧳", label: "TRAVEL", link: "/travel" }
  ]
});

const currentPhotoIndex = ref(0);

// Admin state
const activeTab = ref("products");
const showProductForm = ref(false);
const showNewsForm = ref(false);
const showMemberForm = ref(false);
const editingProduct = ref<any>(null);
const editingNews = ref<any>(null);
const editingMember = ref<any>(null);

// New item forms
const newProduct = ref({
  title: "",
  category: "仕事効率化",
  description: "",
  image: "",
  url: "",
  author: {
    name: "",
    avatar: ""
  },
  date: new Date().toISOString(),
  tags: [],
  tagString: "",
  likes: 0
});

const newNews = ref({
  title: "",
  excerpt: "",
  url: "",
});

// X Authentication
const isXAuthLoading = ref(false);

// Discord Stats
const discordServerId = "1384414582621081620"; // 提供されたサーバーID
const discordStats = ref({
  memberCount: 127, // デフォルト値
  onlineCount: 0,
  serverName: "#生成AIママ部",
  isLoading: false,
  lastUpdated: null as Date | null,
  error: null as string | null,
});

let discordDataFetcher: any = null;

// Stats（Firestoreから計算）
// コミュニティ開始日から活動日数を計算
const calculateActiveDays = () => {
  const startDate = new Date('2025-06-24'); // コミュニティ開始日
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const stats = ref({
  totalMembers: 127,
  totalProducts: 4,
  activeDays: calculateActiveDays(),
  totalLikes: 105,
});

const categories = ref([
  { id: "all", name: "すべて", count: 4 },
  { id: "仕事効率化", name: "仕事効率化", count: 1 },
  { id: "学校", name: "学校", count: 1 },
  { id: "コミュニケーション", name: "コミュニケーション", count: 1 },
  { id: "学習", name: "学習", count: 1 },
]);

// Available icons for profile cards
const availableIcons = ref([
  { id: "mom", emoji: "🧸", label: "MOM", link: "/family" },
  { id: "diy", emoji: "🌷", label: "DIY", link: "/diy" },
  { id: "book", emoji: "📘", label: "BOOK", link: "/books" },
  { id: "travel", emoji: "🧳", label: "TRAVEL", link: "/travel" },
  { id: "cooking", emoji: "🥘", label: "COOKING", link: "/cooking" },
  { id: "fitness", emoji: "💪", label: "FITNESS", link: "/fitness" },
  { id: "music", emoji: "🎵", label: "MUSIC", link: "/music" },
  { id: "art", emoji: "🎨", label: "ART", link: "/art" },
  { id: "tech", emoji: "💻", label: "TECH", link: "/tech" },
  { id: "learning", emoji: "📚", label: "LEARNING", link: "/learning" },
  { id: "photography", emoji: "📸", label: "PHOTO", link: "/photography" },
  { id: "garden", emoji: "🌱", label: "GARDEN", link: "/garden" }
]);

// Navigation
const navigateToPage = async (page: string) => {
  currentPage.value = page;
  mobileMenuOpen.value = false;

  // プロフィール画面への遷移時の特別処理
  if (page === 'profile' && isLoggedIn.value) {
    console.log("プロフィール画面に遷移:", userProfile.value.email);
    console.log("現在のmembers:", members.value.length, "件");
    
    const existingMember = members.value.find(member => member.email === userProfile.value.email);
    console.log("既存メンバー検索結果:", existingMember ? existingMember.name : "見つからない");
    
    if (existingMember) {
      userProfile.value = {
        ...userProfile.value,
        ...existingMember,
        skillsString: existingMember.skills ? existingMember.skills.join(", ") : "",
        photosString: existingMember.photos?.join(", ") || "",
        iconsString: existingMember.icons?.join(", ") || "",
        iconDescriptionsString: existingMember.iconDescriptions?.join(", ") || ""
      };
      
      const profileWithoutPhotos = { ...userProfile.value };
      delete profileWithoutPhotos.photos;
      localStorage.setItem(`profile_${userProfile.value.email}`, JSON.stringify(profileWithoutPhotos));
      console.log('Profile updated from existing member data');
      
      userProfile.value.photos = loadUserPhotos(userProfile.value.email);
    } else {
      if (userProfile.value.skills && Array.isArray(userProfile.value.skills)) {
        userProfile.value.skillsString = userProfile.value.skills.join(", ");
      }
    }
  }

  // Vue.jsコンポーネントが自動的にデータを表示するため、
  // 手動でのレンダリング処理は不要
};

// Event Handlers
const handleFilterChange = (filter: string) => {
  currentFilter.value = filter;
  renderProducts();
};

const handleSortChange = (sort: string) => {
  currentSort.value = sort;
  renderProducts();
};

const handleShowForm = (type: string) => {
  if (type === 'product') {
    showProductForm.value = true;
  } else if (type === 'news') {
    showNewsForm.value = true;
  }
};

const handleExportCSV = (type: string) => {
  // CSV export logic
  console.log('Export CSV:', type);
};

const handleImportCSV = (type: string) => {
  // CSV import logic  
  console.log('Import CSV:', type);
};

// Search
const handleSearch = () => {
  if (currentPage.value !== "products") {
    navigateToPage("products");
  }
  setTimeout(() => {
    renderProducts();
  }, 100);
};

const handleSearchKeypress = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    handleSearch();
  }
};

const debounceSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    if (currentPage.value === "products") {
      renderProducts();
    }
  }, 300);
};

// Auth
const openLoginModal = () => {
  showLoginModal.value = true;
  loginForm.value = { email: "", password: "" };
};

const closeLoginModal = () => {
  showLoginModal.value = false;
  loginForm.value = { email: "", password: "" };
};

const closeSignupModal = () => {
  showSignupModal.value = false;
  signupForm.value = { name: "", email: "", password: "", passwordConfirm: "" };
};

const handleLoginWithForm = async (formData: { email: string, password: string }) => {
  // フォームデータを更新
  loginForm.value.email = formData.email;
  loginForm.value.password = formData.password;
  
  // 実際のログイン処理を実行
  await handleLogin();
};

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    alert("メールアドレスとパスワードを入力してください");
    return;
  }

  try {
    // Firebase Authenticationでログイン
    const user = await firebaseLogin(loginForm.value.email, loginForm.value.password);
    
    if (user) {
      isLoggedIn.value = true;
      
      // ユーザープロフィールをローカルストレージから読み込み
      console.log("ログイン処理:", user.email);
      const savedProfile = localStorage.getItem(`profile_${user.email}`);
      console.log("保存されたプロフィール:", savedProfile ? "見つかった" : "見つからない");
      
      // membersコレクションからユーザー情報を検索
      const existingMember = members.value.find(member => member.email === user.email);
      
      if (savedProfile) {
        userProfile.value = JSON.parse(savedProfile);
        console.log("プロフィール読み込み完了:", userProfile.value.name);
      } else if (existingMember) {
        // ローカルにないがメンバーコレクションにはある場合
        userProfile.value = {
          ...existingMember,
          skillsString: existingMember.skills ? existingMember.skills.join(", ") : "",
          iconDescriptionsString: existingMember.iconDescriptions?.join(", ") || ""
        };
        console.log('メンバーコレクションからプロフィールを復元:', userProfile.value.name);
      } else {
        // 新規ユーザーの場合、デフォルトプロフィールを作成
        userProfile.value = {
          id: Date.now(),
          name: user.email.split('@')[0],
          role: "メンバー",
          bio: "よろしくお願いします！",
          avatar: "",
          skills: [],
          skillsString: "",
          location: "",
          website: "",
          personalWebsite: "",
          twitter: "",
          github: "",
          visible: true,
          email: user.email,
          photos: [],
          icons: [],
          iconDescriptions: [],
          photosString: "",
          iconsString: "",
          iconDescriptionsString: "",
          joinDate: new Date().toISOString(),
          featured: false,
          iconList: []
        };
        
        console.log('新規ユーザープロフィールを作成:', userProfile.value.name);
      }
      
      currentUser.value = userProfile.value;
      
      // ログイン状態をローカルストレージに保存
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUserEmail', user.email);
      
      // 既存メンバーの情報でプロフィールを同期
      if (existingMember) {
        // 既存メンバーの情報でプロフィールを更新
        userProfile.value = {
          ...userProfile.value,
          ...existingMember,
          skillsString: existingMember.skills ? existingMember.skills.join(", ") : "",
          iconDescriptionsString: existingMember.iconDescriptions?.join(", ") || ""
        };
        currentUser.value = userProfile.value;
        console.log('Profile synced with existing member data on login');
      }
      
      // 写真データを別途読み込み
      userProfile.value.photos = loadUserPhotos(user.email);
      
      // ログイン時にもメンバーデータを同期
      await updateMemberProfile();
      
      closeLoginModal();
      alert("ログインしました！");
    }
  } catch (error) {
    console.error('Login failed:', error);
    // Firebase Authエラーの場合は、useAuthが既に適切なメッセージを設定済み
    if (authError.value) {
      alert(authError.value);
    } else {
      // QuotaExceededError等のその他のエラー
      if (error.name === 'QuotaExceededError') {
        closeLoginModal();
        alert("ログインしました！\n（ストレージ容量が不足しています。一部機能が制限される可能性があります）");
      } else {
        alert("ログインに失敗しました。");
      }
    }
  }
};

// サインアップフォーム更新関数
const handleSignupFormUpdate = (field: string, value: string) => {
  signupForm.value[field] = value;
};

const handleSignup = async () => {
  // バリデーション
  if (!signupForm.value.name || !signupForm.value.email || !signupForm.value.password) {
    alert("すべての必須項目を入力してください");
    return;
  }
  
  if (signupForm.value.password !== signupForm.value.passwordConfirm) {
    alert("パスワードが一致しません");
    return;
  }
  
  if (signupForm.value.password.length < 6) {
    alert("パスワードは6文字以上で入力してください");
    return;
  }
  
  try {
    // Firebase Authenticationでユーザー作成
    const userData = {
      name: signupForm.value.name
    };
    
    const user = await firebaseSignup(signupForm.value.email, signupForm.value.password, userData);
    
    if (user) {
      // ログイン状態に設定
      isLoggedIn.value = true;
      
      // ユーザープロフィール作成
      userProfile.value = {
        id: Date.now(),
        name: signupForm.value.name,
        role: "メンバー",
        bio: "よろしくお願いします！",
        avatar: "",
        skills: [],
        skillsString: "",
        location: "",
        website: "",
        personalWebsite: "",
        twitter: "",
        github: "",
        visible: true,
        email: user.email,
        photos: [],
        icons: [],
        iconDescriptions: [],
        photosString: "",
        iconsString: "",
        iconDescriptionsString: "",
        joinDate: new Date().toISOString(),
        featured: false,
        iconList: []
      };
      
      currentUser.value = userProfile.value;
      
      // ローカルストレージに保存
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUserEmail', user.email);
      
      // membersコレクションにFirebase Auth UUIDをドキュメントIDとして追加
      try {
        await addMemberWithAuthId(user.uid, {
          name: signupForm.value.name,
          role: "メンバー",
          bio: "よろしくお願いします！",
          avatar: "",
          skills: [],
          joinDate: new Date().toISOString(),
          location: "",
          website: "",
          twitter: "",
          github: "",
          featured: false,
          email: user.email,
          visible: true,
          photos: [],
          personalWebsite: "",
          icons: [],
          iconDescriptions: []
        });
        console.log('Member added to members collection with Auth UID:', user.uid);
      } catch (memberError) {
        console.error('Failed to add to members collection:', memberError);
        // メンバー追加エラーでもアカウント作成は成功とする
      }
      
      closeSignupModal();
      alert("アカウントが作成されました！");
    }
  } catch (error) {
    console.error('Signup failed:', error);
    if (authError.value) {
      alert(authError.value);
    } else {
      alert("アカウント作成に失敗しました");
    }
  }
};

const handleLogout = () => {
  isLoggedIn.value = false;
  currentUser.value = null;
  userProfile.value = {
    id: null,
    name: "",
    role: "",
    bio: "",
    avatar: "",
    skills: [],
    location: "",
    website: "",
    personalWebsite: "",
    twitter: "",
    github: "",
    email: "",
    skillsString: "",
    photos: [],
    icons: [],
    iconDescriptions: [],
    photosString: "",
    iconsString: "",
    iconDescriptionsString: "",
    joinDate: new Date().toISOString(),
    featured: false,
    visible: true
  };
  
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUserEmail');
  navigateToPage('home');
  alert("ログアウトしました");
};

const handleXLogin = async () => {
  // X login logic
  console.log("X Login");
};

// Profile
const updateProfile = async () => {
  console.log("updateProfile関数が呼び出されました");
  console.log("現在のuserProfile:", userProfile.value);
  
  if (!userProfile.value.name || !userProfile.value.role) {
    alert("名前と役職は必須です");
    return;
  }

  try {
    console.log("プロフィール保存処理を開始します");
    
    if (userProfile.value.skillsString) {
      userProfile.value.skills = userProfile.value.skillsString
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    try {
      const profileWithoutPhotos = { ...userProfile.value };
      delete profileWithoutPhotos.photos;
      localStorage.setItem(`profile_${userProfile.value.email}`, JSON.stringify(profileWithoutPhotos));
    } catch (storageError) {
      if (storageError.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded when saving profile');
        cleanupOldLocalStorageData();
      }
    }
    
    currentUser.value = { ...userProfile.value };
    
    await updateMemberProfile();
    
    if (currentPage.value === 'profile') {
      userProfile.value.skillsString = userProfile.value.skills.join(", ");
    }
    
    alert("プロフィールを保存しました！");
  } catch (error) {
    console.error('Profile update failed:', error);
    alert("プロフィールの保存に失敗しました");
  }
};

const updateMemberProfile = async () => {
  if (!userProfile.value.email) {
    console.warn('No email found in user profile, skipping member profile update');
    return;
  }

  try {
    console.log('Updating member profile for:', userProfile.value.email);
    
    // 既存メンバーを検索
    const existingMember = members.value.find(member => member.email === userProfile.value.email);
    
    if (existingMember) {
      // 既存メンバーを更新
      await updateMember(existingMember.id, {
        name: userProfile.value.name,
        role: userProfile.value.role,
        bio: userProfile.value.bio,
        avatar: userProfile.value.avatar || `https://via.placeholder.com/150/9B7BD8/FFFFFF?text=${encodeURIComponent(userProfile.value.name.charAt(0))}`,
        skills: userProfile.value.skills || [],
        location: userProfile.value.location,
        website: userProfile.value.website,
        personalWebsite: userProfile.value.personalWebsite,
        twitter: userProfile.value.twitter,
        github: userProfile.value.github,
        visible: userProfile.value.visible,
        email: userProfile.value.email,
        photos: userProfile.value.photos || [],
        icons: userProfile.value.icons || [],
        bannerImage: userProfile.value.bannerImage || null
      });
      console.log('Member profile updated successfully');
    } else {
      // 新規メンバーを追加
      const memberData = {
        name: userProfile.value.name,
        role: userProfile.value.role,
        bio: userProfile.value.bio,
        avatar: userProfile.value.avatar || `https://via.placeholder.com/150/9B7BD8/FFFFFF?text=${encodeURIComponent(userProfile.value.name.charAt(0))}`,
        skills: userProfile.value.skills || [],
        location: userProfile.value.location,
        website: userProfile.value.website,
        personalWebsite: userProfile.value.personalWebsite,
        twitter: userProfile.value.twitter,
        github: userProfile.value.github,
        visible: userProfile.value.visible,
        email: userProfile.value.email,
        photos: userProfile.value.photos || [],
        icons: userProfile.value.icons || [],
        bannerImage: userProfile.value.bannerImage || null,
        joinDate: userProfile.value.joinDate || new Date().toISOString(),
        featured: userProfile.value.featured || false
      };
      
      await addMember(memberData);
      console.log('New member profile created successfully');
    }
  } catch (error) {
    console.error('Failed to update member profile:', error);
  }
};

// Photo handlers
const handlePhotoPrev = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--;
  }
};

const handlePhotoNext = () => {
  if (currentPhotoIndex.value < (userProfile.value.photos?.length || 0) - 1) {
    currentPhotoIndex.value++;
  }
};

const handlePhotoGoto = (index: number) => {
  currentPhotoIndex.value = index;
};

const handlePhotoUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;
  
  // ファイルサイズ制限 (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('ファイルサイズは5MB以下にしてください');
    return;
  }
  
  // ファイル形式チェック
  if (!file.type.startsWith('image/')) {
    alert('画像ファイルを選択してください');
    return;
  }
  
  // 最大4枚まで
  if (userProfile.value.photos && userProfile.value.photos.length >= 4) {
    alert('写真は最大4枚まで追加できます');
    return;
  }
  
  // FileReaderで画像を読み込み
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageUrl = e.target?.result as string;
    
    if (!userProfile.value.photos) {
      userProfile.value.photos = [];
    }
    
    // 写真を追加
    userProfile.value.photos.push(imageUrl);
    
    // ローカルストレージに保存
    saveUserPhotos(userProfile.value.email, userProfile.value.photos);
    
    // 新しく追加した写真にインデックスを移動
    currentPhotoIndex.value = userProfile.value.photos.length - 1;
    
    console.log('Photo uploaded successfully');
  };
  
  reader.onerror = () => {
    alert('画像の読み込みに失敗しました');
  };
  
  reader.readAsDataURL(file);
  
  // inputをリセット
  input.value = '';
};

const handlePhotoRemove = (photoNumber: number) => {
  if (!userProfile.value.photos || userProfile.value.photos.length === 0) {
    return;
  }
  
  const photoIndex = photoNumber - 1; // 1-based to 0-based
  
  if (photoIndex < 0 || photoIndex >= userProfile.value.photos.length) {
    return;
  }
  
  if (confirm(`Photo${photoNumber}を削除しますか？`)) {
    // 写真を削除
    userProfile.value.photos.splice(photoIndex, 1);
    
    // カレントインデックスを調整
    if (currentPhotoIndex.value >= userProfile.value.photos.length) {
      currentPhotoIndex.value = Math.max(0, userProfile.value.photos.length - 1);
    }
    
    // ローカルストレージに保存
    saveUserPhotos(userProfile.value.email, userProfile.value.photos);
    
    console.log(`Photo ${photoNumber} removed successfully`);
  }
};

// Admin handlers
const handleSaveProduct = async (product: any) => {
  console.log("Save product:", product);
  try {
    if (editingProduct.value && editingProduct.value.id) {
      // 編集モード：既存の成果物を更新
      const productId = editingProduct.value.id;
      const updateData = {
        ...product,
        updatedAt: new Date().toISOString()
      };
      await updateProduct(productId, updateData);
      console.log("成果物が更新されました:", product.title);
      editingProduct.value = null;
    } else {
      // 新規追加モード：新しい成果物を追加
      const newProduct = {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await addProduct(newProduct);
      console.log("新しい成果物が追加されました:", newProduct.title);
    }
    showProductForm.value = false;
  } catch (error) {
    console.error("成果物の保存に失敗しました:", error);
    alert("保存に失敗しました。もう一度お試しください。");
  }
};

const handleCancelProductEdit = () => {
  editingProduct.value = null;
  showProductForm.value = false;
};

const editProduct = (product: any) => {
  editingProduct.value = product;
};

const deleteProduct = async (productId: number) => {
  console.log("Delete product:", productId);
  try {
    await firestoreDeleteProduct(productId);
    console.log("成果物が削除されました:", productId);
  } catch (error) {
    console.error("成果物の削除に失敗しました:", error);
    alert("削除に失敗しました。もう一度お試しください。");
  }
};

const handleDuplicateProduct = async (productId: number) => {
  console.log("Duplicate product:", productId);
  try {
    // 元の成果物を見つける
    const originalProduct = products.value.find(p => p.id === productId);
    if (!originalProduct) {
      alert("複製する成果物が見つかりませんでした。");
      return;
    }

    // 複製データを作成（IDを除外し、タイトルに「（コピー）」を追加）
    const duplicatedProduct = {
      ...originalProduct,
      title: `${originalProduct.title}（コピー）`,
      featured: false, // 複製時は注目成果物にしない
      likes: 0, // いいね数はリセット
      comments: 0, // コメント数はリセット
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // IDを削除
    delete duplicatedProduct.id;

    // 新しい成果物として追加
    await addProduct(duplicatedProduct);
    console.log("成果物が複製されました:", duplicatedProduct.title);
  } catch (error) {
    console.error("成果物の複製に失敗しました:", error);
    alert("複製に失敗しました。もう一度お試しください。");
  }
};

const handleSaveNews = (newsItem: any) => {
  console.log("Save news:", newsItem);
};

const handleCancelNewsEdit = () => {
  editingNews.value = null;
  showNewsForm.value = false;
};

const editNews = (newsItem: any) => {
  editingNews.value = newsItem;
};

const deleteNews = (newsId: number) => {
  console.log("Delete news:", newsId);
};

const handleUpdateMember = (member: any) => {
  console.log("Update member:", member);
};

const cancelEditMember = () => {
  editingMember.value = null;
};

const editMember = (member: any) => {
  editingMember.value = member;
};

const deleteMember = (memberId: number) => {
  console.log("Delete member:", memberId);
};

const handleDuplicateMember = (memberId: number) => {
  console.log("Duplicate member:", memberId);
};

// Comment handlers
const closeCommentModal = () => {
  showCommentModal.value = false;
  commentingMemberId.value = null;
  newComment.value = { authorName: "", content: "" };
};

const handleSaveComment = (comment: any) => {
  console.log("Save comment:", comment);
};

// Utility functions (これらは元のApp.vueから移植する必要があります)
const loadUserPhotos = (email: string) => {
  try {
    const photoKey = `photos_${email}`;
    const savedPhotos = localStorage.getItem(photoKey);
    return savedPhotos ? JSON.parse(savedPhotos) : [];
  } catch (error) {
    console.error('Failed to load user photos:', error);
    return [];
  }
};

const saveUserPhotos = (email: string, photos: string[]) => {
  try {
    const photoKey = `photos_${email}`;
    localStorage.setItem(photoKey, JSON.stringify(photos));
    console.log('Photos saved to localStorage');
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Attempting to clean up old data.');
      cleanupOldLocalStorageData();
      // 再試行
      try {
        localStorage.setItem(photoKey, JSON.stringify(photos));
        console.log('Photos saved after cleanup');
      } catch (retryError) {
        console.error('Failed to save photos even after cleanup:', retryError);
      }
    } else {
      console.error('Failed to save user photos:', error);
    }
  }
};

// LocalStorageの古いデータをクリーンアップ
const cleanupOldLocalStorageData = () => {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000; // 1週間前
    
    // 古いデータを削除
    keys.forEach(key => {
      if (key.startsWith('temp_') || key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('Old localStorage data cleaned up');
  } catch (error) {
    console.error('Failed to cleanup localStorage:', error);
  }
};

// Helper functions for data filtering and processing
const getFeaturedProducts = () => {
  return products.value.filter((product) => product.featured);
};

const getLatestNews = (count = 3) => {
  return news.value.slice(0, count);
};

const getFeaturedMembers = () => {
  return members.value.filter((member) => member.featured);
};

const getAllMembers = () => {
  return members.value.filter((member) => !member.featured);
};

const filterProducts = (products: any[], category: string) => {
  if (category === "all") {
    return products;
  }
  return products.filter((product) => product.category === category);
};

const sortProducts = (products: any[], sortBy: string) => {
  const sorted = [...products];

  switch (sortBy) {
    case "likes":
      return sorted.sort((a, b) => b.likes - a.likes);
    case "comments":
      return sorted.sort((a, b) => b.comments - a.comments);
    case "date":
      return sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    default:
      return sorted;
  }
};

const searchProducts = (products: any[], query: string) => {
  if (!query) return products;

  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.author.name.toLowerCase().includes(lowerQuery) ||
      (product.tags && product.tags.some((tag: string) => 
        tag.toLowerCase().includes(lowerQuery)))
  );
};

// Vue.jsコンポーネントベースなので、レンダー関数は不要
// データは自動的にリアクティブに表示される

// Initialization
onMounted(async () => {
  try {
    console.log("アプリケーション初期化開始");
    
    // Firebase Authの初期化
    initializeAuth();
    
    const savedComments = localStorage.getItem("memberComments");
    if (savedComments) {
      memberComments.value = JSON.parse(savedComments);
    }
    
    console.log("アプリケーション初期化完了");
  } catch (error) {
    console.error("アプリケーション初期化エラー:", error);
  }
  
  // ログイン状態をローカルストレージから復元
  const savedLoginState = localStorage.getItem('isLoggedIn');
  const savedUserEmail = localStorage.getItem('currentUserEmail');
  
  if (savedLoginState === 'true' && savedUserEmail) {
    isLoggedIn.value = true;
    const savedProfile = localStorage.getItem(`profile_${savedUserEmail}`);
    if (savedProfile) {
      userProfile.value = JSON.parse(savedProfile);
      userProfile.value.photos = loadUserPhotos(savedUserEmail);
      currentUser.value = userProfile.value;
    }
  }

  // Discord統計を取得
  try {
    discordStats.value.isLoading = true;
    discordDataFetcher = createDiscordDataFetcher(
      import.meta.env.VITE_DISCORD_GUILD_ID || discordServerId
    );
    
    if (discordDataFetcher) {
      discordDataFetcher.start((data: any) => {
        if (data && data.approximate_member_count) {
          discordStats.value.memberCount = data.approximate_member_count;
          discordStats.value.error = null;
        }
      });
    } else {
      console.warn('Failed to create Discord data fetcher, using default values');
    }
  } catch (error) {
    discordStats.value.error = 'Discord統計の取得中にエラーが発生しました';
    console.error('Error updating Discord stats:', error);
  } finally {
    discordStats.value.isLoading = false;
  }

  // Firestoreの初期化とデータ読み込み
  try {
    await initialize();
    initializePage("home");
  } catch (error) {
    console.error("Failed to initialize Firestore:", error);
  }
});

onUnmounted(() => {
  if (discordDataFetcher) {
    discordDataFetcher.stop();
  }
});

const initializePage = (page: string) => {
  // Vue.jsコンポーネントが自動的にデータを表示するため、
  // 特別な初期化処理は不要
  console.log(`Page initialized: ${page}`);
};

// Firestoreデータの変更を監視
watch(
  [products, news, members],
  () => {
    // Vue.jsのリアクティブシステムが自動的にUIを更新するため、
    // 手動でのレンダリング処理は不要
    console.log(`Data updated - Products: ${products.value.length}, News: ${news.value.length}, Members: ${members.value.length}`);
    
    // プロフィール画面でスキル配列を文字列に変換
    if (currentPage.value === "profile" && userProfile.value.skills && Array.isArray(userProfile.value.skills)) {
      userProfile.value.skillsString = userProfile.value.skills.join(", ");
    }
  },
  { deep: true }
);
</script>

<style>
/* 元のstyle.cssとresponsive.cssの内容をそのまま適用 */
@import "./assets/styles/original-style.css";

/* 基本的なレイアウトスタイル */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.page-content {
  padding: var(--spacing-12) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

/* 共通ボタンスタイル */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  gap: var(--spacing-2);
}

.btn-primary {
  background: var(--primary-purple);
  color: var(--white);
}

.btn-primary:hover {
  background: var(--primary-purple-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--white);
  color: var(--primary-purple);
  border: 2px solid var(--primary-purple);
}

.btn-secondary:hover {
  background: var(--primary-purple-lighter);
}

.btn-outline {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-outline:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-4);
  }
}
</style>