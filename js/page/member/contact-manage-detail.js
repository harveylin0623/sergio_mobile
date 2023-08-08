export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      contactInfo: {},
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasContactInfo() {
        return !_.isEmpty(this.contactInfo)
      },
    },
    methods: {
      async getContactDetail() {
        let contactId = window.getQuery('contactId')
        let url = `${apiUrl.contact_us}/${contactId}`
        let response = await customerServiceApi.contact_us({ url, method: 'get' })
        if (response.status === 0) return location.href = this.pageUrl.contactUsManage
        this.contactInfo = response.aaData
      },
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      await this.getContactDetail()
      this.isLoading = false
    }
  })
}
