export default (() => {
  Vue.component('dialogue-item', {
    props: {
      dialogue: { type: Object, requirewd: true }
    },
    computed: {
      isMe() {
        return this.dialogue.type === 0
      },
      characterClass() {
        return this.isMe ? 'bd-bootstrap' : 'bg-mintGreen'
      },
      greetText() {
        return this.isMe ? '您的描述' : '客服回覆'
      },
    },
    template: `
      <div class="mb-2 rounded" :class="characterClass" style="padding:10px;">
        <div class="d-flex justify-content-between align-items-center mb-1 title sm">
          <span>{{ greetText }}:</span>
          <span class="mb-0 title sm">{{ dialogue.create_time }}</span>
        </div>
        <div class="mb-0 title sm" style="white-space:pre-line;">{{ dialogue.message }}</div>
      </div>`
  })
})()