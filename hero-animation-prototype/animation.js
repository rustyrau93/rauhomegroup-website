// Hero Animation - Scroll-Driven Wireframe Journey
// Rusty Rau Real Estate

gsap.registerPlugin(ScrollTrigger);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimation();
    initParticles();
    initProgressTrack();
});

function initScrollAnimation() {
    const scenes = document.querySelectorAll('.scene');
    const progressDots = document.querySelectorAll('.progress-dot');
    
    // Pin the hero animation while scrolling through spacer
    ScrollTrigger.create({
        trigger: '.hero-animation',
        start: 'top top',
        endTrigger: '.scroll-spacer',
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false
    });
    
    // Master timeline for scene transitions
    const masterTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.scroll-spacer',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
                updateProgressDots(self.progress);
            }
        }
    });
    
    // ===== SCENE 1: The Spark =====
    // Initial state - scene 1 visible
    gsap.set('.scene-1', { opacity: 1 });
    gsap.set('.scene-1 .stage-text', { opacity: 1 });
    
    // Animate thought bubble forming
    masterTL.fromTo('.scene-1 .thought-bubble', 
        { scale: 0, opacity: 0, transformOrigin: '60px -120px' },
        { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(1.7)' },
        0
    );
    
    // Lightbulb glow intensifies
    masterTL.fromTo('.scene-1 .lightbulb',
        { opacity: 0.3 },
        { opacity: 1, duration: 0.1 },
        0.05
    );
    
    // Fade out scene 1
    masterTL.to('.scene-1', 
        { opacity: 0, duration: 0.1 },
        0.2
    );
    
    // ===== SCENE 2: The Journey =====
    masterTL.to('.scene-2',
        { opacity: 1, duration: 0.1 },
        0.2
    );
    
    // Stage text fade in
    masterTL.to('.scene-2 .stage-text',
        { opacity: 1, duration: 0.1 },
        0.25
    );
    
    // For Sale sign animation
    masterTL.fromTo('.scene-2 .for-sale-sign',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.1, ease: 'power2.out' },
        0.22
    );
    
    // Documents fly in
    masterTL.fromTo('.scene-2 .doc-1',
        { x: 300, opacity: 0, rotation: -45 },
        { x: 0, opacity: 1, rotation: -15, duration: 0.15, ease: 'power2.out' },
        0.25
    );
    
    masterTL.fromTo('.scene-2 .doc-2',
        { x: 350, opacity: 0, rotation: 45 },
        { x: 0, opacity: 1, rotation: 10, duration: 0.15, ease: 'power2.out' },
        0.28
    );
    
    // Fade out scene 2
    masterTL.to('.scene-2',
        { opacity: 0, duration: 0.1 },
        0.45
    );
    
    // ===== SCENE 3: The Close =====
    masterTL.to('.scene-3',
        { opacity: 1, duration: 0.1 },
        0.45
    );
    
    // Stage text
    masterTL.to('.scene-3 .stage-text',
        { opacity: 1, duration: 0.1 },
        0.5
    );
    
    // Keys drop down
    masterTL.fromTo('.scene-3 .keys',
        { y: -100, opacity: 0, rotation: -30 },
        { y: 0, opacity: 1, rotation: 0, duration: 0.15, ease: 'bounce.out' },
        0.48
    );
    
    // Handshake forms
    masterTL.fromTo('.scene-3 .handshake',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.1, ease: 'power2.out' },
        0.52
    );
    
    // Confetti celebration
    const confetti = document.querySelectorAll('.confetti');
    confetti.forEach((particle, i) => {
        masterTL.to(particle,
            { 
                opacity: 1, 
                y: gsap.utils.random(-50, 50),
                x: gsap.utils.random(-30, 30),
                rotation: gsap.utils.random(-180, 180),
                duration: 0.15,
                ease: 'power2.out'
            },
            0.55 + (i * 0.02)
        );
    });
    
    // Fade out scene 3
    masterTL.to('.scene-3',
        { opacity: 0, duration: 0.1 },
        0.7
    );
    
    // ===== SCENE 4: Home Sweet Home =====
    masterTL.to('.scene-4',
        { opacity: 1, duration: 0.1 },
        0.7
    );
    
    // Stage text
    masterTL.to('.scene-4 .stage-text',
        { opacity: 1, duration: 0.1 },
        0.75
    );
    
    // Living room fades in with scale
    masterTL.fromTo('.scene-4 .living-room',
        { scale: 0.8, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.15, ease: 'power2.out' },
        0.72
    );
    
    // Person appears
    masterTL.fromTo('.scene-4 .person-relaxing',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
        0.78
    );
    
    // Home glow expands
    masterTL.fromTo('.scene-4 .home-glow',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 0.3, duration: 0.2, ease: 'power2.out' },
        0.8
    );
    
    // Final hold on scene 4
    masterTL.to('.scene-4',
        { opacity: 1, duration: 0.1 },
        0.95
    );
}

function initParticles() {
    // Add random movement to particles
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        // Random starting positions
        gsap.to(particle, {
            x: () => gsap.utils.random(-30, 30),
            y: () => gsap.utils.random(-40, 40),
            duration: gsap.utils.random(4, 8),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
}

function initProgressTrack() {
    const dots = document.querySelectorAll('.progress-dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Calculate scroll position for each scene
            const spacer = document.querySelector('.scroll-spacer');
            const spacerHeight = spacer.offsetHeight;
            const sceneProgress = index / 3; // 4 scenes, so divide by 3
            const scrollTarget = spacer.offsetTop + (spacerHeight * sceneProgress);
            
            window.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        });
    });
}

function updateProgressDots(progress) {
    const dots = document.querySelectorAll('.progress-dot');
    
    // Determine active scene based on progress
    let activeScene;
    if (progress < 0.25) activeScene = 0;
    else if (progress < 0.5) activeScene = 1;
    else if (progress < 0.75) activeScene = 2;
    else activeScene = 3;
    
    dots.forEach((dot, index) => {
        if (index === activeScene) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Bonus: Add subtle parallax to hero content
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '.hero-animation',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: -100,
    opacity: 0
});

// Add glow effect on scene transitions
function addGlowEffect(element, color = '#C9A869') {
    gsap.to(element, {
        filter: `drop-shadow(0 0 20px ${color})`,
        duration: 0.5,
        ease: 'power2.out'
    });
}
