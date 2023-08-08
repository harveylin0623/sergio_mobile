(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.userBirthdayMixin = factory());
}(this, (function () {
  return {
    data() {
      return {
        birthdayIsValid: true,
        userBirthday: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1
        },
      }
    },
    computed: {
      yearList() {
        let currentYear = new Date().getFullYear()
        let range = 100
        let minYear = currentYear - range
        let lists = Array.from({ length: range + 1 }, (v, i) => {
          let value = i + minYear
          return { text: `${value}年`, value }
        }).reverse()
        return lists
      },
      monthList() {
        let today = new Date()
        let currentYear = today.getFullYear()
        let lists = []
        if (this.userBirthday.year === currentYear) {
          let month = today.getMonth()
          lists = this.createMonth(month)
        } else {
          lists = this.createMonth(11)
        }
        return lists
      }
    },
    methods: {
      createMonth(index) {
        return Array.from({ length: index + 1 }, (v, i) => {
          let value = i + 1
          return { text: `${value}月`, value }
        })
      },
      createBirthdayText(hasDay) {
        let { year, month } = this.userBirthday
        let dateObj = new Date(year, month - 1, 1)
        let formatText = hasDay ? 'YYYY/MM/DD' : 'YYYY/MM'
        return dayjs(dateObj).format(formatText)
      },
      checkBirthdayIsValid() {
        let { year, month } = this.userBirthday
        let startDate = dayjs(`${year}-${month}-1`)
        let endDate = dayjs().date(1)
        let diff = endDate.diff(startDate, 'year', true)
        let isValid = diff >= 7
        this.birthdayIsValid = isValid
        return isValid
      }
    },
    watch: {
      monthList(newVal) {
        if (newVal.length < 12) {
          let month = new Date().getMonth() + 1
          if (this.userBirthday.month > month) {
            this.userBirthday.month = 1
          }
        }
      },
      userBirthday: {
        deep: true,
        handler() {
          this.checkBirthdayIsValid()
        }
      }
    }
  }
})));