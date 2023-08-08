export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      tabList: [
        { title: '可用票券', type: 'valid' },
        { title: '歷史票券', type: 'invalid' },
      ],
      tabContent: {},
      currentTabType: 'valid',
      introInfo: { title: '', content: '', image: '', duration: '', total: '' },
      isPagLoading: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasTabContent() {
        return !_.isEmpty(this.tabContent)
      },
      displaySeeMore() {
        if (!this.hasTabContent) return false
        let targetTab = this.tabContent[this.currentTabType]
        let { offset, isFirst } = targetTab
        return offset !== null && isFirst === false
      },
      buttonText() {
        return this.isPagLoading ? '載入中...' : '看更多'
      },
    },
    methods: {
      getCouponList() {
        return couponApi.coupon_list({
          url: apiUrl.coupon_list,
          data: {
            type: this.currentTabType,
            offset: this.tabContent[this.currentTabType].offset
          }
        })
      },
      getCouponInfo(coupon_ids) {
        return couponApi.coupon_information({
          url: apiUrl.coupon_information,
          data: { coupon_ids, full_info: true }
        }).then(res => {
          return res.aaData.coupon_information
        })
      },
      createTabContent() {
        this.tabContent = this.tabList.reduce((prev, current) => {
          prev[current.type] = { list: [], type: current.type, offset: 0, scrollTop: 0, isFirst: true }
          return prev
        }, {})
      },
      collectCouponId(lists) {
        let arr = lists.map(list => list.coupon_id)
        return Array.from(new Set(arr))
      },
      createCouponList(couponList, couponInfo) {
        return couponList.reduce((prev, current) => {
          let obj = couponInfo.find(coupon => coupon.coupon_id === current.coupon_id)
          prev.push({ ...current, info: obj })
          return prev
        }, [])
      },
      setPaginationInfo(offset) {
        this.tabContent[this.currentTabType].offset = offset
      },
      async getPaginationData(isConcat) {
        let response = await this.getCouponList()
        let { aaData, next } = response
        let couponList = aaData.my_coupon_list
        if (couponList.length === 0) return this.setPaginationInfo(next)
        let coupon_ids = this.collectCouponId(couponList)
        let couponInfo = await this.getCouponInfo(coupon_ids)
        let allCoupon = this.createCouponList(couponList, couponInfo)
        let targetTab = this.tabContent[this.currentTabType]
        if (isConcat) targetTab.list = targetTab.list.concat(allCoupon)
        else targetTab.list = allCoupon
        targetTab.isFirst = false
        this.setPaginationInfo(next)
      },
      async changeTab(tabType) {
        if (this.isPagLoading) return
        this.tabContent[this.currentTabType].scrollY = window.scrollY
        this.currentTabType = tabType
        let targetTab = this.tabContent[tabType]
        if (targetTab.isFirst) {
          this.isLoading = true
          await this.getPaginationData(false)
          this.isLoading = false
        }
        await this.$nextTick()
        window.scrollTo(0, targetTab.scrollY)
      },
      async seeMore() {
        if (this.isPagLoading) return
        this.isPagLoading = true
        await this.getPaginationData(true)
        this.isPagLoading = false
      },
      introCoupon(payload) {
        this.introInfo = payload
        $('#couponPopup').modal('show')
      }
    },
    async mounted() {
      this.isLoading = true
      this.createTabContent()
      await this.checkTokenIsValid({ throwError: true })
      await this.getPaginationData(false)
      this.isLoading = false
    }
  })
}