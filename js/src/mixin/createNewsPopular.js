(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.createNewsPopulartMixin = factory());
}(this, (function () {
  return {
    methods: {
      createNewsPopular(list) {
        return list.reduce((prev, current) => {
          let { id, title, images } = current
          let imgUrl = images[0] !== undefined ? images[0] : ''
          let linkUrl = `${this.pageUrl.newsDetail}?newsId=${id}`
          prev.push({ id, title, imgUrl, linkUrl })
          return prev
        }, [])
      },
    }
  }
})));