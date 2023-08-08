export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, checkBarcodeMixin, registerListMixin, userAddressMixin, userBirthdayMixin],
    store: window.myVuexStore,
    data: {
      user: { mobile: '', name: '', gender: '', email: '', einvoice_carrier_no: '', security_question: '', security_answer: '' },
      hasBirthday: true,
      birthdayText: '',
      tipInfo: { status: false, message: '' },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      async setUserData(payload) {
        this.hasBirthday = payload.birthday !== undefined
        for (let key in this.user) {
          this.user[key] = payload[key] || ''
        }
        if (this.hasBirthday) {
          let dateObj = new Date(payload.birthday)
          this.userBirthday.year = dateObj.getFullYear()
          await this.$nextTick()
          this.userBirthday.month = dateObj.getMonth() + 1
          this.birthdayText = this.createBirthdayText(false)
        }
        this.addressInfo.city = payload.city || ''
        await this.$nextTick()
        this.addressInfo.district = payload.district || ''
        this.addressInfo.road = payload.address || ''
      },
      async getMemberData() {
        let profile = await  memberApi.getProfile({ url: apiUrl.member_profile })
        this.setUserData(profile.aaData.member_profile)
      },
      updateMemberStorageData() {
        let storage = window.storageObj.getItem(this.authKey)
        window.storageObj.setItem(this.authKey, {
          ...storage,
          ...this.user,
          birthday: this.createBirthdayText(true),
          city: this.addressInfo.city,
          district: this.addressInfo.district,
          address: this.addressInfo.road
        })
      },
      async verifyBarcode() {
        if (this.user.einvoice_carrier_no === '') return { status: true }
        let barcodeInfo = await this.checkBarcodeIsValid(this.user.einvoice_carrier_no)
        if (!barcodeInfo.status) {
          this.tipInfo.status = barcodeInfo.status
          this.tipInfo.message = barcodeInfo.message
          $('#tipPopup').modal('show')
          this.isLoading = false
        }
        return barcodeInfo
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        if (!this.hasBirthday) {
          let isValid2 = this.checkBirthdayIsValid()
          if (!isValid2) return
        }
        this.isLoading = true
        let barcodeRes = await this.verifyBarcode()
        if (!barcodeRes.status) return
        let copyUser = _.cloneDeep(this.user)
        let birthday = this.createBirthdayText(true)
        let response = await memberApi.updateProfile({
          url: apiUrl.member_profile,
          data: {
            member_profile: { ...copyUser, birthday, ...this.addressInfo, address: this.addressInfo.road }
          }
        })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        if (this.tipInfo.status) {
          this.hasBirthday = true
          this.birthdayText = this.createBirthdayText(false)
          this.updateMemberStorageData()
        }
        $('#tipPopup').modal('show')
        this.isLoading = false
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      await this.getMemberData()
      this.isLoading = false
    }
  })
}