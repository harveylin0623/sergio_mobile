Vue.component('news-list', {
	props: {
		newsInfo: { type: Object, required: true }
	},
	template: `
		<a :href="newsInfo.linkUrl" class="d-block py-16" style="border-top-style:dashed;">
			<div class="text-neutral-0 text-sm line-clamp-1">{{ newsInfo.title }}</div>
			<div class="text-xs text-neutral-3">{{ newsInfo.startTime }}</div>
		</a>`
})