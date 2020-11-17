<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="search">
			<view class="label-input">
				<input type="text" placeholder="请输入姓名 、电话 、单号" v-model="keyword" />
				<text class="iconfont icon-chaxun" @click="clickSearch"></text>
			</view>
			<button @click="btnMore" class="btn_sx">筛选</button>
		</view>
		<view v-if="total==0" class="none-data-list">
			<image src="../../static/images/none.svg"></image>暂无内容
		</view>
		<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="item-list" v-for="(item, index) in dataList" :key="index">
				<view class="con-top">
					<text class="create-user">{{item.createUser}}</text>
					<view class="code" @click="setClip(item.expressCode)">运单号：{{item.expressCode}}<text class="iconfont icon-copy"></text></view>
					<!-- <text class="detail" @click="goPage(1,item.mastCode)">详情</text> -->
				</view>
				<view class="transport-o" @click="goPage(1,item.mastCode)">
					<view class="express" v-if="item.expressFrom!=null">
						<text class="city">{{item.expressFrom.areaInfo.city}}</text>
						<text>{{item.expressFrom.name}}</text>
					</view>
					<view class="status">
						<image mode="widthFix" src="../../static/images/cjt.svg"></image>
						<text v-if="item.status=='9'" style="color:green">{{item.statusText}}</text>
						<text v-else-if="item.status=='3'" style="color:#E47800">{{item.statusText}}</text>
						<text v-else-if="item.status=='4'" style="color:#4285f4">{{item.statusText}}</text>
						<text v-else-if="item.status=='-1'||item.status=='1'" style="color:#999999">{{item.statusText}}</text>
						<text v-else>{{item.statusText}}</text>
					</view>
					<view class="express" v-if="item.expressTo!=null">
						<text class="city">{{item.expressTo.areaInfo.city}}</text>
						<text>{{item.expressTo.name}}</text>
					</view>
					<view class="express" v-else>暂无寄件地</view>
				</view>
				<view class="info" v-if="item.isMine && item.status==1">
					￥<text class="price">{{item.price}}</text>
					<text class="btn" @click="goPage(2,item.mastCode)">取消</text>
				</view>
				<view class="cancel-text" v-if="item.status==9">已取消</view>

			</view>
		</scroll-view>
		<!-- 筛选 -->
		<view class="senior-search-popup" v-show="isMore">
			<view class="overlay" @click="isMore=false"></view>
			<view class="more-search">
				<view>
					<text class="name">运输状态</text>
					<view class="search-type-list">
						<text v-for="(item, i) in statusData" :key="i" :class="{ active: status.indexOf(item.key) != -1 }" @click="clickStatus(item.key)">{{item.txt}}</text>
					</view>
				</view>
				<view>
					<text class="name">付款方式</text>
					<view class="search-type-list">
						<text :class="{ active: paymode==1}" @click="clickPaymode(1)">寄付</text>
						<text :class="{ active: paymode==2}" @click="clickPaymode(2)">到付</text>
					</view>
				</view>
				<view>
					<text class="name">订单时间</text>
					<view class="search-type-list">
						<picker class="picker" @click="isPicker=0" v-bind:class="[isPicker==0?'active':'']" mode="multiSelector" :range="startArray" :value="startIndex" @change="startPickerChange" @columnchange="startPickerColumn">
							{{startDate==""?"开始时间":startDate}}
						</picker>
						至
						<picker class="picker" @click="isPicker=1" v-bind:class="[isPicker==1?'active':'']" mode="multiSelector" :range="endArray" :value="endIndex" @change="endPickChange" @columnchange="endPickerColumn">
							{{endDate==""?"结束时间":endDate}}
						</picker>
					</view>
				</view>
				<view class="search-type-list btn">
					<button @click="reset">重置</button>
					<button @click="confirm">确认</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				page: 1,
				limit: 10,
				total: 0,
				keyword: "",
				isMore:false,
				statusData: [
					{txt: "待揽收", key: 1},
					{txt: "运输中", key: 3},
					{txt: "已签收", key: 4},
					{txt: "已取消", key: 9},
				],
				status: [], //运单状态
				mode: "", //寄件形式 1-个人;2-企业
				paymode: "", //付款方式 1-寄付;2-到付
				startYear: 2019,
				isPicker: 0,
				startDate: "",
				startArray: [],
				startIndex: [0, 0, 0],
				endDate: "",
				endArray: [],
				endIndex: [0, 0, 0],
				dataList: []
			}
		},
		onShow() {
			this.showImage = getApp().globalData.isDiscountPopup;
			this.keyword = "";
			this.clickSearch();
		},
		created() {
			const date = new Date();
			var yearArr = [];
			for(var i = this.startYear; i <= date.getFullYear(); i++){
				yearArr.push(i+"年")
			}
			let year_index = (yearArr.length - 1);
			let set_month = this.$util.getMonth(yearArr[year_index]);
			let month_index = (set_month.length - 1);
			let set_days = this.$util.getDays(yearArr[year_index], set_month[(month_index)])
			let days_index = (set_days.length - 1);
			//开始时间
			this.startArray[0] = yearArr;
			this.startArray[1] = set_month;
			this.startArray[2] = set_days;
			//结束时间
			this.endArray[0] = yearArr;
			this.endArray[1] = set_month;
			this.endArray[2] = set_days;
			//默认显示当前年-月-日
			this.startIndex = [year_index, month_index, days_index];
			this.endIndex = [year_index, month_index, days_index];
		},
		methods: {
			clickSearch: function() {
				this.page = 1;
				this.dataList = [];
				this.getList()
			},
			btnMore: function(){
				this.isMore = !this.isMore;
			},
			//重置
			reset: function(){
				this.mode = "";
				this.status = [];
				this.paymode = "";
				this.startDate = "";
				this.endDate = "";
			},
			//运输状态
			clickStatus: function(key){
				if(this.status.indexOf(key) == -1){
					this.status.push(key)
				}else{
					this.status = this.status.filter(item => item != key);
				}
			},
			//寄件形式
			clickMode: function(key){
				if(key == this.mode){
					this.mode = "";
				}else{
					this.mode = key;
				}
			},
			//付款方式
			clickPaymode: function(key){
				if(key == this.paymode){
					this.paymode = "";
				}else{
					this.paymode = key;
				}
			},
			//开始时间
			startPickerChange: function(e){
				var index = e.detail.value;
				var y = this.startArray[0][index[0]].split("年")[0];
				var m = this.startArray[1][index[1]].split("月")[0];
				var d = this.startArray[2][index[2]].split("日")[0];
				var _date = y+'-'+m+'-'+d;
				if(_date == this.endDate){
					this.$util.showToast("开始时间与结束时间不能一致");
					return false;
				}
				this.startDate = _date;
			},
			startPickerColumn: function(e){
				let date = new Date();
				var _value = e.detail.value;
				this.startIndex[e.detail.column] = _value;
				switch (e.detail.column) {
					case 0: //拖动第1列
						this.startArray[1] = this.$util.getMonth(this.startArray[0][_value]);
						this.startArray[2] = this.$util.getDays(this.startArray[0][_value],this.startArray[1][0]);
						this.startIndex.splice(1, 1, 0)
						this.startIndex.splice(2, 1, 0)
						break;
					case 1: //拖动第2列
						this.startArray[2] = this.$util.getDays(this.startArray[0][this.startIndex[0]], this.startArray[1][_value]);
						this.startIndex.splice(2, 1, 0)
						break;
				}
				this.$forceUpdate()
			},
			//结束时间
			endPickChange: function(e){
				var index = e.detail.value;
				var y = this.endArray[0][index[0]].split("年")[0];
				var m = this.endArray[1][index[1]].split("月")[0];
				var d = this.endArray[2][index[2]].split("日")[0];
				var _date = y+'-'+m+'-'+d;
				if(_date == this.startDate){
					this.$util.showToast("开始时间与结束时间不能一致");
					return false;
				}
				this.endDate = _date;
			},
			//确认
			confirm: function(){
				if(this.startDate!=""){
					if(this.endDate == ""){
						this.$util.showToast("结束日期不能为空");
						return false;
					}else if(new Date(this.startDate) >= new Date(this.endDate)){
						this.$util.showToast("结束日期不能小于开始日期");
						return false;
					}
				}
				this.page = 1;
				this.dataList = [];
				this.getList();
			},
			endPickerColumn: function(e){
				let date = new Date();
				var _value = e.detail.value;
				this.endIndex[e.detail.column] = _value;
				switch (e.detail.column) {
					case 0: //拖动第1列
						this.endArray[1] = this.$util.getMonth(this.endArray[0][_value]);
						this.endArray[2] = this.$util.getDays(this.endArray[0][_value],this.endArray[1][0]);
						this.endIndex.splice(1, 1, 0)
						this.endIndex.splice(2, 1, 0)
						break;
					case 1: //拖动第2列
						this.endArray[2] = this.$util.getDays(this.endArray[0][this.endIndex[0]], this.endArray[1][_value]);
						this.endIndex.splice(2, 1, 0)
						break;
				}
				this.$forceUpdate()
			},
			scrolltolower: function() {
				if (Math.ceil(this.total / this.limit) >= this.page) {
					this.getList();
				}
			},
			goPage: function(key, code) {
				if (key == 1) {
					uni.navigateTo({
						url: '/pages/order/orderDetail?mastCode=' + code
					});
				} else if (key == 2) {
					uni.navigateTo({
						url: '/pages/order/cancel?mastCode=' + code
					});
				}
			},
			//复制
			setClip: function(val) {
				let that = this;
				uni.setClipboardData({
					data: val,
					success: () => {
						uni.showToast({
							title: "内容已复制",
							icon: 'success'
						});
					}
				});
			},
			getList: function() {
				const that = this;
				let _status = that.status.length == 0?null:that.status;
				uni.showLoading({
					title: '加载中...'
				});
				that.isMore=false;
				that.$util.networkRequest({
					url: "/Company/GetExpressList",
					method: "POST",
					data: {
						page: that.page,
						limit: that.limit,
						keyword: that.keyword,
						status: _status,
						paymode: that.paymode,
						startTime: that.startDate,
						endTime: that.endDate,
					},
					success: function(res) {
						let total = res.total;
						that.total = total;
						if (total == 0 || res.list.length == 0) return false;
						that.page++;
						that.dataList = that.dataList.concat(res.list);
						that.isMore = false;
					}
				})
			}
		}
	}
</script>
<style scoped>
	.search {
		border-top: 1px solid #F7F7F7;
		background-color: #FFFFFF;
		display: flex;
		/* display: -webkit-box; */
		padding: 10px 15px;
		line-height: 34px;
	}
	.label-input{
		display: flex;
		    width: 87%;
	}
.btn_sx{
	width: 50px;
	    padding: 0px;
	    margin: 0px;
	    margin-left: 10px;
	height:34px;
}
	.search input {
		height: 34px;
		line-height: 34px;
		padding: 0 8px;
		background-color: #F7F7F7;
		width: 90%;
		border-top-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}

	.transport-o {
		display: flex;
		width: 100%;
	}

	.search text {
		display: block;
		width: 30px;
		background-color: #F7F7F7;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		height:34px;
	}

	.scroll-wrapper {
		position: absolute;
		top: 55px;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #F7F7F7;
	}

	.item-list {
		background-color: #FFFFFF;
		padding: 15px 15px 0;
		margin-top: 8px;
	}

	.item-list .con-top {
		height: 20px;
		line-height: 20px;
	}

	.item-list .con-top .create-user {
		font-weight: bold;
		padding-right: 10px;
		float: left;
	}

	.item-list .con-top .code {
		float: left;
		font-size: 12px;
		color: #999999;
		display: flex;
		display: -webkit-flex;
		align-items: center;
	}

	.item-list .con-top .icon-copy {
		margin-left: 2px;
	}

	.item-list .con-top .detail {
		float: right;
	}

	.item-list .info,
	.item-list .cancel-text {
		padding-bottom: 15px;
	}

	.item-list .info .price {
		color: #FF0000;
		font-size: 20px;
	}

	.item-list .info .btn {
		float: right;

		background-color: #FF0000;
		color: #FFFFFF;
		padding: 4px 12px;
		border-radius: 6px;
	}

	.item-list .cancel-text {
		color: #999999;
		text-align: right;
	}
	.senior-search-popup{
		position: fixed;
		top: 50px;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
	}
	.senior-search-popup .overlay{
		position: absolute;
		top:0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.6);
	}
	.senior-search-popup .more-search{
		position: absolute;
		top:0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding-left: 15px;
	}
	.senior-search-popup .more-search .name{
		font-size: 15px;
		display: block;
		margin-top: 10px;
	}
	.senior-search-popup .more-search .search-type-list{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		margin: 10px 0 15px;
		line-height: 34px;
		text-align: center;
		color: #999;
	}
	.senior-search-popup .more-search .search-type-list text,
	.senior-search-popup .more-search .search-type-list .picker{
		width: 100%;
		height: 34px;
		background: #f7f7f7;
		border-radius: 4px;
		overflow: hidden;
		margin-right: 15px;
		color: #333;
	}
	.senior-search-popup .more-search .search-type-list .picker:first-child{
		margin-right: 10px;
	}
	.senior-search-popup .more-search .search-type-list .picker+.picker{
		margin-left: 10px;
	}
	
	.senior-search-popup .more-search .search-type-list text.active{
		background-color: #d6ebff;
		background-image: url(../../static/images/icon-active.png);
		background-repeat: no-repeat;
		background-size: 18px;
		background-position: bottom right;
	}
	.senior-search-popup .more-search .search-type-list .picker.active{
		border-bottom: 1px solid #0f84f3;
	}
	.senior-search-popup .more-search .search-type-list.btn{
		margin: 0;
		margin-left: -15px;
	}
	.senior-search-popup .more-search .search-type-list.btn button{
		width: 50%;
		height: 50px;
		line-height: 50px;
		padding: 0;
		background: #d6ebff;
		color: #0f84f3;
		border-radius: 0;
	}
	.senior-search-popup .more-search .search-type-list.btn button:last-child{
		background: #0f84f3;
		color: #fff;
	}
</style>
