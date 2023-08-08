Vue.component('last-category-item', {
  props: {
    lastItem: { type: Object, required: true },
    lastId: { type: Number, required: true }
  },
  computed: {
    isActive() {
      return this.lastItem.id === this.lastId
    }
  },
  methods: {
    toggleHandler() {
      if (this.isActive) return
      this.$emit('update-last-category', {
        lastId: this.lastItem.id,
        categoryName: this.lastItem.category_name
      })
    }
  },
  template: `
    <div class="col-12 mb-2 sm" @click="toggleHandler">
      <div 
        class="title sm mb-0 last-category-item" 
        :class="{active:isActive}"
      >{{ lastItem.category_name }}</div>
    </div>`
})