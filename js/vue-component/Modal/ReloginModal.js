Vue.component('relogin-modal', {
  data() {
    return {
      localUrl: window.componentPageUrl.myHeader.localUrl.login,
      serverUrl: window.componentPageUrl.myHeader.serverUrl.login,
      isServer: false
    }
  },
  computed: {
    realUrl() {
      return this.isServer ? this.serverUrl : this.localUrl
    }
  },
  mounted() {
    this.isServer = window.checkIsServer()
  },
  template: `
    <div id="reloginPopup" class="modal fade tip" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="type-b">
					    <i class="bi bi-exclamation-lg"></i>
				    </div>
            <h2>提示</h2>
          </div>
          <div class="modal-body">
            <p class="text-center">請重新登入</p>
          </div>
          <div class="justify-content-center modal-footer">
            <a :href="realUrl" class="btn btn-a">確認</a>
          </div>
        </div>
      </div>
    </div>`
})