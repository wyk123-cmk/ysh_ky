<template>
	<view class="">
		<swiper class="swiper" indicator-dots="true">
			<swiper-item v-for="(item, index) in photoUrl" :key="index" @longpress="saveImg(item)">
				<view class="swiper-item">
					<image mode="aspectFit" :src="item"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="btn">长按图片保存并分享</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			photoUrl: ""
		}
	},
	onLoad(){
		const that = this;
		that.$util.networkRequest({
			url : "/Referral/PostPhotoUrl",
			method: "POST",
			success: function(res){
				that.photoUrl = res;
			}
		});
	},
	created(){
		// this.$util.wxshare({
		// // 	title: "我在领" + _amount + "元物流大额券点击助力一下呗", // 分享标题
		// // 	desc: "助力成功您将获得一份尊享礼包", // 分享描述
		// // 	link: "http://" + window.location.host + "/pages/me/shareImage?id="+_id+"&type="+this.userType, // 分享链接
		// // 	imgUrl: "http://" + window.location.host +"/static/images/coupon" + _amount + ".png" //图片地址
		// })
	},
	//小程序分享
	// onShareAppMessage(res){
	// 	return {
	// 	    // title:  "我在领" + _amount + "元物流大额券点击助力一下呗", //分享内容的标题
	// 	    // path: "/pages/me/shareImage?id="+_id+"&type="+that.userType, //跳转链接
	// 	    // desc: "助力成功您将获得一份尊享礼包", //分享描述
	// 	    // imageUrl: "../../static/images/coupon" + _amount + ".png" //图片地址
	// 	}
	// },
	methods: {
		saveImg: function(url){
			const that = this;
			uni.downloadFile({      //下载图片
				url: url,
				success:(res)=>{
					console.log(res.tempFilePath)
					uni.saveImageToPhotosAlbum({     //将图片保存在手机
						filePath:res.tempFilePath,     //保存的位置
						success: (res) => {
							uni.showModal({
								title:"保存成功",
								content:"图片已成功保存到相册，快去分享到您的圈子吧",
								showCancel:false
							})
						}
					})
				}
			})
		}
	}
}
</script>
<style scoped>
.swiper{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 50px;
	height: auto;
	padding: 20px 30px 10px;
	background-color: #F7F7F7;
}
.swiper-item{
	height: 100%;
	border-radius: 6px;
}
.swiper-item image{
	height: 100%;
}
.btn{
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	line-height: 50px;
	text-align: center;
}
</style>
