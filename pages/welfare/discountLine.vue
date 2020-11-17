<template>
<view>
	<page-imges :show="showImage"></page-imges>
	<view class="bg"></view>
	<view class="main">
		<view class="search-box">
			<view>
				<address-picker @change="sendPickerChange" state="2" :disabled="false" class="address">
					<text class="s-t">{{sendValue==""?"始发地":sendValue}}</text>
				</address-picker>
			</view>
			<view>
				<address-picker @change="receivePickerChange" state="2" :disabled="false" class="address">
					<text class="s-t">{{receiveValue==""?"目的地":receiveValue}}</text>
				</address-picker>
			</view>
			<view>
				<picker @change="expressCompanyPickerChange" :value="expressCompany.index" :range="expressCompany.range">
					<text class="s-t">{{expressCompany.range[expressCompany.index]}}</text>
				</picker>
			</view>
		</view>
		<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
		<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view style="background-color: #FFFFFF;margin: 0 15px;border-radius: 8px;">
			<view class="item-list" v-for="(item, i) in dataList" :key="i" @click="goPage">
				<view class="left-box">
					<view class="province">
						<image v-if="item.companyCode == 'sf001'" mode="widthFix" src="../../static/images/sf.png"></image>
						<image v-if="item.companyCode == 'ky001'" mode="widthFix" src="../../static/images/kye.png"></image>
						<image v-if="item.companyCode == 'db001'" mode="widthFix" src="../../static/images/db.png"></image>
						<view class="txt" :style="screenWidth<=320?'font-size: 12px':''">
							<text>{{item.fromProvince}}</text>
							<text>{{item.fromCity}}</text>
						</view>
						<text class="line"></text>
						<view class="txt" :style="screenWidth<=320?'font-size: 12px':''">
							<text>{{item.toProvince}}</text>
							<text>{{item.toCity}}</text>
						</view>
					</view>
					<view class="info" :style="screenWidth<=320?'font-size: 12px':''">
						<text>特价产品: {{item.productName}}</text>
						<text>活动时间: {{item.startTime}} - {{item.endTime}}</text>
					</view>
				</view>
				<view class="right-box">
					<text class="icon">SALE</text>
					<view class="zhe">
						<text>{{item.discount*10}}</text>折
					</view>
					<text class="btn">立即下单</text>
				</view>
			</view>
			<text v-if="dataList.length == total" style="display: block;text-align: center;color: #999999;padding: 10px 0;">—— 我是有底线的 ——</text>
			</view>
		</scroll-view>
	</view>
	<view class="reset" @click="reset"></view>
</view>
</template>
<script>
import addressPicker from "../../components/address-picker/address-picker.vue"
export default {
	components: {
		addressPicker
	},
	data() {
		return {
			sendValue: "",
			receiveValue: "",
			expressCompany: {
				list: [],
				range: [],
				index: 0,
				code: "",
				path: ""
			},
			page: 1,
			limit: 5,
			total: 10,
			dataList: [],
			screenWidth: 0
		}
	},
	onLoad(){
		this.page = 1;
		this.total = 0;
		this.dataList = [];
		this.getExpressCompany();
		this.screenWidth = uni.getSystemInfoSync().screenWidth;
		this.showImage = getApp().globalData.isDiscountPopup;
	},
	methods: {
		sendPickerChange(e) {
			let val = e.detail.value[0]+'-'+e.detail.value[1];
			if(val == this.sendValue) return false;
			this.sendValue = val;
			this.page = 1;
			this.total = 0;
			this.dataList = [];
			this.getList();
		},
		receivePickerChange(e) {
			let val = e.detail.value[0]+'-'+e.detail.value[1];
			if(val == this.receiveValue) return false;
			this.receiveValue = val;
			this.page = 1;
			this.total = 0;
			this.dataList = [];
			this.getList();
		},
		//物流公司
		expressCompanyPickerChange(e) {
			let index = e.detail.value;
			let _code = "";
			if (index != 0) {
				_code = this.expressCompany.list[index - 1].companyCode;
			}
			this.expressCompany.index = index;
			if(_code == this.expressCompany.code) return false;
			this.expressCompany.code = _code;
			this.page = 1;
			this.total = 0;
			this.dataList = [];
			this.getList();
		},
		scrolltolower:  function() {
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getList();
			}
		},
		getList: function(){
			const that = this;
			let s_p = "", s_c = "";
			let r_p = "", r_c = "";
			if(that.sendValue != ""){
				var _str = (that.sendValue).split("-");
				s_p = _str[0];
				s_c = _str[1];
			}
			if(that.receiveValue != ""){
				var _str = (that.receiveValue).split("-");
				r_p = _str[0];
				r_c = _str[1];
			}
			let param = {
				page: that.page,
				limit: that.limit,
				companyCode: that.expressCompany.code,
				fromProvince: s_p,
				fromCity: s_c,
				toProvince: r_p,
				toCity: r_c
			}
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/Activity/SearchLine",
				method: "POST",
				data: param,
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					(res.list).forEach(item => {
						let _s = (item.startTime);
						item.startTime = (item.startTime).replace(/-/g,'.');
						item.endTime = (item.endTime).replace(/-/g,'.');
					})
					that.page++;
					that.total = total;
					that.dataList = that.dataList.concat(res.list);
				}
			})
		},
		//获取物流公司
		getExpressCompany() {
			const that = this;
			this.$util.networkRequest({
				url: "/Activity/GetSpecialCompany",
				success: function(res) {
					that.expressCompany.list = res;
					res.forEach((c, i) => {
						that.expressCompany.range.push(c.companyName);
					});
					that.expressCompany.code = res[0].companyCode;
					that.getList();
				}
			})
		},
		reset: function(){
			this.page = 1;
			this.total = 0;
			this.dataList = [];
			this.sendValue = "";
			this.receiveValue = "";
			this.expressCompany = {
				list: [],
				range: [],
				index: 0,
				code: "",
				path: ""
			};
			page: 1,
			this.getExpressCompany();
		},
		goPage: function(){
			uni.navigateTo({
				url: "/pages/index/expressDelivery?type=big&companyCode="+this.expressCompany.code
			})
		}
	}
}
</script>
<style scoped>
.bg{
	background: linear-gradient(135deg,#4486f3,#4486f3);
	height: 120px;
	border-bottom-left-radius: 50%;
	border-bottom-right-radius: 50%;
	width: 110%;
	margin: -1px -5% 0;
	overflow-x: hidden;
}
.main{
	position: absolute;
	left: 0;
	right: 0;
	top: 20px;
	bottom: 0;
}
.search-box{
	display: box;
	display: -webkit-box;
	padding: 0 10px;
}
.search-box > view{
	background-color: rgba(0,0,0,0.3);
	padding: 6px 0;
	margin: 0 5px;
	text-align: center;
	border-radius: 20px;
	width: calc((100% - 130px) / 2);
}
.search-box > view:last-child{
	width: 100px;
}
.search-box .s-t{
	color: #FFFFFF;
	line-height: 22px;
	display: block;
	padding: 0 5px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.scroll-wrapper{
	position: absolute;
	top: 50px;
	left: 0;
	right: 0;
	bottom: 0;
}
.item-list{
	background-color: #FFFFFF;
	display: flex;
	height: 130px;
	margin-bottom: 15px;
	border-radius: 8px;
	box-shadow: 0px 2px 5px #e6e6e6;
	overflow: hidden;
}
.item-list .left-box{
	width: calc(100% - 110px);
	background-image: url(../../static/images/icon-bg.png);
	background-repeat: repeat-y;
	background-position-x: right;
	background-size: 15px;
	padding: 0 10px;
	position: relative;
}
.item-list .left-box .province{
	display: flex;
	align-items: center;
	margin-top: 15px;
	min-height: 40px;
	margin-bottom: 20px;
}
.item-list .left-box .province image{
	width: 25px;
	height: 25px;
	margin-right: 5px;
}
.item-list .left-box .province .txt{
	width: calc((100% - 70px) / 2);
}
.item-list .left-box .province .txt text{
	display: block;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	text-align: center;
}

.item-list .left-box .province .line{
	display: block;
	width: 20px;
	height: 1px;
	background-color: #999999;
	margin-left: 3px;
	margin-right: 5px;
}
.item-list .left-box .info{
	/* position: absolute;
	bottom: 10px; */
}
.item-list .left-box .info text{
	color: #999999;
	margin-bottom: 5px;
	display: block;
}
.item-list .right-box{
	width: 90px;
	background-color: #ff8c04;
	position: relative;
}
.item-list .right-box .icon{
	margin-top: 50px;
	text-align: center;
	color: #ff9a39;
	font-size: 38px;
	display: block;
	transform: rotate(-45deg);
	-moz-transform:rotate(-45deg);
	-webkit-transform:rotate(-45deg);
}
.item-list .right-box .zhe{
	color: #FFFFFF;
	text-align: center;
	position: absolute;
	top: 15%;
	left: 0;
	right: 0;
}
.item-list .right-box .zhe text{
	font-size: 48px;
}
.item-list .right-box .btn{
	color: #ff9a39;
	background-color: #FFFFFF;
	padding: 4px 0;
	border-radius: 3px;
	position: absolute;
	bottom: 16px;
	left: 12px;
	right: 12px;
	text-align: center;
	/* font-size: 12px; */
}
.reset{
	position: fixed;
	right: 15px;
	bottom: 80px;
	width: 50px;
	height: 50px;
	background-image: url(../../static/images/reset.png);
	background-size: 100%;
	background-repeat: no-repeat;
}
</style>
