import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const canvas = document.getElementById("three-canvas");

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 50);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// References for text meshes
let textFMesh, text8Mesh;

// Function to create text material
const createCharacterMaterial = (baseColor, isMetallic) => {
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: isMetallic ? 1.0 : 0.2,
    roughness: isMetallic ? 0.2 : 0.8,
  });
};

// Load font and add text meshes
const fontLoader = new FontLoader();
fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
  const textMaterial = createCharacterMaterial("#F5BD02", false); // Set color to #F5BD02

  const createText = (text, material) => {
    const textGeometry = new TextGeometry(text, {
      font,
      size: 2.5,
      height: 0.2,
    });
    return new THREE.Mesh(textGeometry, material);
  };

  // Create "F" and "8" meshes
  textFMesh = createText("F", textMaterial);
  text8Mesh = createText("8", textMaterial);

  // Initial positions
  textFMesh.position.set(-3, 0, 0);
  text8Mesh.position.set(3, 0, 0);

  // Add to scene
  scene.add(textFMesh);
  scene.add(text8Mesh);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Allow dynamic position updates
function updatePositions(fPosition, eightPosition) {
  if (textFMesh) textFMesh.position.set(...fPosition); // Update position of "F"
  if (text8Mesh) text8Mesh.position.set(...eightPosition); // Update position of "8"
}

// Example of dynamically changing positions
setTimeout(() => {
  updatePositions([-5, 0, 0], [5, 0, 0]); // Move "F" and "8" to new positions after 2 seconds
}, 2000);
