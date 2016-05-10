import THREE from 'three.js'
import Screen from '../screen'

export const cameraDev = new THREE.PerspectiveCamera( 65, Screen.width / Screen.height, 0.1, 100000 )
export const cameraUser = new THREE.PerspectiveCamera( 65, Screen.width / Screen.height, 0.1, 100000 )
