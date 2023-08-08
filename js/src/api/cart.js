(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cartApi = factory());
}(this, (function () {
  return {
    getCart(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    addCart(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    removeCart(payload) {
      return customAxios({
        method: 'delete',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    getProductPromotions(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    getLimitedTime(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    cart_total(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    product_promotions(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    product_promotions_limit_time(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    cart_purchase(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    paymemt(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    invoice(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    valid_coupon(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    cart_calculate(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    preorderCart(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    groupbuy_cart(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
  }
})));