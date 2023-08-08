Vue.component('period-item', {
  props: {
    period: { type: Object, required: true },
    currentPeriodId: { type: Number, required: true }
  },
  computed: {
    startTime() {
      return dayjs(this.period.start_time).format('HH:mm')
    },
    isActive() {
      return this.period.id === this.currentPeriodId
    }
  },
  methods: {
    emitCoordinate() {
      let { offsetLeft, offsetWidth } = this.$refs.el
      this.$emit('position', { left: offsetLeft, width: offsetWidth })
    },
    clickHandler() {
      if (this.isActive) return
      this.$emit('change-period', this.period.id)
      this.emitCoordinate()
    }
  },
  mounted() {
    if (this.isActive) this.emitCoordinate()
  },
  template: `
    <div class="period-item" :class="{active:isActive}" ref="el" @click="clickHandler">
      <p class="time">{{ startTime }}</p>
      <div class="action">
        <p>{{ period.mobile_status }}</p>
      </div>
    </div>`
})