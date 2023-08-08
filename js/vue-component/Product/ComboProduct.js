Vue.component('combo-product', {
  props: {
    combo: { type: Object, required: true },
    activityCode: { type: String, required: true },
    showComboPrice: { type: Boolean, default: false }
  },
  computed: {
    isMatchedActivity() {
      return this.activityCode === 'red_with_green'
    },
    labelClass() {
      if (!this.isMatchedActivity) return ''
      if (this.combo.promo_type === undefined) return ''
      return this.combo.promo_type === 1 ? 'red' : 'green'
    },
    imageUrl() {
      return this.combo.spec.images[0] || ''
    },
  },
  template: `
    <div class="d-flex align-items-start mb-2 combo-product">
      <div class="position-relative overflow-hidden img-box" :class="labelClass">
        <img :src="imageUrl" class="full-img" alt="">
      </div>
      <div class="desc-box">
        <p class="ellipsis">{{ combo.product.product_name }}</p>
        <p class="text-link">規格: {{ combo.spec.spec_title }} *{{ combo.count }}</p>
        <div class="d-flex" v-if="showComboPrice">
          <p class="mr-2 text-tomatoRed">單價: {{'$'}}{{ combo.promo_price | currency }}</p>
          <p>小計: {{'$'}}{{ combo.meta_total | currency }}</p>
        </div>
      </div>
    </div>`
})