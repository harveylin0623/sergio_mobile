const path = require('path');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

const options = {
	context: path.resolve(__dirname),
	entry: {
		entry: './entry.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: './js/[name].js',
	},
	devServer: {
		compress: true,
		port: 3000
	},
	plugins: [
		new MergeIntoSingleFilePlugin({ //第三方套件整合
			files: {
				'js/vendor.min.js': [
					'libs/jquery/jquery.min.js',
					'libs/bootstrap/bootstrap.bundle.min.js',
					'libs/axios/axios.min.js',
					'libs/crypto/crypto-js.min.js',
					'libs/dayjs/dayjs.min.js',
					'libs/swiper/swiper.min.js',
					'libs/flatpicker/flatpickr.min.js',
					'libs/flatpicker/zh-tw.min.js',
					'libs/vue/vee-validate.min.js',
					'libs/lodash/lodash.min.js',
					'libs/taiwanIdValidator/index.min.js',
					'libs/vue/vuex.min.js',
				],
				'css/vendor.min.css': [
					'libs/bootstrap/bootstrap.min.css',
					'libs/swiper/swiper.min.css',
					'libs/flatpicker/flatpickr.min.css',
				],
			},
		}),
		new MergeIntoSingleFilePlugin({ //utility
			files: {
				'js/utility.js': [
					'js/src/utility/vuex/index.js',
					'js/src/utility/storage.js',
					'js/src/utility/vue-filter-validate-setting.js',
					'js/src/utility/wm_aes.js',
					'js/src/utility/getQuery.js',
					'js/src/utility/checkIsServer.js',
					'js/src/utility/componentPageUrl.js',
					'js/src/utility/uid.js',
					'js/src/utility/cartParams.js',
					'js/src/utility/openThirdPartyPaymentWindow.js',
					'js/src/utility/ObserverLazyLoading.js',
					'js/src/utility/LoadingImage.js',
					'js/src/utility/DigitalMap.js',
					'js/src/utility/Countdown.js',
					'js/src/utility/zipcodeData.js',
				],
			},
			transform: {
				'js/utility.js': code => require("uglify-js").minify(code).code
			},
		}),
		new MergeIntoSingleFilePlugin({ //api
			files: {
				'js/api.js': [
					'js/src/api/config.js',
					'js/src/api/scenes.js',
					'js/src/api/news.js',
					'js/src/api/product.js',
					'js/src/api/auth.js',
					'js/src/api/term.js',
					'js/src/api/customerService.js',
					'js/src/api/cart.js',
					'js/src/api/faq.js',
					'js/src/api/member.js',
					'js/src/api/coupon.js',
					'js/src/api/activity.js',
					'js/src/api/store.js',
					'js/src/api/logistics.js',
					'js/src/api/order.js',
					'js/src/api/notify.js',
					'js/src/api/invoice.js',
				],
			},
			transform: {
				'js/api.js': code => require("uglify-js").minify(code).code
			},
		}),
		new MergeIntoSingleFilePlugin({ //vue mixin
			files: {
				'js/vue-mixin.js': [
					'js/src/mixin/auth.js',
					'js/src/mixin/registerList.js',
					'js/src/mixin/userAddress.js',
					'js/src/mixin/processProduct.js',
					'js/src/mixin/createSpecSlideList.js',
					'js/src/mixin/createNewsPopular.js',
					'js/src/mixin/encodePhoneText.js',
					'js/src/mixin/contact.js',
					'js/src/mixin/checkBarcode.js',
					'js/src/mixin/initFlatPicker.js',
					'js/src/mixin/fullLabelActivity.js',
					'js/src/mixin/userbirthday.js',
					'js/src/mixin/cartDesc.js',
					'js/src/mixin/cartParams.js',
					'js/src/mixin/cartStep1Logic.js',
					'js/src/mixin/cartStep2Logic.js',
					'js/src/mixin/orderPay.js',
					'js/src/mixin/signUpStepData.js',
				],
			},
			transform: {
				'js/vue-mixin.js': code => require("uglify-js").minify(code).code
			},
		}),
		new MergeIntoSingleFilePlugin({ //vue component
			files: {
				'js/vue-global-component.js': [
					'js/vue-component/MyHeader/index.js',
					'js/vue-component/MyFooter/index.js',
					'js/vue-component/FooterAccordion/index.js',
					'js/vue-component/FooterAccordion/item.js',
					'js/vue-component/Loading/index.js',
					'js/vue-component/Modal/TipModal.js',
					'js/vue-component/Modal/AppDownloadModal.js',
					'js/vue-component/Modal/LogoutModal.js',
					'js/vue-component/Modal/ReloginModal.js',
					'js/vue-component/Modal/ActivityProductModal.js',
					'js/vue-component/modal/ContactModal.js',
					'js/vue-component/ActivitySidebar/index.js',
					'js/vue-component/ProductPagination/index.js',
					'js/vue-component/ProductPagination/ellipsis.js',
					'js/vue-component/Notify/NotifyAccordion.js',
					'js/vue-component/Notify/NotifyItem.js',
					'js/vue-component/Product/ProductPopular.js',
					'js/vue-component/Product/SearchProduct.js',
					'js/vue-component/Product/ComboProduct.js',
					'js/vue-component/Product/ActivityProduct.js',
					'js/vue-component/Product/PreorderProduct.js',
					'js/vue-component/Product/GroupBuyProduct.js',
					'js/vue-component/CategoryCircle/index.js',
					'js/vue-component/LazyBanner/index.js',
					'js/vue-component/LazyAd/index.js',
					'js/vue-component/LazyPopular/index.js',
					'js/vue-component/LazyNews/index.js',
					'js/vue-component/News/NewsList.js',
					'js/vue-component/News/NewsItem.js',
					'js/vue-component/CategorySidebar/index.js',
					'js/vue-component/KeywordSidebar/index.js',
					'js/vue-component/ActivityPickedRow/index.js',
					'js/vue-component/InputNumber/index.js',
					'js/vue-component/WarningSlogan/index.js'
				],
				'js/cart-page-component.js': [
					'js/vue-component/CartRow/NormalCartRow.js',
					'js/vue-component/CartRow/ActivityCartRow.js',
					'js/vue-component/CartRow/LimitedCartRow.js',
					'js/vue-component/CartRow/PreorderCartRow.js',
					'js/vue-component/CartRow/AddOnCartRow.js',
					'js/vue-component/CartRow/NormalSettledRow.js',
					'js/vue-component/CartRow/ActivitySettledRow.js',
					'js/vue-component/CartRow/LimitedSettledRow.js',
					'js/vue-component/CartRow/PreorderSettleRow.js',
					'js/vue-component/CartRow/PreorderBalanceCartRow.js',
					'js/vue-component/CartRow/BalanceAddOnCartRow.js',
					'js/vue-component/CartRow/GroupCartRow.js',
					'js/vue-component/CartRow/GroupSettleRow.js',
					'js/vue-component/CartRow/AddOnSettledRow.js',
					'js/vue-component/CartRow/AddOnBalanceSettledRow.js',
					'js/vue-component/AddOnSlide/index.js',
					'js/vue-component/InvoiceItem/index.js',
					'js/vue-component/PayItem/index.js',
					'js/vue-component/AddressField/index.js',
					'js/vue-component/DeliveryItem/index.js',
					'js/vue-component/Modal/MarketSelectModal.js',
					'js/vue-component/MarketItem/index.js',
					'js/vue-component/Modal/CartCouponModal.js',
					'js/vue-component/Coupon/CartCoupon.js',
					'js/vue-component/Modal/ReceiverCartModal.js',
					'js/vue-component/Receipent/select.js',
					'js/vue-component/CartUserForm/HomeDeliveryForm.js',
					'js/vue-component/CartUserForm/CvsDeliveryForm.js',
					'js/vue-component/CartUserForm/InvoiceForm.js',
				]
			},
		}),
	]
};

module.exports = options;