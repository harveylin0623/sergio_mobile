Vue.component('footer-accordion-item', {
  props: {
    accordion: { type: Object, required: true },
    activeId: { type: String, required: true }
  },
  computed: {
    isOpen() {
      return this.accordion.id === this.activeId
    }
  },
  methods: {
    toggleHandler() {
      this.$emit('update:activeId', this.isOpen ? '' : this.accordion.id)
    }
  },
  template: `
    <div class="accordion-item">
      <div class="d-flex justify-content-between align-items-center pb-8 mb-8 accordion-header" @click="toggleHandler">
        <p class="text-neutral-7">{{ accordion.name }}</p>
        <p class="text-neutral-7 text-lg">
          <i v-show="!isOpen" class="bi bi-plus"></i>
          <i v-show="isOpen" class="bi bi-dash"></i>
        </p>
      </div>
      <div v-show="isOpen" class="pl-8">
        <a
          v-for="item in accordion.lists"
          :key="item.id"
          :href="item.url"
          :target="item.target"
          class="d-block mb-8 text-neutral-3 text-sm"
        >{{ item.title }}</a>
      </div>
    </div>`
})