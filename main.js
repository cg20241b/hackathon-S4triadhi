import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Load font and create text meshes
const loader = new FontLoader();
loader.load('https://cdn.jsdelivr.net/npm/three@0.152.0/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    // Alphabet Text ("F")
    const textGeometryF = new TextGeometry('F', {
        font: font,
        size: 1,
        depth: 0.2,
        curveSegments: 12,
    });
    const materialF = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const meshF = new THREE.Mesh(textGeometryF, materialF);
    meshF.position.set(-2, 0, 0); // Position "F" to the left
    scene.add(meshF);

    // Digit Text ("8")
    const textGeometry8 = new TextGeometry('8', {
        font: font,
        size: 1,
        depth: 0.2,
        curveSegments: 12,
    });
    const material8 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mesh8 = new THREE.Mesh(textGeometry8, material8);
    mesh8.position.set(2, 0, 0); // Position "8" to the right
    scene.add(mesh8);
});

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
