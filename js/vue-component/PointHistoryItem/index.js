export default (() => {
  Vue.component('point-history-item', {
    props: {
      history: { type: Object, required: true }
    },
    data: () => ({
      isOpen: false
    }),
    computed: {
      hasMeta() {
        return this.history.meta !== null
      },
      metaList() {
        return this.hasMeta ? this.history.meta : []
      }
    },
    methods: {
      toggleHandler() {
        if (this.hasMeta) this.isOpen = !this.isOpen
      }
    },
    template: `
      <div class="p-2 mb-2 bd-limeGreen rounded">
        <div class="d-flex justify-content-between align-items-center" @click="toggleHandler">
          <div class="d-flex align-items-start">
            <div class="flex-grow-0 flex-shrink-0" style="width:40px;height:40px;">
              <img :src="history.imgUrl" class="full-img" alt="">
            </div>
            <div class="pl-1 mb-0 title sm">
              <div class="d-flex align-items-start">
                <p>{{ history.transaction_type }}</p>
                <p class="text-limeGreen">{{ history.amount }}</p>
                <p>點</p>
              </div>
              <p class="text-link">{{ history.datetime }}</p>
            </div>
          </div>
          <div v-if="hasMeta" class="text-limeGreen">
            <i class="far fa-chevron-down" v-show="!isOpen"></i>
            <i class="far fa-chevron-up" v-show="isOpen"></i>
          </div>
        </div>
        <ul class="pl-2 pt-2" v-show="isOpen">
          <li class="mb-1 d-flex align-items-start text-link title sm" v-for="(meta,index) in metaList" :key="index">
            <p>{{ meta.key }} : </p>
            <p class="pl-2 text-break">{{ meta.value }}</p>
          </li>
        </ul>
      </div>`
  })
})()