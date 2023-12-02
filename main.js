import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

let cajon = undefined;
loader.load('static/cajon.glb', (gltf) => {
  cajon = gltf;
  scene.add(gltf.scene)
});
const canvas = document.querySelector("canvas.webgl");
const marimi = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const scene = new THREE.Scene();
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
console.log(cajon)
const camera = new THREE.PerspectiveCamera(
  35,
  marimi.width / marimi.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Object
 */
const textureLoader = new THREE.TextureLoader();
const objectTexture = textureLoader.load("./static/gradients/5.jpg");
objectTexture.magFilter = THREE.NearestFilter;
const material = new THREE.MeshToonMaterial({
  color: 0xffeded,
  gradientMap: objectTexture,
});

const objectPosition = 4;
const o1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const o2 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.28, 100, 16),
  material
);
const o3 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

o2.position.y = -objectPosition * 1;
o3.position.y = -objectPosition * 2;

o1.position.x = 1;
o2.position.x = -1.5;
o3.position.x = 1;

scene.add( o2, o3);
const meshes = [o1, o2, o3];

/**
 * particles
 */
const particlesCount = 500;
const partPositions = new Float32Array(particlesCount * 3);
for (let i in partPositions) {
  partPositions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  partPositions[i * 3 + 1] =
    objectPosition * 0.5 - Math.random() * objectPosition * meshes.length;
  partPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(partPositions, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
  color: "white",
  sizeAttenuation: true,
  size: 0.03,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Lights
 */
const light2 = new THREE.PointLight("#ffffff", 200);
light2.position.set(-10, -5, 4);
const light3 = new THREE.PointLight("#ffffff", 150);
light3.position.set(10, 5, 0);
scene.add(light2, light3);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(marimi.width, marimi.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

const clock = new THREE.Clock();
let previousTime = 0;

/**
 * cursos
 */
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / marimi.width - 0.5;
  cursor.y = e.clientY / marimi.height - 0.5;
});

/**
 * ANIMATIONS
 */
// window.addEventListener("resize", () => {
//   // Update sizes
//   marimi.width = window.innerWidth;
//   marimi.height = window.innerHeight;

//   // Update camera
//   camera.aspect = marimi.width / marimi.height;
//   camera.updateProjectionMatrix();

//   // Update renderer
//   renderer.setSize(marimi.width, marimi.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;

  if(cajon) {
    // console.log(cajon)
    cajon.scene.rotation.x += deltaTime * 0.3;
    cajon.scene.rotation.y += deltaTime * 0.5;
  }

  camera.position.y = (-scrollY / marimi.height) * objectPosition;

  for (const mesh in meshes) {
    meshes[mesh].rotation.x += deltaTime * 0.3;
    meshes[mesh].rotation.y += deltaTime * 0.5;
  }

  const parallaxX = -cursor.x,
    parallaxY = cursor.y;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime;

  previousTime = elapsedTime;
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();
