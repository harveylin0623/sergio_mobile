Vue.component('sub-category-sidebar', {
  props: {
    isOpen: { type: Boolean, required: true },
    subCategoryList: { type: Array, required: true },
    subId: { type: Number, required: true },
    lastId: { type: Number, required: true },
  },
  computed: {
    lastCategoryList() {
      let obj = this.subCategoryList.find(item => item.id === this.subId)
      return obj !== undefined ? obj.subcategories : []
    }
  },
  methods: {
    closeHandler() {
      this.$emit('update:isOpen', false)
    },
    updateSubCategory(payload) {
      this.$emit('update-sub-category', payload)
    },
    updateLastCategory(payload) {
      this.$emit('update-last-category', payload)
    }
  },
  template: `
    <div id="subCategorySidebar" :class="{open:isOpen}">
      <div class="category-header">
        <div class="container d-flex align-items-center">
          <div class="mr-2 text-limeGreen" @click="closeHandler">
            <i class="fal fa-times"></i>
          </div>
          <a href="javascript:;" class="d-flex align-items-center">
            <h2 class="text-moBlue font-weight-bold logo-title">光南大批發</h2>
          </a>
        </div>
      </div>
      <div class="clearfix category-content">
        <div class="sub-category-menu">
          <sub-category-item
            v-for="item in subCategoryList"
            :key="item.id"
            :sub-item="item"
            :sub-id="subId"
            ref="subItems"
            @update-sub-category="updateSubCategory"
          ></sub-category-item>
        </div>
        <div class="bg-term last-category-menu">
          <div class="row sm">
            <last-category-item
              v-for="item in lastCategoryList"
              :key="item.id"
              :last-item="item"
              :last-id="lastId"
              @update-last-category="updateLastCategory"
            ></last-category-item>
          </div>
        </div>
      </div>
    </div>`
})