Vue.component('cvs-delivery-form', {
  props: {
    deliveryType: { type: String, default: '' },
    mapUrl: { type: String, required: true },
    mapReplyUrl: { type: String, required: true },
  },
  data() {
    return {
      digitalMap: null,
      marketInfo: { type: '', CVSAddress: '', CVSOutSide: '', CVSStoreID: '', CVSStoreName: '', CVSTelephone: '' },
      supermarket: { name: '', mobile: '', email: '', remark: '' },
    }
  },
  computed: {
    isActive() {
      return this.deliveryType === 'CVS'
    },
    showStoreName() {
      return this.marketInfo.CVSStoreName !== ''
    }
  },
  methods: {
    openDigitalMap(type) {
      this.marketInfo.type = type
      if (this.digitalMap !== null) { //防止重複啟動電子地圖
        this.digitalMap.clearAllTimer()
        this.digitalMap = null
      }
      this.digitalMap = new window.DigitalMap({
        mapUrl: this.mapUrl,
        mapReplyUrl: this.mapReplyUrl,
        marketType: type,
        successCallback: (payload) => {
          this.digitalMap = null
          for (let key in this.marketInfo) {
            if (key === 'type') continue
            this.marketInfo[key] = payload[key]
          }
        }
      })
    },
    async validate() {
      let userDataIsValid = await this.$refs.form.validate()
      let addressIsValid = this.marketInfo.CVSStoreName !== ''
      return {
        formIsValid: userDataIsValid && addressIsValid,
        addressIsValid
      }
    }
  },
  template: `
    <div class="tab-pane px-2 py-3" :class="{active:isActive}">
      <div>
        <div class="title mb-2">
          <h3>
            <span class="text-tomatoRed">*</span>超商資訊
          </h3>
        </div>
        <div class="form-group">
          <div href="javascript:;" class="w-100">
            <div class="px-2 py-3 border bd-limeGreen bg-white rounded">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <i class="fal fa-store text-limeGreen"></i> 
                </div>
                <div class="px-2 flex-fill title sm">
                  <p v-show="showStoreName">
                    {{ marketInfo.CVSStoreName }}店
                  </p>
                  <p class="text-secondary">{{ marketInfo.CVSAddress }}</p>
                </div>
                <a href="javascript:;" class="flex-shrink-0 flex-grow-0 mr-auto title sm text-moBlue" data-toggle="modal" data-target="#marketPopup">
                  <u>選擇門市</u>
                </a>
              </div>
            </div>
          </div>
        </div>
        <validation-observer tag="div" ref="form">
          <div class="form-row">
            <validation-provider tag="div" class="form-group col-12" rules="required|real-name" v-slot="{ errors,failed }">
              <label class="title sm" for="">
                <span class="text-tomatoRed">*</span>取件人姓名
              </label>
              <input 
                type="text" 
                class="form-control" 
                placeholder="請輸入姓名" 
                v-model.trim="supermarket.name"
              />
              <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
            </validation-provider>
            <validation-provider tag="div" class="form-group col-12" rules="required|phone" v-slot="{ errors,failed }">
              <label class="title sm" for="">
                <span class="text-tomatoRed">*</span>手機號碼
              </label>
              <input 
                type="number" 
                class="form-control" 
                inputmode="tel" 
                placeholder="請輸入手機號碼" 
                v-model.trim="supermarket.mobile"
              />
              <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
            </validation-provider>
          </div>
          <validation-provider tag="div" class="form-group" rules="required|email" v-slot="{ errors,failed }">
            <label class="title sm" for="">
              <span class="text-tomatoRed">*</span>電子信箱
            </label>
            <input 
              type="email"
              class="form-control" 
              placeholder="請輸入電子信箱" 
              v-model.trim="supermarket.email"
            />
            <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
          </validation-provider>
          <div class="form-group mb-0">
            <label class="title sm" for="">備註</label>
            <textarea 
              class="form-control" 
              placeholder="請輸入備註" 
              v-model.trim="supermarket.remark"
            ></textarea>
          </div>
        </validation-observer>
      </div>
    </div>`
})