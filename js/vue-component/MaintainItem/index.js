Vue.component('maintain-item', {
  props: {
    info: { type: Object, required: true }
  },
  methods: {
    clickHandler() {
      if (this.info.url !== 'javascript:;') return
      $('#logoutPopup').modal('show')
    }
  },
  template: `
    <a 
      :href="info.url" 
      class="d-flex justify-content-flex-start align-items-center py-2 text-dark bd-bottom-divide member-center-item"
      :class="{hide:!info.show}" 
      @click="clickHandler">
      <span :class="info.type"></span>
      <p class="ml-2">{{ info.title }}</p>
      <i class="fal fa-chevron-right ml-auto text-limeGreen"></i>
    </a>`
})