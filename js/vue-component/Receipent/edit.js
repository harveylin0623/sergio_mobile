export default (() => {
  Vue.component('receipent-edit', {
    props: {
      receipent: { type: Object, required: true }
    },
    computed: {
      fullAddress() {
        let { city, district, address } = this.receipent
        return `${city}${district}${address}`
      },
      isPreset() {
        return this.receipent.preset === 1
      }
    },
    methods: {
      updateHandler() {
        let { id, name, mobile, email, preset, city, district, address } = this.receipent
        this.$emit('edit', { id, name, mobile, email, preset, city, district, address })
      },
      deleteHandler() {
        this.$emit('delete', { id: this.receipent.id })
      }
    },
    template: `
      <div class="mb-2 rounded bd-limeGreen">
        <div class="p-2 bd-bottom-divide">
          <div class="d-flex align-items-center mb-2 title sm">
            <p class="flex-grow-0 flex-shrink-0 text-link" style="width:75px;">姓名 :</p>
            <p class="flex-grow-1 flex-shrink-1 text-break">
              <span class="mr-1">{{ receipent.name }}</span>
              <span class="px-2 py-0 mb-0 text-white rounded-pill bg-tomatoRed" v-show="isPreset" style="font-size: 12px;">預設</span>
            </p>
          </div>
          <div class="d-flex align-items-start mb-2 title sm">
            <p class="flex-grow-0 flex-shrink-0 text-link" style="width:75px;">手機號碼 :</p>
            <p class="flex-grow-1 flex-shrink-1 text-break">{{ receipent.mobile }}</p>
          </div>
          <div class="d-flex align-items-start mb-2 title sm">
            <p class="flex-grow-0 flex-shrink-0 text-link" style="width:75px;">電子信箱 :</p>
            <p class="flex-grow-1 flex-shrink-1 text-break">{{ receipent.email }}</p>
          </div>
          <div class="d-flex align-items-start mb-0 title sm">
            <p class="flex-grow-0 flex-shrink-0 text-link" style="width:75px;">地址 :</p>
            <p class="flex-grow-1 flex-shrink-1 text-break">{{ fullAddress }}</p>
          </div>
        </div>
        <div class="d-flex justify-content-center align-items-center px-3 py-2">
          <button class="mr-1 btn btn-outline-limeGreen flex-grow-1 flex-shrink-1" @click="updateHandler">編輯</button>
          <button class="ml-1 btn btn-outline-tomatoRed flex-grow-1 flex-shrink-1" @click="deleteHandler">刪除</button>
        </div>
      </div>`
  })
})()