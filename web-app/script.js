// Sample app data
const sampleApps = [
  {
    id: 1,
    title: "ポストック",
    subtitle: "仕事効率化",
    category: "work",
    url: "https://postock.app/",
  },
  {
    id: 2,
    title: "⚔剣道リーグ戦チェッカー",
    subtitle: "学校",
    category: "school",
    url: "https://kendo-league-checker.netlify.app/",
  },
  {
    id: 3,
    title: "mamaconne プロフィールメーカー",
    subtitle: "コミュニケーション",
    category: "communication",
    url: "https://mamaconne.netlify.app/profile",
  },
];

// DOM elements
const navLinks = document.querySelectorAll(".nav-link");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const appsGrid = document.querySelector(".apps-grid");
const tabBtns = document.querySelectorAll(".tab-btn");
const categoryCards = document.querySelectorAll(".category-card");

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  setupSearch();
  setupTabs();
  setupCategories();
  renderApps(sampleApps);
});

// Navigation setup
function setupNavigation() {
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      // Smooth scroll to section
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Search functionality
function setupSearch() {
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredApps = sampleApps.filter(
      (app) =>
        app.title.toLowerCase().includes(searchTerm) ||
        app.subtitle.toLowerCase().includes(searchTerm)
    );
    renderApps(filteredApps);
  });

  searchBtn.addEventListener("click", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredApps = sampleApps.filter(
      (app) =>
        app.title.toLowerCase().includes(searchTerm) ||
        app.subtitle.toLowerCase().includes(searchTerm)
    );
    renderApps(filteredApps);
  });

  // Search on Enter key
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
}

// Tab functionality
function setupTabs() {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all tabs
      tabBtns.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Here you could implement different sorting/filtering logic
      // For now, we'll just show all apps
      renderApps(sampleApps);
    });
  });
}

// Category functionality
function setupCategories() {
  categoryCards.forEach((card) => {
    card.addEventListener("click", function () {
      const categoryTitle = this.querySelector(".category-title").textContent;

      // Add visual feedback
      card.style.transform = "scale(0.95)";
      setTimeout(() => {
        card.style.transform = "translateY(-5px)";
      }, 150);

      // Filter apps by category (simplified)
      let filteredApps = sampleApps;

      // You could implement more sophisticated category filtering here
      renderApps(filteredApps);

      // Scroll to apps section
      document.querySelector("#featured").scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}

// Render apps in the grid
function renderApps(apps) {
  appsGrid.innerHTML = "";

  apps.forEach((app) => {
    const appCard = createAppCard(app);
    appsGrid.appendChild(appCard);
  });
}

// Create app card element
function createAppCard(app) {
  const link = document.createElement("a");
  link.href = app.url || `https://example.com/app${app.id}`;
  link.target = "_blank";
  link.className = "app-card-link";

  const card = document.createElement("div");
  card.className = "app-card";

  card.innerHTML = `
        <img src="${app.icon}" alt="${app.title}" class="app-icon">
        <div class="app-info">
            <h3 class="app-title">${app.title}</h3>
            <p class="app-subtitle">${app.subtitle}</p>
        </div>
    `;

  link.appendChild(card);
  return link;
}

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  document.querySelectorAll(".app-card, .category-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(addEntranceAnimations, 100);
});

// Add keyboard navigation
document.addEventListener("keydown", function (e) {
  if (e.key === "/") {
    e.preventDefault();
    searchInput.focus();
  }

  if (e.key === "Escape") {
    searchInput.blur();
    searchInput.value = "";
    renderApps(sampleApps);
  }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", function (e) {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", function (e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swiped left - could implement next section navigation
      console.log("Swiped left");
    } else {
      // Swiped right - could implement previous section navigation
      console.log("Swiped right");
    }
  }
}
