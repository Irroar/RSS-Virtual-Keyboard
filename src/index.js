import Keyboard from './Keyboard';
import './styles/style.css';

const body = document.querySelector('body');
const wrapper = document.createElement('div');
const textArea = document.createElement('textarea');
const kayboardContainer = document.createElement('div');
const title = document.createElement('h1');
const description = document.createElement('p');

title.className = 'title';
description.className = 'description';
wrapper.className = 'wrapper';
textArea.className = 'textarea';
kayboardContainer.className = 'board';

title.textContent = 'RSS Virtual Keyboard';
description.textContent = 'This keyboard was created on Windows. To change language press "Left Ctrl + Left Alt".';

const storagedLang = localStorage.getItem('language');
const keyboard = new Keyboard(storagedLang, kayboardContainer, textArea);

wrapper.append(title);
wrapper.append(textArea);
wrapper.append(kayboardContainer);
wrapper.append(description);
body.append(wrapper);
keyboard.init();
keyboard.configuratePhysicalButtons();
