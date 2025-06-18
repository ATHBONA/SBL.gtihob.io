// main.js
// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        if(this.getAttribute('href') === '#') return;
        
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if(navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }
    });
});

// Fetch and render apps
async function fetchApps(searchTerm = '', exactName = '') {
    try {
        let url = '/apps';
        if (searchTerm) {
            url += `?search=${encodeURIComponent(searchTerm)}`;
        } else if (exactName) {
            url += `?name=${encodeURIComponent(exactName)}`;
        }
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching apps:', error);
        return [];
    }
}

// Render Apps
async function renderApps(filter = 'all', searchTerm = '', exactName = '') {
    const appsContainer = document.getElementById('apps-container');
    const featuredContainer = document.getElementById('featured-container');
    
    if (!appsContainer && !featuredContainer) return;
    
    const apps = await fetchApps(searchTerm, exactName);
    
    if (appsContainer) {
        appsContainer.innerHTML = '';
        let filteredApps = apps;
        
        if (!searchTerm && !exactName) {
            filteredApps = filter === 'all' ? apps : apps.filter(app => app.category === filter);
        }
        
        filteredApps.forEach(app => {
            const appCard = createAppCard(app);
            appCard.addEventListener('click', () => {
                window.location.href = `/app/${app.id}`;
            });
            appsContainer.appendChild(appCard);
        });
    }
    
    if (featuredContainer) {
        featuredContainer.innerHTML = '';
        const featuredApps = apps.filter(app => app.featured);
        
        featuredApps.forEach(app => {
            const appCard = createAppCard(app, true);
            appCard.addEventListener('click', () => {
                window.location.href = `/app/${app.id}`;
            });
            featuredContainer.appendChild(appCard);
        });
    }
}

// Create App Card Element
function createAppCard(app, isFeatured = false) {
    const appCard = document.createElement('div');
    appCard.className = 'app-card';
    appCard.dataset.category = app.category;
    
    let badgeHTML = '';
    if (app.badge) {
        badgeHTML = `<span class="app-badge">${app.badge}</span>`;
    }
    
    appCard.innerHTML = `
        ${badgeHTML}
        <div class="app-image">
            <img src="${app.image}" alt="${app.title}">
        </div>
        <div class="app-content">
            <h3 class="app-title">${app.title}</h3>
            <p class="app-developer">By ${app.developer}</p>
            <p class="app-description">${app.description}</p>
            <div class="app-meta">
                <span class="app-rating"><i class="fas fa-star"></i> ${app.rating}</span>
                <span class="app-size">${app.size}</span>
            </div>
            <a href="/download/${app.id}" class="download-btn" onclick="event.stopPropagation()">
                <i class="fas fa-download"></i> Download
            </a>
            <button class="search-by-name-btn" onclick="event.stopPropagation(); searchByName('${app.title}')">
                <i class="fas fa-search"></i> Search similar
            </button>
        </div>
    `;
    
    return appCard;
}

// Search by exact name
function searchByName(name) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = name;
    }
    renderApps('all', '', name);
}

// Filter Apps
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderApps(btn.dataset.filter);
    });
});

// Search functionality
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            renderApps('all', searchTerm);
        } else {
            renderApps();
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm) {
                renderApps('all', searchTerm);
            } else {
                renderApps();
            }
        }
    });
}

// Newsletter Form Submission
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input');
        const email = emailInput.value;
        const messageDiv = document.getElementById('subscription-message');
        
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${encodeURIComponent(email)}`
            });
            
            const result = await response.json();
            
            if (response.ok) {
                messageDiv.style.display = 'block';
                messageDiv.style.color = 'white';
                messageDiv.textContent = result.message;
                emailInput.value = '';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            } else {
                throw new Error(result.error || 'Failed to subscribe');
            }
        } catch (error) {
            messageDiv.style.display = 'block';
            messageDiv.style.color = '#ff6b6b';
            messageDiv.textContent = error.message;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    });
}

// Initial Render
if (document.getElementById('apps-container')) {
    renderApps();
}