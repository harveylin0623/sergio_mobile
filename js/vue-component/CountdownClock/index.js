Vue.component('countdown-clock', {
  props: {
    deadline: { type: String, required: true },
    durationValid: { type: Boolean, default: false }
  },
  data: () => ({
    countdown: null,
    timeInfo: { day: 0, hour: 0, minute: 0, second: 0, timeUp: true },
  }),
  methods: {
    startCountdown() {
      this.countdown = new window.Countdown({
        deadline: this.deadline,
        updateEvent: (payload) => {
          for (let key in payload) {
            this.timeInfo[key] = payload[key]
          }
          this.timeInfo.timeUp = false
        },
        timeUpEvent: () => {
          this.timeInfo.timeUp = true
          this.$emit('update:durationValid', false)
        }
      })
    }
  },
  mounted() {
    if (this.durationValid) this.startCountdown()
  },
  beforeDestroy() {
    this.countdown.clear()
  },
  template: `
    <div class="title sm">
      <span class="bg-pink text-tomatoRed p-1 rounded">{{ timeInfo.day }}</span>
      <span>天</span>
      <span class="bg-pink text-tomatoRed p-1 rounded">{{ timeInfo.hour }}</span>
      <span>時</span>
      <span class="bg-pink text-tomatoRed p-1 rounded">{{ timeInfo.minute }}</span>
      <span>分</span>
      <span class="bg-pink text-tomatoRed p-1 rounded">{{ timeInfo.second }}</span>
      <span>秒</span>
    </div>`
})