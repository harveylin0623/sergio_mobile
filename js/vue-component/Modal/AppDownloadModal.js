Vue.component('app-download-modal', {
  template: `
    <div class="modal fade appDownloadPopup" id="appDownloadPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h2>APP下載</h2>
          </div>
          <div class="modal-body">
            <div class="qrcode mx-auto"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-limeGreen mx-auto limit" data-dismiss="modal">確認</button>
          </div>
        </div>
      </div>
    </div>`
})