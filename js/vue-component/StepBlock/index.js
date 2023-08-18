Vue.component('step-block', {
  props: {
    stepList: { type: Array, required: true }
  },
  computed: {
    stepCount() {
      return this.stepList.length
    }
  },
  template: `
    <div class="d-flex justify-content-center align-items-center mb-16 step-block">
      <step-item
        v-for="(step,index) in stepList"
        :key="index"
        :step-index="index"
        :step-count="stepCount"
        :step="step"
      ></step-item>
    </div>`
})