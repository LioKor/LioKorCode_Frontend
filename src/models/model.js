export default class Model {
  default = {
  }
  toNetworkNames = {
  }

  setDefault() {
    for (const key in this.default) {
      this[key] = this.default[key];
    }
  }

  constructor() {
    this.setDefault();
  }

  set(data) {
    for (let key in this.default) {
      if (this.default.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  toNetwork() {
    const data = {};
    for (const key in this.toNetworkNames) {
      data[this.toNetworkNames[key]] = this[key];
    }
    return data;
  }
}
