<template>
<view class="page-bg">
	<image mode="widthFix" src="../../static/images/ac-bg.png"></image>
	<view class="share-con">
		<!-- #ifdef MP-WEIXIN -->
		<button class="friends" open-type="share">
			<image mode="widthFix" src="../../static/images/ac-btn1.png"></image>
		</button>
		<button class="circle" @click="share_wx">
			<image mode="widthFix" src="../../static/images/ac-btn2.png"></image>
		</button>
		<!-- #endif -->
		
		<!-- #ifdef H5 -->
		<button class="friends" @click="share_h5">
			<image mode="widthFix" src="../../static/images/ac-btn1.png"></image>
		</button>
		<button class="circle" @click="share_h5">
			<image mode="widthFix" src="../../static/images/ac-btn2.png"></image>
		</button>
		<!-- #endif -->
	</view>
	<view class="process">
		<image mode="widthFix" src="../../static/images/ac-process.png"></image>
	</view>
	<view class="reward-con" v-if="isBounty">
		<image mode="widthFix" src="../../static/images/ac-reward.png"></image>
		<view>
			<view class="money">
				<view>当前余额<view class="num"><text>¥</text>{{bountyData.amount}}</view></view>
				<view>累计金额<view class="num"><text>¥</text>{{bountyData.totalAmount}}</view>
				</view>
			</view>
			<button @click="btnWallet()">提现</button>
			<view class="tab-nav">
				<view :class="sendTabNav==0?'active':''" @click="sendClick(0)">已发货用户<text></text></view>
				<view :class="sendTabNav==1?'active':''" @click="sendClick(1)">未发货用户<text></text></view>
			</view>
			<!-- 已发货用户 -->
			<view v-if="sendTabNav==0">
				<view class="sub-nav">
					<view :class="userTabNav==0?'active':''" @click="userClick(0)">个人用户</view>
					<view :class="userTabNav==1?'active':''" @click="userClick(1)">企业用户</view>
				</view>
				<view v-if="alreadySendData.length==0" class="no-data">暂无数据</view>
				<view v-else>
					<view class="form">
						<view class="thead">
							<view>被邀请人</view>
							<view>发货运费</view>
							<view>奖励金额</view>
						</view>
						<view class="tbody" v-for="(item, i) in alreadySendData" :key="i">
							<view>
								<view>
									<text>{{userTabNav==0?item.userName:item.cmpyName}}</text>
									<text class="phone" v-if="userTabNav==0">{{item.splitPhone}}</text>
								</view>
							</view>
							<view class="money-num">¥{{item.expressPrice}}</view>
							<view class="money-num red"><text>¥{{item.referralAmount}}</text></view>
						</view>
					</view>
					<view class="more" @click="goMore">查看更多></view>
				</view>
			</view>
			<!-- 未发货用户 -->
			<view v-if="sendTabNav==1">
				<view class="sub-nav">
					<view :class="userTabNav==0?'active':''" @click="userClick(0)">个人用户</view>
					<view :class="userTabNav==1?'active':''" @click="userClick(1)">企业用户</view>
				</view>
				<view v-if="noSendData.length==0" class="no-data">暂无数据</view>
				<view v-else>
					<view class="no-send">
						<view class="item-list" v-for="(item, i) in noSendData" :key="i">
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
					</view>
					<view class="more" @click="goMore">查看更多></view>
				</view>
			</view>
		</view>
	</view>
	<!-- 分享 -->
	<view v-if="shareSend" @click="shareSend=false">
		<view class="v-model"></view>
		<view class="share-popup">
			<image src="../../static/images/share.png" alt="请点击右上角的分享按钮分享"></image>
		</view>
	</view>
	<!-- 分享朋友圈海报 -->
	<view v-if="wxShare">
		<view class="v-model"></view>
		<view class="wx-share-pic" @click="wxShare=false">
			<view @longpress="saveImg">
				<image :src="qrCodeUrl" mode="widthFix"></image>
			</view>
			<text>长按保存图片</text>
		</view>
	</view>
</view>
</template>
<script>
export default {
	data() {
		return {
			shareSend: false,
			wxShare: false,
			sendTabNav: 0,
			userTabNav: 0,
			qrCodeUrl: "",
			isBounty: false,
			bountyData: {
				useExpressList: null,
				useCmpyExpressList: null,
				noUseExpressList: null,
				noUseCmpyExpressList: null,
			},
			alreadySendData: [], //已发货
			noSendData: [], //未发货
			fromCode: "",
		}
	},
	onLoad(){
		this.getQrCode();
		this.getDataList();
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
			if(i == 0){
				this.getAlreadySend();
			}else{
				this.getNoSend();
			}
		},
		userClick: function(i){
			if(this.userTabNav == i) return false;
			this.userTabNav = i;
			if(this.sendTabNav == 0){
				this.getAlreadySend();
			}else{
				this.getNoSend();
			}
		},
		//已发货用户
		getAlreadySend: function(){
			const that = this;
			if(this.userTabNav == 0){
				this.alreadySendData = this.bountyData.useExpressList==null?[]:this.bountyData.useExpressList;
			}
			else{
				this.alreadySendData = this.bountyData.useCmpyExpressList==null?[]:this.bountyData.useCmpyExpressList;
			}
		},
		//未发货用户
		getNoSend: function(){
			const that = this;
			if(this.userTabNav == 0){
				this.noSendData = this.bountyData.noUseExpressList==null?[]:this.bountyData.noUseExpressList;
			}
			else{
				this.noSendData = this.bountyData.noUseCmpyExpressList==null?[]:this.bountyData.noUseCmpyExpressList;
			}
		},
		getDataList: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/Referral/GetIndex",
				success: function(res){
					if(res == null) return false;
					that.isBounty = true;
					res.amount = (res.amount).toFixed(2);
					res.totalAmount = (res.totalAmount).toFixed(2);
					if(res.useExpressList!=null){
						res.useExpressList.filter(item => {
							item.expressPrice = (item.expressPrice).toFixed(2);
							item.referralAmount = (item.referralAmount).toFixed(2);
							let str1 = (item.userPhone).substring(0,3);
							let str2 = (item.userPhone).substring(7,11);
							item.splitPhone = str1 + "****" + str2;
						});
					}
					if(res.noUseExpressList!=null){
						res.noUseExpressList.filter(item => {
							let str1 = (item.userPhone).substring(0,3);
							let str2 = (item.userPhone).substring(7,11);
							item.splitPhone = str1 + "****" + str2;
						});
					}
					that.bountyData = res;
					that.getAlreadySend();
				}
			})
		},
		//查看更多
		goMore: function(){
			uni.navigateTo({
				url: "seeMore?first=" + this.sendTabNav + "&two=" + this.userTabNav+"&fromCode="+this.fromCode
			})
		},
		//提现
		btnWallet: function(){
			if(Number(this.bountyData.amount) == 0){
				this.$util.showToast("当前余额为0,暂时不能提现!");
				return false;
			}
			uni.navigateTo({url: "/pages/me/bonusCash?&type=1"});
		},
		//获取海报
		getQrCode: function(){
			const that = this;
			uni.showLoading({
				title: "正在加载"
			})
			that.$util.networkRequest({
				url: "/Coupon/GetQrCode",
				success: res => {
					that.qrCodeUrl = res;
					that.$util.networkRequest({
						url: "/Account/Get",
						success: res => {
							that.fromCode = res.code;
							that.share_h5(false);
						}
					})
				}
			});
		},
		//H5分享邀请微信好友
		share_h5: function(type){
			if(type != false) this.shareSend = true;
			// #ifdef H5
			this.$util.wxshare({
				title: "邀请好友,躺赚现金", // 分享标题
				link: "http://" + window.location.host + "/pages/activityCenter/tz-immediatelyget?fromCode="+this.fromCode+"&userSource=TZ", // 分享链接
				desc: "推荐得奖励,邀请越多奖励越多",
				imgUrl: this.qrCodeUrl,
			});
			// #endif
		},
		//朋友圈保存图片
		share_wx: function(){
			// this.wxShare = true;
			uni.previewImage({
				current: 0,
				urls: [this.qrCodeUrl],
			});
		},
		//长按保存图片
		saveImg: function(){
			const that = this;
			this.$util.longSave(this.qrCodeUrl);
		}
	}
}
</script>
<style scoped>
.page-bg{
	background-color: #ba1e09;
}
.page-bg image{
	width: 100%;
}
.share-con{
	display: flex;
	padding: 0 5px;
	margin-top: -20px;
}
.share-con button{
	width: calc(50% - 10px);
	padding: 0;
	background-color: transparent;
	margin: 0 5px;
}
.process{
	margin: 10px 5px 0;
}
.process .title-img{
	display: block;
	margin: -17px auto 0;
	width: 156px;
	height: 40px;
}
.reward-con{
	margin: 20px 8px 50px;
}
.reward-con > view{
	background-color: #FFFFFF;
	margin: -10px 8px 0;
	padding-bottom: 20px;
	position: relative;
	z-index: 1;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	box-shadow:inset 0px 0px 10px 1px rgba(70, 16, 180, 0.3);
}
.reward-con .money{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32px 50px 24px;
}
.reward-con .money > view{
	color: #ba1e09;
	font-size: 12px;
	text-align: center;
}
.reward-con .money .num{
	color: #ba1e09;
	font-size: 32px;
	font-weight: bold;
	margin-top: 5px;
}
.reward-con .money .num text{
	font-size: 25px;
	padding-right: 5px;
}
.reward-con button{
	height: 30px;
	line-height: 30px;
	font-size: 12px;
	padding: 0;
	background-color: #ba1e09;
	color: #FFFFFF;
	margin: 0 50px;
	border-radius: 15px;
}
.tab-nav{
	display: flex;
	justify-content: space-between;
	padding: 30px 40px 8px;
	border-bottom: 1px solid #eeeeee;
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
	margin: 15px 40px;
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
	border-left: 1px solid #EEEEEE;
	border-right: 1px solid #EEEEEE;
	border-bottom: 1px solid #EEEEEE;
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
.tbody > view.red,
.more{
	color: #ba1e09;
}
.more{
	text-align: center;
	margin-top: 20px;
}
.no-send{
	border-top: 1px solid #EEEEEE;
	margin: 0 10px;
	border-radius: 3px;
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
.no-data{
	text-align: center;
	height: 100px;
}
.wx-share-pic{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1001;
}
.wx-share-pic > view{
	position: absolute;
	top: 50%;
	left: 20px;
	right: 20px;
	max-height: 80%;
	overflow-y: auto;
	transform: translate3d(0, -50%, 0);
}
.wx-share-pic image{
	width: 100%;
}
.wx-share-pic text{
	display: block;
	color: #FFFFFF;
	text-align: center;
	font-size: 16px;
	position: absolute;
	bottom: 5%;
	width: 100%;
	text-align: center;
}
</style>
