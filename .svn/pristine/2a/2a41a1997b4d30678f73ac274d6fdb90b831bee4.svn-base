<template>
	<view>
		<view class="error-msg">
			<image mode="widthFix" src="../static/images/set.png"></image>
			<view class="title">系统例行维护</view>
			<text>{{msg}}</text>
			<!-- <button class="refresh" @click="refresh">刷新</button> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			msg: "预计时间12小时,具体上线时间另行通知"
		}
	},
	created() {
		var that = this;
		var _msg = uni.getStorageSync("errormsg");
		that.msg = _msg == ""?that.msg:_msg;
	},
	methods: {
		refresh: function(){
			const that = this;
			uni.request({
			    url: that.apiUrl+"/SysInfo/GetNoticeAndSlideShow", //仅为示例，并非真实接口地址。
			    header: {
			        appId: that.appId,
			    },
			    success: (res) => {
					if(res.data.errCode == 200){
						uni.switchTab({
							url:"/pages/index/index"
						})
					}
					else if(res.data.errCode == 4000){
						that.msg = res.data.message;
					}
			    }
			});
		}
	}
}
</script>
<style scoped>
.error-msg{
	text-align: center;
	position: absolute;
	left: 0;
	right: 0;
	top: 40%;
	transform: translate3d(0, -50%, 0);
}
.error-msg image{
	width: 60%;
	height: 136px;
}
.error-msg .title{
	font-size: 20px;
	color: #5192e0;
	margin: 25px 0 5px;
}
.error-msg text{
	color: #636363;
	font-size: 12px;
	display: block;
	padding: 0 20px;
	text-align: left;
}
.refresh{
	width: 230px;
	height: 37px;
	border-radius: 30px;
	color: #FFFFFF;
	font-size: 14px;
	margin-top: 80px;
	background: -webkit-linear-gradient(top, #e3f0ff -30%,#569ff5 60%);
	background: linear-gradient(top, #e3f0ff -30%,#569ff5 60%);
}
</style>
