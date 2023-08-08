(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.authMixin = factory());
}(this, (function () {
  return {
    data() {
			return {
				myHeader: null,
				authKey: 'knn-userInfo',
				logoutGoHome: true
			}
		},
		methods: {
			updateHeaderAuth(status) {
				this.$store.commit('setAuth', status)
				this.myHeader.setAuthStatus(status)
			},
			removeUserInStroageData() { //移除會員token和購物車儲存的資訊
				window.storageObj.removeItem(this.authKey)
				window.sessionStorageObj.removeItem('cart-item-data')
				window.sessionStorageObj.removeItem('cart-user-data')
			},
			async logoutHandler() {
				this.isLoading = true
				await authApi.loginOut({ url: this.apiUrl.logout, data: {} })
				this.removeUserInStroageData()
				if (!this.logoutGoHome) {
					this.updateHeaderAuth(false)
					this.isLoading = false
					return
				}
				location.href = this.pageUrl.home
			},
			async checkTokenIsValid({ throwError }) {
				let checkResult = await authApi.checkToken({ url: this.apiUrl.me, data: {} })
				if (checkResult.status === 1) return this.updateHeaderAuth(true)
				let refreshResult = await authApi.refreshToken({ url: this.apiUrl.refresh, data: {} })
				if (refreshResult.status === 1) {
					let userInfo = window.storageObj.getItem(this.authKey)
					userInfo.token = refreshResult.aaData.access_token
					window.storageObj.setItem(this.authKey, userInfo)
					this.updateHeaderAuth(true)
				} else {
					this.removeUserInStroageData()
					if (!throwError) return
					window.sessionStorageObj.setItem('backUrl', { url: location.href })
					$('#reloginPopup').modal('show')
					this.isLoading = false
					throw new Error('auth token is expired')
				}
			},
		},
		mounted() {
			this.myHeader = this.$refs.header
		}
  }
})));