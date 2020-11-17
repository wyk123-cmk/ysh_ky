<template>
<view class="page-bg" :style="carInfoData.status == 2?'padding-bottom: 60px;':''">
	<page-imges :show="showImage"></page-imges>
	<view class="head-right" v-if="carInfoData.status!=9" @click="goCancel()">取消订单</view>
	<view class="state-title" v-if="carInfoData.status==1||carInfoData.status==2">{{carInfoData.statusText}}</view>
	<!-- 寄收件地址 -->
	<view class="address-con" v-if="(carInfoData.status != 3&&carInfoData.status != 4) || details">
		<view>
			<view class="user">
				<text class="iconfont icon-ji1"></text>
				<text class="name">{{expressFrom.name}}</text>
				<text class="tel" @click="phoneCall(expressFrom.phone)">{{expressFrom.phone}}</text>
			</view>
			<view>{{fromAddress}}</view>
		</view>
		<view class="shouji">
			<view class="user">
				<text class="iconfont icon-shou"></text>
				<text class="name">{{expressTo.name}}</text>
				<text class="tel" @click="phoneCall(expressTo.phone)">{{expressTo.phone}}</text>
			</view>
			<view>{{toAddress}}</view>
		</view>
	</view>
	<view class="item-list driver-info" v-if="driverInfo != null">
		<image src="../../static/images/driver.png" mode="widthFix"></image>
		<view>
			<text class="name">{{driverInfo.driverName==null?'':driverInfo.driverName}}</text>
			<text>{{driverInfo.carLength==null?'':driverInfo.carLength}}米 · {{driverInfo.carName==null?'':driverInfo.carName}} · {{driverInfo.carNumber==null?'':driverInfo.carNumber}}</text>
		</view>
		<text class="tel">{{driverInfo.driverPhone==null?'':driverInfo.driverPhone}}</text>
	</view>
	<!-- 报价列表 -->
	<view class="quoted-price-con" v-if="carInfoData.status!=3&&carInfoData.offerPriceList.length>0">
		<view class="samll-title">报价列表</view>
		<view class="error-msg" v-if="carInfoData.offerPriceList[0].isRefuse">
			<text>拒绝报价:</text>
			<text>{{carInfoData.offerPriceList[0].refuseRemark}}</text>
		</view>
		<view v-else class="list" :class="priceIndex==i?'active':''" v-for="(item, i) in carInfoData.offerPriceList" :key="i" @click="priceListClick(item.priceCode,i)">
			<image src="../../static/images/icon-active.png"></image>
			<view>
				<!-- <text v-if="item.companyCode=='ky001'">跨越速运</text>
				<text v-if="item.companyCode=='sf001'">顺丰快运</text>
				<text v-if="item.companyCode=='db001'">德邦快递</text> -->
				<text >{{item.productName}}</text>
				<view class="time">报价时间: {{$util.formatDate.format(item.addTime, "yyyy-MM-dd hh:mm:ss")}}</view>
			</view>
			<view>
				<view class="money">¥<text>{{item.userPrice}}</text></view>
			</view>
		</view>
	</view>
	<!-- 订单货物信息 -->
	<view class="mail-list" v-if="carInfoData.status != 2">
		<view class="num" v-if="(carInfoData.status == 3||carInfoData.status == 4) && !details">订单号: {{carInfoData.mastCode}}</view>
		<view class="order-con" @click="goDetails()">
			<view class="info">
				<text class="name">{{goods.name}}</text>
				<text>体积: {{goods.volume}}m³</text>
				<text class="money" v-if="(carInfoData.status == 3||carInfoData.status == 4) && !details">¥{{carInfoData.price}}</text>
			</view>
		</view>
		<view class="state" v-if="(carInfoData.status == 3||carInfoData.status == 4) && !details">
			<view>
				<text>寄件信息</text>
				<text>{{expressFrom.name}}-{{expressFrom.areaInfo.province}}</text>
			</view>
			<view>
				<text>收件信息</text>
				<text>{{expressTo.name}}-{{expressTo.areaInfo.province}}</text>
			</view>
			<view>
				<text>状态</text>
				<text>{{carInfoData.statusText}}</text>
			</view>
		</view>
	</view>
	<!-- 订单跟踪 -->
	<view class="item-list" v-if="(carInfoData.status == 3|| carInfoData.status == 4) && !details">
		<view class="samll-title">订单跟踪</view>
		<view>
			<view v-if="processList.length == 0" style="margin-top: 20px;color: #9B9B9B;">暂无订单物流!</view>
			<view v-else class="process" :class="k==0?'active':''" v-for="(item, k) in processList" :key="k">
				<image v-if="k==0" src="../../static/images/yuandian1.png"></image>
				<image v-else src="../../static/images/yuandian.png"></image>
				{{item.routeInfo}}
				<text>{{item.remark}}</text>
				<text>{{$util.formatDate.format(item.routeTime, "yyyy-MM-dd hh:mm:ss")}}</text>
			</view>
		</view>
	</view>
	<!-- 货物信息 -->
	<view v-if="(carInfoData.status != 3&&carInfoData.status != 4) || details">
		<view class="item-list">
			<view class="samll-title">货品信息</view>
			<view class="label">货品名称：{{goods.name}}</view>
			<view class="label">货品类型：{{goods.category}}</view>
			<view class="label">寄件数量：{{goods.count}} 件</view>
			<view class="label">货品重量：{{goods.weight}} kg</view>
			<view class="label">保价费用：<text>￥{{carInfoData.insurancePrice}}</text></view>
			<view class="label price-title" v-if="carInfoData.status==9">实付款（含保费）<text>￥{{carInfoData.price}}</text></view>
		</view>
		<view class="item-list">
			<view class="samll-title">订单信息</view>
			<view class="label">寄件方式：{{carInfoData.expressCompanyName}} </view>
			<view class="label" v-for="(item,j) in carInfoData.serviceList" :key="j">
				{{item.serviceTitle}}：{{item.serviceValue}}
			</view>
			<view class="label" v-if="carInfoData.status!=1&&carInfoData.status!=2">订单状态：{{carInfoData.statusText}} </view>
			<view class="label" v-if="carInfoData.status==9">取消原因：{{carInfoData.cancelReason==''||carInfoData.cancelReason==null?'无':carInfoData.cancelReason}}</view>
			<view class="label" v-if="carInfoData.status!=9">创建时间：{{carInfoData.createTime}}</view>
			<view class="label" v-if="carInfoData.status!=9">期望提货时间：{{carInfoData.sendTime}}</view>
		</view>
		<view class="item-list" v-if="carInfo != null">
			<view class="samll-title">车辆信息</view>
			<view class="label">车型名称：{{carInfo.carName==null?'':carInfo.carName}}</view>
			<view class="label" v-if="carInfo.parentCareName!=null">类型名称：{{carInfo.parentCareName}}</view>
			<view class="label">车载长度：{{carInfo.carLength==null?'0':carInfo.carLength}}m</view>
			<view class="label">重量：{{carInfo.carWeight==null?'0':carInfo.carWeight}}kg</view>
			<view class="label">车载体积：{{carInfo.carCubage==null?'0':carInfo.carCubage}}m³</view>
		</view>
		<view class="item-list" v-if="orderInfo != null">
			<view class="samll-title">运单信息</view>
			<view class="label">签收时间：{{orderInfo.finishedTime}}</view>
			<view class="label">运单号：{{orderInfo.expressCode}}</view>
			<view class="label">取货联系人：{{orderInfo.getGoodLinkName==null?'':orderInfo.getGoodLinkName}}</view>
			<view class="label">取货联系人手机号：{{orderInfo.getGoodLinkPhone==null?'':orderInfo.getGoodLinkPhone}}</view>
			<view class="label">派货联系人：{{orderInfo.sendGoodLinkName==null?'':orderInfo.sendGoodLinkName}}</view>
			<view class="label">派货联系人手机号：{{orderInfo.sendGoodLinkPhone==null?'':orderInfo.sendGoodLinkPhone}}</view>
			<view class="label">取货签到时间：{{orderInfo.takeTime}}</view>
			<view class="label">派件签到时间：{{orderInfo.leaveTime}}</view>
		</view>
		<view class="item-list" v-if="carInfoData.remark!=''">
			<view class="samll-title">寄件备注</view>
			<view class="label">{{carInfoData.remark}}</view>
		</view>
	</view>
	<view class="payment" v-if="carInfoData.status == 2">
		<button @click="immediatePayment()">立即支付</button>
		<view class="total">合计: <text>¥{{carInfoData.offerPriceList[priceIndex].userPrice}}</text></view>
	</view>
	<view v-if="isCompanyPassword">
		<view class="v-model" @click="isCompanyPassword=false"></view>
		<view class="company-password-box">
			<view class="title">立即支付<text class="iconfont icon-quxiao" @click="isCompanyPassword=false"></text></view>
			<view class="note">
				<text>!</text>整车寄件支付成功后,取消订单会收取一定的费用,请谨慎支付!
			</view>
			<view class="money">¥<text>{{carInfoData.offerPriceList[priceIndex].userPrice}}</text></view>
			<input type="password" placeholder="请输入企业支付密码" v-model="password" />
			<button class="btn-default-css" @click="orderNow">确定</button>
		</view>
	</view>
</view>
</template>
<script>
export default {
	data() {
		return {
			mastCode: "",
			isCompanyPassword: false,
			password: "",
			carInfoData: {
				offerPriceList:[]
			},
			expressFrom: {
				areaInfo: {}
			},
			expressTo: {
				areaInfo: {}
			},
			fromAddress: "",
			toAddress: "",
			goods: {},
			carInfo: {},
			driverInfo: {},
			orderInfo: {},
			processList: [],
			takeTime: "",
			leaveTime: "",
			priceIndex: 0,
			details: false
		}
	},
	onLoad(options){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.mastCode = options.mastCode;
		if(options.details != undefined)
		this.details = true;
		this.getCarInfo();
	},
	methods: {
		//获取整车寄件的信息
		getCarInfo: function(){
			const that = this;
			uni.showLoading({
				title: "耐心等待"
			})
			that.$util.networkRequest({
				url : "/ExpressCar/GetInfo",
				data: {mastCode: that.mastCode},
				success: function(res){
					//单据状态:1待报价2待支付3运输中4已签收 9已取消
					res.price = res.price.toFixed(2);
					that.carInfoData = res;
					that.expressFrom = res.expressFrom;
					that.expressTo = res.expressTo;
					that.fromAddress = res.expressFrom.areaInfo.province+res.expressFrom.areaInfo.city+res.expressFrom.areaInfo.area+res.expressFrom.address
					that.toAddress = res.expressTo.areaInfo.province+res.expressTo.areaInfo.city+res.expressTo.areaInfo.area+res.expressTo.address
					that.goods = res.goods;
					that.carInfo = res.carInfo;
					that.driverInfo = res.driverInfo;
					that.orderInfo = res.orderInfo;
					that.processList = res.routeList;
					that.carInfoData.createTime = that.$util.formatDate.format(res.createTime, "yyyy-MM-dd hh:mm:ss");
					that.carInfoData.sendTime = that.$util.formatDate.format(res.sendTime, "yyyy-MM-dd hh:mm:ss");
					if(that.orderInfo!=null){
						if(that.orderInfo.finishedTime!=""&&that.orderInfo.finishedTime!=null)
							that.orderInfo.finishedTime = that.$util.formatDate.format(res.orderInfo.finishedTime, "yyyy-MM-dd hh:mm:ss");
						else
							that.orderInfo.finishedTime = "";
						if(that.orderInfo.takeTime!=""&&that.orderInfo.takeTime!=null)that.orderInfo.takeTime = that.$util.formatDate.format(res.orderInfo.takeTime, "yyyy-MM-dd hh:mm:ss");
						if(that.orderInfo.leaveTime!=""&&that.orderInfo.leaveTime!=null)that.orderInfo.leaveTime = that.$util.formatDate.format(res.orderInfo.leaveTime, "yyyy-MM-dd hh:mm:ss");
					}
				}
			})
		},
		//立即支付
		immediatePayment: function(){
			this.password = "";
			if(this.carInfoData.expressMode == 2){
				this.isCompanyPassword = true;
				return false;
			}
			this.orderPayment();
		},
		orderNow: function(){
			if(this.password == ""){
				this.$util.showToast("请输入企业支付密码");
				return false;
			}
			this.orderPayment();
		},
		priceListClick: function(code,index){
			this.priceIndex = index;
		},
		//订单支付
		orderPayment: function(){
			const that = this;
			that.isCompanyPassword = false;
			let param = {
				"mastCode": that.mastCode,
				"password": that.password,
				"priceCode": that.carInfoData.offerPriceList[that.priceIndex].priceCode
			}
			uni.showLoading({
				mask:true,
				title: "正在支付",
			})
			that.$util.networkRequest({
				url: "/ExpressCar/Submit", //接口地址
				method: 'POST',
				data: param,
				success(res) {
					that.password = "";
					if(!res){
						that.$util.showToast("支付失败!")
						return false;
					}
					uni.redirectTo({url: "/pages/order/orderSuccess?mastCode="+that.mastCode+"&sendTime="+that.carInfoData.sendTime+"&type=1"});
				},
				error: function(res){
					//个人余额不足跳转充值存localStorage
					if(res.errCode == 2001){
						uni.showModal({
						    title: '提示',
						    content: res.message,
							showCancel: false,
						    success: function (res) {
						        uni.navigateTo({ url: "/pages/me/myRefill?type=car"+that.mastCode});
						    }
						});
					}
				}
			});
		},
		//取消订单
		goCancel: function(){
			// uni.navigateTo({
			// 	url: "/pages/order/cancel?mastCode="+this.mastCode+"&type=1"
			// })
			const that = this;
			uni.showModal({
				title: '提示',
				content: '您确定要取消询价单？',
				success: function(res){
					if(res.confirm){
						uni.showLoading({title: '取消...',mask: true});
						that.$util.networkRequest({
							url: "/ExpressCar/CancelExpress", //接口地址
							method: 'POST',
							data: {value: that.mastCode},
							success(res) {
								that.$util.showToast("删除成功");
								that.$util.navigateBack(that);
							}
						});
					}
				}
			});
		},
		//查看详情
		goDetails: function(){
			if((this.carInfoData.status!=3&&this.carInfoData.status!=4)||this.details) return false;
			uni.navigateTo({
				url: "details?details=true&mastCode="+this.mastCode
			});
		},
		//复制
		setClip: function(val){
			let that = this;
			uni.setClipboardData({ data: val, success: () => {
				uni.showToast({ title: "内容已复制", icon: 'success' });
			}});
		},
		//拨打电话
		phoneCall(tel){
			uni.makePhoneCall({
				phoneNumber: tel //仅为示例
			});
		}
	}
}
</script>
<style scoped>
/* #ifdef MP-WEIXIN */
.head-right{
	color: #333333;
	background-color: #F7F7F7;
}
/* #endif */
.state-title{
	height: 80px;
	line-height: 80px;
	background-color: #4285F4;
	color: #FFFFFF;
	font-size: 18px;
	font-weight: bold;
	padding-left: 20px;
}
.address-con{
	background-color: #FFFFFF;
	border-radius: 3px;
	margin: 10px 10px;
	padding: 20px 15px;
}
.address-con .shouji{
	margin-top: 20px;
}
.address-con .user{
	display: flex;
	align-items: center;
	position: relative;
	margin-bottom: 5px;
}
.address-con .iconfont{
	font-size: 24px;
	padding-right: 10px;
}
.address-con .iconfont.icon-shou{
	color: #EF9A42;
}
.address-con .name{
	font-size: 16px;
}
.address-con .tel{
	position: absolute;
	right: 0;
}
.mail-list{
	background-color: #FFFFFF;
	margin: 10px;
	border-radius: 3px;
}
.mail-list .num{
	border-bottom: 1px solid #f7f7f7;
	padding: 10px;
}
.mail-list .order-con{
	padding: 15px 10px;
	display: box;
	display: -webkit-box;
	display: -moz-box;
}
.mail-list .order-con .info text{
	display: block;
	width: 100%;
	color: #9B9B9B;
}
.mail-list .order-con .info .name{
	color: #333333;
	font-size: 16px;
	margin: 5px 0;
}
.mail-list .order-con .info .money{
	color: #F09236;
	font-size: 18px;
	font-weight: bold;
	margin-top: 10px;
}
.mail-list .state{
	border-top: 1px solid #f7f7f7;
}
.mail-list .state > view{
	width: calc(100% / 3 - 1px);
	width: -webkit-calc(100% / 3 - 1px);
	width: -moz-calc(100% / 3 - 1px);
	display: inline-block;
	text-align: center;
	border-left: 1px solid #f7f7f7;
	margin: 10px 0;
}
.mail-list .state > view:first-child{
	border-left: 0;
}
.mail-list .state text{
	display: block;
}
.mail-list .state text:first-child{
	color: #9B9B9B;
	padding-bottom: 5px;
}
.mail-list .state text:last-child{
	width: 90%;
	margin: 0 auto;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.item-list{
	background-color: #FFFFFF;
	margin: 0 10px 10px;
	padding: 15px 15px 25px;
}
.item-list .samll-title{
	border-left: 2px solid #fd9523;
	padding-left: 5px;
}
.item-list .label{
	font-size: 12px;
	padding-left: 8px;
	padding-top: 8px;
	color: #666;
	display: flex;
	align-items: center;
}
.item-list .label text{
	float: right;
}
.item-list .label .market{
	text-decoration: line-through;
	color: #999;
	padding-right: 10px;
}
.item-list .label.price-title{
	font-size: 14px;
	color: #333;
}
.item-list .label.price-title text{
	color: #fd9523;
}
.item-list .label .iconfont{
	float: inherit;
	margin-left: 3px;
}
.payment{
	background-color: #FFFFFF;
	height: 60px;
	line-height: 60px;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
.payment .total{
	margin-left: 15px;
	font-size: 15px;
}
.payment .total text{
	color: #F09236;
	padding-left: 10px;
}
.payment button{
	float: right;
	line-height: 60px;
	color: #FFFFFF;
	background-color: #4285F4;
	padding: 0 20px;
	border-radius: 0;
}
.process{
	position: relative;
	padding: 15px 15px 15px 0;
	margin-left: 30px;
	border-bottom: 1px solid #F7F7F7;
}
.process image{
	width: 12px;
	height: 66px;
	position: absolute;
	left: -20px;
	top: 30px;
}
.process.active,
.process.active text{
	color: #fd5a6f;
}
.process text{
	font-size: 12px;
	display: block;
	margin-top: 3px;
	color: #999999;
}
.quoted-price-con{
	background-color: #FFFFFF;
	margin: 10px;
	padding: 0 10px 10px;
}
.quoted-price-con .samll-title{
	padding-top: 10px;
}
.quoted-price-con .list{
	border: 1px solid #e8e8e8;
	border-radius: 3px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-flow: row wrap;
	justify-content: space-between;
	padding: 15px 20px;
	margin-top: 10px;
	position: relative;
	overflow: hidden;
}
.quoted-price-con .list image{
	width: 20px;
	height: 20px;
	position: absolute;
	right: 0;
	bottom: 0;
	display: none;
}
.quoted-price-con .list.active{
	border-color: #4285F4;
}
.quoted-price-con .list.active image{
	display: block;
}
.quoted-price-con .list > view:last-child{
	text-align: right;
}
.quoted-price-con .list .money{
	color: #F09236;
}
.quoted-price-con .list .money text{
	font-size: 20px;
	padding-left: 3px;
}
.quoted-price-con .list .time{
	font-size: 13px;
	color: #999999;
}
.quoted-price-con .list .decoration{
	text-decoration: line-through;
}
.company-password-box{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	padding-bottom: 30px;
	background-color: #FFFFFF;
}
.company-password-box .title{
	text-align: center;
	height: 42px;
	line-height: 42px;
	border-bottom: 1px solid #eee;
	position: relative;
}
.company-password-box .title .icon-quxiao{
	position: absolute;
	top: 0;
	right: 15px;
	height: 42px;
}
.company-password-box .money{
	text-align: center;
	line-height: 80px;
}
.company-password-box .money text{
	font-size: 28px;
	padding-left: 3px;
}
.company-password-box input{
	border-bottom: 1px solid #EEEEEE;
	margin: 0 45px 20px;
	height: 40px;
	line-height: 40px;
}
.company-password-box .note{
	background-color: #FDF4F3;
	color: #FF0000;
	padding: 5px 10px;
	font-size: 12px;
	line-height: 18px;
}
.company-password-box .note text{
	display: block;
	float: left;
	width: 15px;
	height: 15px;
	text-align: center;
	line-height: 16px;
	margin-top: 1px;
	margin-right: 5px;
	background-color: #FF0000;
	color: #FFFFFF;
	border-radius: 50%;
}
.driver-info{
	display: flex;
	align-items: center;
	padding-bottom: 15px;
	position: relative;
}
.driver-info image{
	width: 40px;
	height: 60px;
	margin-right: 10px;
}
.driver-info text,
.error-msg text{
	display: block;
}
.driver-info .name{
	font-size: 16px;
	margin-bottom: 5px;
}
.driver-info .tel{
	position: absolute;
	top: 20px;
	right: 10px;
}
.error-msg{
	color: #FF0000;
	background-color: #FEF7F6;
	padding: 10px 20px;
	line-height: 22px;
	border-radius: 3px;
	margin-top: 10px;
}
</style>