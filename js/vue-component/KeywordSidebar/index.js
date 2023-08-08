Vue.component('keyword-sidebar', {
  props: {
    actionType: { type: String, default: 'redirect' },
    keywordApiUrl: { type: String, required: true }
  },
  data: () => ({
    keywordList: [],
    productKeyword: '',
    isServer: false,
    localUrl: window.componentPageUrl.myHeader.localUrl,
    serverUrl: window.componentPageUrl.myHeader.serverUrl
  }),
  computed: {
    isOpen() {
      return this.$store.state.keywordSidebarIsOpen
    },
    realUrl() {
      return this.isServer ? this.serverUrl : this.localUrl
    },
  },
  methods: {
    closeHandler() {
      this.$store.commit('toggleKeyword', false)
    },
    searchHandler() {
      if (this.actionType === 'redirect') {
        location.href = `${this.realUrl.searchProduct}?productKeyword=${this.productKeyword}`
      } else {
        this.$emit('search-keyword', this.productKeyword)
      }
    },
    clickKeyword(payload) {
      let { keyword } = payload
      if (this.actionType === 'redirect') {
        location.href = `${this.realUrl.searchProduct}?productKeyword=${keyword}`
      } else {
        this.productKeyword = keyword
        this.searchHandler()
      }
    },
    async getKeywordData() {
      let storageData = window.sessionStorageObj.getItem('keyword')
      if (storageData === null) {
        this.keywordList = await scenesApi.keyword({ url: this.keywordApiUrl}).then(res => res.aaData)
        window.sessionStorageObj.setItem('keyword', this.keywordList)
      } else {
        this.keywordList = storageData
      }
    },
  },
  mounted() {
    this.isServer = window.checkIsServer()
    this.getKeywordData()
  },
  template: `
    <div id="keywordSidebar" :class="{open:isOpen}">
      <div class="keyword-header">
        <div class="container d-flex align-items-center">
          <div class="mr-2 text-limeGreen" @click="closeHandler">
            <i class="fal fa-times"></i>
          </div>
          <a href="javascript:;" class="d-flex align-items-center">
            <span class="mr-2 logo-bg"></span>
            <h2 class="text-moBlue font-weight-bold logo-title">光南大批發</h2>
          </a>
        </div>
      </div>
      <div class="py-3 search-block">
        <div class="d-flex container">
          <input type="text" class="form-control" v-model.trim="productKeyword" placeholder="請輸入關鍵字"/>
          <button class="btn btn-limeGreen" @click="searchHandler">
            <i class="fal fa-search"></i>
            <span>搜尋</span>
          </button>
        </div>
      </div>
      <div class="py-1 bg-term">
        <div class="container text-link">熱門收尋</div>
      </div>
      <div class="py-3 overflow-auto lists-block">
        <div class="d-flex flex-wrap container">
          <a
            v-for="item in keywordList"
            :key="item.id"
            href="javascript:;"
            class="py-1 px-3 mb-2 mr-2 text-white bg-limeGreen rounded-pill title sm keyword-item"
            @click="clickKeyword(item)"
          >{{ item.keyword }}</a>
        </div>
      </div>
    </div>`
})