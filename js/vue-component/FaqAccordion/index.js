Vue.component('faq-accordion', {
  props: {
    faqList: { type: Array, required: true }
  },
  methods: {
    collapseHandler(id) {
      this.$refs.faqs.forEach(item => {
        if (item.faq.id !== id) item.isOpen = false
      })
    }
  },
  template: `
    <div>
      <faq-accordion-item 
        v-for="faq in faqList"
        :key="faq.id"
        :faq="faq"
        ref="faqs"
        @collapse="collapseHandler"
      ></faq-accordion-item>
    </div>`
})