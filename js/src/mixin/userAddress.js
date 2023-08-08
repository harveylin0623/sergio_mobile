(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.userAddressMixin = factory());
}(this, (function () {
  return {
    data() {
			return {
				zipcodeData: window.zipcodeData,
				addressInfo: { city: '', district: '', code: 0, road: '' }
			}
		},
		computed: {
			cityList() {
				if (this.zipcodeData.length === 0) return [];
				else return this.zipcodeData.map(item => item.name);
			},
			districtList() {
				let targetCity = this.zipcodeData.find(item => item.name === this.addressInfo.city);
				if (targetCity !== undefined) return targetCity.region;
				else return [];
			}
		},
		watch: {
			districtList() {
				this.addressInfo.district = '';
			},
			'addressInfo.district'(val) {
				let targetDistrict = this.districtList.find(item => item.name === val);
				this.addressInfo.code = targetDistrict !== undefined ? targetDistrict.code : 0;
			}
		}
  }
})));