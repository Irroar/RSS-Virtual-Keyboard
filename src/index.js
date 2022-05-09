import Keyboard from './Keyboard';
import './styles/style.css';

const body = document.querySelector('body');
const wrapper = document.createElement('div');
const textArea = document.createElement('textarea');
const kayboardContainer = document.createElement('div');
const title = document.createElement('h1');
const description = document.createElement('p');
const checkboxDiv = document.createElement('div');
const checkbox = document.createElement('input');
const labelForCheckbox = document.createElement('label');

title.className = 'title';
description.className = 'description';
wrapper.className = 'wrapper';
textArea.className = 'textarea';
kayboardContainer.className = 'board';
checkboxDiv.className = 'checkbox-container';
checkbox.className = 'sticky-checkbox';
checkbox.type = 'checkbox';
checkbox.id = 'sticky';
checkbox.name = 'sticky';
labelForCheckbox.setAttribute('for', 'sticky');
labelForCheckbox.className = 'checkbox-label';
labelForCheckbox.textContent = 'Sticky mode (for virtual Shift and LeftCtrl buttons only)';
title.textContent = 'RSS Virtual Keyboard';
description.textContent = 'This keyboard was created on Windows. To change language press "Left Ctrl + Left Alt".';

const storagedLang = localStorage.getItem('language');
const keyboard = new Keyboard(storagedLang, kayboardContainer, textArea);

checkboxDiv.append(checkbox);
checkboxDiv.append(labelForCheckbox);

wrapper.append(title);
wrapper.append(textArea);
wrapper.append(kayboardContainer);
wrapper.append(description);
wrapper.append(checkboxDiv);
body.append(wrapper);
keyboard.init();
keyboard.configuratePhysicalButtons();
