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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching apps:', error);
        showError('Failed to load apps. Please try again later.');
        return [];
    }
}

// Render Apps
async function renderApps(filter = 'all', searchTerm = '', exactName = '') {
    const appsContainer = document.getElementById('apps-container');
    const featuredContainer = document.getElementById('featured-container');
    
    if (!appsContainer && !featuredContainer) return;
    
    try {
        const apps = await fetchApps(searchTerm, exactName);
        
        if (appsContainer) {
            appsContainer.innerHTML = apps.length ? '' : '<div class="no-results">No apps found matching your criteria.</div>';
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
    } catch (error) {
        console.error('Error rendering apps:', error);
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
            <img src="${app.image}" alt="${app.title}" loading="lazy">
        </div>
        <div class="app-content">
            <h3 class="app-title">${app.title}</h3>
            <p class="app-developer">By ${app.developer}</p>
            <p class="app-description">${app.description}</p>
            <div class="app-meta">
                <span class="app-rating"><i class="fas fa-star"></i> ${app.rating}</span>
                <span class="app-size">${app.size}</span>
            </div>
            <a href="${app.download_url}" class="download-btn" onclick="event.stopPropagation()" target="_blank" rel="noopener noreferrer">
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
        document.querySelector('.filter-btn.active')?.classList.remove('active');
        btn.classList.add('active');
        renderApps(btn.dataset.filter);
    });
});

// Search functionality
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            renderApps('all', searchTerm.toLowerCase());
        } else {
            renderApps();
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                renderApps('all', searchTerm.toLowerCase());
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
        const email = emailInput.value.trim();
        const messageDiv = document.getElementById('subscription-message');
        
        if (!email) {
            showMessage('Please enter your email address', 'error');
            return;
        }
        
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
                showMessage(result.message, 'success');
                emailInput.value = '';
            } else {
                throw new Error(result.error || 'Failed to subscribe');
            }
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('subscription-message');
    if (!messageDiv) return;
    
    messageDiv.style.display = 'block';
    messageDiv.style.color = type === 'error' ? 'var(--danger)' : 'white';
    messageDiv.textContent = message;
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

function showError(message) {
    const container = document.getElementById('apps-container') || 
                      document.getElementById('featured-container') ||
                      document.querySelector('.container');
    
    if (!container) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    container.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('apps-container')) {
        renderApps();
    }
});