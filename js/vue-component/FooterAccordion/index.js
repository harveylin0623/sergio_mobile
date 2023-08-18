Vue.component('footer-accordion', {
  props: {
    accordionData: { type: Array, required: true }
  },
  data: () => ({
    activeId: ''
  }),
  template: `
    <div class="footer-accordion">
      <footer-accordion-item
        ref="items"
        v-for="accordion in accordionData"
        :key="accordion.id"
        :accordion="accordion"
        :active-id.sync="activeId"
      ></footer-accordion-item>
    </div>`
})