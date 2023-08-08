(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.invoiceApi = factory());
}(this, (function () {
  return {
    check_barcode(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    }
  }
})));