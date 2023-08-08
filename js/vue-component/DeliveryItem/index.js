Vue.component('delivery-item', {
  props: {
    deliveryType: { type: String, required: true },
    delivery: { type: Object, required: true }
  },
  computed: {
    isActive() {
      return this.delivery.type === this.deliveryType
    },
    activeCalss() {
      let text = this.isActive ? 'text-limeGreen' : 'text-dark'
      let border = this.isActive ? 'bd-limeGreen' : 'bd-bootstrap'
      return [text, border]
    }
  },
  methods: {
    clickHandler() {
      if (this.isActive) return
      this.$emit('update:delivery-type', this.delivery.type)
    }
  },
  template: `
    <div class="d-flex align-items-center p-2 mr-2 mb-2 rounded" :class="activeCalss" @click="clickHandler">
      <span class="check-ball" :class="{active:isActive}">
        <i class="fad fa-circle"></i>
      </span>
      <span class="ml-1 mb-0 title sm">{{ delivery.name }}</span>
    </div>`
})