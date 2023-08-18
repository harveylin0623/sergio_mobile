Vue.component('step-item', {
  props: {
    stepCount: { type: Number, required: true },
    stepIndex: { type: Number, required: true },
    step: { type: Object, required: true },
  },
  computed: {
    isLastStep() {
      return this.stepIndex === this.stepCount - 1 
    },
  },
  template: `
    <div class="d-flex align-items-center">
      <div class="step-item" :class="{done:step.done}">
        <div class="number">
          <i v-if="step.done" class="bi bi-check-lg text-lg"></i>
          <span v-else>{{ stepIndex + 1 }}</span>
        </div>
        <div class="text">{{ step.text }}</div>
      </div>
      <div v-if="!isLastStep" class="step-line" :class="{done:step.done}"></div>
    </div>`
})