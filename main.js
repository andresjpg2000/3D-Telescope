import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

/*********************
* SETUP
* *******************/

let stars = [];
const numberOfStars = 20000; // Change to increase/decrease number of stars rendered
const starColors = [       // Stars will be rendered with a random color from this array
    "#ffffff",
    "#ffd700", 
    "#ff4500", 
    "#87ceeb",
    "#add8e6", 
    "#f0e68c",
    "#ffa07a", 
    "#fffacd", 
]

const container = document.querySelector("#container");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 4000);
camera.position.set(0, 0, 2500); // Move the camera back to see the stars
camera.lookAt(0, 0, 0);         // Center the camera on the origin

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// USE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

/*********************
* MESHES
* *******************/

function getRandomNum(max, min=0) {
    return Math.floor(Math.random() * (max-min) + min);
}

// Stars
for (let index = 0; index < numberOfStars; index++) {
    
    let size = getRandomNum(15, 5);
    let color = starColors[Math.floor(getRandomNum(starColors.length))];
    let geometry = new THREE.BufferGeometry();
    let maxDistance = 8000;
    let position;
    let minDistanceFromCenter = 500; // Controls distance from the moon to the stars
    
    // Get a random position for the star, if the position isnt distant enough from the moon it will try to get another position
    do {
        position = new Float32Array([getRandomNum(maxDistance, -maxDistance), getRandomNum(maxDistance / 10, -maxDistance / 10), getRandomNum(maxDistance, -maxDistance)]);
    } while (Math.sqrt(Math.pow(position[0], 2) + Math.pow(position[1], 2) + Math.pow(position[2],2 )) < minDistanceFromCenter);

    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    let material = new THREE.PointsMaterial({
        color: color,
        size: size,
        depthTest: true,
    })
    
    let star = new THREE.Points(geometry, material);

    scene.add(star);
    stars.push(star);

}

// Moon
const textureLoader = new THREE.TextureLoader();
const moonTexture = textureLoader.load("./2k_moon.jpg");

let geometry = new THREE.SphereGeometry( 250, 32, 16);
// const material = new THREE.MeshBasicMaterial( { color: "#fffff" } ); 

let material = new THREE.MeshStandardMaterial({
    map: moonTexture,
    bumpMap: moonTexture,
    bumpScale: 0.1,
})

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
const light = new THREE.DirectionalLight("#fffff", 2); // White light, intensity of 1
light.position.set(-250, 1000, -250); // Position the light
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
    zoom: 10,
    duration: 6,
    ease: "power2.inOut",
    onUpdate: () => {
        camera.updateProjectionMatrix();
        
        renderer.render(scene, camera);
    }
})