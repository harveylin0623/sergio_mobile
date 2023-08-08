(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.registerListMixin = factory());
}(this, (function () {
  return {
    data() {
      return {
        genderList: [
          { title: '男', value: 'M' },
          { title: '女', value: 'F' },
          { title: '保密', value: 'S' },
        ],
        questionList: [
          { title: '您畢業的國小', value: 'sq01' },
          { title: '您最愛的寵物名字', value: 'sq02' },
          { title: '您最愛的食物', value: 'sq03' },
          { title: '您最好朋友的名字', value: 'sq04' },
          { title: '您最愛的電影', value: 'sq05' },
          { title: '您的姓名', value: 'sq06' },
          { title: '您的生日', value: 'sq07' },
        ]
      }
    }
  }
})));