Vue.component('tip-modal', {
  props: {
    id: { type: String, default: 'tip-modal-1' },
    status: { type: Boolean, default: true },
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
      this.$emit('confirm')
    }
  },
  watch: {
    isOpen(val) {
      $(`#${this.id}`).modal(val ? 'show' : 'hide')
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
            <h2>{{ title }}</h2>
          </div>
          <div class="modal-body">
            <p class="text-center">{{ content }}</p>
          </div>
          <div class="modal-footer" :class="buttonPosition">
            <button v-if="showCancel" class="btn btn-outline-a" data-dismiss="modal">取消</button>
            <button v-if="showConfirm" class="btn btn-a" @click="confirmHandler">確認</button>
          </div>
        </div>
      </div>
    </div>`
})