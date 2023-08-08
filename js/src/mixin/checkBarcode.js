(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.checkBarcodeMixin = factory());
}(this, (function () {
  return {
    methods: {
      async checkBarcodeIsValid(barcode) {
        let response = await invoiceApi.check_barcode({
          url: this.apiUrl.check_barcode,
          data: { barcode }
        })
        let isValid = response.data.IsExist === 'Y'
        return { status: isValid, message: isValid ? '' : '無效的手機載具' }
      },
    }
  }
})));