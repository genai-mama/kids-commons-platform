<template>
  <div id="app" class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <a href="#" @click="navigateToPage('home')">
            <img
              src="/images/logo/genai-mama-logo.svg"
              alt="#生成AIママ部"
              class="logo-image"
            />
          </a>
        </div>
        <nav class="nav" id="nav" :class="{ active: mobileMenuOpen }">
          <ul class="nav-list">
            <li>
              <a
                href="#"
                @click="navigateToPage('home')"
                class="nav-link"
                :class="{ active: currentPage === 'home' }"
                >ホーム</a
              >
            </li>
            <li>
              <a
                href="#"
                @click="navigateToPage('about')"
                class="nav-link"
                :class="{ active: currentPage === 'about' }"
                >About</a
              >
            </li>
            <li>
              <a
                href="#"
                @click="navigateToPage('members')"
                class="nav-link"
                :class="{ active: currentPage === 'members' }"
                >Members</a
              >
            </li>
            <li>
              <a
                href="#"
                @click="navigateToPage('products')"
                class="nav-link"
                :class="{ active: currentPage === 'products' }"
                >Products</a
              >
            </li>
            <li>
              <a
                href="#"
                @click="navigateToPage('news')"
                class="nav-link"
                :class="{ active: currentPage === 'news' }"
                >News</a
              >
            </li>
            <li v-if="isLoggedIn">
              <a
                href="#"
                @click="navigateToPage('admin')"
                class="nav-link"
                :class="{ active: currentPage === 'admin' }"
                >Managed</a
              >
            </li>
            <li v-if="isLoggedIn">
              <a
                href="#"
                @click="navigateToPage('profile')"
                class="nav-link"
                :class="{ active: currentPage === 'profile' }"
                >Profile</a
              >
            </li>
          </ul>
        </nav>
        <div class="header-actions">
          <div
            class="search-bar"
            :class="{ 'mobile-active': mobileSearchActive }"
          >
            <input
              type="text"
              placeholder="成果物を検索"
              class="search-input"
              id="search-input"
              v-model="searchQuery"
              @keypress="handleSearchKeypress"
              @input="debounceSearch"
            />
            <button class="search-btn" id="search-btn" @click="handleSearch">
              🔍
            </button>
          </div>
          <button
            class="search-toggle"
            @click="toggleMobileSearch"
            v-show="!mobileSearchActive"
          >
            🔍
          </button>
          
          <button v-if="!isLoggedIn" class="btn btn-login" @click="openLoginModal">
            ログイン
          </button>
          <button v-if="isLoggedIn" class="btn btn-logout" @click="handleLogout">
            ログアウト
          </button>
          
          <button
            class="mobile-menu-toggle"
            id="mobile-menu-toggle"
            @click="toggleMobileMenu"
            :class="{ active: mobileMenuOpen }"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main main-content">
      <!-- Home Page -->
      <div class="page" id="home" :class="{ active: currentPage === 'home' }">
        <!-- Hero Section -->
        <section class="hero">
          <div class="container">
            <div class="hero-content">
              <h1 class="hero-title">#生成AIママ部</h1>
              <p class="hero-subtitle">
                家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティです🎵<br />
                エンジニアでも、そうでなくても、経験問わずママさんなら大歓迎🙆‍♀️✨<br />
                ぜひみんなで生成AI活用していきましょう〜！
              </p>
              <!-- <div class="hero-actions">
                <a href="#" class="btn-primary" id="hero-join-btn" @click="handleJoinClick">参加する</a>
                <a href="#" class="btn-secondary" @click="navigateToPage('products')">成果物を見る</a>
              </div> -->
            </div>
            <div class="hero-visual">
              <div class="hero-icon">🤖</div>
              <div class="hero-decoration"></div>
            </div>
          </div>
        </section>

        <!-- Stats Section -->
        <section class="stats">
          <div class="container">
            <div class="stats-grid" id="stats-grid">
              <div class="stat-card">
                <div class="stat-number" :data-count="discordStats.memberCount || 127">
                  {{ discordStats.isLoading ? '...' : (discordStats.memberCount || stats.totalMembers) }}
                </div>
                <div class="stat-label">
                  {{ discordStats.serverName ? `${discordStats.serverName} アクティブメンバー数` : 'アクティブメンバー数' }}
                  <span v-if="discordStats.error" class="discord-error" :title="discordStats.error">⚠️</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-number" data-count="4">
                  {{ stats.totalProducts }}
                </div>
                <div class="stat-label">成果物</div>
              </div>
              <div class="stat-card">
                <div class="stat-number" data-count="156">
                  {{ stats.activeDays }}
                </div>
                <div class="stat-label">活動日数</div>
              </div>
              <div class="stat-card">
                <div class="stat-number" data-count="105">
                  {{ stats.totalLikes }}
                </div>
                <div class="stat-label">総いいね数</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Main Content Layout - 横幅が広いときは2列、狭いときは1列 -->
        <div class="home-main-content">
          <div class="container">
            <div class="content-layout">
              <!-- Featured Products Section -->
              <section class="featured-products content-section">
                <div class="section-header">
                  <h2 class="section-title">注目の成果物</h2>
                  <a
                    href="#"
                    @click="navigateToPage('products')"
                    class="view-all"
                    >すべて見る →</a
                  >
                </div>
                <div class="products-grid" id="featured-products-grid">
                  <!-- 動的に生成される -->
                </div>
              </section>

              <!-- Latest News Section -->
              <section class="latest-news content-section news-section">
                <div class="section-header">
                  <h2 class="section-title">最新ニュース</h2>
                  <a href="#" @click="navigateToPage('news')" class="view-all"
                    >すべて見る →</a
                  >
                </div>
                <div class="news-list" id="latest-news-grid">
                  <!-- 動的に生成される -->
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <!-- About Page -->
      <div class="page" id="about" :class="{ active: currentPage === 'about' }">
        <section class="about">
          <div class="container">
            <h1 class="page-title">#生成AIママ部とは</h1>
            <div class="about-content">
              <div class="about-text">
                <h2>コミュニティについて</h2>
                <p>
                  #生成AIママ部は、家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティです。
                  エンジニアでも、そうでなくても、経験問わずママさんなら大歓迎です。
                </p>
                <p>
                  日々の生活で生成AIを活用する方法を共有し、お互いに学び合い、サポートし合うコミュニティを目指しています。
                </p>

                <h3>活動内容</h3>
                <ul>
                  <li>生成AIツールの活用法共有</li>
                  <li>家事・育児の効率化アイデア交換</li>
                  <li>プログラミング・デザインの学習サポート</li>
                  <li>成果物の発表・フィードバック</li>
                  <li>ママ同士の情報交換・相談</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Members Page -->
      <div class="page" id="members" :class="{ active: currentPage === 'members' }">
        <section class="members">
          <div class="container">
            <h1 class="page-title">メンバー紹介</h1>
            <p class="page-subtitle">
              #生成AIママ部で活動するメンバーの皆さんをご紹介します。<br>
              様々なバックグラウンドを持つママたちが、生成AIを活用して日々の生活を豊かにしています。
            </p>

            <!-- Featured Members -->
            <div class="featured-members" v-if="getFeaturedMembers().length > 0">
              <h2 class="section-title">コアメンバー</h2>
              <div class="members-grid featured-grid" id="featured-members-grid">
                <!-- 動的に生成される -->
              </div>
            </div>

            <!-- All Members -->
            <div class="all-members">
              <h2 class="section-title">メンバー一覧</h2>
              <div class="members-grid" id="members-grid">
                <!-- 動的に生成される -->
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Products Page - 元の静的サイトのレイアウトを正確に再現 -->
      <div
        class="page"
        id="products"
        :class="{ active: currentPage === 'products' }"
      >
        <section class="products">
          <div class="container">
            <h1 class="page-title">成果物一覧</h1>

            <!-- Filters - レスポンシブ対応 -->
            <div class="filters">
              <div class="filters-inner">
                <div class="filter-tabs">
                  <button
                    v-for="category in categories"
                    :key="category.id"
                    class="filter-tab"
                    :class="{ active: currentFilter === category.id }"
                    :data-filter="category.id"
                    @click="setFilter(category.id)"
                  >
                    {{ category.name }}
                  </button>
                </div>

                <div class="sort-section">
                  <div class="sort-options">
                    <select
                      class="sort-select"
                      id="sort-select"
                      v-model="currentSort"
                      @change="handleSortChange"
                    >
                      <option value="likes">いいね数順</option>
                      <option value="comments">コメント数順</option>
                      <option value="date">新着順</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="products-grid" id="products-grid">
              <!-- 動的に生成される -->
            </div>
          </div>
        </section>
      </div>

      <!-- News Page -->
      <div class="page" id="news" :class="{ active: currentPage === 'news' }">
        <section class="news">
          <div class="container">
            <h1 class="page-title">最新ニュース</h1>
            <div class="news-grid" id="news-grid">
              <!-- 動的に生成される -->
            </div>
          </div>
        </section>
      </div>

      <!-- Admin Page -->
      <div class="page" id="admin" :class="{ active: currentPage === 'admin' }">
        <section class="admin">
          <div class="container">
            <h1 class="page-title">🛠️ 生成AIママ部：成果物 & ニュース管理</h1>

            <!-- タブ切り替え -->
            <div class="admin-tabs">
              <button
                class="admin-tab"
                :class="{ active: currentAdminTab === 'products' }"
                @click="setAdminTab('products')"
              >
                成果物管理
              </button>
              <button
                class="admin-tab"
                :class="{ active: currentAdminTab === 'members' }"
                @click="setAdminTab('members')"
              >
                メンバー管理
              </button>
              <button
                class="admin-tab"
                :class="{ active: currentAdminTab === 'news' }"
                @click="setAdminTab('news')"
              >
                ニュース管理
              </button>
            </div>

            <!-- 成果物管理 -->
            <div v-if="currentAdminTab === 'products'" class="admin-content">
              <div class="admin-header">
                <h2>成果物一覧</h2>
                <div class="admin-actions">
                  <div class="csv-actions">
                    <button
                      class="btn-csv"
                      @click="exportProductsCSV"
                      title="CSVエクスポート"
                    >
                      📥 エクスポート
                    </button>
                    <label class="btn-csv csv-import">
                      📤 インポート
                      <input
                        type="file"
                        accept=".csv"
                        @change="importProductsCSV"
                        style="display: none"
                      />
                    </label>
                  </div>
                  <button
                    class="btn-primary"
                    @click="showProductForm = !showProductForm"
                  >
                    {{ showProductForm ? "フォームを閉じる" : "新規追加" }}
                  </button>
                </div>
              </div>

              <!-- 新規追加フォーム -->
              <div v-if="showProductForm" class="admin-form">
                <h3>新しい成果物を追加</h3>
                <form @submit.prevent="handleAddProduct" :key="showProductForm">
                  <div class="form-group">
                    <label>タイトル</label>
                    <input type="text" v-model="newProduct.title" required />
                  </div>
                  <div class="form-group">
                    <label>カテゴリ</label>
                    <select v-model="newProduct.category" required>
                      <option value="仕事効率化">仕事効率化</option>
                      <option value="学校">学校</option>
                      <option value="コミュニケーション">
                        コミュニケーション
                      </option>
                      <option value="学習">学習</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>説明</label>
                    <textarea
                      v-model="newProduct.description"
                      required
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>タグ（カンマ区切り）</label>
                    <input
                      type="text"
                      v-model="newProduct.tagsString"
                      placeholder="SNS, 効率化, スケジュール"
                    />
                  </div>
                  <div class="form-group">
                    <label>作者名</label>
                    <input
                      type="text"
                      v-model="newProduct.authorName"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>作者の役割</label>
                    <input
                      type="text"
                      v-model="newProduct.authorRole"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>URL</label>
                    <input type="url" v-model="newProduct.url" required />
                  </div>
                  <div class="form-group">
                    <label>
                      <input type="checkbox" v-model="newProduct.featured" />
                      注目の成果物として表示
                    </label>
                  </div>
                  <button type="submit" class="btn-primary">追加</button>
                </form>
              </div>

              <!-- 編集フォーム -->
              <div v-if="editingProduct" class="admin-form">
                <h3>成果物を編集</h3>
                <form @submit.prevent="handleUpdateProduct">
                  <div class="form-group">
                    <label>タイトル</label>
                    <input type="text" v-model="editingProduct.title" required />
                  </div>
                  <div class="form-group">
                    <label>カテゴリ</label>
                    <select v-model="editingProduct.category" required>
                      <option value="仕事効率化">仕事効率化</option>
                      <option value="学校">学校</option>
                      <option value="コミュニケーション">コミュニケーション</option>
                      <option value="学習">学習</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>説明</label>
                    <textarea
                      v-model="editingProduct.description"
                      required
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>タグ（カンマ区切り）</label>
                    <input
                      type="text"
                      v-model="editingProduct.tagsString"
                      placeholder="SNS, 効率化, スケジュール"
                    />
                  </div>
                  <div class="form-group">
                    <label>作者名</label>
                    <input
                      type="text"
                      v-model="editingProduct.author.name"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>作者の役割</label>
                    <input
                      type="text"
                      v-model="editingProduct.author.role"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>URL</label>
                    <input type="url" v-model="editingProduct.url" required />
                  </div>
                  <div class="form-group">
                    <label>
                      <input type="checkbox" v-model="editingProduct.featured" />
                      注目の成果物として表示
                    </label>
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn-primary">更新</button>
                    <button type="button" class="btn-secondary" @click="cancelEditProduct">キャンセル</button>
                  </div>
                </form>
              </div>

              <!-- 成果物一覧 -->
              <div class="admin-list">
                <div
                  v-for="product in products"
                  :key="product.id"
                  class="admin-item"
                >
                  <div class="admin-item-content">
                    <h4>{{ product.title }}</h4>
                    <p>{{ product.category }} | {{ product.author.name }}</p>
                    <p>{{ product.description }}</p>
                    <p class="admin-item-meta">
                      いいね: {{ product.likes }} | コメント: {{ product.comments }} | 
                      {{ product.featured ? '注目' : '通常' }}
                    </p>
                  </div>
                  <div class="admin-item-actions">
                    <button 
                      class="btn-edit" 
                      @click="startEditProduct(product)"
                      title="編集"
                    >
                      ✏️
                    </button>
                    <button 
                      class="btn-duplicate" 
                      @click="handleDuplicateProduct(product.id)"
                      title="複製"
                    >
                      📋
                    </button>
                    <button 
                      class="btn-delete" 
                      @click="handleDeleteProduct(product.id)"
                      title="削除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ニュース管理 -->
            <div v-if="currentAdminTab === 'news'" class="admin-content">
              <div class="admin-header">
                <h2>ニュース一覧</h2>
                <div class="admin-actions">
                  <div class="csv-actions">
                    <button
                      class="btn-csv"
                      @click="exportNewsCSV"
                      title="CSVエクスポート"
                    >
                      📥 エクスポート
                    </button>
                    <label class="btn-csv csv-import">
                      📤 インポート
                      <input
                        type="file"
                        accept=".csv"
                        @change="importNewsCSV"
                        style="display: none"
                      />
                    </label>
                  </div>
                  <button
                    class="btn-primary"
                    @click="showNewsForm = !showNewsForm"
                  >
                    {{ showNewsForm ? "フォームを閉じる" : "新規追加" }}
                  </button>
                </div>
              </div>

              <!-- 新規追加フォーム -->
              <div v-if="showNewsForm" class="admin-form">
                <h3>新しいニュースを追加</h3>
                <form @submit.prevent="handleAddNews" :key="showNewsForm">
                  <div class="form-group">
                    <label>タイトル</label>
                    <input type="text" v-model="newNews.title" required />
                  </div>
                  <div class="form-group">
                    <label>抜粋</label>
                    <textarea
                      v-model="newNews.excerpt"
                      required
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>URL</label>
                    <input type="url" v-model="newNews.url" required />
                  </div>
                  <button type="submit" class="btn-primary">追加</button>
                </form>
              </div>

              <!-- ニュース編集フォーム -->
              <div v-if="editingNews" class="admin-form">
                <h3>ニュースを編集</h3>
                <form @submit.prevent="handleUpdateNews">
                  <div class="form-group">
                    <label>タイトル</label>
                    <input type="text" v-model="editingNews.title" required />
                  </div>
                  <div class="form-group">
                    <label>抜粋</label>
                    <textarea
                      v-model="editingNews.excerpt"
                      required
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>URL</label>
                    <input type="url" v-model="editingNews.url" required />
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn-primary">更新</button>
                    <button type="button" class="btn-secondary" @click="cancelEditNews">キャンセル</button>
                  </div>
                </form>
              </div>

              <!-- ニュース一覧 -->
              <div class="admin-list">
                <div
                  v-for="newsItem in news"
                  :key="newsItem.id"
                  class="admin-item"
                >
                  <div class="admin-item-content">
                    <h4>{{ newsItem.title }}</h4>
                    <p>{{ formatDate(newsItem.date) }}</p>
                    <p>{{ newsItem.excerpt }}</p>
                  </div>
                  <div class="admin-item-actions">
                    <button 
                      class="btn-edit" 
                      @click="startEditNews(newsItem)"
                      title="編集"
                    >
                      ✏️
                    </button>
                    <button 
                      class="btn-duplicate" 
                      @click="handleDuplicateNews(newsItem.id)"
                      title="複製"
                    >
                      📋
                    </button>
                    <button 
                      class="btn-delete" 
                      @click="handleDeleteNews(newsItem.id)"
                      title="削除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- メンバー管理 -->
            <div v-if="currentAdminTab === 'members'" class="admin-content">
              <div class="admin-header">
                <h2>メンバー一覧</h2>
              </div>


              <!-- メンバー編集フォーム -->
              <div v-if="editingMember" class="admin-form">
                <h3>メンバーを編集</h3>
                <form @submit.prevent="handleUpdateMember">
                  <div class="form-group">
                    <label>名前</label>
                    <input type="text" v-model="editingMember.name" required />
                  </div>
                  <div class="form-group">
                    <label>役割</label>
                    <input type="text" v-model="editingMember.role" required />
                  </div>
                  <div class="form-group">
                    <label>自己紹介</label>
                    <textarea
                      v-model="editingMember.bio"
                      required
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>アバターURL</label>
                    <input type="url" v-model="editingMember.avatar" />
                  </div>
                  <div class="form-group">
                    <label>スキル（カンマ区切り）</label>
                    <input
                      type="text"
                      v-model="editingMember.skillsString"
                      placeholder="Vue.js, TypeScript, デザイン"
                    />
                  </div>
                  <div class="form-group">
                    <label>所在地</label>
                    <input type="text" v-model="editingMember.location" />
                  </div>
                  <div class="form-group">
                    <label>WebサイトURL</label>
                    <input type="url" v-model="editingMember.website" />
                  </div>
                  <div class="form-group">
                    <label>TwitterURL</label>
                    <input type="url" v-model="editingMember.twitter" />
                  </div>
                  <div class="form-group">
                    <label>GitHubURL</label>
                    <input type="url" v-model="editingMember.github" />
                  </div>
                  
                  <!-- 左エリア用のProfile情報 -->
                  <div class="form-group">
                    <label>PERSONAL WEBSITE URL</label>
                    <input type="url" v-model="editingMember.personalWebsite" placeholder="個人サイトのURL" />
                  </div>
                  <div class="form-group">
                    <label>アイコン（カンマ区切り、最大6個）</label>
                    <input 
                      type="text" 
                      v-model="editingMember.iconsString" 
                      placeholder="vue.svg, typescript.svg, figma.svg"
                    />
                  </div>
                  <div class="form-group">
                    <label>アイコンの説明（カンマ区切り、アイコンと同じ順序）</label>
                    <input 
                      type="text" 
                      v-model="editingMember.iconDescriptionsString" 
                      placeholder="Vue.js, TypeScript, Figma"
                    />
                  </div>
                  <div class="form-group">
                    <label>写真（Base64またはURL、カンマ区切り）</label>
                    <textarea
                      v-model="editingMember.photosString"
                      rows="3"
                      placeholder="写真のURLやBase64データをカンマ区切りで入力"
                    ></textarea>
                  </div>
                  
                  <div class="form-group">
                    <label>
                      <input type="checkbox" v-model="editingMember.featured" />
                      コアメンバーとして表示
                    </label>
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn-primary">更新</button>
                    <button type="button" class="btn-secondary" @click="cancelEditMember">キャンセル</button>
                  </div>
                </form>
              </div>

              <!-- メンバー一覧 -->
              <div class="admin-list">
                <div
                  v-for="member in members"
                  :key="member.id"
                  class="admin-item"
                >
                  <div class="admin-item-content">
                    <h4>{{ member.name }}</h4>
                    <p>{{ member.role }} | {{ formatDate(member.joinDate) }}</p>
                    <p>{{ member.bio }}</p>
                    <p class="admin-item-meta">
                      スキル: {{ member.skills.join(', ') }} | 
                      {{ member.featured ? 'コアメンバー' : '通常メンバー' }}
                    </p>
                  </div>
                  <div class="admin-item-actions">
                    <button 
                      class="btn-edit" 
                      @click="startEditMember(member)"
                      title="編集"
                    >
                      ✏️
                    </button>
                    <button 
                      class="btn-duplicate" 
                      @click="handleDuplicateMember(member.id)"
                      title="複製"
                    >
                      📋
                    </button>
                    <button 
                      class="btn-delete" 
                      @click="handleDeleteMember(member.id)"
                      title="削除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Profile Page -->
      <div class="page" id="profile" :class="{ active: currentPage === 'profile' }" v-if="isLoggedIn">
        <section class="profile">
          <div class="container">
            <h1 class="page-title">プロフィール編集</h1>
            <div class="profile-content">
              <!-- 左側カラム: プロフィールカード -->
              <div class="profile-card-left">
                <!-- 写真カルーセル -->
                <div class="photo-carousel-section">
                  <div class="photo-carousel">
                    <div 
                      v-if="userProfile.photos && userProfile.photos.length > 0"
                      class="carousel-container"
                    >
                      <div 
                        v-for="(photo, index) in userProfile.photos" 
                        :key="index"
                        class="carousel-slide"
                        :class="{ active: currentPhotoIndex === index }"
                      >
                        <img :src="photo" :alt="`Photo ${index + 1}`" class="carousel-image" />
                        <!-- 写真番号表示 -->
                        <div class="photo-number">Photo{{ index + 1 }}</div>
                      </div>
                      
                      <!-- ナビゲーションボタン（複数枚の場合のみ） -->
                      <div v-if="userProfile.photos.length > 1" class="carousel-nav">
                        <button 
                          @click="prevPhoto" 
                          class="carousel-btn carousel-prev"
                          :disabled="currentPhotoIndex === 0"
                        >
                          ‹
                        </button>
                        <button 
                          @click="nextPhoto" 
                          class="carousel-btn carousel-next"
                          :disabled="currentPhotoIndex === userProfile.photos.length - 1"
                        >
                          ›
                        </button>
                      </div>
                      
                      <!-- インジケーター（複数枚の場合のみ） -->
                      <div v-if="userProfile.photos.length > 1" class="carousel-indicators">
                        <button
                          v-for="(photo, index) in userProfile.photos"
                          :key="`indicator-${index}`"
                          @click="currentPhotoIndex = index"
                          class="carousel-indicator"
                          :class="{ active: currentPhotoIndex === index }"
                        ></button>
                      </div>
                    </div>
                    
                    <!-- 写真なしの場合のプレースホルダー -->
                    <div v-else class="photo-placeholder" @click="triggerPhotoUpload">
                      <div class="placeholder-content">
                        <span class="placeholder-icon">📸</span>
                        <p>写真を追加</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 画像選択ボタン -->
                  <div class="photo-upload-controls">
                    <input 
                      ref="photoInput"
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      @change="handlePhotoUpload" 
                      style="display: none;"
                    />
                    <button 
                      @click="triggerPhotoUpload" 
                      class="btn btn-secondary photo-upload-btn"
                    >
                      <span class="btn-icon">📷</span>
                      写真を選択
                    </button>
                    <button 
                      v-if="userProfile.photos && userProfile.photos.length > 0"
                      @click="removeCurrentPhoto" 
                      class="btn btn-danger photo-remove-btn"
                    >
                      <span class="btn-icon">🗑️</span>
                      削除
                    </button>
                  </div>
                </div>

                <!-- PERSONAL WEBSITEバナー -->
                <div 
                  v-if="userProfile.personalWebsite" 
                  class="personal-website-banner"
                  @click="openPersonalWebsite"
                >
                  <div class="pixel-banner">
                    <span class="banner-text">PERSONAL WEBSITE!</span>
                  </div>
                </div>

                <!-- アイコン表示領域 -->
                <div v-if="userProfile.iconList && userProfile.iconList.length > 0" class="icon-section">
                  <div class="icon-grid">
                    <div
                      v-for="icon in userProfile.iconList"
                      :key="icon.id"
                      class="icon-item"
                      @click="navigateToIconPage(icon)"
                    >
                      <div class="icon-circle">
                        <span class="icon-emoji">{{ icon.emoji }}</span>
                      </div>
                      <span class="icon-label">{{ icon.label }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右側カラム: フォーム -->
              <div class="profile-form-container">
                <div class="form-row">
                  <div class="form-group">
                    <label for="profile-name">名前</label>
                    <input
                      id="profile-name"
                      v-model="userProfile.name"
                      type="text"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="profile-role">役職</label>
                    <input
                      id="profile-role"
                      v-model="userProfile.role"
                      type="text"
                      required
                    />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="profile-bio">自己紹介</label>
                  <textarea
                    id="profile-bio"
                    v-model="userProfile.bio"
                    rows="4"
                  ></textarea>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="profile-avatar">アバターURL</label>
                    <input
                      id="profile-avatar"
                      v-model="userProfile.avatar"
                      type="url"
                    />
                  </div>
                  <div class="form-group">
                    <label for="profile-location">所在地</label>
                    <input
                      id="profile-location"
                      v-model="userProfile.location"
                      type="text"
                    />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="profile-skills">スキル（カンマ区切り）</label>
                  <input
                    id="profile-skills"
                    v-model="userProfile.skillsString"
                    type="text"
                    placeholder="Vue.js, TypeScript, デザイン"
                  />
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="profile-website">WebサイトURL</label>
                    <input
                      id="profile-website"
                      v-model="userProfile.website"
                      type="url"
                    />
                  </div>
                  <div class="form-group">
                    <label for="profile-twitter">TwitterURL</label>
                    <input
                      id="profile-twitter"
                      v-model="userProfile.twitter"
                      type="url"
                    />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="profile-github">GitHubURL</label>
                  <input
                    id="profile-github"
                    v-model="userProfile.github"
                    type="url"
                  />
                </div>
                
                <div class="form-group">
                  <label for="profile-personal-website">個人サイトURL（PERSONAL WEBSITEバナー用）</label>
                  <input
                    id="profile-personal-website"
                    v-model="userProfile.personalWebsite"
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div class="form-group">
                  <label>アイコン設定</label>
                  <div class="icon-settings">
                    <div class="icon-settings-grid">
                      <div
                        v-for="(icon, index) in availableIcons"
                        :key="icon.id"
                        class="icon-setting-item"
                        :class="{ active: isIconSelected(icon.id) }"
                        @click="toggleIcon(icon)"
                      >
                        <div class="icon-preview">
                          <span class="icon-emoji">{{ icon.emoji }}</span>
                        </div>
                        <span class="icon-name">{{ icon.label }}</span>
                      </div>
                    </div>
                    <p class="icon-help-text">最大6個まで選択できます</p>
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      v-model="userProfile.visible"
                    />
                    メンバー一覧に表示する
                  </label>
                </div>
                
                <div class="profile-actions">
                  <button class="btn btn-secondary" @click="navigateToPage('home')">キャンセル</button>
                  <button class="btn btn-primary" @click="updateProfile">保存</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer app-footer">
      <div class="container">
        <p>&copy; 2025 #生成AIママ部. All rights reserved.</p>
      </div>
    </footer>
  </div>

  <!-- Comment Modal -->
  <div v-if="showCommentModal" class="modal-overlay" @click="closeCommentModal">
    <div class="modal-content comment-modal" @click.stop>
      <div class="modal-header">
        <h3>コメントを追加</h3>
        <button class="modal-close" @click="closeCommentModal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="comment-author">お名前</label>
          <input
            id="comment-author"
            v-model="newComment.authorName"
            type="text"
            placeholder="あなたのお名前を入力してください"
            required
          />
        </div>
        <div class="form-group">
          <label for="comment-content">コメント</label>
          <textarea
            id="comment-content"
            v-model="newComment.content"
            placeholder="コメントを入力してください"
            rows="4"
            required
          ></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeCommentModal">キャンセル</button>
        <button class="btn btn-primary" @click="addComment">投稿</button>
      </div>
    </div>
  </div>

  <!-- Login Modal -->
  <div v-if="showLoginModal" class="modal-overlay" @click="closeLoginModal">
    <div class="modal-content login-modal" @click.stop>
      <div class="modal-body">
        <div class="login-form-container">
          <div class="login-header">
            <h3>ログイン</h3>
            <button class="modal-close" @click="closeLoginModal">&times;</button>
          </div>
          
          <!-- X (Twitter) ログイン - 一時的に非表示 -->
          <!-- 
          <div class="x-login-section">
            <button 
              class="btn btn-x-login" 
              @click="handleXLogin"
              :disabled="isXAuthLoading"
            >
              <span v-if="isXAuthLoading">認証中...</span>
              <span v-else>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Xアカウントでログイン
              </span>
            </button>
          </div>
          
          <div class="login-divider">
            <span>または</span>
          </div>
          -->
          
          <!-- 従来のメール/パスワードログイン -->
          <div class="form-group">
            <label for="login-email">メールアドレス</label>
            <input
              id="login-email"
              v-model="loginForm.email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div class="form-group">
            <label for="login-password">パスワード</label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              placeholder="パスワードを入力"
              required
            />
          </div>
          
          <div class="login-form-actions">
            <button class="btn btn-secondary" @click="closeLoginModal">キャンセル</button>
            <button class="btn btn-primary" @click="handleLogin">ログイン</button>
          </div>
          
          <div class="signup-link">
            <p>アカウントをお持ちでない方は <a href="#" @click.prevent="openSignupModal" class="signup-link-text">新規登録</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Signup Modal -->
  <div v-if="showSignupModal" class="modal-overlay" @click="closeSignupModal">
    <div class="modal-content signup-modal" @click.stop>
      <div class="modal-body">
        <div class="signup-form-container">
          <div class="signup-header">
            <h3>新規登録</h3>
            <button class="modal-close" @click="closeSignupModal">&times;</button>
          </div>
          
          <!-- X (Twitter) 登録 - 一時的に非表示 -->
          <!--
          <div class="x-signup-section">
            <button 
              class="btn btn-x-login" 
              @click="handleXLogin"
              :disabled="isXAuthLoading"
            >
              <span v-if="isXAuthLoading">認証中...</span>
              <span v-else>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Xアカウントで登録
              </span>
            </button>
          </div>
          
          <div class="signup-divider">
            <span>または</span>
          </div>
          -->
          
          <!-- メール/パスワード新規登録 -->
          <div class="form-group">
            <label for="signup-name">お名前</label>
            <input
              id="signup-name"
              v-model="signupForm.name"
              type="text"
              placeholder="お名前を入力"
              required
            />
          </div>
          <div class="form-group">
            <label for="signup-email">メールアドレス</label>
            <input
              id="signup-email"
              v-model="signupForm.email"
              type="email"
              placeholder="メールアドレスを入力"
              required
            />
          </div>
          <div class="form-group">
            <label for="signup-password">パスワード</label>
            <input
              id="signup-password"
              v-model="signupForm.password"
              type="password"
              placeholder="パスワードを入力（8文字以上）"
              required
            />
          </div>
          <div class="form-group">
            <label for="signup-password-confirm">パスワード確認</label>
            <input
              id="signup-password-confirm"
              v-model="signupForm.passwordConfirm"
              type="password"
              placeholder="パスワードを再入力"
              required
            />
          </div>
          
          <div class="signup-form-actions">
            <button class="btn btn-secondary" @click="closeSignupModal">キャンセル</button>
            <button class="btn btn-primary" @click="handleSignup">新規登録</button>
          </div>
          
          <div class="login-link">
            <p>既にアカウントをお持ちの方は <a href="#" @click.prevent="openLoginFromSignup" class="login-link-text">ログイン</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from "vue";
import { useFirestore } from "./composables/useFirestore";
// import { arrayToCSV, csvToArray, downloadCSV, readCSVFile } from "./utils/csvUtils";
import { initiateXLogin, handleXCallback, mockXLogin, isXAuthAvailable } from "./utils/xAuth";
import { getDiscordMemberCount, createDiscordDataFetcher } from "./utils/discordApi";

// State
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
  photos: [], // 写真データは別途読み込み
  iconList: [
    // サンプルデータ
    { id: "mom", emoji: "🧸", label: "MOM", link: "/mom" },
    { id: "diy", emoji: "🌷", label: "DIY", link: "/diy" },
    { id: "book", emoji: "📘", label: "BOOK", link: "/book" },
    { id: "travel", emoji: "🧳", label: "TRAVEL", link: "/travel" }
  ]
});
const isXAuthLoading = ref(false);
const xAuthAvailable = ref(isXAuthAvailable());

// Discord integration
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

// Profile Photo Carousel State
const currentPhotoIndex = ref(0);
const photoInput = ref<HTMLInputElement | null>(null);

// Admin State
const currentAdminTab = ref("products");
const showProductForm = ref(false);
const showNewsForm = ref(false);
const showMemberForm = ref(false);
const editingProduct = ref<any>(null);
const editingNews = ref<any>(null);
const editingMember = ref<any>(null);

// New Item Forms
const newProduct = ref({
  title: "",
  category: "仕事効率化",
  description: "",
  tagsString: "",
  authorName: "",
  authorRole: "",
  url: "",
  featured: false,
});

const newNews = ref({
  title: "",
  excerpt: "",
  url: "",
});

const newMember = ref({
  name: "",
  role: "",
  bio: "",
  avatar: "",
  skillsString: "",
  location: "",
  website: "",
  twitter: "",
  github: "",
  featured: false,
});

// Firestore使用
const { 
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
} = useFirestore();

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

// Methods
const navigateToPage = async (page: string) => {
  currentPage.value = page;
  mobileMenuOpen.value = false;

  // プロフィール画面への遷移時の特別処理
  if (page === 'profile' && isLoggedIn.value) {
    console.log("プロフィール画面に遷移:", userProfile.value.email);
    console.log("現在のmembers:", members.value.length, "件");
    
    // 既存メンバーデータから情報を補完
    const existingMember = members.value.find(member => member.email === userProfile.value.email);
    console.log("既存メンバー検索結果:", existingMember ? existingMember.name : "見つからない");
    
    if (existingMember) {
      // 既存メンバーの情報でプロフィールを更新（最新情報に同期）
      userProfile.value = {
        ...userProfile.value,
        ...existingMember,
        skillsString: existingMember.skills ? existingMember.skills.join(", ") : ""
      };
      
      // ローカルストレージも更新（写真データは除外）
      const profileWithoutPhotos = { ...userProfile.value };
      delete profileWithoutPhotos.photos;
      localStorage.setItem(`profile_${userProfile.value.email}`, JSON.stringify(profileWithoutPhotos));
      console.log('Profile updated from existing member data');
      
      // 写真データを別途読み込み
      userProfile.value.photos = loadUserPhotos(userProfile.value.email);
    } else {
      // 既存メンバーが見つからない場合でも、スキル配列を文字列に変換
      if (userProfile.value.skills && Array.isArray(userProfile.value.skills)) {
        userProfile.value.skillsString = userProfile.value.skills.join(", ");
      }
    }
  }

  await nextTick();

  // Firestoreデータが読み込まれていない場合は初期化
  if (products.value.length === 0 || news.value.length === 0 || members.value.length === 0) {
    try {
      await initialize();
      console.log("Firestore re-initialized for navigation");
    } catch (error) {
      console.error("Failed to re-initialize Firestore:", error);
    }
  }

  if (page === "home") {
    initializePage("home");
  } else if (page === "members") {
    initializePage("members");
  } else if (page === "products") {
    initializePage("products");
  } else if (page === "news") {
    initializePage("news");
  } else if (page === "admin") {
    // 管理ページは特別な初期化不要
  }
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleMobileSearch = () => {
  mobileSearchActive.value = !mobileSearchActive.value;
  if (mobileSearchActive.value) {
    nextTick(() => {
      const searchInput = document.getElementById(
        "search-input"
      ) as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    });
  }
};

const handleSearchKeypress = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    handleSearch();
  }
};

const handleSearch = () => {
  if (currentPage.value !== "products") {
    navigateToPage("products");
  }
  nextTick(() => {
    renderProducts();
  });
};

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 300);
};

const handleJoinClick = () => {
  const discordInvite = "https://discord.gg/genai-mama";
  alert(`Discordコミュニティへの参加はこちら: ${discordInvite}`);
};

// Comment functions
const openCommentModal = (memberId: number) => {
  commentingMemberId.value = memberId;
  showCommentModal.value = true;
  // フォームをリセット
  newComment.value = {
    authorName: "",
    content: "",
  };
};

const closeCommentModal = () => {
  showCommentModal.value = false;
  commentingMemberId.value = null;
};

const addComment = () => {
  if (!newComment.value.authorName.trim() || !newComment.value.content.trim()) {
    alert("名前とコメントを入力してください");
    return;
  }

  const comment = {
    id: Date.now(),
    memberId: commentingMemberId.value,
    authorName: newComment.value.authorName.trim(),
    content: newComment.value.content.trim(),
    date: new Date().toLocaleDateString(),
    position: Math.random() < 0.5 ? 'left' : 'right' // ランダムに左右を決定
  };

  memberComments.value.push(comment);
  
  // localStorage に保存
  localStorage.setItem('memberComments', JSON.stringify(memberComments.value));
  
  closeCommentModal();
  
  // メンバー表示を更新
  if (currentPage.value === "members") {
    renderMembers();
  }
};

const scrollToMember = (memberId: number) => {
  const memberCard = document.querySelector(`[data-member-id="${memberId}"]`);
  if (memberCard) {
    memberCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // ハイライト効果
    memberCard.classList.add('highlight');
    setTimeout(() => {
      memberCard.classList.remove('highlight');
    }, 2000);
  }
};

// Login functions
const openLoginModal = () => {
  showLoginModal.value = true;
  loginForm.value = { email: "", password: "" };
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

// Signup functions
const openSignupModal = () => {
  showLoginModal.value = false;
  showSignupModal.value = true;
  signupForm.value = { name: "", email: "", password: "", passwordConfirm: "" };
};

const closeSignupModal = () => {
  showSignupModal.value = false;
};

const openLoginFromSignup = () => {
  showSignupModal.value = false;
  showLoginModal.value = true;
  loginForm.value = { email: "", password: "" };
};

const handleSignup = async () => {
  // バリデーション
  if (!signupForm.value.name || !signupForm.value.email || !signupForm.value.password) {
    alert("すべての項目を入力してください");
    return;
  }
  
  if (signupForm.value.password.length < 8) {
    alert("パスワードは8文字以上で入力してください");
    return;
  }
  
  if (signupForm.value.password !== signupForm.value.passwordConfirm) {
    alert("パスワードが一致しません");
    return;
  }
  
  // 既存ユーザーのチェック
  const existingProfile = localStorage.getItem(`profile_${signupForm.value.email}`);
  if (existingProfile) {
    alert("このメールアドレスは既に登録されています");
    return;
  }
  
  try {
    // 新しいユーザープロフィールを作成
    const newProfile = {
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
      email: signupForm.value.email,
      photos: [],
      iconList: []
    };
    
    // プロフィールを保存
    localStorage.setItem(`profile_${signupForm.value.email}`, JSON.stringify(newProfile));
    
    // ログイン状態を設定
    isLoggedIn.value = true;
    userProfile.value = newProfile;
    currentUser.value = newProfile;
    
    // ログイン状態をローカルストレージに保存
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUserEmail', signupForm.value.email);
    
    // Firestoreのmembersコレクションにもユーザーを追加
    const memberData = {
      id: newProfile.id,
      name: newProfile.name,
      role: newProfile.role,
      bio: newProfile.bio,
      avatar: newProfile.avatar,
      skills: newProfile.skills,
      location: newProfile.location,
      website: newProfile.website,
      twitter: newProfile.twitter,
      github: newProfile.github,
      email: newProfile.email,
      featured: false,
      visible: newProfile.visible,
      joinDate: new Date().toISOString()
    };
    
    await addMember(memberData);
    console.log('New member added to Firestore during signup');
    
    closeSignupModal();
    alert(`${newProfile.name}さん、新規登録が完了しました！`);
  } catch (error) {
    console.error('Signup failed:', error);
    alert("新規登録に失敗しました。もう一度お試しください。");
  }
};

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    alert("メールアドレスとパスワードを入力してください");
    return;
  }

  try {
    // 簡単なログイン検証（実際の実装では認証サーバーと通信）
    if (loginForm.value.email && loginForm.value.password) {
      isLoggedIn.value = true;
      
      // ユーザープロフィールをローカルストレージから読み込み
      console.log("ログイン処理:", loginForm.value.email);
      const savedProfile = localStorage.getItem(`profile_${loginForm.value.email}`);
      console.log("保存されたプロフィール:", savedProfile ? "見つかった" : "見つからない");
      
      if (savedProfile) {
        userProfile.value = JSON.parse(savedProfile);
        console.log("プロフィール読み込み完了:", userProfile.value.name);
      } else {
        // 新規ユーザーの場合、デフォルトプロフィールを作成
        userProfile.value = {
          id: Date.now(),
          name: loginForm.value.email.split('@')[0],
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
          email: loginForm.value.email,
          photos: [],
          iconList: []
        };
        
        // 新規ユーザーのプロフィールを保存
        localStorage.setItem(`profile_${loginForm.value.email}`, JSON.stringify(userProfile.value));
      }
      
      currentUser.value = userProfile.value;
      
      // ログイン状態をローカルストレージに保存
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUserEmail', loginForm.value.email);
      
      // 既存メンバーデータから最新情報を取得
      const existingMember = members.value.find(member => member.email === loginForm.value.email);
      if (existingMember) {
        // 既存メンバーの情報でプロフィールを更新
        userProfile.value = {
          ...userProfile.value,
          ...existingMember,
          skillsString: existingMember.skills ? existingMember.skills.join(", ") : ""
        };
        currentUser.value = userProfile.value;
        
        // ローカルストレージも更新
        localStorage.setItem(`profile_${loginForm.value.email}`, JSON.stringify(userProfile.value));
        console.log('Profile synced with existing member data on login');
      }
      
      // 写真データを別途読み込み
      userProfile.value.photos = loadUserPhotos(loginForm.value.email);
      
      // ログイン時にもメンバーデータを同期
      await updateMemberProfile();
      
      closeLoginModal();
      alert("ログインしました！");
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert("ログインに失敗しました。");
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
    twitter: "",
    github: "",
    visible: true,
    email: "",
  };
  
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUserEmail');
  
  alert("ログアウトしました");
};

const updateProfile = async () => {
  console.log("updateProfile関数が呼び出されました");
  console.log("現在のuserProfile:", userProfile.value);
  
  if (!userProfile.value.name || !userProfile.value.role) {
    alert("名前と役職は必須です");
    return;
  }

  try {
    console.log("プロフィール保存処理を開始します");
    // スキル文字列を配列に変換
    if (userProfile.value.skillsString) {
      userProfile.value.skills = userProfile.value.skillsString
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    // プロフィールをローカルストレージに保存（写真データは除外）
    const profileWithoutPhotos = { ...userProfile.value };
    delete profileWithoutPhotos.photos;
    localStorage.setItem(`profile_${userProfile.value.email}`, JSON.stringify(profileWithoutPhotos));
    
    // 現在のユーザー情報を更新
    currentUser.value = { ...userProfile.value };
    
    // Firestoreのmembersコレクションに反映
    await updateMemberProfile();
    
    // プロフィール画面でスキル配列を文字列に戻す
    if (currentPage.value === 'profile') {
      userProfile.value.skillsString = userProfile.value.skills.join(", ");
    }
    
    alert("プロフィールを保存しました！");
  } catch (error) {
    console.error('Profile update failed:', error);
    alert("プロフィールの保存に失敗しました");
  }
};

// Clean up duplicate member entries
const cleanupDuplicateMembers = async () => {
  try {
    const emailGroups = new Map();
    
    // メンバーをメールアドレスでグループ化
    members.value.forEach(member => {
      if (member.email) {
        if (!emailGroups.has(member.email)) {
          emailGroups.set(member.email, []);
        }
        emailGroups.get(member.email).push(member);
      }
    });
    
    // 重複があるメンバーの処理
    for (const [email, memberList] of emailGroups) {
      if (memberList.length > 1) {
        console.log(`Found ${memberList.length} duplicates for ${email}`);
        
        // 最新のメンバー（IDが最大）を保持し、他を削除
        memberList.sort((a, b) => (b.id || 0) - (a.id || 0));
        const keepMember = memberList[0];
        const duplicatesToDelete = memberList.slice(1);
        
        for (const duplicate of duplicatesToDelete) {
          await deleteMember(duplicate.id);
          console.log(`Deleted duplicate member: ${duplicate.name} (ID: ${duplicate.id})`);
        }
      }
    }
    
    console.log('Duplicate cleanup completed');
  } catch (error) {
    console.error('Failed to cleanup duplicates:', error);
  }
};

// Update member profile in Firestore
const updateMemberProfile = async () => {
  try {
    // 現在のユーザーに対応するメンバーを検索（メールアドレスを優先）
    const existingMemberIndex = members.value.findIndex(
      member => member.email === userProfile.value.email
    );
    
    // 重複チェック：同じメールアドレスを持つメンバーが複数いる場合は事前にクリーンアップ
    const duplicateMembers = members.value.filter(member => member.email === userProfile.value.email);
    if (duplicateMembers.length > 1) {
      console.log(`Found ${duplicateMembers.length} duplicates for ${userProfile.value.email}, cleaning up...`);
      // 最新のものだけ残して他を削除
      duplicateMembers.sort((a, b) => (b.id || 0) - (a.id || 0));
      const duplicatesToDelete = duplicateMembers.slice(1);
      for (const duplicate of duplicatesToDelete) {
        await deleteMember(duplicate.id);
        console.log(`Deleted duplicate member: ${duplicate.name} (ID: ${duplicate.id})`);
      }
      // メンバーリストを再取得
      await nextTick();
    }
    
    // メンバー用のデータを作成
    const memberData = {
      name: userProfile.value.name,
      role: userProfile.value.role,
      bio: userProfile.value.bio,
      avatar: userProfile.value.avatar,
      skills: userProfile.value.skills,
      location: userProfile.value.location,
      website: userProfile.value.website,
      twitter: userProfile.value.twitter,
      github: userProfile.value.github,
      email: userProfile.value.email,
      featured: false, // デフォルトは非フィーチャード
      visible: userProfile.value.visible !== false, // デフォルトはtrue
      joinDate: new Date().toISOString()
    };
    
    if (existingMemberIndex >= 0) {
      // 既存メンバーを更新（IDは既存のものを保持）
      const existingMember = members.value[existingMemberIndex];
      memberData.id = existingMember.id;
      memberData.joinDate = existingMember.joinDate || memberData.joinDate; // 既存の参加日を保持
      
      await updateMember(existingMember.id, memberData);
      console.log('Member profile updated in Firestore', memberData);
    } else {
      // 新しいメンバーとして追加
      memberData.id = userProfile.value.id || Date.now();
      
      await addMember(memberData);
      console.log('New member profile added to Firestore', memberData);
    }
    
    // Firestoreから最新のメンバーリストを再取得して重複を防ぐ
    await nextTick();
    // renderFeaturedMembers()とrenderMembers()はFirestoreの変更監視で自動更新される
    
  } catch (error) {
    console.error('Failed to update member profile:', error);
    throw error;
  }
};

// Profile Card Functions
const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--;
  }
};

const nextPhoto = () => {
  if (currentPhotoIndex.value < userProfile.value.photos.length - 1) {
    currentPhotoIndex.value++;
  }
};

const openPersonalWebsite = () => {
  if (userProfile.value.personalWebsite) {
    window.open(userProfile.value.personalWebsite, '_blank');
  }
};

const navigateToIconPage = (icon: any) => {
  // 将来的にVue Routerで内部遷移を実装
  // 現在は外部リンクとして処理
  console.log(`Navigate to: ${icon.label} (${icon.link})`);
  alert(`${icon.label}ページへの遷移機能は今後実装予定です`);
};

// Photo Upload Functions
const triggerPhotoUpload = () => {
  photoInput.value?.click();
};

const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (files && files.length > 0) {
    const file = files[0];
    
    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください。');
      return;
    }
    
    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }
    
    // FileReaderで画像をBase64に変換
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      // photosが未定義の場合は空配列で初期化
      if (!userProfile.value.photos) {
        userProfile.value.photos = [];
      }
      
      // 写真を追加（最大5枚まで）
      if (userProfile.value.photos.length < 5) {
        userProfile.value.photos.push(imageUrl);
        currentPhotoIndex.value = userProfile.value.photos.length - 1;
        
        // 写真を個別にローカルストレージに保存
        if (userProfile.value.email) {
          const photoKey = `photos_${userProfile.value.email}`;
          localStorage.setItem(photoKey, JSON.stringify(userProfile.value.photos));
          
          // プロフィール情報は写真データを除いて保存
          const profileWithoutPhotos = { ...userProfile.value };
          delete profileWithoutPhotos.photos;
          localStorage.setItem(`profile_${userProfile.value.email}`, JSON.stringify(profileWithoutPhotos));
        }
        
        alert(`Photo${userProfile.value.photos.length}を追加しました！`);
        console.log(`Photo${userProfile.value.photos.length} added successfully`);
      } else {
        alert('写真は最大5枚まで登録できます。');
      }
    };
    
    reader.readAsDataURL(file);
  }
  
  // inputをリセット（同じファイルを再選択可能にする）
  target.value = '';
};

const removeCurrentPhoto = () => {
  if (userProfile.value.photos && userProfile.value.photos.length > 0) {
    const photoNumber = currentPhotoIndex.value + 1;
    if (confirm(`Photo${photoNumber}を削除しますか？`)) {
      userProfile.value.photos.splice(currentPhotoIndex.value, 1);
      
      // インデックスを調整
      if (currentPhotoIndex.value >= userProfile.value.photos.length) {
        currentPhotoIndex.value = Math.max(0, userProfile.value.photos.length - 1);
      }
      
      // 写真を個別にローカルストレージに保存
      if (userProfile.value.email) {
        const photoKey = `photos_${userProfile.value.email}`;
        localStorage.setItem(photoKey, JSON.stringify(userProfile.value.photos));
        
        // プロフィール情報は写真データを除いて保存
        const profileWithoutPhotos = { ...userProfile.value };
        delete profileWithoutPhotos.photos;
        localStorage.setItem(`profile_${userProfile.value.email}`, JSON.stringify(profileWithoutPhotos));
      }
      
      alert(`Photo${photoNumber}を削除しました`);
      console.log(`Photo${photoNumber} removed successfully`);
    }
  }
};

// Photo Data Management Functions
const loadUserPhotos = (email: string) => {
  if (!email) return [];
  
  try {
    const photoKey = `photos_${email}`;
    const savedPhotos = localStorage.getItem(photoKey);
    return savedPhotos ? JSON.parse(savedPhotos) : [];
  } catch (error) {
    console.error('Failed to load user photos:', error);
    return [];
  }
};

// Load member photos for card display
const loadMemberPhotos = (member: any) => {
  // まず member.photos があるかチェック（新しいデータ構造）
  if (member.photos && member.photos.length > 0) {
    return member.photos;
  }
  
  // 後方互換性のために email ベースの写真も確認
  if (member.email) {
    const emailPhotos = loadUserPhotos(member.email);
    if (emailPhotos.length > 0) {
      return emailPhotos;
    }
  }
  
  // デフォルトでは空配列を返す
  return [];
};

// アイコンファイル名からemojiを取得するヘルパー関数
const getIconEmoji = (iconName: string) => {
  const iconMap: { [key: string]: string } = {
    'vue.svg': '🟢',
    'vue': '🟢',
    'react.svg': '⚛️',
    'react': '⚛️',
    'typescript.svg': '🔷',
    'typescript': '🔷',
    'javascript.svg': '🟨',
    'javascript': '🟨',
    'python.svg': '🐍',
    'python': '🐍',
    'figma.svg': '🎨',
    'figma': '🎨',
    'sketch.svg': '💎',
    'sketch': '💎',
    'photoshop.svg': '🖼️',
    'photoshop': '🖼️',
    'illustrator.svg': '🎭',
    'illustrator': '🎭',
    'nodejs.svg': '🟩',
    'nodejs': '🟩',
    'docker.svg': '🐳',
    'docker': '🐳',
    'git.svg': '📝',
    'git': '📝',
    'github.svg': '🐙',
    'github': '🐙',
    'aws.svg': '☁️',
    'aws': '☁️',
    'firebase.svg': '🔥',
    'firebase': '🔥'
  };
  
  // ファイル名の正規化（大文字小文字を無視、拡張子を削除）
  const normalizedName = iconName.toLowerCase().replace(/\.(svg|png|jpg|jpeg)$/i, '');
  
  return iconMap[normalizedName] || iconMap[iconName.toLowerCase()] || '⚡'; // デフォルトアイコン
};

// Member card photo carousel functions
const prevMemberPhoto = (carouselId: string) => {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  
  const slides = carousel.querySelectorAll('.carousel-slide');
  const indicators = carousel.querySelectorAll('.carousel-indicator');
  const activeSlide = carousel.querySelector('.carousel-slide.active');
  const activeIndicator = carousel.querySelector('.carousel-indicator.active');
  
  if (!activeSlide || !activeIndicator) return;
  
  const currentIndex = parseInt(activeSlide.getAttribute('data-index') || '0');
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
  
  // Update slides
  activeSlide.classList.remove('active');
  slides[prevIndex].classList.add('active');
  
  // Update indicators
  activeIndicator.classList.remove('active');
  indicators[prevIndex].classList.add('active');
};

const nextMemberPhoto = (carouselId: string) => {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  
  const slides = carousel.querySelectorAll('.carousel-slide');
  const indicators = carousel.querySelectorAll('.carousel-indicator');
  const activeSlide = carousel.querySelector('.carousel-slide.active');
  const activeIndicator = carousel.querySelector('.carousel-indicator.active');
  
  if (!activeSlide || !activeIndicator) return;
  
  const currentIndex = parseInt(activeSlide.getAttribute('data-index') || '0');
  const nextIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
  
  // Update slides
  activeSlide.classList.remove('active');
  slides[nextIndex].classList.add('active');
  
  // Update indicators
  activeIndicator.classList.remove('active');
  indicators[nextIndex].classList.add('active');
};

const goToMemberPhoto = (carouselId: string, index: number) => {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  
  const slides = carousel.querySelectorAll('.carousel-slide');
  const indicators = carousel.querySelectorAll('.carousel-indicator');
  const activeSlide = carousel.querySelector('.carousel-slide.active');
  const activeIndicator = carousel.querySelector('.carousel-indicator.active');
  
  if (!activeSlide || !activeIndicator || !slides[index] || !indicators[index]) return;
  
  // Update slides
  activeSlide.classList.remove('active');
  slides[index].classList.add('active');
  
  // Update indicators
  activeIndicator.classList.remove('active');
  indicators[index].classList.add('active');
};

const navigateToMemberIconPage = (link: string) => {
  // 将来的にVue Routerで内部遷移を実装
  console.log(`Navigate to member icon page: ${link}`);
  alert(`${link}ページへの遷移機能は今後実装予定です`);
};

// Icon Management Functions
const isIconSelected = (iconId: string): boolean => {
  return userProfile.value.iconList?.some(icon => icon.id === iconId) || false;
};

const toggleIcon = (icon: any) => {
  if (!userProfile.value.iconList) {
    userProfile.value.iconList = [];
  }
  
  const existingIndex = userProfile.value.iconList.findIndex(item => item.id === icon.id);
  
  if (existingIndex >= 0) {
    // アイコンが既に選択されている場合は削除
    userProfile.value.iconList.splice(existingIndex, 1);
  } else {
    // アイコンが選択されていない場合は追加（最大6個まで）
    if (userProfile.value.iconList.length < 6) {
      userProfile.value.iconList.push({
        id: icon.id,
        emoji: icon.emoji,
        label: icon.label,
        link: icon.link
      });
    } else {
      alert('アイコンは最大6個まで選択できます。');
    }
  }
  
  // ローカルストレージに保存（写真データは除外）
  if (userProfile.value.email) {
    const profileWithoutPhotos = { ...userProfile.value };
    delete profileWithoutPhotos.photos;
    localStorage.setItem(`profile_${userProfile.value.email}`, JSON.stringify(profileWithoutPhotos));
  }
};

// X Authentication callback handler
const handleXAuthCallback = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('X Auth error:', error);
      alert('X認証でエラーが発生しました: ' + error);
      return;
    }
    
    if (code && state) {
      console.log('Processing X auth callback with code:', code);
      
      // X認証のコールバック処理
      const result = await handleXCallback(code, state);
      await processXLoginResult(result);
      
      // URLからパラメータを削除してクリーンアップ
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (error) {
    console.error('X auth callback processing failed:', error);
    alert('X認証の処理中にエラーが発生しました');
  }
};

// X Authentication functions
const handleXLogin = async () => {
  try {
    isXAuthLoading.value = true;
    
    if (xAuthAvailable.value) {
      await initiateXLogin();
    } else {
      // 開発用のモックログイン
      const result = await mockXLogin();
      await processXLoginResult(result);
    }
  } catch (error) {
    console.error('X login failed:', error);
    alert('X認証に失敗しました: ' + error.message);
  } finally {
    isXAuthLoading.value = false;
  }
};

const processXLoginResult = async (result: any) => {
  try {
    const xUser = result.user;
    
    // X認証で取得したデータでプロフィールを作成
    const profileKey = `x_${xUser.id}`;
    const savedProfile = localStorage.getItem(`profile_${profileKey}`);
    
    if (savedProfile) {
      userProfile.value = JSON.parse(savedProfile);
    } else {
      // 新規Xユーザーの場合、プロフィールを作成
      userProfile.value = {
        id: xUser.id,
        name: xUser.name || xUser.username,
        role: "メンバー",
        bio: xUser.description || "よろしくお願いします！",
        avatar: xUser.profile_image_url || "",
        skills: [],
        location: xUser.location || "",
        website: "",
        twitter: `https://x.com/${xUser.username}`,
        github: "",
        visible: true,
        email: profileKey,
      };
    }
    
    // ログイン状態を設定
    isLoggedIn.value = true;
    currentUser.value = userProfile.value;
    
    // ローカルストレージに保存
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUserEmail', profileKey);
    localStorage.setItem('xAccessToken', result.accessToken);
    if (result.refreshToken) {
      localStorage.setItem('xRefreshToken', result.refreshToken);
    }
    
    closeLoginModal();
    alert(`${xUser.name || xUser.username}さん、X認証でログインしました！`);
  } catch (error) {
    console.error('Processing X login result failed:', error);
    throw error;
  }
};

// Discord functions
const updateDiscordStats = async () => {
  try {
    discordStats.value.isLoading = true;
    discordStats.value.error = null;
    const data = await getDiscordMemberCount(discordServerId);
    
    if (data) {
      discordStats.value.memberCount = data.memberCount;
      discordStats.value.onlineCount = data.onlineCount;
      discordStats.value.serverName = data.serverName;
      discordStats.value.lastUpdated = new Date();
      
      console.log(`Discord stats updated: ${data.memberCount} members, ${data.onlineCount} online`);
    } else {
      discordStats.value.error = 'Discord API接続に失敗しました';
      console.warn('Failed to fetch Discord stats, using default values');
    }
  } catch (error) {
    discordStats.value.error = 'Discord統計の取得中にエラーが発生しました';
    console.error('Error updating Discord stats:', error);
  } finally {
    discordStats.value.isLoading = false;
  }
};

const initializeDiscordIntegration = () => {
  console.log('🚀 Initializing Discord integration with server ID:', discordServerId);
  
  // Discord データフェッチャーを作成（5分間隔で更新）
  discordDataFetcher = createDiscordDataFetcher(discordServerId, 300000);
  
  // データ更新時のコールバックを設定
  discordDataFetcher.subscribe((data: any) => {
    console.log('📊 Discord data received:', data);
    if (data) {
      discordStats.value.memberCount = data.memberCount;
      discordStats.value.onlineCount = data.onlineCount;
      discordStats.value.serverName = data.serverName;
      discordStats.value.lastUpdated = new Date();
      
      console.log(`✅ Discord stats updated: ${data.memberCount} members, ${data.onlineCount} online`);
    } else {
      console.warn('❌ No Discord data received');
    }
  });
  
  // 自動更新を開始
  discordDataFetcher.start();
  console.log('🔄 Discord data fetcher started');
};

// Admin Methods
const setAdminTab = (tab: string) => {
  currentAdminTab.value = tab;
  showProductForm.value = false;
  showNewsForm.value = false;
  showMemberForm.value = false;
  editingProduct.value = null;
  editingNews.value = null;
  editingMember.value = null;
};

const handleAddProduct = async () => {
  console.log("handleAddProduct called");
  console.log("newProduct.value:", newProduct.value);

  if (
    !newProduct.value.title ||
    !newProduct.value.description ||
    !newProduct.value.authorName
  ) {
    alert("必須項目を入力してください");
    return;
  }

  try {
    const tags = newProduct.value.tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    console.log("Calling addProduct...");
    await addProduct({
      title: newProduct.value.title,
      category: newProduct.value.category,
      description: newProduct.value.description,
      tags: tags,
      author: {
        name: newProduct.value.authorName,
        avatar: newProduct.value.authorName.charAt(0).toUpperCase(),
        role: newProduct.value.authorRole,
      },
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      comments: 0,
      thumbnail: `https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=${encodeURIComponent(
        newProduct.value.title
      )}`,
      featured: newProduct.value.featured,
      url: newProduct.value.url,
    });

    console.log("Product added successfully");

    // フォームをリセット
    newProduct.value = {
      title: "",
      category: "仕事効率化",
      description: "",
      tagsString: "",
      authorName: "",
      authorRole: "",
      url: "",
      featured: false,
    };

    showProductForm.value = false;
    alert("成果物をFirestoreに追加しました！");
  } catch (err) {
    console.error("Error adding product:", err);
    alert("エラーが発生しました: " + err);
  }
};

const handleAddNews = async () => {
  try {
    await addNews({
      title: newNews.value.title,
      excerpt: newNews.value.excerpt,
      date: new Date().toISOString().split("T")[0],
      url: newNews.value.url,
    });

    // フォームをリセット
    newNews.value = {
      title: "",
      excerpt: "",
      url: "",
    };

    showNewsForm.value = false;
    alert("ニュースをFirestoreに追加しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

// Product CRUD Methods
const startEditProduct = (product: any) => {
  editingProduct.value = {
    ...product,
    tagsString: product.tags.join(", "),
    author: { ...product.author }
  };
  showProductForm.value = false;
};

const handleUpdateProduct = async () => {
  if (!editingProduct.value) return;

  try {
    const tags = editingProduct.value.tagsString
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag);

    editingProduct.value.author.avatar = editingProduct.value.author.name.charAt(0).toUpperCase();

    await updateProduct(editingProduct.value.id, {
      title: editingProduct.value.title,
      category: editingProduct.value.category,
      description: editingProduct.value.description,
      tags: tags,
      author: editingProduct.value.author,
      url: editingProduct.value.url,
      featured: editingProduct.value.featured
    });

    editingProduct.value = null;
    alert("成果物を更新しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

const cancelEditProduct = () => {
  editingProduct.value = null;
};

const handleDeleteProduct = async (productId: number) => {
  if (!confirm("この成果物を削除してもよろしいですか？")) return;

  try {
    await deleteProduct(productId);
    alert("成果物を削除しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

const handleDuplicateProduct = async (productId: number) => {
  try {
    await duplicateProduct(productId);
    alert("成果物を複製しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

// News CRUD Methods
const startEditNews = (newsItem: any) => {
  editingNews.value = { ...newsItem };
  showNewsForm.value = false;
};

const handleUpdateNews = async () => {
  if (!editingNews.value) return;

  try {
    await updateNews(editingNews.value.id, {
      title: editingNews.value.title,
      excerpt: editingNews.value.excerpt,
      url: editingNews.value.url
    });

    editingNews.value = null;
    alert("ニュースを更新しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

const cancelEditNews = () => {
  editingNews.value = null;
};

const handleDeleteNews = async (newsId: number) => {
  if (!confirm("このニュースを削除してもよろしいですか？")) return;

  try {
    await deleteNews(newsId);
    alert("ニュースを削除しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

const handleDuplicateNews = async (newsId: number) => {
  try {
    await duplicateNews(newsId);
    alert("ニュースを複製しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

// Member Admin Methods
const handleAddMember = async () => {
  if (!newMember.value.name || !newMember.value.role || !newMember.value.bio) {
    alert("必須項目を入力してください");
    return;
  }

  try {
    const skills = newMember.value.skillsString
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);

    await addMember({
      name: newMember.value.name,
      role: newMember.value.role,
      bio: newMember.value.bio,
      avatar: newMember.value.avatar || `https://via.placeholder.com/150/9B7BD8/FFFFFF?text=${encodeURIComponent(newMember.value.name.charAt(0))}`,
      skills: skills,
      joinDate: new Date().toISOString().split('T')[0],
      location: newMember.value.location,
      website: newMember.value.website,
      twitter: newMember.value.twitter,
      github: newMember.value.github,
      featured: newMember.value.featured
    });

    // フォームをリセット
    newMember.value = {
      name: "",
      role: "",
      bio: "",
      avatar: "",
      skillsString: "",
      location: "",
      website: "",
      twitter: "",
      github: "",
      featured: false,
    };

    showMemberForm.value = false;
    alert("メンバーをFirestoreに追加しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

const startEditMember = (member: any) => {
  if (!isLoggedIn.value) {
    alert("ログインしてから利用できます");
    openLoginModal();
    return;
  }
  
  editingMember.value = {
    ...member,
    skillsString: member.skills.join(", "),
    // 左エリア用フィールドの文字列化
    photosString: member.photos?.join(", ") || "",
    iconsString: member.icons?.join(", ") || "",
    iconDescriptionsString: member.iconDescriptions?.join(", ") || ""
  };
  showMemberForm.value = false;
};

const handleUpdateMember = async () => {
  if (!editingMember.value) return;

  if (!editingMember.value.name || !editingMember.value.role || !editingMember.value.bio) {
    alert("必須項目を入力してください");
    return;
  }

  try {
    const skills = editingMember.value.skillsString
      .split(",")
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill);

    // 左エリア用データの処理
    const photos = editingMember.value.photosString
      ? editingMember.value.photosString.split(",").map((photo: string) => photo.trim()).filter((photo: string) => photo)
      : [];
    
    const icons = editingMember.value.iconsString
      ? editingMember.value.iconsString.split(",").map((icon: string) => icon.trim()).filter((icon: string) => icon).slice(0, 6) // 最大6個
      : [];
      
    const iconDescriptions = editingMember.value.iconDescriptionsString
      ? editingMember.value.iconDescriptionsString.split(",").map((desc: string) => desc.trim()).filter((desc: string) => desc)
      : [];

    await updateMember(editingMember.value.id, {
      name: editingMember.value.name,
      role: editingMember.value.role,
      bio: editingMember.value.bio,
      avatar: editingMember.value.avatar || `https://via.placeholder.com/150/9B7BD8/FFFFFF?text=${encodeURIComponent(editingMember.value.name.charAt(0))}`,
      skills: skills,
      location: editingMember.value.location,
      website: editingMember.value.website,
      twitter: editingMember.value.twitter,
      github: editingMember.value.github,
      featured: editingMember.value.featured,
      // 左エリア用の新しいフィールド
      photos: photos,
      personalWebsite: editingMember.value.personalWebsite,
      icons: icons,
      iconDescriptions: iconDescriptions
    });

    editingMember.value = null;
    alert("メンバー情報を更新しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

const cancelEditMember = () => {
  editingMember.value = null;
};

const handleDuplicateMember = async (memberId: number) => {
  try {
    const originalMember = members.value.find(m => m.id === memberId);
    if (!originalMember) {
      throw new Error('Member not found');
    }

    // 複製用のデータを作成（idを除外し、名前に(コピー)を追加）
    const duplicatedData = {
      name: `${originalMember.name} (コピー)`,
      role: originalMember.role,
      bio: originalMember.bio,
      avatar: originalMember.avatar,
      skills: [...originalMember.skills],
      joinDate: new Date().toISOString().split('T')[0],
      location: originalMember.location,
      website: originalMember.website,
      twitter: originalMember.twitter,
      github: originalMember.github,
      featured: false // 複製時は通常メンバーに
    };

    await addMember(duplicatedData);
    alert("メンバーを複製しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

const handleDeleteMember = async (memberId: number) => {
  if (!isLoggedIn.value) {
    alert("ログインしてから利用できます");
    openLoginModal();
    return;
  }
  
  if (!confirm("このメンバーを削除してもよろしいですか？")) return;

  try {
    await deleteMember(memberId);
    alert("メンバーを削除しました！");
  } catch (err) {
    alert("エラーが発生しました: " + err);
  }
};

// CSV Export/Import Methods
const exportProductsCSV = () => {
  try {
    const headers = [
      'title',
      'category', 
      'description',
      'tags',
      'author.name',
      'author.role',
      'date',
      'likes',
      'comments',
      'url',
      'featured'
    ];
    
    // tagsを文字列に変換
    const exportData = products.value.map(product => ({
      ...product,
      tags: product.tags.join('; ')
    }));
    
    // const csvContent = arrayToCSV(exportData, headers);
    // const filename = `products_${new Date().toISOString().split('T')[0]}.csv`;
    // downloadCSV(csvContent, filename);
    alert('CSV機能は一時的に無効化されています');
    
    alert('成果物データをCSVで出力しました！');
  } catch (err) {
    alert('エクスポートエラー: ' + err);
  }
};

const importProductsCSV = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  try {
    // const csvContent = await readCSVFile(file);
    alert('CSV機能は一時的に無効化されています');
    return;
    const headers = [
      'title',
      'category',
      'description', 
      'tags',
      'author.name',
      'author.role',
      'date',
      'likes',
      'comments',
      'url',
      'featured'
    ];
    
    // const importedData = csvToArray(csvContent, headers);
    
    for (const item of importedData) {
      if (!item.title || !item.description || !item['author.name']) {
        continue; // 必須項目がない行はスキップ
      }
      
      // tagsを配列に変換
      const tags = item.tags ? item.tags.split(';').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];
      
      // Firestoreに追加
      await addProduct({
        title: item.title,
        category: item.category || '仕事効率化',
        description: item.description,
        tags: tags,
        author: {
          name: item['author.name'],
          avatar: item['author.name'].charAt(0).toUpperCase(),
          role: item['author.role'] || 'メンバー'
        },
        date: item.date || new Date().toISOString().split('T')[0],
        likes: item.likes || 0,
        comments: item.comments || 0,
        thumbnail: `https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=${encodeURIComponent(item.title)}`,
        featured: item.featured || false,
        url: item.url || '#'
      });
    }
    
    alert(`${importedData.length}件の成果物をインポートしました！`);
  } catch (err) {
    alert('インポートエラー: ' + err);
  } finally {
    // ファイル入力をリセット
    target.value = '';
  }
};

const exportNewsCSV = () => {
  try {
    const headers = [
      'title',
      'excerpt',
      'date',
      'url'
    ];
    
    // const csvContent = arrayToCSV(news.value, headers);
    // const filename = `news_${new Date().toISOString().split('T')[0]}.csv`;
    // downloadCSV(csvContent, filename);
    alert('CSV機能は一時的に無効化されています');
    
    alert('ニュースデータをCSVで出力しました！');
  } catch (err) {
    alert('エクスポートエラー: ' + err);
  }
};

const importNewsCSV = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  try {
    // const csvContent = await readCSVFile(file);
    alert('CSV機能は一時的に無効化されています');
    return;
    const headers = [
      'title',
      'excerpt',
      'date',
      'url'
    ];
    
    // const importedData = csvToArray(csvContent, headers);
    
    for (const item of importedData) {
      if (!item.title || !item.excerpt) {
        continue; // 必須項目がない行はスキップ
      }
      
      // Firestoreに追加
      await addNews({
        title: item.title,
        excerpt: item.excerpt,
        date: item.date || new Date().toISOString().split('T')[0],
        url: item.url || '#'
      });
    }
    
    alert(`${importedData.length}件のニュースをインポートしました！`);
  } catch (err) {
    alert('インポートエラー: ' + err);
  } finally {
    // ファイル入力をリセット
    target.value = '';
  }
};

const setFilter = (filter: string) => {
  currentFilter.value = filter;
  renderProducts();
};

const handleSortChange = () => {
  renderProducts();
};

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
      product.category.toLowerCase().includes(lowerQuery) ||
      product.tags.some((tag: string) =>
        tag.toLowerCase().includes(lowerQuery)
      ) ||
      product.author.name.toLowerCase().includes(lowerQuery)
  );
};

// Create elements
const createProductCard = (product: any, delay = 0) => {
  const card = document.createElement("div");
  card.className = "product-card animate-fade-in-up";
  card.style.animationDelay = `${delay}ms`;

  card.innerHTML = `
    <div class="product-header">
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
      </div>
    </div>
    
    <div class="product-tags">
      ${product.tags
        .map((tag: string) => `<span class="product-tag">${tag}</span>`)
        .join("")}
    </div>
    
    <div class="product-footer">
      <div class="product-author">
        <div class="author-avatar">${product.author.avatar}</div>
        <div class="author-info">
          <div class="author-name">${product.author.name}</div>
        </div>
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    window.open(product.url, "_blank");
  });

  return card;
};

const createNewsCard = (newsItem: any, delay = 0) => {
  const card = document.createElement("a");
  card.href = newsItem.url;
  card.target = "_blank";
  card.className = "news-card animate-fade-in-up";
  card.style.animationDelay = `${delay}ms`;

  card.innerHTML = `
    <h3 class="news-title">${newsItem.title}</h3>
    <p class="news-excerpt">${newsItem.excerpt}</p>
    <div class="news-date">${formatDate(newsItem.date)}</div>
  `;

  return card;
};

const createMemberCard = (member: any, delay = 0) => {
  const card = document.createElement("div");
  card.className = "member-card animate-fade-in-up";
  card.style.animationDelay = `${delay}ms`;
  card.setAttribute('data-member-id', member.id);

  // メンバーの写真データを読み込み
  const memberPhotos = loadMemberPhotos(member);
  
  // 写真カルーセルのHTML生成
  const createPhotoCarousel = (photos: string[]) => {
    if (!photos || photos.length === 0) {
      return `
        <div class="member-photo-placeholder">
          <div class="placeholder-content">
            <span class="placeholder-icon">📸</span>
            <p>写真なし</p>
          </div>
        </div>
      `;
    }
    
    const carouselId = `carousel-${member.id}`;
    return `
      <div class="member-photo-carousel" id="${carouselId}">
        <div class="carousel-container">
          ${photos.map((photo, index) => `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
              <img src="${photo}" alt="Photo ${index + 1}" class="carousel-image" />
              <div class="photo-number">Photo${index + 1}</div>
            </div>
          `).join('')}
          
          ${photos.length > 1 ? `
            <div class="carousel-nav">
              <button class="carousel-btn carousel-prev" onclick="prevMemberPhoto('${carouselId}')" ${photos.length <= 1 ? 'disabled' : ''}>‹</button>
              <button class="carousel-btn carousel-next" onclick="nextMemberPhoto('${carouselId}')" ${photos.length <= 1 ? 'disabled' : ''}>›</button>
            </div>
            <div class="carousel-indicators">
              ${photos.map((_, index) => `
                <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                        onclick="goToMemberPhoto('${carouselId}', ${index})" 
                        data-index="${index}"></button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  };
  
  // PERSONAL WEBSITEバナーのHTML生成
  const createPersonalWebsiteBanner = (personalWebsite: string) => {
    if (!personalWebsite) return '';
    
    return `
      <div class="member-personal-website-banner" onclick="window.open('${personalWebsite}', '_blank')">
        <div class="member-pixel-banner">
          <span class="member-banner-text">PERSONAL WEBSITE!</span>
        </div>
      </div>
    `;
  };
  
  // アイコン表示領域のHTML生成
  const createIconSection = (iconList: any[]) => {
    console.log('createIconSection called with:', iconList);
    if (!iconList || iconList.length === 0) {
      console.log('アイコンリストが空です');
      return '';
    }
    
    const html = `
      <div class="member-icon-section">
        <div class="member-icon-grid">
          ${iconList.map(icon => `
            <div class="member-icon-item" onclick="navigateToMemberIconPage('${icon.link}')" title="${icon.label}">
              <div class="member-icon-circle">
                <span class="member-icon-emoji">${icon.emoji}</span>
              </div>
              <span class="member-icon-label">${icon.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    console.log('生成されたアイコンHTML:', html);
    return html;
  };

  const socialLinks = [];
  if (member.website) {
    socialLinks.push(`<a href="${member.website}" target="_blank" title="Website">🌐</a>`);
  }
  if (member.twitter) {
    socialLinks.push(`<a href="${member.twitter}" target="_blank" title="Twitter">🐦</a>`);
  }
  if (member.github) {
    socialLinks.push(`<a href="${member.github}" target="_blank" title="GitHub">💻</a>`);
  }

  // アイコンリストを実際のデータから構築
  const iconList = [];
  if (member.icons && member.icons.length > 0) {
    console.log(`${member.name}のアイコンデータ:`, member.icons);
    member.icons.forEach((icon, index) => {
      const description = member.iconDescriptions && member.iconDescriptions[index] 
        ? member.iconDescriptions[index] 
        : `アイコン${index + 1}`;
      
      const emoji = getIconEmoji(icon);
      console.log(`アイコン: ${icon} -> ${emoji}`);
      
      iconList.push({
        emoji: emoji,
        label: description,
        link: '#' // 将来的にrouter-linkに対応
      });
    });
  } else {
    console.log(`${member.name}にはアイコンデータがありません:`, member);
  }

  // このメンバーのコメントを取得
  const comments = memberComments.value.filter(comment => comment.memberId === member.id);
  
  card.innerHTML = `
    <div class="member-card-content">
      <!-- 中央エリア: メンバープロフィール概要 -->
      <div class="member-card-center">
        <div class="member-avatar-container">
          <div class="member-avatar">
            <img src="${member.avatar}" alt="${member.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="member-avatar-fallback" style="display: none;">${member.name.charAt(0)}</div>
          </div>
        </div>
        
        <div class="member-info">
          <h3 class="member-name">${member.name}</h3>
          <p class="member-role">${member.role}</p>
          ${member.bio ? `<p class="member-bio">${member.bio}</p>` : ''}
          ${member.skills && member.skills.length > 0 ? `
            <div class="member-skills">
              ${member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          ` : ''}
          ${member.location ? `<p class="member-location">📍 ${member.location}</p>` : ''}
          ${socialLinks.length > 0 ? `
            <div class="member-social">
              ${socialLinks.join('')}
            </div>
          ` : ''}
          <p class="member-join-date">参加: ${formatDate(member.joinDate)}</p>
        </div>
      </div>
      
      <!-- 左側エリア: 写真カルーセル、バナー、アイコン -->
      <div class="member-card-left">
        ${createPhotoCarousel(memberPhotos)}
        ${createPersonalWebsiteBanner(member.personalWebsite || member.website)}
        ${createIconSection(iconList)}
      </div>
      
      <!-- 右側エリア: コメント情報 -->
      <div class="member-card-right">
        <div class="comment-section-header">
          <div class="comment-icon" onclick="openCommentModal(${member.id})" title="コメントを追加">
            💬 コメント
          </div>
        </div>
        
        ${comments.length > 0 ? `
          <div class="member-messages-container">
            <div class="member-messages-scroll">
              ${comments.map((comment, index) => {
                const position = index % 2 === 0 ? 'left' : 'right';
                const zIndex = comments.length - index;
                return `
                  <div class="message-bubble message-${position}" 
                       style="z-index: ${zIndex};"
                       onclick="scrollToMember(${comment.memberId})" 
                       title="クリックでコメント投稿者のカードに移動">
                    <div class="message-content">
                      <div class="message-author">${comment.authorName}</div>
                      <div class="message-text">${comment.content}</div>
                      <div class="message-date">${comment.date}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : '<div class="no-comments"><p>まだコメントがありません</p></div>'}
      </div>
    </div>
  `;

  return card;
};

// Render functions
const renderFeaturedProducts = () => {
  const container = document.getElementById("featured-products-grid");
  if (!container) return;

  const featuredProducts = getFeaturedProducts();
  container.innerHTML = "";

  if (featuredProducts.length === 0) {
    container.innerHTML = '<div class="no-results">データを読み込み中...</div>';
    return;
  }

  featuredProducts.forEach((product, index) => {
    const productCard = createProductCard(product, index * 100);
    container.appendChild(productCard);
  });
};

const renderLatestNews = () => {
  const container = document.getElementById("latest-news-grid");
  if (!container) return;

  const latestNews = getLatestNews(3);
  container.innerHTML = "";

  if (latestNews.length === 0) {
    container.innerHTML = '<div class="no-results">データを読み込み中...</div>';
    return;
  }

  latestNews.forEach((newsItem, index) => {
    const newsCard = createNewsCard(newsItem, index * 100);
    container.appendChild(newsCard);
  });
};

const renderProducts = () => {
  const container = document.getElementById("products-grid");
  if (!container) return;

  let filteredProducts = filterProducts(products.value, currentFilter.value);

  if (searchQuery.value) {
    filteredProducts = searchProducts(filteredProducts, searchQuery.value);
  }

  const sortedProducts = sortProducts(filteredProducts, currentSort.value);

  container.innerHTML = "";

  if (sortedProducts.length === 0) {
    container.innerHTML =
      '<div class="no-results">該当する成果物が見つかりませんでした。</div>';
    return;
  }

  sortedProducts.forEach((product, index) => {
    const productCard = createProductCard(product, index * 50);
    container.appendChild(productCard);
  });
};

const renderNews = () => {
  const container = document.getElementById("news-grid");
  if (!container) return;

  container.innerHTML = "";

  news.value.forEach((newsItem, index) => {
    const newsCard = createNewsCard(newsItem, index * 100);
    container.appendChild(newsCard);
  });
};

const renderFeaturedMembers = () => {
  const container = document.getElementById("featured-members-grid");
  if (!container) return;

  const featuredMembers = getFeaturedMembers();
  container.innerHTML = "";

  if (featuredMembers.length === 0) {
    container.innerHTML = '<div class="no-results">データを読み込み中...</div>';
    return;
  }

  featuredMembers.forEach((member, index) => {
    const memberCard = createMemberCard(member, index * 100);
    container.appendChild(memberCard);
  });
};

const renderMembers = () => {
  const container = document.getElementById("members-grid");
  if (!container) return;

  const allMembers = getAllMembers();
  container.innerHTML = "";

  if (allMembers.length === 0) {
    container.innerHTML = '<div class="no-results">メンバーが見つかりませんでした。</div>';
    return;
  }

  allMembers.forEach((member, index) => {
    const memberCard = createMemberCard(member, index * 50);
    container.appendChild(memberCard);
  });
};

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

// Global keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  // テキスト入力要素（input, textarea, contenteditable）では無効化
  if (
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.contentEditable === "true")
  ) {
    return;
  }

  if (e.key === "/") {
    e.preventDefault();
    const searchInput = document.getElementById(
      "search-input"
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  if (e.key === "Escape") {
    const searchInput = document.getElementById(
      "search-input"
    ) as HTMLInputElement;
    if (searchInput && document.activeElement === searchInput) {
      searchInput.blur();
      searchInput.value = "";
      searchQuery.value = "";
      renderProducts();
    }
  }
};

onMounted(async () => {
  try {
    console.log("アプリケーション初期化開始");
    document.addEventListener("keydown", handleKeyDown);
    
    // X認証のコールバック処理
    await handleXAuthCallback();
    
    // コメントをローカルストレージから読み込み
    const savedComments = localStorage.getItem("memberComments");
    if (savedComments) {
      memberComments.value = JSON.parse(savedComments);
    }
    
    console.log("アプリケーション初期化完了");
  } catch (error) {
    console.error("アプリケーション初期化エラー:", error);
    // エラーが発生してもアプリケーションを継続
  }
  
  // ログイン状態をローカルストレージから復元
  const savedLoginState = localStorage.getItem('isLoggedIn');
  const savedUserEmail = localStorage.getItem('currentUserEmail');
  if (savedLoginState === 'true' && savedUserEmail) {
    isLoggedIn.value = true;
    const savedProfile = localStorage.getItem(`profile_${savedUserEmail}`);
    if (savedProfile) {
      userProfile.value = JSON.parse(savedProfile);
      currentUser.value = userProfile.value;
    }
  }
  
  // Firestoreからデータを読み込み
  try {
    await initialize();
    console.log(
      "Firestore initialized, products:",
      products.value.length,
      "news:",
      news.value.length,
      "members:",
      members.value.length
    );
    
    // 重複メンバーのクリーンアップを実行
    await cleanupDuplicateMembers();
    
    // ログイン済みの場合、最新のメンバー情報でプロフィールを同期
    if (isLoggedIn.value && savedUserEmail) {
      const existingMember = members.value.find(member => member.email === savedUserEmail);
      if (existingMember) {
        userProfile.value = {
          ...userProfile.value,
          ...existingMember,
          skillsString: existingMember.skills ? existingMember.skills.join(", ") : ""
        };
        currentUser.value = userProfile.value;
        
        // ローカルストレージも更新
        localStorage.setItem(`profile_${savedUserEmail}`, JSON.stringify(userProfile.value));
        console.log('Profile synced with existing member data on app initialization');
      }
      
      // 写真データを別途読み込み
      if (savedUserEmail) {
        userProfile.value.photos = loadUserPhotos(savedUserEmail);
      }
    }
  } catch (error) {
    console.error("Failed to initialize Firestore:", error);
  }
  // データ読み込み後にページを初期化
  initializePage("home");
  
  // Discord統合を初期化
  initializeDiscordIntegration();
  
  // グローバル関数を定義
  (window as any).openCommentModal = openCommentModal;
  (window as any).scrollToMember = scrollToMember;
  (window as any).prevMemberPhoto = prevMemberPhoto;
  (window as any).nextMemberPhoto = nextMemberPhoto;
  (window as any).goToMemberPhoto = goToMemberPhoto;
  (window as any).navigateToMemberIconPage = navigateToMemberIconPage;
});

// クリーンアップ
onUnmounted(() => {
  if (discordDataFetcher) {
    discordDataFetcher.stop();
  }
});

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
      // プロフィールページでスキル配列を文字列に変換
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

/* 追加スタイル - ホバーアニメーション、レイアウト改善、レスポンシブ対応 */

/* アプリ全体のレイアウト - フッターを常に下部に配置 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

/* ロゴ画像のスタイル */
.logo-image {
  height: 20px;
  width: auto;
}

/* Mobile Navigation - 元の静的サイトと同じ挙動 */
.mobile-menu-toggle {
  display: none !important;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-1);
  gap: var(--spacing-1);
}

.mobile-menu-toggle span {
  width: 20px;
  height: 2px;
  background: var(--gray-600);
  transition: var(--transition-base);
}

.search-toggle {
  display: none !important;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gray-600);
  font-size: var(--font-size-lg);
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.search-toggle:hover {
  background: var(--gray-100);
}

.search-toggle.active {
  color: var(--primary-purple);
}

/* Mobile Responsive Behavior - 1024px以下 */
@media (max-width: 1024px) {
  .header .container {
    position: relative;
  }

  .logo-image {
    height: 20px;
  }

  /* Navigation - モバイルで隠れて、ドロップダウンメニューに */
  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    border-top: 1px solid var(--gray-200);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-md);
    z-index: 1000;
  }

  .nav.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-list {
    flex-direction: column;
    padding: var(--spacing-4);
    gap: var(--spacing-2);
  }

  .nav-link {
    padding: var(--spacing-3);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
  }

  .nav-link:hover {
    background: var(--primary-purple-lighter);
  }

  .nav-link.active::after {
    display: none;
  }

  /* Search Bar - モバイルで隠れる */
  .search-bar {
    display: none;
  }

  .search-bar.mobile-active {
    display: flex;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    border-top: 1px solid var(--gray-200);
    padding: var(--spacing-4);
    box-shadow: var(--shadow-md);
    z-index: 999;
  }

  .search-input {
    min-width: auto;
    flex: 1;
  }

  /* Mobile buttons - 表示 */
  .mobile-menu-toggle {
    display: flex !important;
  }

  .search-toggle {
    display: flex !important;
  }

  /* Mobile menu toggle animation */
  .mobile-menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .mobile-menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .mobile-menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  .header-actions {
    gap: var(--spacing-2);
  }

  .btn-join {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-xs);
  }
}

/* Product Card ホバーアニメーション */
.product-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(155, 123, 216, 0.15);
  border-color: var(--primary-purple-light);
}

/* News Card ホバーアニメーション */
.news-card {
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(155, 123, 216, 0.12);
}

/* Sort Section - filtersの中に配置 */
.sort-section {
  display: flex;
  justify-content: center;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.sort-select {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  background: var(--white);
  color: var(--gray-700);
  cursor: pointer;
  transition: border-color var(--transition-base);
  min-width: 150px;
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary-purple);
}

/* Filters レイアウト調整 */
.filters {
  width: 100%;
  padding: var(--spacing-6) var(--spacing-4);
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  margin-bottom: var(--spacing-8);
}

.filters-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  justify-content: center;
}

/* PC表示（1024px以上）: 横並び */
@media (min-width: 1024px) {
  .filters-inner {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .filter-tabs {
    justify-content: flex-start;
  }

  .sort-section {
    justify-content: flex-end;
  }
}

/* News Grid - 2列表示、レスポンシブで1列 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6);
}

/* ニュースカードのスタイル改善 */
.news-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  text-decoration: none;
  color: inherit;
}

/* News List (ホームページ用) */
.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.news-list .news-card {
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
}

/* プロダクトグリッドのレスポンシブ対応 */
/* 横幅が広いとき（1200px以上）: 3列表示 */
@media (min-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-6);
  }

  /* ホームページの注目の成果物は横にニュースがある時は1列 */
  #featured-products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-5);
  }
}

/* タブレット（768px - 1199px）: 2列表示 */
@media (max-width: 1199px) and (min-width: 769px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-5);
  }

  /* ホームページの注目の成果物は横にニュースがある時は1列 */
  #featured-products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-5);
  }
}

/* 元の768pxレスポンシブデザイン - より小さい画面用 */
@media (max-width: 768px) {
  /* ニュースグリッドを1列表示に */
  .news-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  /* フィルターをモバイル対応 - 縦に配置 */
  .filter-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-2);
    width: 100%;
    justify-content: stretch;
  }

  .filter-tab {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-xs);
  }

  /* ソートセクション調整 - カテゴリタブの下に */
  .sort-section {
    width: 100%;
    margin-top: var(--spacing-4);
  }

  .sort-select {
    width: 100%;
    max-width: 200px;
  }

  /* プロダクトグリッドを1列に */
  .products-grid {
    grid-template-columns: 1fr !important;
    gap: var(--spacing-4);
  }

  /* ホームページの注目の成果物も1列 */
  #featured-products-grid {
    grid-template-columns: 1fr !important;
    gap: var(--spacing-4);
  }
}

@media (max-width: 480px) {
  /* さらに小さい画面での調整 */
  .filter-tabs {
    grid-template-columns: 1fr;
  }

  .filters {
    padding: var(--spacing-3);
  }

  .sort-section {
    margin: var(--spacing-4) 0;
  }
}

/* Hero Content - 中央配置 */
.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

/* Home Layout - レスポンシブ対応 */
.home-main-content {
  padding: var(--spacing-12) 0;
}

.content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-12);
  align-items: start;
}

/* Featured Products Section */
.featured-products {
  padding: 0;
}

/* News Section */
.news-section {
  padding: var(--spacing-8);
  background: var(--gray-50);
  border-radius: var(--radius-xl);
  position: sticky;
  top: var(--spacing-20);
  height: fit-content;
}

/* News List - 右配置時は1列表示 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.news-list .news-card {
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  background: var(--white);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
}

/* タブレット対応 - ニュースが下に移動して2列表示 */
@media (max-width: 1024px) and (min-width: 741px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }

  .news-section {
    position: static;
    order: 2;
    background: var(--gray-50);
    padding: var(--spacing-8);
    border-radius: var(--radius-xl);
  }

  .featured-products {
    order: 1;
  }

  /* 注目の成果物を2列表示 */
  #featured-products-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: var(--spacing-5);
  }

  /* ニュースは常に1列表示 */
  .news-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }
}

/* モバイル対応 - ニュースが下で1列表示 */
@media (max-width: 740px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }

  .news-section {
    position: static;
    order: 2;
    background: var(--gray-50);
    padding: var(--spacing-6);
    border-radius: var(--radius-xl);
  }

  .featured-products {
    order: 1;
  }

  /* 注目の成果物を1列表示 */
  #featured-products-grid {
    grid-template-columns: 1fr !important;
    gap: var(--spacing-4);
  }

  /* ニュースを1列表示 */
  .news-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }
}

/* アニメーション改善 */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 統計カードのホバーアニメーション */
.stat-card {
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* ボタンのホバーアニメーション改善 */
.btn-primary:hover,
.btn-secondary:hover,
.btn-join:hover {
  transform: translateY(-2px);
}

.filter-tab {
  transition: all var(--transition-base);
}

.filter-tab:hover {
  transform: translateY(-1px);
}

/* Admin Styles */
.admin {
  padding: var(--spacing-12) 0;
}

.admin-tabs {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-8);
  border-bottom: 1px solid var(--gray-200);
}

.admin-tab {
  padding: var(--spacing-3) var(--spacing-6);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: var(--font-size-base);
  color: var(--gray-600);
  transition: all var(--transition-base);
}

.admin-tab:hover {
  color: var(--primary-purple);
}

.admin-tab.active {
  color: var(--primary-purple);
  border-bottom-color: var(--primary-purple);
}

.admin-content {
  margin-top: var(--spacing-6);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.admin-header h2 {
  margin: 0;
  color: var(--gray-800);
}

.admin-actions {
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
}

.csv-actions {
  display: flex;
  gap: var(--spacing-2);
}

.btn-csv {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.btn-csv:hover {
  background: var(--gray-200);
  transform: translateY(-1px);
}

.csv-import {
  position: relative;
}

.admin-form {
  background: var(--gray-50);
  padding: var(--spacing-6);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-8);
}

.admin-form h3 {
  margin: 0 0 var(--spacing-6) 0;
  color: var(--gray-800);
}

.form-group {
  margin-bottom: var(--spacing-4);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: 500;
  color: var(--gray-700);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-base);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-purple);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: var(--spacing-2);
}

.admin-list {
  display: grid;
  gap: var(--spacing-4);
}

.admin-item {
  background: var(--white);
  padding: var(--spacing-6);
  border-radius: var(--radius-xl);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
}

.admin-item h4 {
  margin: 0 0 var(--spacing-2) 0;
  color: var(--gray-800);
}

.admin-item p {
  margin: var(--spacing-2) 0;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
}

/* Admin Item Layout */
.admin-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-4);
}

.admin-item-content {
  flex: 1;
}

.admin-item-meta {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
  margin-top: var(--spacing-2);
}

.admin-item-actions {
  display: flex;
  gap: var(--spacing-2);
  flex-shrink: 0;
}

.btn-edit,
.btn-duplicate,
.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit:hover {
  background: var(--primary-purple-lighter);
}

.btn-duplicate:hover {
  background: var(--gray-100);
}

.btn-delete:hover {
  background: #fee;
  color: #d63384;
}

.form-actions {
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
}

.btn-secondary {
  background: var(--gray-200);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background: var(--gray-300);
  transform: translateY(-1px);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: var(--spacing-4);
    align-items: stretch;
  }

  .admin-actions {
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .csv-actions {
    justify-content: center;
  }

  .admin-tabs {
    flex-direction: column;
  }

  .admin-tab {
    text-align: center;
    border-bottom: none;
    border-left: 3px solid transparent;
  }

  .admin-tab.active {
    border-left-color: var(--primary-purple);
    border-bottom-color: transparent;
  }
}

/* Members Page Styles */
.members {
  padding: var(--spacing-12) 0;
}

.page-subtitle {
  text-align: center;
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  margin-bottom: var(--spacing-12);
  line-height: 1.6;
}

.featured-members {
  margin-bottom: var(--spacing-16);
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-8);
  margin-top: var(--spacing-8);
}

.featured-grid {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-10);
}

/* =================================================
   メンバーカード基本レイアウト
   ================================================= */

.member-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  transition: all var(--transition-base);
  position: relative;
  min-height: 400px;
  max-height: 500px;
  overflow: hidden;
}

.member-card-content {
  display: flex;
  gap: var(--spacing-5);
  align-items: flex-start;
  height: 100%;
  min-height: 350px;
}

/* 左エリア: 写真・バナー・アイコン */
.member-card-left {
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  order: 1;
}

/* 中央エリア: プロフィール情報 */
.member-card-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0 var(--spacing-4);
  order: 2;
}

.member-card-center .member-avatar-container {
  margin-bottom: var(--spacing-3);
}

.member-card-center .member-avatar {
  width: 80px;
  height: 80px;
  margin-bottom: 0;
}

/* 右エリア: コメント専用 */
.member-card-right {
  flex: 0 0 180px;
  display: flex;
  flex-direction: column;
  position: relative;
  order: 3;
}

.comment-section-header {
  text-align: center;
  margin-bottom: var(--spacing-3);
}

.comment-section-header .comment-icon {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-xs);
  font-weight: 500;
  transition: all var(--transition-base);
}

.comment-section-header .comment-icon:hover {
  background: var(--primary-purple);
  color: white;
  transform: translateY(-2px);
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(155, 123, 216, 0.15);
  border-color: var(--primary-purple-light);
}

.member-avatar {
  width: 120px;
  height: 120px;
  margin-bottom: var(--spacing-6);
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.member-avatar:hover {
  transform: scale(1.1);
  z-index: 2;
}

.featured-grid .member-avatar {
  width: 140px;
  height: 140px;
}

.featured-grid .member-avatar:hover {
  transform: scale(1.08);
}

.member-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-purple-lighter);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.member-avatar:hover img {
  border-color: var(--primary-purple);
  box-shadow: 0 8px 25px rgba(155, 123, 216, 0.4);
}

.member-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--primary-purple);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-3xl);
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.member-avatar:hover .member-avatar-fallback {
  background: #7C3AED;
  box-shadow: 0 8px 25px rgba(155, 123, 216, 0.4);
  transform: rotate(5deg);
}

/* Member Tooltip */
.member-tooltip {
  position: absolute;
  top: 50%;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1000;
}

/* 左側に表示するツールチップ */
.tooltip-left {
  right: 100%;
  transform: translateY(-50%);
  margin-right: 15px;
}

.member-avatar:hover .tooltip-left {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(-5px);
}

/* 右側に表示するツールチップ */
.tooltip-right {
  left: 100%;
  transform: translateY(-50%);
  margin-left: 15px;
}

.member-avatar:hover .tooltip-right {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(5px);
}

.tooltip-content {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 3px 10px rgba(0, 0, 0, 0.1);
  max-width: 280px;
  min-width: 200px;
  white-space: normal;
  text-align: left;
}

.tooltip-content h4 {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary-purple);
}

.tooltip-content p {
  margin: 0;
  font-size: var(--font-size-xs);
  line-height: 1.4;
  color: var(--gray-600);
}

/* 左側ツールチップの矢印 */
.tooltip-left .tooltip-arrow {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid var(--white);
}

.tooltip-left .tooltip-arrow::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -9px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid var(--gray-200);
}

/* 右側ツールチップの矢印 */
.tooltip-right .tooltip-arrow {
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid var(--white);
}

.tooltip-right .tooltip-arrow::before {
  content: '';
  position: absolute;
  top: -8px;
  right: -9px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid var(--gray-200);
}

/* =================================================
   中央エリア: メンバー情報
   ================================================= */

.member-info {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-2) 0;
}

.member-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
  line-height: 1.2;
}

.featured-grid .member-name {
  font-size: var(--font-size-xl);
}

.member-role {
  font-size: var(--font-size-sm);
  color: var(--primary-purple);
  font-weight: 500;
  margin: 0;
}

.member-bio {
  font-size: var(--font-size-xs);
  color: var(--gray-700);
  line-height: 1.4;
  margin: 0;
  text-align: center;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
  padding: var(--spacing-2);
  max-height: 50px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}


.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  justify-content: center;
  max-width: 200px;
  margin: 0 auto;
  max-height: 60px;
  overflow: hidden;
}

.skill-tag {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
}

.member-location {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  margin: var(--spacing-2) 0;
}

.member-social {
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
  margin: var(--spacing-6) 0;
}

.member-social a {
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: transform var(--transition-base);
}

.member-social a:hover {
  transform: scale(1.2);
}

.member-join-date {
  font-size: var(--font-size-xs);
  color: var(--gray-400);
  margin: var(--spacing-6) 0 0 0;
}

.no-comments {
  padding: var(--spacing-4);
  text-align: center;
  color: var(--gray-500);
  font-style: italic;
}

/* Responsive adjustments for members */
/* タブレット用レスポンシブ（中サイズ） */
@media (max-width: 1024px) and (min-width: 769px) {
  .member-card {
    min-height: auto;
    max-height: none;
    height: auto;
  }
  
  .member-card-content {
    flex-direction: column;
    gap: var(--spacing-4);
    min-height: auto;
  }
  
  /* タブレットでの表示順序: 中央→左→右 */
  .member-card-center {
    order: 1;
    width: 100%;
  }
  
  .member-card-left {
    order: 2;
    flex: none;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .member-card-right {
    order: 3;
    width: 100%;
    flex: none;
  }
}

/* スマートフォン用レスポンシブ（小サイズ） */
@media (max-width: 768px) {
  .members-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }
  
  .member-avatar {
    width: 100px;
    height: 100px;
  }
  
  .featured-grid .member-avatar {
    width: 120px;
    height: 120px;
  }
  
  .member-card {
    padding: var(--spacing-4);
    min-height: auto; /* 動的な高さに変更 */
    max-height: none; /* 最大高さ制限を解除 */
    height: auto; /* 自動調整 */
  }
  
  .member-card-content {
    flex-direction: column;
    gap: var(--spacing-3);
    min-height: auto; /* 最小高さも自動に */
  }
  
  /* モバイルでの表示順序: 中央→左→右 */
  .member-card-center {
    order: 1;
    width: 100%;
  }
  
  .member-card-left {
    order: 2;
    flex: none;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  
  /* スマホでの写真カルーセルサイズ調整 */
  .member-photo-carousel {
    height: 200px; /* スマホでは少し大きく */
  }
  
  .member-card-right {
    order: 3;
    width: 100%;
    flex: none;
    max-height: 200px; /* スマホでのコメントエリア最大高さ */
    overflow-y: auto; /* 必要に応じてスクロール */
  }
  
  /* スマホでのメッセージコンテナ調整 */
  .member-messages-container {
    max-height: 150px;
    overflow-y: auto;
  }
  
  .member-icon-grid {
    max-width: 240px;
    margin: 0 auto;
  }
  
  /* スマホでのアイコンセクション調整 */
  .member-icon-section {
    min-height: 60px; /* 最小高さを縮小 */
    flex: none; /* フレックス成長を無効化 */
  }
  
  /* メッセージのモバイル対応 */
  .member-messages-container {
    width: 220px;
    top: 8px;
    bottom: 8px;
    right: var(--spacing-2);
  }
  
  .member-messages-scroll {
    padding: var(--spacing-3);
  }
  
  .message-left {
    margin-right: 20px;
  }
  
  .message-right {
    margin-left: 20px;
  }

  /* モバイルでのタッチ対応：ホバー効果を抑制 */
  @media (hover: none) {
    .member-avatar:hover {
      transform: none;
      z-index: 1;
    }
    
    .member-avatar:hover img {
      border-color: var(--primary-purple-lighter);
      box-shadow: none;
    }
    
    .member-avatar:hover .member-avatar-fallback {
      background: var(--primary-purple);
      box-shadow: none;
      transform: none;
    }
    
    /* モバイルではツールチップを無効化 */
    .member-tooltip {
      display: none;
    }
  }
}

/* Comment Icon */
.comment-icon {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  background: var(--white);
  border: 2px solid var(--primary-purple);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.comment-icon:hover {
  transform: scale(1.1);
  background: var(--primary-purple);
  color: var(--white);
  box-shadow: 0 4px 12px rgba(155, 123, 216, 0.3);
}

/* Member Avatar Container - 中央配置 */
.member-avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-8);
  margin-top: var(--spacing-4);
  position: relative;
}

/* Member Messages Container - 右側配置 */
.member-messages-container {
  position: absolute;
  top: 8px;
  right: var(--spacing-4);
  bottom: 8px;
  width: 280px;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Member Messages Scroll Area */
.member-messages-scroll {
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  position: relative;
}

/* カスタムスクロールバー */
.member-messages-scroll::-webkit-scrollbar {
  width: 4px;
}

.member-messages-scroll::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 2px;
}

.member-messages-scroll::-webkit-scrollbar-thumb {
  background: var(--primary-purple-light);
  border-radius: 2px;
}

.member-messages-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--primary-purple);
}

/* Message Bubble - 左右交互配置 */
.message-bubble {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin-bottom: -8px; /* 重なり効果 */
  animation: messageSlideIn 0.6s ease-out;
}

.message-bubble:hover {
  transform: translateY(-3px) scale(1.02);
  z-index: 1000 !important;
}

/* 左側メッセージ */
.message-left {
  align-self: flex-start;
  transform: rotate(-1deg);
  margin-right: 40px;
}

.message-left .message-content {
  background: linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%);
  color: var(--gray-800);
  border-radius: 20px 20px 20px 5px;
  padding: var(--spacing-3) var(--spacing-4);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
  position: relative;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.message-left .message-content::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: -5px;
  width: 0;
  height: 0;
  border-right: 5px solid #E0E7FF;
  border-bottom: 5px solid transparent;
}

/* 右側メッセージ */
.message-right {
  align-self: flex-end;
  transform: rotate(1deg);
  margin-left: 40px;
}

.message-right .message-content {
  background: linear-gradient(135deg, var(--primary-purple) 0%, #7C3AED 100%);
  color: var(--white);
  border-radius: 20px 20px 5px 20px;
  padding: var(--spacing-3) var(--spacing-4);
  box-shadow: 0 4px 15px rgba(155, 123, 216, 0.4);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.message-right .message-content::before {
  content: '';
  position: absolute;
  bottom: 0;
  right: -5px;
  width: 0;
  height: 0;
  border-left: 5px solid var(--primary-purple);
  border-bottom: 5px solid transparent;
}

/* Message Content */
.message-author {
  font-weight: 600;
  font-size: 11px;
  margin-bottom: var(--spacing-1);
  opacity: 0.8;
}

.message-left .message-author {
  color: #4338CA;
}

.message-right .message-author {
  color: rgba(255, 255, 255, 0.9);
}

.message-text {
  font-size: var(--font-size-xs);
  line-height: 1.4;
  margin-bottom: var(--spacing-1);
  word-wrap: break-word;
}

.message-left .message-text {
  color: var(--gray-700);
}

.message-right .message-text {
  color: var(--white);
}

.message-date {
  font-size: 10px;
  opacity: 0.6;
  text-align: right;
  font-style: italic;
}

.message-left .message-date {
  color: var(--gray-500);
}

.message-right .message-date {
  color: rgba(255, 255, 255, 0.7);
}

/* メッセージアニメーション */
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-2px) scale(1.05);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Comment Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.comment-modal {
  background: var(--white);
  border-radius: var(--radius-xl);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h3 {
  margin: 0;
  color: var(--gray-800);
  font-size: var(--font-size-lg);
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  cursor: pointer;
  color: var(--gray-400);
  transition: color var(--transition-base);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--gray-600);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-footer {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  padding: var(--spacing-6);
  border-top: 1px solid var(--gray-200);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-200);
}

.btn-login {
  background: var(--primary-purple);
  color: var(--white);
  border: 1px solid var(--primary-purple);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
}

.btn-login:hover {
  background: #7C3AED;
  transform: translateY(-1px);
}

.btn-logout {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
}

.btn-logout:hover {
  background: var(--gray-200);
  transform: translateY(-1px);
}

/* X Login Styles */
.x-login-section {
  margin-bottom: var(--spacing-6);
}

.btn-x-login {
  width: 100%;
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
}

.btn-x-login:hover:not(:disabled) {
  background: #1a1a1a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-x-login:disabled {
  background: #666666;
  cursor: not-allowed;
  transform: none;
}

.btn-x-login svg {
  flex-shrink: 0;
}

.login-divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-6) 0;
}

.login-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gray-300);
}

.login-divider span {
  background: var(--white);
  padding: 0 var(--spacing-4);
  color: var(--gray-500);
  font-size: var(--font-size-sm);
}

/* Highlight effect for scrolled member */
.member-card.highlight {
  animation: highlightPulse 2s ease-in-out;
}

@keyframes highlightPulse {
  0%, 100% {
    box-shadow: var(--shadow-sm);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(155, 123, 216, 0.3), var(--shadow-lg);
    transform: scale(1.02);
  }
}

/* デスクトップでの追加のホバー効果 */
@media (hover: hover) and (pointer: fine) {
  .member-avatar:hover {
    animation: avatarPulse 0.6s ease-in-out;
  }
}

@keyframes avatarPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.1);
  }
}

/* Discord Error Indicator */
.discord-error {
  font-size: 12px;
  margin-left: 4px;
  opacity: 0.7;
  cursor: help;
}

/* Login Form Container */
.login-form-container {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
  margin: var(--spacing-4) 0;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--gray-200);
}

.login-header h3 {
  margin: 0;
  color: var(--gray-800);
  font-size: 1.5rem;
  font-weight: 600;
}

.login-form-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--gray-200);
}

.login-form-actions .btn {
  min-width: 100px;
}

.signup-link {
  text-align: center;
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

.signup-link p {
  margin: 0;
  color: var(--gray-600);
  font-size: 14px;
}

.signup-link-text {
  color: var(--primary-purple);
  text-decoration: none;
  font-weight: 600;
}

.signup-link-text:hover {
  text-decoration: underline;
}

/* Signup Modal Styles */
.signup-form-container {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
  margin: var(--spacing-4) 0;
}

.signup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--gray-200);
}

.signup-header h3 {
  margin: 0;
  color: var(--gray-800);
  font-size: 1.5rem;
  font-weight: 600;
}

.signup-divider {
  display: flex;
  align-items: center;
  margin: var(--spacing-6) 0;
  text-align: center;
}

.signup-divider::before,
.signup-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gray-300);
}

.signup-divider span {
  padding: 0 var(--spacing-4);
  color: var(--gray-500);
  font-size: 14px;
}

.signup-form-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--gray-200);
}

.signup-form-actions .btn {
  min-width: 100px;
}

.login-link {
  text-align: center;
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

.login-link p {
  margin: 0;
  color: var(--gray-600);
  font-size: 14px;
}

.login-link-text {
  color: var(--primary-purple);
  text-decoration: none;
  font-weight: 600;
}

.login-link-text:hover {
  text-decoration: underline;
}

/* Profile Page Styles */
.profile {
  padding: var(--spacing-16) 0;
  min-height: 60vh;
}

.profile-content {
  max-width: 800px;
  margin: 0 auto;
}

.profile-form-container {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--spacing-12);
  box-shadow: var(--shadow-sm);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-6);
}

.form-group {
  margin-bottom: var(--spacing-6);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: 600;
  color: var(--gray-700);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: 14px;
  transition: border-color var(--transition-base);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-purple);
  box-shadow: 0 0 0 3px rgba(155, 123, 216, 0.1);
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: var(--spacing-2);
  font-weight: normal !important;
}

.checkbox-label input[type="checkbox"] {
  width: auto !important;
  margin: 0;
}

.profile-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--gray-200);
}

.profile-actions .btn {
  min-width: 120px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .profile-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .profile-actions .btn {
    min-width: auto;
  }
}

/* Profile Card Left Column Styles */
.profile-content {
  display: flex;
  gap: var(--spacing-8);
  align-items: flex-start;
}

.profile-card-left {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.profile-form-container {
  flex: 1;
}

/* Photo Carousel Styles */
.photo-carousel-section {
  width: 100%;
}

.carousel-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--gray-100);
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.carousel-slide.active {
  opacity: 1;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-number {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  z-index: 10;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-4);
  pointer-events: none;
}

.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: var(--gray-700);
  cursor: pointer;
  pointer-events: auto;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-indicators {
  position: absolute;
  bottom: var(--spacing-4);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-2);
}

.carousel-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all var(--transition-base);
}

.carousel-indicator.active {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.2);
}

.photo-placeholder {
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: var(--radius-xl);
  background: var(--gray-100);
  border: 2px dashed var(--gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: var(--gray-500);
}

.photo-placeholder {
  cursor: pointer;
  transition: all 0.2s ease;
}

.photo-placeholder:hover {
  border-color: var(--primary-color);
  background: var(--gray-50);
}

.photo-upload-controls {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.photo-upload-btn,
.photo-remove-btn {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.photo-upload-btn {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.photo-upload-btn:hover {
  background: var(--gray-200);
  border-color: var(--primary-color);
}

.photo-remove-btn {
  background: var(--red-50);
  color: var(--red-600);
  border: 1px solid var(--red-200);
}

.photo-remove-btn:hover {
  background: var(--red-100);
  border-color: var(--red-400);
}

.btn-icon {
  font-size: 16px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .photo-upload-controls {
    flex-direction: column;
  }
  
  .photo-upload-btn,
  .photo-remove-btn {
    width: 100%;
    min-width: unset;
  }
}

.placeholder-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-2);
}

/* Personal Website Banner Styles */
.personal-website-banner {
  cursor: pointer;
  transition: transform var(--transition-base);
  margin: var(--spacing-4) 0;
}

.personal-website-banner:hover {
  transform: scale(1.02);
}

.pixel-banner {
  background: linear-gradient(45deg, #FF6B9D, #4ECDC4, #9B7BD8);
  background-size: 400% 400%;
  animation: pixelGradient 3s ease infinite;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 
    inset 0 1px 0 rgba(255,255,255,0.3),
    0 4px 8px rgba(0,0,0,0.1);
}

.pixel-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 25% 25%, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px, transparent 4px),
    radial-gradient(circle at 75% 75%, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px, transparent 4px);
  background-size: 8px 8px;
  z-index: 1;
}

@keyframes pixelGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.banner-text {
  position: relative;
  z-index: 2;
  color: white;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-family: 'Courier New', monospace;
}

/* Icon Settings Styles */
.icon-settings {
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  background: var(--gray-50);
}

.icon-settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.icon-setting-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  background: var(--white);
}

.icon-setting-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.icon-setting-item.active {
  border-color: var(--primary-color);
  background: var(--primary-50);
  box-shadow: var(--shadow-sm);
}

.icon-preview {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.icon-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-600);
  text-align: center;
}

.icon-help-text {
  font-size: 12px;
  color: var(--gray-500);
  text-align: center;
  margin: 0;
}

/* =================================================
   左エリア: 写真カルーセル
   ================================================= */

.member-photo-carousel {
  width: 100%;
  height: 140px;
  flex-shrink: 0;
}

.member-photo-carousel .carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--gray-100);
}

.member-photo-carousel .carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.member-photo-carousel .carousel-slide.active {
  opacity: 1;
}

.member-photo-carousel .carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-photo-placeholder {
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: var(--radius-lg);
  background: var(--gray-100);
  border: 2px dashed var(--gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-photo-placeholder .placeholder-content {
  text-align: center;
  color: var(--gray-500);
}

.member-photo-placeholder .placeholder-icon {
  font-size: 32px;
  display: block;
  margin-bottom: var(--spacing-2);
}

.member-photo-carousel .photo-number {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.member-photo-carousel .carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-2);
  pointer-events: none;
}

.member-photo-carousel .carousel-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: var(--gray-700);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  pointer-events: all;
}

.member-photo-carousel .carousel-btn:hover {
  background: white;
  transform: scale(1.1);
}

.member-photo-carousel .carousel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.member-photo-carousel .carousel-indicators {
  position: absolute;
  bottom: var(--spacing-3);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-2);
}

.member-photo-carousel .carousel-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.member-photo-carousel .carousel-indicator.active {
  background: white;
  transform: scale(1.2);
}

/* =================================================
   左エリア: PERSONAL WEBSITEバナー
   ================================================= */

.member-personal-website-banner {
  cursor: pointer;
  transition: transform var(--transition-base);
  height: 40px;
  flex-shrink: 0;
}

.member-personal-website-banner:hover {
  transform: scale(1.02);
}

.member-pixel-banner {
  background: linear-gradient(45deg, #FF6B9D, #4ECDC4, #9B7BD8);
  background-size: 400% 400%;
  animation: memberPixelGradient 3s ease infinite;
  border-radius: var(--radius-md);
  padding: var(--spacing-2);
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.member-pixel-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 25% 25%, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px, transparent 2px);
  background-size: 4px 4px;
  z-index: 1;
}

@keyframes memberPixelGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.member-banner-text {
  position: relative;
  z-index: 2;
  color: white;
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  font-family: 'Courier New', monospace;
}

/* Member Icon Section */
/* =================================================
   左エリア: アイコンセクション
   ================================================= */

.member-icon-section {
  flex: 1;
  min-height: 80px;
}

.member-icon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-2);
  width: 100%;
}

.member-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-1);
  cursor: pointer;
  transition: transform var(--transition-base);
  padding: var(--spacing-2);
  border-radius: var(--radius-sm);
}

.member-icon-item:hover {
  transform: translateY(-2px);
  background: var(--gray-50);
}

.member-icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--gray-200);
  transition: all var(--transition-base);
}

.member-icon-item:hover .member-icon-circle {
  border-color: var(--primary-color);
  background: var(--primary-50);
}

.member-icon-emoji {
  font-size: 16px;
}

.member-icon-label {
  font-size: 8px;
  font-weight: 600;
  color: var(--gray-600);
  text-align: center;
  line-height: 1;
}

/* Icon Section Styles */
.icon-section {
  width: 100%;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: var(--spacing-4);
  max-width: 240px;
  margin: 0 auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  transition: transform var(--transition-base);
}

.icon-item:hover {
  transform: translateY(-2px);
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-purple), #7C3AED);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.icon-item:hover .icon-circle {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.icon-emoji {
  font-size: 20px;
}

.icon-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }
  
  .profile-card-left {
    flex: none;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .carousel-container {
    max-width: 320px;
    margin: 0 auto;
  }
}
</style>
