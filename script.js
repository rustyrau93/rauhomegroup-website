/* ============================================
   RUSTY RAU - SAN DIEGO REAL ESTATE
   JavaScript Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    // Check if navbar should be dark by default (inner pages)
    const isScrolledDark = navbar.classList.contains('scrolled-dark');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100 || isScrolledDark) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Trigger on load for inner pages
    if (isScrolledDark) {
        navbar.classList.add('scrolled');
    }
    
    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
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
    // TESTIMONIALS SLIDER
    // ============================================
    // Testimonials - Now using CSS Grid, no slider needed
    // Slider functionality disabled - showing all cards in grid layout
    const testimonialsTrack = document.querySelector('.testimonials-track');
    if (testimonialsTrack) {
        testimonialsTrack.style.transform = 'none'; // Ensure no transform
    }
    
    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
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
            const price = parseFloat(homePrice.value);
            const principal = price - parseFloat(downPayment.value);
            const rate = parseFloat(interestRate.value) / 100 / 12;
            const payments = parseFloat(loanTerm.value) * 12;
            
            // Calculate monthly taxes
            const annualTax = price * (parseFloat(taxRate.value) / 100);
            const monthlyTax = annualTax / 12;
            
            // Get HOA
            const monthlyHOA = parseFloat(hoaFee.value) || 0;
            
            let mortgagePayment = 0;
            if (principal > 0 && rate > 0 && payments > 0) {
                const x = Math.pow(1 + rate, payments);
                mortgagePayment = (principal * x * rate) / (x - 1);
            } else if (principal > 0 && rate === 0) {
                mortgagePayment = principal / payments;
            }
            
            // Total monthly payment = P&I + taxes + HOA
            const total = mortgagePayment + monthlyTax + monthlyHOA;
            monthlyPayment.textContent = '$' + Math.round(total).toLocaleString();
        }
        
        // Sync price slider with input (no auto-calculate)
        if (priceSlider) {
            priceSlider.addEventListener('input', () => {
                homePrice.value = priceSlider.value;
                updateDownPayment();
            });
        }
        
        // Sync home price input with slider (no auto-calculate)
        homePrice.addEventListener('input', () => {
            if (priceSlider) priceSlider.value = homePrice.value;
            updateDownPayment();
        });
        
        // Sync down payment and percentage
        function updateDownPayment() {
            const price = parseFloat(homePrice.value);
            const percent = parseFloat(downPercent.value);
            downPayment.value = Math.round(price * (percent / 100));
        }
        
        downPercent.addEventListener('input', () => {
            updateDownPayment();
        });
        
        downPayment.addEventListener('input', () => {
            const price = parseFloat(homePrice.value);
            const down = parseFloat(downPayment.value);
            downPercent.value = Math.round((down / price) * 100);
        });
        
        // Calculate button click handler
        if (calcButton) {
            calcButton.addEventListener('click', calculateMortgage);
        }
    }
    
    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    const contactForms = document.querySelectorAll('.contact-form, .valuation-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-button');
            const originalText = submitBtn.textContent;
            
            // Get form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                // TODO: Replace with actual form endpoint (Follow Up Boss webhook)
                // For now, we'll simulate a successful submission
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success feedback
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#10B981';
                form.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
                // Log form data for now (replace with actual API call)
                console.log('Form submitted:', data);
                
            } catch (error) {
                console.error('Form submission error:', error);
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = '#EF4444';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });
    
    // ============================================
    // NEWSLETTER FORM
    // ============================================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = newsletterForm.querySelector('.cta-button');
            const originalText = submitBtn.textContent;
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            try {
                // TODO: Replace with actual newsletter endpoint
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                submitBtn.textContent = 'Subscribed!';
                submitBtn.style.background = '#10B981';
                emailInput.value = '';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                submitBtn.textContent = 'Error';
                submitBtn.style.background = '#EF4444';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    
    // ============================================
    // RESOURCE DOWNLOADS (Lead Capture)
    // ============================================
    const resourceLinks = document.querySelectorAll('.resource-download');
    
    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const resourceType = this.dataset.resource;
            
            // Scroll to contact form
            const contactForm = document.querySelector('#contact');
            if (contactForm) {
                const headerOffset = 80;
                const elementPosition = contactForm.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Pre-fill form interest based on resource
                const interestSelect = document.querySelector('select[name="interest"]');
                if (interestSelect) {
                    if (resourceType === 'buyer-guide') {
                        interestSelect.value = 'buying';
                    } else if (resourceType === 'seller-checklist') {
                        interestSelect.value = 'selling';
                    }
                }
                
                // Add message about requested resource
                const messageField = document.querySelector('textarea[name="message"]');
                if (messageField) {
                    const resourceNames = {
                        'buyer-guide': 'First-Time Buyer\'s Guide',
                        'seller-checklist': 'Home Seller\'s Checklist',
                        'neighborhood-guide': 'San Diego Neighborhood Guide'
                    };
                    messageField.value = `I'd like to receive the ${resourceNames[resourceType] || 'free guide'}.`;
                }
            }
        });
    });
    
    // ============================================
    // PARALLAX EFFECT ON HERO - DISABLED
    // ============================================
    // Removed parallax effect - hero images now stay fixed
    // const heroImage = document.querySelector('.hero-image');
    // 
    // if (heroImage && window.innerWidth > 768) {
    //     window.addEventListener('scroll', () => {
    //         const scrolled = window.pageYOffset;
    //         heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    //     });
    // }
    
    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number[data-target], .stat-card-value');
    let statsAnimated = false;
    
    function animateCounter(el, target, duration = 2000) {
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
    
    // Trigger stats animation when stats section is visible
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
    // LISTING CARD HOVER EFFECTS
    // ============================================
    const listingCards = document.querySelectorAll('.listing-card');
    
    listingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.listing-overlay')?.classList.add('visible');
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.listing-overlay')?.classList.remove('visible');
        });
    });
    
    // ============================================
    // VIDEO PLAY BUTTON
    // ============================================
    const videoPlayBtn = document.querySelector('.video-play-btn');
    
    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', function() {
            // TODO: Implement video modal or embed
            // For now, scroll to contact
            const contact = document.querySelector('#contact');
            if (contact) {
                const headerOffset = 80;
                const elementPosition = contact.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // ============================================
    // LAZY LOADING IMAGES
    // ============================================
    if ('IntersectionObserver' in window) {
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
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ============================================
    // SCROLL PROGRESS INDICATOR (optional)
    // ============================================
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    
});

// ============================================
// PRELOADER (Optional)
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

// ============================================
// SMOOTH SCROLL POLYFILL
// ============================================
if (!('scrollBehavior' in document.documentElement.style)) {
    // Simple polyfill for browsers that don't support smooth scroll
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(options) {
        if (options && options.behavior === 'smooth') {
            const startY = window.pageYOffset;
            const endY = options.top;
            const duration = 500;
            const startTime = performance.now();
            
            function scroll() {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
                
                window.scrollTo(0, startY + (endY - startY) * easeProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(scroll);
                }
            }
            
            requestAnimationFrame(scroll);
        } else {
            originalScrollTo.apply(this, arguments);
        }
    };
}

// Neighborhoods Carousel
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('neighborhoods-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.querySelector('.neighborhoods-carousel .carousel-btn.prev');
    const nextBtn = document.querySelector('.neighborhoods-carousel .carousel-btn.next');
    
    if (!track) return;
    
    const cards = track.querySelectorAll('.neighborhood-card');
    let currentIndex = 0;
    let cardsPerView = 4;
    
    // Determine cards per view based on screen size
    function updateCardsPerView() {
        if (window.innerWidth <= 480) cardsPerView = 1;
        else if (window.innerWidth <= 768) cardsPerView = 2;
        else if (window.innerWidth <= 1024) cardsPerView = 3;
        else cardsPerView = 4;
        
        updateCarousel();
        createDots();
    }
    
    // Create dots
    function createDots() {
        const totalSlides = Math.ceil(cards.length / cardsPerView);
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === Math.floor(currentIndex / cardsPerView)) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i * cardsPerView));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update carousel position
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 16; // 16px gap
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.floor(currentIndex / cardsPerView));
        });
    }
    
    function goToSlide(index) {
        const maxIndex = cards.length - cardsPerView;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }
    
    function nextSlide() {
        goToSlide(currentIndex + cardsPerView);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - cardsPerView);
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Initialize
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    
    // Auto-rotate every 5 seconds
    setInterval(() => {
        if (currentIndex >= cards.length - cardsPerView) {
            goToSlide(0);
        } else {
            nextSlide();
        }
    }, 5000);
});

document.addEventListener('DOMContentLoaded', function() {
    if (!slider) return;
    
    let isDown = false;
    let isDragging = false;
    let startX;
    let scrollLeft;
    let velX = 0;
    let momentumID;
    
    // Prevent link clicks when dragging
    slider.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
            }
        });
    });
    
    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        slider.classList.add('dragging');
        startX = e.pageX;
        scrollLeft = slider.scrollLeft;
        cancelMomentum();
    });
    
    document.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            slider.classList.remove('dragging');
            beginMomentum();
            setTimeout(() => { isDragging = false; }, 10);
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX) * 1.5;
        
        if (Math.abs(walk) > 5) {
            isDragging = true;
        }
        
        velX = x - startX;
        startX = x;
        slider.scrollLeft = slider.scrollLeft - velX;
    });
    
    // Momentum scrolling
    function beginMomentum() {
        cancelMomentum();
        momentumID = requestAnimationFrame(momentumLoop);
    }
    
    function cancelMomentum() {
        cancelAnimationFrame(momentumID);
    }
    
    function momentumLoop() {
        slider.scrollLeft -= velX;
        velX *= 0.95;
        if (Math.abs(velX) > 0.5) {
            momentumID = requestAnimationFrame(momentumLoop);
        }
    }
    
    // Touch events for mobile
    let touchStartX;
    let touchVelX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        scrollLeft = slider.scrollLeft;
        cancelMomentum();
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        touchVelX = touchStartX - x;
        touchStartX = x;
        slider.scrollLeft += touchVelX;
    }, { passive: true });
    
    slider.addEventListener('touchend', () => {
        velX = -touchVelX;
        beginMomentum();
    }, { passive: true });
    
    // Navigation buttons
    const prevBtn = document.querySelector('.neighborhoods-nav .prev');
    const nextBtn = document.querySelector('.neighborhoods-nav .next');
    const slideWidth = slider.querySelector('.neighborhood-slide')?.offsetWidth + 12 || 400;
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -slideWidth * 2, behavior: 'smooth' });
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: slideWidth * 2, behavior: 'smooth' });
        });
    }
});

// Arrow-only navigation for Neighborhoods
(function() {
    const slider = document.getElementById('neighborhoods-slider');
    if (!slider) return;
    
    const prevBtn = document.querySelector('.neighborhoods-nav .prev');
    const nextBtn = document.querySelector('.neighborhoods-nav .next');
    
    if (!prevBtn || !nextBtn) return;
    
    // Get slide width dynamically
    function getSlideWidth() {
        const slide = slider.querySelector('.neighborhood-slide');
        return slide ? slide.offsetWidth + 12 : 300; // 12px is the gap
    }
    
    // Scroll by 3 slides at a time
    prevBtn.addEventListener('click', () => {
        const scrollAmount = getSlideWidth() * 3;
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        const scrollAmount = getSlideWidth() * 3;
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
})();
