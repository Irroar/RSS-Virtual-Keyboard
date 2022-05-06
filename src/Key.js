export default class Key {
  constructor(value, keyCode) {
    this.value = value;
    this.keyCode = keyCode;
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
}
