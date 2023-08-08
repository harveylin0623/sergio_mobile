export default (() => {
  Vue.component('spec-item', {
    props: {
      spec: { type: Object, required: true },
      currentSpecId: { type: Number, required: true },
    },
    computed: {
      hasStock() {
        return this.spec.spec_stock > 0
      },
      isActive() {
        return this.currentSpecId === this.spec.id
      }
    },
    methods: {
      clickHandler() {
        if (!this.hasStock) return
        if (this.isActive) return
        this.$emit('change-spec', {
          id: this.spec.id,
          stock: this.spec.spec_stock,
          images: this.spec.images
        })
      }
    },
    template: `
      <button
        class="mr-2 mb-2 btn btn-outline-limeGreen title sm" 
        :class="{active:isActive,disabled:!hasStock}"
        @click="clickHandler">
        {{ spec.spec_title }}
      </button>`
  })
})()