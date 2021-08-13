import './assets/css/style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
camera.position.setZ( 30 )

// Lights
const pointLight = new THREE.PointLight( 0xffffff )
pointLight.position.set( 5, 15, 5 )

const lightHelper = new THREE.PointLightHelper( pointLight )
scene.add( lightHelper )

const ambientLight = new THREE.AmbientLight( 0xffffff )
scene.add( pointLight, ambientLight )

// Grid
const gridHelper = new THREE.GridHelper(200,100)
scene.add( gridHelper )

// Orbit Control (allows us to move around the scene with mouse scroll)
const controls = new OrbitControls( camera, renderer.domElement )

// Torus
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347, wireframe: true } )
const torus = new THREE.Mesh( geometry, material )
scene.add( torus )

// asteroid
const asteroidTexture = new THREE.TextureLoader().load( 'assets/img/asteroid_texture.jpg' )
const normalTexture = new THREE.TextureLoader().load ( 'assets/img/normal.jpg' )
const asteroid = new THREE.Mesh(
  new THREE.SphereGeometry( 3, 30, 30),
  new THREE.MeshBasicMaterial( { 
    map: asteroidTexture,
    normal: normalTexture
   } )
)
asteroid.position.z = 30
asteroid.position.x = -10
scene.add( asteroid )

// Face Cube Mesh
const faceTexture = new THREE.TextureLoader().load( 'assets/img/face1.jpg' )
const faceCube = new THREE.Mesh(
  new THREE.BoxGeometry( 3, 3, 3 ),
  new THREE.MeshBasicMaterial( { map: faceTexture } )
)
scene.add( faceCube )

// Populate Stars
function addStar(){
  const geometry = new THREE.SphereGeometry( 0.25, 24, 24 )
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff } )
  const star = new THREE.Mesh( geometry, material)

  const [x,y,z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread( 100 ) )
  star.position.set(x,y,z)
  scene.add( star )
}

Array(200).fill().forEach( addStar )

// Space Background
const spaceTexture = new THREE.TextureLoader().load( 'assets/img/space.jpg' )
scene.background = spaceTexture

function moveCamera(){

  const t = document.body.getBoundingClientRect().top // distance from the top
  console.log(t)

  asteroid.rotation.y += 0.075

  faceCube.rotation.x += 0.05
  faceCube.rotation.y += 0.08
  faceCube.rotation.z += 0.04

  camera.position.z = 30 + t * -0.02;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}

document.body.onscroll = moveCamera


// Game loop
function animate() {
  webkitRequestAnimationFrame( animate )

  torus.rotation.x += .01
  torus.rotation.y += .008
  torus.rotation.z += .001

  faceCube.rotation.x += 0.01
  faceCube.rotation.y += 0.008
  faceCube.rotation.z += 0.001

  asteroid.rotation.y += 0.03
  asteroid.rotation.x -= 0.002


  controls.update()

  renderer.render( scene, camera )
}

animate()
