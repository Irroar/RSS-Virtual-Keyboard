import Keyboard from './Keyboard';
import './styles/style.css';

const body = document.querySelector('body');
const wrapper = document.createElement('div');
wrapper.className = 'wrapper';
body.append(wrapper);
const textArea = document.createElement('textarea');
const kayboardContainer = document.createElement('div');
textArea.className = 'textarea';
wrapper.append(textArea);
kayboardContainer.className = 'board';

const storagedLang = localStorage.getItem('language');
const keyboard = new Keyboard(storagedLang, kayboardContainer, textArea);

wrapper.append(kayboardContainer);
keyboard.init();
keyboard.configuratePhysicalButtons();
