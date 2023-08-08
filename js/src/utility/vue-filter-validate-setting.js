(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.vue_validator = factory());
}(this, (function () {
	//===vue filter
	Vue.filter('currency', function (dollar) {
		var n = 0;  //n: length of decimal
		var x = 3   //x: length of sections
		var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
		return dollar.toFixed(Math.max(0, n)).replace(new RegExp(re, 'g'), '$&,');
	});

	Vue.filter('hideText', function (text) {
		return text.replace(/(.{3})(.+)(.{3})/g, function (match, start, middle, end) {
			return start + '*'.repeat(middle.length) + end;
		});
	});

	//===vue veevalidate rule
	Vue.component('validation-observer', VeeValidate.ValidationObserver);
	Vue.component('validation-provider', VeeValidate.ValidationProvider);
	VeeValidate.setInteractionMode('eager');

	VeeValidate.extend('required', {
		message: '必填',
		validate(value) {
			return {
				required: true,
				valid: ['', null, undefined].indexOf(value) === -1
			};
		},
		computesRequired: true
	});

	VeeValidate.extend('email', {
		message: '電子信箱格式有誤',
		validate(value) {
			let rule = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			return rule.test(value);
		}
	});

	VeeValidate.extend('confirmEmail', {
		params: ['target'],
		message: '確認電子信箱有誤',
		validate(value, { target }) {
			return value === target;
		}
	});

	VeeValidate.extend('password', {
		message: '密碼格式有誤',
		validate(value) {
			let rule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/
			return rule.test(value);
		}
	});

	VeeValidate.extend('confirmPw', {
		params: ['target'],
		message: '確認密碼有誤',
		validate(value, { target }) {
			return value === target;
		}
	});

	VeeValidate.extend('phone', {
		message: '手機號碼格式有誤',
		validate(value) {
			return /^09\d{8}$/.test(value);
		}
	});

	VeeValidate.extend('birthday', {
		message: '出生日期範圍異常',
		validate(value) {
			let today = new Date();
			today = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
			let birthday = new Date(value).getTime();
			let minDate = new Date(1902, 0, 1).getTime();
			return birthday >= minDate && birthday < today;
		}
	});

	VeeValidate.extend('term', {
		message: '請同意條款',
		validate(value) {
			return value;
		}
	});

	VeeValidate.extend('real-name', {
		message: '中文2~5字元,英文4~10字元。中英文不能混用。',
		validate(value) {
			return /^([\u4e00-\u9fa5]{2,5}$|[a-zA-Z]{4,10}$)/.test(value)
		}
	});

	VeeValidate.extend('mobile-vehicle', {
		message: '手機載具格式有誤',
		validate(value) {
			return taiwanIdValidator.isEInvoiceCellPhoneBarcodeValid(value)
		}
	});

	VeeValidate.extend('natural-person', {
		message: '自然人憑證格式有誤',
		validate(value) {
			return taiwanIdValidator.isCitizenDigitalCertificateNumberValid(value)
		}
	});

	VeeValidate.extend('tax-id', {
		message: '統一編號格式有誤',
		validate(value) {
			return taiwanIdValidator.isGuiNumberValid(value)
		}
	});

})));