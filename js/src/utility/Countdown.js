(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Countdown = factory());
}(this, (function () {
	 class Countdown {
    constructor(props) {
      const { deadline, updateEvent, timeUpEvent } = props
      this.deadline = new Date(deadline)
      this.updateEvent = updateEvent
      this.timeUpEvent= timeUpEvent
      this.timer = null
      this.init()
    }
    init() {
      this.start()
    }
    checkTimeIsValid() {
      return this.deadline.getTime() >= new Date().getTime()
    }
    start() {
      let isValid = this.checkTimeIsValid()
      if (isValid) {
        this.countdown()
        this.timer = setInterval(() => this.countdown(), 1000 / 60)
      } else {
        this.timeUpEvent()
      }
    }
    clear() {
      clearInterval(this.timer)
      this.timeUpEvent()
    }
    countdown() {
      let now = new Date().getTime()
      let distance = this.deadline.getTime() - now
      let day = Math.floor(distance / (1000 * 60 * 60 * 24))
      let hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      let second = Math.floor((distance % (1000 * 60)) / 1000)
      this.updateEvent({ day, hour, minute, second })
      if (day === 0 && hour === 0 && minute === 0 && second === 0) {
        this.clear()
        return
      }
    }
  }

  return Countdown
})));