(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.storageObj = factory());
}(this, (function () {
	const storageObj = {
		getItem(key) {
			let data = localStorage.getItem(key);
			return data !== null ? JSON.parse(data) : null;
		},
		setItem(key, payload) {
			localStorage.setItem(key, JSON.stringify(payload));
		},
		removeItem(key) {
			localStorage.removeItem(key);
		}
	};
	return storageObj;
})));

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.sessionStorageObj = factory());
}(this, (function () {
	const sessionStorageObj = {
		getItem(key) {
			let data = sessionStorage.getItem(key);
			return data !== null ? JSON.parse(data) : null;
		},
		setItem(key, payload) {
			sessionStorage.setItem(key, JSON.stringify(payload));
		},
		removeItem(key) {
			sessionStorage.removeItem(key);
		}
	}
	return sessionStorageObj;
})));