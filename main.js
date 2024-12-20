import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const container = document.querySelector("#container");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 500); // Move the camera back to see the stars
camera.lookAt(0, 0, 0);         // Center the camera on the origin


const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);
// renderer.setClearColor("#0b1d4f");
// document.body.appendChild(renderer.domElement);

// USE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

/*********************
* MESHES
* *******************/

let stars = [];
const numberOfStars = 750;
const starColors = [
    "#ffffff",
    "#ffd700", 
    "#ff4500", 
    "#87ceeb",
    "#add8e6", 
    "#f0e68c",
    "#ffa07a", 
    "#fffacd", 
]

function getRandomNum(max, min=0) {
    return Math.floor(Math.random() * (max-min) + min);
}

for (let index = 0; index < numberOfStars; index++) {
    
    let size = getRandomNum(20, 5);
    let color = starColors[Math.floor(getRandomNum(starColors.length))];
    let geometry = new THREE.BufferGeometry();
    let position = new Float32Array([getRandomNum(1000, -1000), getRandomNum(1000, -1000), getRandomNum(1000, -1000)]);
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    let material = new THREE.PointsMaterial({
        color: color,
        size: size,
    })
    
    let star = new THREE.Points(geometry, material);

    scene.add(star);
    stars.push(star);

}




// USEFULL trick to inspect THREE.JS objects
// window.sphere = sphere
// window.cube = cube
// window.camera = camera

/*********************
* HELPER to visualize different CSs 
* *******************/
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// const axesHelper2 = new THREE.AxesHelper(2);
// cube.add(axesHelper2);

// const axesHelper3 = new THREE.AxesHelper(2);
// sphere.add(axesHelper3);

// const axesHelper4 = new THREE.AxesHelper(2);
// spherePivot.add(axesHelper4);

/**********************
Control panel
**********************/



// start the animation
renderer.setAnimationLoop(render);


/*********************
* ANIMATION LOOP
* *******************/
function render() {
  

    controls.update();

    // render the scene ("draw" the scene into the Canvas, using the camera's point of view)
    renderer.render(scene, camera);
};
