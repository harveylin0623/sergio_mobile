(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.LoadingImage = factory());
}(this, (function () {
	class LoadingImage {
    constructor() {
      this.image = null
    }
    load(imgUrl) {
      return new Promise((resolve, reject) => {
        this.image = new Image()
        this.image.src = imgUrl
        if (this.image.complete) {
          resolve({ status: true })
        } else {
          this.image.onload = () => {
            resolve({ status: true })
          }
          this.image.onerror = () => {
            resolve({ status: false })
          } 
        }
      })
    }
  }

  return LoadingImage
})));