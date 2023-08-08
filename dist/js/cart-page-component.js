Vue.component('normal-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    isValid() {
      return this.cartInfo.valid
    },
    isChecked: {
      get() {
        return this.cartInfo.isChecked
      },
      set(val) {
        if (!this.isValid) return
        this.$emit('set-check', { uid: this.cartInfo.uid, checked: val })
      }
    },
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { valid, count, product } = this.cartInfo
      if (!valid) return 0
      else return count * product.product_promo_price
    }
  },
  methods: {
    removeHandler() {
      let { id, uid, activity_code } = this.cartInfo
      this.$emit('remove', { id, uid, activity_code })
    },
    changeCount(num) {
      let { product_code, uid, spec_id, activity_code } = this.cartInfo
      this.$emit('set-count', { product_code, uid, spec_id, count: num, code: activity_code })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item" :class="{invalid:!isValid}">
      <div class="left">
        <div class="form-check" v-show="isValid">
          <input type="checkbox" class="mr-0 form-check-input" v-model="isChecked">
        </div>
      </div>
      <div class="right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a :href="cartInfo.linkUrl" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.product.product_promo_price | currency }}</p>
              <p class="text-tomatoRed" v-if="isValid">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                v-if="isValid"
                class="sm"
                :max="cartInfo.spec.spec_stock"
                :count="cartInfo.count"
                :show-upper-limited-popup="true"
                @change-count="changeCount"
                @limited-reminder="limitedReminder"
              ></input-number>
              <button class="ml-2 btn btn-outline-tomatoRed" @click="removeHandler">
                <i class="fal fa-trash-alt"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
})

Vue.component('activity-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  mixins: [cartParamsMixin],
  computed: {
    isValid() {
      return this.cartInfo.valid
    },
    isChecked: {
      get() {
        return this.cartInfo.isChecked
      },
      set(val) {
        if (!this.isValid) return
        this.$emit('set-check', { uid: this.cartInfo.uid, checked: val })
      }
    },
    subtotal() {
      let { valid, count, bundle_promo_price } = this.cartInfo
      if (!valid) return 0
      else return count * bundle_promo_price
    },
    activityTitle() {
      return this.mappingActivityCode[this.cartInfo.activity_code]
    },
    comboList() {
      return this.cartInfo.cart
    }
  },
  methods: {
    removeHandler() {
      let { id, uid, activity_code } = this.cartInfo
      this.$emit('remove', { id, uid, activity_code })
    }
  },
  template: `
    <div class="activity-cart-item" :class="{invalid:!isValid}">
      <div class="d-flex align-items-center">
        <div class="top-1">
          <div class="form-check" v-show="isValid">
            <input type="checkbox" class="mr-0 form-check-input" v-model="isChecked">
          </div>
        </div>
        <div class="top-2">
          <p class="ellipsis">{{ cartInfo.activity.title }}</p>
          <p class="text-tomatoRed">*已符合{{ activityTitle }}活動方案</p>
        </div>
      </div>
      <div class="activity-content">
        <div class="info-box">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <p class="text-tomatoRed bundle-price">
              小計: {{'$'}}{{ cartInfo.bundle_promo_price | currency }}
            </p>
            <p class="ml-auto mr-2">x{{ cartInfo.count }}</p>
            <button class="btn btn-outline-tomatoRed" @click="removeHandler">
              <i class="fal fa-trash-alt"></i>
              <span>刪除</span>
            </button>
          </div>
          <div>
            <combo-product
              v-for="combo in comboList"
              :key="combo.id"
              :combo="combo"
              :activity-code="cartInfo.activity_code"
            ></combo-product>
          </div>
        </div>
        <div class="decorate-box">
          <div class="bg-limeGreen line"></div>
          <div class="bg-limeGreen rounded-circle text-white text-center ball">
            <i class="fal fa-bullhorn"></i>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('limited-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    isValid() {
      return this.cartInfo.valid
    },
    isChecked: {
      get() {
        return this.cartInfo.isChecked
      },
      set(val) {
        if (!this.isValid) return
        this.$emit('set-check', { uid: this.cartInfo.uid, checked: val })
      }
    },
    imageUrl() {
      return this.cartInfo.meta.spec.images[0] || ''
    },
    subtotal() {
      let { valid, count, meta } = this.cartInfo
      if (!valid) return 0
      else return count * meta.promo_price
    }
  },
  methods: {
    removeHandler() {
      let { id, uid, activity_code } = this.cartInfo
      this.$emit('remove', { id, uid, activity_code })
    },
    changeCount(num) {
      this.$emit('set-count', { 
        code: this.cartInfo.activity_code,
        activity_product_promotions_id: this.cartInfo.activity.id,
        activity_product_promotions_sub_id: this.cartInfo.interval.interval_id,
        activity_meta_id: this.cartInfo.meta.activity_meta_id,
        count: num,
        uid: this.cartInfo.uid
      })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item" :class="{invalid:!isValid}">
      <div class="left">
        <div class="form-check" v-show="isValid">
          <input type="checkbox" class="mr-0 form-check-input" v-model="isChecked">
        </div>
      </div>
      <div class="right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <p class="text-tomatoRed">*{{ cartInfo.activity.title }}</p>
            <a :href="cartInfo.linkUrl" class="w-100 text-dark ellipsis">
              {{ cartInfo.meta.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.meta.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.meta.promo_price | currency }}</p>
              <p class="text-tomatoRed" v-if="isValid">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                v-if="isValid"
                class="sm"
                :max="cartInfo.meta.activity_spec_stock"
                :count="cartInfo.count"
                :show-upper-limited-popup="true"
                @change-count="changeCount"
                @limited-reminder="limitedReminder"
              ></input-number>
              <button class="ml-2 btn btn-outline-tomatoRed" @click="removeHandler">
                <i class="fal fa-trash-alt"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('preorder-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    isValid() {
      return this.cartInfo.valid
    },
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, deposit } = this.cartInfo
      return count * deposit
    },
    priceTitle() {
      return this.cartInfo.deposit_type === 1 ? '訂金' : '單價'
    }
  },
  methods: {
    removeHandler() {
      let { id, uid, activity_code } = this.cartInfo
      this.$emit('remove', { id, uid, activity_code })
    },
    changeCount(num) {
      let { uid, activity_meta_id } = this.cartInfo
      this.$emit('set-count', { uid, count: num, activity_meta_id })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item" :class="{invalid:!isValid}">
      <div class="pl-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <div class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </div>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>{{ priceTitle }}: {{'$'}}{{ cartInfo.deposit | currency }}</p>
              <p class="text-tomatoRed" v-if="isValid">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                v-if="isValid"
                class="sm"
                :max="cartInfo.spec.spec_stock"
                :count="cartInfo.count"
                :show-upper-limited-popup="true"
                @change-count="changeCount"
                @limited-reminder="limitedReminder"
              ></input-number>
              <button class="ml-2 btn btn-outline-tomatoRed" @click="removeHandler">
                <i class="fal fa-trash-alt"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('add-on-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    isValid() {
      return this.cartInfo.valid
    },
    isChecked: {
      get() {
        return this.cartInfo.isChecked
      },
      set(val) {
        if (!this.isValid) return
        this.$emit('set-check', { id: this.cartInfo.id, checked: val })
      }
    },
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { valid, count, purchase_price } = this.cartInfo
      if (!valid) return 0
      else return count * purchase_price
    }
  },
  methods: {
    removeHandler() {
      this.$emit('remove', { id: this.cartInfo.id })
    },
    changeCount(num) {
      let { product_code, spec_id, purchase_id } = this.cartInfo
      this.$emit('set-count', { product_code, spec_id, count: num, purchase_id })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item" :class="{invalid:!isValid}">
      <div class="left">
        <div class="form-check" v-show="isValid">
          <input type="checkbox" class="mr-0 form-check-input" v-model="isChecked">
        </div>
      </div>
      <div class="right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.purchase_price | currency }}</p>
              <p class="text-tomatoRed" v-if="isValid">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                v-if="isValid"
                class="sm"
                :max="cartInfo.spec.spec_stock"
                :count="cartInfo.count"
                :show-upper-limited-popup="true"
                @change-count="changeCount"
                @limited-reminder="limitedReminder"
              ></input-number>
              <button class="ml-2 btn btn-outline-tomatoRed" @click="removeHandler">
                <i class="fal fa-trash-alt"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('normal-settled-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    specImageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      return this.cartInfo.count * this.cartInfo.product.product_promo_price
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="p-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="specImageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.product.product_promo_price | currency }}</p>
              <p>數量: x{{ cartInfo.count }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('activity-settled-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  mixins: [cartParamsMixin],
  computed: {
    subtotal() {
      let { count, bundle_promo_price } = this.cartInfo
      return count * bundle_promo_price
    },
    activityTitle() {
      return this.mappingActivityCode[this.cartInfo.activity_code]
    },
    comboList() {
      return this.cartInfo.cart
    }
  },
  template: `
    <div class="activity-cart-item">
      <div class="d-flex align-items-center mb-2">
        <div class="pl-0 top-2">
          <p class="ellipsis">{{ cartInfo.activity.title }}</p>
          <p class="text-tomatoRed">*已符合{{ activityTitle }}</p>
        </div>
      </div>
      <div class="activity-content">
        <div class="info-box">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <p class="text-tomatoRed bundle-price">
              {{'$'}}{{ cartInfo.bundle_promo_price | currency }}
            </p>
            <p class="ml-auto mr-2">x{{ cartInfo.count }}</p>
          </div>
          <div>
            <combo-product 
              v-for="combo in comboList"
              :key="combo.id"
              :combo="combo"
              :activity-code="cartInfo.activity_code"
            ></combo-product>
          </div>
        </div>
        <div class="decorate-box">
          <div class="bg-limeGreen line"></div>
          <div class="bg-limeGreen rounded-circle text-white text-center ball">
            <i class="fal fa-bullhorn"></i>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('limited-settled-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    specImageUrl() {
      return this.cartInfo.meta.spec.images[0] || ''
    },
    subtotal() {
      return this.cartInfo.count * this.cartInfo.meta.promo_price 
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="pl-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="specImageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <p class="text-tomatoRed">*{{ cartInfo.activity.title }}</p>
            <a :href="cartInfo.linkUrl" class="w-100 text-dark ellipsis">
              {{ cartInfo.meta.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.meta.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.meta.promo_price | currency }}</p>
              <p>數量: {{ cartInfo.count }}</p>
              <p class="text-tomatoRed ">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('preorder-settled-row', {
  props: {
    cartInfo: { type: Object, required: true },
  },
  computed: {
    specImageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, deposit } = this.cartInfo
      return count * deposit
    },
    priceTitle() {
      return this.cartInfo.deposit_type === 1 ? '訂金' : '單價'
    },
  },
  template: `
    <div class="normal-cart-item">
      <div class="p-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="specImageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>{{ priceTitle }}: {{'$'}}{{ cartInfo.deposit | currency }}</p>
              <p>數量: x{{ cartInfo.count }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('preorder-balance-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, final_payment } = this.cartInfo.balance
      return count * final_payment
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="right pl-0">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <div class="w-100 text-dark ellipsis">{{ cartInfo.product.product_name }}</div>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>尾款: {{'$'}}{{ cartInfo.balance.final_payment | currency }}</p>
              <p>數量: x{{ cartInfo.balance.count }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('balance-add-on-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { valid, count, purchase_price } = this.cartInfo
      if (!valid) return 0
      else return count * purchase_price
    }
  },
  methods: {
    removeHandler() {
      this.$emit('remove', { id: this.cartInfo.id })
    },
    changeCount(num) {
      let { product_code, spec_id, purchase_id } = this.cartInfo
      this.$emit('set-count', { product_code, spec_id, count: num, purchase_id })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.purchase_price | currency }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                class="sm"
                :max="cartInfo.spec.spec_stock"
                :count="cartInfo.count"
                :show-upper-limited-popup="true"
                @change-count="changeCount"
                @limited-reminder="limitedReminder"
              ></input-number>
              <button class="ml-2 btn btn-outline-tomatoRed" @click="removeHandler">
                <i class="fal fa-trash-alt"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('group-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    isValid() {
      return this.cartInfo.valid
    },
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, grade_distance } = this.cartInfo
      return count * grade_distance.amount
    }
  },
  methods: {
    removeHandler() {
      let { id, uid, activity_code } = this.cartInfo
      this.$emit('remove', { id, uid, activity_code })
    },
    changeCount(num) {
      let { uid, activity_meta_id } = this.cartInfo
      this.$emit('set-count', { uid, count: num, activity_meta_id })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item" :class="{invalid:!isValid}">
      <div class="pl-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <div class="w-100 text-dark ellipsis">{{ cartInfo.product.product_name }}</div>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.grade_distance.amount | currency }}</p>
              <p class="text-tomatoRed" v-if="isValid">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                v-if="isValid"
                class="sm"
                :max="cartInfo.spec.spec_stock"
                :count="cartInfo.count"
                :show-upper-limited-popup="true"
                @change-count="changeCount"
                @limited-reminder="limitedReminder"
              ></input-number>
              <button class="ml-2 btn btn-outline-tomatoRed" @click="removeHandler">
                <i class="fal fa-trash-alt"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('group-settled-row', {
  props: {
    cartInfo: { type: Object, required: true },
  },
  computed: {
    specImageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, grade_distance } = this.cartInfo
      return count * grade_distance.amount
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="p-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="specImageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>價格: {{'$'}}{{ cartInfo.grade_distance.amount | currency }}</p>
              <p>數量: x{{ cartInfo.count }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('add-on-settled-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, purchase } = this.cartInfo
      return count * purchase
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="pl-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.purchase | currency }}</p>
              <p>數量: {{'$'}}{{ cartInfo.count }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('add-on-balance-settled-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, purchase_price } = this.cartInfo
      return count * purchase_price
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="pl-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.purchase_price | currency }}</p>
              <p>數量: {{'$'}}{{ cartInfo.count }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('add-on-slide', {
  props: {
    purchase: { type: Object, required: true }
  },
  computed: {
    imageUrl() {
      return this.purchase.spec.images[0] || ''
    }
  },
  methods: {
    introHandler() {
      this.$emit('intro', {
        name: this.purchase.product.product_name,
        summary: this.purchase.product.product_summary,
        imgUrl: this.imageUrl,
        specTitle: this.purchase.spec.spec_title,
        price: this.purchase.purchase_price
      })
    },
    buyHandler() {
      this.$emit('purchase-buy', {
        purchase_id: this.purchase.id,
        product_code: this.purchase.product.product_code,
        spec_id: this.purchase.spec.id,
        count: 1
      })
    }
  },
  template: `
    <div class="px-2 swiper-slide">
      <div class="position-relative" style="padding-top:100%;" @click="introHandler">
        <img :src="imageUrl" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
      </div>
      <div class="my-1">
        <div class="title sm mb-0 ellipsis only">{{ purchase.product.product_name }}</div>
        <div class="mb-0 text-center text-tomatoRed title sm">
          {{'$'}}{{ purchase.purchase_price | currency }}
        </div>
      </div>
      <button class="w-100 btn btn-limeGreen" @click="buyHandler">選購</button>
    </div>`
})
Vue.component('invoice-item', {
  props: {
    invoice: { type: Object, required: true },
    currentInvoiceId: { type: String, required: true }
  },
  computed: {
    isActive() {
      return this.invoice.id === this.currentInvoiceId
    },
    activeCalss() {
      let text = this.isActive ? 'text-limeGreen' : 'text-dark'
      let border = this.isActive ? 'bd-limeGreen' : 'bd-bootstrap'
      return [text, border]
    }
  },
  methods: {
    clickHandler() {
      this.$emit('update:current-invoice-id', this.invoice.id)
    }
  },
  template: `
    <div class="d-flex align-items-center p-2 mr-2 mb-2 rounded" :class="activeCalss" v-show="invoice.display" @click="clickHandler">
      <span class="check-ball" :class="{active:isActive}">
        <i class="fad fa-circle"></i>
      </span>
      <span class="ml-1 mb-0 title sm">{{ invoice.title }}</span>
    </div>`
})
Vue.component('pay-item', {
  props: {
    payType: { type: String, required: true },
    payment: { type: Object, required: true }
  },
  computed: {
    isActive() {
      return this.payment.type === this.payType
    },
    activeCalss() {
      let text = this.isActive ? 'text-limeGreen' : 'text-dark'
      let border = this.isActive ? 'bd-limeGreen' : 'bd-bootstrap'
      return [text, border]
    }
  },
  methods: {
    clickHandler() {
      if (this.isActive) return
      this.$emit('update:pay-type', this.payment.type)
    }
  },
  template: `
    <div class="d-flex align-items-center p-2 mr-2 mb-2 rounded" :class="activeCalss" @click="clickHandler">
      <span class="check-ball" :class="{active:isActive}">
        <i class="fad fa-circle"></i>
      </span>
      <span class="ml-1 mb-0 title sm">{{ payment.title }}</span>
    </div>`
})
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
Vue.component('delivery-item', {
  props: {
    deliveryType: { type: String, required: true },
    delivery: { type: Object, required: true }
  },
  computed: {
    isActive() {
      return this.delivery.type === this.deliveryType
    },
    activeCalss() {
      let text = this.isActive ? 'text-limeGreen' : 'text-dark'
      let border = this.isActive ? 'bd-limeGreen' : 'bd-bootstrap'
      return [text, border]
    }
  },
  methods: {
    clickHandler() {
      if (this.isActive) return
      this.$emit('update:delivery-type', this.delivery.type)
    }
  },
  template: `
    <div class="d-flex align-items-center p-2 mr-2 mb-2 rounded" :class="activeCalss" @click="clickHandler">
      <span class="check-ball" :class="{active:isActive}">
        <i class="fad fa-circle"></i>
      </span>
      <span class="ml-1 mb-0 title sm">{{ delivery.name }}</span>
    </div>`
})
Vue.component('market-select-modal', {
  props: {
    marketList: { type: Array, required: true }
  },
  data: () => ({
    marketType: '',
    backupMarketType: '',
    actionType: ''
  }),
  computed: {
    hasMarket() {
      return this.marketList.length > 0
    }
  },
  methods: {
    setDefaultMarketType(type) {
      this.marketType = this.backupMarketType = type
    },
    confirmHandler() {
      if (this.marketType === '') return
      this.actionType = 'confirm'
      this.$emit('choose-market', this.marketType)
    },
    cancelHandler() {
      this.actionType = 'cancel'
    },
    completelyHidden() {
      if (this.actionType === 'confirm') this.backupMarketType = this.marketType
      if (this.actionType === 'cancel') this.marketType = this.backupMarketType
    }
  },
  mounted() {
    $('#marketPopup').on('hidden.bs.modal', this.completelyHidden)
  },
  template: `
    <div class="modal fade" id="marketPopup" data-backdrop="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header mx-auto">
            <h2>選擇超商</h2>
          </div>
          <div class="p-0 modal-body">
            <market-item
              v-for="market in marketList" 
              :key="market.type"
              :market-type.sync="marketType"
              :market="market"
            ></market-item>
          </div>
          <div class="modal-footer flex-column">
            <button
              v-show="hasMarket"
              class="btn btn-limeGreen limit"
              data-dismiss="modal"
              @click="confirmHandler"
            >確認
            </button>
            <button 
              class="btn btn-outline-limeGreen limit"
              data-dismiss="modal" 
              @click="cancelHandler"
            >取消</button>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('market-item', {
  props: {
    marketType: { type: String, required: true },
    market: { type: Object, required: true }
  },
  computed: {
    isActive() {
      return this.market.type === this.marketType
    },
    borderClass() {
      return this.isActive ? 'bd-limeGreen' : 'bd-divide'
    }
  },
  methods: {
    clickHandler() {
      if (this.isActive) return
      this.$emit('update:market-type', this.market.type)
    }
  },
  template: `
    <div class="d-flex justify-conetent-between align-items-center p-2 mb-2 rounded" :class="borderClass" @click="clickHandler">
      <div class="flex-grow-1 flex-shrink-1 d-flex align-items-center">
        <div :class="['market-bg', market.type]"></div>
        <p class="ml-2 mb-0 title sm">{{ market.name }}</p>
      </div>
      <div>
        <span class="check-ball" :class="{active:isActive}">
          <i class="fad fa-check-circle"></i>
        </span>
      </div>
    </div>`
})
Vue.component('cart-coupon-modal', {
  props: {
    validCouponUrl: { type: String, required: true }
  },
  data: () => ({
    ticketList: []
  }),
  computed: {
    hasTicket() {
      return this.ticketList.length > 0
    },
    modalTitle() {
      return this.hasTicket ? '您擁有的折價券' : '您目前無可用票券'
    }
  },
  methods: {
    createTicketList(lists) {
      return lists.reduce((prev, current) => {
        prev.push({ ...current, isChecked: false })
        return prev
      }, [])
    },
    async getUserCoupon(payload) {
      let response = await cartApi.valid_coupon({ url: this.validCouponUrl, data: payload })
      this.ticketList = this.createTicketList(response.result.available_coupons)
      $('#ticketPopup').modal('show')
    },
    setTicketChecked(payload) {
      let obj = this.ticketList.find(ticket => ticket.coupon_no === payload.coupon_no)
      if (obj === undefined) return
      obj.isChecked = payload.checked
    },
    confirmHandler() {
      let tickets = this.ticketList.filter(ticket => ticket.isChecked)
      this.$emit('choose-ticket', tickets)
    }
  },
  template: `
    <div class="modal fade" id="ticketPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h2>{{ modalTitle }}</h2>
          </div>
          <div class="p-0 modal-body">
            <cart-coupon
              v-for="ticket in ticketList"
              :key="ticket.coupon_no"
              :ticket="ticket"
              @set-checked="setTicketChecked"
            ></cart-coupon>
          </div>
          <div class="modal-footer flex-column py-0">
            <button 
              v-show="hasTicket"
              class="btn btn-limeGreen mx-auto limit"
              data-dismiss="modal"
              @click="confirmHandler">確認</button>
            <button class="btn btn-outline-limeGreen mx-auto limit" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('cart-coupon', {
  props: {
    ticket: { type: Object, required: true }
  },
  computed: {
    isChecked: {
      get() {
        return this.ticket.isChecked
      },
      set(val) {
        this.$emit('set-checked', {
          coupon_no: this.ticket.coupon_no,
          checked: val
        })
      }
    },
    deadline() {
      let { redeem_start_datetime, redeem_end_datetime } = this.ticket
      let startTime = redeem_start_datetime.split(' ')[0]
      let endTime = redeem_end_datetime.split(' ')[0]
      return `${startTime}~${endTime}`
    }
  },
  template: `
    <label class="d-flex align-items-start mb-2 bd-divide rounded cart-coupon">
      <div class="d-flex justify-content-center align-items-center flex-shrink-0 flex-grow-0 left">
        <i class="fas fa-ticket-alt fa-2x text-limeGreen"></i>
      </div>
      <div class="d-flex justify-content-center align-items-center right">
        <div class="pr-1 desc-box">
          <p class="title sm mb-0">{{ ticket.title }}</p>
          <p class="mb-0 text-break title sm text-limeGreen">{{ deadline }}</p>
          <p class="title sm mb-0">可用次數<span class="mx-1 text-tomatoRed">100</span>次</p>
        </div>
        <div class="flex-shrink-0 flex-grow-0 input-box">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" v-model="isChecked">
          </div>
        </div>
      </div>
    </label>`
})
Vue.component('receiver-cart-modal', {
  props: {
    receipentList: { type: Array, required: true }
  },
  data: () => ({
    currentReceipentId: 0,
    backupReceipentId: 0,
    actionType: 'cancel'
  }),
  methods: {
    setDefaultReceipentId() {
      let obj = this.receipentList.find(receipent => receipent.preset === 1)
      if (obj === undefined) return
      this.currentReceipentId = this.backupReceipentId = obj.id
    },
    confirmHandler() {
      this.actionType = 'confirm'
      let obj = this.receipentList.find(item => item.id === this.currentReceipentId)
      if (obj === undefined) return
      this.$emit('set-recipient', obj)
      $('#recipientPopup').modal('hide')
    },
    cancelHandler() {
      this.actionType = 'cancel'
      $('#recipientPopup').modal('hide')
    },
    completelyHidden() {
      if (this.actionType === 'confirm') this.backupReceipentId = this.currentReceipentId
      if (this.actionType === 'cancel') this.currentReceipentId = this.backupReceipentId
    }
  },
  mounted() {
    this.setDefaultReceipentId()
    $('#recipientPopup').on('hidden.bs.modal', this.completelyHidden)
  },
  template: `
    <div class="modal fade" id="recipientPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h2>選擇收件人</h2>
          </div>
          <div class="p-0 modal-body">
            <div>
              <receipent-select 
                v-for="receipent in receipentList" 
                :key="receipent.id"
                :receipent="receipent"
                :current-receipent-id.sync="currentReceipentId"
              ></receipent-select>
            </div>
          </div>
          <div class="modal-footer flex-column">
            <button class="btn btn-limeGreen mx-auto limit" @click="confirmHandler">確認</button>
            <button class="btn btn-outline-limeGreen mx-auto limit" @click="cancelHandler">取消</button>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('receipent-select', {
  props: {
    receipent: { type: Object, required: true },
    currentReceipentId: { type: Number, required: true }
  },
  computed: {
    isActive() {
      return this.receipent.id === this.currentReceipentId
    },
    borderClass() {
      return this.isActive ? 'bd-limeGreen' : 'bd-bootstrap'
    },
    isPreset() {
      return this.receipent.preset === 1
    },
    fullAddress() {
      let { city, district, address } = this.receipent
      return `${city}${district}${address}`
    }
  },
  methods: {
    clickHandler() {
      this.$emit('update:current-receipent-id', this.receipent.id)
    }
  },
  template: `
    <div class="d-flex align-items-center p-2 mb-2 rounded" :class="borderClass" @click="clickHandler">
      <div class="flex-grow-1 flexs-shrink-1">
        <div class="mb-2">
          <span class="title sm mb-0">姓名: {{ receipent.name }}</span>
          <span 
            class="px-2 ml-1 mb-0 text-white rounded-pill bg-tomatoRed" 
            v-show="isPreset"
            style="font-size:12px;"
          >預設</span>
        </div>
        <div class="mb-2 title sm">
          電話: <span class="text-dark">{{ receipent.mobile }}</span>
        </div>
        <div class="mb-2 title sm">
          電子信箱: <span class="text-dark">{{ receipent.email }}</span>
        </div>
        <div class="title sm mb-0">
          地址: <span class="text-dark">{{ fullAddress }}</span>
        </div>
      </div>
      <div>
        <span class="check-ball" :class="{active:isActive}">
          <i class="fad fa-check-circle"></i>
        </span>
      </div>
    </div>`
})
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