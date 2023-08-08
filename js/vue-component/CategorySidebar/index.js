Vue.component('category-sidebar', {
  props: {
    mainId: { type: Number, default: -1 },
    categoryApiUrl: { type: String, required: true },
    actionType: { type: String, default: 'redirect' }
  },
  data: () => ({
    categoryList: [],
    categoryKey: 'knn-category',
    isServer: false,
    localUrl: window.componentPageUrl.myHeader.localUrl,
    serverUrl: window.componentPageUrl.myHeader.serverUrl
  }),
  computed: {
    isAuth() {
      return this.$store.state.isAuth
    },
    isOpen() {
      return this.$store.state.categorySidebarIsOpen
    },
    realUrl() {
      return this.isServer ? this.serverUrl : this.localUrl
    },
    linkUrl() {
      return [
        { id: 'link-1', title: '文章列表', url: this.realUrl.news },
        { id: 'link-3', title: '優惠活動', url: this.realUrl.activity },
        { id: 'link-4', title: '常見問題', url: this.realUrl.faq },
        { id: 'link-5', title: 'APP下載', url: 'javascript:;', type: 'modal' },
      ]
    }
  },
  methods: {
    closeHandler() {
      this.$store.commit('toggleCategory', false)
    },
    linkClick(payload) {
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
        let lists = await productApi.product_category({ url }).then(res => res.aaData)
        let categoryList = lists.map(item => ({ categoryId: item.id, categoryName: item.category_name }))
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
      <div class="category-header">
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
      <div class="py-2 bg-term link-slider">
        <div class="d-flex align-items-center flex-nowrap container overflow-auto">
          <a 
            v-for="item in linkUrl" 
            :key="item.id"
            :href="item.url"
            class="mr-3 text-link"
            @click="linkClick(item)"
          >{{ item.title }}</a>
        </div>
      </div>
      <div class="py-3">
        <div class="d-flex align-items-center container">
          <i class="fal fa-user-circle fa-lg mr-2 font-weight-bold text-limeGreen"></i>
          <div class="d-flex align-items-center auth-function" v-if="isAuth" >
            <a :href="realUrl.member" class="text-dark">會員中心</a>
            <span class="mx-2">/</span>
            <a href="javascript:;" class="text-dark" @click="logout">登出</a>
          </div>
          <div class="d-flex align-items-center auth-function" v-else>
            <a :href="realUrl.login" class="text-dark">登入</a>
            <span class="mx-2">/</span>
            <a :href="realUrl.register_step1" class="text-dark">註冊</a>
          </div>
        </div>
      </div>
      <div class="py-1 bg-term">
        <div class="container text-link" style="font-size:18px;">商品分類</div>
      </div>
      <div class="overflow-auto category-block">
        <a
          v-for="category in categoryList"
          :key="category.id"
          href="javascript:;" 
          class="d-block w-100 px-3 bd-bottom-divide category-item"
          :class="{active:category.categoryId === mainId}"
          @click="clickCategory(category)"
        >{{ category.categoryName }}</a>
      </div>
    </div>`
})