// 🌟 Student Chatbot System - Main Controller
// Handles global navigation, theme, PWA, performance, and core functionality

class StudentChatbotApp {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.theme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }

    // 🚀 Core Initialization
    init() {
        this.initNavigation();
        this.initTheme();
        this.initPWA();
        this.initPerformance();
        this.initPageTransitions();
        this.initGlobalAnimations();
        this.setActiveNav();
        
        // Page-specific initialization
        this.initCurrentPage();
        
        console.log('🎓 Student Chatbot System Loaded Successfully!');
        console.log('📱 Current page:', this.currentPage);
    }

    // 📱 Navigation System
    initNavigation() {
        // Mobile hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });
            
            // Close menu on outside click
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        }

        // Smooth scrolling for all links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                // Close mobile menu
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });

        // Set active nav link based on current page
        this.setActiveNav();
    }

    setActiveNav() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === this.currentPage || 
                (this.currentPage.includes('chatbot') && href === 'chatbot.html')) {
                link.classList.add('active');
            }
        });
    }

    // 🎨 Theme Management (Dark/Light)
    initTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
        
        // Theme toggle (if exists)
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    // 📲 Progressive Web App (PWA)
    initPWA() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('PWA SW registered'))
                    .catch(err => console.log('PWA SW failed'));
            });
        }

        // Add to home screen prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.installPrompt = e;
        });
    }

    // ⚡ Performance Optimization
    initPerformance() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Preload critical resources
        if ('link' in document.head) {
            const preloadLinks = [
                '/css/chatbot.css',
                '/css/admin.css'
            ];
            
            preloadLinks.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                document.head.appendChild(link);
            });
        }

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition', 'none');
        }
    }

    // 🌈 Page Transitions
    initPageTransitions() {
        // Smooth page load animation
        document.body.classList.add('loaded');
        
        // Navbar scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;
            
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
                navbar.style.background = 'rgba(15, 15, 35, 0.95)';
                navbar.style.backdropFilter = 'blur(25px)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });

        // Floating elements
        this.initFloatingElements();
    }

    initFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-chat, .chat-btn');
        floatingElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-5px) scale(1.05)';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    // 🎬 Global Animations
    initGlobalAnimations() {
        // Intersection Observer for scroll animations
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe animated elements
        document.querySelectorAll('.animate-pop, .animate-slide-up, .feature-card, .stat-card').forEach(el => {
            animationObserver.observe(el);
        });

        // Staggered animation for grids
        document.querySelectorAll('.features-grid, .stats-grid').forEach(container => {
            const children = container.children;
            Array.from(children).forEach((child, index) => {
                child.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }

    // 📄 Page-specific Initialization
    initCurrentPage() {
        switch (this.currentPage) {
            case 'chatbot.html':
                // Delay chatbot init for smoother load
                setTimeout(() => {
                    if (typeof window.chatbot !== 'undefined') {
                        window.chatbot.init();
                    }
                }, 200);
                break;
                
            case 'admin.html':
                // Admin panel specific
                setTimeout(() => {
                    if (typeof window.admin !== 'undefined') {
                        window.admin.init();
                    }
                }, 300);
                break;
                
            case 'index.html':
                // Hero animations
                this.initHeroAnimations();
                break;
        }
    }

    initHeroAnimations() {
        // Hero title stagger
        const heroTitleSpans = document.querySelectorAll('.hero-title span');
        heroTitleSpans.forEach((span, index) => {
            span.style.opacity = '0';
            span.style.transform = 'translateY(30px)';
            setTimeout(() => {
                span.style.transition = 'all 0.8s ease';
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Chatbot illustration bounce
        const chatbotIllustration = document.querySelector('.chatbot-illustration');
        if (chatbotIllustration) {
            chatbotIllustration.animate([
                { transform: 'translateY(0) scale(1)' },
                { transform: 'translateY(-20px) scale(1.02)' },
                { transform: 'translateY(0) scale(1)' }
            ], {
                duration: 6000,
                iterations: Infinity,
                easing: 'ease-in-out'
            });
        }
    }

    // 📊 Analytics & Error Handling
    initAnalytics() {
        // Track page views
        if (window.gtag) {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: window.location.pathname
            });
        }

        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejection:', e.reason);
        });
    }

    // 🔄 Resize Handler
    handleResize() {
        this.isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', this.isMobile);
    }
}

// 🎵 Notification System
class NotificationManager {
    static show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Slide in animation
        requestAnimationFrame(() => notification.classList.add('show'));
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// 🔔 Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    window.app = new StudentChatbotApp();
    
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => window.app?.handleResize(), 250);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search (chatbot)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const chatbotLink = document.querySelector('a[href="chatbot.html"]');
            if (chatbotLink) chatbotLink.click();
        }
        
        // Escape to close menus
        if (e.key === 'Escape') {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger?.classList.contains('active')) {
                hamburger.click();
            }
        }
    });
    
    // Preload fonts for better performance
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&display=swap';
    fontPreload.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreload);
});
// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Page transition effect
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});

// 💾 Service Worker (Optional PWA)
if ('serviceWorker' in navigator) {
    const swCode = `
        const CACHE_NAME = 'student-chatbot-v1';
        const urlsToCache = [
            '/',
            '/index.html',
            '/chatbot.html',
            '/css/style.css',
            '/js/main.js'
        ];

        self.addEventListener('install', event => {
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then(cache => cache.addAll(urlsToCache))
            );
        });

        self.addEventListener('fetch', event => {
            event.respondWith(
                caches.match(event.request)
                    .then(response => response || fetch(event.request))
            );
        });
    `;
    
    // Register SW for offline support
    navigator.serviceWorker.register(URL.createObjectURL(new Blob([swCode], { type: 'application/javascript' })));
}

// Export utilities
window.NotificationManager = NotificationManager;
window.StudentChatbotApp = StudentChatbotApp;