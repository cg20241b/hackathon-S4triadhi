import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Select the canvas element for rendering the 3D scene
const canvas = document.getElementById("three-canvas");

// === SCENE SETUP ===
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

// Set up the camera with a perspective view
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

// === RENDERER SETUP ===
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// === LIGHTING SETUP ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 50);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// === GLOWING CUBE SETUP ===
const glowCubeMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vPosition;
    void main() {
      vec3 glowColor = vec3(1.0, 1.0, 1.0);
      gl_FragColor = vec4(glowColor, 1.0);
    }
  `,
});

const glowCubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const glowCube = new THREE.Mesh(glowCubeGeometry, glowCubeMaterial);
glowCube.position.set(0, 0, 0);
glowCube.scale.set(2, 2, 2);
scene.add(glowCube);

// === TEXT MESH SETUP ===
const fontLoader = new FontLoader();

// Function to calculate the ambient light intensity
const calculateAmbientIntensity = (lastThreeDigits) => {
  const abc = lastThreeDigits + 200;
  return abc / 1000;
};

// Calculate ambient intensity
const ambientIntensity = calculateAmbientIntensity(188);

// Create a custom material for the text mesh
const createCharacterMaterial = (baseColor, isMetallic, shininessValue) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      lightPosition: { value: glowCube.position },
      viewPosition: { value: camera.position },
      baseColor: { value: new THREE.Color(baseColor) },
      ambientIntensity: { value: ambientIntensity },
      shininess: { value: shininessValue },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal); 
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz; 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 lightPosition;
      uniform vec3 viewPosition;
      uniform vec3 baseColor;
      uniform float ambientIntensity;
      uniform float shininess;

      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 ambient = ambientIntensity * baseColor;
        vec3 lightDir = normalize(lightPosition - vPosition);
        float diff = max(dot(vNormal, lightDir), 0.0);
        vec3 diffuse = diff * baseColor;
        vec3 viewDir = normalize(viewPosition - vPosition);
        vec3 reflectDir = reflect(-lightDir, vNormal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
        vec3 specular = (shininess > 50.0 ? baseColor : vec3(1.0)) * spec;
        vec3 color = ambient + diffuse + specular;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
};

// === TEXT MESH CREATION ===
fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log("Font loaded successfully");

  // Teks F dengan efek plastik (Shininess lebih rendah)
  const textMaterialF = createCharacterMaterial("#F5BD02", false, 30); // Gold color for "F" with shininess 30

  // Teks 8 dengan efek metalik (Shininess lebih tinggi dan warna specular lebih dekat dengan warna dasar)
  const textMaterial8 = createCharacterMaterial("#023af5", true, 100); // Blue color for "8" with shininess 100

  // Function to create a text mesh
  const createText = (text, material) => {
    const textGeometry = new TextGeometry(text, {
      font,
      size: 2.5,
      height: 0.2,
    });
    return new THREE.Mesh(textGeometry, material);
  };

  // Create the text meshes "F" and "8"
  const textFMesh = createText("F", textMaterialF);
  const text8Mesh = createText("8", textMaterial8);

  // Set positions for the text meshes
  textFMesh.position.set(-5, 0, 0);
  text8Mesh.position.set(5, 0, 0);

  // Add text meshes to the scene
  scene.add(textFMesh);
  scene.add(text8Mesh);
});

// === KEYBOARD CONTROLS ===
const handleKeyDown = (event) => {
  switch (event.key) {
    case "w":
      glowCube.position.y += 0.1; 
      break;
    case "s":
      glowCube.position.y -= 0.1; 
      break;
    case "a":
      camera.position.x += 0.1; 
      break;
    case "d":
      camera.position.x -= 0.1; 
      break;
  }
};

window.addEventListener("keydown", handleKeyDown);

// === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate); 
  renderer.render(scene, camera); 
}
animate();

// === WINDOW RESIZE HANDLING ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); 
  renderer.setSize(window.innerWidth, window.innerHeight); 
});
