<template>
	<view>
	    <web-view :src="url" :progress="false"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: ''
		};
	},
	onLoad(options) {
		this.url = decodeURIComponent(options.url) //解码网址
	}
}
</script>