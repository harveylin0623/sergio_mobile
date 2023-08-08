(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.encodePhoneTextMixin = factory());
}(this, (function () {
  return {
    computed: {
      encodePhoneText() {
        let phoneNumber = this.user.mobile
        if (phoneNumber === '') return ''
        return phoneNumber.replace(phoneNumber.substring(4,8), '****')
      }
    },
  }
})));