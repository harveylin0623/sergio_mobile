Vue.component('my-header', {
  props: {
    apiUrl: { type: Object, required: true },
  },
  data: () => ({
    notifyInfo: { list: [], unReadTotal: 0 },
    isServer: false,
    localUrl: window.componentPageUrl.myHeader.localUrl,
    serverUrl: window.componentPageUrl.myHeader.serverUrl
  }),
  computed: {
    realUrl() {
      return this.isServer ? this.serverUrl : this.localUrl
    },
    cartPageUrl() {
      return this.isAuth ? this.realUrl.cart : this.realUrl.login
    },
    isAuth() {
      return this.$store.state.isAuth
    },
    cartCount() {
      return this.$store.state.cartCount
    },
    showCartCount() {
      return this.isAuth && this.cartCount > 0
    },
    showNotifyDot() {
      return this.notifyInfo.unReadTotal > 0
    }
  },
  methods: {
    toggleCategory() {
      this.$store.commit('toggleCategory', true)
    },
    toggleKeyword() {
      this.$store.commit('toggleKeyword', true)
    },
    updateCartCount(count) {
      this.$store.commit('updateCartCount', count)
    },
    async setAuthStatus(status) {
      if (!status) return
      let [cartRes, notifyRes] = await Promise.all([
        cartApi.cart_total({ url: this.apiUrl.cart_total }),
        notifyApi.notification({ url: `${this.apiUrl.notification}?page=1` })
      ])
      this.updateCartCount(cartRes.cartTotal)
      this.notifyInfo.list = notifyRes.aaData
      this.notifyInfo.unReadTotal = notifyRes.unread
    },
  },
  mounted() {
    this.isServer = window.checkIsServer()
  },
  template: `
    <header id="my-header" class="py-10 bg-neutral-7">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="mr-8 text-primary-1 text-4xl" @click="toggleCategory">
            <i class="bi bi-list"></i>	
          </div>
          <a :href="realUrl.home" class="d-flex align-items-center">
            <span class="mr-2 logo-bg"></span>
          </a>
        </div>
        <div class="d-flex align-items-center space-x-16">
          <div class="icon-page-link" @click="toggleKeyword">
            <i class="bi bi-search"></i>
          </div>
          <a v-if="isAuth" :href="realUrl.notify" class="icon-page-link">
            <i class="bi bi-bell"></i>
            <span v-if="showNotifyDot" class="bg-wrong rounded-circle bell-dot"></span>
          </a>
          <a :href="cartPageUrl" class="icon-page-link">
            <i class="bi bi-file-earmark-check"></i>
            <span v-if="showCartCount" class="text-neutral-7 bg-wrong rounded-full text-center cart-count">
              {{ cartCount }}
            </span>
          </a>
        </div>
      </div>
    </header>`
})
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
            { id: 'c-2', title: '官方網站', url: 'javascript:;', target: '_blank' },
            { id: 'c-3', title: '門市資訊', url: 'javascript:;', target: '_blank' },
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
    <footer id="my-footer" class="pt-16 bg-neutral-1">
      <div class="container">
        <footer-accordion :accordion-data="accordionData"></footer-accordion>
        <div class="my-20">
          <div class="mb-16 text-neutral-7">下載 APP</div>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <a href="javascript:;" class="d-block mb-8 apple-store" target="_blank"></a>
              <a href="javascript:;" class="d-block android-store" tagret="_blank"></a>
            </div>
            <div class="qrcode-bg"></div>
          </div>
        </div>
        <p class="pb-10 text-center text-neutral-7 text-xs">© 版權所有 copyright</p>
      </div>
    </footer>`
})
Vue.component('footer-accordion', {
  props: {
    accordionData: { type: Array, required: true }
  },
  data: () => ({
    activeId: ''
  }),
  template: `
    <div class="footer-accordion">
      <footer-accordion-item
        ref="items"
        v-for="accordion in accordionData"
        :key="accordion.id"
        :accordion="accordion"
        :active-id.sync="activeId"
      ></footer-accordion-item>
    </div>`
})
Vue.component('footer-accordion-item', {
  props: {
    accordion: { type: Object, required: true },
    activeId: { type: String, required: true }
  },
  computed: {
    isOpen() {
      return this.accordion.id === this.activeId
    }
  },
  methods: {
    toggleHandler() {
      this.$emit('update:activeId', this.isOpen ? '' : this.accordion.id)
    }
  },
  template: `
    <div class="accordion-item">
      <div class="d-flex justify-content-between align-items-center pb-8 mb-8 accordion-header" @click="toggleHandler">
        <p class="text-neutral-7">{{ accordion.name }}</p>
        <p class="text-neutral-7 text-lg">
          <i v-show="!isOpen" class="bi bi-plus"></i>
          <i v-show="isOpen" class="bi bi-dash"></i>
        </p>
      </div>
      <div v-show="isOpen">
        <a
          v-for="item in accordion.lists"
          :key="item.id"
          :href="item.url"
          :target="item.target"
          class="d-block mb-8 text-neutral-3 text-sm"
        >{{ item.title }}</a>
      </div>
    </div>`
})
Vue.component('loading', {
  template: `
    <div id="loading-backdrop">
      <div class="svg-wrapper">
        <svg height="150" width="150" xmlns="http://www.w3.org/2000/svg">
          <circle class="shape" cx="75" cy="75" r="70"/>
        </svg>
      </div>
    </div>`
})
Vue.component('tip-modal', {
  props: {
    id: { type: String, default: 'tip-modal-1' },
    status: { type: Boolean, default: true },
    title: { type: String, default: '提示' },
    content: { type: String, default: '' },
    isOpen: { type: Boolean, default: false },
    showCancel: { type: Boolean, default: false },
    showConfirm: { type: Boolean, default: true },
  },
  computed: {
    buttonPosition() {
      return this.showCancel ? 'justify-content-between' : 'justify-content-center'
    }
  },
  methods: {
    confirmHandler() {
      this.$emit('update:isOpen', false)
      this.$emit('confirm')
    }
  },
  watch: {
    isOpen(val) {
      $(`#${this.id}`).modal(val ? 'show' : 'hide')
    }
  },
  template: `
    <div :id="id" class="modal fade tip" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="type-a" :class="[status ? 'correct' : 'wrong']">
              <i v-if="status" class="bi bi-check-lg"></i>
              <i v-else class="bi bi-x-lg"></i>
            </div>
            <h2>{{ title }}</h2>
          </div>
          <div class="modal-body">
            <p class="text-center">{{ content }}</p>
          </div>
          <div class="modal-footer" :class="buttonPosition">
            <button v-if="showCancel" class="btn btn-outline-a" data-dismiss="modal">取消</button>
            <button v-if="showConfirm" class="btn btn-a" @click="confirmHandler">確認</button>
          </div>
        </div>
      </div>
    </div>`
})
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
Vue.component('logout-modal', {
  methods: {
    logout() {
      this.$emit('logout')
    }
  },
  template: `
    <div id="logoutPopup" class="modal fade tip" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="type-b">
              <i class="bi bi-exclamation-lg"></i>
            </div>
            <h2>提示</h2>
          </div>
          <div class="modal-body">
            <p class="text-center">您確定要登出?</p>
          </div>
          <div class="justify-content-between modal-footer">
            <button class="btn btn-outline-a" data-dismiss="modal">取消</button>
            <button class="btn btn-a" data-dismiss="modal" @click="logout">確認</button>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('relogin-modal', {
  data() {
    return {
      localUrl: window.componentPageUrl.myHeader.localUrl.login,
      serverUrl: window.componentPageUrl.myHeader.serverUrl.login,
      isServer: false
    }
  },
  computed: {
    realUrl() {
      return this.isServer ? this.serverUrl : this.localUrl
    }
  },
  mounted() {
    this.isServer = window.checkIsServer()
  },
  template: `
    <div id="reloginPopup" class="modal fade tip" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="type-b">
					    <i class="bi bi-exclamation-lg"></i>
				    </div>
            <h2>提示</h2>
          </div>
          <div class="modal-body">
            <p class="text-center">請重新登入</p>
          </div>
          <div class="justify-content-center modal-footer">
            <a :href="realUrl" class="btn btn-a">確認</a>
          </div>
        </div>
      </div>
    </div>`
})
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
Vue.component('contact-modal', {
  props: {
    productInfo: { type: Object, required: true },
    specImgUrl: { required: true },
    showProduct: { type: Boolean, default: true }
  },
  data: () => ({
    contactInfo: { title: '', message: '' },
  }),
  methods: {
    async submitHandler() {
      let isValid = await this.$refs.form.validate()
      if (!isValid) return
      this.$emit('contact', this.contactInfo)
    },
    closeModal(isReset) {
      $('#contactPopup').modal('hide')
      if (isReset) this.resetForm()
    },
    resetForm() {
      this.contactInfo.title = ''
      this.contactInfo.message = ''
      this.$refs.form.reset()
    }
  },
  template: `
    <div class="modal" id="contactPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header mx-auto">
            <h2>聯絡客服</h2>
          </div>
          <div class="p-0 modal-body">
            <div class="mb-2 rounded bd-limeGreen" v-if="showProduct">
              <div class="d-flex align-items-start">
                <div class="flex-grow-0 flex-shrink-0" style="width:100px;height:100px;">
                  <img :src="specImgUrl" class="full-img rounded-left" alt="">
                </div>
                <div class="pl-2 pt-2 pr-2">
                  <div class="title sm text-limeGreen">商品編號:{{ productInfo.num }}</div>
                  <div class="title sm ellipsis">{{ productInfo.name }}</div>
                  <div class="title sm">
                    原價:
                    <span class="text-tomatoRed">{{'$'}}{{ productInfo.product_promo_price | currency }}元</span>
                  </div>
                </div>
              </div>
            </div>
            <validation-observer tag="div" ref="form">
              <validation-provider tag="div" class="mb-2 form-group" rules="required" v-slot="{ errors,failed }">
                <label class="title sm">
                  <span class="text-tomatoRed">*</span>提問主旨
                </label>
                <input type="text" class="form-control" placeholder="請輸入提問主旨" v-model.trim="contactInfo.title"/>
                <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
              </validation-provider>
              <validation-provider tag="div" class="mb-0 form-group" rules="required" v-slot="{ errors,failed }">
                <label class="title sm">
                  <span class="text-tomatoRed">*</span>我的提問
                </label>
                <textarea class="form-control" placeholder="請輸入提問內容" v-model.trim="contactInfo.message"></textarea>
                <p class="error-msg" v-show="failed">{{ errors[0] }}</p>
              </validation-provider>
            </validation-observer>
          </div>
          <div class="modal-footer flex-column">
            <button class="btn btn-limeGreen limit" @click="submitHandler">送出</button>
            <button class="btn btn-outline-limeGreen limit" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('activity-sidebar', {
  props: {
    isOpen: { type: Boolean, default: false },
    activityType: { type: String, default: '' },
    pageUrl: { type: String, default: '' },
  },
  data: () => ({
    lists: [
      { title: '滿額活動', type: 'full_amount_price', show: true },
      { title: '滿件活動', type: 'full_amount_count', show: true },
      { title: '紅配綠活動', type: 'red_with_green', show: true },
      { title: '限時限量活動', type: 'limit_time', show: true },
      { title: '預購活動', type: 'preorder', show: true },
      { title: '急殺活動', type: 'group_buy', show: true },
    ]
  }),
  computed: {
    activityList() {
      return this.lists.reduce((prev, current) => {
        let linkUrl = `${this.pageUrl}?activityCode=${current.type}`
        prev.push({ ...current, linkUrl })
        return prev
      }, [])
    }
  },
  methods: {
    closeHandler() {
      this.$emit('update:is-open', false)
    }
  },
  template: `
    <div id="activitySidebar" :class="{open:isOpen}">
      <div class="activity-header">
        <div class="container d-flex align-items-center">
          <div class="mr-2 text-limeGreen" @click="closeHandler">
            <i class="fal fa-times"></i>
          </div>
          <a href="javascript:;" class="d-flex align-items-center">
            <h2 class="text-moBlue font-weight-bold logo-title">優惠活動</h2>
          </a>
        </div>
      </div>
      <div class="overflow-auto lists-block">
        <a
          v-for="(activity,index) in activityList"
          :key="index"
          :href="activity.linkUrl" 
          class="py-2 px-3 bd-bottom-divide text-dark"
          :class="[{active:activity.type === activityType}, activity.show ? 'd-block' : 'd-none']"
        >{{ activity.title }}</a>
      </div>
    </div>`
})
Vue.component('product-pagination', {
  props: {
    currentPage: { type: Number, required: true },
    totalPage: { type: Number, required: true }
  },
  computed: {
    showPaginationClass() {
      return this.totalPage > 1 ? 'd-flex' : 'd-none'
    }
  },
  methods: {
    paginationChange(payload) {
      this.$emit('pag-change', payload)
    }
  },
  template: `
    <div class="justify-content-center my-3" :class="showPaginationClass">
      <pagination-ellipsis
        :current-page="currentPage"
        :total-page="totalPage"
        @pag-change="paginationChange"
      ></pagination-ellipsis>
    </div>`
})
Vue.component('pagination-ellipsis', {
  props: {
    currentPage: { type: Number, required: true },
    totalPage: { type: Number, required: true }
  },
  computed: {
    showForwardButton() {
      return this.totalPage >= 10
    },
    pagData() {
      let lists = this.calculatePag(this.currentPage, this.totalPage)
      return lists.map((list,index) => ({ pageNumber: list, index }))
    }
  },
  methods: {
    calculatePag(currentPage, totalPage) {
      const numberOfButtons = 3
      const numberOfPages = totalPage
      if (currentPage > numberOfPages || currentPage < 1) return []
      const buttons = Array(numberOfPages).fill(1).map((e, i) => e + i)
      const sideButtons = numberOfButtons % 2 === 0 ? numberOfButtons / 2 : (numberOfButtons - 1) / 2
      const calculLeft = (rest = 0) => {
        return {
          array: buttons.slice(0, currentPage - 1).reverse().slice(0, sideButtons + rest).reverse(),
          rest: function () {
            return sideButtons - this.array.length
          }
        }
      }
      const calculRight = (rest = 0) => {
        return {
          array: buttons.slice(currentPage).slice(0, sideButtons + rest),
          rest: function () {
            return sideButtons - this.array.length
          }
        }
      }
      const leftButtons = calculLeft(calculRight().rest()).array
      const rightButtons = calculRight(calculLeft().rest()).array
      return [...leftButtons, currentPage, ...rightButtons]
    },
    changeHandler(pageNumber) {
      if (pageNumber === this.currentPage) return
      this.$emit('pag-change', { pageNumber })
    },
    dirHandler(count) {
      let pageNumber = this.currentPage + count
      if (pageNumber > this.totalPage || pageNumber < 1) return
      this.$emit('pag-change', { pageNumber })
    }
  },
  template: `
    <ul class="pagination">
      <li class="page-item" v-show="showForwardButton" @click="changeHandler(1)">
        <a href="javascript:;" class="page-link">
          <i class="far fa-fast-backward"></i>
        </a>
      </li>
      <li class="page-item">
        <a href="javascript:;" class="page-link" @click="dirHandler(-1)">
          <i class="far fa-arrow-left"></i>
        </a>
      </li>
      <li
        v-for="pag in pagData" 
        :key="pag.index" 
        :class="['page-item', {active:currentPage === pag.pageNumber}]">
        <a href="javascript:;" class="page-link" @click="changeHandler(pag.pageNumber)">{{ pag.pageNumber }}</a>
      </li>
      <li class="page-item">
        <a href="javascript:;" class="page-link" @click="dirHandler(1)">
          <i class="far fa-arrow-right"></i>
        </a>
      </li>
      <li class="page-item" v-show="showForwardButton" @click="changeHandler(totalPage)">
        <a href="javascript:;" class="page-link">
          <i class="far fa-fast-forward"></i>
        </a>
      </li>
    </ul>`
})
Vue.component('notify-accordion', {
  props: {
    notifyList: { type: Array, required: true },
  },
  methods: {
    collapseHandler(id) {
      this.$emit('set-read-status', id)
      this.$refs['notify-item'].forEach(item => {
        if (item.notify.id !== id) item.isOpen = false
      })
    },
  },
  template: `
    <div>
      <notify-item
        v-for="notify in notifyList"
        :key="notify.id"
        :notify="notify"
        ref="notify-item"
        @collapse="collapseHandler"
      ></notify-item>
    </div>`
})
Vue.component('notify-item', {
  props: {
    notify: { type: Object, required: true }
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    unRead() {
      return !this.notify.read_status
    },
    linkUrl() {
      return this.notify.data.url || 'javascript:;' 
    },
    linkClass() {
      let hasLink = this.notify.data.url !== ''
      return {
        'text-tomatoRed': hasLink,
        'text-decoration-underline': hasLink,
        'text-link': !hasLink
      }
    }
  },
  methods: {
    toggleHandler() {
      this.isOpen = !this.isOpen
      if (!this.isOpen) return
      this.$emit('collapse', this.notify.id)
    }
  },
  template: `
    <div class="px-3 py-2 mb-2 rounded bd-limeGreen">
      <div class="d-flex justify-content-between align-items-center" @click="toggleHandler">
        <div>
          <p class="position-relative title sm">
            <span
              v-show="unRead"
              class="position-absolute bg-tomatoRed rounded-circle" 
              style="width:5px;height:5px;transform:translate(-8px, 8px);"
            ></span>
            <span>{{ notify.data.title }}</span>
          </p>
          <p class="title sm text-link">{{ notify.diffForHumans }}</p>
        </div>
        <div class="text-limeGreen">
          <i class="far fa-chevron-down" v-show="!isOpen"></i>
          <i class="far fa-chevron-up" v-show="isOpen"></i>
        </div>
      </div>
      <div v-show="isOpen">
        <a :href="linkUrl" :class="[linkClass, 'mb-0 title sm']" style="word-break:break-all">
          {{ notify.data.text }}
        </a>
      </div>
    </div>`
})
Vue.component('product-popular', {
	props: {
		productInfo: { type: Object, required: true },
		isObserve: { type: Boolean, default: true },
		width: { type: String, default: '50%' }
	},
	data: () => ({
		preloadImage: document.querySelector('#product-preload-image').href
	}),
	computed: {
		productStyle() {
			return { width: this.width }
		}
	},
	methods: {
		startObserve() {
			let productImage = this.productInfo.main_image
			if (!this.isObserve) return this.preloadImage = productImage
			new window.ObserverLazyLoading({
				dom: this.$refs.frame,
				viewInEvent: async() => {
					await new window.LoadingImage().load(productImage)
					this.preloadImage = productImage
				}
			})
		}
	},
	mounted() {
		this.startObserve()
	},
	template: `
		<a :href="productInfo.linkUrl" class="mb-16 bg-neutral-7" :style="productStyle">
			<div class="position-relative pt-full" ref="frame">
				<img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
			</div>
			<div class="pt-2">
				<div class="mb-4 text-neutral-0 text-sm line-clamp-2">{{ productInfo.product_name }}</div>
				<div class="d-flex justify-content-center text-sm">
					<p class="mr-8 text-neutral-3 text-decoration-line">{{'$'}}{{ productInfo.product_price | currency }}</p>
					<p class="text-primary-2 ">{{'$'}}{{ productInfo.product_promo_price | currency }}</p>
				</div>
			</div>
		</a>`
});
Vue.component('search-popular', {
	props: {
		productInfo: { type: Object, required: true },
		isObserve: { type: Boolean, default: true }
	},
	data: () => ({
		preloadImage: document.querySelector('#product-preload-image').href
	}),
	methods: {
		startObserve() {
			let productImage = this.productInfo.main_image
			if (!this.isObserve) return this.preloadImage = productImage
			new window.ObserverLazyLoading({
				dom: this.$refs.frame,
				viewInEvent: async() => {
					await new window.LoadingImage().load(productImage)
					this.preloadImage = productImage
				}
			})
		}
	},
	mounted() {
		this.startObserve()
	},
	template: `
		<a :href="productInfo.linkUrl" class="mb-2 col-6 bg-white">
			<div class="position-relative" style="padding-top:100%;" ref="frame">
				<img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
			</div>
			<div class="pt-2">
				<div class="mb-0 text-dark title sm ellipsis">{{ productInfo.product_name }}</div>
				<div class="mb-0 text-center text-tomatoRed title sm">
					{{'$'}}{{ productInfo.product_promo_price | currency }}
				</div>
			</div>
		</a>`
});
Vue.component('combo-product', {
  props: {
    combo: { type: Object, required: true },
    activityCode: { type: String, required: true },
    showComboPrice: { type: Boolean, default: false }
  },
  computed: {
    isMatchedActivity() {
      return this.activityCode === 'red_with_green'
    },
    labelClass() {
      if (!this.isMatchedActivity) return ''
      if (this.combo.promo_type === undefined) return ''
      return this.combo.promo_type === 1 ? 'red' : 'green'
    },
    imageUrl() {
      return this.combo.spec.images[0] || ''
    },
  },
  template: `
    <div class="d-flex align-items-start mb-2 combo-product">
      <div class="position-relative overflow-hidden img-box" :class="labelClass">
        <img :src="imageUrl" class="full-img" alt="">
      </div>
      <div class="desc-box">
        <p class="ellipsis">{{ combo.product.product_name }}</p>
        <p class="text-link">規格: {{ combo.spec.spec_title }} *{{ combo.count }}</p>
        <div class="d-flex" v-if="showComboPrice">
          <p class="mr-2 text-tomatoRed">單價: {{'$'}}{{ combo.promo_price | currency }}</p>
          <p>小計: {{'$'}}{{ combo.meta_total | currency }}</p>
        </div>
      </div>
    </div>`
})
Vue.component('activity-product', {
  props: {
    detail: { type: Object, required: true },
    activityType: { type: String, default: 'fullAmount' },
    isObserve: { type: Boolean, default: true }
  },
  data: () => ({
    preloadImage: document.querySelector('#product-preload-image').href
  }),
  computed: {
    isMatchedActivity() {
      return this.activityType === 'match'
    },
    labelClass() {
      if (!this.isMatchedActivity) return ''
      else return this.detail.promo_type === 1 ? 'bg-tomatoRed' : 'bg-limeGreen'
    },
    specImageUrl() {
      return this.detail.spec.images[0] || ''
    },
    productPrice() {
      return this.isMatchedActivity ? this.detail.promo_price : this.detail.product.product_promo_price
    }
  },
  methods: {
    pickHandler() {
      this.$emit('pick', {
        activityProductId: this.detail.id,
        productId: this.detail.product.id,
        name: this.detail.product.product_name,
        price: this.productPrice,
        specId: this.detail.spec.id,
        specName: this.detail.spec.spec_title,
        stock: this.detail.spec.spec_stock,
        imgUrl: this.specImageUrl,
        promo_type: this.detail.promo_type,
        product_code: this.detail.product.product_code
      })
    },
    introHandler() {
      this.$emit('intro', {
        name: this.detail.product.product_name,
        summary: this.detail.product.product_summary,
        specTitle: this.detail.spec.spec_title,
        price: this.productPrice,
        imgUrl: this.specImageUrl
      })
    },
    startObserve() {
      if (!this.isObserve) return this.preloadImage = this.specImageUrl
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        viewInEvent: async() => {
          await new window.LoadingImage().load(this.specImageUrl)
          this.preloadImage = this.specImageUrl
        }
      })
    }
  },
  mounted() {
    this.startObserve()
  },
  template: `
    <div class="mb-3 col-6 bg-white">
      <div class="position-relative overflow-hidden" style="padding-top:100%;" @click="introHandler" ref="frame">
        <img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
        <div class="match-label" :class="labelClass" v-if="isMatchedActivity"></div>
      </div>
      <div class="pt-2">
        <div class="mb-0 text-dark title sm ellipsis only">{{ detail.product.product_name }}</div>
        <div class="mb-1 text-center text-tomatoRed title sm">
          {{'$'}}{{ productPrice | currency }}
        </div>
        <button class="w-100 btn btn-outline-limeGreen" @click="pickHandler">選購</button>
      </div>
    </div>`
})
Vue.component('pre-order-product', {
  props: {
    detail: { type: Object, required: true },
    isObserve: { type: Boolean, default: true }
  },
  data: () => ({
    preloadImage: document.querySelector('#product-preload-image').href
  }),
  computed: {
    imageUrl() {
      return this.detail.product.images[0] || ''
    },
    priceText() {
      let { deposit, deposit_type } = this.detail
      let mappingType = { 0:'售價', 1:'訂金' }
      let dollarText = `$${this.$options.filters.currency(deposit)}`
      return `${mappingType[deposit_type]}: ${dollarText}`
    }
  },
  methods: {
    startObserve() {
      if (!this.isObserve) return this.preloadImage = this.imageUrl
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        viewInEvent: async() => {
          await new window.LoadingImage().load(this.imageUrl)
          this.preloadImage = this.imageUrl
        }
      })
    }
  },
  mounted() {
    this.startObserve()
  },
  template: `
    <a :href="detail.linkUrl" class="mb-3 col-6 bg-white">
      <div class="position-relative" style="padding-top:100%;" ref="frame">
        <img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
      </div>
      <div class="pt-2">
        <div class="mb-0 text-dark title sm ellipsis only">{{ detail.product.product_name }}</div>
        <div class="mb-1 text-center text-tomatoRed title sm">{{ priceText }}</div>
      </div>
    </a>`
})
Vue.component('group-buy-product', {
  props: {
    detail: { type: Object, required: true },
    isObserve: { type: Boolean, default: true }
  },
  data: () => ({
    preloadImage: document.querySelector('#product-preload-image').href
  }),
  computed: {
    imageUrl() {
      return this.detail.product.images[0] || ''
    }
  },
  methods: {
    startObserve() {
      if (!this.isObserve) return this.preloadImage = this.imageUrl
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        viewInEvent: async() => {
          await new window.LoadingImage().load(this.imageUrl)
          this.preloadImage = this.imageUrl
        }
      })
    }
  },
  mounted() {
    this.startObserve()
  },
  template: `
    <a :href="detail.linkUrl" class="mb-2 col-6 bg-white">
      <div class="position-relative" style="padding-top:100%;" ref="frame">
        <img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
      </div>
      <div class="pt-2">
        <div class="mb-0 text-dark title sm ellipsis only">{{ detail.product.product_name }}</div>
        <div class="mb-1 text-center text-tomatoRed title sm">
          {{'$'}}{{ detail.product.product_promo_price }}
        </div>
      </div>
    </a>`
})
Vue.component('category-circle', {
  props: {
    popular: { type: Object, required: true },
    isObserve: { type: Boolean, default: true }
  },
  data: () => ({
    preloadImage: document.querySelector('#product-preload-image').href
  }),
  methods: {
    startObserve() {
      let productImage = this.popular.imgUrl
      if (!this.isObserve) return this.preloadImage = productImage
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        viewInEvent: async() => {
          await new window.LoadingImage().load(productImage)
          this.preloadImage = productImage
        }
      })
    }
  },
  mounted() {
    this.startObserve()
  },
  template: `
    <a :href="popular.linkUrl" class="flex-grow-0 flex-shrink-0 category-circle">
      <div class="rounded-circle img-box" ref="frame">
        <img :src="preloadImage" class="rounded-circle full-img" alt="">
      </div>
      <div class="pt-4 text-neutral-0 text-center text-xs">{{ popular.title }}</div>
    </a>`
})
Vue.component('lazy-banner', {
  props: {
    bannerList: { type: Array, required: true }
  },
  data: () => ({
    preloadImage: document.querySelector('#banner-preload-image').href,
    slideList: [],
    showPlaceholderImage: false,
    allImageIsLoaded: false
  }),
  computed: {
    allImages() {
      return this.bannerList.map(item => item.imgUrl)
    }
  },
  methods: {
    initSwiper() {
      new Swiper('#banner-swiper', {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
      })
    },
    async loadAllImage() {
      this.showPlaceholderImage = true
      let group = []
      for (let item of this.allImages) {
        let obj = new LoadingImage().load(item)
        group.push(obj)
      }
      await Promise.all(group)
      this.showPlaceholderImage = false
      this.allImageIsLoaded = true
      this.slideList = _.cloneDeep(this.bannerList)
      await this.$nextTick()
      this.initSwiper()
    },
  },
  watch: {
    bannerList(val) {
      if (val.length === 0) return
      this.loadAllImage()
    }
  },
  template: `
    <div class="mb-16">
      <div>
        <div v-show="showPlaceholderImage">
          <img :src="preloadImage" class="full-img" alt="" />
        </div>
        <template v-if="allImageIsLoaded">
          <div id="banner-swiper" class="swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(slide,index) in slideList" :key="index">
                <a :href="slide.linkUrl">
                  <img :src="slide.imgUrl" />
                </a>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </template>
      </div>
    </div>`
})
Vue.component('lazy-ad', {
  props: {
    swiperId: { type: String, required: true },
    advertiseList: { type: Array, required: true },
    rootMargin: { type: String, default: '0px 0px 0px 0px' }
  },
  data: () => ({
    preloadImage: document.querySelector('#ad-preload-image').href,
    slideList: [],
    showPlaceholderImage: false,
    allImageIsLoaded: false
  }),
  computed: {
    allImages() {
      return this.advertiseList.map(item => item.imgUrl)
    }
  },
  methods: {
    initSwiper() {
      new Swiper(`#${this.swiperId}`, {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
      })
    },
    startObserve() {
      this.showPlaceholderImage = true
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        rootMargin: this.rootMargin,
        viewInEvent: () => {
          this.loadAllImage()
        }
      })
    },
    async loadAllImage() {
      let group = []
      for (let item of this.allImages) {
        let obj = new LoadingImage().load(item)
        group.push(obj)
      }
      await Promise.all(group)
      this.showPlaceholderImage = false
      this.allImageIsLoaded = true
      this.slideList = _.cloneDeep(this.advertiseList)
      await this.$nextTick()
      this.initSwiper()
    }
  },
  watch: {
    advertiseList(val) {
      if (val.length === 0) return
      this.startObserve()
    }
  },
  template: `
    <div class="container" ref="frame">
      <div v-show="showPlaceholderImage">
        <img :src="preloadImage" class="full-img" alt=""/>
      </div>
      <template v-if="allImageIsLoaded">
        <div :id="swiperId" class="swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(slide,index) in slideList" :key="index">
              <a :href="slide.linkUrl">
                <img :src="slide.imgUrl" />
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>`
})
Vue.component('lazy-popular', {
  props: {
    popularList: { type: Array, required: true },
    rootMargin: { type: String, default: '0px 0px 0px 0px' }
  },
  data: () => ({
    preloadImage: document.querySelector('#popular-preload-image').href,
    slideList: [],
    showPlaceholderImage: false,
    allImageIsLoaded: false
  }),
  computed: {
    allImages() {
      return this.popularList.map(item => item.imgUrl)
    }
  },
  methods: {
    initSwiper() {
      new Swiper('#popular-swiper', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 8,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
      })
    },
    startObserve() {
      this.showPlaceholderImage = true
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        rootMargin: this.rootMargin,
        viewInEvent: () => {
          this.loadAllImage()
        }
      })
    },
    async loadAllImage() {
      let group = []
      for (let item of this.allImages) {
        let obj = new LoadingImage().load(item)
        group.push(obj)
      }
      await Promise.all(group)
      this.showPlaceholderImage = false
      this.allImageIsLoaded = true
      this.slideList = _.cloneDeep(this.popularList)
      await this.$nextTick()
      this.initSwiper()
    }
  },
  watch: {
    popularList(val) {
      if (val.length === 0) return
      this.startObserve()
    }
  },
  template: `
    <div class="container" ref="frame">
      <div v-show="showPlaceholderImage" style="height:150px;">
        <img :src="preloadImage" class="full-img" alt="" />
      </div>
      <template v-if="allImageIsLoaded">
        <div id="popular-swiper" class="swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(slide,index) in slideList" :key="index" style="width:80%;">
              <a :href="slide.linkUrl">
                <img :src="slide.imgUrl"/>
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>`
})
Vue.component('lazy-news', {
  props: {
    newsList: { type: Array, required: true },
    rootMargin: { type: String, default: '0px 0px 0px 0px' }
  },
  data: () => ({
    preloadImage: document.querySelector('#ad-preload-image').href,
    slideList: [],
    showPlaceholderImage: false,
    allImageIsLoaded: false
  }),
  computed: {
    allImages() {
      return this.newsList.map(item => item.imgUrl)
    }
  },
  methods: {
    initSwiper() {
      new Swiper('#news-swiper', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 16,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
      })
    },
    async loadAllImage() {
      let group = []
      for (let item of this.allImages) {
        let obj = new LoadingImage().load(item)
        group.push(obj)
      }
      await Promise.all(group)
      this.showPlaceholderImage = false
      this.allImageIsLoaded = true
      this.slideList = _.cloneDeep(this.newsList)
      await this.$nextTick()
      this.initSwiper()
    },
    startObserve() {
      this.showPlaceholderImage = true
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        rootMargin: this.rootMargin,
        viewInEvent: () => {
          this.loadAllImage()
        }
      })
    },
  },
  watch: {
    newsList(val) {
      if (val.length === 0) return
      this.startObserve()
    }
  },
  template: `
    <div ref="frame">
      <div v-show="showPlaceholderImage" style="height:150px;">
        <img :src="preloadImage" class="full-img" alt=""/>
      </div>
      <template v-if="allImageIsLoaded">
        <div id="news-swiper" class="swiper">
          <div class="swiper-wrapper">
            <div v-for="news in slideList" :key="news.id" class="swiper-slide" style="width:80%;">
              <a :href="news.linkUrl" class="d-block">
                <div class="mb-8">
                  <img :src="news.imgUrl" class="full-img rounded-lg" alt="">
                </div>
                <p class="text-sm text-neutral-0 line-clamp-1">{{ news.title }}</p>
                <p class="text-xs text-neutral-3">{{ news.startTime }}</p>
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>`
})
Vue.component('news-list', {
	props: {
		newsInfo: { type: Object, required: true }
	},
	template: `
		<a :href="newsInfo.linkUrl" class="d-block py-16" style="border-top-style:dashed;">
			<div class="text-neutral-0 text-sm line-clamp-1">{{ newsInfo.title }}</div>
			<div class="text-xs text-neutral-3">{{ newsInfo.startTime }}</div>
		</a>`
})
Vue.component('news-item', {
  props: {
    news: { type: Object, required: true },
    isObserve: { type: Boolean, default: true }
  },
  data() {
    return {
      preloadImage: document.querySelector('#product-preload-image').href
    }
  },
  computed: {
    dateText() {
      if (this.news.start_time === '') return ''
      let dateObj = new Date(this.news.start_time)
      let year = dateObj.getFullYear()
      let month = dateObj.getMonth() + 1
      let date = dateObj.getDate()
      return `${year}年${month}月${date}日`
    }
  },
  methods: {
    startObserve() {
			let newsImage = this.news.imgUrl
			if (!this.isObserve) return this.preloadImage = newsImage
			new window.ObserverLazyLoading({
				dom: this.$refs.frame,
				viewInEvent: async() => {
					await new window.LoadingImage().load(newsImage)
					this.preloadImage = newsImage
				}
			})
		}
  },
  mounted() {
    this.startObserve()
  },
  template: `
    <a :href="news.linkUrl" class="d-block mb-2">
      <div class="position-relative" style="padding-top:50%;" ref="frame">
        <img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0" alt="">
      </div>
      <div class="pt-1">
        <p class="mb-0 title sm text-dark ellipsis">{{ news.title }}</p>
        <p class="mb-0 title sm text-link" style="font-size:12px;">{{ dateText }}</p>
      </div>
    </a>`
})
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
Vue.component('activity-picked-row', {
  props: {
    pickInfo: { type: Object, required: true  },
    activityType: { type: String, default: 'fullAmount' }
  },
  computed: {
    isMatchedActivity() {
      return this.activityType === 'match'
    },
    labelClass() {
      if (!this.isMatchedActivity) return ''
      else return this.pickInfo.promo_type === 1 ? 'bg-tomatoRed' : 'bg-limeGreen'
    },
    subTotal() {
      let { buyCount, price } = this.pickInfo
      return buyCount * price
    }
  },
  methods: {
    remove() {
      this.$emit('remove-pick', { activityProductId: this.pickInfo.activityProductId })
    },
    changeCount(num) {
      this.$emit('change-pick-count', { 
        activityProductId: this.pickInfo.activityProductId,
        count: num
      })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="p-0 right">
        <div class="clearfix">
          <div class="position-relative overflow-hidden float-left img-box">
            <img :src="pickInfo.imgUrl" class="full-img" alt="">
            <div class="label" :class="labelClass" v-if="isMatchedActivity"></div>
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">{{ pickInfo.name }}</a>
            <p class="text-link product-spec">規格: {{ pickInfo.specName }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{ pickInfo.price | currency }}</p>
              <p class="text-tomatoRed">小計: {{ subTotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                class="sm"
                :max="pickInfo.stock"
                :count="pickInfo.buyCount"
                :show-upper-limited-popup="true"
                @change-count="changeCount"
                @limited-reminder="limitedReminder"
              ></input-number>
              <button class="ml-2 btn btn-outline-tomatoRed" @click="remove">
                <i class="fal fa-trash-alt"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
Vue.component('input-number', {
  props: {
    min: { type: Number, default: 1 },
    max: { type: Number, required: true },
    count: { type: Number, required: true },
    showUpperLimitedPopup: { type: Boolean, default: false }
  },
  methods: {
    updateCount(num) {
      this.$emit('change-count', num)
    },
    limitedHandler() {
      let text = `抱歉，本商品最多可購買${this.max}件`
      this.$emit('limited-reminder', text)
    },
    stepHandler(num) {
      let newValue = this.count + num
      if (newValue <= 0) return
      if (newValue > this.max) {
        if (this.showUpperLimitedPopup) {
          this.limitedHandler()
        }
        return
      }
      this.updateCount(newValue)
    },
    keydownHandler(e) {
      let keyCode = e.keyCode
      if ([46, 8, 9, 27, 13].indexOf(keyCode) !== -1 ||
        (keyCode === 65 && e.ctrlKey === true) ||
        (keyCode >= 35 && keyCode <= 39)) {
        return
      }
      if ((e.shiftKey || (keyCode < 48 || keyCode > 57)) && (keyCode < 96 || keyCode > 105)) {
        e.preventDefault()
      }
    },
    inputHandler(e) {
      let el = e.target
      let inputValue = el.value
      let parseValue = parseInt(inputValue)
      if (inputValue.trim() === '') return
      if (parseValue < this.min) {
        this.updateCount(this.min)
        el.value = this.min
      } else if (parseValue > this.max) {
        this.updateCount(this.max)
        el.value = this.max
        this.limitedHandler()
      }
    },
    changeHandler(e) {
      let el = e.target
      let inputValue = el.value
      let parseValue = parseInt(inputValue)
      if (inputValue.trim() === '') {
        this.updateCount(this.min)
        el.value = this.min
      } else if (parseValue < this.min || parseValue > this.max) {
        this.updateCount(this.min)
        el.value = this.min
      } else {
        if (parseValue === this.count) return //防止重複觸發
        this.updateCount(parseValue)
        el.value = parseValue
      }
    }
  },
  template: `
    <div class="input-number-component">
      <div class="dir" @click="stepHandler(-1)">
        <i class="fal fa-minus text-link"></i>
      </div>
      <input 
        type="number" 
        class="form-control" 
        :min="min"
        :max="max" 
        :value="count"
        step="1"
        @keydown="keydownHandler"
        @input="inputHandler"
        @change="changeHandler"
        pattern="[0-9]*"
        inputmode="numeric"
      >
      <div class="dir" @click="stepHandler(1)">
        <i class="fal fa-plus text-link"></i>
      </div>
    </div>`
})
Vue.component('warning-slogan', {
  data: () => ({
    textList: ['禁', '止', '酒', '駕', '', '飲', '酒', '過', '量', '有', '害', '健', '康']
  }),
  template: `
    <div id="slogan-wrap">
      <div class="fixed-bottom d-flex justify-content-around align-items-center bg-neutral-0 text-neutral-7 slogan-content">
        <p 
          v-for="(text,index) in textList"
          :key="index"
          :class="{icon:index === 4}"
        >{{ text }}</p>
      </div>
    </div>`
})