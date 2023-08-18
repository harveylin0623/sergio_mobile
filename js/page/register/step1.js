export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [checkBarcodeMixin, registerListMixin, userAddressMixin, userBirthdayMixin],
    store: window.myVuexStore,
    data: {
      user: { mobile: '', email: '', password: '', confirm_password: '', name: '', gender: '', security_question: '', security_answer: '', einvoice_carrier_no: '', agree: false },
      termInfo: {},
      termModal: { title: '', content: '' },
      tipInfo: { message: '' },
      isLoading: false,
      apiUrl,
      pageUrl,
      stepList: [
        { text: '填寫資料', done: false },
        { text: '手機驗證', done: false },
      ]
    },
    computed: {
      totalTerms() {
        return _.size(this.termInfo)
      }
    },
    methods: {
      createTermInfo({ term_information }) {
        if (term_information.length === 0) return
        return term_information[0].terms.reduce((prev, current) => {
          prev[current.id] = { ...current }
          return prev
        }, {})
      },
      shwoTermDetail(id) {
        let data = this.termInfo[id]
        this.termModal.title = data.title
        this.termModal.content = data.content
        $('#termPopup').modal('show')
      },
      async registerCheck() {
        let response = await authApi.register_check({
          url: apiUrl.register_check,
          data: {
            register_check: {
              mobile: window.wm_aes(this.user.mobile),
              password: window.wm_aes(this.user.password),
              confirm_password: window.wm_aes(this.user.confirm_password),
              name: this.user.name,
              gender: this.user.gender,
              security_question: this.user.security_question,
              security_answer: this.user.security_answer
            }
          }
        })
        return { status: response.status === 1, message: response.message }
      },
      async register() {
        let { city, district, road: address } = this.addressInfo
        let copyUser = _.cloneDeep(this.user)
        let birthday = this.createBirthdayText(true)
        copyUser.mobile = window.wm_aes(copyUser.mobile)
        copyUser.password = window.wm_aes(copyUser.password)
        copyUser.confirm_password = window.wm_aes(copyUser.confirm_password)
        delete copyUser.agree
        let response = await authApi.register({
          url: apiUrl.register,
          data: { register: { ...copyUser, birthday, city, district, address } }
        })
        let { status, message, aaData } = response
        return {
          status: status === 1,
          message,
          temp_access_token: aaData ? aaData.temp_access_token : ''
        }
      },
      errorHandler(message) {
        this.tipInfo.message = message
        $('#tipPopup').modal('show')
        this.isLoading = false
      },
      saveUserData(temp_access_token) {
        window.sessionStorageObj.setItem('register', {
          temp_access_token,
          payload: { user: this.user, userBirthday: this.userBirthday, addressInfo: this.addressInfo }
        })
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        let isValid2 = this.checkBirthdayIsValid()
        if (!isValid || !isValid2) return
        this.isLoading = true
        document.activeElement.blur()
        let checkInfo = await this.registerCheck()
        if (!checkInfo.status) return this.errorHandler(checkInfo.message)
        if (this.user.einvoice_carrier_no !== '') {
          let barcodeInfo = await this.checkBarcodeIsValid(this.user.einvoice_carrier_no)
          if (!barcodeInfo.status) return this.errorHandler(barcodeInfo.message)
        }
        let registerInfo = await this.register()
        if (!registerInfo.status) return this.errorHandler(registerInfo.message)
        this.saveUserData(registerInfo.temp_access_token)
        location.href = this.pageUrl.register_step2
      },
      async setUserData() {
        let storageData = window.sessionStorageObj.getItem('register')
        if (storageData === null) return
        let { user, userBirthday, addressInfo } = storageData.payload
        this.user = _.cloneDeep(user)
        this.addressInfo.city = addressInfo.city
        this.addressInfo.road = addressInfo.road
        this.userBirthday.year = userBirthday.year
        await this.$nextTick()
        this.addressInfo.district = addressInfo.district
        this.userBirthday.month = userBirthday.month
      }
    },
    async mounted() {
      this.isLoading = true
      let termRes = await termApi.brief_term({ url: apiUrl.term, data: { type: ['register'] } })
      this.termInfo = this.createTermInfo(termRes.aaData)
      this.setUserData()
      this.isLoading = false
    }
  })
}