Vue.component('home-delivery-from', {
  props: {
    deliveryType: { type: String, default: '' },
    hasReceipent: { type: Boolean, default: true },
  },
  data() {
    return {
      isSameOrderer: false,
      orderer: { name: '', email: '', mobile: '', tel: '', city: '', district: '', address: '', code: 0 },
      receiver: { name: '', email: '', mobile: '', tel: '', city: '', district: '', address: '', code: 0, remark: '' },
    }
  },
  computed: {
    isActive() {
      return this.deliveryType === 'HOME'
    },
    showCommonButton() {
      return this.hasReceipent && !this.isSameOrderer
    }
  },
  methods: {
    setIsSameValue(value) {
      this.isSameOrderer = value
    },
    setUserTel(value, character = 'receiver') {
      this[character].tel = value
    },
    setRemark(value) {
      this.receiver.remark = value
    },
    async setCharacterData(payload, character = 'receiver') { //city一定要放在district前面
      let keyList = ['name', 'email', 'mobile', 'city', 'district', 'address']
      for (let key of keyList) {
        this[character][key] = payload[key] || ''
        if (key === 'city') await this.$nextTick()
      }
    },
    async synchronizeOrdererToReceiver() {
      for (let key in this.orderer) {
        let blackList = ['city', 'district']
        let isInclude = blackList.includes(key)
        if (isInclude) continue
        this.receiver[key] = this.orderer[key]
      }
      this.receiver.city = this.orderer.city
      await this.$nextTick()
      this.receiver.district = this.orderer.district
    },
    async validate() {
      let userDataIsValid = await this.$refs.form.validate()
      let addressIsValid = true
      let characterList = ['orderer', 'receiver']
      for (let character of characterList) {
        let { city, district, address } = this[character]
        if (city === '' || district === '' || address === '') {
          addressIsValid = false
          break
        }
      }
      return { 
        formIsValid: userDataIsValid && addressIsValid,
        addressIsValid
      }
    }
  },
  watch: {
    orderer: {
      deep: true,
      handler() {
        if (this.isSameOrderer) this.synchronizeOrdererToReceiver()
      }
    },
    isSameOrderer(val) {
      if (val) this.synchronizeOrdererToReceiver()
    }
  },
  template: `
    <div class="tab-pane px-2 py-3" :class="{active:isActive}">
      <validation-observer tag="div" ref="form">
        <h3 class="mb-2">訂購人資訊</h3>
        <div class="form-row">
          <validation-provider class="form-group col-12" tag="div" rules="required"
            v-slot="{ errors,failed }">
            <label class="title sm" for="">
              <span class="text-tomatoRed">*</span>姓名
            </label>
            <input 
              type="text" 
              class="form-control" 
              placeholder="請輸入姓名" 
              v-model.trim="orderer.name"
            />
            <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
          </validation-provider>
          <validation-provider class="form-group col-12" tag="div" rules="required|email"
            v-slot="{ errors,failed }">
            <label class="title sm" for="">
              <span class="text-tomatoRed">*</span>電子信箱
            </label>
            <input 
              type="email" 
              class="form-control" 
              placeholder="請輸入電子信箱" 
              v-model.trim="orderer.email"
            />
            <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <div class="form-row">
          <div class="form-group col-12">
            <label class="title sm" for="">住宅電話</label>
            <input 
              type="number" 
              class="form-control" 
              inputmode="tel" 
              placeholder="請輸入住宅電話" 
              v-model.trim="orderer.tel"
            />
          </div>
          <validation-provider class="form-group col-12" tag="div" rules="required|phone"
            v-slot="{ errors,failed }">
            <label class="title sm" for="">
              <span class="text-tomatoRed">*</span>手機號碼
            </label>
            <input 
              type="number" 
              class="form-control" 
              inputmode="tel" 
              placeholder="請輸入手機號碼" 
              v-model.trim="orderer.mobile"
            />
            <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <address-field
          :city.sync="orderer.city"
          :district.sync="orderer.district"
          :address.sync="orderer.address"
          :code.sync="orderer.code"
        ></address-field>
        <hr>
        <div class="bwtFlex mb-2">
          <div class="bwtFlex">
            <h3>收件人資訊</h3>
            <div class="form-check ml-1">
              <input type="checkbox" id="c1" class="mr-0 form-check-input" v-model="isSameOrderer">
              <label for="c1" class="form-check-label title sm mb-0" style="margin-left:2px">同訂購人</label>
            </div>
          </div>
          <div class="right">
            <a href="javascript:;" class="text-moBlue title sm mb-0" data-toggle="modal" data-target="#recipientPopup" v-if="showCommonButton">
              <u>選擇收件人</u>
            </a>
          </div>
        </div>
        <div class="form-row">
          <validation-provider class="form-group col-12" tag="div" rules="required|real-name"
            v-slot="{ errors,failed }">
            <label class="title" for="">
              <span class="text-tomatoRed">*</span>
              <span class="title sm mb-0">姓名</span>
              <small>(中文2~5字元,英文4~10字元。中英文不能混用)</small>
            </label>
            <input 
              type="text" 
              class="form-control" 
              placeholder="請輸入姓名" 
              v-model.trim="receiver.name" 
              :disabled="isSameOrderer"
            />
            <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
          </validation-provider>
          <validation-provider class="form-group col-12" tag="div" rules="required|email"
            v-slot="{ errors,failed }">
            <label class="title sm" for="">
              <span class="text-tomatoRed">*</span>電子信箱
            </label>
            <input 
              type="email" 
              class="form-control" 
              placeholder="請輸入電子信箱" 
              v-model.trim="receiver.email" 
              :disabled="isSameOrderer"
            />
            <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <div class="form-row">
          <div class="form-group col-12">
            <label class="title sm" for="">住宅電話</label>
            <input 
              type="number" 
              class="form-control" 
              inputmode="tel" 
              placeholder="請輸入住宅電話" 
              v-model.trim="receiver.tel" 
              :disabled="isSameOrderer"
            />
          </div>
          <validation-provider class="form-group col-12" tag="div" rules="required|phone"
            v-slot="{ errors,failed }">
            <label class="title sm" for="">
              <span class="text-tomatoRed">*</span>手機號碼
            </label>
            <input 
              type="number" 
              class="form-control" 
              inputmode="tel" 
              placeholder="請輸入手機號碼" 
              v-model.trim="receiver.mobile" 
              :disabled="isSameOrderer"
            />
            <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <address-field
          :city.sync="receiver.city"
          :district.sync="receiver.district"
          :address.sync="receiver.address"
          :code.sync="receiver.code"
          :disabled="isSameOrderer"
        ></address-field>
        <div class="form-group mt-2 mb-0">
          <label class="title sm">備註</label>
          <textarea 
            class="form-control" 
            placeholder="請輸入備註" 
            v-model.trim="receiver.remark"
          ></textarea>
        </div>
      </validation-observer>
    </div>`
})