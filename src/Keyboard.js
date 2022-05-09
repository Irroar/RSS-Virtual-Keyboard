import Key from './Key';
import enConfig from './config/en-config.json';
import ruConfig from './config/ru-config.json';

export default class Keyboard {
  constructor(lang, container, textArea) {
    this.lang = lang;
    this.textArea = textArea;
    this.keys = [];
    this.container = container;
    this.isPressed = {
      ShiftLeft: false,
      ShiftRight: false,
      ControlLeft: false,
      ControlRight: false,
      AltLeft: false,
      CapsLock: false,
    };
    this.currentConfig = this.lang === 'en' ? enConfig : ruConfig;
    this.capsCounter = 0;
    this.isCapsPressed = false;
  }

  init() {
    this.keysLayout = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9',
      'Digit0', 'Minus', 'Equal', 'Backspace', 'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT',
      'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete', 'CapsLock', 'KeyA',
      'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote',
      'Enter', 'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma',
      'Period', 'Slash', 'ArrowUp', 'ShiftRight', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'ArrowLeft',
      'ArrowDown', 'ArrowRight'];

    this.simpleKeys = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9',
      'Digit0', 'Minus', 'Equal', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT',
      'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'KeyA',
      'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma',
      'Period', 'Slash', 'Space', 'Backquote', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

    this.keysLayout.forEach((item) => {
      const isChar = this.simpleKeys.includes(item) ? 1 : 0;

      const key = new Key(this.currentConfig[item], item, isChar);
      let option;
      switch (item) {
        case 'Tab':
        case 'ControlLeft':
        case 'ControlRight':
        case 'ShiftLeft':
          option = 'onefive';
          break;
        case 'ShiftRight':
          option = 'rightshift';
          break;
        case 'CapsLock':
        case 'Backspace':
        case 'Enter':
          option = 'double';
          break;
        case 'Space':
          option = 'space';
          break;
        default:
          option = null;
      }
      const keyElement = key.createElement(option);
      key.on('valueChanged', this.renderKeyboard);
      if (key.isChar) {
        this.initListeners(keyElement, this.inputChar, key.value);
        // let intervalId = null;
        // let timeoutId = null;
        // keyElement.addEventListener('mousedown', () => {
        //   this.inputChar(key.value);
        //   this.textArea.focus();
        //   keyElement.classList.add('pressed');
        //   timeoutId = setTimeout(() => {
        //     intervalId = setInterval(() => {
        //       this.inputChar(key.value);
        //       this.textArea.focus();
        //       keyElement.classList.add('pressed');
        //     }, 40);
        //   }, 500);
        // });
        // keyElement.addEventListener('mouseout', () => {
        //   clearTimeout(timeoutId);
        //   clearInterval(intervalId);
        //   this.textArea.focus();
        //   keyElement.classList.remove('pressed');
        // });
        // keyElement.addEventListener('mouseup', () => {
        //   clearInterval(intervalId);
        //   clearTimeout(timeoutId);
        //   this.textArea.focus();
        //   keyElement.classList.remove('pressed');
        // });
      }

      switch (item) {
        case 'Backspace':
          this.initListeners(keyElement, this.removeChar, 'left');
          break;
        case 'Delete':
          this.initListeners(keyElement, this.removeChar, 'right');
          break;
        case 'Enter':
          keyElement.addEventListener('click', () => {
            this.inputChar('\n');
            this.textArea.focus();
          });
          break;
        case 'Tab':
          keyElement.addEventListener('click', () => {
            this.inputChar('\t');
            this.textArea.focus();
          });
          break;
        case 'CapsLock':
          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.toggle('pressed');
            this.keys.forEach((keyItem) => {
              if (keyItem.isChar) { keyItem.toggleCaps(); }
            });
            this.textArea.focus();
          });
          break;
        default:
          break;
      }

      this.keys.push(key);
      this.container.append(keyElement);
    });
  }

  configuratePhysicalButtons() {
    document.addEventListener('keydown', (e) => {
      const elem = document.querySelector(`[data-key-code=${e.code}]`);
      if (elem && e.code === 'CapsLock') {
        this.capsCounter += 1;
        if (this.capsCounter < 2) {
          elem.classList.toggle('pressed');
          this.keys.forEach((keyItem) => {
            if (keyItem.isChar) { keyItem.toggleCaps(); }
          });
        }
      } else if (elem) { elem.classList.add('pressed'); }
      if (this.keysLayout.includes(e.code)) { e.preventDefault(); }
      if (this.simpleKeys.includes(e.code)) {
        let inputChar = '';
        this.keys.forEach((keyItem) => {
          if (keyItem.keyCode === e.code) { inputChar = keyItem.value; }
        });
        this.inputChar(inputChar);
      }

      switch (e.code) {
        case 'ShiftLeft':
        case 'ShiftRight':
          if (!this.isPressed[e.code]) {
            this.keys.forEach((keyItem) => {
              if (keyItem.isChar) { keyItem.toggleCaps(); }
              keyItem.toggleShift(this.currentConfig.Shifted, this.currentConfig);
            });
          }
          this.isPressed[e.code] = true;
          break;
        case 'AltLeft': {
          if (this.isPressed.ControlLeft || this.isPressed.ControlRight) {
            const newLangConfig = this.lang === 'en' ? ruConfig : enConfig;
            this.keys.forEach((keyItem) => {
              if (keyItem.isChar) { keyItem.changeLanguage(newLangConfig); }
            });
            this.lang = this.lang === 'en' ? 'ru' : 'en';
            localStorage.setItem('language', this.lang);
            this.currentConfig = newLangConfig;
            this.isPressed[e.code] = true;
          }
          break;
        }
        case 'ControlLeft':
          this.isPressed[e.code] = true;
          break;
        case 'Delete':
          this.removeChar('right');
          break;
        case 'Tab':
          this.inputChar('\t');
          break;
        case 'Enter':
          this.inputChar('\n');
          break;
        case 'Backspace':
          this.removeChar('left');
          break;
        default:
          break;
      }
    });

    document.addEventListener('keyup', (e) => {
      const elem = document.querySelector(`[data-key-code=${e.code}]`);
      if (elem && e.code !== 'CapsLock') { elem.classList.remove('pressed'); }
      if (elem && e.code === 'CapsLock') { this.capsCounter = 0; }
      switch (e.code) {
        case 'ShiftLeft':
        case 'ShiftRight':
          this.keys.forEach((keyItem) => {
            if (keyItem.isChar) { keyItem.toggleCaps(); }
            keyItem.toggleShift(this.currentConfig.Shifted, this.currentConfig);
          });
          this.isPressed[e.code] = false;
          break;
        case 'AltLeft':
        case 'ControlLeft':
          this.isPressed[e.code] = false;
          break;
        default:
          break;
      }
    });
  }

  renderKeyboard() {
    const elem = document.querySelector(`[data-key-code=${this.keyCode}]`);
    elem.innerHTML = this.value;
  }

  inputChar(value) {
    const startPosition = this.textArea.selectionStart;
    const endPosition = this.textArea.selectionEnd;
    if (startPosition === endPosition) {
      this.textArea.value = this.textArea.value.slice(0, startPosition) + value
      + this.textArea.value.slice(startPosition, this.textArea.value.length);
      this.textArea.selectionEnd = startPosition + 1;
    } else {
      this.textArea.value = this.textArea.value.slice(0, startPosition) + value
                    + this.textArea.value.slice(endPosition, this.textArea.value.length);
      this.textArea.selectionEnd = startPosition + 1;
    }
  }

  removeChar(direction) {
    const leftOffset = direction === 'left' ? 1 : 0;
    const rightOffset = direction === 'left' ? 0 : 1;

    const startPosition = this.textArea.selectionStart;
    const endPosition = this.textArea.selectionEnd;

    if (direction === 'left' && endPosition === 0) {
      this.textArea.selectionEnd = startPosition;
      return;
    }

    if (startPosition === endPosition) {
      this.textArea.value = this.textArea.value.slice(0, startPosition - leftOffset)
              + this.textArea.value.slice(startPosition + rightOffset, this.textArea.value.length);
      this.textArea.selectionEnd = startPosition - leftOffset;
    } else {
      this.textArea.value = this.textArea.value.slice(0, startPosition)
                          + this.textArea.value.slice(endPosition, this.textArea.value.length);
      this.textArea.selectionEnd = startPosition;
    }
  }

  initListeners(element, func, option) {
    let intervalId = null;
    let timeoutId = null;
    element.addEventListener('mousedown', () => {
      func.call(this, option);
      this.textArea.focus();
      element.classList.add('pressed');
      timeoutId = setTimeout(() => {
        intervalId = setInterval(() => {
          func.call(this, option);
          this.textArea.focus();
          element.classList.add('pressed');
        }, 40);
      }, 500);
    });
    element.addEventListener('mouseout', () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      this.textArea.focus();
      element.classList.remove('pressed');
    });
    element.addEventListener('mouseup', () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      this.textArea.focus();
      element.classList.remove('pressed');
    });
  }
}
