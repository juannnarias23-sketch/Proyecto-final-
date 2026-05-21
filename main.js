import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';

// ==========================================
// 1. ESCENA, CÁMARA Y NIEBLA
// ==========================================
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.06); 

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 7);

const canvas = document.querySelector('#canvas3d');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ==========================================
// 2. ILUMINACIÓN (Cian y Morado)
// ==========================================
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0x22d3ee, 2.5);
dirLight.position.set(5, 5, 4);
scene.add(dirLight);
const pointLight = new THREE.PointLight(0xa855f7, 5);
pointLight.position.set(-4, -2, 2);
scene.add(pointLight);

// ==========================================
// 3. FIGURA CENTRAL: NÚCLEO DIGITAL ORBITAL
// ==========================================
const coreGroup = new THREE.Group(); // Agrupamos el núcleo y los anillos

// El Núcleo Central (Icosaedro detallado)
const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
const coreMat = new THREE.MeshStandardMaterial({ 
    color: 0xa855f7, wireframe: true, emissive: 0x4B0082, emissiveIntensity: 0.8 
});
const coreMesh = new THREE.Mesh(coreGeo, coreMat);
coreGroup.add(coreMesh);

// Los Anillos Orbitales (Redes Sociales)
const ringMat = new THREE.MeshStandardMaterial({ 
    color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.6 
});

const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.02, 16, 100), ringMat);
ring1.rotation.x = Math.PI / 2;
coreGroup.add(ring1);

const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.05, 16, 100), ringMat);
ring2.rotation.y = Math.PI / 3;
coreGroup.add(ring2);

const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.02, 16, 100), ringMat);
ring3.rotation.y = -Math.PI / 3;
coreGroup.add(ring3);

scene.add(coreGroup);

// ==========================================
// 4. OCÉANO DIGITAL Y NODOS DE FONDO
// ==========================================
const planeGeo = new THREE.PlaneGeometry(60, 60, 40, 40);
const planeMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.15 
});
const oceanGrid = new THREE.Mesh(planeGeo, planeMat);
oceanGrid.rotation.x = -Math.PI / 2; 
oceanGrid.position.y = -3; 
scene.add(oceanGrid);

const bgShapesGroup = new THREE.Group();
const shapeGeo = new THREE.IcosahedronGeometry(0.15, 0); 
const shapeMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.4 });

for(let i = 0; i < 30; i++) {
    const shape = new THREE.Mesh(shapeGeo, shapeMat);
    shape.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * -15 - 5);
    shape.rotation.set(Math.random(), Math.random(), Math.random());
    bgShapesGroup.add(shape);
}
scene.add(bgShapesGroup);

const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 1200; 
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 30; }
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({ size: 0.025, color: 0x22d3ee, transparent: true, opacity: 0.6 });
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// ==========================================
// 5. ANIMACIONES GSAP (ScrollTrigger)
// ==========================================
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({ scrollTrigger: { trigger: "main", start: "top top", end: "bottom bottom", scrub: 1 } });
tl.to(coreGroup.position, { x: -2.5, y: -0.5, z: 0 }, 0)
  .to(coreGroup.rotation, { y: 2, x: 1 }, 0)
  .to(coreGroup.position, { x: 0, y: 1.5, z: -2 }, ">") 
  .to(coreGroup.rotation, { y: 4, x: 2 }, "<")
  .to(coreGroup.position, { x: 2, y: 0.5, z: 1 }, ">") 
  .to(coreGroup.position, { x: 0, y: -1, z: 0 }, ">") 
  .to(coreGroup.rotation, { y: 6.28, x: 3 }, "<");

gsap.from(".service-card", {
    scrollTrigger: { trigger: ".services-grid", start: "top 80%" },
    y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
});

// EFECTOS POR SECCIÓN
const sections = document.querySelectorAll('.scroll-section');

ScrollTrigger.create({
    trigger: sections[1], start: "top center",
    onEnter: () => { 
        coreMat.wireframe = false; 
        gsap.to(coreMat.color, { r: 0.13, g: 0.82, b: 0.93, duration: 0.5 }); 
        gsap.to(ringMat.color, { r: 0.66, g: 0.33, b: 0.96, duration: 0.5 }); 
    },
    onLeaveBack: () => { 
        coreMat.wireframe = true; 
        gsap.to(coreMat.color, { r: 0.66, g: 0.33, b: 0.96, duration: 0.5 }); 
        gsap.to(ringMat.color, { r: 0.13, g: 0.82, b: 0.93, duration: 0.5 }); 
    }
});

ScrollTrigger.create({
    trigger: sections[2], start: "top center",
    onEnter: () => { coreMat.wireframe = true; gsap.to(coreGroup.scale, { x: 1.5, y: 0.5, z: 1.5, duration: 1, ease: "elastic.out(1, 0.3)" }); },
    onLeaveBack: () => { coreMat.wireframe = false; gsap.to(coreGroup.scale, { x: 1, y: 1, z: 1, duration: 0.5 }); }
});

ScrollTrigger.create({
    trigger: sections[3], start: "top center",
    onEnter: () => { gsap.to(coreGroup.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 1 }); gsap.to(particlesMat.color, { r: 0.66, g: 0.33, b: 0.96, duration: 1 }); },
    onLeaveBack: () => { gsap.to(coreGroup.scale, { x: 1.5, y: 0.5, z: 1.5, duration: 1 }); gsap.to(particlesMat.color, { r: 0.13, g: 0.82, b: 0.93, duration: 1 }); }
});

let pulsoAnimacion;
ScrollTrigger.create({
    trigger: sections[4], start: "top center",
    onEnter: () => {
        coreMat.wireframe = false; gsap.to(coreMat.color, { r: 1, g: 1, b: 1, duration: 0.5 });
        pulsoAnimacion = gsap.to(coreGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.4, yoyo: true, repeat: -1 });
    },
    onLeaveBack: () => {
        if(pulsoAnimacion) pulsoAnimacion.kill(); 
        gsap.to(coreGroup.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.5 }); gsap.to(coreMat.color, { r: 0.66, g: 0.33, b: 0.96, duration: 0.5 }); 
    }
});

// ==========================================
// 6. UI Y CURSOR
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    const posX = event.clientX;
    const posY = event.clientY;
    cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });

    mouse.x = (posX / window.innerWidth) * 2 - 1;
    mouse.y = -(posY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    // Validamos colisión con cualquier parte del grupo orbital
    const intersects = raycaster.intersectObject(coreGroup, true);

    if (intersects.length > 0) {
        cursorOutline.style.width = '60px'; cursorOutline.style.height = '60px'; cursorOutline.style.borderColor = '#22d3ee';
    } else {
        cursorOutline.style.width = '40px'; cursorOutline.style.height = '40px'; cursorOutline.style.borderColor = '#a855f7';
    }
});

// ==========================================
// 7. BUCLE DE RENDERIZADO CON MATEMÁTICAS APLICADAS
// ==========================================
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();

    // Modelo matemático para un movimiento orgánico de UX (Efecto de respiración)
    coreMesh.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.05);
    
    // Rotaciones independientes para simular fricción y órbitas naturales
    coreMesh.rotation.y += 0.002;
    ring1.rotation.x += 0.005;
    ring1.rotation.y += 0.002;
    ring2.rotation.y -= 0.003;
    ring2.rotation.z += 0.004;
    ring3.rotation.x -= 0.002;
    ring3.rotation.z -= 0.005;
    
    // Rotación del entorno
    particlesMesh.rotation.y += 0.0008;
    bgShapesGroup.rotation.y -= 0.0005;
    bgShapesGroup.rotation.x += 0.0002;

    // Olas matemáticas en el océano de datos
    const positions = planeGeo.attributes.position;
    for(let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = Math.sin(x * 0.3 + elapsedTime) * 0.4 + Math.cos(y * 0.3 + elapsedTime) * 0.4;
        positions.setZ(i, z);
    }
    positions.needsUpdate = true; 

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});