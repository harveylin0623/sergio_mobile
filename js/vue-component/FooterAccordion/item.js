Vue.component('footer-accordion-item', {
  props: {
    accordion: { type: Object, required: true }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleHandler() {
      this.isOpen = !this.isOpen
      this.$emit('close-other', { id: this.accordion.id, isOpen: this.isOpen })
    }
  },
  template: `
    <div class="mb-2 accordion-item">
      <div class="d-flex justify-content-between align-items-center pb-2 mb-2 accordion-header" @click="toggleHandler">
        <p class="text-white">{{ accordion.name }}</p>
        <span class="text-limeGreen">
          <i class="fal fa-plus" v-show="!isOpen"></i>
          <i class="fal fa-minus" v-show="isOpen"></i>
        </span>
      </div>
      <div class="pl-2 accordion-content" v-show="isOpen">
        <a
          v-for="item in accordion.lists"
          :key="item.id"
          :href="item.url"
          :target="item.target"
          class="d-block mb-2"
        >{{ item.title }}</a>
      </div>
    </div>`
})