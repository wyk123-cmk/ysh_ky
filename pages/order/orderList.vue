<style scoped>
	@import '../../common/css/order/orderList.css';
</style>
<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view class="search">
			<view class="label-input">
				<input type="text" placeholder="请输入姓名、电话、公司名称、单号" v-model="keyword" />
				<text class="iconfont icon-chaxun" @click="goKeyword"></text>
			</view>
			<button @click="btnMore">筛选</button>
		</view>
		<view class="tab-nav">
			<view v-bind:class="[tabIndex==1?'active':'']" @click="btnNavTab(1)"><text>我的寄件({{sentTotal}})</text></view>
			<view v-bind:class="[tabIndex==2?'active':'']" @click="btnNavTab(2)"><text>我的收件({{receiveTotal}})</text></view>
		</view>
		<!-- 我的寄件 -->
		<view v-if="tabIndex==1">
			<view v-if="sentList.length==0" class="none-data-list"><image src="../../static/images/none-jj.svg"></image>暂无内容</view>
			<scroll-view v-else class="tab-con" scroll-y="true" @scrolltolower="sentScroll">
				<view class="order-item-list" v-for="(item, index) in sentList" :key="index">
					<view class="number">
						<image src="../../static/images/qy.png" mode="aspectFit" class="qy_img" v-if="item.isCompany"></image>
						运单号：{{item.expressCode}}
						<text class="iconfont icon-copy" @click="setClip(item.expressCode)"></text>
					
					</view>
					<text class="detail" @click="goPage(1,item.mastCode)">详情</text>
					<view class="transport-o" @click="goPage(1,item.mastCode)">
						<view class="express" v-if="item.expressFrom!=null">
							<text class="city">{{item.expressFrom.areaInfo.city}}</text>
							<text>{{item.expressFrom.name}}</text>
						</view>
						<view class="express" v-else>暂无寄件地</view>
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
						<view class="express" v-else>暂无收件地</view>
					</view>
					<view class="txt-list">
						<view v-if="item.status=='4'">
							签收时间：{{item.finishedTime}}
						</view>
						<view v-bind:class="[item.status!='4'?'line':'']" v-if="item.businessUserName!=null&&item.businessUserName!=''">
							关联成员：{{item.businessUserName}}  {{item.businessUserPhone}}
						</view>
					</view>
					<view v-if="item.status=='1'" class="info">
						<view v-if="item.payType==2">到付</view>
						<view v-else>￥<text class="price">{{item.price}}</text></view>
						<view class="right_v">
								<text class="btn ljm" @click="codeBtn(item.mastCode)">揽件码</text>
								<text class="btn del" @click="goPage(2,item.mastCode)">取消</text>
						</view>
					
					</view>
					<view v-if="item.status=='2'&&item.payType==1" class="info">
						<view>￥<text class="price">{{item.price}}</text></view>
						<text class="btn">去付款</text>
					</view>
					<view v-if="item.status==9" class="info">
						<text></text>
						<text class="btn del" @click="removeOrder(item.mastCode)">删除</text>
					</view>
				</view>
				<text v-if="sentList.length == sentTotal" class="no-more">—— 我是有底线的 ——</text>
			</scroll-view>
		</view>
		<!-- 我的收件 -->
		<view v-if="tabIndex==2">
			<view v-if="receiveTotal==0" class="none-data-list"><image src="../../static/images/none-sj.svg"></image>暂无内容</view>
			<scroll-view v-else class="tab-con" scroll-y="true" @scrolltolower="receiveScroll">
				<view class="order-item-list" v-for="(item, index) in receiveList" :key="index">
					<view class="number" @click="setClip(item.expressCode)">运单号：{{item.expressCode}}<text class="iconfont icon-copy"></text></view>
					<text class="detail" @click="goPage(1,item.mastCode)">详情</text>
					<view class="transport-o" @click="goPage(1,item.mastCode)">
						<view class="express" v-if="item.expressFrom!=null">
							<text class="city">{{item.expressFrom.areaInfo.city}}</text>
							<text>{{item.expressFrom.name}}</text>
						</view>
						<view class="express" v-else>暂无寄件地</view>
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
						<view class="express" v-else>暂无收件地</view>
					</view>
					<view class="txt-list">
						<view v-if="item.status=='4'">
							签收时间：{{item.finishedTime}}
						</view>
						<view v-if="item.businessUserName!=null&&item.businessUserName!=''">
							关联成员：{{item.businessUserName}}  {{item.businessUserPhone}}
						</view>
					</view>
					<view v-if="item.status=='1'" class="info">
						<view v-if="item.payType==2">到付</view>
						<view v-else>￥<text class="price">{{item.price}}</text></view>
					</view>
					<view v-if="item.status=='2'&&item.payType==1" class="info">
						<view>￥<text class="price">{{item.price}}</text></view>
						<text class="btn">去付款</text>
					</view>
				</view>
				<text v-if="receiveList.length == receiveTotal" class="no-more">—— 我是有底线的 ——</text>
			</scroll-view>
		</view>
		<!-- 筛选 -->
		<view class="senior-search-popup" v-show="isMore">
			<view class="overlay" @click="isMore=false"></view>
			<view class="more-search">
				<view>
					<text class="name">寄件形式</text>
					<view class="search-type-list">
						<text :class="{ active: mode==1}" @click="clickMode(1)">个人</text>
						<text :class="{ active: mode==2}" @click="clickMode(2)">企业</text>
					</view>
				</view>
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
		<view v-show="isBarCode">
			<view class="v-model" style="opacity: 0.8;" @click="isBarCode=false"></view>
			<view class="bar-code">
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
			tabIndex: 1,
			isMore: false,
			statusData: [
				{txt: "待揽收", key: 1},
				{txt: "运输中", key: 3},
				{txt: "已签收", key: 4},
				{txt: "已取消", key: 9},
			],
			keyword: "",
			status: [], //运单状态
			mode: "", //寄件形式 1-个人;2-企业
			paymode: "", //付款方式 1-寄付;2-到付
			limit: 5,
			sentTotal: 0,
			receiveTotal: 0,
			sentPage: 1,
			receivePage: 1,
			sentList: [],
			receiveList: [],
			showImage: false,
			startYear: 2019,
			isPicker: 0,
			startDate: "",
			startArray: [],
			startIndex: [0, 0, 0],
			endDate: "",
			endArray: [],
			endIndex: [0, 0, 0],
			isBarCode: false,
			collect: {
				isCompany: false,
				expressCode: ""
			},
			canvasCode: ""
		}
	},
	onLoad(options) {
		let app = getApp();
		app.isToken();
		if(options.orderType == 1){
			this.tabIndex = 2;
		}
	},
	onShow(){
		let app = getApp();
		this.showImage = app.globalData.isDiscountPopup;
		this.keyword = "";
		this.sentPage = 1;
		this.receivePage = 1;
		this.sentList = [];
		this.receiveList = [];
		this.reset();
		this.getExpressTotal();
		if(this.$store.state.orderType == undefined || this.$store.state.orderType == ''){
		}else{
			this.tabIndex = this.$store.state.orderType;
			this.$store.state.orderType = "";
		}
	},
	onHide(){
		this.$store.state.orderType = 1;
	},
	created(){
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
		getExpressTotal: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/Express/GetExpressTotal",
				success: function(res){
					that.sentTotal = res.sendCount;
					that.receiveTotal = res.receiveCount;
					that.getSearch();
				}
			});
		},
		longSave(){
		
				var that=this;
			
				var Array=[];
				Array.push(that.barcodeImg)
				that.$util.longSave(Array)
			
			
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
		btnMore: function(){
			this.isMore = !this.isMore;
		},
		btnNavTab: function(key){
			if(this.tabIndex!=key){
				this.tabIndex = key;
				if(key == 1 && this.sentList.length == 0){
					this.getSearch();
				}
				if(key == 2 && this.receiveList.length == 0){
					this.getSearch();
				}
			}
		},
		//寄件上拉加载
		sentScroll: function(e) {
			if(Math.ceil(this.sentTotal / this.limit) >= this.sentPage){
				this.getSearch();
			}
		},
		//收件上拉加载
		receiveScroll: function(e) {
			if(Math.ceil(this.sentTotal / this.limit) >= this.receivePage){
				this.getSearch();
			}
		},
		//关键字
		goKeyword: function(){
			this.confirm();
		},
		//重置
		reset: function(){
			this.mode = "";
			this.status = [];
			this.paymode = "";
			this.startDate = "";
			this.endDate = "";
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
			this.sentPage = 1;
			this.receivePage = 1;
			this.sentList = [];
			this.receiveList = [];
			this.getSearch();
		},
		getSearch: function(){
			let that = this;
			let _type = 1; 
			let _page = 1; 
			if(that.tabIndex == 1){
				_type = "Sent";
				_page = that.sentPage;
			}
			else{
				_type = "Receive";
				_page = that.receivePage;
			}
			let _status = that.status.length == 0?null:that.status;
			uni.showLoading({ title: '加载中...' });
			let param = {
				limit: that.limit,
				page: _page,
				expressType: _type,
				keyword: that.keyword,
				mode: that.mode,
				status: _status,
				paymode: that.paymode,
				startTime: that.startDate,
				endTime: that.endDate,
			}
			that.isMore = false;
			that.$util.networkRequest({
				url: "/Express/Search",
				method: "POST",
				data: param,
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					res.list.filter(item => {
						if(item.finishedTime != null && item.finishedTime != ""){
							item.finishedTime = that.$util.formatDate.format(item.finishedTime,"yyyy-MM-dd hh:mm");
						}
					});
					if(_type == "Sent"){
						if(_page==1){
							//条形码引导
							if(uni.getStorageSync("barCode") != "true"){
								that.collect = {isCompany: res.list[0].isCompany,expressCode: res.list[0].expressCode};
							}
						}
						that.sentPage++;
						that.sentList = that.sentList.concat(res.list);
					}
					if(_type == "Receive"){
						that.receivePage++;
						that.receiveList = that.receiveList.concat(res.list);
					}
				}
			});
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
		//运输状态
		clickStatus: function(key){
			if(this.status.indexOf(key) == -1){
				this.status.push(key)
			}else{
				this.status = this.status.filter(item => item != key);
			}
		},
		//复制
		setClip: function(val){
			let that = this;
			uni.setClipboardData({ data: val, success: () => {
				uni.showToast({ title: "内容已复制", icon: 'success' });
			}});
		},
		//条形码
		codeBtn: function(code){
			let that = this;
			// that.isBarCode = true;
			that.$util.networkRequest({
				url: "/Express/GetExpressBarCodeFile",
				data: {
					mastCode:code,
				},
				success: function(res){
					console.log(res);
					that.barcodeImg=res;
					that.longSave();
				}
			})
		},
		//删除
		removeOrder: function(code){
			const that = this;
			uni.showModal({
			    title: '提示',
			    content: '确定要删除此单吗？',
			    success: function (res) {
			        if (res.confirm) {
						that.$util.networkRequest({
							url: "/Express/DeleteExpress",
							data: {mastCode:code,reason:""},
							method: "POST",
							success: function(res){
								if(that.tabIndex == 1 ){
									that.sentTotal--;
									that.sentList = that.sentList.filter(item => {
										return item.mastCode != code;
									});
								}else{
									that.receiveTotal--;
									that.receiveList = that.receiveList.filter(item => {
										return item.mastCode != code;
									});
								}
							}
						});
			        }
			    }
			});
		},
		goPage: function(key, code){
			let type = this.tabIndex == 1 ? "Sent" : "Receive";
			if(key == 1){
				uni.navigateTo({ url: '/pages/order/orderDetail?mastCode='+code+'&type='+type });
			}
			else if(key == 2){
				uni.navigateTo({ url: '/pages/order/cancel?mastCode='+code });
			}
		}
	}
}
</script>
