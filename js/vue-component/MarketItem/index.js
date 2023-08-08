Vue.component('market-item', {
  props: {
    marketType: { type: String, required: true },
    market: { type: Object, required: true }
  },
  computed: {
    isActive() {
      return this.market.type === this.marketType
    },
    borderClass() {
      return this.isActive ? 'bd-limeGreen' : 'bd-divide'
    }
  },
  methods: {
    clickHandler() {
      if (this.isActive) return
      this.$emit('update:market-type', this.market.type)
    }
  },
  template: `
    <div class="d-flex justify-conetent-between align-items-center p-2 mb-2 rounded" :class="borderClass" @click="clickHandler">
      <div class="flex-grow-1 flex-shrink-1 d-flex align-items-center">
        <div :class="['market-bg', market.type]"></div>
        <p class="ml-2 mb-0 title sm">{{ market.name }}</p>
      </div>
      <div>
        <span class="check-ball" :class="{active:isActive}">
          <i class="fad fa-check-circle"></i>
        </span>
      </div>
    </div>`
})