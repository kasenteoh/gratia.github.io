/**
 * GRATIA WEBSITE JAVASCRIPT
 * Handles interactive functionality for the Gratia charity website
 */

/* ==========================================================================
   THEME MANAGEMENT MODULE
   ========================================================================== */

const ThemeManager = {
    // Theme constants
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },

    STORAGE_KEY: 'gratia-theme',

    // Theme elements
    elements: {
        body: null,
        sunIcon: null,
        moonIcon: null
    },

    /**
     * Initialize theme management
     */
    init() {
        this.cacheElements();
        this.loadSavedTheme();
    },

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        this.elements.body = document.body;
        this.elements.sunIcon = document.querySelector('.sun-icon');
        this.elements.moonIcon = document.querySelector('.moon-icon');
    },

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === this.THEMES.DARK ? this.THEMES.LIGHT : this.THEMES.DARK;
        this.setTheme(newTheme);
    },

    /**
     * Get current theme
     * @returns {string} Current theme
     */
    getCurrentTheme() {
        return this.elements.body.getAttribute('data-theme') || this.THEMES.LIGHT;
    },

    /**
     * Set theme and update UI
     * @param {string} theme - Theme to set
     */
    setTheme(theme) {
        this.elements.body.setAttribute('data-theme', theme);
        this.updateThemeIcons(theme);
        this.saveTheme(theme);
    },

    /**
     * Update theme toggle icons
     * @param {string} theme - Current theme
     */
    updateThemeIcons(theme) {
        if (!this.elements.sunIcon || !this.elements.moonIcon) return;

        if (theme === this.THEMES.DARK) {
            this.elements.sunIcon.style.display = 'none';
            this.elements.moonIcon.style.display = 'block';
        } else {
            this.elements.sunIcon.style.display = 'block';
            this.elements.moonIcon.style.display = 'none';
        }
    },

    /**
     * Save theme preference to localStorage
     * @param {string} theme - Theme to save
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(this.STORAGE_KEY, theme);
        } catch (error) {
            console.warn('Unable to save theme preference:', error);
        }
    },

    /**
     * Load saved theme from localStorage
     */
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem(this.STORAGE_KEY) || this.THEMES.LIGHT;
            this.setTheme(savedTheme);
        } catch (error) {
            console.warn('Unable to load theme preference:', error);
            this.setTheme(this.THEMES.LIGHT);
        }
    }
};

/* ==========================================================================
   NAVIGATION MODULE
   ========================================================================== */

const Navigation = {
    // Navigation elements
    elements: {
        sideMenu: null,
        header: null,
        menuToggleButtons: []
    },

    /**
     * Initialize navigation functionality
     */
    init() {
        this.cacheElements();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements.sideMenu = document.getElementById('sideMenu');
        this.elements.header = document.getElementById('header');
        this.elements.menuToggleButtons = document.querySelectorAll('.menu-toggle, .menu-close');
    },

    /**
     * Toggle side menu visibility
     */
    toggleMenu() {
        if (!this.elements.sideMenu) return;
        this.elements.sideMenu.classList.toggle('side-menu--open');
    },

    /**
     * Close side menu
     */
    closeMenu() {
        if (!this.elements.sideMenu) return;
        this.elements.sideMenu.classList.remove('side-menu--open');
    },

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close menu after navigation
                    this.closeMenu();
                }
            });
        });
    },

    /**
     * Setup scroll effects for header
     */
    setupScrollEffects() {
        if (!this.elements.header) return;

        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                this.elements.header.style.borderBottom = '1px solid var(--card-shadow)';
            } else {
                this.elements.header.style.borderBottom = 'none';
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }
};

/* ==========================================================================
   DONATION MODULE
   ========================================================================== */

const DonationManager = {
    // Donation elements
    elements: {
        modal: null,
        amountInput: null,
        amountButtons: []
    },

    /**
     * Initialize donation functionality
     */
    init() {
        this.cacheElements();
        this.setupAmountButtons();
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements.modal = document.getElementById('donationPage');
        this.elements.amountInput = document.getElementById('donationAmount');
        this.elements.amountButtons = document.querySelectorAll('.amount-btn');
    },

    /**
     * Show donation modal
     */
    show() {
        if (!this.elements.modal) return;
        
        this.elements.modal.classList.add('donation-modal--active');
        document.body.style.overflow = 'hidden';
        
        // Focus on amount input for better UX
        if (this.elements.amountInput) {
            setTimeout(() => this.elements.amountInput.focus(), 100);
        }
    },

    /**
     * Close donation modal
     */
    close() {
        if (!this.elements.modal) return;
        
        this.elements.modal.classList.remove('donation-modal--active');
        document.body.style.overflow = 'auto';
    },

    /**
     * Set donation amount
     * @param {number} amount - Amount to set
     */
    setAmount(amount) {
        if (!this.elements.amountInput || !amount) return;
        
        this.elements.amountInput.value = `$${amount}`;
        this.highlightAmountButton(amount);
    },

    /**
     * Highlight selected amount button
     * @param {number} amount - Selected amount
     */
    highlightAmountButton(amount) {
        this.elements.amountButtons.forEach(button => {
            button.classList.remove('amount-btn--active');
            if (button.textContent === `$${amount}`) {
                button.classList.add('amount-btn--active');
            }
        });
    },

    /**
     * Setup amount button functionality
     */
    setupAmountButtons() {
        this.elements.amountButtons.forEach(button => {
            button.addEventListener('click', () => {
                const amount = parseInt(button.textContent.replace('$', ''));
                this.setAmount(amount);
            });
        });
    }
};

/* ==========================================================================
   NEWSLETTER MODULE
   ========================================================================== */

const Newsletter = {
    /**
     * Handle newsletter subscription
     * @param {Event} event - Form submit event
     */
    subscribe(event) {
        event.preventDefault();
        
        const form = event.target;
        const emailInput = form.querySelector('input[type="email"]');
        
        if (!emailInput || !this.validateEmail(emailInput.value)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate API call
        this.showMessage('Thank you for subscribing to our newsletter!', 'success');
        form.reset();
    },

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} Is email valid
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Show user message
     * @param {string} message - Message to show
     * @param {string} type - Message type (success/error)
     */
    showMessage(message, type = 'info') {
        // Create and show a temporary message
        const messageEl = document.createElement('div');
        messageEl.className = `message message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 10000;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        `;
        
        document.body.appendChild(messageEl);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }
};

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

const Utils = {
    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* ==========================================================================
   EVENT HANDLERS
   ========================================================================== */

// Global event handlers for backward compatibility
window.toggleTheme = () => ThemeManager.toggle();
window.toggleMenu = () => Navigation.toggleMenu();
window.showDonationPage = () => DonationManager.show();
window.closeDonationPage = () => DonationManager.close();
window.setAmount = (amount) => DonationManager.setAmount(amount);
window.subscribeNewsletter = (event) => Newsletter.subscribe(event);

/* ==========================================================================
   APPLICATION INITIALIZATION
   ========================================================================== */

const App = {
    /**
     * Initialize the application
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initModules());
        } else {
            this.initModules();
        }
    },

    /**
     * Initialize all modules
     */
    initModules() {
        try {
            ThemeManager.init();
            Navigation.init();
            DonationManager.init();
            
            console.log('Gratia website initialized successfully');
        } catch (error) {
            console.error('Error initializing Gratia website:', error);
        }
    }
};

// Initialize the application
App.init();