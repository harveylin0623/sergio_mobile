(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ObserverLazyLoading = factory());
}(this, (function () {
	class ObserverLazyLoading {
		constructor(props) {
			this.dom = props.dom
			this.threshold = props.threshold || 0.2
			this.rootMargin = props.rootMargin || '0px 0px 0px 0px'
			this.viewInEvent = props.viewInEvent
			this.init()
		}
		init() {
			this.start()
		}
		start() {
			const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						observer.unobserve(entry.target)
						this.viewInEvent()
					}
				})
			}, {
				threshold: this.threshold,
				rootMargin: this.rootMargin
			})
			observer.observe(this.dom)
		}
	}

	return ObserverLazyLoading
})));