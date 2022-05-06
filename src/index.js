import Keyboard from './Keyboard';
import './styles/style.css';

const body = document.querySelector('body');
const mainContainer = document.createElement('div');
mainContainer.className = 'board';
const keyboard = new Keyboard('en', mainContainer);

body.append(mainContainer);
keyboard.init();
