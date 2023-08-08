export default (() => {
  Vue.component('question-list', {
    props: {
      question: { type: Object, required: true }
    },
    data: () => ({
      mappingType: { product: '商品', order: '訂單' },
      mappingColorClass: { product: 'bg-limeGreen', order: 'bg-moBlue ' }
    }),
    computed: {
      questionType() {
        return this.mappingType[this.question.type] || ''
      },
      questoinColorClass() {
        return this.mappingColorClass[this.question.type] || ''
      }
    },
    template: `
      <a :href="question.linkUrl" class="d-block mb-2 text-dark rounded bd-limeGreen">
        <div class="p-2 d-flex align-items-center rounded-top bg-mintGreen">
          <div class="mb-0 px-2 py-1 text-white rounded title sm" :class="questoinColorClass">
            {{ questionType }}
          </div>
          <div class="ml-2 mb-0 title sm">{{ question.create_time }}</div>
          <div class="ml-auto mb-0 title sm">{{ question.status }}</div>
        </div>
        <div class="p-2 bg-white rounded-bottom">
          <p class="mb-0 title sm">發問主旨: {{ question.title }}</p>
        </div>
      </a>`
  })
})()