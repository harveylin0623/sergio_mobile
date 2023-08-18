Vue.component('warning-slogan', {
  data: () => ({
    textList: ['禁', '止', '酒', '駕', '', '飲', '酒', '過', '量', '有', '害', '健', '康']
  }),
  template: `
    <div id="slogan-wrap">
      <div class="fixed-bottom d-flex justify-content-around align-items-center bg-neutral-0 text-neutral-7 slogan-content">
        <p 
          v-for="(text,index) in textList"
          :key="index"
          :class="{icon:index === 4}"
        >{{ text }}</p>
      </div>
    </div>`
})