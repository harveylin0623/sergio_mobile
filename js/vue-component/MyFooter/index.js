Vue.component('my-footer', {
  data: () => ({
    copyrightYear: new Date().getFullYear(),
    isServer: false,
    localUrl: window.componentPageUrl.myFooter.localUrl,
    serverUrl: window.componentPageUrl.myFooter.serverUrl
  }),
  computed: {
    realUrl() {
      return this.isServer ? this.serverUrl : this.localUrl
    },
    accordionData() {
      return [
        {
          name: '購物說明',
          id: 'a',
          lists: [
            { id: 'a-1', title: '購物須知', url: this.realUrl.shopping, target: '_self' },
            { id: 'a-2', title: '付款配送須知', url: this.realUrl.payment, target: '_self' },
            { id: 'a-3', title: '退換貨需知', url: this.realUrl.refund, target: '_self' },
            { id: 'a-4', title: '常見問題', url: this.realUrl.faq, target: '_self' }
          ]
        },
        {
          name: '會員專區',
          id: 'b',
          lists: [
            { id: 'b-1', title: '會員條款', url: this.realUrl.membership, target: '_self' },
            { id: 'b-2', title: '會員權益', url: this.realUrl.benefits, target: '_self' },
            { id: 'b-3', title: '隱私權政策', url: this.realUrl.privacy, target: '_self' },
            { id: 'b-4', title: '票券查詢', url: this.realUrl.ticket, target: '_self' }
          ]
        },
        {
          name: '關於我們',
          id: 'c',
          lists: [
            { id: 'c-1', title: '關於光南線上購', url: this.realUrl.about_knn, target: '_self' },
            { id: 'c-2', title: '官方網站', url: 'http://www.knn.com.tw/', target: '_blank' },
            { id: 'c-3', title: '門市資訊', url: 'https://www.knn.com.tw/%E9%96%80%E5%B8%82%E8%B3%87%E8%A8%8A', target: '_blank' },
            { id: 'c-4', title: '聯絡我們', url: this.realUrl.contactUs, target: '_self' }
          ]
        }
      ]
    },
  },
  mounted() {
    this.isServer = window.checkIsServer()
  },
  template: `
    <footer id="my-footer">
      <div class="container">
        <footer-accordion :accordion-data="accordionData"></footer-accordion>
        <div class="d-flex justify-content-between align-items-start my-3">
          <div class="text-white">光南APP</div>
          <div class="d-flex justify-content-center align-items-center">
            <div>
              <a href="https://itunes.apple.com/app/id1617019958" class="d-block mb-1 apple-store" target="_blank"></a>
              <a href="https://play.google.com/store/apps/details?id=com.knn.app" class="d-block android-store" tagret="_blank"></a>
            </div>
            <div class="ml-2 qrcode-bg"></div>
          </div>
        </div>
        <div class="copyright">
          <p class="text-center text-white">光南大批發 knn.com.tw</p>
          <p class="text-center text-white">版權所有 {{ copyrightYear }} copyright © 光南大批發(笑笑笑國際股份有限公司)</p>
        </div>
      </div>
    </footer>`
})