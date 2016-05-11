import THREE from 'three.js';
import * as flags from './flags';
import {gui} from './controllers/gui';
import Screen from './screen';
import * as c from './log';
import lights from './webgl/lights'

import {cameraDev, cameraUser} from './webgl/cameras';

const OrbitControls = require('three-orbit-controls')(THREE);
const renderer = require('./webgl/renderer')
const scene = require('./webgl/scene');

// camera controls
var mouseX = 0
var mouseY = 0
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
function onDocumentMouseMove(event) {
	//console.log("move")
	mouseX = ( event.clientX - windowHalfX ) * 1;
	mouseY = ( event.clientY - windowHalfY ) * 1;
}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
//console.log(THREE)
//const colladaload1 = require('../../node_modules/three.js/examples/js/loaders/ColladaLoader.js')(THREE);
//const colladaload2 = require('../../node_modules/three.js/examples/js/loaders/collada/Animation.js')(THREE);
//const colladaload3 = require('../../node_modules/three.js/examples/js/loaders/collada/AnimationHandler.js')(THREE);
//const colladaload4 = require('../../node_modules/three.js/examples/js/loaders/collada/KeyFrameAnimation.js')(THREE);
//const colladaload5 = require('../../node_modules/three.js/examples/js/Detector.js')(THREE);
//const colladaload6 = require('../../node_modules/three.js/examples/js/libs/stats.min.js')(THREE);



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
		const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({
			map: texture,
			emissive: 0xffffff,
			emissiveMap: texture,
			side: THREE.DoubleSide,
			color: 0xFFFFFF,
			transparent: true
		}))
		mesh.position.set( 0, 50, 0 )
		//mesh.rotation.set( 0, Math.PI/2, 0 )
		scene.add(mesh)

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
		scene.add( sphere )

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
