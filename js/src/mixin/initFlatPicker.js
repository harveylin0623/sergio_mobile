(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.initFlatPickerMixin = factory());
}(this, (function () {
  return {
    data() {
      return {
        flatPicker: null,
        minMinusDay: 90,
      }
    },
    methods: {
      formatDate(date) {
        if (date === undefined) return ''
        else return dayjs(date).format('YYYY/MM/DD')
      },
      initFlatPicker() {
        let today = dayjs().toDate()
        let minDate = dayjs().subtract(this.minMinusDay, 'day').toDate()
        this.flatPicker = new flatpickr('#dateInput', {
          dateFormat: 'Y/m/d',
          minDate,
          maxDate: today,
          defaultDate: today,
          disableMobile: 'true',
          locale: 'zh_tw',
          monthSelectorType: 'static',
        })
      }
    }
  }
})));