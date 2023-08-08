(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wm_aes = factory());
}(this, (function () {
	return (input) => {
		let meta = document.querySelector('[name=aes_key]');
		if (meta === null) throw new Error('not found aes_key');
		let keyHash = CryptoJS.SHA384(meta.content);
		let key = CryptoJS.enc.Hex.parse(keyHash.toString().substring(0, 64));
		let iv = CryptoJS.enc.Hex.parse(keyHash.toString().substring(64, 96));
		let encrypted = CryptoJS.AES.encrypt(input, key, { iv: iv });
		return encrypted.toString();
	}
})));