(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DigitalMap = factory());
}(this, (function () {
	class DigitalMap {
    constructor(props) {
      this.mapUrl = props.mapUrl
      this.mapReplyUrl = props.mapReplyUrl
      this.marketType = props.marketType
      this.successCallback = props.successCallback
      this.random = Date.now().toString().slice(-10) //綠界api要用的(避免撈到之前選的門市)
      this.checkedTimer = null
      this.closedTimer = null
      this.init()
    }
    init() {
      this.openDigitalMap()
    }
    async checkReply() {
      let response = await logisticsApi.mapReply({ url: `${this.mapReplyUrl}/${this.random}` })
      if (response.status === 1) {
        this.clearAllTimer()
        this.successCallback(response.csvMap)
      } else {
        this.checkedTimer = setTimeout(() => {
          this.checkReply()
        }, 2000)
      }
    }
    async openDigitalMap() {
      let response = await logisticsApi.map({
        url: this.mapUrl,
        data: {
          random: this.random,
          logisticsType: 'CVS',
          logisticsSubType: this.marketType,
          isCollection: 'N',
          extraData: ''
        }
      })
      let mapWindow = window.openThirdPartyPaymentWindow(response.form)
      this.checkReply()
      this.checkWindowIsOpen(mapWindow)
    }
    checkWindowIsOpen(currentWindow) {
      let isClosed = currentWindow.closed
      if (isClosed) {
        this.clearAllTimer()
      } else {
        this.closedTimer = setTimeout(() => {
          this.checkWindowIsOpen(currentWindow)
        }, 2000)
      }
    }
    clearAllTimer() {
      clearTimeout(this.checkedTimer)
      clearTimeout(this.closedTimer)
    }
  }

  return DigitalMap
})));