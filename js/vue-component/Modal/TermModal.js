Vue.component('article-modal', {
  props: {
    id: { type: String, default: 'term-modal-1' },
    title: { type: String, default: '提示' },
    content: { type: String, default: '' },
    isOpen: { type: Boolean, default: false },
    showCancel: { type: Boolean, default: false },
    showConfirm: { type: Boolean, default: true },
  },
  computed: {
    buttonPosition() {
      return this.showCancel ? 'justify-content-between' : 'justify-content-center'
    }
  },
  methods: {
    confirmHandler() {
      this.$emit('update:isOpen', false)
      this.$emit('confirm')
    }
  },
  watch: {
    isOpen(val) {
      $(`#${this.id}`).modal(val ? 'show' : 'hide')
    }
  },
  template: `
    <div :id="id" class="modal fade" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ title }}</h2>
          </div>
          <div class="modal-body" v-html="content"></div>
          <div class="modal-footer" :class="buttonPosition">
            <button v-if="showCancel" class="btn btn-outline-a" data-dismiss="modal">取消</button>
            <button v-if="showConfirm" class="btn btn-a" @click="confirmHandler">確認</button>
          </div>
        </div>
      </div>
    </div>`
})