Vue.component('rank-item', {
  props: {
    rankItem: { type: Object, required: true }
  },
  template: `
    <div class="d-flex justify-content-between align-items-center p-2 mb-2 bd-bootstrap rounded title sm">
      <p>{{ rankItem.class_max }}件</p>
      <div class="d-flex justify-content-center">
        <p class="text-tomatoRed">{{'$'}}{{ rankItem.amount | currency }}</p>
        <p class="ml-2">/ 單件</p>
      </div>
    </div>`
})