export default (() => {
  Vue.component('rounded-fill-tab', {
    props: {
      tabType: { type: String, required: true },
      tabList: { type: Array, required: true },
    },
    methods: {
      clickHandler(type) {
        if (this.tabType === type) return
        this.$emit('change-tab', type)
      }
    },
    template: `
      <div id="rounded-fill-tab" class="d-flex align-items-center rounded-pill bd-limeGreen">
        <div 
          v-for="item in tabList"
          :key="item.type"
          class="p-2 mb-0 flex-grow-1 flex-shrink-1 bg-white text-center rounded-pill title sm"
          :class="{active:item.type === tabType}"
          @click="clickHandler(item.type)">
          {{ item.title }}
        </div>
      </div> `
  })
})()