import * as three from "three";
import GUI from "lil-gui";

const canvas = document.querySelector("canvas.webgl");
const gui = new GUI();
const parameters = {
  color: "#ffeded",
};
const marimi = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(
  35,
  marimi.width / marimi.height,
  0.1,
  100
);
camera.position.z = 8;

/**
 * Object
 */
const textureLoader = new three.TextureLoader();
const objectTexture = textureLoader.load("./static/gradients/3.jpg");
objectTexture.magFilter = three.NearestFilter;

const material = new three.MeshToonMaterial({
  color: parameters.color,
  gradientMap: objectTexture,
});

const o1 = new three.Mesh(new three.TorusGeometry(1), material);
scene.add(o1);
camera.lookAt(o1.position);

/**
 * Lights
 */
// const light1 = new three.AmbientLight("#ffffff");
// scene.add(light1);
const light2 = new three.DirectionalLight("#ffffff", 3);
light2.position.set(1, 1, 0);
scene.add(light2);

const renderer = new three.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(marimi.width, marimi.height);
renderer.render(scene, camera);
