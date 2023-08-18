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
      <div class="py-10 keyword-header">
        <div class="d-flex align-items-center px-16">
          <div class="mr-8 text-primary-1 text-3xl" @click="closeHandler">
            <i class="bi bi-x-lg"></i>
          </div>
          <p class="d-flex align-items-center">
            <span class="mr-2 logo-bg"></span>
          </p>
        </div>
      </div>
      <div class="py-16 search-block">
        <div class="d-flex px-16">
          <input type="text" v-model.trim="productKeyword" placeholder="請輸入關鍵字"/>
          <button class="btn btn-a" @click="searchHandler">
            <i class="bi bi-search"></i>
            <span>搜尋</span>
          </button>
        </div>
      </div>
      <div class="px-16 py-4 text-sm bg-neutral-5">熱門搜尋</div>
      <div class="py-3 overflow-auto lists-block">
        <div class="d-flex flex-wrap px-16 space-x-6">
          <p
            v-for="item in keywordList"
            :key="item.id"
            class="px-16 py-4 mb-6 bg-primary-2 text-neutral-7 rounded-full text-sm keyword-item"
            @click="clickKeyword(item)"
          >{{ item.keyword }}</p>
        </div>
      </div>
    </div>`
})