import THREE from 'three.js';
window.THREE = THREE
import * as flags from './flags';
import {gui} from './controllers/gui';
import Screen from './screen';
import * as c from './log';
import lights from './webgl/lights'

import {cameraDev, cameraUser} from './webgl/cameras';

const renderer = require('./webgl/renderer')
const scene = require('./webgl/scene');

// camera controls
var mouseX = 0
var mouseY = 0
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var prince = null

function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX ) * 1;
	mouseY = ( event.clientY - windowHalfY ) * 1;
}
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

const OrbitControls = require('three-orbit-controls')(THREE);
// AUDIO LOADER
require('./lib/three/audio/Audio.js') 
require('./lib/three/audio/AudioAnalyser.js') 
require('./lib/three/audio/AudioListener.js') 
require('./lib/three/audio/PositionalAudio.js') 
require('./lib/three/audio/AudioContext.js') 
require('./lib/three/audio/AudioLoader.js') 
//COLLADA LOADER
require('./lib/three/ColladaLoader.js')
require('./lib/three/Animation.js')
require('./lib/three/AnimationHandler.js')
require('./lib/three/KeyFrameAnimation.js')
require('./lib/three/Detector.js')
require('./lib/three/stats.min.js')



class App{

	

	constructor(){

		c.enable = true;
		c.log('IVXVIXVIII');

		this.zoom( cameraDev, 100 );
		this.zoom( cameraUser, 100 );

		// Renderer
		document.body.appendChild( renderer.domElement )

		// Lights
		for( let id in lights ){
			scene.add(lights[id]);
		};

		// Helpers
		if( flags.showHelpers ){
			scene.add( new THREE.GridHelper( 50, 10 ) );
			scene.add( new THREE.AxisHelper( 10 ) );
		}

		// Controls
		this.controls = new OrbitControls( cameraDev, renderer.domElement );

		const texture = new THREE.VideoTexture(document.getElementById('video'))
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		prince = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({
			map: texture,
			emissive: 0xffffff,
			emissiveMap: texture,
			side: THREE.DoubleSide,
			color: 0xFFFFFF,
			transparent: true
		}))
		prince.position.set( 0, 17, 0 )
		prince.scale.set( 0.5, 0.5, 0.5 )
		//prince.rotation.set( 0, Math.PI/2, 0 )
		scene.add(prince)

		// GUI
		let princeFolder = gui.addFolder('PRINCE')
		//lightFolder.open()
		princeFolder.add(prince.position, 'x', -100, 100).name('pos x')
		princeFolder.add(prince.position, 'y', -100, 100).name('pos y')
		princeFolder.add(prince.position, 'z', -100, 100).name('pos z')
	
		princeFolder.add(prince.scale, 'x', 0, 2).name('scale x')
		princeFolder.add(prince.scale, 'y', 0, 2).name('scale y')
		princeFolder.add(prince.scale, 'z', 0, 2).name('scale z')

		// SPHERE
		var geometry = new THREE.SphereGeometry( 50, 16, 16 )
		var material = new THREE.MeshPhongMaterial( {
			color: 0xffffff, 
			reflectivity:1, 
			shading: THREE.FlatShading, 
			wireframe:false} )
		var sphere = new THREE.Mesh( geometry, material )
		sphere.castShadow = true
		sphere.receiveShadow = false
		sphere.position.set( 0, -30, 0 )
		//scene.add( sphere )

		// AUDIO
		var audioFile = 'audio/loopchapter6.mp3';
		var audioListener = new THREE.AudioListener();
		cameraUser.add( audioListener );
		var oceanAmbientSound = new THREE.Audio( audioListener );
		scene.add( oceanAmbientSound );
		var loader = new THREE.AudioLoader();
		loader.load(
			// resource URL
			audioFile,
			// Function when resource is loaded
			function ( audioBuffer ) {
				// set the audio object buffer to the loaded object
				oceanAmbientSound.setBuffer( audioBuffer );
		
				// play the audio
				if (flags.soundActive == true){
					oceanAmbientSound.play();
				}
				oceanAmbientSound.source.loop = true;
			},
			// Function called when download progresses
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			// Function called when download errors
			function ( xhr ) {
				console.log( 'An error happened' );
			}
		);
		//AUDIO voice
		var audioFile = 'audio/FRchapter6.mp3';
		var audioListener = new THREE.AudioListener();
		cameraUser.add( audioListener );
		var voiceSound = new THREE.Audio( audioListener );
		scene.add( voiceSound );
		var loader = new THREE.AudioLoader();
		loader.load(
			// resource URL
			audioFile,
			// Function when resource is loaded
			function ( audioBuffer ) {
				// set the audio object buffer to the loaded object
				voiceSound.setBuffer( audioBuffer );
		
				// play the audio
				if (flags.soundActive == true){
					voiceSound.play();
				}
			},
			// Function called when download progresses
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			// Function called when download errors
			function ( xhr ) {
				console.log( 'An error happened' );
			}
		);

		//OBJECT LOADER
		var dae;
		var dae_geometry;
		var dae_material;
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( 'models/bear/Scarf_on_bear14.dae', function ( collada ) {
			
			console.log("object loaded")
			dae = collada.scene;

			dae_material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
			console.log("CHILDRENS :")
			console.log(dae.children[3])
			for (var i = 0; i < dae.children[3].children.length; i++) {
				dae.children[3].children[i].material = dae_material;
			}
			

			dae.scale.x = dae.scale.y = dae.scale.z = .3;
			dae.position.y = -50;
			dae.updateMatrix();
		
			scene.add( dae );
			//init();
			
			// GUI
			let objectFolder = gui.addFolder('Object')
			//lightFolder.open()
			objectFolder.add(dae.position, 'x', -100, 100).name('pos x')
			objectFolder.add(dae.position, 'y', -100, 100).name('pos y')
			objectFolder.add(dae.position, 'z', -100, 100).name('pos z')
		
			objectFolder.add(dae.scale, 'x', 0, 100).name('scale x')
			objectFolder.add(dae.scale, 'y', 0, 100).name('scale y')
			objectFolder.add(dae.scale, 'z', 0, 100).name('scale z')
		} );
		//function init() {
		// Add the COLLADA

		
		//SKYBOX
		var path = "img/skybox/";
		var format = '.jpg';
		var urls = [
				path + 'px' + format, path + 'nx' + format,
				path + 'py' + format, path + 'ny' + format,
				path + 'pz' + format, path + 'nz' + format
			];
		var reflectionCube = new THREE.CubeTextureLoader().load( urls );
		reflectionCube.format = THREE.RGBFormat;
		var refractionCube = new THREE.CubeTextureLoader().load( urls );
		refractionCube.mapping = THREE.CubeRefractionMapping;
		refractionCube.format = THREE.RGBFormat;
		//var cubeMaterial3 = new THREE.MeshPhongMaterial( { color: 0x000000, specular:0xaa0000, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } );
		var cubeMaterial3 = new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3 } );
		var cubeMaterial2 = new THREE.MeshLambertMaterial( { color: 0xffee00, envMap: refractionCube, refractionRatio: 0.95 } );
		var cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube } );
		// Skybox
		var shader = THREE.ShaderLib[ "cube" ];
		shader.uniforms[ "tCube" ].value = reflectionCube;
		var material = new THREE.ShaderMaterial( {
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide
		} ),
		skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000 ), material ); 
		scene.add( skyboxMesh ); 

		// Bind
		this.bind()
		this.update();
	}

	bind() {
		Screen.on('resize', this.resize.bind(this));
	}

	zoom( camera, zoom ){
		//camera.position.set( Math.cos(Math.PI*0) * zoom, 0.4 * zoom, Math.sin(Math.PI*0) * zoom );
		cameraUser.position.set( 0, -28, 119 );
		cameraDev.position.set( 0, -28, 119 );
		//camera.lookAt( new THREE.Vector3() );
	}

	update(){

		requestAnimationFrame( this.update.bind(this) );

		if( flags.debug ){
			this.render( cameraDev,  0, 0, 1, 1 );
			this.render( cameraUser,  0, 0, 0.25, 0.25 );
		} else {
			this.render( cameraDev,  0, 0, 0.25, 0.25 );
			this.render( cameraUser,  0, 0, 1, 1 );
		}
	}
	

	render( camera, left, bottom, width, height ){

		left   *= Screen.width;
		bottom *= Screen.height;
		width  *= Screen.width;
		height *= Screen.height;

		cameraDev.updateProjectionMatrix();
		cameraUser.updateProjectionMatrix();

		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest( true );
		renderer.setClearColor( 0x121212 );

		cameraUser.position.x += ( (mouseX)/20 - cameraUser.position.x ) * .01;
		cameraUser.position.y += ( ( mouseY)/100 - cameraUser.position.y ) * .02 - 0.2;
		if (prince != undefined){
			prince.rotation.y += ( ( mouseX)/2000 - prince.rotation.y ) * .01;
		}
		camera.lookAt( scene.position );



		renderer.render( scene, camera );
	}

	resize( ){

		cameraDev.aspect  = Screen.width / Screen.height;
		cameraUser.aspect = Screen.width / Screen.height;

		cameraDev.updateProjectionMatrix()
		cameraUser.updateProjectionMatrix()

		renderer.setSize( Screen.width, Screen.height );
	}
}

export default new App();
