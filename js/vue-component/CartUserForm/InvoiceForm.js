Vue.component('invoice-form', {
  props: {
    invoiceList: { type: Array, required: true },
    loveInstitution: { type: Array, required: true }
  },
  data() {
    return {
      invoiceInfo: { id: '3', invoice_email: '', invoice_phone_id: '', invoice_love_id: '', invoice_user_id: '', invoice_num: '', companyTitle: '', companyAddress: '' },
    }
  },
  computed: {
    targetInvoiceData() {
      let obj = this.invoiceList.find(item => item.id === this.invoiceInfo.id)
      if (obj !== undefined) return obj
      else return { title: '', placeholder: '' }
    },
    showInvoicePhoneId() {
      return this.invoiceInfo.id === '1' ? 'd-flex' : 'd-none'
    },
    showInvoiceUserId() {
      return this.invoiceInfo.id === '2' ? 'd-flex' : 'd-none'
    },
    showInvoiceEmail() {
      return this.invoiceInfo.id === '3' ? 'd-flex' : 'd-none'
    },
    showInvoiceLoveId() {
      return this.invoiceInfo.id === '4' ? 'd-flex' : 'd-none'
    },
    showInvoiceNum() {
      return this.invoiceInfo.id === '5' ? 'd-flex' : 'd-none'
    }
  },
  methods: {
    getData() {
      let copyInvoice = _.cloneDeep(this.invoiceInfo)
      let obj = this.invoiceList.find(item => item.id === copyInvoice.id)
      let apiName = obj.apiName
      for (let key in copyInvoice) {
        if (key === 'id' || key === apiName) continue
        copyInvoice[key] = ''
      }
      if (copyInvoice.id === '5') {
        copyInvoice.companyTitle = this.invoiceInfo.companyTitle
        copyInvoice.companyAddress = this.invoiceInfo.companyAddress
      }
      return copyInvoice
    },
    async validate() {
      let obj = this.invoiceList.find(item => item.id === this.invoiceInfo.id)
      let isValid = await this.$refs[obj.apiName].validate()
      return isValid
    }
  },
  template: `
    <div class="container">
      <h3 class="mb-2">發票資訊</h3>
      <div class="d-flex align-items-center flex-wrap">
        <invoice-item 
          v-for="invoice in invoiceList"
          :key="invoice.id"
          :invoice="invoice"
          :current-invoice-id.sync="invoiceInfo.id"
        ></invoice-item>
      </div>
      <div id="nav-tabContent" class="tab-content bg-term rounded">
        <div class="tab-pane px-2 py-2 fade show active">
          <div class="title sm">{{ targetInvoiceData.title }}</div>
          <validation-observer :class="showInvoicePhoneId" tag="div" ref="invoice_phone_id">
            <validation-provider class="col-12 px-0" tag="div" rules="required|mobile-vehicle" v-slot="{ errors,failed }">
              <input 
                type="text" 
                class="form-control" 
                :placeholder="targetInvoiceData.placeholder" 
                v-model.trim="invoiceInfo.invoice_phone_id"
              >
              <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
            </validation-provider>
          </validation-observer>
          <validation-observer :class="showInvoiceUserId" tag="div" ref="invoice_user_id">
            <validation-provider class="col-12 px-0" tag="div" rules="required|natural-person" v-slot="{ errors,failed }">
              <input 
                type="text" 
                class="form-control" 
                :placeholder="targetInvoiceData.placeholder" 
                v-model.trim="invoiceInfo.invoice_user_id"
              >
              <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
            </validation-provider>
          </validation-observer>
          <validation-observer :class="showInvoiceEmail" tag="div" ref="invoice_email">
            <validation-provider class="col-12 px-0" tag="div" rules="required|email" v-slot="{ errors,failed }">
              <input 
                type="text" 
                class="form-control" 
                :placeholder="targetInvoiceData.placeholder" 
                v-model.trim="invoiceInfo.invoice_email"
              >
              <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
            </validation-provider>
          </validation-observer>
          <validation-observer :class="showInvoiceLoveId" tag="div" ref="invoice_love_id">
            <validation-provider class="col-12 px-0" tag="div" rules="required" v-slot="{ errors,failed,}">
              <select class="form-control" v-model="invoiceInfo.invoice_love_id">
                <option value="">請選擇捐贈機構</option>
                <option 
                  v-for="love in loveInstitution" 
                  :key="love.id" 
                  :value="love.id"
                >{{ love.title }}</option>
              </select>
              <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
            </validation-provider>
          </validation-observer>
          <validation-observer :class="[showInvoiceNum, 'flex-wrap']" ref="invoice_num">
            <validation-provider class="col-6 pl-0 pr-1" tag="div" rules="required|tax-id" v-slot="{ errors,failed }">
              <input 
                type="text" 
                class="form-control" 
                :placeholder="targetInvoiceData.placeholder" 
                v-model.trim="invoiceInfo.invoice_num"
              >
              <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
            </validation-provider>
            <validation-provider class="col-6 pl-1 pr-0" tag="div" rules="required" v-slot="{ errors,failed }">
              <input 
                type="text" 
                class="form-control" 
                placeholder="公司抬頭" 
                v-model.trim="invoiceInfo.companyTitle"
              >
              <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
            </validation-provider>
            <validation-provider class="col-12 p-0 mt-2" tag="div" rules="required" v-slot="{ errors,failed }">
              <input 
                type="text" 
                class="form-control" 
                placeholder="公司地址" 
                v-model.trim="invoiceInfo.companyAddress"
              >
              <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
            </validation-provider>
          </validation-observer>
        </div>
      </div>
    </div>`
})