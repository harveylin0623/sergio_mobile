Vue.component('sub-category-item', {
  props: {
    subItem: { type: Object, required: true },
    subId: { type: Number, required: true }
  },
  data: () => ({
    isOpen: false
  }),
  computed: {
    hasChildren() {
      return this.subItem.subcategories.length > 0
    },
    isActive() {
      return this.subItem.id === this.subId
    }
  },
  methods: {
    toggleHandler() {
      this.isOpen = !this.isOpen
      this.$emit('update-sub-category', {
        subId: this.isOpen ? this.subItem.id : -1,
        categoryName: this.subItem.category_name,
        hasChildren: this.hasChildren,
      })
    }
  },
  mounted() {
    this.isOpen = this.isActive
  },
  watch: {
    isActive(val) {
      this.isOpen = val
    }
  },
  template: `
    <div class="d-flex justify-content-between align-items-center bd-bottom-divide sub-category-item" @click="toggleHandler" :class="{active:isActive}">
      <span class="mb-0 pr-1 title sm">{{ subItem.category_name }}</span>
      <template v-if="hasChildren">
        <i class="fal fa-minus text-dark" v-show="isOpen"></i>
        <i class="fal fa-plus text-dark" v-show="!isOpen"></i>
      </template>
    </div>`
})