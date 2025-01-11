import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

/*********************
* SETUP
* *******************/

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
//Materials
const baseMaterial = new THREE.MeshStandardMaterial({color: "#ffffff"});
const eyeMaterial = new THREE.MeshStandardMaterial({color: "#000000"});
const pupilMaterial = new THREE.MeshStandardMaterial({color: "#30e61c"});
const wheelMaterial = new THREE.MeshStandardMaterial({color: "#000000"});

//Group
const robot = new THREE.Group();

//Body
const bodyGeometry = new THREE.BoxGeometry(2, 1, 1.5);
const body = new THREE.Mesh(bodyGeometry, baseMaterial);
body.position.set(0, 0.5, 0);
robot.add(body);

//Neck 
const neckPoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.25, 0.5, 0),
    new THREE.Vector3(0.5, 1, 0),
]
const neckCurve = new THREE.CatmullRomCurve3(neckPoints);
const neckGeometry = new THREE.TubeGeometry(neckCurve, 20, 0.1, 8, false);
const neck = new THREE.Mesh(neckGeometry, baseMaterial);
neck.position.set(0.65, 0.9, 0);
neck.rotation.z = Math.PI / 4; // Neck inclination
robot.add(neck);

//Head
const headGeometry = new THREE.BoxGeometry(1, 0.8, 1);
const head = new THREE.Mesh(headGeometry, baseMaterial);
head.position.set(0.7, 2, 0);
robot.add(head);

//Eyes
const eyesGroup = new THREE.Group();

const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(1.4, 2.25, 0.3);
rightEye.position.set(1.4, 2.25, -0.3);
eyesGroup.add(leftEye);
eyesGroup.add(rightEye);

const pupilGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
leftPupil.position.set(1.515, 2.2, 0.2);
leftPupil.rotation.x = Math.PI * -1;
rightPupil.position.set(1.515, 2.25, -0.2);
eyesGroup.add(leftPupil);
eyesGroup.add(rightPupil);
eyesGroup.position.x = -0.15;
eyesGroup.position.y = -0.1;

robot.add(eyesGroup);

//Mouth
// Create a simple smiling curve using QuadraticBezierCurve3
const startPoint = new THREE.Vector3(-0.5, 0, 0); // Left side of the mouth
const controlPoint = new THREE.Vector3(0, 0.3, 0); // The peak of the smile (smiling curve)
const endPoint = new THREE.Vector3(0.5, 0, 0); // Right side of the mouth

const smileCurve = new THREE.QuadraticBezierCurve3(startPoint, controlPoint, endPoint);

// Create the geometry from the curve
const smilePoints = smileCurve.getPoints(50); // 50 points to smooth the curve
const smileGeometry = new THREE.BufferGeometry().setFromPoints(smilePoints);

// Create a line material for the mouth
const smileMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

// Create the smile line
const smileLine = new THREE.Line(smileGeometry, smileMaterial);

// Create a group for the mouth
const mouthGroup = new THREE.Group();
mouthGroup.add(smileLine);
mouthGroup.rotation.x = Math.PI;
mouthGroup.rotation.y = Math.PI / 2;
// Position the mouth appropriately (e.g., below the eyes)
mouthGroup.position.set(1.201, 2, 0);

// Add the mouth group to the scene
robot.add(mouthGroup);


// Wheels
const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16);
const leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
const rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
leftWheel.rotation.z = Math.PI / 2; 
rightWheel.rotation.z = Math.PI / 2;
leftWheel.position.set(0, 0.2, 0.8);
rightWheel.position.set(0, 0.2, -0.8);
robot.add(leftWheel);
robot.add(rightWheel);

robot.scale.x=2;
robot.scale.y=2;
robot.scale.z=2;
robot.rotation.y = -Math.PI / 2;
// robot.position.y = -20;

// Scene illumination
const light = new THREE.DirectionalLight("#fffff", 2);
light.position.set(-250, 1000, -250);
scene.add(light);

const ambientLight = new THREE.AmbientLight("#fffff", 0.25);
scene.add(ambientLight);

/*********************
* ANIMATION LOOP
* *******************/

function placeOnSphere(object, radius, latitude, longitude) {
    
    const x = radius * Math.sin(latitude) * Math.cos(longitude);
    const y = radius * Math.cos(latitude) - 270; // Subtract 270 to account to the moon position (0,-270,0)
    const z = radius * Math.sin(latitude) * Math.sin(longitude);

    object.position.set(x, y, z);

}

function updateRobotPosition() {

    placeOnSphere(robot, moonRadius, latitude, longitude);

}

// Initial robot position
const moonRadius = 250;
let latitude = 0;
let longitude = Math.PI / 2;

placeOnSphere(robot, moonRadius, latitude, longitude);
scene.add(robot);

console.log("Robot Position:", robot.position);
console.log("Moon Center:", sphere.position);
console.log("Distance from Moon Center:", robot.position.distanceTo(sphere.position));

//Robot controls and event listeners

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            latitude -= 0.05; // Move towards the north pole
            break;
        case "ArrowDown":
            latitude += 0.05; // Move towards the south pole
            break;
        case "ArrowLeft":
            longitude -= 0.05; // Move west
            break;
        case "ArrowRight":
            longitude += 0.05; // Move east
            break;
    }

    placeOnSphere(robot, moonRadius, latitude, longitude);
})

let isFollowing = false;
let isTransitioning = false;

// Disable OrbitControls at start
controls.enabled = false;

// Zoom animation
gsap.to(camera, {
    zoom: 5,
    duration: 6,
    ease: "power2.inOut",
    onUpdate: () => {
        camera.updateProjectionMatrix();
    },
    onComplete: () => {
        isTransitioning = true;
        
        // Store final zoom position
        const finalZoomPosition = camera.position.clone();
        
        // Calculate the initial follow camera position
        const followPosition = cameraOffset.clone();
        followPosition.applyMatrix4(robot.matrixWorld);
        
        // Create a dummy object to animate
        const dummyObject = {
            x: finalZoomPosition.x,
            y: finalZoomPosition.y,
            z: finalZoomPosition.z,
            lookAtX: robot.position.x,
            lookAtY: robot.position.y,
            lookAtZ: robot.position.z
        };
        
        // Animate to follow camera position
        gsap.to(dummyObject, {
            x: followPosition.x,
            y: followPosition.y,
            z: followPosition.z,
            lookAtX: robot.position.x,
            lookAtY: robot.position.y,
            lookAtZ: robot.position.z,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                if (isTransitioning) {
                    camera.position.set(dummyObject.x, dummyObject.y, dummyObject.z);
                    camera.lookAt(dummyObject.lookAtX, dummyObject.lookAtY, dummyObject.lookAtZ);
                }
            },
            onComplete: () => {
                isTransitioning = false;
                isFollowing = true;
                // Turn on controls after the transition
                controls.enabled = true;
            }
        });
    }
});

// 3rd person camera folowing the robot
const cameraOffset = new THREE.Vector3(0, 120, 120); 

function updateCameraFollow() {
    
    const idealOffset = cameraOffset.clone();
    idealOffset.applyMatrix4(robot.matrixWorld);
    
    // Smoothly interpolate camera position
    camera.position.lerp(idealOffset, 0.1);
    
    // Create a target look-at position
    const targetPosition = robot.position.clone();
    camera.lookAt(targetPosition);

}

// Initial camera
camera.position.set(0, 50, 300); 
camera.lookAt(robot.position);

function render() {
    // Only update controls when not transitioning or following
    if (!isTransitioning) {
        controls.update();
    }

    if (isFollowing && !isTransitioning) {
        updateCameraFollow();
    }
    
    updateRobotPosition();
    renderer.render(scene, camera);
}

// start the animation
renderer.setAnimationLoop(render);