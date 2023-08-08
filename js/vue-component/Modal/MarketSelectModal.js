Vue.component('market-select-modal', {
  props: {
    marketList: { type: Array, required: true }
  },
  data: () => ({
    marketType: '',
    backupMarketType: '',
    actionType: ''
  }),
  computed: {
    hasMarket() {
      return this.marketList.length > 0
    }
  },
  methods: {
    setDefaultMarketType(type) {
      this.marketType = this.backupMarketType = type
    },
    confirmHandler() {
      if (this.marketType === '') return
      this.actionType = 'confirm'
      this.$emit('choose-market', this.marketType)
    },
    cancelHandler() {
      this.actionType = 'cancel'
    },
    completelyHidden() {
      if (this.actionType === 'confirm') this.backupMarketType = this.marketType
      if (this.actionType === 'cancel') this.marketType = this.backupMarketType
    }
  },
  mounted() {
    $('#marketPopup').on('hidden.bs.modal', this.completelyHidden)
  },
  template: `
    <div class="modal fade" id="marketPopup" data-backdrop="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header mx-auto">
            <h2>選擇超商</h2>
          </div>
          <div class="p-0 modal-body">
            <market-item
              v-for="market in marketList" 
              :key="market.type"
              :market-type.sync="marketType"
              :market="market"
            ></market-item>
          </div>
          <div class="modal-footer flex-column">
            <button
              v-show="hasMarket"
              class="btn btn-limeGreen limit"
              data-dismiss="modal"
              @click="confirmHandler"
            >確認
            </button>
            <button 
              class="btn btn-outline-limeGreen limit"
              data-dismiss="modal" 
              @click="cancelHandler"
            >取消</button>
          </div>
        </div>
      </div>
    </div>`
})