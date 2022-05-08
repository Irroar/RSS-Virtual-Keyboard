import EventEmitter from 'events';

export default class Key extends EventEmitter {
  constructor(value, keyCode, isChar) {
    super();
    this.value = value;
    this.keyCode = keyCode;
    this.isChar = isChar;
    this.isCapsed = false;
    this.isShifted = false;
  }

  createElement(option = null) {
    const key = document.createElement('button');
    key.className = 'btn';
    if (option) { key.classList.add(option); }
    key.innerHTML = this.value;
    key.dataset.keyCode = this.keyCode;
    return key;
  }

  toggleCaps() {
    this.isCapsed = !this.isCapsed;
    if (this.isCapsed) {
      this.value = this.value.toUpperCase();
      this.emit('valueChanged');
    } else { this.value = this.value.toLowerCase(); this.emit('valueChanged'); }
  }

  toggleShift(shifted, config) {
    this.isShifted = !this.isShifted;
    if (this.isShifted && Object.prototype.hasOwnProperty.call(shifted, this.keyCode)) {
      this.value = shifted[this.keyCode];
      this.emit('valueChanged');
    } else if (Object.prototype.hasOwnProperty.call(shifted, this.keyCode)) {
      Object.keys(shifted).forEach((item) => {
        if (shifted[item] === this.value) {
          this.value = config[item];
          this.emit('valueChanged');
        }
      });
    }
  }

  changeLanguage(langConfig) {
    this.value = langConfig[this.keyCode];
    if (this.isCapsed) {
      this.value = this.value.toUpperCase();
    }
    this.emit('valueChanged');
  }
}
