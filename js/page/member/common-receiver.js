export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      receipentList: [],
      receipentId: 0, 
      actionType: '',
      tipInfo: { status: false, message: '' },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      addReceipent() {
        this.actionType = 'add'
        this.$refs.receiverModal.reset()
        this.$refs.receiverModal.toggleModal(true)
      },
      editReceiver(payload) {
        this.actionType = 'update'
        this.receipentId = payload.id
        this.$refs.receiverModal.setUserData(payload)
        this.$refs.receiverModal.toggleModal(true)
      },
      async getReceipent() {
        let response = await memberApi.receipent({ url: apiUrl.receipent, method: 'get' })
        this.receipentList = response.aaData
      },
      async handleReceiver(payload) {
        this.isLoading = true
        let url = this.actionType === 'add' ? apiUrl.receipent : `${apiUrl.receipent}/${this.receipentId}`
        let method = this.actionType === 'add' ? 'post' : 'put'
        let response = null
        try {
          response = await memberApi.receipent({ url, method, data: { ...payload } })
        } catch(err) {
          this.$refs.receiverModal.toggleModal(false)
          return
        }
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        if (this.tipInfo.status) await this.getReceipent()
        this.$refs.receiverModal.toggleModal(false)
        $('#tipPopup').modal('show')
        this.isLoading = false
      },
      async deleteReceiver({ id }) {
        this.isLoading = true
        await memberApi.receipent({ url: `${apiUrl.receipent}/${id}`, method: 'delete' })
        let index = this.receipentList.findIndex(receipent => receipent.id === id)
        this.receipentList.splice(index, 1)
        this.isLoading = false
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      await this.getReceipent()
      this.isLoading = false
    }
  })
}