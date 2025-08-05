// News page functionality

class NewsPage {
  constructor() {
    this.init();
  }
  
  init() {
    this.renderNews();
  }
  
  renderNews() {
    const container = document.getElementById('news-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    news.forEach((newsItem, index) => {
      const card = this.createNewsCard(newsItem);
      // Add animation delay
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-fade-in-up');
      container.appendChild(card);
    });
  }
  
  createNewsCard(newsItem) {
    const card = document.createElement('a');
    card.href = newsItem.url;
    card.target = '_blank';
    card.className = 'news-card';
    
    card.innerHTML = `
      <h3 class="news-title">${newsItem.title}</h3>
      <p class="news-excerpt">${newsItem.excerpt}</p>
      <span class="news-date">${this.formatDate(newsItem.date)}</span>
    `;
    
    return card;
  }
  
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return '今日';
    if (diffInDays === 1) return '昨日';
    if (diffInDays < 7) return `${diffInDays}日前`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}週間前`;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
  }
}

// Initialize when DOM is loaded
let newsPage;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    newsPage = new NewsPage();
  });
} else {
  newsPage = new NewsPage();
}