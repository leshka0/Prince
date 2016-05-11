import THREE from 'three.js'
import {scene} from './scene'
import {gui} from '../controllers/gui';

// Lights
let controller = {
	 ambient: 0x101010
	,directional: 0xFFFF00
	,point: 0xFF00FF
}

let lights = {
	 ambient: new THREE.AmbientLight( controller.ambient )
	,directional: new THREE.DirectionalLight( controller.directional, 0.6 )
	,point: new THREE.PointLight( controller.point, 0.6 )
}

lights.directional.position.set( -10, -8, 3.3 )
lights.directional.castShadow = true
lights.directional.shadowDarkness = 0.5;

lights.point.position.set( -1000, -200, 300 )
lights.point.castShadow = true
lights.point.shadowDarkness = 0.5;
//lights.point.shadowCameraVisible = true;

let lightFolder = gui.addFolder('lights')
//lightFolder.open()

lightFolder.addColor(controller, 'ambient').onChange(updateLights.bind(this))
lightFolder.addColor(controller, 'directional').onChange(updateLights.bind(this))
lightFolder.addColor(controller, 'point').onChange(updateLights.bind(this))
lightFolder.add(lights.directional.position, 'x', -10, 10).name('dir light x')
lightFolder.add(lights.directional.position, 'y', -10, 10).name('dir light y')
lightFolder.add(lights.directional.position, 'z', -10, 10).name('dir light z')

lightFolder.add(lights.point.position, 'x', -1000, 1000).name('pt light x')
lightFolder.add(lights.point.position, 'y', -1000, 1000).name('pt light y')
lightFolder.add(lights.point.position, 'z', -1000, 1000).name('pt light z')

function updateLights(){
	lights.ambient.color.setHex( String(controller.ambient).replace('#', '0x'))
	lights.directional.color.setHex( String(controller.directional).replace('#', '0x'))
	lights.point.color.setHex( String(controller.point).replace('#', '0x'))
}

export default lights
