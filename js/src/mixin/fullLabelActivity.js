(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.fullLabelActivityMixin = factory());
}(this, (function () {
  return {
    data() {
      return {
        promoteId: 0,
        productLists: [],
        pickList: [],
        activityMenuIsOpen: false,
        pickedMenuIsOpen: false,
        activityIntro: { title: '', summary: '' },
        condition: { activityId: -1, promo_type: 1, min_amount: 0, promo_amount: 0, code: '', imgUrl: '' }, //promo_type 1.固定金額 2.折抵金額 3.%折抵
        paginationInfo: { currentPage: 1, totalPage: 1, perPage: 10 },
        introInfo: { name: '', summary: '', specTitle: '', price: 0, imgUrl: '' },
        tipInfo: { status: false, message: '' },
        limitedText: '',
        logoutGoHome: false,
        isLoading: false,
      }
    },
    computed: {
      hasCriteria() {
        return this.condition.activityId !== -1
      },
      pickedTotal() {
        return this.pickList.reduce((prev, current) => {
          prev += current.buyCount
          return prev
        }, 0)
      },
      pickedAmount() {
        return this.pickList.reduce((prev, current) => {
          prev += current.buyCount * current.price
          return prev
        }, 0)
      },
      hasPicked() {
        return this.pickedTotal > 0
      },
      showPickedMenu() {
        return this.hasPicked && this.pickedMenuIsOpen
      }
    },
    methods: {
      checkProductHasStock(lists) {
        return lists.filter(list => {
          let { spec } = list
          if (spec === null) return false
          else return spec.spec_stock > 0
        })
      },
      setCondition(payload) {
        this.condition.activityId = payload.id
        this.condition.promo_type = payload.promo_type
        this.condition.min_amount = payload.min_amount
        this.condition.promo_amount = payload.promo_amount
        this.condition.code = payload.code
        this.condition.imgUrl = payload.images[0] || ''
        this.activityIntro.title = payload.title
        this.activityIntro.summary = payload.summary
      },
      toggleActivityMenu() {
        this.activityMenuIsOpen = !this.activityMenuIsOpen
      },
      togglePickedMenu() {
        if (!this.hasPicked) return
        this.pickedMenuIsOpen = !this.pickedMenuIsOpen
      },
      pickHandler(payload) {
        let { activityProductId } = payload
        let targetPick = this.pickList.find(item => item.activityProductId === activityProductId)
        if (targetPick === undefined) this.pickList.push({ ...payload, buyCount: 1 })
      },
      changePickCount(payload) {
        let { activityProductId, count } = payload
        let targetPick = this.pickList.find(item => item.activityProductId === activityProductId)
        targetPick.buyCount = count
      },
      removePickedItem({ activityProductId }) {
        let index = this.pickList.findIndex(item => item.activityProductId === activityProductId)
        this.pickList.splice(index, 1)
      },
      introHandler(payload) {
        this.introInfo = payload
        $('#activityProductPopup').modal('show')
      },
      async paginationChange({ pageNumber }) {
        this.isLoading = true
        this.paginationInfo.currentPage = pageNumber
        await this.getActivtyProduct()
        window.scrollTo(0, 0)
        this.isLoading = false
      },
      limitedReminder(text) {
        this.limitedText = text
        $('#limit-popup').modal('show')
      },
      getPickedProductParams() {
        return this.pickList.reduce((prev, current) => {
          let { activityProductId, product_code, specId, buyCount } = current
          prev.push({ 
            activity_meta_id: activityProductId, 
            product_code, 
            spec_id: specId, 
            count: buyCount 
          })
          return prev
        }, [])
      },
      async addToCart(activityCode) {
        if (!this.isAchieved) return
        this.isLoading = true
        let response = await cartApi.product_promotions({
          url: this.apiUrl.product_promotions,
          data: {
            code: activityCode,
            count: 1,
            products: this.getPickedProductParams(),
            activity_product_promotions_id: this.promoteId
          }
        })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        if (this.tipInfo.status) {
          this.pickList = []
          this.myHeader.updateCartCount(response.cartTotal)
        }
        $('#tipPopup').modal('show')
        this.isLoading = false
      }
    }
  }
})));