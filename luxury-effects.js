/* ============================================
   LUXURY EFFECTS - Premium Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all effects
    initSmoothScroll();
    initCustomCursor();
    initParticleBackground();
    initRevealAnimations();
    initMagneticButtons();
    initParallax();
    initScrollProgress();
    initPageLoader();
    initTextSplitting();
    
    // Add grain overlay
    addGrainOverlay();
});

/* ============================================
   SMOOTH SCROLL (Lenis-style)
   ============================================ */

function initSmoothScroll() {
    // DISABLED - Rusty prefers native scroll (more responsive)
    // Lenis smooth scroll was causing sluggish feel
    return;
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */

function initCustomCursor() {
    // DISABLED - Rusty prefers standard cursor
    return;
}

/* ============================================
   PARTICLE BACKGROUND
   ============================================ */

function initParticleBackground() {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Resize canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;
            
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            const currentOpacity = this.opacity * (0.5 + Math.sin(this.pulse) * 0.5);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 168, 105, ${currentOpacity})`;
            ctx.fill();
        }
    }
    
    // Create particles (more at bottom of page for scroll effect)
    function createParticles() {
        const count = Math.min(150, Math.floor((canvas.width * canvas.height) / 15000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    createParticles();
    
    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(201, 168, 105, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    }
    animate();
    
    // Adjust particle density based on scroll
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollDirection = scrollY > lastScrollY ? 1 : -1;
        
        // Add slight movement burst on scroll
        particles.forEach(p => {
            p.speedY += scrollDirection * 0.01;
            // Dampen
            p.speedY *= 0.99;
        });
        
        lastScrollY = scrollY;
    });
}

/* ============================================
   REVEAL ANIMATIONS
   ============================================ */

function initRevealAnimations() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-title, .section-subtitle, .listing-card, .testimonial-card, ' +
        '.about-content, .contact-form, .stat, .badge-item, .area-card, ' +
        '.success-story, .resource-card, .faq-item, h2, h3'
    );
    
    revealElements.forEach(el => {
        if (!el.classList.contains('reveal') && 
            !el.classList.contains('reveal-left') && 
            !el.classList.contains('reveal-right')) {
            el.classList.add('reveal');
        }
    });
    
    // Add stagger reveal to grids
    const grids = document.querySelectorAll('.listings-grid, .areas-grid, .testimonials-slider, .instagram-grid');
    grids.forEach(grid => {
        grid.classList.add('stagger-reveal');
    });
    
    // Intersection Observer for reveals
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-reveal, .line-reveal').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Section in-view detection
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => sectionObserver.observe(section));
}

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.cta-button, .nav-cta');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle magnetic pull effect - just slight movement
            const pull = 0.15;
            btn.style.transform = `translate(${x * pull}px, ${y * pull}px) scale(1.02)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

/* ============================================
   PARALLAX EFFECT
   ============================================ */

function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-background img, .hero-image');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(el => {
            const speed = 0.3;
            const yPos = scrollY * speed;
            el.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.1)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/* ============================================
   PAGE LOADER
   ============================================ */

function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-logo">RUSTY RAU</div>';
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
            setTimeout(() => loader.remove(), 600);
        }, 500);
    });
}

/* ============================================
   GRAIN OVERLAY
   ============================================ */

function addGrainOverlay() {
    const grain = document.createElement('div');
    grain.className = 'grain-overlay';
    document.body.appendChild(grain);
}

/* ============================================
   TEXT SPLITTING FOR ANIMATION
   ============================================ */

function initTextSplitting() {
    const splitElements = document.querySelectorAll('.hero-title, .split-text');
    
    splitElements.forEach(el => {
        if (el.classList.contains('split-processed')) return;
        
        const text = el.textContent;
        let html = '';
        let delay = 0;
        
        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                html += ' ';
            } else {
                html += `<span class="char" style="transition-delay: ${delay}s">${text[i]}</span>`;
                delay += 0.03;
            }
        }
        
        // Only apply if element should be animated
        if (el.classList.contains('split-text')) {
            el.innerHTML = html;
            el.classList.add('split-processed');
        }
    });
}

/* ============================================
   IMAGE HOVER EFFECTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect classes to listing cards and images
    const imageContainers = document.querySelectorAll('.listing-card, .area-card, .instagram-item');
    
    imageContainers.forEach(container => {
        container.classList.add('image-hover-zoom');
        container.classList.add('image-hover-tint');
    });
});

/* ============================================
   ENHANCED STAT COUNTERS
   ============================================ */

function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Re-init counters
document.addEventListener('DOMContentLoaded', initCounters);

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add scrolled class for background
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Always visible - no hide on scroll
        navbar.style.transform = 'translateY(0)';
    });
});
