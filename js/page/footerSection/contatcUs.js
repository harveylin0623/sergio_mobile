export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      user: { name: '', email: '', title: '', content: '', type: 0 },
      questionList: [],
      tipInfo: { status: false, message: '' },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      resetForm() {
        for (let key in this.user) {
          this.user[key] = key !== 'type' ? '' : 0
        }
        this.$refs.form.reset()
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        this.isLoading = true
        let response = await customerServiceApi.contact_us({ url: apiUrl.contact_us, data: this.user })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        if (this.tipInfo.status) this.resetForm()
        $('#tipPopup').modal('show')
        this.isLoading = false
      },
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      this.questionList = await customerServiceApi.question_type({ url: apiUrl.question_type }).then(res => res.aaData)
      this.isLoading = false
    }
  })
}