import Key from './Key';
import enConfig from './config/en-config.json';

export default class Keyboard {
  constructor(lang, container, textArea) {
    this.lang = lang;
    this.textArea = textArea;
    this.keys = [];
    this.container = container;
  }

  init() {
    const keysLayout = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9',
      'Digit0', 'Minus', 'Equal', 'Backspace', 'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT',
      'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete', 'CapsLock', 'KeyA',
      'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote',
      'Enter', 'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma',
      'Period', 'Slash', 'ArrowUp', 'ShiftRight', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'ArrowLeft',
      'ArrowDown', 'ArrowRight'];

    const simpleKeys = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9',
      'Digit0', 'Minus', 'Equal', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT',
      'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'KeyA',
      'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma',
      'Period', 'Slash', 'Space', 'Backquote'];

    keysLayout.forEach((item) => {
      const isChar = simpleKeys.includes(item) ? 1 : 0;

      const key = new Key(enConfig[item], item, isChar);
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

      if (key.isChar) {
        keyElement.addEventListener('click', () => {
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
        });
      }

      switch (item) {
        case 'Backspace':
          keyElement.addEventListener('click', () => {
            const startPosition = this.textArea.selectionStart;
            const endPosition = this.textArea.selectionEnd;

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
          });
          break;
        case 'Delete':
          keyElement.addEventListener('click', () => {
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
              if (keyItem.isChar) {
                keyItem.toggleCaps();
                const elem = document.querySelector(`[data-key-code=${keyItem.keyCode}]`);
                elem.innerHTML = keyItem.value;
              }
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
}
