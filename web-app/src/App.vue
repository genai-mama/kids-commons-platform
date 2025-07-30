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
            <li>
              <a
                href="#"
                @click="navigateToPage('admin')"
                class="nav-link"
                :class="{ active: currentPage === 'admin' }"
                >Managed</a
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
          <!-- <a href="#" class="btn-join" id="join-btn" @click="handleJoinClick"
            >参加する</a
          > -->
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
                <div class="stat-number" data-count="127">
                  {{ stats.totalMembers }}
                </div>
                <div class="stat-label">メンバー数</div>
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
                <div class="admin-actions">
                  <button
                    class="btn-primary"
                    @click="showMemberForm = !showMemberForm"
                  >
                    {{ showMemberForm ? "フォームを閉じる" : "新規追加" }}
                  </button>
                </div>
              </div>

              <!-- 新規追加フォーム -->
              <div v-if="showMemberForm" class="admin-form">
                <h3>新しいメンバーを追加</h3>
                <form @submit.prevent="handleAddMember" :key="showMemberForm">
                  <div class="form-group">
                    <label>名前</label>
                    <input type="text" v-model="newMember.name" required />
                  </div>
                  <div class="form-group">
                    <label>役割</label>
                    <input type="text" v-model="newMember.role" required />
                  </div>
                  <div class="form-group">
                    <label>自己紹介</label>
                    <textarea
                      v-model="newMember.bio"
                      required
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>アバターURL</label>
                    <input type="url" v-model="newMember.avatar" />
                  </div>
                  <div class="form-group">
                    <label>スキル（カンマ区切り）</label>
                    <input
                      type="text"
                      v-model="newMember.skillsString"
                      placeholder="Vue.js, TypeScript, デザイン"
                    />
                  </div>
                  <div class="form-group">
                    <label>所在地</label>
                    <input type="text" v-model="newMember.location" />
                  </div>
                  <div class="form-group">
                    <label>WebサイトURL</label>
                    <input type="url" v-model="newMember.website" />
                  </div>
                  <div class="form-group">
                    <label>TwitterURL</label>
                    <input type="url" v-model="newMember.twitter" />
                  </div>
                  <div class="form-group">
                    <label>GitHubURL</label>
                    <input type="url" v-model="newMember.github" />
                  </div>
                  <div class="form-group">
                    <label>
                      <input type="checkbox" v-model="newMember.featured" />
                      コアメンバーとして表示
                    </label>
                  </div>
                  <button type="submit" class="btn-primary">追加</button>
                </form>
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
    </main>

    <!-- Footer -->
    <footer class="footer app-footer">
      <div class="container">
        <p>&copy; 2025 #生成AIママ部. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { useFirestore } from "./composables/useFirestore";
import { arrayToCSV, csvToArray, downloadCSV, readCSVFile } from "./utils/csvUtils";

// State
const currentPage = ref("home");
const mobileMenuOpen = ref(false);
const mobileSearchActive = ref(false);
const searchQuery = ref("");
const currentFilter = ref("all");
const currentSort = ref("likes");
const likedProducts = ref<Set<number>>(new Set());
let searchTimeout: number | null = null;

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
const stats = ref({
  totalMembers: 127,
  totalProducts: 4,
  activeDays: 156,
  totalLikes: 105,
});

const categories = ref([
  { id: "all", name: "すべて", count: 4 },
  { id: "仕事効率化", name: "仕事効率化", count: 1 },
  { id: "学校", name: "学校", count: 1 },
  { id: "コミュニケーション", name: "コミュニケーション", count: 1 },
  { id: "学習", name: "学習", count: 1 },
]);

// Methods
const navigateToPage = async (page: string) => {
  currentPage.value = page;
  mobileMenuOpen.value = false;

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
  editingMember.value = {
    ...member,
    skillsString: member.skills.join(", ")
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
      featured: editingMember.value.featured
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
    
    const csvContent = arrayToCSV(exportData, headers);
    const filename = `products_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
    
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
    const csvContent = await readCSVFile(file);
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
    
    const importedData = csvToArray(csvContent, headers);
    
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
    
    const csvContent = arrayToCSV(news.value, headers);
    const filename = `news_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
    
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
    const csvContent = await readCSVFile(file);
    const headers = [
      'title',
      'excerpt',
      'date',
      'url'
    ];
    
    const importedData = csvToArray(csvContent, headers);
    
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

  card.innerHTML = `
    <div class="member-avatar">
      <img src="${member.avatar}" alt="${member.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="member-avatar-fallback" style="display: none;">${member.name.charAt(0)}</div>
    </div>
    <div class="member-info">
      <h3 class="member-name">${member.name}</h3>
      <p class="member-role">${member.role}</p>
      <p class="member-bio">${member.bio}</p>
      ${member.skills.length > 0 ? `
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
  document.addEventListener("keydown", handleKeyDown);
  // Firestoreからデータを読み込み
  try {
    await initialize();
    console.log(
      "Firestore initialized, products:",
      products.value.length,
      "news:",
      news.value.length
    );
  } catch (error) {
    console.error("Failed to initialize Firestore:", error);
  }
  // データ読み込み後にページを初期化
  initializePage("home");
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

.member-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
}

.featured-grid .member-avatar {
  width: 140px;
  height: 140px;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-purple-lighter);
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
}

.member-info {
  width: 100%;
}

.member-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 var(--spacing-2) 0;
}

.featured-grid .member-name {
  font-size: var(--font-size-2xl);
}

.member-role {
  font-size: var(--font-size-base);
  color: var(--primary-purple);
  font-weight: 500;
  margin: 0 0 var(--spacing-4) 0;
}

.member-bio {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  line-height: 1.5;
  margin: 0 0 var(--spacing-4) 0;
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  justify-content: center;
  margin-bottom: var(--spacing-4);
}

.skill-tag {
  background: var(--primary-purple-lighter);
  color: var(--primary-purple);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
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
  margin: var(--spacing-4) 0;
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
  margin: var(--spacing-4) 0 0 0;
}

/* Responsive adjustments for members */
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
    padding: var(--spacing-6);
  }
}
</style>
