Vue.component('address-field', {
  props: {
    fieldTitle: { type: String, default: '通訊地址' },
    city: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    code: { type: Number, required: true },
    disabled: { type: Boolean, default: false }
  },
  data: () => ({
    zipcodeData: _.cloneDeep(window.zipcodeData)
  }),
  computed: {
    cityList() {
      if (this.zipcodeData.length === 0) return []
      else return this.zipcodeData.map(item => item.name)
    },
    districtList() {
      let targetCity = this.zipcodeData.find(item => item.name === this.myCity)
      if (targetCity !== undefined) return targetCity.region
      else return []
    },
    myCity: {
      get() {
        return this.city
      },
      set(val) {
        this.$emit('update:city', val)
      }
    },
    myDistrict: {
      get() {
        return this.district
      },
      set(val) {
        this.$emit('update:district', val)
      }
    },
    myAddress: {
      get() {
        return this.address
      },
      set(val) {
        this.$emit('update:address', val)
      }
    },
  },
  methods: {
    updateCode() {
      let obj = this.districtList.find(district => district.name === this.myDistrict)
      let code = obj !== undefined ? obj.code : 0
      this.$emit('update:code', code)
    }
  },
  watch: {
    districtList(val) {
      let text = val[0] !== undefined ? val[0].name : ''
      this.myDistrict = text
    },
    myDistrict: {
      immediate: true,
      handler() {
        this.updateCode()
      }
    }
  },
  template: `
    <div class="form-row">
      <div class="form-group col-6">
        <label class="title sm" for="">
          <span class="text-tomatoRed">*</span>{{ fieldTitle }}
        </label>
        <select class="form-control" v-model="myCity" :disabled="disabled">
          <option value="" disabled>縣市</option>
          <option v-for="city in cityList" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
      <div class="form-group col-6">
        <label class="title" for="">&nbsp;</label>
        <select class="form-control" v-model="myDistrict" :disabled="disabled">
          <option value="" disabled>地區</option>
          <option v-for="district in districtList" :key="district.name" :value="district.name">
            {{ district.name }}
          </option>
        </select>
      </div>
      <div class="form-group col-12 mb-0">
        <input type="text" class="form-control" placeholder="請輸入地址" v-model.trim="myAddress" :disabled="disabled"/>
      </div>
    </div>`
})