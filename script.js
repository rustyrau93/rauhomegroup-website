/* ============================================
   RUSTY RAU - SAN DIEGO REAL ESTATE
   JavaScript Interactions
   
   Optimized for:
   - Performance (debouncing, passive listeners)
   - Accessibility (keyboard nav, ARIA updates)
   - Progressive enhancement
   
   Last updated: 2026-02-06
   ============================================ */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    const isScrolledDark = navbar?.classList.contains('scrolled-dark');
    
    const handleScroll = debounce(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100 || isScrolledDark) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 10);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Trigger on load for inner pages
    if (isScrolledDark) {
        navbar?.classList.add('scrolled');
    }
    
    // ============================================
    // MOBILE MENU TOGGLE - Accessible
    // ============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            
            // Trap focus when menu is open
            if (isExpanded) {
                const firstLink = navLinks.querySelector('a');
                firstLink?.focus();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.focus();
            }
        });
        
        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // ============================================
    // DROPDOWN MENU - Keyboard Accessible
    // ============================================
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Keyboard support
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        });
    });
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Use smooth scroll if not preferring reduced motion
                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                });
                
                // Set focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });
    
    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for reveal animation
    const revealElements = document.querySelectorAll(
        '.reveal-left, .reveal-right, .reveal-up, ' +
        '.section-tag, .section-title, .about-image-container, .about-content, ' +
        '.area-card, .testimonial-card, .contact-info, .contact-form-container, ' +
        '.feature-card, .specialty-card, .service-card, .process-step, .blog-card, ' +
        '.listing-card, .stat-card, .story-card, .faq-item, .resource-card'
    );
    
    revealElements.forEach(el => {
        if (!el.classList.contains('reveal-left') && 
            !el.classList.contains('reveal-right') && 
            !el.classList.contains('reveal-up')) {
            el.classList.add('reveal-up');
        }
        revealObserver.observe(el);
    });
    
    // ============================================
    // FAQ ACCORDION - Accessible
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isExpanded = item.classList.contains('active');
            
            // Close other open items
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    const otherQuestion = other.querySelector('.faq-question');
                    const otherAnswer = other.querySelector('.faq-answer');
                    otherQuestion?.setAttribute('aria-expanded', 'false');
                    otherAnswer?.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isExpanded);
            answer.setAttribute('aria-hidden', isExpanded);
        });
        
        // Keyboard support
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
    
    // ============================================
    // MORTGAGE CALCULATOR
    // ============================================
    const calculator = document.getElementById('mortgage-calculator');
    
    if (calculator) {
        const homePrice = document.getElementById('home-price');
        const priceSlider = document.getElementById('price-slider');
        const downPayment = document.getElementById('down-payment');
        const downPercent = document.getElementById('down-percent');
        const interestRate = document.getElementById('interest-rate');
        const loanTerm = document.getElementById('loan-term');
        const taxRate = document.getElementById('tax-rate');
        const hoaFee = document.getElementById('hoa-fee');
        const monthlyPayment = document.getElementById('monthly-payment');
        const calcButton = document.getElementById('calc-button');
        
        function calculateMortgage() {
            const price = parseFloat(homePrice?.value) || 0;
            const principal = price - (parseFloat(downPayment?.value) || 0);
            const rate = (parseFloat(interestRate?.value) || 0) / 100 / 12;
            const payments = (parseFloat(loanTerm?.value) || 30) * 12;
            
            const annualTax = price * ((parseFloat(taxRate?.value) || 0) / 100);
            const monthlyTax = annualTax / 12;
            const monthlyHOA = parseFloat(hoaFee?.value) || 0;
            
            let mortgagePayment = 0;
            if (principal > 0 && rate > 0 && payments > 0) {
                const x = Math.pow(1 + rate, payments);
                mortgagePayment = (principal * x * rate) / (x - 1);
            } else if (principal > 0 && rate === 0) {
                mortgagePayment = principal / payments;
            }
            
            const total = mortgagePayment + monthlyTax + monthlyHOA;
            if (monthlyPayment) {
                monthlyPayment.textContent = '$' + Math.round(total).toLocaleString();
            }
        }
        
        if (priceSlider && homePrice) {
            priceSlider.addEventListener('input', () => {
                homePrice.value = priceSlider.value;
                updateDownPayment();
            });
        }
        
        homePrice?.addEventListener('input', () => {
            if (priceSlider) priceSlider.value = homePrice.value;
            updateDownPayment();
        });
        
        function updateDownPayment() {
            const price = parseFloat(homePrice?.value) || 0;
            const percent = parseFloat(downPercent?.value) || 0;
            if (downPayment) {
                downPayment.value = Math.round(price * (percent / 100));
            }
        }
        
        downPercent?.addEventListener('input', updateDownPayment);
        
        downPayment?.addEventListener('input', () => {
            const price = parseFloat(homePrice?.value) || 1;
            const down = parseFloat(downPayment?.value) || 0;
            if (downPercent) {
                downPercent.value = Math.round((down / price) * 100);
            }
        });
        
        calcButton?.addEventListener('click', calculateMortgage);
    }
    
    // ============================================
    // FORM HANDLING - Enhanced with feedback
    // ============================================
    const contactForms = document.querySelectorAll('.contact-form, .valuation-form, .signup-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"], .submit-button, .cta-button');
            if (!submitBtn) return;
            
            const originalText = submitBtn.textContent;
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            submitBtn.setAttribute('aria-busy', 'true');
            
            try {
                // Simulate API call (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success feedback
                submitBtn.textContent = 'Success!';
                submitBtn.style.background = '#10B981';
                form.reset();
                
                // Announce success to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'visually-hidden';
                announcement.textContent = 'Form submitted successfully!';
                form.appendChild(announcement);
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                    announcement.remove();
                }, 3000);
                
                console.log('Form submitted:', data);
                
            } catch (error) {
                console.error('Form submission error:', error);
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = '#EF4444';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                }, 3000);
            }
        });
    });
    
    // ============================================
    // LAZY LOADING IMAGES - Native + Fallback
    // ============================================
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for older browsers
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ============================================
    // TESTIMONIALS HOVER EFFECT
    // ============================================
    const testimonialCardsHover = document.querySelectorAll('.testimonial-card');
    
    testimonialCardsHover.forEach(card => {
        card.addEventListener('mouseenter', function() {
            testimonialCardsHover.forEach(c => c.style.opacity = '0.5');
            this.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            testimonialCardsHover.forEach(c => c.style.opacity = '1');
        });
        
        // Ensure keyboard focus works the same
        card.addEventListener('focusin', function() {
            testimonialCardsHover.forEach(c => c.style.opacity = '0.5');
            this.style.opacity = '1';
        });
        
        card.addEventListener('focusout', function() {
            testimonialCardsHover.forEach(c => c.style.opacity = '1');
        });
    });
    
    // ============================================
    // PHONE NUMBER FORMATTING
    // ============================================
    const phoneInputs = document.querySelectorAll('input[name="phone"], input[type="tel"]');
    
    phoneInputs.forEach(phoneInput => {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            
            if (value.length > 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length > 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length > 0) {
                value = `(${value}`;
            }
            
            e.target.value = value;
        });
    });
    
    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number[data-target], .stat-card-value');
    let statsAnimated = false;
    
    function animateCounter(el, target, duration = 2000) {
        if (prefersReducedMotion()) {
            el.textContent = Math.floor(target);
            return;
        }
        
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }
            el.textContent = Math.floor(current);
        }, 16);
    }
    
    function animateStats() {
        if (statsAnimated) return;
        
        statNumbers.forEach(stat => {
            const target = stat.dataset.target;
            if (target) {
                animateCounter(stat, parseFloat(target));
            }
        });
        
        statsAnimated = true;
    }
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(heroStats);
    }
    
});

// ============================================
// NEIGHBORHOODS SLIDER - Arrow Navigation
// ============================================
(function() {
    const slider = document.getElementById('neighborhoods-slider');
    if (!slider) return;
    
    const prevBtn = document.querySelector('.neighborhoods-nav .prev');
    const nextBtn = document.querySelector('.neighborhoods-nav .next');
    
    if (!prevBtn || !nextBtn) return;
    
    function getSlideWidth() {
        const slide = slider.querySelector('.neighborhood-slide');
        return slide ? slide.offsetWidth + 12 : 300;
    }
    
    prevBtn.addEventListener('click', () => {
        const scrollAmount = getSlideWidth() * 3;
        slider.scrollBy({ 
            left: -scrollAmount, 
            behavior: prefersReducedMotion() ? 'auto' : 'smooth' 
        });
    });
    
    nextBtn.addEventListener('click', () => {
        const scrollAmount = getSlideWidth() * 3;
        slider.scrollBy({ 
            left: scrollAmount, 
            behavior: prefersReducedMotion() ? 'auto' : 'smooth' 
        });
    });
    
    // Keyboard navigation
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
    
    // Helper function reference
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
})();

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================
(function() {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;
    
    const prevBtn = document.querySelector('.testimonials-nav .prev');
    const nextBtn = document.querySelector('.testimonials-nav .next');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!prevBtn || !nextBtn || cards.length === 0) return;
    
    let currentIndex = 0;
    const cardsPerView = getCardsPerView();
    const totalSlides = Math.ceil(cards.length / cardsPerView);
    
    function getCardsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }
    
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 16; // var(--spacing-md)
        const offset = -(currentIndex * cardsPerView * (cardWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - 1;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= totalSlides - 1 ? '0.5' : '1';
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentIndex = 0;
            updateCarousel();
        }, 250);
    }, { passive: true });
    
    // Initialize
    updateCarousel();
})();

// ============================================
// PAGE LOAD OPTIMIZATION
// ============================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Remove preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 500);
    }
});
