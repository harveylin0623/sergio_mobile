(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.memberApi = factory());
}(this, (function () {
  return {
    update_member_password(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    getProfile(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    summary(payload) {
      return customAxios({
        method: 'get',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    point_information(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    point_history(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    point_due_to_expire(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    updateProfile(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    update_member_mobile(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    member_verify(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    resend_member_verify(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    receipent(payload) {
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