Vue.component('app-download-modal', {
  template: `
    <div id="appDownloadPopup" class="modal fade" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2>APP下載</h2>
          </div>
          <div class="modal-body">
            <div class="qrcode mx-auto"></div>
          </div>
          <div class="justify-content-center modal-footer">
            <button class="btn btn-a" data-dismiss="modal">確認</button>
          </div>
        </div>
      </div>
    </div>`
})