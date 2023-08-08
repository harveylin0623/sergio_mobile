(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.activityApi = factory());
}(this, (function () {
  return {
    product_promotions(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    full_amount_price(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    full_amount_price_meta(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    full_amount_count(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    full_amount_count_meta(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    red_with_green(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    red_with_green_meta(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    limited_time(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    limited_time_meta(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    preorder(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    preorder_meta(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    groupbuy(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    groupbuy_meta(payload) {
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