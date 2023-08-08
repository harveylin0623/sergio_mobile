Vue.component('logout-modal', {
  methods: {
    logout() {
      this.$emit('logout')
    }
  },
  template: `
    <div class="modal fade" id="logoutPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h2>確定要登出光南帳號?</h2>
          </div>
          <div class="modal-footer flex-column">
            <button class="btn btn-limeGreen limit mb-2" data-dismiss="modal" @click="logout">
              確認
            </button>
            <button class="btn btn-outline-limeGreen limit" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>`
})