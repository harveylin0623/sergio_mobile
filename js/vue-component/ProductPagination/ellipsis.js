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