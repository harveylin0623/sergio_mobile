export default (() => {
  Vue.component('receiver-modal', {
    mixins: [userAddressMixin],
    props: {
      actionType: { type: String, required: true }
    },
    data: () => ({
      user: { name: '', mobile: '', email: '', preset: false },
      mappingEvent: { add: 'add', update: 'update' },
      mappingModalTitle: { add: '新增', update: '編輯' }
    }),
    computed: {
      eventName() {
        return this.mappingEvent[this.actionType] || ''
      },
      modalTitle() {
        return this.mappingModalTitle[this.actionType]
      }
    },
    methods: {
      toggleModal(isOpen) {
        $('#receiverPopup').modal(isOpen ? 'show' : 'hide')
      },
      reset() {
        this.user.name = ''
        this.user.mobile = ''
        this.user.email = ''
        this.user.preset = false
        this.addressInfo.city = ''
        this.addressInfo.road = ''
        this.$refs.form.reset()
      },
      async setUserData(payload) {
        this.user.name = payload.name
        this.user.mobile = payload.mobile
        this.user.email = payload.email
        this.user.preset = payload.preset === 1
        this.addressInfo.city = payload.city
        await this.$nextTick()
        this.addressInfo.district = payload.district
        this.addressInfo.road = payload.address
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        if (this.eventName === '') return
        this.$emit(this.eventName, {
          recipients_name: this.user.name,
          recipients_mobile: this.user.mobile,
          recipients_email: this.user.email,
          recipients_city: this.addressInfo.city,
          recipients_district: this.addressInfo.district,
          recipients_address: this.addressInfo.road,
          recipients_zipcode: this.addressInfo.code,
          preset: this.user.preset ? '1' : '0'
        })
      },
    },
    template: `
      <div class="modal receiver" id="receiverPopup" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header mx-auto">
              <h2>{{ modalTitle }}聯絡人</h2>
            </div>
            <div class="p-0 modal-body">
              <validation-observer tag="div" ref="form">
                <validation-provider tag="div" class="mb-2 form-group" rules="required|real-name"
                  v-slot="{ errors,failed }">
                  <label class="title sm" for="">
                    <span class="text-tomatoRed">*</span>
                    姓名<small>(中文2~5字元,英文4~10字元。中英文不能混用)</small>
                  </label>
                  <input type="text" class="form-control" placeholder="請輸入收件人姓名" v-model.trim="user.name"/>
                  <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
                </validation-provider>
                <validation-provider tag="div" class="mb-2 form-group" rules="required|phone"
                  v-slot="{ errors,failed }">
                  <label class="title sm" for="">
                    <span class="text-tomatoRed">*</span>手機號碼
                  </label>
                  <input type="number" class="form-control" inputmode="numeric" placeholder="請輸入收件人電話" v-model.trim="user.mobile"/>
                  <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
                </validation-provider>
                <validation-provider tag="div" class="mb-2 form-group" rules="required|email"
                  v-slot="{ errors,failed }">
                  <label class="title sm" for="">
                    <span class="text-tomatoRed">*</span>電子信箱
                  </label>
                  <input type="text" class="form-control" placeholder="請輸入電子信箱" v-model.trim="user.email"/>
                  <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
                </validation-provider>
                <div class="form-row">
                  <validation-provider tag="div" class="pr-1 mb-2 form-group col-6" rules="required"
                    v-slot="{ errors,failed }">
                    <label class="title sm" for="">
                      <span class="text-tomatoRed">*</span>地址
                    </label>
                    <select class="pr-1 form-control" v-model="addressInfo.city">
										  <option value="">請選擇</option>
										  <option v-for="(city,index) in cityList" :key="index" :value="city">{{ city }}
										  </option>
									  </select>
                    <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
                  </validation-provider>
                  <validation-provider tag="div" class="pl-1 mb-2 form-group col-6" rules="required"
                    v-slot="{ errors,failed }">
                    <label class="title sm" for="">&nbsp;</label>
                    <select class="form-control" v-model="addressInfo.district">
                      <option value="">請選擇</option>
                      <option v-for="(district,index) in districtList" :key:="index"
                        :value="district.name">
                        {{ district.name }}
                      </option>
									  </select>
                    <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
                  </validation-provider>
                  <validation-provider tag="div" class="mb-2 form-group col-12" rules="required"
                    v-slot="{ errors,failed }">
                    <input type="text" class="form-control" placeholder="詳細地址" v-model.trim="addressInfo.road"/>
                    <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
                  </validation-provider>
                </div>
                <div class="mb-0 form-group form-check">
                  <input type="checkbox" class="form-check-input" id="ec1" v-model="user.preset">
                  <label class="mb-0 form-check-label title sm" for="ec1">設定為「預設常用聯絡人」</label>
                </div>
              </validation-observer>
            </div>
            <div class="modal-footer justify-content-center">
              <button class="btn btn-outline-limeGreen limit" data-dismiss="modal">取消</button>
              <button class="btn btn-limeGreen limit" @click="submitHandler">確認</button>
            </div>
          </div>
        </div>
      </div>`
  })
})()