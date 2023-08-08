Vue.component('activity-product-modal', {
  props: {
    introInfo: { tyep: Object, required: true }
  },
  template: `
    <div class="modal fade" id="activityProductPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="p-0 mb-2 modal-header">
            <div class="position-relative w-100" style="padding-top:100%">
              <img class="position-absolute full-img" :src="introInfo.imgUrl" style="left:0;top:0"/>
            </div>
          </div>
          <div class="p-0 modal-body">
            <p class="mb-2">{{ introInfo.name }}</p>
            <div class="mb-2 title sm text-link">{{ introInfo.summary }}</div>
            <div>
              <div class="d-flex align-items-center align-items-center mb-1 title sm">
                <p class="flex-grow-0 flex-shrink-0" style="width:70px">規格:</p>
                <p class="flex-grow-1 flex-shrink-1">{{ introInfo.specTitle }}</p>
              </div>
              <div class="d-flex align-items-center align-items-center mb-0 title sm">
                <p class="flex-grow-0 flex-shrink-0" style="width:70px">優惠價:</p>
                <p class="flex-grow-1 flex-shrink-1">
                  <span class="text-tomatoRed">{{'$'}}{{ introInfo.price | currency }}</span> 元
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-limeGreen mx-auto limit" data-dismiss="modal">確認</button>
          </div>
        </div>
      </div>
    </div>`
})