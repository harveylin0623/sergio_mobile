export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, createSpecSlideListMixin, contactMixin],
    store: window.myVuexStore,
    data: {
      specSlideList: [],
      swiperD: null,
      swiperM: null,
      specItems: [],
      recommendList: [],
      user: { specId: -1, count: 1, total: 1 },
      productInfo: { id: 0, name: '', summary: '', detail: '', num: '', product_price: 0, product_promo_price: 0, product_code: '' },
      cartInfo: { status: false, message: '', isRedirect: false },
      tipInfo: { status: false, message: '' },
      payments: [],
      logistics: [],
      logoutGoHome: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    provide: {
      productCategoryUrl: pageUrl.productCategoty
    },
    computed: {
      noSpecialPrice() {
        let { product_price, product_promo_price } = this.productInfo
        return product_price <= product_promo_price
      },
      hasProductCode() {
        return this.productInfo.product_code !== ''
      },
      hasDetail() {
        return this.productInfo.detail !== ''
      },
      hasRecommend() {
        return this.recommendList.length > 0
      },
      canAddToCart() {
        return this.user.specId > -1
      },
      displayGoodsNotify() {  //顯示商品到貨通知
        if (this.specItems.length === 0) return false
        return this.specItems.every(spec => spec.spec_stock <= 0)
      },
      specialPriceTitle() {
        return this.noSpecialPrice ? '售價' : '優惠價'
      },
      paymentMethodText() { //付款方式字串
        if (this.payments.length === 0) return ''
        else return this.setPaymentAndDeliveryText(this.payments)
      },
      logisticsMethodText() { //運送方式字串
        if (this.logistics.length === 0) return ''
        else return this.setPaymentAndDeliveryText(this.logistics)
      }
    },
    methods: {
      initSpecSlide() {
        this.swiperD = new Swiper('.swiper-container-D', {
          slidesPerView: 5,
          spaceBetween: 5,
          watchSlidesProgress: true,
          observer: true
        })
        this.swiperM = new Swiper('.swiper-container-M', {
          speed: 250,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          effect: 'fade',
          observer: true,
          observeParents:true,
          thumbs: { swiper: this.swiperD },
        })
      },
      initRecommendSlide() {
        new Swiper('.recommend-swiper', {
          slidesPerView: 2,
          spaceBetween: 5,
          slidesPerGroup: 2,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
        })
      },
      createRecommendList(lists) {
        return lists.reduce((prev, current) => {
          let { id, product_code, images, product_promo_price, product_name, category_id } = current
          let main_image = images[0] !== undefined ? images[0] : ''
          let linkUrl = `${this.pageUrl.productDetail}?productCode=${product_code}&category_id=${category_id}`
          prev.push({ id, product_name, main_image, product_promo_price, linkUrl })
          return prev
        }, [])
      },
      setProductInfo(payload) {
        this.productInfo.id = payload.id
        this.productInfo.name = payload.product_name
        this.productInfo.summary = payload.product_summary
        this.productInfo.detail = payload.product_detail
        this.productInfo.num = payload.product_num
        this.productInfo.product_price = payload.product_price
        this.productInfo.product_promo_price = payload.product_promo_price
        this.productInfo.product_code = payload.product_code
      },
      setDefaultSpec() {
        let spec = this.specItems.find(spec => spec.spec_stock > 0)
        if (spec === undefined) {
          let imageArr = this.specItems.reduce((prev, current) => {
            prev = prev.concat(current.images)
            return prev
          }, [])
          this.specSlideList = imageArr
          return
        }
        this.user.specId = spec.id
        this.user.count = 1
        this.user.total = spec.spec_stock
        this.specSlideList = spec.images
      },
      setPaymentAndDeliveryText(payload) {
        let arr = payload.reduce((prev, current) => {
          prev.push(current.title)
          return prev
        }, [])
        return arr.join(' / ')
      },
      async getInitData() {
        let productCode = window.getQuery('productCode')
        let [product, recommend] = await Promise.all([
          productApi.product_detail({ url: `${apiUrl.product_detail}/${productCode}` }),
          productApi.product_recommend({ url: apiUrl.product_recommend })
        ])
        if (product.status === 0) return location.href = this.pageUrl.home
        this.setProductInfo(product.aaData)
        this.specItems = product.aaData.specs
        this.recommendList = this.createRecommendList(recommend.aaData)
        this.setDefaultSpec()
        this.payments = product.aaData.payments
        this.logistics = product.aaData.logistics
        await this.$nextTick()
        this.initSpecSlide()
        this.initRecommendSlide()
      },
      changeCount(num) {
        this.user.count = num
      },
      async changeSpec({ id, stock, images }) {
        let pendingArr = []
        this.user.specId = id
        this.user.count = 1
        this.user.total = stock
        for (let image of images) {
          let obj = new window.LoadingImage().load(image)
          pendingArr.push(obj)
        }
        await Promise.all(pendingArr)
        this.specSlideList = images
        this.swiperD.slideTo(0, 0, false)
        this.swiperM.slideTo(0, 0, false)
      },
      async notifyWhenHashGood() {
        this.isLoading = true
        let response = await productApi.product_arrival_notify({
          url: apiUrl.product_arrival_notify,
          data: { product_code: this.productInfo.product_code, spec_id: 0 }
        })
        this.tipInfo.message = response.status === 1 ? '成功增加到貨通知' : '失敗'
        $('#tipPopup').modal('show')
        this.isLoading = false
      },
      async addCart(isRedirect) {
        if (!this.canAddToCart) return
        this.isLoading = true
        let response = await cartApi.addCart({
          url: apiUrl.addCart,
          data: {
            product_code: this.productInfo.product_code,
            spec_id: this.user.specId,
            count: this.user.count
          }
        })
        this.cartInfo.status = response.status === 1
        this.cartInfo.message = response.message
        this.cartInfo.isRedirect = isRedirect
        if (this.cartInfo.status) {
          this.myHeader.updateCartCount(response.cartTotal)
        }
        $('#cartPopup').modal('show')
        this.isLoading = false
      },
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: false })
      await this.getInitData()
      this.isLoading = false
    }
  })
}
