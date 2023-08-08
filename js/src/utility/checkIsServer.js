(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.checkIsServer = factory());
}(this, (function () {
	return function() {
    let urlObj = new URL(location.href)
    return !urlObj.hostname.includes('localhost')
  }
})));