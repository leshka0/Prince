import THREE from 'three.js'

module.exports = new THREE.Scene()

//alert("LOL")

// OBJECT LOADER
//var dae;
//var loader = new THREE.ColladaLoader();
//loader.options.convertUpAxis = true;
//loader.load( 'models/character/character14b.dae', function ( collada ) {
//	dae = collada.scene;
//	dae.traverse( function ( child ) {
//		if ( child instanceof THREE.SkinnedMesh ) {
//			var animation = new THREE.Animation( child, child.geometry.animation );
//			animation.play();
//		}
//	} );
//	dae.scale.x = dae.scale.y = dae.scale.z = 2;
//	dae.position.y = -3.5;
//	dae.updateMatrix();
//	initCollada();
//	animate();
//} );