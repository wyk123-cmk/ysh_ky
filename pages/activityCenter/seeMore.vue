<template>
<view>
	<view class="tab-nav">
		<view :class="sendTabNav==0?'active':''" @click="sendClick(0)">已发货用户<text></text></view>
		<view :class="sendTabNav==1?'active':''" @click="sendClick(1)">未发货用户<text></text></view>
	</view>
	<view>
		<view class="sub-nav">
			<view :class="userTabNav==0?'active':''" @click="userClick(0)">个人用户</view>
			<view :class="userTabNav==1?'active':''" @click="userClick(1)">企业用户</view>
		</view>
		<!-- 已发货用户 -->
		<view class="form" v-if="sendTabNav==0">
			<view class="thead">
				<view>被邀请人</view>
				<view>发货运费</view>
				<view>奖励金额</view>
			</view>
			<scroll-view class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
				<view class="tbody" v-for="(item, i) in dataList" :key="i">
					<view>
						<view>
							<text>{{userTabNav==0?item.userName:item.cmpyName}}</text>
							<text class="phone" v-if="userTabNav==0">{{item.splitPhone}}</text>
						</view>
					</view>
					<view class="money-num">¥{{item.expressPrice}}</view>
					<view class="money-num red"><text>¥{{item.referralAmount}}</text></view>
				</view>
			</scroll-view>
		</view>
		<!-- 未发货用户 -->
		<scroll-view v-if="sendTabNav==1" class="no-send scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="item-list" v-for="(item, k) in dataList" :key="k">
				<view class="user">
					<text>{{userTabNav==0?item.userName:item.cmpyName}}</text>
					<text class="phone" v-if="userTabNav==0">{{item.splitPhone}}</text>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="btn" open-type="share">
					<image src="../../static/images/shou.png"></image>去邀请
				</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button class="btn" @click="share_h5">
					<image src="../../static/images/shou.png"></image>去邀请
				</button>
				<!-- #endif -->
			</view>
		</scroll-view>
	</view>
	<!-- 分享 -->
	<view v-if="shareSend" @click="shareSend=false">
		<view class="v-model"></view>
		<view class="share-popup">
			<image src="../../static/images/share.png" alt="请点击右上角的分享按钮分享"></image>
		</view>
	</view>
</view>
</template>
<script>
export default {
	data() {
		return {
			fromCode: "",
			sendTabNav: 0,
			userTabNav: 0,
			limit: 10,
			page: 1,
			total: 0,
			dataList: [],
			qrCodeUrl: "",
			shareSend: false,
		}
	},
	onLoad(options){
		this.sendTabNav = options.first;
		this.userTabNav = options.two;
		this.fromCode = options.fromCode;
		this.getQrCode();
		this.getList();
	},
	created() {
		// #ifdef H5
		this.$util.wxshare({
			title: "邀请好友,躺赚现金", // 分享标题
			link: "http://" + window.location.host + "/pages/activityCenter/tz-immediatelyget?fromCode="+this.fromCode+"&userSource=TZ", // 分享链接
			desc: "推荐得奖励,邀请越多奖励越多",
			imgUrl: this.qrCodeUrl,
		});
		// #endif
	},
	//小程序分享邀请微信好友
	onShareAppMessage: function(res) {
		return {
			title: "邀请好友,躺赚现金",
			path: "/pages/activityCenter/tz-immediatelyget?fromCode="+this.fromCode+"&userSource=TZ",
			desc: "推荐得奖励,邀请越多奖励越多",
			imageUrl: this.qrCodeUrl,
		}
	},
	methods: {
		sendClick: function(i){
			if(this.sendTabNav == i) return false;
			this.sendTabNav = i;
			this.getList();
		},
		userClick: function(i){
			if(this.userTabNav == i) return false;
			this.userTabNav = i;
			this.getList();
		},
		scrolltolower: function(){
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getList(false);
			}
		},
		getList: function(bool){
			if(bool != false){
				this.page = 1;
				this.total = 0;
				this.dataList = [];
			}
			let _url = "";
			if(this.sendTabNav == 0){
				//已发货
				if(this.userTabNav == 0) _url = "/GetUseExpressList";
				else _url = "/GetUseCmpyExpressList";
			}else{
				//未发货
				if(this.userTabNav == 0) _url = "/GetNoUseExpressModel";
				else _url = "/GetNoUseCmpyExpressModel";
			}
			this.getAjAx("/Referral" + _url);
		},
		getAjAx(_url){
			const that = this;
			that.$util.networkRequest({
				url: _url,
				data: {
					page: that.page,
					limit: that.limit
				},
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					res.list.filter(item => {
						if(that.userTabNav == 0){
							let str1 = (item.userPhone).substring(0,3);
							let str2 = (item.userPhone).substring(7,11);
							item.splitPhone = str1 + "****" + str2;
						}
						if(that.sendTabNav == 0){
							item.expressPrice = (item.expressPrice).toFixed(2);
							item.referralAmount = (item.referralAmount).toFixed(2);
						}
					});
					that.page++;
					that.total = total;
					that.dataList = that.dataList.concat(res.list);
				}
			})
		},
		
		//H5分享邀请微信好友
		share_h5: function(){
			this.shareSend = true;
		},
		//获取海报
		getQrCode: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/Coupon/GetQrCode",
				success: res => {
					that.qrCodeUrl = res;
				}
			})
		},
	}
}
</script>
<style scoped>
.tab-nav{
	display: flex;
	justify-content: space-between;
	padding: 15px 40px 8px;
	border-bottom: 1px solid #eeeeee;
	margin-bottom: 20px;
}
.tab-nav > view{
	position: relative;
}
.tab-nav .active text{
	display: block;
	position: absolute;
	bottom: -8px;
	left: 19px;
	width: 30px;
	border-bottom: 2px solid #ba1e09;
}
.sub-nav{
	display: flex;
	margin: 0 40px 15px;
	height: 30px;
	line-height: 30px;
	background-color: #fff4f2;
	border-radius: 20px;
	overflow: hidden;
}
.sub-nav > view{
	width: 50%;
	height: 100%;
	text-align: center;
	color: #ba1e09;
}
.sub-nav > view.active{
	background-color: #ba1e09;
	color: #FFFFFF;
	border-radius: 20px;
}
.form{
	margin: 0 10px;
}
.thead,
.tbody{
	display: flex;
	align-items: center;
	border-bottom: 1px solid #EEEEEE;
	border-left: 1px solid #EEEEEE;
	border-right: 1px solid #EEEEEE;
	padding: 0 5px;
}
.thead > view,
.tbody > view{
	width: calc(30% - 10px);
	padding: 0 5px;
	text-align: center;
}
.thead{
	background-color: #fafafa;
	border-color: #fafafa;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
}
.thead > view{
	height: 40px;
	line-height: 40px;
}
.thead > view:first-child,
.tbody > view:first-child{
	text-align: left;
	width: calc(40% - 10px);
}
.thead > view:last-child,
.tbody > view:last-child{
	text-align: right;
}
.thead > view:last-child.money-num,
.tbody > view:last-child.money-num{
	justify-content: flex-end;
}
.tbody > view{
	height: 60px;
	display: flex;
	align-items: center;
}
.tbody > view .phone{
	display: block;
	color: #808080;
}
.tbody > view.money-num{
	justify-content: center;
}
.tbody > view.money-num text{
	display: block;
	min-width: 56px;
	text-align: center;
}
.tbody > view.red{
	color: #ba1e09;
}
.scroll-wrapper{
	/* border: 1px solid #F09236; */
	position: absolute;
	top: 150px;
	width: calc(100% - 20px);
	bottom: 20px;
}
.no-send.scroll-wrapper{
	margin: 0 10px;
	top: 105px;
	border-top: 1px solid #EEEEEE;
}
.item-list{
	border: 1px solid #EEEEEE;
	border-top: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
}
.item-list .user .phone{
	display: block;
	color: #808080;
}
.item-list .btn{
	background: -webkit-linear-gradient(left, #ffa239 40%, #ff4320);
	background: -moz-linear-gradient(left, #ffa239 40%, #ff4320);
	background: linear-gradient(left, #ffa239 40%, #ff4320);
	padding: 5px 18px;
	line-height: initial;
	display: flex;
	align-items: center;
	color: #FFFFFF;
	border-radius: 20px;
	margin: 0;
}
.item-list .btn image{
	width: 18px;
	height: 16px;
	padding-right: 3px;
}
</style>
