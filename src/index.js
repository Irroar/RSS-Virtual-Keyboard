import Keyboard from './Keyboard';
import './styles/style.css';

const body = document.querySelector('body');
const textArea = document.createElement('textarea');
const mainContainer = document.createElement('div');
textArea.className = 'textarea';
body.append(textArea);
mainContainer.className = 'board';

const keyboard = new Keyboard('en', mainContainer, textArea);

body.append(mainContainer);
keyboard.init();
