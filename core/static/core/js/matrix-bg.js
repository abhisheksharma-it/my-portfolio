document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020408, 0.02);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 12, 30);
    camera.rotation.x = -0.3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Wireframe Grid
    const gridGeo = new THREE.PlaneGeometry(100, 100, 40, 40);
    const pos = gridGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        pos.setZ(i, Math.sin(vx * 0.25) * Math.cos(vy * 0.25) * 3);
    }
    gridGeo.computeVertexNormals();

    const gridMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.2 });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -6;
    scene.add(grid);

    // Tactical Particles
    const isMobile = window.innerWidth < 768 || navigator.hardwareConcurrency < 4;
    const pCount = isMobile ? 250 : 500;
    
    const pGeo = new THREE.BufferGeometry();
    const pCoords = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
        pCoords[i] = (Math.random() - 0.5) * 80;
        pCoords[i + 1] = Math.random() * 30 - 5;
        pCoords[i + 2] = (Math.random() - 0.5) * 80;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pCoords, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xffb800, size: 0.35, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse Tracking
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let clock = new THREE.Clock();
    function animate() {
        const t = clock.getElapsedTime();
        grid.position.z = (t * 3) % 8;
        camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 + 12 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        particles.rotation.y = t * 0.03;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
});