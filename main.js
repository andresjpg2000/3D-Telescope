import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

/*********************
* SETUP
* *******************/

// let stars = [];
const numberOfStars = 50000; // Change to increase/decrease number of stars rendered
const starColors = [
    "#ffffff", // Pure white
    "#f8f8ff", // Ghost white
    "#ffebcd", // Blanched almond (soft white-yellow)
    "#fff8dc", // Cornsilk (warm white)
    "#fffacd", // Lemon chiffon (soft yellow)
    "#f0e68c", // Khaki (muted yellow)
    "#ffe4b5", // Moccasin (light yellow-orange)
    "#ffd700", // Gold (bright yellow)
    "#fff5ee", // Seashell (off-white)
    "#fafad2"  // Light goldenrod yellow
];

const container = document.querySelector("#container");
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

let textureCube = new THREE.CubeTextureLoader()
    .setPath( './skybox/' )
    .load( [
        'right.png','left.png',
        'top.png', 'bottom.png',
        'front.png', 'back.png'
    ] );
scene.background = textureCube;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.lookAt(0, 0, 0);         // Center the camera on the origin

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// USE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

// METHODS
function getRandomNum(max, min=0) {
    return Math.floor(Math.random() * (max-min) + min);
}

/*********************
* MESHES
* *******************/

// Stars

let color = starColors[Math.floor(getRandomNum(starColors.length))];
let maxDistance = 8000;

const starGeometry = new THREE.SphereGeometry(1, 4, 4);
const starMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
const stars = new THREE.InstancedMesh(starGeometry, starMaterial, numberOfStars);

const dummy = new THREE.Object3D();
for (let i = 0; i < numberOfStars; i++) {
    dummy.position.set(
        getRandomNum(maxDistance, -maxDistance),
        getRandomNum(maxDistance / 10, -maxDistance / 10),
        getRandomNum(maxDistance, -maxDistance)
    );
    dummy.updateMatrix();
    stars.setMatrixAt(i, dummy.matrix);

    const randomColor = new THREE.Color(starColors[getRandomNum(starColors.length)]);
    stars.setColorAt(i, randomColor);

}
scene.add(stars);

// Moon
const moonTexture = textureLoader.load("./2k_moon.jpg");

let geometry = new THREE.SphereGeometry( 250, 32, 16);

let material = new THREE.MeshStandardMaterial();
material.color.set("#ffffff");
material.map = moonTexture;
material.bumpMap = moonTexture;
material.bumpScale = 1;

const sphere = new THREE.Mesh( geometry, material ); 
sphere.position.set(0, -270, 0)
scene.add( sphere );

// Robot
geometry = new THREE.BoxGeometry(3,2,3);
material = new THREE.MeshLambertMaterial({color: "#ffff"})
const robot = new THREE.Mesh(geometry, material);
robot.position.set(0,-20,0);
scene.add(robot);

// Scene illumination
const light = new THREE.DirectionalLight("#fffff", 2);
light.position.set(-250, 1000, -250);
scene.add(light);

const ambientLight = new THREE.AmbientLight("#fffff", 0.25);
scene.add(ambientLight);

/*********************
* ANIMATION LOOP
* *******************/

function render() {
    controls.update();
    renderer.render(scene, camera);

}

// start the animation
renderer.setAnimationLoop(render);

gsap.to(camera, {
    zoom: 5,
    duration: 6,
    ease: "power2.inOut",
    onUpdate: () => {
        camera.updateProjectionMatrix();
        
    }
})

camera.position.set(0, 0, 500); // Move the camera back to see the stars
