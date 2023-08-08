export default (() => {
  Vue.component('period-panel', {
    props: {
      periodList: { type: Array, required: true },
      currentPeriodId: { type: Number, required: true }
    },
    computed: {
      
    },
    methods: {
      setScrollPosition({ left, width }) {
        const parent = this.$refs.el
        const remainingSpace = parent.clientWidth - width
        const spaceLeftAndRight = remainingSpace / 2
        parent.scrollLeft = left - spaceLeftAndRight
        parent.style.setProperty('--left', `${left}px`)
        parent.style.setProperty('--width', `${width}px`)
      },
      changePeriod(id) {
        this.$emit('change-period', id)
      }
    },
    template: `
      <div class="position-sticky bg-white period-panel">
        <div class="position-relative d-flex flex-nowrap overflow-auto period-track" ref="el">
          <period-item
            v-for="period in periodList"
            :key="period.id"
            :period="period"
            :current-period-id="currentPeriodId"
            @position="setScrollPosition"
            @change-period="changePeriod"
          ></period-item>
        </div>
      </div>`
  })
})()