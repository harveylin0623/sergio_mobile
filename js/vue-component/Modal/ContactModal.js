Vue.component('contact-modal', {
  props: {
    productInfo: { type: Object, required: true },
    specImgUrl: { required: true },
    showProduct: { type: Boolean, default: true }
  },
  data: () => ({
    contactInfo: { title: '', message: '' },
  }),
  methods: {
    async submitHandler() {
      let isValid = await this.$refs.form.validate()
      if (!isValid) return
      this.$emit('contact', this.contactInfo)
    },
    closeModal(isReset) {
      $('#contactPopup').modal('hide')
      if (isReset) this.resetForm()
    },
    resetForm() {
      this.contactInfo.title = ''
      this.contactInfo.message = ''
      this.$refs.form.reset()
    }
  },
  template: `
    <div class="modal" id="contactPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header mx-auto">
            <h2>聯絡客服</h2>
          </div>
          <div class="p-0 modal-body">
            <div class="mb-2 rounded bd-limeGreen" v-if="showProduct">
              <div class="d-flex align-items-start">
                <div class="flex-grow-0 flex-shrink-0" style="width:100px;height:100px;">
                  <img :src="specImgUrl" class="full-img rounded-left" alt="">
                </div>
                <div class="pl-2 pt-2 pr-2">
                  <div class="title sm text-limeGreen">商品編號:{{ productInfo.num }}</div>
                  <div class="title sm ellipsis">{{ productInfo.name }}</div>
                  <div class="title sm">
                    原價:
                    <span class="text-tomatoRed">{{'$'}}{{ productInfo.product_promo_price | currency }}元</span>
                  </div>
                </div>
              </div>
            </div>
            <validation-observer tag="div" ref="form">
              <validation-provider tag="div" class="mb-2 form-group" rules="required" v-slot="{ errors,failed }">
                <label class="title sm">
                  <span class="text-tomatoRed">*</span>提問主旨
                </label>
                <input type="text" class="form-control" placeholder="請輸入提問主旨" v-model.trim="contactInfo.title"/>
                <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
              </validation-provider>
              <validation-provider tag="div" class="mb-0 form-group" rules="required" v-slot="{ errors,failed }">
                <label class="title sm">
                  <span class="text-tomatoRed">*</span>我的提問
                </label>
                <textarea class="form-control" placeholder="請輸入提問內容" v-model.trim="contactInfo.message"></textarea>
                <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
              </validation-provider>
            </validation-observer>
          </div>
          <div class="modal-footer flex-column">
            <button class="btn btn-limeGreen limit" @click="submitHandler">送出</button>
            <button class="btn btn-outline-limeGreen limit" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>`
})