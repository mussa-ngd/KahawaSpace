/**
 * KAHAWA SPACE - CONSOLIDATED MAIN JAVASCRIPT
 * Include this file at the bottom of all HTML pages: <script src="main.js"></script>
 */

document.addEventListener('DOMContentLoaded', () => {
    initCommonFeatures();
    initPageSpecificFeatures();
});

// ==========================================
// 1. COMMON PLATFORM FEATURES (All Pages)
// ==========================================
function initCommonFeatures() {
    initMobileMenu();
    initNewsletter();
    initGlobalInteractions();
    checkExistingSession();
}

/**
 * Global helper to escape HTML and prevent XSS
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

/**
 * Global Notification System
 * Replaces alerts with a beautiful toast notification
 */
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.kahawa-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'kahawa-notification';

    const bgColor = type === 'success' ? '#2e7d32' : type === 'error' ? '#d32f2f' : 'var(--caramel-orange)';
    const color = type === 'info' ? 'var(--navy-dark)' : 'white';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${color};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 3000;
        animation: fadeInUp 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;

    notification.innerHTML = `<i class="fas ${icon}" style="font-size: 1.2rem;"></i> <span>${escapeHtml(message)}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinksElem = document.getElementById('navLinks');

    if (!mobileToggle || !navLinksElem) return;

    const isMobileViewport = () => window.innerWidth <= 768;

    mobileToggle.setAttribute('role', 'button');
    mobileToggle.setAttribute('tabindex', '0');
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileToggle.setAttribute('aria-controls', navLinksElem.id);

    const setMenuOpen = (isOpen) => {
        navLinksElem.classList.toggle('active', isOpen);
        mobileToggle.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);

        if (isMobileViewport() && !isOpen) {
            navLinksElem.setAttribute('inert', '');
        } else {
            navLinksElem.removeAttribute('inert');
        }

        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    };

    const checkViewport = () => {
        const isOpen = isMobileViewport() && navLinksElem.classList.contains('active');
        setMenuOpen(isOpen);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!navLinksElem.classList.contains('active'));
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    mobileToggle.addEventListener('click', toggleMenu);
    mobileToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu(e);
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', (e) => {
        if (navLinksElem.classList.contains('active') &&
            !navLinksElem.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinksElem.classList.contains('active')) {
            setMenuOpen(false);
        }
    });
}

/**
 * Global Newsletter Subscription Logic
 */
function initNewsletter() {
    const subBtn = document.getElementById('subscribeBtn');
    const emailInput = document.getElementById('newsletterEmail');
    const msgDiv = document.getElementById('subscribeMsg');

    if (subBtn && emailInput && msgDiv) {
        subBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (!email || !email.includes('@') || !email.includes('.')) {
                msgDiv.innerHTML = '<span style="color: var(--caramel-orange);">✉️ Please enter a valid email address.</span>';
                setTimeout(() => { if (msgDiv) msgDiv.innerHTML = ''; }, 2500);
                return;
            }

            msgDiv.innerHTML = '<span style="color: #4caf50;">✅ Thanks! You have been subscribed successfully.</span>';
            emailInput.value = '';

            setTimeout(() => { if (msgDiv) msgDiv.innerHTML = ''; }, 3000);
        });
    }
}

/**
 * Generic interactions for placeholder links and buttons
 */
function initGlobalInteractions() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    document.querySelector('.btn-login')?.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' || e.target.getAttribute('href') === '#') {
            e.preventDefault();
            window.location.href = 'login.html';
        }
    });

    document.querySelector('.btn-signup')?.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' || e.target.getAttribute('href') === '#') {
            e.preventDefault();
            window.location.href = 'signup.html';
        }
    });

    document.querySelectorAll('.footer-col ul li a').forEach(link => {
        const href = link.getAttribute('href');
        const comingSoonLabel = link.getAttribute('data-coming-soon');
        if (!href || href === '#' || comingSoonLabel) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const label = comingSoonLabel || link.textContent.trim();
                showNotification(`"${label}" page is coming soon!`, 'info');
            });
        }
    });

    document.querySelectorAll('.social-links a').forEach(link => {
        if (!link.href || link.getAttribute('href') === '#') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Opening Kahawa Space social channel...', 'info');
            });
        }
    });

    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Log out from Kahawa Space?')) {
                localStorage.removeItem('kahawa_session');
                sessionStorage.removeItem('kahawa_session');
                showNotification('Logged out successfully!', 'success');
                setTimeout(() => window.location.href = 'index.html', 1000);
            }
        });
    }
}

// Make globally available to inline scripts on specific pages
window.escapeHtml = escapeHtml;
window.showNotification = showNotification;
window.showGlobalNotification = showNotification;

/**
 * Toggles the filter sidebar on mobile devices
 */
window.toggleMobileFilters = function() {
    const sidebar = document.getElementById('filterSidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
};

// ==========================================
// 2. PAGE SPECIFIC INITIALIZATIONS
// ==========================================
function initPageSpecificFeatures() {
    if (document.querySelector('.dashboard-wrapper')) initBuyerDashboard();
    if (document.getElementById('contactForm')) initContactForm();
    if (document.getElementById('cookieBanner')) checkCookieConsent();
    if (document.getElementById('coursesGrid')) initEducationPage();
    if (document.getElementById('faqGrid')) initHelpPage();
    if (document.getElementById('searchInput') && document.querySelector('.hero')) initHomePage();
    if (document.getElementById('loginForm')) initLoginForm();
    if (document.getElementById('productGrid')) initMarketplace();
    if (document.getElementById('joinWaitlistBtn')) initNetworkPage();
    if (document.getElementById('newsMain')) initNewsPage();
    if (document.getElementById('contentViewTabs')) initContentViewToggle();
    if (document.getElementById('categoryScroll') && document.getElementById('reelsGrid')) initReelsPage();
    if (document.getElementById('resourcesGrid')) initResourcesPage();
    if (document.getElementById('blogGrid')) initBlogPage();
    if (document.getElementById('signupForm')) initSignupPage();
    if (document.getElementById('toursGrid')) initToursPage();
    if (document.querySelector('.dashboard-container')) initUserDashboard();
    if (document.getElementById('ordersList')) initUserOrders();
    if (document.getElementById('accountForm')) initUserSettings();
    if (document.querySelector('.dashboard-tabs')) initDashboardTabs();
}

// ==========================================
// 3. FEATURE SPECIFIC FUNCTIONS
// ==========================================

/* --- BUYER DASHBOARD --- */
function initBuyerDashboard() {
    document.querySelectorAll('.btn-sample').forEach(button => {
        button.addEventListener('click', () => {
            const title = button.closest('.lot-content').querySelector('h3').textContent;
            showGlobalNotification(`Sample request submitted for: ${title}. The cooperative will be notified.`, 'success');
        });
    });
}

/* --- CONTACT FORM --- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const alertDiv = document.getElementById('formAlert');

    function showAlert(m, t = 'error') {
        alertDiv.style.display = 'block';
        alertDiv.className = `alert alert-${t}`;
        alertDiv.innerHTML = `<i class="fas ${t === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${m}</span>`;
        setTimeout(() => alertDiv.style.display = 'none', 5000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        if (!email.includes('@')) {
            showAlert('Please enter a valid email address');
            return;
        }

        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        const btn = document.getElementById('submitBtn');

        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        btn.disabled = true;

        try {
            await new Promise(r => setTimeout(r, 1500));
            showAlert('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            form.reset();
        } catch (error) {
            showAlert('Failed to send message. Please try again.');
        } finally {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            btn.disabled = false;
        }
    });

    document.querySelectorAll('.faq-item').forEach(item => { 
        item.addEventListener('click', () => { item.classList.toggle('open'); }); 
    });
}

/* --- COOKIES --- */
function checkCookieConsent() {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
        document.getElementById('cookieBanner').classList.add('active');
    } else {
        applyCookiePreferences(JSON.parse(consent));
    }
}
window.acceptAllCookies = function() {
    const preferences = { essential: true, preference: true, analytics: true, marketing: true };
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    document.getElementById('cookieBanner').classList.remove('active');
    applyCookiePreferences(preferences);
    showGlobalNotification('Cookie preferences saved!', 'success');
};
window.openCookieSettings = function() {
    const prefCenter = document.querySelector('.preference-center');
    if(prefCenter) prefCenter.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('cookieBanner').classList.remove('active');
};
window.saveCookiePreferences = function() {
    const preferences = {
        essential: true,
        preference: document.getElementById('preferenceCookies').checked,
        analytics: document.getElementById('analyticsCookies').checked,
        marketing: document.getElementById('marketingCookies').checked
    };
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    applyCookiePreferences(preferences);
    showGlobalNotification('Cookie preferences saved!', 'success');
};
function applyCookiePreferences(preferences) {
    if (document.getElementById('preferenceCookies')) {
        document.getElementById('preferenceCookies').checked = preferences.preference;
        document.getElementById('analyticsCookies').checked = preferences.analytics;
        document.getElementById('marketingCookies').checked = preferences.marketing;
    }
}
window.showBrowserGuide = function(browser) {
    const guides = {
        chrome: 'https://support.google.com/chrome/answer/95647',
        firefox: 'https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences',
        safari: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac',
        edge: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-1b9a-1b1b5c1e1c1c'
    };
    window.open(guides[browser], '_blank');
};

/* --- EDUCATION --- */
function initEducationPage() {
    const popularCourses = [
        { level: 'Beginner', category: 'Barista Skills', title: 'Espresso Foundation', desc: 'Learn the fundamentals of espresso extraction, dialing in, and machine maintenance.', hours: 8, students: 1234, price: 149 },
        { level: 'Intermediate', category: 'Brewing', title: 'Pour-Over Mastery', desc: 'Master V60, Kalita, and Chemex. Understand extraction variables and brewing ratios.', hours: 6, students: 892, price: 129 },
        { level: 'Advanced', category: 'Roasting', title: 'Roasting Science', desc: 'Deep dive into roast profiles, bean chemistry, and developing your signature roast.', hours: 12, students: 567, price: 349 },
        { level: 'Professional', category: 'Business', title: 'Café Management', desc: 'From business plans to daily operations. Open and run a successful café.', hours: 15, students: 423, price: 399 },
        { level: 'Beginner', category: 'Sensory', title: 'Coffee Cupping 101', desc: 'Develop your palate, understand flavor profiles, and evaluate coffee like a pro.', hours: 5, students: 1876, price: 99 },
        { level: 'Intermediate', category: 'Latte Art', title: 'Advanced Latte Art', desc: 'Master hearts, tulips, rosettas, and learn advanced etching techniques.', hours: 4, students: 2145, price: 89 }
    ];

    const allCourses = [
        { id: 1, level: 'Beginner', category: 'Barista Skills', title: 'Espresso Foundation', desc: 'Learn the fundamentals of espresso extraction, dialing in, and machine maintenance.', hours: 8, students: 1234, price: 149, icon: 'mug-hot' },
        { id: 2, level: 'Intermediate', category: 'Brewing', title: 'Pour-Over Mastery', desc: 'Master V60, Kalita, and Chemex. Understand extraction variables and brewing ratios.', hours: 6, students: 892, price: 129, icon: 'filter' },
        { id: 3, level: 'Advanced', category: 'Roasting', title: 'Roasting Science', desc: 'Deep dive into roast profiles, bean chemistry, and developing your signature roast.', hours: 12, students: 567, price: 349, icon: 'fire' },
        { id: 4, level: 'Professional', category: 'Business', title: 'Café Management', desc: 'From business plans to daily operations. Open and scale a successful café.', hours: 15, students: 423, price: 399, icon: 'chart-line' },
        { id: 5, level: 'Beginner', category: 'Sensory', title: 'Coffee Cupping 101', desc: 'Develop your palate, understand flavor profiles, and evaluate coffee like a pro.', hours: 5, students: 1876, price: 99, icon: 'spoon' },
        { id: 6, level: 'Intermediate', category: 'Latte Art', title: 'Advanced Latte Art', desc: 'Master hearts, tulips, rosettas, and learn advanced etching techniques.', hours: 4, students: 2145, price: 89, icon: 'paint-brush' },
        { id: 7, level: 'Professional', category: 'Business', title: 'Green Coffee Buying', desc: 'Learn sourcing strategies, contracting, logistics, and quality control.', hours: 14, students: 312, price: 449, icon: 'ship' },
        { id: 8, level: 'Beginner', category: 'Roasting', title: 'Home Roasting Basics', desc: 'Start roasting at home. Learn about equipment, green defects, and first cracks.', hours: 4, students: 1105, price: 79, icon: 'home' },
        { id: 9, level: 'Advanced', category: 'Brewing', title: 'Water Chemistry for Coffee', desc: 'Analyze TDS, alkalinity, and craft custom water recipes for optimal extraction.', hours: 6, students: 512, price: 179, icon: 'flask' }
    ];

    const popularContainer = document.getElementById('coursesGrid');
    if (popularContainer) {
        popularContainer.innerHTML = popularCourses.map(c => `
        <div class="course-card">
            <div class="course-image"><span class="course-level">${c.level}</span></div>
            <div class="course-content">
                <div class="course-category">${c.category}</div>
                <div class="course-title">${escapeHtml(c.title)}</div>
                <div class="course-description">${escapeHtml(c.desc)}</div>
                <div class="course-meta">
                    <span><i class="far fa-clock"></i> ${c.hours} hours</span>
                    <span><i class="fas fa-users"></i> ${c.students.toLocaleString()} students</span>
                </div>
                <div class="course-price">
                    <span class="price">$${c.price}</span>
                    <button class="btn-enroll" onclick="enrollCourse('${escapeHtml(c.title)}')">Enroll</button>
                </div>
            </div>
        </div>
        `).join('');
    }

    let currentCourseCategory = 'all';

    window.renderCourses = function(coursesToRender) {
        const container = document.getElementById('allCoursesGrid');
        const countDisplay = document.getElementById('resultCount');
        if (!container || !countDisplay) return;

        if (coursesToRender.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:3rem; grid-column:1/-1; background: var(--navy-light); border-radius: var(--border-radius); border: 1px solid var(--navy-border);">
                    <i class="fas fa-search" style="font-size:3rem; color:var(--muted-white); margin-bottom:1rem;"></i>
                    <p style="color:var(--crisp-white); font-size:1.2rem;">No courses found</p>
                    <p style="color:var(--muted-white);">Try adjusting your filters.</p>
                </div>`;
            countDisplay.textContent = 'Showing 0 courses';
            return;
        }

        container.innerHTML = coursesToRender.map(c => `
            <div class="course-card">
                <div class="course-image" style="background: linear-gradient(135deg, var(--navy-dark), var(--navy-hover)); padding: 2rem; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; color: var(--caramel-orange); position: relative; min-height: 180px;">
                    <span class="course-level" style="position: absolute; top: 1rem; right: 1rem; box-shadow: var(--shadow-sm);">${c.level}</span>
                    <i class="fas fa-${c.icon}"></i>
                </div>
                <div class="course-content">
                    <div class="course-category" style="font-size: 0.75rem; font-weight: 700; color: var(--muted-white); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">${c.category}</div>
                    <div class="course-title">${escapeHtml(c.title)}</div>
                    <div class="course-description" style="color: var(--muted-white); font-size: 0.9rem; margin-bottom: 1rem; flex: 1;">${escapeHtml(c.desc)}</div>
                    <div class="course-meta">
                        <span><i class="far fa-clock"></i> ${c.hours} hours</span>
                        <span><i class="fas fa-users"></i> ${c.students.toLocaleString()} students</span>
                    </div>
                    <div class="course-price">
                        <span class="price">$${c.price}</span>
                        <button class="btn-enroll" onclick="enrollCourse('${escapeHtml(c.title)}')">Enroll</button>
                    </div>
                </div>
            </div>
        `).join('');

        countDisplay.textContent = `Showing ${coursesToRender.length} course${coursesToRender.length === 1 ? '' : 's'}`;
    };

    window.applyFilters = function() {
        let filtered = [...allCourses];

        if (currentCourseCategory !== 'all') {
            filtered = filtered.filter(course => course.category === currentCourseCategory);
        }

        const searchEl = document.getElementById('searchCourse');
        const searchKeyword = searchEl ? searchEl.value.toLowerCase().trim() : '';
        if (searchKeyword) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchKeyword) ||
                course.desc.toLowerCase().includes(searchKeyword) ||
                course.category.toLowerCase().includes(searchKeyword)
            );
        }

        const levelEl = document.getElementById('levelFilter');
        const level = levelEl ? levelEl.value : 'all';
        if (level !== 'all') filtered = filtered.filter(course => course.level === level);

        const minEl = document.getElementById('minPrice');
        const maxEl = document.getElementById('maxPrice');
        const minPrice = minEl && minEl.value ? parseFloat(minEl.value) : null;
        const maxPrice = maxEl && maxEl.value ? parseFloat(maxEl.value) : null;
        if (minPrice !== null && !Number.isNaN(minPrice)) {
            filtered = filtered.filter(course => course.price >= minPrice);
        }
        if (maxPrice !== null && !Number.isNaN(maxPrice)) {
            filtered = filtered.filter(course => course.price <= maxPrice);
        }

        const sortEl = document.getElementById('sortBy');
        const sortBy = sortEl ? sortEl.value : 'latest';
        if (sortBy === 'price_low') filtered.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price_high') filtered.sort((a, b) => b.price - a.price);
        else if (sortBy === 'hours') filtered.sort((a, b) => b.hours - a.hours);

        window.renderCourses(filtered);
    };

    window.enrollCourse = function(courseName) {
        window.showGlobalNotification(`🎓 Enrolling in "${courseName}". Redirecting to checkout...`, 'success');
    };

    document.querySelectorAll('#courseCategoryTabs .category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#courseCategoryTabs .category-tab').forEach(categoryTab => {
                categoryTab.classList.remove('active');
            });
            tab.classList.add('active');
            currentCourseCategory = tab.dataset.category;
            window.applyFilters();
        });
    });

    document.getElementById('searchCourse')?.addEventListener('keyup', window.applyFilters);
    document.getElementById('levelFilter')?.addEventListener('change', window.applyFilters);

    window.renderCourses(allCourses);

    const initialCategory = new URLSearchParams(window.location.search).get('category');
    if (initialCategory) {
        const targetTab = document.querySelector(`#courseCategoryTabs .category-tab[data-category="${initialCategory}"]`);
        if (targetTab) targetTab.click();
    }
}
window.previewCourse = function() { alert(`🎬 Course preview: Watch the first lesson free!\n\nThis course covers espresso fundamentals, milk texturing, and workflow optimization.`); };
window.browseAllCourses = function() { alert(`📚 Browse all courses\n\nFilter by skill level, category, or instructor to find your perfect learning path.`); };
window.selectPath = function(pathName) { alert(`🌟 ${pathName} selected!\n\nStart your journey with our curated curriculum designed to build expertise step by step.`); };
window.useResource = function(resourceName) { alert(`📖 Opening "${resourceName}"\n\nThis free resource is available to all Kahawa Space members. Sign in for full access.`); };
window.viewCertifications = function() { alert(`🎓 Certification Programs:\n\n• Professional Barista (SCA Certified)\n• Advanced Roasting Certificate\n• Coffee Business Management\n• Sensory & Quality Evaluation\n\nEarn globally recognized credentials.`); };

/* --- HELP / FAQ --- */
function initHelpPage() {
    const faqsData = [
        { category: "getting-started", question: "How do I create an account on Kahawa Space?", answer: "Click the 'Join' button in the top right corner. Choose your account type (Buyer, Seller, or Coffee Lover) and fill in your details. Sellers will need to complete verification with business documents." },
        { category: "getting-started", question: "What's the difference between Buyer, Seller, and Coffee Lover accounts?", answer: "Buyers can purchase coffee and equipment. Sellers can list products for sale. Coffee Lovers can explore content, take courses, and connect with the community. You can upgrade your account type later." },
        { category: "buying", question: "How do I purchase green coffee?", answer: "Browse listings in the Marketplace, filter by origin or processing method, and click 'Contact Seller' to negotiate pricing. Once agreed, you can complete the purchase through our secure payment system." },
        { category: "buying", question: "Can I request samples before buying?", answer: "Yes! Many sellers offer sample programs. You can request samples through the listing page or contact the seller directly to discuss sample options and pricing." },
        { category: "account", question: "How do I reset my password?", answer: "Click 'Log In' and select 'Forgot Password'. Enter your email address and we'll send you a link to reset your password. Follow the instructions in the email." },
        { category: "account", question: "How do I update my profile information?", answer: "Log in to your account, go to 'Profile' in the user menu. You can update your personal information, business details, and preferences there." },
        { category: "payments", question: "What payment methods are accepted?", answer: "We accept bank transfers, credit/debit cards, and offer escrow services for high-value transactions. All payments are processed securely through our platform." },
        { category: "payments", question: "When will I receive payment for my sales?", answer: "Payments are released to sellers once the buyer confirms receipt of goods or after the tracking shows delivery, depending on the transaction terms agreed upon." },
        { category: "shipping", question: "How does shipping work?", answer: "Sellers are responsible for shipping. Shipping costs and timelines are specified in each listing. You'll receive tracking information once your order ships." },
        { category: "shipping", question: "What about customs and import duties?", answer: "Import duties and customs fees are the buyer's responsibility. We recommend checking with your local customs office before placing international orders." }
    ];

    function renderFaqs(filterCategory = null) {
        const container = document.getElementById('faqGrid');
        if(!container) return;
        let filteredFaqs = faqsData;
        if (filterCategory && filterCategory !== 'all' && filterCategory !== 'getting-started1' && filterCategory !== 'getting-started2') {
            filteredFaqs = faqsData.filter(f => f.category === filterCategory);
        }
        container.innerHTML = filteredFaqs.slice(0, 6).map(faq => `
            <div class="faq-item" data-category="${faq.category}">
                <div class="faq-question">
                    <span>${escapeHtml(faq.question)}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer"><p>${escapeHtml(faq.answer)}</p></div>
            </div>
        `).join('');

        document.querySelectorAll('.faq-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target === item.querySelector('.faq-question') || e.target.closest('.faq-question') || !e.target.closest('.faq-answer')) {
                    item.classList.toggle('open');
                }
            });
        });
    }

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            renderFaqs(card.getAttribute('data-category'));
            document.querySelector('.faq-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                searchResults.classList.remove('active');
                renderFaqs();
                return;
            }
            const results = faqsData.filter(faq => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query));
            if (results.length > 0) {
                searchResults.classList.add('active');
                searchResults.innerHTML = results.map((faq, idx) => `
                    <div class="search-result-item" data-idx="${idx}">
                        <div style="font-weight: 600; color: var(--crisp-white);">${escapeHtml(faq.question)}</div>
                        <div style="color: var(--muted-white); font-size: 0.85rem; margin-top: 0.25rem;">${escapeHtml(faq.answer.substring(0, 100))}...</div>
                    </div>
                `).join('');

                document.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        renderFaqs();
                        searchResults.classList.remove('active');
                        searchInput.value = '';
                    });
                });
            } else {
                searchResults.classList.add('active');
                searchResults.innerHTML = '<div style="background: var(--navy-light); border-radius: 12px; padding: 1rem; text-align: center; color: var(--muted-white);">No results found. Try a different search term.</div>';
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }

    renderFaqs();
}
window.startLiveChat = function() { showGlobalNotification('Live chat support is coming soon! Email support@kahawaspace.com in the meantime.', 'info'); };

/* --- INDEX (HOME) PAGE --- */
function initHomePage() {
    window.exploreCategory = function(c) { showGlobalNotification(`Exploring ${c} category`, 'info'); };
    window.negotiatePrice = function(p) { showGlobalNotification(`Navigating to negotiation portal for ${p}`, 'success'); };
    window.readNews = function(t) { showGlobalNotification(`Loading article: "${t}"`, 'info'); };
    window.watchReel = function(t) { showGlobalNotification(`Playing reel: "${t}"`, 'info'); };
    window.viewTour = function(t) { showGlobalNotification(`Tour details for ${t} coming soon.`, 'info'); };

    window.performSearch = function() {
        const input = document.getElementById('searchInput');
        const s = input ? input.value.trim() : '';
        if (!s) {
            showGlobalNotification('Please enter a search term.', 'error');
            if (input) input.focus();
            return;
        }
        showGlobalNotification(`Searching for: "${s}"`, 'info');
        setTimeout(() => {
            window.location.href = `marketplace.html?search=${encodeURIComponent(s)}`;
        }, 600);
    };

    document.getElementById('searchBtn')?.addEventListener('click', window.performSearch);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.performSearch();
    });
}

/* --- LOGIN --- */
function checkExistingSession() {
    try {
        const session = localStorage.getItem('kahawa_session') || sessionStorage.getItem('kahawa_session');
        if (!session) return;
        const data = JSON.parse(session);
        const onAuthPage = window.location.pathname.includes('login.html') ||
                           window.location.pathname.includes('signup.html');
        if (data.expires && data.expires > new Date().getTime() && onAuthPage) {
            window.location.href = 'user.html';
        } else if (data.expires && data.expires <= new Date().getTime()) {
            localStorage.removeItem('kahawa_session');
            sessionStorage.removeItem('kahawa_session');
        }
    } catch (e) {
        localStorage.removeItem('kahawa_session');
        sessionStorage.removeItem('kahawa_session');
    }
}

function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    
    async function handleLogin(email, password, rememberMe) { 
        await new Promise(r => setTimeout(r, 1000)); 
        if (!password || password.length < 1) throw new Error('Password cannot be empty'); 
        const sessionData = { 
            user: { email: email, fullName: email.split('@')[0].replace(/[.]/g, ' ') }, 
            token: 'demo_token_' + Math.random().toString(36).substr(2, 32), 
            expires: new Date().getTime() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000) 
        }; 
        if (rememberMe) localStorage.setItem('kahawa_session', JSON.stringify(sessionData)); 
        else sessionStorage.setItem('kahawa_session', JSON.stringify(sessionData)); 
        return sessionData; 
    }
    
    loginForm.addEventListener('submit', async (e) => { 
        e.preventDefault(); 
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked; 
        
        if (!email || !password) { showGlobalNotification('Please fill in all fields', 'error'); return; } 
        if (!isValidEmail(email)) { showGlobalNotification('Please enter a valid email address', 'error'); return; } 
        
        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        const loginBtn = document.getElementById('loginBtn');
        
        btnText.style.display = 'none'; btnLoader.style.display = 'inline-block'; loginBtn.disabled = true; 
        try { 
            const session = await handleLogin(email, password, rememberMe); 
            showGlobalNotification(`Welcome back, ${session.user.fullName}! Redirecting...`, 'success'); 
            setTimeout(() => window.location.href = 'index.html', 1500); 
        } catch (error) { 
            showGlobalNotification(error.message || 'Login failed. Please try again.', 'error'); 
            btnText.style.display = 'inline'; btnLoader.style.display = 'none'; loginBtn.disabled = false; 
        } 
    });
    
    window.socialLogin = function(provider) { showGlobalNotification(`${provider} login coming soon! We're integrating this feature.`, 'info'); };
    document.getElementById('googleLoginBtn')?.addEventListener('click', () => socialLogin('Google'));
    document.getElementById('facebookLoginBtn')?.addEventListener('click', () => socialLogin('Facebook'));
}

/* --- MARKETPLACE --- */
/* --- MARKETPLACE --- */
let marketCurrentCategory = 'green';
let marketCurrentEquipmentSub = 'all';
let marketCurrentApparelSub = 'all';

function initMarketplace() {
    const marketProducts = {
        green: [
            { id: 1, name: 'Tanzania Peaberry AA Reserve', origin: 'Tanzania', process: 'Washed', grade: 'Specialty', price: 8.50, sca: 86, lot: 350, seller: 'Kilimanjaro Cooperative', verified: true, image: 'coffee-bean' },
            { id: 2, name: 'Ethiopia Yirgacheffe Natural G1', origin: 'Ethiopia', process: 'Natural', grade: 'Specialty', price: 9.20, sca: 88, lot: 500, seller: 'Yirgacheffe Farmers', verified: true, image: 'coffee-bean' },
            { id: 3, name: 'Brazil Yellow Bourbon', origin: 'Brazil', process: 'Pulped Natural', grade: 'Premium', price: 7.80, sca: 84, lot: 1200, seller: 'Minas Gerais Estate', verified: true, image: 'coffee-bean' },
            { id: 4, name: 'Kenya AA SL28 & SL34', origin: 'Kenya', process: 'Washed', grade: 'Micro-lot', price: 10.20, sca: 90, lot: 280, seller: 'Nyeri Hill Estate', verified: true, image: 'coffee-bean' }
        ],
        roasted: [
            { id: 101, name: 'Kilimanjaro Espresso Blend', roaster: 'Moshi Roasters', roast: 'Medium', price: 18.50, weight: '250g', verified: true, image: 'fire' },
            { id: 102, name: 'Ethiopia Sidama Natural', roaster: 'Addis Coffee', roast: 'Light', price: 22.00, weight: '250g', verified: true, image: 'fire' }
        ],
        equipment: [
            { id: 201, name: 'La Marzocco Linea PB 3-Group', brand: 'La Marzocco', type: 'Espresso Machine', subcategory: 'espresso-machines', condition: 'New', price: 21500, warranty: 3, verified: true, image: 'blender', seller: 'La Marzocco Commercial' },
            { id: 202, name: 'La Marzocco Linea Mini', brand: 'La Marzocco', type: 'Espresso Machine', subcategory: 'espresso-machines', condition: 'New', price: 5900, warranty: 2, verified: true, image: 'blender', seller: 'La Marzocco Home' },
            { id: 203, name: 'Fellow Ode Brew Grinder', brand: 'Fellow', type: 'Grinder', subcategory: 'grinders', condition: 'New', price: 349, warranty: 2, verified: true, image: 'cog', seller: 'Fellow Products' },
            { id: 204, name: 'Baratza Sette 270', brand: 'Baratza', type: 'Grinder', subcategory: 'grinders', condition: 'New', price: 449, warranty: 1, verified: true, image: 'cog', seller: 'Baratza' }
        ],
        apparel: [
            { id: 601, name: 'Kahawa Space Logo T-Shirt', brand: 'Kahawa Space', type: 'T-Shirt', subcategory: 't-shirts', size: 'M', color: 'Black', price: 29, condition: 'New', verified: true, image: 'tshirt', seller: 'Kahawa Space Merch' },
            { id: 602, name: 'Barista Canvas Apron', brand: 'Kahawa Space', type: 'Apron', subcategory: 'aprons', size: 'L', color: 'Brown', price: 49, condition: 'New', verified: true, image: 'tshirt', seller: 'Kahawa Space Merch' }
        ],
        books: [
            { id: 701, name: 'The World Atlas of Coffee', author: 'James Hoffmann', price: 35, format: 'Hardcover', verified: true, image: 'book' }
        ]
    };

    const marketSellers = [
        { name: 'Kilimanjaro Native Cooperative', location: 'Moshi, Tanzania', lots: 12, rating: 4.9, description: 'Direct from 2,500 smallholder farmers' },
        { name: 'Yirgacheffe Women Producers', location: 'Yirgacheffe, Ethiopia', lots: 8, rating: 5.0, description: 'Women-led cooperative' },
        { name: 'Nyeri Hill Estate', location: 'Nyeri, Kenya', lots: 15, rating: 4.8, description: 'Multi-generation farm' }
    ];

    // Keep filters and subcategories in sync with the selected category.
    function updateMarketplaceUIState(category) {
        const eqSub = document.getElementById('equipmentSubcategories');
        const appSub = document.getElementById('apparelSubcategories');
        const greenFilters = document.getElementById('greenFilters');
        const eqFilters = document.getElementById('equipmentFilters');
        const appFilters = document.getElementById('apparelFilters');
        const mainFilters = document.getElementById('mainFiltersSection');

        eqSub?.classList.remove('active');
        appSub?.classList.remove('active');
        greenFilters?.classList.remove('active');
        eqFilters?.classList.remove('active');
        appFilters?.classList.remove('active');

        if (category === 'green') {
            greenFilters?.classList.add('active');
            if (mainFilters) mainFilters.style.display = 'block';
        } else if (category === 'equipment') {
            eqSub?.classList.add('active');
            eqFilters?.classList.add('active');
            if (mainFilters) mainFilters.style.display = 'block';
        } else if (category === 'apparel') {
            appSub?.classList.add('active');
            appFilters?.classList.add('active');
            if (mainFilters) mainFilters.style.display = 'block';
        } else if (mainFilters) {
            mainFilters.style.display = 'none';
        }
    }

    window.renderMarketProducts = function() {
        let list = marketCurrentCategory === 'all'
            ? Object.values(marketProducts).reduce((products, categoryProducts) => products.concat(categoryProducts), [])
            : [...(marketProducts[marketCurrentCategory] || [])];

        if (marketCurrentCategory === 'equipment' && marketCurrentEquipmentSub !== 'all') {
            list = list.filter(product => product.subcategory === marketCurrentEquipmentSub);
        }
        if (marketCurrentCategory === 'apparel' && marketCurrentApparelSub !== 'all') {
            list = list.filter(product => product.subcategory === marketCurrentApparelSub);
        }

        if (marketCurrentCategory === 'green') {
            const origin = document.getElementById('originFilter')?.value;
            const process = document.getElementById('processFilter')?.value;
            const grade = document.getElementById('gradeFilter')?.value;
            if (origin && origin !== 'all') list = list.filter(product => product.origin === origin);
            if (process && process !== 'all') list = list.filter(product => product.process === process);
            if (grade && grade !== 'all') list = list.filter(product => product.grade === grade);
        }

        if (marketCurrentCategory === 'equipment') {
            const brand = document.getElementById('brandFilter')?.value;
            const condition = document.getElementById('conditionFilter')?.value;
            if (brand && brand !== 'all') list = list.filter(product => product.brand === brand);
            if (condition && condition !== 'all') list = list.filter(product => product.condition === condition);
        }

        if (marketCurrentCategory === 'apparel') {
            const size = document.getElementById('apparelSizeFilter')?.value;
            const color = document.getElementById('apparelColorFilter')?.value;
            if (size && size !== 'all') list = list.filter(product => product.size === size);
            if (color && color !== 'all') list = list.filter(product => product.color === color);
        }

        const minValue = document.getElementById('minPrice')?.value;
        const maxValue = document.getElementById('maxPrice')?.value;
        const minPrice = minValue ? Number.parseFloat(minValue) : null;
        const maxPrice = maxValue ? Number.parseFloat(maxValue) : null;
        if (minPrice !== null && Number.isFinite(minPrice)) list = list.filter(product => product.price >= minPrice);
        if (maxPrice !== null && Number.isFinite(maxPrice)) list = list.filter(product => product.price <= maxPrice);

        const searchQuery = new URLSearchParams(window.location.search).get('search') || '';
        const query = searchQuery.toLowerCase().trim();
        if (query) {
            list = list.filter(product =>
                [product.name, product.origin, product.brand, product.author, product.roaster, product.type]
                    .some(value => value && value.toLowerCase().includes(query))
            );
        }

        const sortBy = document.getElementById('sortBy')?.value;
        if (sortBy === 'price_low') list.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price_high') list.sort((a, b) => b.price - a.price);
        else if (sortBy === 'sca') list.sort((a, b) => (b.sca || 0) - (a.sca || 0));

        const container = document.getElementById('productGrid');
        const count = document.getElementById('resultCount');
        if (!container) return;

        if (list.length === 0) {
            container.innerHTML = `<div style="text-align:center;padding:3rem;grid-column:1/-1;">
                <i class="fas fa-coffee" style="font-size:3rem;color:#6f5c4d;"></i>
                <p style="margin-top:1rem;">No products found${query ? ` for "${escapeHtml(searchQuery)}"` : ''}.</p>
            </div>`;
            if (count) count.textContent = 'Showing 0 items';
            return;
        }

        container.innerHTML = list.map(product => {
            let metaText = '', priceUnit = '', badgeText = '';
            const category = product.subcategory
                ? (['t-shirts', 'barista-uniform', 'aprons', 'headwear', 'accessories'].includes(product.subcategory) ? 'apparel' : 'equipment')
                : marketCurrentCategory;

            if (category === 'green') {
                metaText = `${product.process} • ${product.grade} • SCA ${product.sca}`;
                priceUnit = '/kg FOB';
                badgeText = 'B2B';
            } else if (category === 'roasted') {
                metaText = `${product.roast} Roast • ${product.weight}`;
                priceUnit = `/${product.weight}`;
                badgeText = 'Roaster';
            } else if (category === 'equipment') {
                metaText = `${product.brand} • ${product.type}`;
                priceUnit = '/unit';
                badgeText = product.type;
            } else if (category === 'apparel') {
                metaText = `${product.brand} • ${product.type}`;
                priceUnit = '/item';
                badgeText = product.type;
            } else {
                metaText = `${product.author} • ${product.format}`;
                priceUnit = '/book';
                badgeText = 'Book';
            }

            const safeName = escapeHtml(product.name);
            const inlineName = safeName.replace(/'/g, "\\'");
            return `
                <div class="product-card">
                    <span class="product-badge">${escapeHtml(badgeText)}</span>
                    <div class="product-image">
                        <span class="product-origin-flag">${escapeHtml(product.origin || product.roaster || product.brand || product.author || 'KS')}</span>
                        <i class="fas fa-${escapeHtml(product.image)}"></i>
                    </div>
                    <div class="product-details">
                        <div class="product-seller">
                            <i class="fas fa-store"></i><span>${escapeHtml(product.seller || product.author || 'Kahawa Partner')}</span><i class="fas fa-check-circle seller-verified"></i>
                        </div>
                        <div class="product-title">${safeName}</div>
                        <div class="product-meta">${escapeHtml(metaText)}</div>
                        <div class="product-price">$${product.price.toLocaleString()}<small>${priceUnit}</small></div>
                        <div class="product-actions">
                            <button class="btn-primary" onclick="contactMarketSeller('${inlineName}')">${category === 'green' ? 'Contact Seller' : 'View Details'}</button>
                            <button class="btn-secondary" onclick="saveMarketItem('${inlineName}')"><i class="far fa-heart"></i></button>
                        </div>
                    </div>
                </div>`;
        }).join('');

        if (count) {
            count.textContent = `Showing ${list.length} item${list.length === 1 ? '' : 's'}${query ? ` for "${escapeHtml(searchQuery)}"` : ''}`;
        }
    };

    // 1. Wire up main category tabs
    document.querySelectorAll('#mainCategoryTabs .category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#mainCategoryTabs .category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            marketCurrentCategory = tab.dataset.category;
            marketCurrentEquipmentSub = 'all';
            marketCurrentApparelSub = 'all';
            document.querySelectorAll('#subcategoryTabs .subcategory-tab, #apparelSubcategoryTabs .subcategory-tab')
                .forEach(subcategoryTab => subcategoryTab.classList.toggle('active', subcategoryTab.dataset.subcategory === 'all'));
            updateMarketplaceUIState(marketCurrentCategory);
            window.renderMarketProducts();
        });
    });

    // 2. Wire up Equipment Subcategory Tabs
    document.querySelectorAll('#subcategoryTabs .subcategory-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#subcategoryTabs .subcategory-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            marketCurrentEquipmentSub = tab.dataset.subcategory;
            window.renderMarketProducts();
        });
    });

    // 2. Wire up Apparel Subcategory Tabs
    document.querySelectorAll('#apparelSubcategoryTabs .subcategory-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#apparelSubcategoryTabs .subcategory-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            marketCurrentApparelSub = tab.dataset.subcategory;
            window.renderMarketProducts();
        });
    });

    // Filter Apply Button Listener
    document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
        window.renderMarketProducts();
        showGlobalNotification('Filters applied successfully!', 'success');
    });
    document.getElementById('sortBy')?.addEventListener('change', window.renderMarketProducts);

    // Initial check for query parameters or default states
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search');
    if (initialSearch) {
        showGlobalNotification(`Showing search results for "${initialSearch}"`, 'info');
    }

    updateMarketplaceUIState(marketCurrentCategory);
    renderMarketProducts();
    
    const sellerGrid = document.getElementById('sellerGrid');
    if(sellerGrid) {
        sellerGrid.innerHTML = marketSellers.map(s => `
        <div class="seller-card">
            <div class="seller-avatar"><i class="fas fa-users"></i></div>
            <div class="seller-name">${escapeHtml(s.name)}</div>
            <div class="seller-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(s.location)}</div>
            <p>${escapeHtml(s.description)}</p>
            <button class="btn-primary" style="width:100%;" onclick="viewMarketSeller('${escapeHtml(s.name).replace(/'/g, "\\'")}')">View Profile</button>
        </div>`).join(''); 
    }
}

window.contactMarketSeller = function(p) { showGlobalNotification(`Contacting seller about "${p}"`, 'success'); };
window.saveMarketItem = function(p) { showGlobalNotification(`"${p}" saved to wishlist`, 'info'); };
window.viewMarketSeller = function(s) { showGlobalNotification(`Viewing profile of ${s}`, 'info'); };

/* --- NETWORK PAGE --- */
function initNetworkPage() {
    window.joinWaitlist = function() {
        const emailInput = document.getElementById('waitlistEmail');
        const messageDiv = document.getElementById('waitlistMessage');
        const email = emailInput.value.trim();

        if (!email || !email.includes('@')) {
            messageDiv.innerHTML = '<span style="color: #d32f2f;">Please enter a valid email address.</span>';
            setTimeout(() => { messageDiv.innerHTML = ''; }, 3000);
            return;
        }

        messageDiv.innerHTML = '<span style="color: #d4a373;">✓ Thanks! You\'ve been added to the waitlist.</span>';
        emailInput.value = '';
        setTimeout(() => { messageDiv.innerHTML = ''; }, 4000);
    };

    document.getElementById('joinWaitlistBtn')?.addEventListener('click', joinWaitlist);
    document.getElementById('waitlistEmail')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinWaitlist();
    });
}
window.showFeaturePreview = function(feature) {
    showGlobalNotification(`✨ ${feature} will be available when Kahawa Network launches.`, 'info');
};

/* --- NEWS PAGE --- */
function initContentViewToggle() {
    const tabs = document.getElementById('contentViewTabs');
    const newsView = document.getElementById('newsView');
    const blogView = document.getElementById('blogView');
    if (!tabs || !newsView || !blogView) return;

    tabs.querySelectorAll('.view-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.querySelectorAll('.view-tab').forEach(viewTab => viewTab.classList.remove('active'));
            tab.classList.add('active');

            const view = tab.dataset.view;
            newsView.style.display = view === 'blog' ? 'none' : '';
            blogView.style.display = view === 'news' ? 'none' : '';
        });
    });
}

function initNewsPage() {
    const articles = [
        { id: 1, title: 'Tanzania Harvest Report: Record Quality from Kilimanjaro', category: 'origin', date: 'March 5, 2026', excerpt: 'Early harvest samples show exceptional cup scores as farmers adopt new processing methods.', author: 'James Mwangi', location: 'Moshi, Tanzania', readTime: '5 min' },
        { id: 2, title: 'C-Market Analysis: Volatility and Opportunities', category: 'market', date: 'March 4, 2026', excerpt: 'Currency impacts and supply chain updates affecting green coffee prices this quarter.', author: 'Market Analyst', location: 'Global', readTime: '4 min' },
        { id: 3, title: 'New Fermentation Techniques Reshaping Specialty Coffee', category: 'innovation', date: 'March 3, 2026', excerpt: 'How producers in Colombia and Kenya are experimenting with controlled fermentation.', author: 'Maria Santos', location: 'Bogotá', readTime: '6 min' }
    ];

    let currentCategory = 'all';

    function getCategoryLabel(cat) {
        const map = { origin: 'Origin & Production', market: 'Market Intelligence', innovation: 'Innovation', competitions: 'Competitions', business: 'Business News' };
        return map[cat] || 'Coffee News';
    }

    function renderNews() {
        const filtered = currentCategory === 'all' ? articles : articles.filter(a => a.category === currentCategory);
        const container = document.getElementById('newsMain');
        if (!container) return;

        if (filtered.length === 0) {
            container.innerHTML = `<div class="featured-main" style="text-align:center; padding: 3rem;"><h3>No articles in this category</h3></div>`;
            return;
        }

        const featured = filtered[0];
        container.innerHTML = `
        <div class="featured-news">
            <div class="featured-main">
                <div class="featured-content">
                    <div class="news-date">${featured.date}</div>
                    <h2>${escapeHtml(featured.title)}</h2>
                    <p>${escapeHtml(featured.excerpt)}</p>
                    <a href="#" class="read-more" data-id="${featured.id}">Read Full Article →</a>
                </div>
            </div>
        </div>
        <div class="news-grid">
            ${filtered.slice(1).map(art => `
                <div class="news-card">
                    <div class="news-content">
                        <div class="news-date">${art.date}</div>
                        <h3>${escapeHtml(art.title)}</h3>
                        <a href="#" class="read-more" data-id="${art.id}">Read More →</a>
                    </div>
                </div>
            `).join('')}
        </div>`;

        document.querySelectorAll('.read-more').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showGlobalNotification('Full article preview coming soon.', 'info');
            });
        });
    }

    document.querySelectorAll('#newsFilterTabs .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#newsFilterTabs .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderNews();
        });
    });

    renderNews();
}

/* --- REELS PAGE --- */
function initReelsPage() {
    const categories = ['All Videos', 'Farmer Stories', 'Barista Skills', 'Equipment Reviews'];

    const videos = [
        { title: 'How to Cup Coffee Like a Pro', duration: '4:30', views: '8.2K', time: '2 days ago', creator: 'SCA', category: 'Barista Skills', icon: 'fa-mug-hot' },
        { title: 'La Marzocco Linea Mini Review', duration: '6:15', views: '15.3K', time: '5 days ago', creator: 'Espresso Lab', category: 'Equipment Reviews', icon: 'fa-microchip' },
        { title: 'Life on Kilimanjaro: A Farmer\'s Story', duration: '8:45', views: '12.5K', time: '1 week ago', creator: 'Kahawa Originals', category: 'Farmer Stories', icon: 'fa-mountain' },
        { title: 'Mastering Latte Art: Rosetta', duration: '5:20', views: '22.1K', time: '3 days ago', creator: 'Barista Weekly', category: 'Barista Skills', icon: 'fa-paint-brush' },
        { title: 'Yirgacheffe Processing Explained', duration: '7:10', views: '6.4K', time: '4 days ago', creator: 'Ethiopia Collective', category: 'Farmer Stories', icon: 'fa-leaf' },
        { title: 'Grinder Showdown: Niche vs DF64', duration: '9:05', views: '31.8K', time: '6 days ago', creator: 'Coffee Gear Lab', category: 'Equipment Reviews', icon: 'fa-cog' }
    ];

    const creators = [
        { name: 'Mama Esther', role: 'Farmer · Kilimanjaro', icon: 'fa-user' },
        { name: 'SCA', role: 'Education', icon: 'fa-graduation-cap' },
        { name: 'Espresso Lab', role: 'Equipment', icon: 'fa-microchip' },
        { name: 'Barista Weekly', role: 'Skills', icon: 'fa-mug-hot' },
        { name: 'Ethiopia Collective', role: 'Producers', icon: 'fa-seedling' },
        { name: 'Coffee Gear Lab', role: 'Reviews', icon: 'fa-cog' },
        { name: 'Kahawa Originals', role: 'Stories', icon: 'fa-mountain' },
        { name: 'Moshi Roasters', role: 'Roastery', icon: 'fa-fire' }
    ];

    let currentReelCategory = 'All Videos';

    // ---- Category pills ----
    function renderCategories() {
        const container = document.getElementById('categoryScroll');
        if (!container) return;
        container.innerHTML = categories.map(c =>
            `<button class="category-pill ${c === currentReelCategory ? 'active' : ''}" data-category="${c}">${c}</button>`
        ).join('');

        container.querySelectorAll('.category-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                currentReelCategory = btn.getAttribute('data-category');
                renderCategories();
                renderVideos();
            });
        });
    }

    // ---- Stories carousel ----
    function renderStories() {
        const container = document.getElementById('storiesCarousel');
        if (!container) return;
        container.innerHTML = creators.map(c => `
            <div class="story-card">
                <div class="story-avatar">
                    <div class="story-avatar-inner"><i class="fas ${escapeHtml(c.icon)}"></i></div>
                </div>
                <div class="story-name">${escapeHtml(c.name)}</div>
                <div class="story-role">${escapeHtml(c.role)}</div>
            </div>
        `).join('');

        container.querySelectorAll('.story-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                showGlobalNotification(`Opening ${creators[index].name}'s profile…`, 'info');
            });
        });
    }

    // ---- Video grid ----
    function renderVideos() {
        const container = document.getElementById('reelsGrid');
        if (!container) return;

        const filtered = currentReelCategory === 'All Videos'
            ? videos
            : videos.filter(v => v.category === currentReelCategory);

        if (filtered.length === 0) {
            container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted-white);padding:2rem;">No videos in this category yet.</p>`;
            return;
        }

        container.innerHTML = filtered.map(v => `
            <div class="reel-card" onclick="watchVideo('${escapeHtml(v.title).replace(/'/g, "\\'")}')">
                <div class="reel-thumbnail">
                    <i class="fas ${escapeHtml(v.icon)}"></i>
                    <span class="reel-duration">${escapeHtml(v.duration)}</span>
                </div>
                <div class="reel-info">
                    <div class="reel-title">${escapeHtml(v.title)}</div>
                    <div class="reel-meta">
                        <span><i class="fas fa-eye"></i> ${escapeHtml(v.views)}</span>
                        <span><i class="far fa-clock"></i> ${escapeHtml(v.time)}</span>
                    </div>
                    <div class="reel-creator">
                        <div class="creator-avatar"><i class="fas fa-user"></i></div>
                        <span>${escapeHtml(v.creator)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.playVideo = function(title) { showGlobalNotification(`🎬 Playing: "${title}"`, 'info'); };
    window.watchVideo = function(title) { showGlobalNotification(`🎥 Watching: "${title}"`, 'info'); };
    window.saveVideo = function() { showGlobalNotification(`📌 Video saved to playlist.`, 'success'); };
    window.loadMoreVideos = function() { showGlobalNotification(`📹 More coffee videos coming soon!`, 'info'); };
    window.uploadVideo = function() { showGlobalNotification(`📤 Video upload portal coming soon!`, 'info'); };

    renderCategories();
    renderStories();
    renderVideos();
}

/* --- RESOURCES PAGE --- */
function initResourcesPage() {
    const resources = [
        { id: 1, title: 'Coffee Profit Calculator', category: 'calculator', description: 'Calculate green coffee costs and roasting margins.', icon: 'fa-calculator', type: 'Interactive Tool' },
        { id: 2, title: 'Coffee Brewing Ratio Calculator', category: 'calculator', description: 'Calculate the perfect coffee-to-water ratio for any brew method.', icon: 'fa-balance-scale', type: 'Interactive Tool' },
        { id: 3, title: 'Green Coffee Pricing Guide', category: 'guide', description: 'Understand how green coffee is priced from farm to cup.', icon: 'fa-file-pdf', type: 'PDF Guide' },
        { id: 4, title: 'Roast Curve Analyzer', category: 'tool', description: 'Analyze your roast profiles and Rate of Rise (ROR).', icon: 'fa-chart-line', type: 'Web Tool' },
        { id: 5, title: 'Specialty Coffee Glossary', category: 'glossary', description: 'Comprehensive dictionary of common terms used in the coffee industry.', icon: 'fa-book', type: 'Reference' }
    ];

    const reports = [
        { id: 1, title: '2026 East Africa Harvest Report', date: 'July 2026', size: '2.4 MB' },
        { id: 2, title: 'Global Logistics & Shipping Trends', date: 'June 2026', size: '1.8 MB' },
        { id: 3, title: 'C-Market Volatility Analysis Q2', date: 'May 2026', size: '3.1 MB' }
    ];

    let currentResCategory = 'all';

    window.renderResources = function(searchQuery = '') {
        let filtered = currentResCategory === 'all' ? resources : resources.filter(r => r.category === currentResCategory);
        
        if(searchQuery) {
            filtered = filtered.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        const container = document.getElementById('resourcesGrid');
        if(container) {
            container.innerHTML = filtered.length ? filtered.map(r => `
            <div class="resource-card" onclick="openResource('${escapeHtml(r.title)}')">
                <div class="resource-meta">
                    <span class="resource-type">${r.type}</span>
                </div>
                <div class="resource-icon" style="margin: 1rem 0;"><i class="fas ${r.icon}"></i></div>
                <h3>${escapeHtml(r.title)}</h3>
                <p>${escapeHtml(r.description)}</p>
            </div>`).join('') : '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No resources found.</p>';
        }
    };

    window.renderReports = function() {
        const container = document.getElementById('reportsGrid');
        if(container) {
            container.innerHTML = reports.map(r => `
            <div class="report-card" style="background:var(--navy-light); border:1px solid var(--navy-border); padding:1.5rem; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div class="report-date"><i class="far fa-calendar-alt"></i> ${r.date}</div>
                    <h3 style="margin:0.5rem 0;">${escapeHtml(r.title)}</h3>
                    <span style="font-size:0.8rem; color:var(--muted-white);">${r.size} PDF</span>
                </div>
                <button class="download-btn" onclick="downloadReport('${escapeHtml(r.title)}')"><i class="fas fa-download"></i></button>
            </div>`).join('');
        }
    };

    window.filterByCategory = function(category) {
        currentResCategory = category;
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-category') === category) tab.classList.add('active');
        });
        document.getElementById('searchInput').value = '';
        renderResources();
    };

    window.searchResources = function() {
        const query = document.getElementById('searchInput').value.trim();
        renderResources(query);
    };

    window.closeResourceModal = function() {
        const modal = document.getElementById('resourceModal');
        if(modal) modal.classList.remove('active');
    };

    window.openResource = function(title) { 
        const modal = document.getElementById('resourceModal');
        const titleEl = document.getElementById('modalTitle');
        const bodyEl = document.getElementById('modalBody');

        if(!modal) {
            showGlobalNotification(`📚 Opening "${title}"`, 'info');
            return;
        }

        titleEl.textContent = title;
        modal.classList.add('active');

        if (title === 'Coffee Profit Calculator') {
            bodyEl.innerHTML = `
                <div class="calculator-form">
                    <p style="color:var(--muted-white); margin-bottom:1rem; font-size:0.9rem;">Estimate your roasting margins and retail pricing.</p>
                    <div class="form-row">
                        <div class="form-group"><label>Green Cost ($/kg)</label><input type="number" id="calcGreen" value="8.50" step="0.1"></div>
                        <div class="form-group"><label>Shipping ($/kg)</label><input type="number" id="calcShip" value="1.50" step="0.1"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Roast Shrinkage (%)</label><input type="number" id="calcShrink" value="15" step="1"></div>
                        <div class="form-group"><label>Packaging ($/bag)</label><input type="number" id="calcPack" value="1.20" step="0.1"></div>
                    </div>
                    <div class="form-group"><label>Bag Size (grams)</label><input type="number" id="calcSize" value="250" step="10"></div>
                    
                    <button class="btn-primary" onclick="executeProfitCalc()" style="width:100%; margin-top:1rem;">Calculate Costs</button>
                    
                    <div id="calcResults" class="calc-results fade-in"></div>
                </div>
            `;
        } else if (title === 'Coffee Brewing Ratio Calculator') {
             bodyEl.innerHTML = `
                <div class="calculator-form">
                    <p style="color:var(--muted-white); margin-bottom:1rem; font-size:0.9rem;">Dial in your perfect extraction.</p>
                    <div class="form-group">
                        <label>Coffee Dose (grams)</label>
                        <input type="number" id="calcDose" value="18" step="0.5">
                    </div>
                    <div class="form-group">
                        <label>Target Ratio (1:X)</label>
                        <input type="number" id="calcRatio" value="16" step="0.5" placeholder="e.g., 16 for a 1:16 ratio">
                    </div>
                    
                    <button class="btn-primary" onclick="executeRatioCalc()" style="width:100%; margin-top:1rem;">Calculate Yield</button>
                    
                    <div id="ratioResults" class="calc-results fade-in"></div>
                </div>
            `;
        } else {
            bodyEl.innerHTML = `
                <div style="text-align:center; padding: 3rem 1rem;">
                    <i class="fas fa-file-pdf" style="font-size:4rem; color:var(--caramel-orange); margin-bottom:1rem;"></i>
                    <p style="color:var(--muted-white); margin-bottom:1.5rem;">This resource is a downloadable document.</p>
                    <button class="btn-primary" onclick="downloadReport('${title}'); closeResourceModal();">Download File</button>
                </div>
            `;
        }
    };

    // Math logic for Calculators
    window.executeProfitCalc = function() {
        const green = parseFloat(document.getElementById('calcGreen').value) || 0;
        const ship = parseFloat(document.getElementById('calcShip').value) || 0;
        const shrink = parseFloat(document.getElementById('calcShrink').value) || 0;
        const pack = parseFloat(document.getElementById('calcPack').value) || 0;
        const size = parseFloat(document.getElementById('calcSize').value) || 0;

        const landedCost = green + ship;
        const roastedCostPerKg = landedCost / (1 - (shrink / 100));
        const bagCoffeeCost = roastedCostPerKg * (size / 1000);
        const totalCostPerBag = bagCoffeeCost + pack;
        const suggestedRetail = totalCostPerBag / 0.4; // Assuming standard 60% Margin

        const resultsDiv = document.getElementById('calcResults');
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <div class="calc-stat"><span>Landed Cost:</span> <strong>$${landedCost.toFixed(2)} /kg</strong></div>
            <div class="calc-stat"><span>Roasted Cost:</span> <strong>$${roastedCostPerKg.toFixed(2)} /kg</strong></div>
            <div class="calc-divider"></div>
            <div class="calc-stat"><span>Cost to Produce (${size}g):</span> <strong style="color:var(--caramel-orange)">$${totalCostPerBag.toFixed(2)} /bag</strong></div>
            <div class="calc-stat"><span>Suggested Retail (60% Margin):</span> <strong style="color:#4caf50">$${suggestedRetail.toFixed(2)}</strong></div>
        `;
    };

    window.executeRatioCalc = function() {
        const dose = parseFloat(document.getElementById('calcDose').value) || 0;
        const ratio = parseFloat(document.getElementById('calcRatio').value) || 0;
        
        const water = dose * ratio;
        const liquidYield = water - (dose * 2); // Coffee absorbs ~2x its weight in water
        
        const resultsDiv = document.getElementById('ratioResults');
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <div class="calc-stat"><span>Target Water Weight:</span> <strong style="color:var(--caramel-orange)">${water.toFixed(1)}g</strong></div>
            <div class="calc-stat"><span>Estimated Beverage Yield:</span> <strong>${liquidYield.toFixed(1)}g</strong></div>
        `;
    };

    window.downloadReport = function(title) { showGlobalNotification(`📥 Downloading "${title}"`, 'success'); };

    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => filterByCategory(tab.getAttribute('data-category')));
    });

    // Close modal if user clicks outside of it
    document.getElementById('resourceModal')?.addEventListener('click', function(e) {
        if(e.target === this) closeResourceModal();
    });

    renderResources();
    renderReports();
}

/* --- SIGNUP PAGE --- */
function initSignupPage() {
    const roleOptions = document.querySelectorAll('.role-option');
    const buyerFields = document.getElementById('buyerFields');
    const sellerFields = document.getElementById('sellerFields');
    const individualFields = document.getElementById('individualFields');
    const socialSection = document.getElementById('socialSignupSection');
    let selectedRole = 'buyer';

    if(roleOptions && buyerFields && sellerFields) {
        roleOptions.forEach(option => {
            option.addEventListener('click', () => {
                roleOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                selectedRole = option.dataset.role;

                buyerFields.classList.remove('show');
                sellerFields.classList.remove('show');
                individualFields.classList.remove('show');

                if (selectedRole === 'buyer') buyerFields.classList.add('show');
                else if (selectedRole === 'seller') sellerFields.classList.add('show');
                else if (selectedRole === 'individual') individualFields.classList.add('show');

                if (selectedRole === 'individual') socialSection.style.display = 'block';
                else socialSection.style.display = 'none';
            });
        });
    }

    window.socialSignup = function(provider) {
        showGlobalNotification(`Redirecting to ${provider} for secure signup...`, 'info');
    };

    document.getElementById('googleSignupBtn')?.addEventListener('click', () => socialSignup('Google'));
    document.getElementById('facebookSignupBtn')?.addEventListener('click', () => socialSignup('Facebook'));

    // Password strength
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if(passwordInput && strengthFill) {
        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            let strength = 0;
            if (val.length >= 8) strength++;
            if (/[a-z]/.test(val) && /[A-Z]/.test(val)) strength++;
            if (/\d/.test(val)) strength++;
            
            if (val.length === 0) { strengthFill.className = 'strength-meter-fill'; strengthText.textContent = ''; }
            else if (strength === 1) { strengthFill.className = 'strength-meter-fill weak'; strengthText.textContent = 'Weak'; }
            else if (strength === 2) { strengthFill.className = 'strength-meter-fill fair'; strengthText.textContent = 'Fair'; }
            else { strengthFill.className = 'strength-meter-fill strong'; strengthText.textContent = 'Strong'; }
        });
    }

    // Pass toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function () {
            const input = document.getElementById(this.getAttribute('data-target'));
            if (input) {
                if (input.type === 'password') { input.type = 'text'; this.classList.replace('fa-eye', 'fa-eye-slash'); }
                else { input.type = 'password'; this.classList.replace('fa-eye-slash', 'fa-eye'); }
            }
        });
    });

    const signupForm = document.getElementById('signupForm');
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) { showGlobalNotification('Passwords do not match', 'error'); return; }
        
        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        const signupBtn = document.getElementById('signupBtn');
        
        btnText.style.display = 'none'; btnLoader.style.display = 'inline-block'; signupBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showGlobalNotification('Account created successfully!', 'success');
            setTimeout(() => window.location.href = 'user.html', 1500);
        } catch (error) {
            showGlobalNotification('Signup failed. Please try again.', 'error');
            btnText.style.display = 'inline'; btnLoader.style.display = 'none'; signupBtn.disabled = false;
        }
    });
}

/* --- TOURS PAGE --- */
function initToursPage() {
    const tours = [
        { country: '🇹🇿 Tanzania', title: 'Kilimanjaro Coffee Trail', dates: 'Jun 15-22, 2026', days: 8, highlights: ['Farm visits', 'Cupping sessions'], desc: 'Visit cooperative farms on the slopes of Kilimanjaro.', price: 2850, spots: 8 },
        { country: '🇪🇹 Ethiopia', title: 'Origins of Coffee: Ethiopia', dates: 'Aug 5-14, 2026', days: 10, highlights: ['Yirgacheffe', 'Sidama'], desc: 'Trace coffee\'s heritage.', price: 3250, spots: 12 }
    ];

    window.renderTours = function(filteredTours = tours) {
        const container = document.getElementById('toursGrid');
        if (!container) return;

        if (filteredTours.length === 0) {
            container.innerHTML = `<div style="text-align:center;padding:3rem;"><p>No tours found matching your search.</p></div>`;
            return;
        }

        container.innerHTML = filteredTours.map(t => `
        <div class="destination-card">
            <div class="destination-content">
                <div class="destination-title">${escapeHtml(t.title)}</div>
                <div class="destination-meta"><span><i class="fas fa-calendar"></i> ${t.dates}</span></div>
                <p style="margin:1rem 0;">${escapeHtml(t.desc)}</p>
                <div class="destination-price">
                    <div><span class="price">$${t.price}<small>/person</small></span></div>
                </div>
                <button class="btn-tour" onclick="bookTour('${escapeHtml(t.title)}')">Book Now</button>
            </div>
        </div>
        `).join('');
    };

    window.searchTours = function() {
        const query = document.getElementById('searchTours').value.toLowerCase().trim();
        if (!query) { renderTours(tours); return; }
        const filtered = tours.filter(t => t.title.toLowerCase().includes(query) || t.country.toLowerCase().includes(query));
        renderTours(filtered);
    };

    window.viewItinerary = function() { showGlobalNotification('Full itinerary details coming soon!', 'info'); };
    window.checkDates = function() { showGlobalNotification('Available dates: June 15-22 | August 5-14', 'info'); };
    window.bookTour = function(tourName) { showGlobalNotification(`✨ Booking request for "${tourName}" sent!`, 'success'); };
    window.loadMoreTours = function() { showGlobalNotification('More tours for 2026-2027 coming soon!', 'info'); };

    renderTours();
}

/* --- USER DASHBOARD --- */
function initUserDashboard() {
    window.viewProduct = function(productName) {
        showGlobalNotification(`Viewing "${productName}" - Product details coming soon!`, 'info');
    };

    const viewAllLink = document.getElementById('viewAllOrdersLink');
    if (viewAllLink) {
        viewAllLink.addEventListener('click', (e) => {
            if (document.getElementById('orders-panel')) {
                e.preventDefault();
                window.switchDashTab('orders');
            } else {
                showGlobalNotification('View all orders - Full order history coming soon!', 'info');
            }
        });
    }
}

function initDashboardTabs() {
    const tabs = document.querySelectorAll('.dash-tab');
    const panels = document.querySelectorAll('.dash-panel');
    const validTabs = new Set(['overview', 'orders', 'settings']);

    function activate(name) {
        const panelId = `${name}-panel`;
        const panelIsChanging = !document.getElementById(panelId)?.classList.contains('active');

        tabs.forEach(tab => {
            const isActive = tab.dataset.tab === name;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });
        panels.forEach(panel => panel.classList.toggle('active', panel.id === panelId));
        document.querySelectorAll('.user-dropdown a').forEach(link => {
            link.classList.toggle('active', (link.getAttribute('href') || '').includes(`#${name}`));
        });

        if (panelIsChanging) window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.switchDashTab = function(name) {
        if (!validTabs.has(name)) return;
        if (window.location.hash !== `#${name}`) window.location.hash = name;
        activate(name);
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => window.switchDashTab(tab.dataset.tab));
    });

    function activateTabFromHash() {
        const name = window.location.hash.slice(1) || 'overview';
        if (validTabs.has(name)) activate(name);
    }

    window.addEventListener('hashchange', activateTabFromHash);
    activateTabFromHash();
}

/* --- USER ORDERS --- */
function initUserOrders() {
    let orders = [
        { id: 'KAH-24015', type: 'buying', date: '2026-03-15', status: 'shipped', total: 2975, items: [{ name: 'Tanzania Peaberry AA Reserve', quantity: 350, unitPrice: 8.50, total: 2975 }] },
        { id: 'KAH-24022', type: 'selling', date: '2026-03-05', status: 'pending', total: 2550, items: [{ name: 'Kenya AA SL28 & SL34', quantity: 250, unitPrice: 10.20, total: 2550 }] }
    ];

    let currentTab = 'all', currentStatus = 'all', currentDate = 'all', currentSearch = '';

    window.renderUserOrders = function() {
        const now = Date.now();
        let filtered = orders.filter(o => {
            if (currentTab !== 'all' && o.type !== currentTab) return false;
            if (currentStatus !== 'all' && o.status !== currentStatus) return false;
            if (currentDate !== 'all') {
                const cutoff = now - Number(currentDate) * 24 * 60 * 60 * 1000;
                const orderDate = new Date(o.date).getTime();
                if (Number.isNaN(orderDate) || orderDate < cutoff) return false;
            }
            if (currentSearch) {
                const searchableText = `${o.id} ${o.items.map(item => item.name).join(' ')}`.toLowerCase();
                if (!searchableText.includes(currentSearch)) return false;
            }
            return true;
        });

        const container = document.getElementById('ordersList');
        if (!container) return;

        if (filtered.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>No Orders Found</h3></div>`;
            return;
        }

        container.innerHTML = filtered.map(o => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info"><span class="order-id">Order #${o.id}</span></div>
                <div class="order-total">Total: $${o.total.toLocaleString()}</div>
            </div>
            <div class="order-body">
                <div class="order-actions">
                    <button class="btn-outline" onclick="viewOrderDetails('${o.id}')"><i class="fas fa-eye"></i> View Details</button>
                    ${o.status === 'pending' && o.type === 'selling' ? `<button class="btn-primary" onclick="confirmOrder('${o.id}')">Confirm</button>` : ''}
                </div>
            </div>
        </div>`).join('');
    };

    window.filterOrders = function() {
        currentStatus = document.getElementById('statusFilter')?.value || 'all';
        currentDate = document.getElementById('dateFilter')?.value || 'all';
        currentSearch = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
        renderUserOrders();
    };
    
    window.confirmOrder = function(id) {
        if (confirm('Confirm this order?')) {
            const order = orders.find(o => o.id === id);
            if (order) { order.status = 'confirmed'; showGlobalNotification('Order confirmed!', 'success'); renderUserOrders(); }
        }
    };
    
    window.viewOrderDetails = function(id) { showGlobalNotification(`Loading details for Order #${id}`, 'info'); };

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.type;
            renderUserOrders();
        });
    });

    document.getElementById('statusFilter')?.addEventListener('change', filterOrders);
    document.getElementById('dateFilter')?.addEventListener('change', filterOrders);
    document.getElementById('searchInput')?.addEventListener('input', filterOrders);
    renderUserOrders();
}

/* --- USER SETTINGS --- */
function initUserSettings() {
    const sections = {
        account: document.getElementById('account-section'),
        notifications: document.getElementById('notifications-section'),
        privacy: document.getElementById('privacy-section'),
        preferences: document.getElementById('preferences-section'),
        connected: document.getElementById('connected-section'),
        billing: document.getElementById('billing-section')
    };

    document.querySelectorAll('.settings-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            document.querySelectorAll('.settings-menu a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            Object.values(sections).forEach(s => { if(s) s.classList.remove('active'); });
            if (section && sections[section]) sections[section].classList.add('active');
        });
    });

    ['accountForm', 'notificationsForm', 'preferencesForm', 'billingForm'].forEach(formId => {
        document.getElementById(formId)?.addEventListener('submit', (e) => {
            e.preventDefault();
            showGlobalNotification('Settings updated successfully!', 'success');
        });
    });

    document.getElementById('privacyForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        if (newPass && newPass !== confirmPass) { showGlobalNotification('Passwords do not match!', 'error'); return; }
        showGlobalNotification('Security settings updated!', 'success');
    });

    window.deleteAccount = function() {
        if (confirm('Are you absolutely sure? This action cannot be undone.')) {
            showGlobalNotification('Account deletion request submitted.', 'info');
        }
    };

    window.connectGoogle = function() { showGlobalNotification('Google connection coming soon!', 'info'); };
    window.connectFacebook = function() { showGlobalNotification('Facebook connection coming soon!', 'info'); };
    window.connectApple = function() { showGlobalNotification('Apple ID connection coming soon!', 'info'); };
    window.connectLinkedIn = function() { showGlobalNotification('LinkedIn connection coming soon!', 'info'); };

    document.getElementById('deleteAccountBtn')?.addEventListener('click', deleteAccount);
}
/* --- BLOG PAGE --- */
function initBlogPage() {
    const blogPosts = [
        { id: 1, title: "Exploring the Terroir of Kilimanjaro Coffee", excerpt: "How altitude, soil, and microclimate shape the unique flavor profile of Tanzanian Peaberry.", category: "origin", author: "James Mwangi", authorRole: "Coffee Producer & Guide", date: "April 12, 2026", readTime: "6 min read", imageIcon: "fa-mountain", tags: ["Tanzania", "Terroir", "Peaberry"] },
        { id: 2, title: "The Rise of Natural Process in East Africa", excerpt: "Producers in Ethiopia and Kenya are embracing natural processing to create fruit-forward, complex coffees.", category: "innovation", author: "Maria Santos", authorRole: "Head of Coffee, Kahawa Space", date: "April 10, 2026", readTime: "5 min read", imageIcon: "fa-seedling", tags: ["Natural Process", "Ethiopia", "Kenya"] },
        { id: 3, title: "C-Market Volatility: What Roasters Need to Know", excerpt: "Currency fluctuations and supply chain disruptions are impacting green coffee prices. Here's how to navigate.", category: "market", author: "Market Intelligence Team", authorRole: "Kahawa Space Research", date: "April 8, 2026", readTime: "4 min read", imageIcon: "fa-chart-line", tags: ["C-Market", "Pricing", "Roasters"] },
        { id: 4, title: "From Seed to Cup: A Farmer's Story", excerpt: "Meet Mama Esther, a coffee farmer on the slopes of Kilimanjaro, and follow her journey through harvest.", category: "origin", author: "Kahawa Space Team", authorRole: "Editorial", date: "April 5, 2026", readTime: "8 min read", imageIcon: "fa-hand-holding-heart", tags: ["Farmer Story", "Kilimanjaro", "Sustainability"] },
        { id: 5, title: "Barista Tips: Mastering Milk Texturing", excerpt: "Learn the science behind silky microfoam and how to pour latte art like a champion.", category: "education", author: "Sarah Kimani", authorRole: "Barista Trainer", date: "April 3, 2026", readTime: "4 min read", imageIcon: "fa-mug-hot", tags: ["Barista", "Latte Art", "Milk"] },
        { id: 6, title: "Sustainability in Coffee: Beyond the Buzzword", excerpt: "What does 'sustainable coffee' really mean? We break down certifications, practices, and impact.", category: "innovation", author: "Dr. Anna Mwangi", authorRole: "Sustainability Advisor", date: "April 1, 2026", readTime: "7 min read", imageIcon: "fa-leaf", tags: ["Sustainability", "Certifications", "Ethics"] },
        { id: 7, title: "The World Barista Championship 2026 – Highlights", excerpt: "Recap of the most exciting moments from the global stage, including winning routines and signature drinks.", category: "competitions", author: "Events Team", authorRole: "Kahawa Space", date: "March 28, 2026", readTime: "5 min read", imageIcon: "fa-trophy", tags: ["Competition", "Barista", "WBC"] },
        { id: 8, title: "How to Build a Coffee Business from Scratch", excerpt: "Practical advice for aspiring café owners, roasters, and coffee entrepreneurs.", category: "business", author: "John Kariuki", authorRole: "Business Coach", date: "March 25, 2026", readTime: "6 min read", imageIcon: "fa-store", tags: ["Business", "Entrepreneurship", "Café"] },
        { id: 9, title: "The Art of Cupping: A Beginner's Guide", excerpt: "Learn how to taste coffee like a pro and develop your sensory skills.", category: "education", author: "James Mwangi", authorRole: "Q Grader", date: "March 22, 2026", readTime: "4 min read", imageIcon: "fa-spoon", tags: ["Cupping", "Sensory", "Tasting"] },
        { id: 10, title: "Direct Trade vs. Fair Trade: What's the Difference?", excerpt: "Understanding the nuances of coffee sourcing models and their impact on producers.", category: "market", author: "Maria Santos", authorRole: "Head of Coffee", date: "March 20, 2026", readTime: "5 min read", imageIcon: "fa-handshake", tags: ["Direct Trade", "Fair Trade", "Sourcing"] }
    ];

    let visibleCount = 6;
    const postsPerLoad = 3;

    window.renderBlogPosts = function(filteredPosts = null) {
        const container = document.getElementById('blogGrid');
        if (!container) return;

        const postsToRender = filteredPosts || blogPosts.slice(0, visibleCount);
        const totalPosts = filteredPosts ? filteredPosts.length : blogPosts.length;
        const hasMore = filteredPosts ? false : (visibleCount < totalPosts);

        if (postsToRender.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:4rem 1rem; grid-column:1/-1; background: var(--navy-light); border-radius: var(--border-radius); border: 1px solid var(--navy-border);">
                    <i class="fas fa-search" style="font-size:3rem; color:var(--muted-white); margin-bottom:1rem;"></i>
                    <h3 style="color:var(--crisp-white);">No posts found</h3>
                    <p style="color:var(--muted-white);">Try adjusting your filters or search terms.</p>
                </div>
            `;
            document.getElementById('loadMoreBlogBtn').style.display = 'none';
            document.getElementById('blogResultCount').textContent = 'Showing 0 posts';
            return;
        }

        container.innerHTML = postsToRender.map(post => `
            <div class="blog-card" data-id="${post.id}" onclick="openBlogPost(${post.id})">
                <div class="blog-image">
                    <i class="fas ${post.imageIcon}"></i>
                    <span class="blog-category-tag">${post.category}</span>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
                        <span><i class="far fa-clock"></i> ${post.readTime}</span>
                    </div>
                    <h3 class="blog-title">${window.escapeHtml(post.title)}</h3>
                    <p class="blog-excerpt">${window.escapeHtml(post.excerpt)}</p>
                    <div class="blog-footer">
                        <div class="blog-author">
                            <div class="blog-author-avatar"><i class="fas fa-user-circle"></i></div>
                            <div>
                                <strong>${window.escapeHtml(post.author)}</strong>
                                <span style="font-size:0.75rem; color:var(--muted-white); display:block;">${window.escapeHtml(post.authorRole)}</span>
                            </div>
                        </div>
                        <div class="blog-tags">
                            ${post.tags.map(tag => `<span class="blog-tag">#${window.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('blogResultCount').textContent = `Showing ${postsToRender.length} post${postsToRender.length > 1 ? 's' : ''}`;

        const loadBtn = document.getElementById('loadMoreBlogBtn');
        if (loadBtn) {
            if (filteredPosts) {
                loadBtn.style.display = 'none';
            } else if (hasMore) {
                loadBtn.style.display = 'inline-block';
                loadBtn.textContent = `Load More (${totalPosts - visibleCount} remaining)`;
            } else {
                loadBtn.style.display = 'none';
            }
        }
    };

    window.applyBlogFilters = function(category = 'all') {
        const searchTerm = document.getElementById('blogSearchInput').value.toLowerCase().trim();
        let filtered = [...blogPosts];

        if (category !== 'all') {
            filtered = filtered.filter(post => post.category === category);
        }

        if (searchTerm) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.excerpt.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                post.author.toLowerCase().includes(searchTerm)
            );
        }
        window.renderBlogPosts(filtered);
    };

    window.loadMorePosts = function() {
        visibleCount += postsPerLoad;
        window.renderBlogPosts();
    };

    window.openBlogPost = function(postId) {
        const post = blogPosts.find(p => p.id === postId);
        if (post) {
            window.showGlobalNotification(`📖 Opening: "${post.title}" – Full article coming soon!`, 'info');
        }
    };

    window.resetBlogFilters = function() {
        document.querySelectorAll('#blogFilterTabs .filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('#blogFilterTabs .filter-btn[data-category="all"]')?.classList.add('active');
        document.getElementById('blogSearchInput').value = '';
        visibleCount = 6;
        window.renderBlogPosts();
    };

    // Event Listeners
    document.querySelectorAll('#blogFilterTabs .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#blogFilterTabs .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            window.applyBlogFilters(this.dataset.category);
        });
    });

    document.getElementById('blogSearchInput')?.addEventListener('input', () => {
        const activeCategory = document.querySelector('#blogFilterTabs .filter-btn.active')?.dataset.category || 'all';
        window.applyBlogFilters(activeCategory);
    });

    document.getElementById('blogSearchBtn')?.addEventListener('click', () => {
        const activeCategory = document.querySelector('#blogFilterTabs .filter-btn.active')?.dataset.category || 'all';
        window.applyBlogFilters(activeCategory);
    });
    document.getElementById('resetBlogFiltersBtn')?.addEventListener('click', window.resetBlogFilters);
    document.getElementById('loadMoreBlogBtn')?.addEventListener('click', window.loadMorePosts);

    window.renderBlogPosts();
}