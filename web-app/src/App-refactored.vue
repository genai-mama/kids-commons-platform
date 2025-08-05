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
        @navigate="navigateToPage"
      />

      <!-- About Page -->
      <div v-else-if="currentPage === 'about'" class="page-content">
        <About />
        <p>アバウトページ</p>
      </div>
      

      <!-- Members Page -->
      <MembersPage 
        v-else-if="currentPage === 'members'"
        :members="members"
        @navigate="navigateToPage"
      />

      <!-- Products Page -->
      <ProductsPage 
        v-else-if="currentPage === 'products'"
        :products="products"
        :active-filter="currentFilter"
        :current-sort="currentSort"
        @filter-change="handleFilterChange"
        @sort-change="handleSortChange"
        @navigate="navigateToPage"
      />

      <!-- News Page -->
      <div v-else-if="currentPage === 'news'" class="page-content">
        <News />
      </div>

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
      :is-x-auth-available="isXAuthAvailable"
      @close="closeLoginModal"
      @login="handleLogin"
      @x-login="handleXLogin"
      @show-signup="showSignupModal = true; showLoginModal = false"
    />

    <SignupModal 
      v-if="showSignupModal"
      :signup-form="signupForm"
      :is-x-auth-loading="isXAuthLoading"
      :is-x-auth-available="isXAuthAvailable"
      @close="closeSignupModal"
      @signup="handleSignup"
      @x-login="handleXLogin"
      @show-login="showLoginModal = true; showSignupModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from "vue";
import { useFirestore } from "./composables/useFirestore";
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
  updateProduct,
  updateNews,
  updateMember,
  deleteProduct: firestoreDeleteProduct,
  deleteNews: firestoreDeleteNews,
  deleteMember: firestoreDeleteMember,
  initialize
} = useFirestore();

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
  content: "",
  image: "",
  date: new Date().toISOString(),
  url: ""
});

// X Authentication
const isXAuthLoading = ref(false);

// Discord Stats
const discordStats = ref({
  memberCount: null,
  isLoading: false,
  error: null
});

let discordDataFetcher: any = null;

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

  // Firestoreの再初期化
  if (page !== "home") {
    try {
      await initialize();
      console.log("Firestore re-initialized for navigation");
    } catch (error) {
      console.error("Failed to re-initialize Firestore:", error);
    }
  }

  if (page === "home") {
    await nextTick();
    renderFeaturedProducts();
    renderLatestNews();
  } else if (page === "members") {
    await nextTick();
    renderFeaturedMembers();
    renderMembers();
  } else if (page === "products") {
    await nextTick();
    renderProducts();
  } else if (page === "news") {
    await nextTick();
    renderNews();
  }
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

const handleLogin = async () => {
  // Login logic here
  console.log("Login:", loginForm.value);
};

const handleSignup = async () => {
  // Signup logic here  
  console.log("Signup:", signupForm.value);
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

    const profileWithoutPhotos = { ...userProfile.value };
    delete profileWithoutPhotos.photos;
    localStorage.setItem(`profile_${userProfile.value.email}`, JSON.stringify(profileWithoutPhotos));
    
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
  // Member profile update logic
  console.log("Update member profile");
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
  // Photo upload logic
  console.log("Photo upload:", event);
};

const handlePhotoRemove = (photoNumber: number) => {
  // Photo remove logic
  console.log("Remove photo:", photoNumber);
};

// Admin handlers
const handleSaveProduct = (product: any) => {
  console.log("Save product:", product);
};

const handleCancelProductEdit = () => {
  editingProduct.value = null;
  showProductForm.value = false;
};

const editProduct = (product: any) => {
  editingProduct.value = product;
};

const deleteProduct = (productId: number) => {
  console.log("Delete product:", productId);
};

const handleDuplicateProduct = (productId: number) => {
  console.log("Duplicate product:", productId);
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

// Render functions (これらは実際のDOM操作ロジックが必要)
const renderFeaturedProducts = () => {
  console.log("Render featured products");
};

const renderLatestNews = () => {
  console.log("Render latest news");
};

const renderFeaturedMembers = () => {
  console.log("Render featured members");
};

const renderMembers = () => {
  console.log("Render members");
};

const renderProducts = () => {
  console.log("Render products");
};

const renderNews = () => {
  console.log("Render news");
};

// Initialization
onMounted(async () => {
  try {
    console.log("アプリケーション初期化開始");
    
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
      import.meta.env.VITE_DISCORD_GUILD_ID || "1234567890123456789"
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
  switch (page) {
    case "home":
      renderFeaturedProducts();
      renderLatestNews();
      break;
    case "members":
      renderFeaturedMembers();
      renderMembers();
      break;
    case "products":
      renderProducts();
      break;
    case "news":
      renderNews();
      break;
  }
};

// Firestoreデータの変更を監視してレンダリング更新
watch(
  [products, news, members],
  () => {
    if (currentPage.value === "home") {
      renderFeaturedProducts();
      renderLatestNews();
    } else if (currentPage.value === "members") {
      renderFeaturedMembers();
      renderMembers();
    } else if (currentPage.value === "products") {
      renderProducts();
    } else if (currentPage.value === "news") {
      renderNews();
    } else if (currentPage.value === "profile") {
      if (userProfile.value.skills && Array.isArray(userProfile.value.skills)) {
        userProfile.value.skillsString = userProfile.value.skills.join(", ");
      }
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