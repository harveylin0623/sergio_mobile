export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, initFlatPickerMixin],
    store: window.myVuexStore,
    data: {
      userPoint: { id: 0, title: '', amount: '0', imgUrl: '' },
      expiredPointList: [],
      pointHistoryList: [],
      paginationInfo: { currentPage: 0, isFirst: true },
      isPagLoading: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      storePointTitle() {
        let { title } = this.userPoint
        if (title === '') return ''
        else return `可用${title}點數`
      },
      totalExpiredPoint() {
        return this.expiredPointList.reduce((prev, current) => {
          let amount = parseInt(current.amount.replace(/,/g, ''))
          prev += amount
          return prev
        }, 0)
      },
      buttonText() {
        return this.isPagLoading ? '載入中...' : '看更多'
      },
      hasNextPage() {
        let { currentPage, isFirst } = this.paginationInfo
        return currentPage !== null && isFirst === false
      }
    },
    methods: {
      getPointInformation(pointIds) {
        return memberApi.point_information({ 
          url: apiUrl.point_information,
          data: {  point_id: pointIds, full_info: true }
        }).then(res => {
          return res.aaData.point_information[0]
        })
      },
      getPointHistory(pageNumber) {
        let endDate = this.flatPicker.selectedDates[0]
        let startDate = dayjs(endDate).subtract(this.minMinusDay, 'day').toDate()
        return memberApi.point_history({
          url: apiUrl.point_history,
          data: {
            point_id: this.userPoint.id,
            query_start_datetime: `${this.formatDate(startDate)} 00:00:00`,
            query_end_datetime: `${this.formatDate(endDate)} 23:59:59`,
            offset: pageNumber !== undefined ? pageNumber : this.paginationInfo.currentPage
          }
        })
      },
      setUserPoint(payload) {
        this.userPoint.id = payload.point_id
        this.userPoint.title = payload.point_title
        this.userPoint.amount = payload.point_amount
        this.userPoint.imgUrl = payload.images.url || ''
      },
      createPointHistoryList(payload) {
        return payload.reduce((prev, current) => {
          prev.push({ ...current, imgUrl: this.userPoint.imgUrl })
          return prev
        }, [])
      },
      async getPaginationData(isConcat, pageNumber) {
        let response = await this.getPointHistory(pageNumber)
        let lists = this.createPointHistoryList(response.aaData.point_history)
        if (isConcat) this.pointHistoryList = this.pointHistoryList.concat(lists)
        else this.pointHistoryList = lists
        this.paginationInfo.currentPage = response.next
        this.paginationInfo.isFirst = false
      },
      async getPointData() {
        let { point_summary } = await memberApi.summary({ url: apiUrl.member_summary }).then(res => res.aaData)
        let { point_id, amount:point_amount } = point_summary.current_point[0]
        let [pointInfo, expiredInfo] = await Promise.all([
          this.getPointInformation([point_id]),
          memberApi.point_due_to_expire({ url: apiUrl.point_due_to_expire, data: { point_id } }),
        ])
        this.expiredPointList = expiredInfo.aaData.point_due_to_expire
        this.setUserPoint({
          point_id,
          point_title: pointInfo.title, 
          point_amount,
          images: pointInfo.feature_image 
        })
      },
      async searchHandler() {
        this.isLoading = true
        await this.getPaginationData(false, 0)
        this.isLoading = false
      },
      async seeMore() {
        if (this.isPagLoading) return
        this.isPagLoading = true
        await this.getPaginationData(true)
        this.isPagLoading = false
      },
      showExpiredModal() {
        if (this.totalExpiredPoint === 0) return
        $('#expiredPopup').modal('show')
      }
    },
    async mounted() {
      this.isLoading = true
      this.initFlatPicker()
      await this.checkTokenIsValid({ throwError: true })
      await this.getPointData()
      await this.getPaginationData(false, 0)
      this.isLoading = false
    }
  })
}