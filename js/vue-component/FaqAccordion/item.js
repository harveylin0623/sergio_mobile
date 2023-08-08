Vue.component('faq-accordion-item', {
  props: {
    faq: { type: Object, required: true }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleHandler() {
      this.isOpen = !this.isOpen
      if (this.isOpen) this.$emit('collapse', this.faq.id)
    }
  },
  template: `
    <div class="mb-2 rounded bd-limeGreen">
      <div class="d-flex justify-content-between align-items-center px-3 py-2" @click="toggleHandler">
        <div class="flex-grow-1 flex-shrink-1 d-flex align-items-start pr-1">
          <i class="fas fa-question text-tomatoRed" style="transform:translateY(2px);"></i>
          <p class="ml-1 mb-0 title sm">{{ faq.title }}</p>
        </div>
        <div class="flex-grow-0 flex-shrink-0 text-limeGreen">
          <i class="far fa-chevron-down" v-show="!isOpen"></i>
          <i class="far fa-chevron-up" v-show="isOpen"></i>
        </div>
      </div>
      <div class="px-3 py-2 bd-top-divide" v-show="isOpen">
        <p class="mb-0 text-justify title sm">{{ faq.detail }}</p>
      </div>
    </div>`
})
