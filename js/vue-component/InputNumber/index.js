Vue.component('input-number', {
  props: {
    min: { type: Number, default: 1 },
    max: { type: Number, required: true },
    count: { type: Number, required: true },
    showUpperLimitedPopup: { type: Boolean, default: false }
  },
  methods: {
    updateCount(num) {
      this.$emit('change-count', num)
    },
    limitedHandler() {
      let text = `抱歉，本商品最多可購買${this.max}件`
      this.$emit('limited-reminder', text)
    },
    stepHandler(num) {
      let newValue = this.count + num
      if (newValue <= 0) return
      if (newValue > this.max) {
        if (this.showUpperLimitedPopup) {
          this.limitedHandler()
        }
        return
      }
      this.updateCount(newValue)
    },
    keydownHandler(e) {
      let keyCode = e.keyCode
      if ([46, 8, 9, 27, 13].indexOf(keyCode) !== -1 ||
        (keyCode === 65 && e.ctrlKey === true) ||
        (keyCode >= 35 && keyCode <= 39)) {
        return
      }
      if ((e.shiftKey || (keyCode < 48 || keyCode > 57)) && (keyCode < 96 || keyCode > 105)) {
        e.preventDefault()
      }
    },
    inputHandler(e) {
      let el = e.target
      let inputValue = el.value
      let parseValue = parseInt(inputValue)
      if (inputValue.trim() === '') return
      if (parseValue < this.min) {
        this.updateCount(this.min)
        el.value = this.min
      } else if (parseValue > this.max) {
        this.updateCount(this.max)
        el.value = this.max
        this.limitedHandler()
      }
    },
    changeHandler(e) {
      let el = e.target
      let inputValue = el.value
      let parseValue = parseInt(inputValue)
      if (inputValue.trim() === '') {
        this.updateCount(this.min)
        el.value = this.min
      } else if (parseValue < this.min || parseValue > this.max) {
        this.updateCount(this.min)
        el.value = this.min
      } else {
        if (parseValue === this.count) return //防止重複觸發
        this.updateCount(parseValue)
        el.value = parseValue
      }
    }
  },
  template: `
    <div class="input-number-component">
      <div class="dir" @click="stepHandler(-1)">
        <i class="fal fa-minus text-link"></i>
      </div>
      <input 
        type="number" 
        class="form-control" 
        :min="min"
        :max="max" 
        :value="count"
        step="1"
        @keydown="keydownHandler"
        @input="inputHandler"
        @change="changeHandler"
        pattern="[0-9]*"
        inputmode="numeric"
      >
      <div class="dir" @click="stepHandler(1)">
        <i class="fal fa-plus text-link"></i>
      </div>
    </div>`
})