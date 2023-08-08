(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.componentPageUrl = factory());
}(this, (function () {
	return {
		myHeader: {
			localUrl: {
        home: './home.html',
				login: './memberLogin.html',
				register_step1: './memberSignUpStep1.html',
        news: './articles.html',
				cart: './shopCartStep1.html',
        member: './memberCenter.html',
        faq: './commonQuestions.html',
        activity: './eventList.html',
        notify: './newNotification.html',
        notifyDetail: './newNotificationDetail.html',
        searchProduct: './allProductSearchResult.html',
        allProduct: './allProduct.html'
      },
      serverUrl: {
        home: './home.html',
				login: './memberLogin.html',
				register_step1: './memberSignUpStep1.html',
        news: './articles.html',
				cart: './shopCartStep1.html',
        member: './memberCenter.html',
        faq: './commonQuestions.html',
        activity: './eventList.html',
        notify: './newNotification.html',
        notifyDetail: './newNotificationDetail.html',
        searchProduct: './allProductSearchResult.html',
        allProduct: './allProduct.html'
      }
		},
		myFooter: {
			localUrl: {
        contactUs: './contactUs.html',
        faq: './commonQuestions.html',
        ticket: './memberCenterTicket.html',
        shopping: './footer-page-template.html?page_code=shopping_policy',
        payment: './footer-page-template.html?page_code=payment_policy',
        refund: './footer-page-template.html?page_code=refund_policy',
        membership: './footer-page-template.html?page_code=membership_terms',
        benefits: './footer-page-template.html?page_code=benefits_policy',
        privacy: './footer-page-template.html?page_code=privacy_policy',
        about_knn: './footer-page-template.html?page_code=about_knn'
      },
      serverUrl: {
        contactUs: './contactUs.html',
        faq: './commonQuestions.html',
        ticket: './memberCenterTicket.html',
        shopping: './footer-page-template.html?page_code=shopping_policy',
        payment: './footer-page-template.html?page_code=payment_policy',
        refund: './footer-page-template.html?page_code=refund_policy',
        membership: './footer-page-template.html?page_code=membership_terms',
        benefits: './footer-page-template.html?page_code=benefits_policy',
        privacy: './footer-page-template.html?page_code=privacy_policy',
        about_knn: './footer-page-template.html?page_code=about_knn'
      }
		}
	}
})));
