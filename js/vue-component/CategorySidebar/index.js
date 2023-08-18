Vue.component('category-sidebar', {
  props: {
    mainId: { type: Number, default: -1 },
    categoryApiUrl: { type: String, required: true },
    actionType: { type: String, default: 'redirect' }
  },
  data: () => ({
    categoryList: [],
    categoryKey: 'category-sidebar-data',
    isServer: false,
    localUrl: window.componentPageUrl.myHeader.localUrl,
    serverUrl: window.componentPageUrl.myHeader.serverUrl
  }),
  computed: {
    realUrl() {
      return this.isServer ? this.serverUrl : this.localUrl
    },
    webFunctionList() {
      return [
        { id: 'link-1', title: '文章列表', url: this.realUrl.news },
        { id: 'link-3', title: '優惠活動', url: this.realUrl.activity },
        { id: 'link-4', title: '常見問題', url: this.realUrl.faq },
        { id: 'link-5', title: '課程專區', url: '' },
        { id: 'link-6', title: 'APP下載', url: 'javascript:;', type: 'modal' },
      ]
    },
    isAuth() {
      return this.$store.state.isAuth
    },
    isOpen() {
      return this.$store.state.categorySidebarIsOpen
    },
    cartCount() {
      return this.$store.state.cartCount
    }
  },
  methods: {
    closeHandler() {
      this.$store.commit('toggleCategory', false)
    },
    functionClick(payload) {
      if (payload.type !== 'modal') return
      $('#appDownloadPopup').modal('show')
    },
    logout() {
      this.$store.commit('toggleCategory', false)
      $('#logoutPopup').modal('show')
    },
    clickCategory(payload) {
      let { categoryId, categoryName } = payload
      if (this.actionType === 'redirect') {
        location.href = `${this.realUrl.allProduct}?mainId=${categoryId}&categoryName=${categoryName}`
      } else {
        this.$emit('search-category', payload)
      }
    },
    async getCategoryData() {
      let storageData = window.sessionStorageObj.getItem(this.categoryKey)
      if (storageData === null) {
        let url = `${this.categoryApiUrl}?category_id=0`
        let response = await productApi.product_category({ url }).then(res => res.aaData)
        let categoryList = response.map(item => ({ categoryId: item.id, categoryName: item.category_name }))
        categoryList = categoryList.filter(item => item.categoryId !== 0)
        window.sessionStorageObj.setItem(this.categoryKey, categoryList)
        this.categoryList = categoryList
      } else {
        this.categoryList = storageData
      }
    }
  },
  mounted() {
    this.isServer = window.checkIsServer()
    this.getCategoryData()
  },
  template: `
    <div id="categorySidebar" :class="{open:isOpen}">
      <div class="py-10 category-header">
        <div class="d-flex align-items-center px-16">
          <div class="mr-8 text-primary-1 text-3xl" @click="closeHandler">
            <i class="bi bi-x-lg"></i>
          </div>
          <p class="d-flex align-items-center">
            <span class="mr-2 logo-bg"></span>
          </p>
        </div>
      </div>
      <div class="pb-16 text-lg">
        <div class="d-flex justify-content-between align-items-center px-16">
          <div v-if="isAuth" class="d-flex align-items-center">
            <i class="bi bi-person mr-6"></i>
            <a :href="realUrl.member" class="text-neutral-0">會員中心</a>
            <span class="mx-8">/</span>
            <p @click="logout">登出</p>
          </div>
          <div v-else class="d-flex align-items-center">
            <a :href="realUrl.login" class="text-neutral-0">登入</a>
            <span class="mx-8">/</span>
            <a :href="realUrl.register_step1" class="text-neutral-0">註冊</a>
          </div>
          <div class="d-flex align-items-center">
            <i class="bi bi-file-earmark-check"></i>
            <span class="mx-4">詢價單</span>
            <span v-if="isAuth" class="text-wrong">({{ cartCount }})</span>
          </div>
        </div>
      </div>
      <div class="scroll-block overflow-auto">
        <div class="px-16 py-4 text-sm bg-neutral-5 position-sticky" style="top:0px;">網站功能</div>
        <div class="px-16 divide-y-neutral-4">
          <a 
            v-for="item in webFunctionList" 
            :key="item.id"
            :href="item.url"
            class="d-flex justify-content-between py-12 text-neutral-0"
            @click="functionClick(item)"
          >
            <span>{{ item.title }}</span>
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
        <div class="px-16 py-4 text-sm bg-neutral-5 position-sticky" style="top:0px;">商品種類</div>
        <div class="divide-y-neutral-4">
          <p
            v-for="category in categoryList"
            :key="category.id"
            class="p-12 category-item"
            :class="{active:category.categoryId === mainId}"
            @click="clickCategory(category)"
          >{{ category.categoryName }}</p>
        </div>
      </div>
    </div>`
})