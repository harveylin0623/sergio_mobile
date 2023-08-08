export default (() => {
  Vue.component('contact-list', {
    props: {
      contact: { type: Object, required: true }
    },
    computed: {
      createdTime() {
        return this.contact.create_time.split(' ')[0]
      }
    },
    template: `
      <a :href="contact.linkUrl" class="d-block mb-2 text-dark rounded bd-limeGreen">
        <div class="p-2 d-flex align-items-center rounded-top bg-mintGreen">
          <div class="mb-0 px-2 py-1 text-white bg-limeGreen rounded title sm">{{ contact.type }}</div>
          <div class="ml-2 mb-0 title sm">{{ createdTime }}</div>
          <div class="ml-auto mb-0 title sm">{{ contact.status }}</div>
        </div>
        <div class="p-2 bg-white rounded-bottom">
          <p class="mb-0 title sm">發問主旨: {{ contact.title }}</p>
        </div>
      </a>`
  })
})()