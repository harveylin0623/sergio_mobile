(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.signUpStepMixin = factory());
}(this, (function () {
  return {
    data() {
      return {
        stepList: [
          { text: '填寫資料', done: false },
          { text: '手機驗證', done: false },
        ]
      }
    }
  }
})));