Vue.component('receiver-cart-modal', {
  props: {
    receipentList: { type: Array, required: true }
  },
  data: () => ({
    currentReceipentId: 0,
    backupReceipentId: 0,
    actionType: 'cancel'
  }),
  methods: {
    setDefaultReceipentId() {
      let obj = this.receipentList.find(receipent => receipent.preset === 1)
      if (obj === undefined) return
      this.currentReceipentId = this.backupReceipentId = obj.id
    },
    confirmHandler() {
      this.actionType = 'confirm'
      let obj = this.receipentList.find(item => item.id === this.currentReceipentId)
      if (obj === undefined) return
      this.$emit('set-recipient', obj)
      $('#recipientPopup').modal('hide')
    },
    cancelHandler() {
      this.actionType = 'cancel'
      $('#recipientPopup').modal('hide')
    },
    completelyHidden() {
      if (this.actionType === 'confirm') this.backupReceipentId = this.currentReceipentId
      if (this.actionType === 'cancel') this.currentReceipentId = this.backupReceipentId
    }
  },
  mounted() {
    this.setDefaultReceipentId()
    $('#recipientPopup').on('hidden.bs.modal', this.completelyHidden)
  },
  template: `
    <div class="modal fade" id="recipientPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h2>選擇收件人</h2>
          </div>
          <div class="p-0 modal-body">
            <div>
              <receipent-select 
                v-for="receipent in receipentList" 
                :key="receipent.id"
                :receipent="receipent"
                :current-receipent-id.sync="currentReceipentId"
              ></receipent-select>
            </div>
          </div>
          <div class="modal-footer flex-column">
            <button class="btn btn-limeGreen mx-auto limit" @click="confirmHandler">確認</button>
            <button class="btn btn-outline-limeGreen mx-auto limit" @click="cancelHandler">取消</button>
          </div>
        </div>
      </div>
    </div>`
})