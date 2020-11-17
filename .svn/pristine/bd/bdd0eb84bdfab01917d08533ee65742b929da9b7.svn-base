<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<text class="head-right" @click="cancel">取消订单</text>
		<view class="con">
			<image mode="widthFix" src="../../static/images/cb.png"></image>
			<view class="tips">{{msg}}</view>
			<view class="txt">您期望的上门时间（{{sendTime}}以前取件）已通知快递员，请保持电话畅通</view>
			<view class="looklan" @click="Getljm()" >
				<image mode="aspectFill" src="../../static/images/txm.png"></image>
				<text>查看揽件码</text>
			</view>

			<view class="btn">
				<button @click="btnAgain">再寄一单</button>
				<button @click="btnDetail">查看详情</button>
			</view>
			<view class="amount-box" @click="goPage">
				<image mode="widthFix" src="../../static/images/jlj-ad.png"></image>
				<image class="go" mode="aspectFit" src="../../static/images/go.png"></image>
			</view>
		</view>
		<view v-show="isBarCode">
			<view class="v-model" style="opacity: 0.8;" @click="isBarCode=false"></view>
			<view class="bar-code" >
				<image :src="barcodeImg" mode="widthFix" @longpress="longSave()"></image>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				barcodeImg:"",
				type: 1, //1整车寄件
				mastCode: "",
				sendTime: "",
				isBarCode: false,
				msg: "快递员已接单，请耐心等待"
			}
		},
		onLoad(options) {
			this.showImage = getApp().globalData.isDiscountPopup;
			this.mastCode = options.mastCode;
			this.type = options.type;
			this.sendTime = this.$util.formatDate.format(options.sendTime, "yyyy-MM-dd hh:mm");
			if (options.msg == 1) {
				this.msg = "订单已提交，请耐心等待";
			}
		},
		methods: {
			Getljm() {
				var that=this;
				// that.isBarCode = true;
				that.$util.networkRequest({
					url: "/Express/GetExpressBarCodeFile",
					data: {
						mastCode: that.mastCode,
					},
					success: function(res){
						console.log(res);
						that.barcodeImg=res;
						that.longSave()
					}
				})
			},
			longSave() {
				
				
					var that=this;
					
					var Array=[];
					Array.push(that.barcodeImg)
					that.$util.longSave(Array)
					
				

			},
			cancel: function() {
				let _type = this.type == undefined ? 0 : this.type;
				uni.navigateTo({
					url: "/pages/order/cancel?type=" + _type + "&mastCode=" + this.mastCode
				});
			},
			btnAgain: function() {
				this.$util.navigateBack(this);
			},
			btnDetail: function() {
				let url = "/pages/order/orderDetail?mastCode=" + this.mastCode + "&type=Sent";
				if (this.type == 1) {
					url = "/pages/vehicleMail/details?mastCode=" + this.mastCode;
				}
				uni.redirectTo({
					url: url
				});
			},
			goPage: function() {
				uni.navigateTo({
					// url: "/pages/me/bounty"
					url: "/pages/activityCenter/tz-activity"
				});
			}
		}
	}
</script>
<style scoped>
	.con {
		padding-top: 90px;
		text-align: center;
		border-top: 1px solid #EEEEEE;
	}

	.con image {
		width: 28%;
	}

	.con .tips {
		font-size: 16px;
		font-weight: bold;
		color: #4285F4;
		padding-top: 26px;
		padding-bottom: 6px;
	}

	.con .txt {
		padding: 0 28px;
		color: #999999;
	}

	.con .btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 25px 30px;
	}

	.con .btn button {
		background-color: #4285f4;
		border: 1px solid #4285f4;
		border-radius: 4px;
		text-align: center;
		width: 35%;
		height: 40px;
		line-height: 38px;
		color: #FFFFFF;
	}

	.con .btn button:first-child {
		background-color: #FFFFFF;
		color: #4285f4;
	}

	.amount-box {
		position: relative;
		margin: 60px 15px;
	}

	.amount-box image {
		width: 100%;
		min-height: 70px;
		margin: 0 auto;
		display: block;
	}

	.amount-box .go {
		position: absolute;
		top: 2px;
		left: calc(50% - 35px);
		height: 100%;
		transform: translatey(-50%);
		animation: bling 1s cubic-bezier(0.33, 0.13, 0.93, 0.62) infinite;
	}

	@keyframes bling {
		0% {
			transform: scale(1)
		}

		25% {
			transform: scale(.86)
		}

		50% {
			transform: scale(.78)
		}

		75% {
			transform: scale(.86)
		}

		100% {
			transform: scale(1)
		}
	}

	.looklan {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.looklan image {
		width: 60%;
		height: 35px;
		margin-top: 20px;
		margin-bottom: 5px;
	}

	.looklan text {
		color: #333333;
		font-size: 14px;
		text-decoration: underline;
	}

	.bar-code {
		position: absolute;
		top: 25%;
		left: 10px;
		right: 10px;
		
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 5px;
		z-index: 1001;
	}
</style>
