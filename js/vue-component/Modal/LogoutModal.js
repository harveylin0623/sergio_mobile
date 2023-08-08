Vue.component('logout-modal', {
  methods: {
    logout() {
      this.$emit('logout')
    }
  },
  template: `
    <div id="logoutPopup" class="modal fade tip" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="type-b">
              <i class="bi bi-exclamation-lg"></i>
            </div>
            <h2>提示</h2>
          </div>
          <div class="modal-body">
            <p class="text-center">您確定要登出?</p>
          </div>
          <div class="justify-content-between modal-footer">
            <button class="btn btn-outline-a" data-dismiss="modal">取消</button>
            <button class="btn btn-a" data-dismiss="modal" @click="logout">確認</button>
          </div>
        </div>
      </div>
    </div>`
})