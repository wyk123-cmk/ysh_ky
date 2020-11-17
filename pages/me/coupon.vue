<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="nav-tab">
			<text :class="[tabIndex==0?'active':'']" @click="clickTab(0)">可用券({{usableTotal}})</text>
			<text :class="[tabIndex==1?'active':'']" @click="clickTab(1)">已用券({{alreadyUsableTotal}})</text>
			<text :class="[tabIndex==2?'active':'']" @click="clickTab(2)">失效券({{invalidTotal}})</text>
		</view>
		<!-- 可用 -->
		<view v-if="tabIndex==0">
			<view v-if="usableTotal==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
			<scroll-view v-else class="scroll-box" scroll-y="true" @scrolltolower="usableScroll">
				<view v-for="(item, i) in usableData" :key="i" class="coupon-list" :class="[item.isget=='1'&&item.status=='2'?'none':'']">
					<view class="amount">
						<view v-if="item.couponType==2">¥<text>{{item.amount}}</text></view>
						<view v-if="item.couponType==1"><text>{{item.amount}}</text>折</view>
						优惠券
					</view>
					<view class="info">
						<text class="order-num">{{item.status=='2' || item.status=='3'?item.orderNumDetail:''}}</text>
						<text>{{item.fullReducAmount}}</text>
						<text>{{item.overdate}}</text>
						<text v-if="item.count!=null||item.count>1||item.count!=undefined">剩余数量: {{item.count}}</text>
					</view>
					<text class="btn share" @click="gojkd(item)">立即使用</text>
				</view>
			</scroll-view>
		</view>
		<!-- 已用 -->
		<view v-if="tabIndex==1">
			<view v-if="alreadyUsableTotal==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
			<scroll-view v-else class="scroll-box" scroll-y="true" @scrolltolower="alreadyUsableScroll">
				<view v-for="(item, j) in alreadyUsableData" :key="j" class="coupon-list">
					<view class="amount">
						<view v-if="item.couponType==2">¥<text>{{item.amount}}</text></view>
						<view v-if="item.couponType==1"><text>{{item.amount}}</text>折</view>
						优惠券
					</view>
					<view class="info">
						<text class="order-num">{{item.status=='2' || item.status=='3'?item.orderNumDetail:''}}</text>
						<text>{{item.fullReducAmount}}</text>
						<text>{{item.overdate}}</text>
						<text v-if="item.count!=null||item.count>1||item.count!=undefined">已用数量: {{item.count}}</text>
					</view>
					<image src="../../static/images/yiyong.svg"></image>
				</view>
			</scroll-view>
		</view>
		<!-- 失效 -->
		<view v-if="tabIndex==2">
			<view v-if="invalidTotal==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
			<scroll-view v-else class="scroll-box" scroll-y="true" @scrolltolower="invalidScroll">
				<view v-for="(item, k) in invalidData" :key="k" class="coupon-list">
					<view class="amount">
						<view v-if="item.couponType==2">¥<text>{{item.amount}}</text></view>
						<view v-if="item.couponType==1"><text>{{item.amount}}</text>折</view>
						优惠券
					</view>
					<view class="info">
						<text class="order-num">{{item.status=='2' || item.status=='3'?item.orderNumDetail:''}}</text>
						<text>{{item.fullReducAmount}}</text>
						<text>{{item.overdate}}</text>
						<text v-if="item.count!=null||item.count>1||item.count!=undefined">失效数量: {{item.count}}</text>
					</view>
					<image src="../../static/images/shixiao.svg"></image>
				</view>
			</scroll-view>
		</view>
		<navigator url="/pages/me/moreCoupon" class="footer">
			去领券中心<text>领更多优惠券</text>
		</navigator>
	</view>
</template>
<script>
export default {
	data() {
		return {
			tabIndex: 0,
			userType: "indi",
			limit: 10,
			usablePage: 1,
			usableTotal: 0,
			usableData: [],
			alreadyUsablePage: 1,
			alreadyUsableTotal: 0,
			alreadyUsableData: [],
			invalidPage: 1,
			invalidTotal: 0,
			invalidData: [],
		}
	},
	onLoad(options) {
		let _title = options.type == "indi"?"我的优惠券":"企业优惠券";
		uni.setNavigationBarTitle({ title: _title });
		this.showImage = getApp().globalData.isDiscountPopup;
		this.userType = options.type;
	},
	onShow() {
		this.usablePage = 1;
		this.usableTotal = 0;
		this.usableData = [];
		this.alreadyUsablePage = 1;
		this.alreadyUsableTotal = 0;
		this.alreadyUsableData = [];
		this.invalidPage = 1;
		this.invalidTotal = 0;
		this.invalidData = [];
		this.getCouponList(0);
		this.getCouponList(1);
		this.getCouponList(2);
	},
	methods: {
		gojkd: function(item){
			let type = "";
			if(item.couponType==1){
				if(item.expressType == "all"){
					uni.switchTab({ url: "/pages/index/index" });
					return false;
				}
				type = item.expressType;
			}
			else{
				type = item.amount < 3 ? "small" : "big";
			}
			uni.navigateTo({
				url: '/pages/index/expressDelivery?type=' + type
			})
		},
		clickTab: function(key){
			if(this.tabIndex!=key){
				this.tabIndex = key;
				if(key == 0 && this.usableData.length == 0){
					this.getCouponList(key);
				}
				if(key == 1 && this.alreadyUsableData.length == 0){
					this.getCouponList(key);
				}
				if(key == 2 && this.invalidData.length == 0){
					this.getCouponList(key);
				}
			}
		},
		usableScroll: function(e) {
			if(Math.ceil(this.usableTotal / this.limit) >= this.usablePage){
				this.getCouponList(0);
			}
		},
		alreadyUsableScroll: function(e) {
			if(Math.ceil(this.alreadyUsableTotal / this.limit) >= this.alreadyUsablePage){
				this.getCouponList(1);
			}
		},
		invalidScroll: function(e) {
			if(Math.ceil(this.invalidTotal / this.limit) >= this.invalidPage){
				this.getCouponList(2);
			}
		},
		getCouponList: function(_claimType){
			let that = this;
			let _page = 1;
			if(_claimType == 0) _page = that.usablePage;
			if(_claimType == 1) _page = that.alreadyUsablePage;
			if(_claimType == 2) _page = that.invalidPage;
			let param = {
				userType: that.userType,
				limit: that.limit,
				claimType: _claimType,
				page: _page
			}
			that.$util.networkRequest({
				url: "/Coupon/GetPageUserList",
				data: param,
				success: function(res){
					if(res==null) return false;
					let total = res.total;
					if(_claimType == 0){
						that.usablePage++;
						that.usableData = that.usableData.concat(res.list);
						that.usableTotal = total;
					}
					if(_claimType == 1) {
						that.alreadyUsablePage++;
						that.alreadyUsableData = that.alreadyUsableData.concat(res.list);
						that.alreadyUsableTotal = total;
					}
					if(_claimType == 2) {
						that.invalidPage++;
						that.invalidData = that.invalidData.concat(res.list);
						that.invalidTotal = total;
					}
				}
			});
		}
	}
}
</script>
<style scoped>
@import '../../common/css/me/coupon.css';
.scroll-box{
	position: absolute;
	top: 30px;
	bottom: 50px;
	left: 0;
	right: 0;
}
.footer{
	background-color: #FFFFFF;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0px;
	text-align: center;
	padding: 15px 0;
	box-shadow: 0px -1px 5px 1px #DCDCDC;
	-webkit-box-shadow: 0px -1px 5px 1px #DCDCDC;
}
.footer text{
	background-color: #FF6F42;
	color: #FFFFFF;
	padding: 3px 6px;
	border-radius: 26px;
	margin-left: 16px;
}
</style>
