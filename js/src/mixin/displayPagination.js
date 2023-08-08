(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.displayPagination = factory());
}(this, (function () {
  return {
    computed: {
      displayPagination() {
        return this.paginationInfo.totalPage > 1
      }
    }
  }
})));