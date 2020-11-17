<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<scroll-view class="scroll-box" scroll-y="true" @scrolltolower="expressScroll">
			<navigator url="/pages/me/explain?type=4" class="head-right">奖励金说明</navigator>
			<view class="head-con">
				<text>可提现金额</text>
				<text class="money">¥{{bountyInfo.amount}}</text>
				<text>本月预期收入不计入可提现余额</text>
				<view class="btn-list">
					<navigator class="btn" url="/pages/me/withdrawalRecord">资金明细</navigator>
					<navigator class="btn" url="/pages/me/bonusCash">立即提现</navigator>
				</view>
			</view>
			<view class="money-list">
				<view>
					<text>累计收益</text>
					<text class="num">¥{{bountyInfo.totalAmount}}</text>
				</view>
				<view>
					<text>本月预期收益</text>
					<text class="num">¥{{bountyInfo.monthAmount}}</text>
				</view>
			</view>
			<view class="small-title" @click="isCompany = true; isRadarImg=true">
				我的企业
				<view>{{companyTotal}}<text class="iconfont icon--right-jian"></text></view>
			</view>
			<view class="small-title">
				奖励金收益
			</view>
			<view class="qiun-columns">
				<view class="qiun-charts" v-if="profitLength > 0">
					<canvas v-show="!isRadarImg" canvas-id="canvasColumn" id="canvasColumn" class="charts"></canvas>
					<image v-show="isRadarImg" :src="radarImg" class="charts"></image>
				</view>
				<!-- <view v-else style="padding: 0 15px 10px; color: #999;">暂无奖励金收益</view> -->
			</view>
			<view class="bounty-list">
				<view class="date">
					<picker class="picker" mode="multiSelector" :range="startArray" :value="startIndex" @change="startPickerChange" @columnchange="startPickerColumn">
						{{startDate}}<text class="iconfont icon-shouqi"></text>
					</picker>
					<view class="profit">
						<text>累计运费 ￥{{expressTotalAmount}}</text>
						<text>收益 ￥{{amount}}</text>
					</view>
				</view>
				<view v-if="expressTotal == 0" style="padding: 10px 15px; color: #999;">暂无运费明细</view>
				<view v-else class="item-list" v-for="(item, i) in expressList" :key="i">
					<view>
						<text>{{item.title}}</text>
						<text class="time">{{item.createTime}}</text>
					</view>
					<view class="num">+{{item.amount}}</view>
				</view>
			</view>
		</scroll-view>
		<view class="share-img" @click="goSharePoster">
			<button>生成我的分享海报</button>
		</view>
		<!-- 我邀请企业 -->
		<view v-if="isCompany">
			<view class="v-model" @click="isCompany=false;isRadarImg=false"></view>
			<view class="company-con">
				<view class="title">我邀请的企业<text @click="isCompany=false;isRadarImg=false" class="iconfont icon-quxiao"></text></view>
				<view class="note">共有{{companyTotal}}家企业，{{profitCount}}家已为您产生收益</view>
				<view v-if="companyTotal==0" style="padding: 20px 10px;">暂无邀请的企业</view>
				<scroll-view v-else class="company-list" scroll-y="true" @scrolltolower="companyScroll">
					<view class="c-l-i" v-for="(com, j) in companyList" :key="j">
						<text class="name">{{com.companyName}}</text>
						<text class="time">{{com.startDate}} -- {{com.endDate}}</text>
						<image v-if="com.isOver" src="../../static/images/ygq.png"></image>
					</view>
				</scroll-view>
				<button @click="goSharePoster">继续邀请企业</button>
			</view>
		</view>
		<view v-if="isActivityRules">
			<view class="v-model"></view>
			<view class="activity-rules">
				<view class="title">
					<image mode="widthFix" src="../../static/images/bgpng.png" />
					<text>活动规则</text>
				</view>
				<view class="con">
					<button>活动玩法</button>
					<text>1.点击页面“生成我的分享海报”按钮。</text>
					<text>2.长按海报保存到手机相册，发送到朋友圈或好友。</text>
					<text>3.企业代表扫码注册为企业用户并发货，开始收获奖励金。</text>
				</view>
				<button class="know-btn" @click="btndKnow">我知道了</button>
			</view>
		</view>
	</view>
</template>
<script>
import uCharts from '../../components/u-charts/u-charts.js';
var _self;
var canvasObj = {};
export default {
	data() {
		return {
			bountyInfo: [],
			expressList: [],
			limit: 5,
			expressPage: 1,
			expressTotalAmount: 0,
			expressTotal: 0,
			amount: 0,
			profitCount: 0,
			companyList: [],
			companyPage: 1,
			companyTotal: 0,
			isActivityRules: false,
			startYear: 2019,
			startDate: "",
			createTime: "",
			startArray: [],
			startIndex: [0, 0],
			isCompany: false,
			currentTime: "",
			profitLength: 0,
			radarImg: "",
			isRadarImg: false
		}
	},
	onLoad(){
		const that = this;
		this.showImage = getApp().globalData.isDiscountPopup;
		_self = this;
		const date = new Date();
		let _month = date.getMonth() + 1;
		var yearArr = [];
		for(var i = that.startYear; i <= date.getFullYear(); i++){
			yearArr.push(i+"年")
		}
		that.startArray[0] = yearArr;
		let len = (yearArr.length - 1);
		var start_m = that.$util.getMonth(yearArr[len]);
		that.startArray[1] = start_m;
		that.startIndex = [len, start_m.length - 1];
		that.startDate = date.getFullYear()+"年"+_month+"月";
		that.createTime = date.getFullYear()+"-"+_month;
		that.currentTime = date.getFullYear()+''+(_month>10?_month:"0"+_month);
		that.$util.networkRequest({
			url : "/Referral/GetInfo",
			success: function(res){
				res.amount = (res.amount).toFixed(2);
				res.totalAmount = (res.totalAmount).toFixed(2);
				res.monthAmount = (res.monthAmount).toFixed(2);
				that.bountyInfo = res;
				if(res.profitList == null) return false;
				that.profitLength = res.profitList.length;
				if(that.profitLength > 0){
					that.getServerData(res.profitList);
				}else{
					if(uni.getStorageSync('isActivityRules') != "true"){
						that.isActivityRules = true;
					}
				}
			}
		});
		that.getExpressList();
		that.getCompanyList();
	},
	methods: {
		//获取运费明细
		expressScroll: function(){
			if(Math.ceil(this.expressTotal / this.limit) >= this.expressPage){
				this.getExpressList();
			}
		},
		getExpressList: function(){
			const that = this;
			that.$util.networkRequest({
				url : "/Referral/GetExpressList",
				data: {
					page: that.expressPage,
					limit: that.limit,
					createTime: that.createTime
				},
				success: function(res){
					that.amount = (res.amount).toFixed(2);
					that.expressTotalAmount = (res.totalAmount).toFixed(2);
					let list = res.list;
					let total = list.total;
					that.expressTotal = total;
					if(total == 0 || list.list.length == 0) return false;
					list.list.filter(item => {
						item.amount = item.amount.toFixed(2);
					});
					that.expressPage ++;
					that.expressList = that.expressList.concat(list.list);
				}
			});
		},
		//获取公司
		companyScroll: function(){
			if(Math.ceil(this.companyTotal / this.limit) >= this.companyPage){
				this.getCompanyList();
			}
		},
		getCompanyList: function(){
			const that = this;
			that.$util.networkRequest({
				url : "/Referral/GetCompanyInfoByPhone",
				data: {
					page: that.companyPage,
					limit: that.limit
				},
				success: function(res){
					that.profitCount = res.profitCount;
					let list = res.pageInfo;
					let total = list.total;
					that.companyTotal = total;
					if(total == 0 || list.list.length == 0) return false;
					that.companyPage ++;
					that.companyList = that.companyList.concat(list.list);
				}
			});
		},
		//活动规则
		btndKnow: function(){
			uni.setStorage({key: 'isActivityRules', data: "true"});
			this.isActivityRules = false;
		},
		//分享海报
		goSharePoster: function(){
			this.isCompany = false;
			this.isRadarImg = false;
			uni.navigateTo({ url: "/pages/me/bountySharePoster" });
		},
		//柱状图
		showColumn(canvasId, chartData) {
			const that = this;
			
		},
		getServerData(profitList) {
			const that = this;
			let _monthArr = [];
			let _amountArr = [];
			profitList.forEach(function(item){
				let _m = item.totalMonth;
				let _arr = item.amount;
				if(that.currentTime == item.totalMonth){
					_m = "本月";
					_arr = {value: item.amount,color: "#fa414b,#F4B769"};
				}
				_monthArr.push(_m);
				_amountArr.push(_arr);
			})
			let chartData = {
				"categories": _monthArr,
				"series": [
					{"data": _amountArr}
				]
			}
			let cWidth = uni.upx2px(750);
			let cHeight = uni.upx2px(320);
			let canvaLineA = canvasObj["canvasColumn"] = new uCharts({
				$this: _self,
				canvasId: "canvasColumn",
				type: 'column',
				padding: [15,15,15,0],
				legend:{ show: false },
				fontSize: 12,
				animation: true,
				categories: chartData.categories,
				series: chartData.series,
				colors: ['#ff8b00,#FFFFFF'],
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					gridColor:'#EB784C',
					format:(val)=>{ return ""; }
				},
				width: cWidth,
				height: cHeight,
				extra: {
					column: {
						type: 'group',
						width: 15
					}
				}
			});
			canvaLineA.addEventListener('renderComplete', () => {//监控图表渲染完成
				uni.canvasToTempFilePath({//将图表转成图片
					x: 0,
					y: 0,
					width: cWidth,
					height: cHeight,
					fileType:'png',
					canvasId: 'canvasColumn',
					success: function(res) {
						if(uni.getStorageSync('isActivityRules') != "true"){
							that.isRadarImg = that.isActivityRules = true;
						}
						that.radarImg = res.tempFilePath;
					}
				});
			});
		},
		//时间
		startPickerChange: function(e){
			var index = e.detail.value;
			var y = this.startArray[0][index[0]].split("年")[0];
			var m = this.startArray[1][index[1]].split("月")[0];
			var _date = y+'年'+m+'月';
			this.startDate = _date;
			this.createTime = y+'-'+m;
			this.expressPage = 1;
			this.expressList = [];
			this.getExpressList();
		},
		startPickerColumn: function(e){
			let date = new Date();
			var _value = e.detail.value;
			this.startIndex[e.detail.column] = _value;
			switch (e.detail.column) {
				case 0: //拖动第1列
					this.startArray[1] = this.$util.getMonth(this.startArray[0][_value]);
					this.startIndex.splice(1, 1, 0)
					break;
			}
			this.$forceUpdate()
		},
	}
}
</script>
<style scoped>
/* #ifdef MP-WEIXIN */
.head-right{
	background: rgba(255, 255, 255, 0.2);
}
/* #endif */
.head-con{
	background-repeat: no-repeat;
	background-size: 100% auto;
	background-image: linear-gradient(26deg ,#fa414b, #fc6926, #fd8c05);
	color: #fff;
	padding: 30px 0 60px;
}
.head-con text{
	display: block;
	text-align: center;
	font-size: 12px;
}
.head-con text.money{
	font-size: 30px;
	margin: 0px 0 10px;
}
.head-con .btn-list{
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 30px;
}
.head-con .btn{
	display: block;
	border-radius: 50px;
	border: 1px solid #FFFFFF;
	padding-top: 10px;
	padding-bottom: 10px;
	text-align: center;
	color: #FA4548;
	width: 40%;
	background-color: #FFFFFF;
	font-size: 14px;
	line-height: 14px;
	margin: 0 10px;
}
.head-con .btn:first-child{
	color: #FFFFFF;
	background-color: transparent;
}
.scroll-box{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 60px;
	overflow-y: scroll;
}
.money-list{
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 4px #eee;
	margin: -35px 15px 10px;
	padding: 14px 0;
	border-radius: 6px;
}
.money-list > view{
	text-align: center;
	border-left: 1px solid #F0F0F0;
	width: 50%;
}
.money-list > view text{
	display: block;
	font-size: 15px;
}
.money-list > view text.num{
	color: #999;
	font-size: 12px;
}
.small-title{
	height: 40px;
	line-height: 40px;
	padding: 0 15px;
	border-top: 10px solid #F7F7F7;
	font-weight: bold;
}
.small-title > view{
	float: right;
	color: #999;
	font-weight: normal;
}
.small-title > view .iconfont{
	color: #999;
	font-size: 12px;
}
.bounty-list{
	padding-bottom: 10px;
	border-top: 10px solid #F7F7F7;
}
.bounty-list .date{
	background-color: #F7F7F7;
	display: flex;
	align-items: center;
	justify-content: space-between;
	/* height: 40px; */
	padding: 0 15px 10px;
}
.bounty-list .date .iconfont{
	font-size: 12px;
	padding-left: 2px;
}
.bounty-list .date .profit{
	color: #999999;
}
.bounty-list .date .profit text{
	margin-left: 14px;
}
.item-list{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 15px;
	border-bottom: 1px solid #eee;
}
.item-list text{
	display: block;
}
.item-list .time{
	font-size: 12px;
	color: #999;
}
.item-list .num{
	color: #FA4548;
}
.share-img{
	background-color: #FFFFFF;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 0 15px 15px;
}
.share-img button,
.company-con button{
	background-image: linear-gradient( #fd8c05, #fa414b);
	font-size: 16px;
	color: #FFFFFF;
	text-align: center;
	border-radius: 4px;
	line-height: 46px;
}
.company-con,
.activity-rules{
	-webkit-transform: translate3d(0, -50%, 0);
	transform: translate3d(0, -50%, 0);
	background-color: #fff;
	position: absolute;
	top: 50%;
	left: 20px;
	right: 20px;
	z-index: 1000;
	border-radius: 10px;
	padding: 0 10px 20px;
}
.company-con .title{
	font-size: 18px;
	text-align: center;
	margin-top: 15px;
}
.company-con .title .iconfont{
	position: absolute;
	top: 10px;
	right: 10px;
	font-size: 20px;
}
.company-con .note{
	text-align: center;
	font-size: 12px;
	color: #999999;
}
.company-con .company-list{
	height: 220px;
	overflow-y: auto;
	margin-bottom: 10px;
}
.company-con .company-list .c-l-i{
	position: relative;
	border-bottom: 1px solid #F7F7F7;
	margin: 0 15px;
	padding: 10px 0;
}
.company-con .name{
	display: block;
	font-size: 14px;
}
.company-con .time{
	display: block;
	color: #999999;
	font-size: 12px;
	padding-top: 3px;
}
.company-con image{
	position: absolute;
	right: 10px;
	top: 20px;
	width: 30px;
	height: 30px;
}
.activity-rules{
	padding: 0;
	left: 10%;
	right: 10%;
	height: 375px;
	border-radius: 12px;
	overflow: hidden;
}
.activity-rules .title{
	width: 100%;
	height: 120px;
	overflow: hidden;
	position: relative;
	text-align: center;
	font-size: 26px;
	line-height: 98px;
	color: #fff;
	letter-spacing: 4px;
	text-shadow: 0 4px 4px #e7501e;
	border-bottom-left-radius: 100%;
	border-bottom-right-radius: 100%;
	background: -webkit-linear-gradient(45deg,#fb652c  50%,#fea248);
}
.activity-rules .title image{
	width: 50%;
	position: absolute;
	top: -50%;
	left: 50%;
	-webkit-transform: translate3d(-50%, 0, 0);
	transform: translate3d(-50%, 0, 0);
}
.activity-rules .title text{
	display: block;
	position: absolute;
	width: 100%;
}
.activity-rules .con{
	position: absolute;
	margin: -34px 22px 0;
	background-color: #FFFFFF;
	padding: 20px 18px;
	border-radius: 12px;
	text-shadow: 0px 0px;
	-webkit-box-shadow: 0px 0px 4px 4px rgba(249,94,41,.1);
	box-shadow: 0px 0px 4px 4px rgba(249,94,41,.1);
}
.activity-rules .con button{
	width: 95px;
	padding: 0 15px;
	height: 36px;
	line-height: 36px;
	margin: 0;
	background-image: linear-gradient( #fd8c05, #fa414b);
	border-radius: 18px;
	color: #FFFFFF;
	font-size: 16px;
}
.activity-rules .con text{
	font-size: 12px;
	padding-top: 15px;
	text-align: justify;
	display: block;
}
.activity-rules .know-btn{
	position: absolute;
	left: 20px;
	right: 20px;
	bottom: 20px;
	background-image: linear-gradient( #fd8c05, #fa414b);
	font-size: 16px;
	color: #FFFFFF;
	text-align: center;
	border-radius: 30px;
	line-height: 40px;
}

.charts{
	width: 100%; 
	height: 320upx;
}
</style>
