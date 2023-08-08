export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    data: {
      breadList: [
        { title: '首頁', pageUrl: pageUrl.home },
        { title: '急殺訂單', pageUrl: '' },
      ],
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      
    },
    async mounted() {
      
    }
  })
}