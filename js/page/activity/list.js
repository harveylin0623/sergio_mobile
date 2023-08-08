export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      mappingActivityCode: {
        full_amount_price: { title: '滿額活動', url: pageUrl.full_amount_price },
        full_amount_count: { title: '滿件活動', url: pageUrl.full_amount_count },
        red_with_green: { title: '紅配綠活動', url: pageUrl.red_with_green },
        limit_time: { title: '限時限量活動', url: pageUrl.limit_time },
        preorder: { title: '預購活動', url: pageUrl.preorder },
        group_buy: { title: '急殺活動', url: pageUrl.groupbuy },
      },
      currentActivityCode: '',
      allActivity: [],
      logoutGoHome: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      activityList() {
        if (this.currentActivityCode === '') return this.allActivity
        else return this.allActivity.filter(activity => activity.code === this.currentActivityCode)
      }
    },
    methods: {
      setDefaultActivityCode() {
        let query = window.getQuery('activityCode')
        let code = query === null ? '' : this.mappingActivityCode[query] !== undefined ? query : ''
        this.currentActivityCode = code
      },
      createActivity(lists) {
        return lists.reduce((prev, current) => {
          let { id, title, code, images } = current
          let imgUrl = images[0] || ''
          let linkUrl = `${this.mappingActivityCode[code].url}?promoteId=${id}`
          prev.push({ title, imgUrl, linkUrl, code })
          return prev
        }, [])
      },
      async getAllActivity() {
        let response = await activityApi.product_promotions({ url: apiUrl.product_promotions })
        this.allActivity = this.createActivity(response.aaData)
      }
    },
    async mounted() {
      this.isLoading = true
      this.setDefaultActivityCode()
      await this.checkTokenIsValid({ throwError: false })
      await this.getAllActivity()
      this.isLoading = false
    }
  })
}
