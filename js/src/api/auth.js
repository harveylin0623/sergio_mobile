(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.authApi = factory());
}(this, (function () {
  return {
    login(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    externalLogin(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    loginOut(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    register_check(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    register(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    register_verify(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    resend_register_verify(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    recaptcha(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    forget_password(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    resend_forget_verify(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    forget_password_verify(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    reset_password(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    checkToken(payload) {
      return customAxios({
        method: 'post',
        ...payload
      }).then(res => {
        return res.data
      }).catch(err => {
        return err.response.data
      })
    },
    refreshToken(payload) {
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