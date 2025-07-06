// Portfolio Website JavaScript Module
class PortfolioManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.contactForm = document.getElementById('contact-form');
        this.formStatus = document.getElementById('form-status');
        this.submitButton = document.getElementById('submit-button');
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.fadeElements = document.querySelectorAll('.fade-in-section');
        
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupNavbarScroll();
        this.setupIntersectionObserver();
        this.setupFormHandler();
        this.setupLazyLoading();
        this.setupKeyboardNavigation();
        this.setupScrollProgress();
        this.setupSkillAnimations();
        this.setupPortfolioAnimations();
        this.setupThemeToggle();
        this.highlightActiveNavLink();
        
        // Initial setup
        document.addEventListener('DOMContentLoaded', () => {
            this.highlightActiveNavLink();
        });
        
        window.addEventListener('resize', () => {
            this.highlightActiveNavLink();
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (!targetElement) return;
                
                const navbarHeight = this.navbar.offsetHeight;
                const offsetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                if (!this.mobileMenu.classList.contains('hidden')) {
                    this.mobileMenu.classList.add('hidden');
                }
            });
        });
    }

    setupMobileMenu() {
        if (this.mobileMenuButton && this.mobileMenu) {
            this.mobileMenuButton.addEventListener('click', () => {
                this.mobileMenu.classList.toggle('hidden');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.mobileMenuButton.contains(e.target) && 
                    !this.mobileMenu.contains(e.target) && 
                    !this.mobileMenu.classList.contains('hidden')) {
                    this.mobileMenu.classList.add('hidden');
                }
            });
        }
    }

    setupNavbarScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('bg-white/30', 'shadow-xl', 'py-3');
                this.navbar.classList.remove('bg-white/20', 'shadow-lg', 'py-4');
            } else {
                this.navbar.classList.remove('bg-white/30', 'shadow-xl', 'py-3');
                this.navbar.classList.add('bg-white/20', 'shadow-lg', 'py-4');
            }
            this.highlightActiveNavLink();
        });
    }

    highlightActiveNavLink() {
        let currentActive = '';
        const navbarHeight = this.navbar.offsetHeight;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 1;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentActive = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('text-sky-300');
            link.classList.add('text-gray-200');
            if (link.getAttribute('href').includes(currentActive)) {
                link.classList.add('text-sky-300');
                link.classList.remove('text-gray-200');
            }
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupFormHandler() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
    }

    async handleFormSubmission() {
        const formData = new FormData(this.contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Validate form
        const validation = this.validateForm(data);
        if (!validation.isValid) {
            this.displayFormMessage(validation.message, 'error');
            return;
        }

        // Show loading state
        this.setFormLoading(true);

        try {
            // Simulate API call (replace with actual endpoint)
            await this.simulateFormSubmission(data);
            
            this.displayFormMessage('This is a demo form. In a real implementation, your message would be sent successfully!', 'success');
            this.contactForm.reset();
        } catch (error) {
            this.displayFormMessage('An error occurred. Please try again later.', 'error');
            console.error('Form submission error:', error);
        } finally {
            this.setFormLoading(false);
        }
    }

    validateForm(data) {
        const errors = [];

        // Clear previous error states
        this.clearFieldErrors();

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
            this.setFieldError('name');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
            this.setFieldError('email');
        }

        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
            this.setFieldError('message');
        }

        return {
            isValid: errors.length === 0,
            message: errors.join('. ')
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('form-field-error');
            field.classList.remove('form-field-success');
        }
    }

    clearFieldErrors() {
        const fields = ['name', 'email', 'message'];
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.classList.remove('form-field-error', 'form-field-success');
            }
        });
    }

    setFormLoading(isLoading) {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<span class="loading-spinner"></span>Sending...';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Send Message';
        }
    }

    displayFormMessage(message, type) {
        this.formStatus.classList.remove('hidden', 'text-red-400', 'text-green-400', 'text-yellow-400');
        
        if (type === 'error') {
            this.formStatus.classList.add('text-red-400');
        } else if (type === 'success') {
            this.formStatus.classList.add('text-green-400');
        } else {
            this.formStatus.classList.add('text-yellow-400');
        }
        
        this.formStatus.textContent = message;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.formStatus.classList.add('hidden');
            }, 5000);
        }
    }

    async simulateFormSubmission(data) {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', data);
                resolve();
            }, 2000);
        });
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-image');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                img.classList.add('lazy-image');
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation for portfolio cards
        const portfolioCards = document.querySelectorAll('.portfolio-card');
        portfolioCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const link = card.querySelector('.portfolio-card-overlay a');
                    if (link) {
                        link.click();
                    }
                }
            });
        });

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.mobileMenu.classList.contains('hidden')) {
                this.mobileMenu.classList.add('hidden');
            }
        });
    }

    setupScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    setupSkillAnimations() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(skillsSection);
    }

    animateSkills() {
        // Animate progress bars
        const progressBars = document.querySelectorAll('.progress-bar-animated');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * 200);
        });

        // Animate percentage numbers with count-up effect
        const percentages = document.querySelectorAll('.skill-percentage');
        percentages.forEach((percentage, index) => {
            setTimeout(() => {
                const targetValue = parseInt(percentage.getAttribute('data-percentage'));
                this.animateCountUp(percentage, 0, targetValue, 1500);
            }, index * 200);
        });
    }

    animateCountUp(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (range * progress));
            
            element.textContent = current + '%';
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    setupPortfolioAnimations() {
        const portfolioCards = document.querySelectorAll('.portfolio-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('portfolio-stagger');
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        portfolioCards.forEach(card => {
            observer.observe(card);
        });
    }

    setupThemeToggle() {
        // Initialize theme from localStorage or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);

        // Setup desktop theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Setup mobile theme toggle
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');
        if (themeToggleMobile) {
            themeToggleMobile.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a small vibration for mobile devices
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update toggle states
        const toggles = document.querySelectorAll('.theme-toggle');
        toggles.forEach(toggle => {
            toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        });

        // Animate theme transition
        document.body.style.transition = 'none';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 100);
    }
}

// Analytics and Performance Monitoring
class AnalyticsManager {
    constructor() {
        this.startTime = performance.now();
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.trackUserInteractions();
        this.trackFormSubmissions();
        this.trackScrollDepth();
    }

    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Track Core Web Vitals
            this.measureCoreWebVitals();
        });
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const po = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            po.observe({entryTypes: ['largest-contentful-paint']});
        }
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn-primary, .btn-secondary')) {
                console.log('Button clicked:', e.target.textContent);
            }
        });

        // Track navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                console.log('Navigation:', e.target.getAttribute('href'));
            }
        });
    }

    trackFormSubmissions() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', () => {
                console.log('Form submitted');
            });
        }
    }

    trackScrollDepth() {
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                if (maxScrollDepth % 25 === 0) {
                    console.log(`Scroll depth: ${maxScrollDepth}%`);
                }
            }
        });
    }
}

// Error Handling and Monitoring
class ErrorManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalErrorHandling();
        this.setupUnhandledRejectionHandling();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.logError({
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack
            });
        });
    }

    setupUnhandledRejectionHandling() {
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.logError({
                type: 'unhandledrejection',
                reason: e.reason
            });
        });
    }

    logError(error) {
        // In a real application, you would send this to your error tracking service
        console.log('Error logged:', error);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main portfolio functionality
    const portfolio = new PortfolioManager();
    
    // Initialize analytics (only in production)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const analytics = new AnalyticsManager();
    }
    
    // Initialize error handling
    const errorManager = new ErrorManager();
    
    console.log('Portfolio website initialized successfully');
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}