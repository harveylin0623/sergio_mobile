(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.getQuery = factory());
}(this, (function () {
	return function(key) {
    let params = (new URL(document.location)).searchParams;
    return params.get(key);
  }
})));