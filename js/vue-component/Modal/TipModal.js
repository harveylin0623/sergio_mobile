Vue.component('tip-modal', {
  props: {
    id: { type: String, default: Math.random().toString() },
    status: { type: Boolean, default: true },
    content: { type: String, default: '' },
    showCancel: { type: Boolean, default: true },
    showConfirm: { type: Boolean, default: true }
  },
  computed: {
    buttonPosition() {
      return this.showCancel ? 'justify-content-between' : 'justify-content-center'
    }
  },
  methods: {
    confirmHandler() {
      this.$emit('confirm', { id: this.id })
    }
  },
  template: `
    <div :id="id" class="modal fade tip" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="type-a" :class="[status ? 'correct' : 'wrong']">
              <i v-if="status" class="bi bi-check-lg"></i>
              <i v-else class="bi bi-x-lg"></i>
            </div>
            <h2>提示</h2>
          </div>
          <div class="modal-body">{{ content }}</div>
          <div class="modal-footer" :class="buttonPosition">
            <button v-if="showCancel" class="btn btn-outline-a" data-dismiss="modal">取消</button>
            <button v-if="showConfirm" class="btn btn-a" @click="confirmHandler">確認</button>
          </div>
        </div>
      </div>
    </div>`
})