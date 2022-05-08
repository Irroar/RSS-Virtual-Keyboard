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
        let intervalId = null;
        keyElement.addEventListener('mousedown', () => {
          this.inputChar(key);
          keyElement.classList.add('pressed');
          setTimeout(() => {
            intervalId = setInterval(() => {
              this.inputChar(key);
              keyElement.classList.add('pressed');
            }, 40);
          }, 500);
        });
        keyElement.addEventListener('mouseout', () => {
          clearInterval(intervalId);
          keyElement.classList.remove('pressed');
          this.buttonPressCounter = 0;
        });
        keyElement.addEventListener('mouseup', () => {
          clearInterval(intervalId);
          keyElement.classList.remove('pressed');
          this.buttonPressCounter = 0;
        });
      }

      switch (item) {
        case 'Backspace':
          keyElement.addEventListener('click', () => {
            this.removeChar('left');
          });
          break;
        case 'Delete':
          keyElement.addEventListener('click', () => {
            this.removeChar('right');
          });
          break;
        case 'Enter':
          keyElement.addEventListener('click', () => {
            const startPosition = this.textArea.selectionStart;
            const endPosition = this.textArea.selectionEnd;
            if (startPosition === endPosition) {
              this.textArea.value = `${this.textArea.value.slice(0, startPosition)}\n${this.textArea.value.slice(startPosition, this.textArea.value.length)}`;
              this.textArea.focus();
              this.textArea.selectionEnd = startPosition + 1;
            } else {
              this.textArea.value = `${this.textArea.value.slice(0, startPosition)}\n${this.textArea.value.slice(endPosition, this.textArea.value.length)}`;
              this.textArea.focus();
              this.textArea.selectionEnd = startPosition + 1;
            }
          });
          break;
        case 'Tab':
          keyElement.addEventListener('click', () => {
            const startPosition = this.textArea.selectionStart;
            const endPosition = this.textArea.selectionEnd;
            if (startPosition === endPosition) {
              this.textArea.value = `${this.textArea.value.slice(0, startPosition)}\t${this.textArea.value.slice(startPosition, this.textArea.value.length)}`;
              this.textArea.focus();
              this.textArea.selectionEnd = startPosition + 1;
            } else {
              this.textArea.value = `${this.textArea.value.slice(0, startPosition)}\t${this.textArea.value.slice(endPosition, this.textArea.value.length)}`;
              this.textArea.focus();
              this.textArea.selectionEnd = startPosition + 1;
            }
          });
          break;
        case 'CapsLock':
          keyElement.addEventListener('click', () => {
            keyElement.classList.toggle('pressed');
            this.keys.forEach((keyItem) => {
              if (keyItem.isChar) { keyItem.toggleCaps(); }
            });
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
        if (this.capsCounter < 2) { elem.classList.toggle('pressed'); }
      } else if (elem) { elem.classList.add('pressed'); }
      if (this.keysLayout.includes(e.code)) { e.preventDefault(); }
      if (this.simpleKeys.includes(e.code)) {
        const startPosition = this.textArea.selectionStart;
        const endPosition = this.textArea.selectionEnd;
        let inputChar = '';
        this.keys.forEach((keyItem) => {
          if (keyItem.keyCode === e.code) { inputChar = keyItem.value; }
        });
        if (startPosition === endPosition) {
          this.textArea.value = this.textArea.value.slice(0, startPosition) + inputChar
            + this.textArea.value.slice(startPosition, this.textArea.value.length);
          this.textArea.focus();
          this.textArea.selectionEnd = startPosition + 1;
        } else {
          this.textArea.value = this.textArea.value.slice(0, startPosition) + inputChar
                          + this.textArea.value.slice(endPosition, this.textArea.value.length);
          this.textArea.focus();
          this.textArea.selectionEnd = startPosition + 1;
        }
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
        case 'Delete': {
          const startPosition = this.textArea.selectionStart;
          const endPosition = this.textArea.selectionEnd;
          if (startPosition === endPosition) {
            this.textArea.value = this.textArea.value.slice(0, startPosition)
                        + this.textArea.value.slice(startPosition + 1, this.textArea.value.length);
            this.textArea.focus();
            this.textArea.selectionEnd = startPosition;
          } else {
            this.textArea.value = this.textArea.value.slice(0, startPosition)
                              + this.textArea.value.slice(endPosition, this.textArea.value.length);
            this.textArea.focus();
            this.textArea.selectionEnd = startPosition;
          }
          break;
        }
        case 'CapsLock':
          this.keys.forEach((keyItem) => {
            if (keyItem.isChar) { keyItem.toggleCaps(); }
          });
          break;
        case 'Tab': {
          const startPosition = this.textArea.selectionStart;
          const endPosition = this.textArea.selectionEnd;
          if (startPosition === endPosition) {
            this.textArea.value = `${this.textArea.value.slice(0, startPosition)}\t${this.textArea.value.slice(startPosition, this.textArea.value.length)}`;
            this.textArea.focus();
            this.textArea.selectionEnd = startPosition + 1;
          } else {
            this.textArea.value = `${this.textArea.value.slice(0, startPosition)}\t${this.textArea.value.slice(endPosition, this.textArea.value.length)}`;
            this.textArea.focus();
            this.textArea.selectionEnd = startPosition + 1;
          }
          break;
        }
        case 'Enter': {
          const startPosition = this.textArea.selectionStart;
          const endPosition = this.textArea.selectionEnd;
          if (startPosition === endPosition) {
            this.textArea.value = `${this.textArea.value.slice(0, startPosition)}\n${this.textArea.value.slice(startPosition, this.textArea.value.length)}`;
            this.textArea.focus();
            this.textArea.selectionEnd = startPosition + 1;
          } else {
            this.textArea.value = `${this.textArea.value.slice(0, startPosition)}\n${this.textArea.value.slice(endPosition, this.textArea.value.length)}`;
            this.textArea.focus();
            this.textArea.selectionEnd = startPosition + 1;
          }
          break;
        }
        case 'Backspace': {
          const startPosition = this.textArea.selectionStart;
          const endPosition = this.textArea.selectionEnd;
          if (endPosition === 0) {
            this.textArea.focus();
            this.textArea.selectionEnd = startPosition;
            break;
          }
          if (startPosition === endPosition) {
            this.textArea.value = this.textArea.value.slice(0, startPosition - 1)
                          + this.textArea.value.slice(startPosition, this.textArea.value.length);
            this.textArea.focus();
            this.textArea.selectionEnd = startPosition - 1;
          } else {
            this.textArea.value = this.textArea.value.slice(0, startPosition)
                            + this.textArea.value.slice(endPosition, this.textArea.value.length);
            this.textArea.focus();
            this.textArea.selectionEnd = startPosition;
          }
          break;
        }
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

  inputChar(key) {
    const startPosition = this.textArea.selectionStart;
    const endPosition = this.textArea.selectionEnd;
    if (startPosition === endPosition) {
      this.textArea.value = this.textArea.value.slice(0, startPosition) + key.value
      + this.textArea.value.slice(startPosition, this.textArea.value.length);
      this.textArea.focus();
      this.textArea.selectionEnd = startPosition + 1;
    } else {
      this.textArea.value = this.textArea.value.slice(0, startPosition) + key.value
                    + this.textArea.value.slice(endPosition, this.textArea.value.length);
      this.textArea.focus();
      this.textArea.selectionEnd = startPosition + 1;
    }
  }

  removeChar(direction) {
    const leftOffset = direction === 'left' ? 1 : 0;
    const rightOffset = direction === 'left' ? 0 : 1;

    const startPosition = this.textArea.selectionStart;
    const endPosition = this.textArea.selectionEnd;

    if (direction === 'left' && endPosition === 0) {
      this.textArea.focus();
      this.textArea.selectionEnd = startPosition;
      return;
    }

    if (startPosition === endPosition) {
      this.textArea.value = this.textArea.value.slice(0, startPosition - leftOffset)
              + this.textArea.value.slice(startPosition + rightOffset, this.textArea.value.length);
      this.textArea.focus();
      this.textArea.selectionEnd = startPosition - leftOffset;
    } else {
      this.textArea.value = this.textArea.value.slice(0, startPosition)
                          + this.textArea.value.slice(endPosition, this.textArea.value.length);
      this.textArea.focus();
      this.textArea.selectionEnd = startPosition;
    }
  }
}
