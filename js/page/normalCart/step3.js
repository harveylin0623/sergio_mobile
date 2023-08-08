export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      orderNumber: '',
      manageType: '',
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      managePage() {
        let mapping = {
          normal: this.pageUrl.orderManage,
          preorder: this.pageUrl.preorderManage,
          group: this.pageUrl.groupBuyManage
        }
        return mapping[this.manageType] || 'javascript:;'
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      this.orderNumber = window.getQuery('orderNumber')
      this.manageType = window.getQuery('type')
      this.isLoading = false
    }
  })
}