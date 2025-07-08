// Sample app data
const sampleApps = [
    {
        id: 1,
        title: "写真編集マスター",
        subtitle: "写真・ビデオ",
        rating: 4.8,
        category: "photo",
        icon: "https://via.placeholder.com/60x60/FF6B6B/FFFFFF?text=📸"
    },
    {
        id: 2,
        title: "音楽プレイヤー Pro",
        subtitle: "ミュージック",
        rating: 4.5,
        category: "music",
        icon: "https://via.placeholder.com/60x60/4ECDC4/FFFFFF?text=🎵"
    },
    {
        id: 3,
        title: "タスク管理アプリ",
        subtitle: "仕事効率化",
        rating: 4.6,
        category: "productivity",
        icon: "https://via.placeholder.com/60x60/45B7D1/FFFFFF?text=✅"
    },
    {
        id: 4,
        title: "フィットネストラッカー",
        subtitle: "ヘルスケア・フィットネス",
        rating: 4.7,
        category: "health",
        icon: "https://via.placeholder.com/60x60/96CEB4/FFFFFF?text=🏃"
    },
    {
        id: 5,
        title: "料理レシピ集",
        subtitle: "フード・ドリンク",
        rating: 4.4,
        category: "food",
        icon: "https://via.placeholder.com/60x60/FECA57/FFFFFF?text=🍳"
    },
    {
        id: 6,
        title: "学習アプリ",
        subtitle: "教育",
        rating: 4.9,
        category: "education",
        icon: "https://via.placeholder.com/60x60/6C5CE7/FFFFFF?text=📚"
    }
];

// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const appsGrid = document.querySelector('.apps-grid');
const tabBtns = document.querySelectorAll('.tab-btn');
const categoryCards = document.querySelectorAll('.category-card');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupSearch();
    setupTabs();
    setupCategories();
    renderApps(sampleApps);
});

// Navigation setup
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Search functionality
function setupSearch() {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredApps = sampleApps.filter(app => 
            app.title.toLowerCase().includes(searchTerm) || 
            app.subtitle.toLowerCase().includes(searchTerm)
        );
        renderApps(filteredApps);
    });
    
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredApps = sampleApps.filter(app => 
            app.title.toLowerCase().includes(searchTerm) || 
            app.subtitle.toLowerCase().includes(searchTerm)
        );
        renderApps(filteredApps);
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// Tab functionality
function setupTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you could implement different sorting/filtering logic
            // For now, we'll just show all apps
            renderApps(sampleApps);
        });
    });
}

// Category functionality
function setupCategories() {
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryTitle = this.querySelector('.category-title').textContent;
            
            // Add visual feedback
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
            }, 150);
            
            // Filter apps by category (simplified)
            let filteredApps = sampleApps;
            
            // You could implement more sophisticated category filtering here
            renderApps(filteredApps);
            
            // Scroll to apps section
            document.querySelector('#featured').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Render apps in the grid
function renderApps(apps) {
    appsGrid.innerHTML = '';
    
    apps.forEach(app => {
        const appCard = createAppCard(app);
        appsGrid.appendChild(appCard);
    });
}

// Create app card element
function createAppCard(app) {
    const card = document.createElement('div');
    card.className = 'app-card';
    
    const stars = generateStars(app.rating);
    
    card.innerHTML = `
        <img src="${app.icon}" alt="${app.title}" class="app-icon">
        <div class="app-info">
            <h3 class="app-title">${app.title}</h3>
            <p class="app-subtitle">${app.subtitle}</p>
            <div class="app-rating">
                <span class="stars">${stars}</span>
                <span class="rating-count">${app.rating}</span>
            </div>
        </div>
        <button class="download-btn">入手</button>
    `;
    
    // Add click event for download button
    const downloadBtn = card.querySelector('.download-btn');
    downloadBtn.addEventListener('click', function() {
        this.textContent = 'インストール中...';
        this.disabled = true;
        
        // Simulate download process
        setTimeout(() => {
            this.textContent = '開く';
            this.disabled = false;
            this.style.background = '#28a745';
        }, 2000);
    });
    
    return card;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (hasHalfStar) {
        stars += '☆';
    }
    
    // Fill remaining with empty stars up to 5
    while (stars.length < 5) {
        stars += '☆';
    }
    
    return stars;
}

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
function showLoading() {
    appsGrid.innerHTML = '<div class="loading">読み込み中...</div>';
}

// Add some entrance animations
function addEntranceAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.app-card, .category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addEntranceAnimations, 100);
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === '/') {
        e.preventDefault();
        searchInput.focus();
    }
    
    if (e.key === 'Escape') {
        searchInput.blur();
        searchInput.value = '';
        renderApps(sampleApps);
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - could implement next section navigation
            console.log('Swiped left');
        } else {
            // Swiped right - could implement previous section navigation
            console.log('Swiped right');
        }
    }
}