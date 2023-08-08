Vue.component('footer-accordion', {
  props: {
    accordionData: { type: Array, required: true }
  },
  methods: {
    closeOther(payload) {
      let { id, isOpen } = payload
      if (!isOpen) return
      this.$refs.items.forEach(item => {
        if (item.accordion.id !== id) item.isOpen = false
      })
    }
  },
  template: `
    <div class="footer-accordion">
      <footer-accordion-item
        v-for="accordion in accordionData"
        :key="accordion.id"
        ref="items"
        :accordion="accordion"
        @close-other="closeOther"
      ></footer-accordion-item>
    </div>`
})