import {gui} from './controllers/gui';

let folder = gui.addFolder('flags')
folder.open()

export const live  		 = false;
export const debug  	 = true;
export const showHelpers = true;
export const showGUI 	 = true;

folder.add(exports, 'debug')
folder.add(exports, 'showHelpers')
