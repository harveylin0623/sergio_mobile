(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.scenesApi = factory());
}(this, (function () {
  return {
    banner(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    popularInfo(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    advertise(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    keyword(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    footerInfo(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    }
  }
})));
