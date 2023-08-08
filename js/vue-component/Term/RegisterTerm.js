export default (() => {
  Vue.component('register-term', {
    props: {
      info: { type: Object, required: true },
      order: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    computed: {
      concatText() {
        return this.order < this.total - 1 ? '及' : ''
      }
    },
    methods: {
      clickHandler() {
        this.$emit('term-detail', this.info.id)
      }
    },
    template: `
      <div>
        <span class="text-limeGreen" type="button" @click="clickHandler">{{ info.title }}</span>{{ concatText }}
      </div>`
  })
})()