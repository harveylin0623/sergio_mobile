(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.createSpecSlideListMixin = factory());
}(this, (function () {
  return {
    methods: {
      createSpecSlideList(lists) {
        return lists.reduce((prev, current) => {
          prev = prev.concat(current.images)
          return prev
        }, [])
      },
    }
  }
})));