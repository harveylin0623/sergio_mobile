(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.customAxios = factory());
}(this, (function () {
	const customAxios = axios.create({
		baseURL: document.querySelector('[name="base_url"]').content
	})
	const authKey = 'knn-userInfo'

	customAxios.interceptors.request.use(function (config) {
		let userInfo = window.storageObj.getItem(authKey)
		let token = userInfo !== null ? `Bearer ${userInfo.token}` : ''
		config.headers.Authorization = token
		return config
	}, function (error) {
		return Promise.reject(error)
	})

	customAxios.interceptors.response.use(function (response) {
		return response
	}, function (error) {
		let response = error.response
		let configUrl = response.config.url
		let whiteList = {
			me: 'third_party_auth/me',
			refresh: 'third_party_auth/refresh'
		}
		if (configUrl.includes(whiteList.me) || configUrl.includes(whiteList.refresh)) {
			return Promise.reject(error)
		}
		if (response.status === 401) {
			$('#reloginPopup').modal('show')
			$('#loading-backdrop').hide()
			window.storageObj.removeItem(authKey)
			window.sessionStorageObj.removeItem('cart-item-data')
			window.sessionStorageObj.removeItem('cart-user-data')
			window.sessionStorageObj.setItem('backUrl', { url: location.href })
			throw new Error('token is expired')
		}
		return Promise.reject(error)
	})

	return customAxios
})));