Vue.component('news-list', {
	props: {
		newsInfo: { type: Object, required: true }
	},
	template: `
		<a :href="newsInfo.linkUrl" class="py-2 bd-bottom-divide" style="border-bottom-style:dashed;">
			<div class="text-dark title sm ellipsis">{{ newsInfo.title }}</div>
			<div class="text-date title xs mb-0">{{ newsInfo.startTime }}</div>
		</a>`
})