Vue.component('activity-sidebar', {
  props: {
    isOpen: { type: Boolean, default: false },
    activityType: { type: String, default: '' },
    pageUrl: { type: String, default: '' },
  },
  data: () => ({
    lists: [
      { title: '滿額活動', type: 'full_amount_price', show: true },
      { title: '滿件活動', type: 'full_amount_count', show: true },
      { title: '紅配綠活動', type: 'red_with_green', show: true },
      { title: '限時限量活動', type: 'limit_time', show: true },
      { title: '預購活動', type: 'preorder', show: true },
      { title: '急殺活動', type: 'group_buy', show: true },
    ]
  }),
  computed: {
    activityList() {
      return this.lists.reduce((prev, current) => {
        let linkUrl = `${this.pageUrl}?activityCode=${current.type}`
        prev.push({ ...current, linkUrl })
        return prev
      }, [])
    }
  },
  methods: {
    closeHandler() {
      this.$emit('update:is-open', false)
    }
  },
  template: `
    <div id="activitySidebar" :class="{open:isOpen}">
      <div class="activity-header">
        <div class="container d-flex align-items-center">
          <div class="mr-2 text-limeGreen" @click="closeHandler">
            <i class="fal fa-times"></i>
          </div>
          <a href="javascript:;" class="d-flex align-items-center">
            <h2 class="text-moBlue font-weight-bold logo-title">優惠活動</h2>
          </a>
        </div>
      </div>
      <div class="overflow-auto lists-block">
        <a
          v-for="(activity,index) in activityList"
          :key="index"
          :href="activity.linkUrl" 
          class="py-2 px-3 bd-bottom-divide text-dark"
          :class="[{active:activity.type === activityType}, activity.show ? 'd-block' : 'd-none']"
        >{{ activity.title }}</a>
      </div>
    </div>`
})