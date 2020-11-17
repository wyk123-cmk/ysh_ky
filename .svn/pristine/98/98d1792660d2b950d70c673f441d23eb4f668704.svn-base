<style scoped>
	@import '../../common/css/order/orderDetail.css';
</style>
<template>
<view>
	<page-imges :show="showImage"></page-imges>
	<view v-show="!isPrint">
		<view class="head-right printBtn" v-if="isPrintBtn" @click="printing">打印</view>
		<view class="order-num">
			<view class="num" v-if="detailData.status==1&&detailData.expressCode==''" style="color: #fd9523;">确认中</view>
			<view class="num" v-else>
				运单号: {{detailData.expressCode}}
				<text class="iconfont icon-copy" @click="setClip(detailData.expressCode)"></text>
			<image src="../../static/images/ljm.jpg"  class="img_ljm" @click.stop="codeBtn(detailData.mastCode)"></image>
			</view>
			<view class="city">
				<text>{{fromCity}}</text>
				<view class="status">
					<text v-if="detailData.status=='9'" style="color:green">{{detailData.statusText}}</text>
					<text v-else-if="detailData.status=='3'" style="color:#E47800">{{detailData.statusText}}</text>
					<text v-else-if="detailData.status=='4'" style="color:#4285f4">{{detailData.statusText}}</text>
					<text v-else-if="detailData.status=='-1'||detailData.status=='1'" style="color:#999999">{{detailData.statusText}}</text>
					<text v-else>{{detailData.statusText}}</text>
					<image mode="widthFix" src="../../static/images/cjt.svg"></image>
				</view>
				<text>{{toCity}}</text>
			</view>
			<view class="relation" v-if="detailData.businessUserName!=null&&detailData.businessUserName!=''">关联成员: {{detailData.businessUserName}} {{detailData.businessUserPhone}}</view>
			<view class="arrive-time" v-if="detailData.status!='9'&&detailData.estimateSendTime!=''">
				预计到达时间<text>{{detailData.estimateSendTime}}</text>
			</view>
		</view>
		<view class="logistics">
			<text class="title">物流轨迹</text>
			<view class="none" v-if="total==0">暂无物流信息！</view>
			<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
				<view class="item-list" v-for="(item, i) in logisticsList" :key="i">
					<text class="status">{{i==0?"正在派送":"运送中"}}</text>
					<view class="info">
						<image v-if="i==0" src="../../static/images/yuandian1.png"></image>
						<image v-else src="../../static/images/yuandian.png"></image>
						<view>
							<text class="time" :style="i==0?'color: #fd5a6f;':''">{{item.routeTime}}</text>
							{{item.routeInfo}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="user-info">
			<view>
				<view class="user">
					<text class="iconfont icon-ji1"></text>
					<text class="name">{{fromName}}</text>
					<text @click="phoneCall(fromPhone)">{{fromPhone}}</text>
				</view>
				<view class="company-name" v-if="fromCompanyName!=''">{{fromCompanyName}}</view>
				<view class="address">{{fromAddress}}</view>
			</view>
			<view>
				<view class="user">
					<text class="iconfont icon-shou"></text>
					<text class="name">{{toName}}</text>
					<text @click="phoneCall(toPhone)">{{toPhone}}</text>
				</view>
				<view class="company-name" v-if="toCompanyName!=''">{{toCompanyName}}</view>
				<view class="address">{{toAddress}}</view>
			</view>
		</view>
		<view class="order-detail">
			<view class="label">
				<text class="s-t">物品名称:</text>
				<view class="txt">{{goodName}}</view>
			</view>
			<view class="label" v-if="detailData.payType==1&&detailData.status!=9">
				<text class="s-t">实际运费:</text>
				<view class="txt orange">
					￥{{expressPrice}}
					<text class="market" v-if="marketExpressPrice!=expressPrice">￥{{marketExpressPrice}}</text>
				</view>
			</view>
			<view class="label">
				<text class="s-t">物品类型:</text>
				<view class="txt">{{goodType}}</view>
			</view>
			<view class="label" v-if="insuranceAmount!=null&&insuranceAmount!=''&&detailData.payType==1&&detailData.status!=9">
				<text class="s-t">保价费用:</text>
				<view class="txt orange">￥{{insuranceAmount}}</view>
			</view>
			<view class="label">
				<text class="s-t">寄件数量:</text>
				<view class="txt">{{goodCount}} 件</view>
			</view>
			<view class="label" v-for="(item, index) in detailData.priceDetail" :key="index" v-show="item.amount!==0&&detailData.payType==1&&detailData.status!=9">
				<text class="s-t">{{item.charges}}:</text>
				<view class="txt orange">￥{{item.amount.toFixed(2)}}</view>
			</view>
			<view class="label" v-if="detailData.subsidyAmount>0&&detailData.payType==1&&detailData.status!=9">
				<text class="s-t">抵扣金额:</text>
				<view class="txt orange">-￥{{detailData.subsidyAmount}}</view>
			</view>
			<view class="label" v-if="detailData.couponAmount>0&&detailData.payType==1&&detailData.status!=9">
				<text class="s-t">支付优惠:</text>
				<view class="txt orange">-￥{{detailData.couponAmount}}</view>
			</view>
			<view class="label" v-if="detailData.payType==1&&detailData.status!=9">
				<text class="s-t">{{detailData.status==1||detailData.status==2?"预估价格":"实付款"}}:</text>
				<view class="txt orange">￥{{samount}}<text style="color: #999999;">（含保费）</text></view>
			</view>
			<view class="label" v-if="detailData.status==1||detailData.status==2">
				<text class="s-t">预估重量:</text>
				<view class="txt">{{weigth}} kg</view>
			</view>
			<view class="label" v-else>
				<text class="s-t">实际重量:</text>
				<view class="txt">{{Sweigth}} kg</view>
			</view>
			<view class="label">
				<text class="s-t">险种:</text>
				<view class="txt">{{detailData.insuranceCompanyName=="" || detailData.insuranceCompanyName==null?"--":detailData.insuranceCompanyName}}</view>
			</view>
			<view class="label">
				<text class="s-t">物流公司:</text>
				<view class="txt">{{detailData.expressCompanyName}}</view>
			</view>
			<!-- <view class="label">
				<text class="s-t">运费险:</text>
				<view class="txt">
					<text class="orange">¥219.00</text>
					<text class="iconfont icon--right-jian"></text>
				</view>
			</view> -->
			<view class="label" v-for="(item, s) in detailData.serviceList" :key="s">
				<text class="s-t">{{item.serviceTitle}}:</text>
				<view class="txt">
					{{item.serviceValue}}
					<view @click="signingImage" v-if="item.serviceTitle=='签单返还'&&isbackSignBill" class="signing-pictures"><text class="iconfont icon-tupian"></text></view>
				</view>
			</view>
			<view class="label" @click="setClip(mastCode)">
				<text class="s-t">订单编号:</text>
				<view class="txt copy">
					{{mastCode}}
					<text class="iconfont icon-copy"></text>
				</view>
			</view>
			<view class="label row">
				<text class="s-t">下单时间:</text>
				<view class="txt">{{createDate}}</view>
			</view>
			<view class="label row" v-if="detailData.status=='1'">
				<text class="s-t">期望上门时间:</text>
				<view class="txt" style="margin-left: 83px;">{{sendTime}}</view>
			</view>
			<view class="label row" v-if="detailData.status=='9'">
				<text class="s-t">取消原因:</text>
				<view class="txt">{{detailData.cancelReason==undefined||detailData.cancelReason==null?'无':detailData.cancelReason}}</view>
			</view>
			<view class="label row" v-if="detailData.memo!=''&&detailData.memo!=null">
				<text class="s-t">寄件备注:</text>
				<view class="txt">{{detailData.memo==""?'无':detailData.memo}}</view>
			</view>
		</view>
		<view class="footer">
			<navigator :url="cancelUrl" v-if="detailData.status == 1&&type=='Sent'">
				<button>取消订单</button>
			</navigator>
			<button @click="phoneCall('010-51285752')">申请理赔</button>
			<navigator :url="kfUrl">
				<button><text class="iconfont icon-lianxikefu"></text>联系客服</button>
			</navigator>
		</view>
	</view>
	<view v-show="isPrint" class="print-con">
		<img :src="printUrl" @load="loadces" style="width: 100%;"/>
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
// var wxbarcode = require('../../components/barcode/index.js');
export default {
	data() {
		return {
			barcodeImg:"",
			mastCode: "",
			type: "",
			page: 1,
			limit: 5,
			total: 0,
			logisticsList: [],
			kfUrl: "",
			cancelUrl: "",
			detailData: [],
			fromCity: "",
			fromName: "",
			fromAddress: "",
			fromPhone: "",
			fromCompanyName: "",
			toCity: "",
			toName: "",
			toAddress: "",
			toPhone: "",
			toCompanyName: "",
			goodName: "",
			goodType: "",
			goodCount: "",
			weigth: "",
			Sweigth: "",
			marketExpressPrice: 0,
			expressPrice: 0,
			insuranceAmount: "",
			priceTitle: "实付款",
			samount: "",
			createDate: "",
			sendTime: "",
			imgArr: [],
			fileArr: [],
			signingPicList: [],
			isbackSignBill: false,
			isPrint: false,
			isPrintBtn: false,
			printUrl: "",
			isBarCode: false,
			canvasCode: ""
		}
	},
	onLoad(options){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.mastCode = options.mastCode;
		this.type = options.type;
		this.kfUrl = "/pages/order/customerService?mastCode="+this.mastCode;
		this.cancelUrl = "/pages/order/cancel?mastCode="+this.mastCode;
		this.page = 1;
		this.logisticsList = [];
		this.getDetailInfo();
		this.getlogistics();
		if(this.$util.IsPC()){
			this.isPrintBtn = true;
		}
	},
	methods: {
		longSave(){
			var that=this;
			
			var Array=[];
			Array.push(that.barcodeImg)
			that.$util.longSave(Array)
			
		},
		scrolltolower: function(){
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getlogistics();
			}
		},
		//获取信息
		getDetailInfo: function(){
			const that = this;
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/Express/Get",
				data: {mastCode: this.mastCode},
				success: function(res){
					that.detailData = res;
					that.fromCity = res.expressFrom.areaInfo.city;
					that.fromName = res.expressFrom.name;
					that.fromAddress = res.expressFrom.areaInfo.province +
										res.expressFrom.areaInfo.city +
										res.expressFrom.areaInfo.area +
										res.expressFrom.address;
					that.fromPhone = res.expressFrom.phone;
					that.fromCompanyName = res.expressFrom.companyName;
					that.toCity = res.expressTo.areaInfo.city;
					that.toName = res.expressTo.name;
					that.toAddress = res.expressTo.areaInfo.province +
										res.expressTo.areaInfo.city +
										res.expressTo.areaInfo.area +
										res.expressTo.address;
					that.toPhone = res.expressTo.phone;
					that.toCompanyName = res.expressTo.companyName;
					that.goodName = res.estimateGoods.name;
					that.goodType = res.estimateGoods.category;
					that.goodCount = res.estimateGoods.count;
					that.weigth = res.estimateGoods.weight;
					that.Sweigth = res.goods.weight;
					that.marketExpressPrice = res.marketExpressPrice.toFixed(2);
					that.expressPrice = res.expressPrice.toFixed(2);
					that.insuranceAmount = res.insurancePrice.toFixed(2);
					that.samount = res.price.toFixed(2);
					that.createDate = that.$util.formatDate.format(res.createTime, "yyyy-MM-dd hh:mm:ss");
					that.sendTime = that.$util.formatDate.format(res.sendTime, "yyyy-MM-dd hh:mm:ss");
					that.isbackSignBill = res.isBackSignBill==1?true:false; //1是true;0是false
					let arr = res.takeDeliveryFileList;
					that.imgArr = [];
					that.fileArr = [];
					arr.forEach(item => {
					    let type = (item.fileName).split('.')[1];
					    if(type == 'pdf'){
					        that.fileArr.push(item);
					    }else{
					        that.imgArr.push(item);
					    }
					});
				}
			});
		},
		//获取物流
		getlogistics: function(){
			const that = this;
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/Express/GetExpressRoute",
				data: {
					mastCode: that.mastCode,
					page: that.page,
					limit: that.limit
				},
				success: function(res){
					let total = res.details.total;
					if(total == 0 || res.details.list.length == 0) return false;
					res.details.list.filter(item => {
						if(item.routeTime != null && item.routeTime != ""){
							item.routeTime = that.$util.formatDate.format(item.routeTime,"MM-dd hh:mm")
						}
					});
					that.page++;
					that.total = total;
					that.logisticsList = that.logisticsList.concat(res.details.list);
				}
			})
		},
		//签单返回图片
		signingImage: function(){
			const that = this;
			uni.showLoading({ title: "请稍等..." });
			that.$util.networkRequest({
				url: "/Express/GetPictureImgList",
				data: {mastCode: this.mastCode},
				success: function(res){
					if(res == null) return false;
					that.signingPicList = res;
					var urls = [];
					for(var i = 0; i < that.signingPicList.length; i++){
						urls.push(that.signingPicList[i].filePath)
					}
					uni.previewImage({
						current: 0,
						urls: urls,
					});
				}
			})
		},
		//拨打电话
		phoneCall(tel){
			console.log('tel:',tel)
			uni.makePhoneCall({
			    phoneNumber: tel //仅为示例
			});
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
		//打印
		printing: function(){
			let that = this;
			if(that.printUrl != ""){
				that.isPrint = true;
				that.loadces();
				return false;
			}
			that.$util.networkRequest({
				url: "/Express/GetPrintFile",
				method: "POST",
				data: {value: this.mastCode},
				success: function(res){
					console.log("res:",res);
					if(res == "") {
						that.$util.showToast("此订单暂时并不能打印");
						return false;
					}
					that.printUrl = res;
					that.isPrint = true;
				}
			})
		},
		loadces: function(){
			let that = this;
			setTimeout(function(){
				window.print();
				that.isPrint = false;
			},10);
		}
	}
}
</script>