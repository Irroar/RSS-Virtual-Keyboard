export default class Key {
  constructor(value, keyCode, isChar) {
    this.value = value;
    this.keyCode = keyCode;
    this.isChar = isChar;
    this.isCapsed = false;
  }

  updateValue(value) {
    this.value = value;
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
    } else { this.value = this.value.toLowerCase(); }
  }
}
