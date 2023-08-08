export default (() => {
  Vue.component('member-coupon', {
    props: {
      coupon: { type: Object, required: true }
    },
    data: () => ({
      mappingCouponStatus: {
        available: { title: '可使用', class: 'text-limeGreen' },
        notyet: { title: '尚未開始', class: '' },
        expired: { title: '已逾期', class: 'text-tomatoRed' },
        obsolete: { title: '已失效', class: 'text-tomatoRed' },
        redeemed: { title: '已使用', class: 'text-tomatoRed' },
        transferred: { title: '已轉贈', class: 'text-tomatoRed' }
      }
    }),
    computed: {
      isAvailable() {
        return this.coupon.status === 'available'
      },
      statusClass() {
        return this.mappingCouponStatus[this.coupon.status].class
      },
      statusText() {
        return this.mappingCouponStatus[this.coupon.status].title
      },
      maskClass() {
        return this.isAvailable ? 'd-none' : 'd-flex'
      },
      couponImage() {
        let imgUrl = this.coupon.info.feature_image.url
        return imgUrl ? imgUrl : ''
      },
    },
    methods: {
      clickHandler() {
        this.$emit('intro-coupon', {
          title: this.coupon.info.title,
          content: this.coupon.info.content || '',
          image: this.couponImage,
          duration: this.coupon.duration,
          total: this.coupon.info.total
        })
      }
    },
    template: `
      <div class="d-flex align-items-start pb-2 mb-2 bd-bottom-divide" @click="clickHandler">
        <div class="flex-grow-0 flex-shrink-0 position-relative" style="width:65px;height:65px;">
          <img :src="couponImage" class="rounded full-img" alt="">
          <div class="position-absolute justify-content-center align-items-center w-100 h-100 mb-0 text-white rounded title sm" style="left:0;top:0;background-color:rgba(0,0,0,0.55)" :class="maskClass"
          >{{ statusText }}</div>
        </div>
        <div class="pl-2 flex-grow-1 flex-shrink-1">
          <p class="mb-0 title sm ellipsis only">{{ coupon.info.title }}</p>
          <p class="mb-0 title sm text-link">{{ coupon.duration }}</p>
          <p class="mb-0 title sm text-link">
            狀態: <span :class="statusClass">{{ statusText }}</span>
          </p>
          <p class="mb-0 title sm text-link">可用次數: {{ coupon.info.total }}次</p>
        </div>
      </div>`
  })
})()