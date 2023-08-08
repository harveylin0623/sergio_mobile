export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      maintainInfo: {
        group1: [
          { title: '會員資料', type: 'user', url: pageUrl.profile, show: true },
          { title: '更改密碼', type: 'password', url: pageUrl.password, show: true },
          { title: '我的點數', type: 'point', url: pageUrl.point, show: true },
          { title: '我的票券', type: 'coupon', url: pageUrl.coupon, show: true },
        ],
        group2: [
          { title: '訂單管理', type: 'order', url: pageUrl.order, show: true },
          { title: '預購訂單', type: 'preorder', url: pageUrl.preorder, show: true },
          { title: '急殺訂單', type: 'group', url: pageUrl.group_buy, show: true },
          { title: '常用收件人', type: 'receiver', url: pageUrl.receiver, show: true },
          { title: '聯絡我們', type: 'contact', url: pageUrl.contactUs, show: true },
          { title: '提問管理', type: 'question', url: pageUrl.question, show: true },
        ],
        group3: { title: '登出', type: 'logout', url: 'javascript:;', show: true },
      },
      userInfo: { name: '' },
      pointData: { title: '', amount: '' },
      levelData: {
        current: { title: '', endDate: '' },
        next: { title: '', value: 0, diff: 0, unit: '', percent: 0, type: '', hasProgress: false },
      },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      greetText() {
        return `Hi,${this.userInfo.name} !`
      },
      showCurrentLevelBlock() {
        return this.levelData.current.title !== ''
      },
      percentageWidth() {
        return { width: `${this.levelData.next.percent}%` }
      },
      currentAmountText() {
        let { value, unit } = this.levelData.next
        return `${this.$options.filters.currency(value)}${unit}`
      },
      nextLevelDesc() {
        let { diff, unit, title, type } = this.levelData.next
        let mappingText = { next: '升等', renew: '續等' }
        let text = mappingText[type] || ''
        return `再消費${this.$options.filters.currency(diff)}${unit}即可${text}${title}`
      }
    },
    methods: {
      cammaToNumber(textNumber) {
        let realNumber = parseInt(textNumber.replace(/,/g, ''))
        return isNaN(realNumber) ? 0 : realNumber
      },
      setPointData(a, b) {
        this.pointData.title = b.aaData.point_information[0].title
        this.pointData.amount = a.amount
      },
      setLevelData(payload) {
        //先判斷有沒有next_level,如果沒有就讀renew_level。如果next_level.progress是空值就讀renew_level
        let { current_level, next_level, renew_level } = payload
        let targetLevel = {}
        this.levelData.current.title = current_level.title
        this.levelData.current.endDate = current_level.level_end_datetime.split(' ')[0]
        if (next_level !== undefined) {
          let hasProgress = next_level.progress.length > 0
          targetLevel = hasProgress ? next_level : renew_level
          this.levelData.next.type = hasProgress ? 'next' : 'renew'
        } else {
          targetLevel = renew_level
          this.levelData.next.type = 'renew'
        }
        if (targetLevel === undefined) return
        if (targetLevel.progress.length === 0) return
        let { type, amount, requirement } = targetLevel.progress[0]
        let unitMapping = { amount: '元', frequency: '次', single: '筆' }
        let amountValue = this.cammaToNumber(amount)
        let requiredValue = this.cammaToNumber(requirement)
        let diff = requiredValue - amountValue
        let percent = (amountValue / requiredValue) * 100
        this.levelData.next.title = targetLevel.title
        this.levelData.next.diff = diff
        this.levelData.next.value = amountValue
        this.levelData.next.percent = percent > 100 ? 100 : percent
        this.levelData.next.unit = unitMapping[type]
        this.levelData.next.hasProgress = true
      },
      getUserName() {
        let storage = window.storageObj.getItem('knn-userInfo')
        if (storage !== null) this.userInfo.name = storage.name
      },
      async getMemberData() {
        let summary = await memberApi.summary({ url: apiUrl.member_summary })
        let currentPoint = summary.aaData.point_summary.current_point[0]
        let pointInfo = await memberApi.point_information({
          url: apiUrl.point_information,
          data: { point_id: [currentPoint.point_id], full_info: false }
        })
        this.setPointData(currentPoint, pointInfo)
        this.setLevelData(summary.aaData.level_summary)
        this.getUserName()
      },
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      await this.getMemberData()
      this.isLoading = false
    }
  })
}