(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.openThirdPartyPaymentWindow = factory());
}(this, (function () {
	return function(html) {
    let webUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    return window.open(webUrl)
  }
})));