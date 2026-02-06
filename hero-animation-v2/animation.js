// Journey Animation - Three.js + GSAP
// Sophisticated 3D wireframe animation for Rusty Rau Real Estate

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init);

function init() {
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // SCENE SETUP
    // ============================================

    const canvas = document.getElementById('journey-canvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true, 
        alpha: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0f, 1);

    camera.position.z = 10;
    camera.position.y = 0;

    // Colors
    const GOLD = 0xC9A869;
    const GOLD_LIGHT = 0xE8D5A8;

    // ============================================
    // MATERIALS
    // ============================================

    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: GOLD,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });

    // ============================================
    // PARTICLE SYSTEM
    // ============================================

    function createParticles(count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: GOLD,
            size: 0.08,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        
        return new THREE.Points(geometry, material);
    }

    const particles = createParticles(500);
    scene.add(particles);

    // ============================================
    // SCENE OBJECTS
    // ============================================

    // Master group for all scenes
    const allScenes = new THREE.Group();
    scene.add(allScenes);

    // --- SCENE 1: The Spark ---
    const scene1 = new THREE.Group();
    scene1.visible = true;

    // Lightbulb
    const bulbGeo = new THREE.SphereGeometry(1, 16, 16);
    const bulb = new THREE.Mesh(bulbGeo, wireframeMaterial.clone());
    bulb.position.set(-3, 1, 0);
    scene1.add(bulb);

    // Bulb base
    const baseGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 12);
    const base = new THREE.Mesh(baseGeo, wireframeMaterial.clone());
    base.position.set(-3, -0.2, 0);
    scene1.add(base);

    // Light rays
    for (let i = 0; i < 8; i++) {
        const rayGeo = new THREE.BoxGeometry(0.08, 0.5, 0.08);
        const ray = new THREE.Mesh(rayGeo, wireframeMaterial.clone());
        const angle = (i / 8) * Math.PI * 2;
        ray.position.set(
            -3 + Math.cos(angle) * 1.8,
            1 + Math.sin(angle) * 0.3,
            Math.sin(angle) * 0.5
        );
        ray.rotation.z = angle;
        scene1.add(ray);
    }

    // Thought bubbles
    const bubbles = [
        { pos: [0, 0.5, 0], size: 0.2 },
        { pos: [0.8, 1, 0], size: 0.35 },
        { pos: [1.8, 1.8, 0], size: 0.5 }
    ];
    bubbles.forEach(b => {
        const bubble = new THREE.Mesh(
            new THREE.SphereGeometry(b.size, 12, 12),
            wireframeMaterial.clone()
        );
        bubble.position.set(...b.pos);
        scene1.add(bubble);
    });

    // Small house in thought
    const thoughtHouse = new THREE.Group();
    thoughtHouse.position.set(3, 2, 0);
    thoughtHouse.scale.setScalar(0.7);

    const houseBody = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.2, 1.2),
        wireframeMaterial.clone()
    );
    thoughtHouse.add(houseBody);

    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(1.4, 1, 4),
        wireframeMaterial.clone()
    );
    roof.position.y = 1.1;
    roof.rotation.y = Math.PI / 4;
    thoughtHouse.add(roof);

    scene1.add(thoughtHouse);
    allScenes.add(scene1);

    // --- SCENE 2: The Search ---
    const scene2 = new THREE.Group();
    scene2.visible = false;

    // Main house
    const mainHouse = new THREE.Group();

    const houseBase = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2.5, 2.5),
        wireframeMaterial.clone()
    );
    mainHouse.add(houseBase);

    const mainRoof = new THREE.Mesh(
        new THREE.ConeGeometry(3.2, 1.8, 4),
        wireframeMaterial.clone()
    );
    mainRoof.position.y = 2.1;
    mainRoof.rotation.y = Math.PI / 4;
    mainHouse.add(mainRoof);

    // Door
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 1.2, 0.1),
        wireframeMaterial.clone()
    );
    door.position.set(0, -0.6, 1.3);
    mainHouse.add(door);

    // Windows
    [[-1.2, 0.4], [1.2, 0.4]].forEach(([x, y]) => {
        const win = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.7, 0.1),
            wireframeMaterial.clone()
        );
        win.position.set(x, y, 1.3);
        mainHouse.add(win);
    });

    scene2.add(mainHouse);

    // For Sale sign
    const signPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2, 8),
        wireframeMaterial.clone()
    );
    signPost.position.set(-3.5, -0.5, 1);
    scene2.add(signPost);

    const sign = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.9, 0.08),
        wireframeMaterial.clone()
    );
    sign.position.set(-3.5, 0.8, 1);
    scene2.add(sign);

    // Floating documents
    const docs = [];
    for (let i = 0; i < 5; i++) {
        const doc = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.1, 0.03),
            wireframeMaterial.clone()
        );
        doc.position.set(
            4 + Math.random(),
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2
        );
        doc.rotation.set(
            Math.random() * 0.4 - 0.2,
            Math.random() * 0.4 - 0.2,
            Math.random() * 0.2 - 0.1
        );
        doc.userData.offset = Math.random() * Math.PI * 2;
        docs.push(doc);
        scene2.add(doc);
    }

    allScenes.add(scene2);

    // --- SCENE 3: The Keys ---
    const scene3 = new THREE.Group();
    scene3.visible = false;

    // Big key
    const keyGroup = new THREE.Group();
    keyGroup.position.set(0, 2, 0);

    const keyHead = new THREE.Mesh(
        new THREE.TorusGeometry(0.7, 0.15, 12, 24),
        wireframeMaterial.clone()
    );
    keyGroup.add(keyHead);

    const keyShaft = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 2, 0.12),
        wireframeMaterial.clone()
    );
    keyShaft.position.y = -1.4;
    keyGroup.add(keyShaft);

    // Key teeth
    [0, -0.3, -0.6].forEach((offset, i) => {
        const tooth = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.15, 0.12),
            wireframeMaterial.clone()
        );
        tooth.position.set(0.25, -1.8 + offset, 0);
        keyGroup.add(tooth);
    });

    scene3.add(keyGroup);

    // Hands for handshake
    const hand1 = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.4, 0.3),
        wireframeMaterial.clone()
    );
    hand1.position.set(-1.5, -1, 0);
    hand1.rotation.z = 0.25;
    scene3.add(hand1);

    const hand2 = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.4, 0.3),
        wireframeMaterial.clone()
    );
    hand2.position.set(1.5, -1, 0);
    hand2.rotation.z = -0.25;
    scene3.add(hand2);

    // Confetti
    const confetti = [];
    for (let i = 0; i < 40; i++) {
        const c = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 0.03),
            wireframeMaterial.clone()
        );
        c.position.set(
            (Math.random() - 0.5) * 8,
            5 + Math.random() * 3,
            (Math.random() - 0.5) * 4
        );
        c.material.opacity = 0;
        c.userData.vel = {
            x: (Math.random() - 0.5) * 0.06,
            y: -0.04 - Math.random() * 0.03,
            rotX: Math.random() * 0.15,
            rotZ: Math.random() * 0.15
        };
        confetti.push(c);
        scene3.add(c);
    }

    allScenes.add(scene3);

    // --- SCENE 4: Home ---
    const scene4 = new THREE.Group();
    scene4.visible = false;

    // Room outline
    const roomEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(12, 6, 8)),
        new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.2 })
    );
    scene4.add(roomEdges);

    // Couch
    const couch = new THREE.Group();
    couch.position.set(0, -1.5, 0);

    const couchBase = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1, 1.5),
        wireframeMaterial.clone()
    );
    couch.add(couchBase);

    const couchBack = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1.2, 0.4),
        wireframeMaterial.clone()
    );
    couchBack.position.set(0, 0.6, -0.55);
    couch.add(couchBack);

    // Armrests
    [-1.8, 1.8].forEach(x => {
        const arm = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.7, 1.5),
            wireframeMaterial.clone()
        );
        arm.position.set(x, 0.35, 0);
        couch.add(arm);
    });

    scene4.add(couch);

    // Person on couch
    const person = new THREE.Group();
    person.position.set(-0.5, -0.8, 0.3);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 12, 12),
        wireframeMaterial.clone()
    );
    head.position.y = 1;
    person.add(head);

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1, 0.5),
        wireframeMaterial.clone()
    );
    body.position.y = 0.2;
    person.add(body);

    scene4.add(person);

    // Coffee table
    const table = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.15, 1),
        wireframeMaterial.clone()
    );
    table.position.set(0, -2.2, 2);
    scene4.add(table);

    // Mug
    const mug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.12, 0.25, 12),
        wireframeMaterial.clone()
    );
    mug.position.set(0.4, -2, 2);
    scene4.add(mug);

    // Plant
    const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.3, 0.6, 12),
        wireframeMaterial.clone()
    );
    pot.position.set(4.5, -2.2, -2);
    scene4.add(pot);

    for (let i = 0; i < 5; i++) {
        const leaf = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.8, 8),
            wireframeMaterial.clone()
        );
        leaf.position.set(
            4.5 + (Math.random() - 0.5) * 0.4,
            -1.5 + Math.random() * 0.4,
            -2 + (Math.random() - 0.5) * 0.4
        );
        leaf.rotation.set(
            (Math.random() - 0.5) * 0.6,
            Math.random() * Math.PI * 2,
            (Math.random() - 0.5) * 0.4
        );
        scene4.add(leaf);
    }

    // Window
    const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3, 0.1),
        wireframeMaterial.clone()
    );
    windowFrame.position.set(-5.9, 0, 0);
    scene4.add(windowFrame);

    // Warm glow
    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(4, 16, 16),
        new THREE.MeshBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.04,
            side: THREE.BackSide
        })
    );
    scene4.add(glow);

    allScenes.add(scene4);

    // ============================================
    // ANIMATION STATE
    // ============================================

    let currentStage = 1;
    let time = 0;

    // ============================================
    // SCROLL TRIGGER
    // ============================================

    const progressIndicator = document.querySelector('.progress-indicator');
    const stageLabels = document.querySelectorAll('.stage-label');
    const progressDots = document.querySelectorAll('.progress-dot');
    const scrollHint = document.querySelector('.scroll-hint');

    ScrollTrigger.create({
        trigger: '.journey-section',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
            updateStage(self.progress);
        },
        onEnter: () => progressIndicator.classList.add('visible'),
        onLeave: () => progressIndicator.classList.remove('visible'),
        onEnterBack: () => progressIndicator.classList.add('visible'),
        onLeaveBack: () => progressIndicator.classList.remove('visible')
    });

    function updateStage(progress) {
        let newStage;
        if (progress < 0.25) newStage = 1;
        else if (progress < 0.5) newStage = 2;
        else if (progress < 0.75) newStage = 3;
        else newStage = 4;

        if (newStage !== currentStage) {
            currentStage = newStage;

            stageLabels.forEach(label => {
                label.classList.toggle('active', parseInt(label.dataset.stage) === currentStage);
            });

            progressDots.forEach(dot => {
                dot.classList.toggle('active', parseInt(dot.dataset.stage) === currentStage);
            });

            scene1.visible = currentStage === 1;
            scene2.visible = currentStage === 2;
            scene3.visible = currentStage === 3;
            scene4.visible = currentStage === 4;
        }

        if (scrollHint) {
            scrollHint.style.opacity = progress > 0.05 ? 0 : 0.6;
        }

        animateStage(progress);
    }

    function animateStage(progress) {
        const stageProgress = (progress % 0.25) / 0.25;

        switch (currentStage) {
            case 1:
                bulb.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
                thoughtHouse.scale.setScalar(0.4 + stageProgress * 0.4);
                thoughtHouse.rotation.y = stageProgress * Math.PI * 0.5;
                break;

            case 2:
                mainHouse.rotation.y = stageProgress * Math.PI * 0.25;
                docs.forEach((doc, i) => {
                    doc.position.y += Math.sin(time * 2 + doc.userData.offset) * 0.004;
                    doc.rotation.z = Math.sin(time + i) * 0.08;
                });
                break;

            case 3:
                keyGroup.position.y = 2 - stageProgress * 1.2;
                keyGroup.rotation.z = 0.2 - stageProgress * 0.2;

                if (stageProgress > 0.3) {
                    confetti.forEach(c => {
                        c.material.opacity = Math.min(0.9, (stageProgress - 0.3) * 3);
                        c.position.y += c.userData.vel.y;
                        c.position.x += c.userData.vel.x;
                        c.rotation.x += c.userData.vel.rotX;
                        c.rotation.z += c.userData.vel.rotZ;
                        if (c.position.y < -4) {
                            c.position.y = 6;
                            c.position.x = (Math.random() - 0.5) * 8;
                        }
                    });
                }

                hand1.position.x = -1.5 + stageProgress * 0.6;
                hand2.position.x = 1.5 - stageProgress * 0.6;
                break;

            case 4:
                glow.material.opacity = 0.03 + Math.sin(time) * 0.015;
                person.position.y = -0.8 + Math.sin(time * 0.6) * 0.03;
                break;
        }
    }

    // ============================================
    // RENDER LOOP
    // ============================================

    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        // Update particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + i) * 0.002;
            positions[i + 1] += Math.cos(time + i * 0.5) * 0.002;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Subtle camera movement
        camera.position.x = Math.sin(time * 0.2) * 0.5;
        camera.position.y = Math.cos(time * 0.15) * 0.3;
        camera.lookAt(0, 0, 0);

        // Gentle scene rotation
        allScenes.rotation.y = Math.sin(time * 0.25) * 0.06;

        renderer.render(scene, camera);
    }

    animate();

    // ============================================
    // RESIZE
    // ============================================

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ============================================
    // PROGRESS DOT CLICKS
    // ============================================

    progressDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const stage = parseInt(dot.dataset.stage);
            const journeySection = document.querySelector('.journey-section');
            const targetProgress = (stage - 1) * 0.25 + 0.125;
            const targetScroll = journeySection.offsetTop + (journeySection.offsetHeight * targetProgress);
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        });
    });

    console.log('Journey animation initialized successfully!');
}
