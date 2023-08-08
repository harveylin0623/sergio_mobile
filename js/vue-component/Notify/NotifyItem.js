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