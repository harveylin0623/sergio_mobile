Vue.component('notify-accordion', {
  props: {
    notifyList: { type: Array, required: true },
  },
  methods: {
    collapseHandler(id) {
      this.$emit('set-read-status', id)
      this.$refs['notify-item'].forEach(item => {
        if (item.notify.id !== id) item.isOpen = false
      })
    },
  },
  template: `
    <div>
      <notify-item
        v-for="notify in notifyList"
        :key="notify.id"
        :notify="notify"
        ref="notify-item"
        @collapse="collapseHandler"
      ></notify-item>
    </div>`
})