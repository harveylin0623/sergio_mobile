(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.orderPayMixin = factory());
}(this, (function () {
  return {
    data() {
			return {
        orderStatusList: { 
          0: '等待處理', 
          1: '訂單處理中', 
          2: '備貨中', 
          4: '已出貨', 
          6: '訂單已完成', 
          7: '退貨處理中', 
          8: '已退貨', 
          9: '訂單取消' 
        },
        payStatusList: { 
          0: '未付款', 
          1: '已付款', 
          4: '已退款', 
          11: '已取號' 
        },
			}
		}
  }
})));