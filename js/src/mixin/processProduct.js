(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.processProductMixin = factory());
}(this, (function () {
  return {
    methods: {
      processProduct(payload) {
				return payload.reduce((prev, current) => {
					let { product_code, product_name, main_image, product_price, product_promo_price, category_id } = current
					let linkUrl = `${this.pageUrl.productDetail}?productCode=${product_code}&category_id=${category_id}`
					prev.push({ product_code, product_name, main_image, product_price, product_promo_price, linkUrl })
					return prev
				}, [])
			},
    }
  }
})));