(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.contactMixin = factory());
}(this, (function () {
  return {
    methods: {
      async contactHandler(payload) {
        this.isLoading = true
        let response = null
        try {
          response = await customerServiceApi.online_service_create({
            url: this.apiUrl.online_service_create,
            data: {
              type: 'product',
              product_code: this.productInfo.product_code,
              order_num: '',
              title: payload.title,
              message: payload.message
            }
          })
        } catch (err) {
          this.$refs.contactModal.closeModal()
          this.isLoading = false
          return
        }
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        this.$refs.contactModal.closeModal(this.tipInfo.status)
        $('#tipPopup').modal('show')
        this.isLoading = false
      },
    }
  }
})));