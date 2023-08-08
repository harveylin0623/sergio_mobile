export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      questionInfo: {},
      dialogueList: [],
      user: { reply: '' },
      isSubmit: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasQuestionInfo() {
        return !_.isEmpty(this.questionInfo)
      },
      isProductType() {
        if (!this.hasQuestionInfo) return false
        return this.questionInfo.type === 'product'
      },
      orderDetailPageUrl() {
        if (this.isProductType) return ''
        return `${this.pageUrl.orderManageDetail}?orderNumber=${this.questionInfo.order_num}`
      },
      hasReplyText() {
        return this.user.reply !== ''
      }
    },
    methods: {
      scrollToBottom() {
        this.$refs.dialogue.scrollTop = this.$refs.dialogue.scrollHeight
      },
      async getQuestionDetail() {
        let questionId = window.getQuery('questionId')
        let response = await customerServiceApi.online_service({ url: `${apiUrl.online_service}/${questionId}` })
        if (response.status === 0) return location.href = this.pageUrl.questionManage
        this.questionInfo = response.aaData
        this.dialogueList = _.cloneDeep(response.aaData.message)
        await this.$nextTick()
        this.scrollToBottom()
      },
      async submitHandler() {
        if (!this.hasReplyText) return
        if (this.isSubmit) return
        this.isSubmit = true
        let response = await customerServiceApi.online_service_message({ 
          url: apiUrl.online_service_message,
          data: { id: this.questionInfo.id, message: this.user.reply }
        })
        if (response.status === 0) return this.isSubmit = false
        this.user.reply = ''
        this.dialogueList.push(response.message)
        await this.$nextTick()
        this.scrollToBottom()
        this.isSubmit = false
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      await this.getQuestionDetail()
      this.isLoading = false
    }
  })
}