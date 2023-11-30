import * as THREE from "three";
import GUI from "lil-gui";

const canvas = document.querySelector("canvas.webgl");
const axesHelper = new THREE.AxesHelper(50);
const gui = new GUI();
const parameters = {
  color: "#ffeded",
};
const marimi = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const scene = new THREE.Scene();
// scene.add(axesHelper);
const camera = new THREE.PerspectiveCamera(
  35,
  marimi.width / marimi.height,
  0.1,
  100
);
camera.position.z = 8;

/**
 * Object
 */
const textureLoader = new THREE.TextureLoader();
const objectTexture = textureLoader.load("./static/gradients/3.jpg");
objectTexture.magFilter = THREE.NearestFilter;
const material = new THREE.MeshToonMaterial({
  color: 0xffeded,
  gradientMap: objectTexture,
});

const objectPosition = 5;
const o1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const o2 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const o3 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

o1.position.y = -objectPosition * 0;
o2.position.y = -objectPosition * 1;
o3.position.y = -objectPosition * 2;

scene.add(o1);
scene.add(o2);
scene.add(o3);

/**
 * Lights
 */
const light2 = new THREE.PointLight("#ffffff", 40);
light2.position.set(-4, 0, 4);
scene.add(light2);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(marimi.width, marimi.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
let previousTime = 0;

/**
 * ANIMATIONS
 */
// window.addEventListener("scroll", (e) => {
//   camera.position.y = Math.round(window.scrollY / marimi.height);
// });

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  // o1.rotation.x += deltaTime;
  // o1.rotation.y += deltaTime;
  camera.position.y = (-scrollY / marimi.height) * objectPosition;

  previousTime = elapsedTime;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();
