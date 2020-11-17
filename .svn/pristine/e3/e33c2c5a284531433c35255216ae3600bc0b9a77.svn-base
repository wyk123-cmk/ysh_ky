<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<userevaluation :show="shoupj"></userevaluation>
	</view>
</template>

<script>
	import userevaluation from '../../components/user-evaluation/user-evaluation.vue' //首次活动提醒
	export default {
		data() {
			return {
				shoupj:false
			}
		},
		components: {
			userevaluation
		},
		onLoad(){
			this.showImage = getApp().globalData.isDiscountPopup;
		}
	}
</script>

<style>

</style>
