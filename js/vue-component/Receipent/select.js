Vue.component('receipent-select', {
  props: {
    receipent: { type: Object, required: true },
    currentReceipentId: { type: Number, required: true }
  },
  computed: {
    isActive() {
      return this.receipent.id === this.currentReceipentId
    },
    borderClass() {
      return this.isActive ? 'bd-limeGreen' : 'bd-bootstrap'
    },
    isPreset() {
      return this.receipent.preset === 1
    },
    fullAddress() {
      let { city, district, address } = this.receipent
      return `${city}${district}${address}`
    }
  },
  methods: {
    clickHandler() {
      this.$emit('update:current-receipent-id', this.receipent.id)
    }
  },
  template: `
    <div class="d-flex align-items-center p-2 mb-2 rounded" :class="borderClass" @click="clickHandler">
      <div class="flex-grow-1 flexs-shrink-1">
        <div class="mb-2">
          <span class="title sm mb-0">姓名: {{ receipent.name }}</span>
          <span 
            class="px-2 ml-1 mb-0 text-white rounded-pill bg-tomatoRed" 
            v-show="isPreset"
            style="font-size:12px;"
          >預設</span>
        </div>
        <div class="mb-2 title sm">
          電話: <span class="text-dark">{{ receipent.mobile }}</span>
        </div>
        <div class="mb-2 title sm">
          電子信箱: <span class="text-dark">{{ receipent.email }}</span>
        </div>
        <div class="title sm mb-0">
          地址: <span class="text-dark">{{ fullAddress }}</span>
        </div>
      </div>
      <div>
        <span class="check-ball" :class="{active:isActive}">
          <i class="fad fa-check-circle"></i>
        </span>
      </div>
    </div>`
})