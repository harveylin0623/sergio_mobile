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