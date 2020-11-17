<template>
	<view>
		<image :src="imageUrl" mode="widthFix" style="width: 100%;"></image>
	</view>
</template>
<script>
export default {
	data() {
		return {
			id: "",
			type: "",
			imageUrl: ""
		}
	},
	onLoad(options) {
		this.id = options.id;
		this.type = options.type;
		this.getShareInfo();
		let app = getApp();
		app.isToken();
	},
	methods: {
		getShareInfo: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/Coupon/PostCreateAssistInfo",
				method: "POST",
				data: {userType: that.type, couponId: that.id},
				success: res => {
					that.$util.networkRequest({
						url: "/Coupon/GetCouponWechatUrl",
						data: {AssistId: res},
						success: data => {
							that.imageUrl = data;
						}
					});
					
				}
			});
		}
	}
}
</script>