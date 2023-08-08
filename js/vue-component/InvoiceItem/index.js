Vue.component('invoice-item', {
  props: {
    invoice: { type: Object, required: true },
    currentInvoiceId: { type: String, required: true }
  },
  computed: {
    isActive() {
      return this.invoice.id === this.currentInvoiceId
    },
    activeCalss() {
      let text = this.isActive ? 'text-limeGreen' : 'text-dark'
      let border = this.isActive ? 'bd-limeGreen' : 'bd-bootstrap'
      return [text, border]
    }
  },
  methods: {
    clickHandler() {
      this.$emit('update:current-invoice-id', this.invoice.id)
    }
  },
  template: `
    <div class="d-flex align-items-center p-2 mr-2 mb-2 rounded" :class="activeCalss" v-show="invoice.display" @click="clickHandler">
      <span class="check-ball" :class="{active:isActive}">
        <i class="fad fa-circle"></i>
      </span>
      <span class="ml-1 mb-0 title sm">{{ invoice.title }}</span>
    </div>`
})