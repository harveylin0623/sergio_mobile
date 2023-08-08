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
    <div class="modal fade" id="reloginPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h5>請重新登入</h5>
          </div>
          <div class="modal-footer flex-column">
            <a :href="realUrl" class="btn btn-limeGreen limit">確認</a>
          </div>
        </div>
      </div>
    </div>`
})