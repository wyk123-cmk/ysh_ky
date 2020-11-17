<template>
	<view class="page-bg" >
		<page-imges :show="showImage"></page-imges>
		<view class="send-con">
			<view class="user-info-list">
				<view class="con">
					<text class="iconfont icon-ji1"></text>
					<view @click="addressPage(0,'send')">
						<text class="s-t">{{sendInfo.name}}</text>
						<text class="address-input">{{sendInfo.address}}</text>
					</view>
				</view> 
				<view class="address-icon" @click="addressPage(1,'send')">
					<text class="iconfont icon-dizhibao"></text>地址簿
				</view>
			</view>
		</view>
		<form class="form" style="background-color: #FFFFFF; padding-bottom: 15px;">
			<picker @change="expressTypeChange" :range="expressTypeData" v-if="isShowxs">
				<label class="label-item">
					<view>
						<text v-bind:class="[expressTypeIndex==0?'input-txt':'']" class="">{{expressTypeData[expressTypeIndex]}}</text>
						<text class="iconfont icon--right-jian"></text>
					</view>
					寄件形式<text class="red">（必填）</text>
				</label>
			</picker>
			<label class="label-item" @click="open">
				<view>
					{{sendTime}}
					<text class="iconfont icon--right-jian"></text>
				</view>
				期望上门时间
			</label>
			<picker @change="expressCompanyPickerChange" :value="expressCompany.index" :range="expressCompany.range">
				<label class="label-item">
					<view>
						<image :src="expressCompany.path"></image>{{expressCompany.companyName}}
						<text class="iconfont icon--right-jian"></text>
					</view>
					物流公司
				</label>
			</picker>
			<label class="label-item" @click="goService">
				<view>
					<text v-bind:class="{'input-txt':serviceNames=='','red':serviceNames!=''}">{{serviceNames==""?"付款方式、签单返还等":serviceNames}}</text>
					<text class="iconfont icon--right-jian"></text>
				</view>
				增值服务
			</label>
			<label class="label-item remark">
				<view>
					<input type="text" placeholder="备注" />
				</view>
				对快递小哥说
			</label>
			<view class="label-item_beizhu">
				寄件备注
				<textarea placeholder="寄件备注仅自己可见，当发货量大时，方便财务统计" fixed="true" v-model="goodMemo" cursor-spacing="100" :show-confirm-bar="false"></textarea>
			</view>
		</form>
		<view class="order-main">
			<view class="order-item-list" v-for="(item, i) in orderList" :key="i">
				<view class="order-user-info">
					<text class="iconfont icon-shou"></text>
					<view @click="addressPage(0,'rep', item.repAddress.contactsCode, i)">
						<text class="name">{{item.repAddress.name}}&nbsp;{{item.repAddress.phone}}</text>
						<text class="address">{{item.repAddress.address}}{{item.repAddress.ad}}</text>
					</view>
					<text class="iconfont icon-shanchu" @click="orderRemove(i)"></text>
				</view>
				<view class="goods-info">
					<view @click="goGoods(i)">
						货品信息
						<text class="iconfont icon--right-jian"></text>
					</view>
					<text class="solid"></text>
					<view @click="bindEstimate(i)">
						{{item.type.productName}}
						<text class="money">{{item.type.price==''?'':'¥'+item.type.price}}</text>
						<text class="iconfont icon--right-jian"></text>
					</view>
				</view>
			</view>
			<view class="order-item-list" @click="addressPage(1,'rep')">
				<view class="order-user-info add-order">
					<text class="iconfont icon-shou"></text>
					<view class="name">+添加收件人信息</view>
				</view>
			</view>
		</view>
		<view class="bulk-order">
			<checkbox-group @change="checkboxChange">
				<checkbox  :checked="checked">电子面单</checkbox>
				<button @click="orderNow">立即下单{{orderList.length==0?"":"("+orderList.length+")"}}</button>
			</checkbox-group>
			
		</view>
		<view v-if="isEstimate">
			<view class="v-model" @click="isEstimate=false"></view>
			<view class="estimate-main">
				<view class="name">{{estimateName}}<text>￥{{estimatePrice}}</text></view>
				<view class="type-title">产品类型</view>
				<swiper class="swiper" :display-multiple-items="multiple" next-margin="10px">
					<swiper-item v-for="(item, index) in estimateDataList" :key="index" @click="choiceEstimate(index,item)">
						<view class="swiper-item" :class="{ active: index==activeIndex}">
							<text>{{item.productName}}</text>
							<text>{{item.receivedTime}}</text>
						</view>
					</swiper-item>
				</swiper>
				<button @click="typePreserve">确定</button>
			</view>
		</view>
		<sendTimePicker
			:show="popupShow" 
			:startTime="startTime" 
			:endTime="endTime" 
			:setPickerIndex="setPickerIndex" 
			:timeTabIndex="timeTabIndex"
			:code="expressCompany.code"
			@close="close" 
			@change="timeChange"></sendTimePicker>
		<view v-if="isCompanyPassword">
			<view class="v-model" @click="isCompanyPassword=false"></view>
			<view class="company-password-box">
				<view class="title">立即支付<text class="iconfont icon-quxiao" @click="isCompanyPassword=false"></text></view>
				<view class="money">¥<text>{{sumMoney}}</text></view>
				<input type="password" placeholder="请输入企业支付密码" @input="passwordInput" />
				<button class="btn-default-css" @click="orderNow">确定</button>
			</view>
		</view>
	</view>
</template>
<script>
import sendTimePicker from "../../components/sendTime-picker/sendTime-picker.vue"
export default {
	data() {
		return {
			type: "",
			sendInfo: {
				name: "寄件人信息",
				contactsCode: "",
				address: "点击填写寄件地址",
				ad: "",
				areaCode: ""
			},
			expressTypeData: ["请选择","个人"],
			expressTypeIndex: 0,
			isShowxs:false,
			popupShow: false,
			startTime: 8,
			endTime: 19,
			setPickerIndex: [0],
			timeTabIndex: 0,
			sendTime: '一小时内',
			expressCompany: {
				list: [],
				range: [],
				index: 0,
				code: "",
				path: "",
				agreementUrl: "",
				companyName: "",
				insuranceUpper: 0
			},
			serviceNames: "",
			serviceList: [],
			orderList: [],
			isEstimate: false,
			estimateDataList: [],
			activeIndex: 0,
			orderIndex: 0,
			estimateName: "",
			estimatePrice: 0,
			checked: false,
			goodMemo: "",
			isCompanyPassword: false,
			sumMoney: "",
			password: "",
			istc:"",
			multiple: 1,
			preserveTypeData: []
		}
	},
	components: {
		sendTimePicker
	},
	onLoad(options){
		this.type = "big";
		this.istc = options.companyCode==undefined?'':options.companyCode;
		//若local storage 存在寄件形式&&物流公司
		if(this.istc==""){
			let expressStorage = uni.getStorageSync('expressStorage');
			if(expressStorage != "" && expressStorage != undefined){
				this.expressModeStorage = JSON.parse(expressStorage).expressMode;
				this.companyCodeStorage = JSON.parse(expressStorage).companyCode;
				this.$store.state.batchOrderInfo.companyCode = this.companyCodeStorage;
			}
		}
		
		this.isRegister();
		this.getExpressCompany();
	},
	onShow(){
		let app = getApp();
		app.isToken();
		this.showImage = app.globalData.isDiscountPopup;
		this.init();
	},
	methods: {
		//赋值
		init: function(){
			let storage_data = uni.getStorageSync('batchSendInfo');
			if(storage_data != "" && storage_data != undefined){
				storage_data = JSON.parse(storage_data);
				this.$store.state.batchOrderInfo = storage_data;
				this.$store.state.expressDeliveryInfo.sendAddress = storage_data.sendAddress;
				this.$store.state.expressDeliveryInfo.service = storage_data.service;
				this.companyCodeStorage = storage_data.companyCode;
				uni.removeStorageSync('batchSendInfo');
			}
			let expressDeliveryInfo = this.$store.state.expressDeliveryInfo;
			let sendAddress = expressDeliveryInfo.sendAddress; //寄件地址
			let repAddress = expressDeliveryInfo.repAddress; //收件地址
			let serviceData = expressDeliveryInfo.service; //增值服务
			let batchOrderInfo = this.$store.state.batchOrderInfo;
			this.orderList = this.$store.state.batchOrderInfo["list"];
			//寄件地址 true--获取用户设置的默认地址;否则获取自己选择的地址
			if(JSON.stringify(sendAddress) == "{}"){
				this.getDefault();
			}else{
				this.sendInfo = sendAddress;
			}
			//物流公司
			if(batchOrderInfo.companyCode != ""){
				for(var i = 0; i < this.expressCompany.list.length; i++){
					if(this.expressCompany.list[i].companyCode == batchOrderInfo.companyCode){
						this.setCompanyValue(i);
					}
				}
			}
			
			//增值服务
			if(JSON.stringify(serviceData) != "{}"){
				this.serviceList = [];
				let str = "";
				serviceData.forEach(item => {
					if(item.serviceKey == "TakeBill") return false;
					let s = (item.sub.remark).replace(/ /g, '');
					str += s+'-';
					this.serviceList.push(item.sub);
					if(item.sub.serviceKey == "PayType" ){
						this.paytype = item.sub.remark;
					}
				})
				this.serviceNames = str.substring(0,str.length-1);
			}
			//订单列表
			if(JSON.stringify(repAddress) != "{}"){
				var arr = {
					repAddress: repAddress,
					goodsInfo: {
						isWP: false,
						isWeight: false,
						isMoney: false,
					},
					type: {
						productName: "产品类型",
						price: ""
					}
				}
				if(batchOrderInfo["list"].length > 0){
					let jsonData = batchOrderInfo["list"][0];
					//判断是否开启相同的信息
					if(jsonData.goodsInfo.isWP){
						arr.goodsInfo["isWP"] = true;
						arr.goodsInfo["info"] = jsonData.goodsInfo.info;
					}
					if(jsonData.goodsInfo.isWeight){
						arr.goodsInfo["isWeight"] = true;
						arr.goodsInfo["volume"] = jsonData.goodsInfo.volume;
					}
					if(jsonData.goodsInfo.isMoney){
						arr.goodsInfo["isMoney"] = true;
						arr.goodsInfo["money"] = jsonData.goodsInfo.money;
					}
				}
				let isAddressEdit = uni.getStorageSync('addressEdit');
					//地址是否是编辑
				if(isAddressEdit != "" && isAddressEdit != undefined){
					uni.removeStorageSync("addressEdit");
					this.orderList[isAddressEdit].repAddress = repAddress;
				}else{
					this.orderList = this.orderList.concat(arr);
				}
				this.$store.state.batchOrderInfo["list"] = this.orderList;
				this.$store.state.expressDeliveryInfo.repAddress = {};
			}
			this.forEachEstimate();
		},	
		//立即下单
		orderNow: function(){
			const that = this;
			console.log(that.serviceList);
			if(that.orderList.length == 0){
				that.$util.showToast("填写收件信息");
				return false;
			}
			let listData = [];
			that.sumMoney = 0;
			for(var i = 0; i < that.orderList.length; i++){
				let res = that.orderList[i];
				if(res.goodsInfo.info == undefined || res.goodsInfo.money == undefined || res.goodsInfo.volume == undefined){
					that.$util.showToast("第"+(i+1)+"个订单,未选填货品信息");
					return false;
				}
				if(res.type.productType == undefined){
					that.$util.showToast("第"+(i+1)+"个订单,未选择产品类型");
					return false;
				}
				if(that.expressCompany.code == "db001" && that.checked == true && res.goodsInfo.info.materialTxt == ""){
					that.$util.showToast("第"+(i+1)+"个订单,未选择包装材质");
					return false;
				}
				that.sumMoney += (parseFloat(
					parseFloat(res.type.price) +
					parseFloat((res.type.insurancePrice == "" ? 0 : res.type.insurancePrice))
				))
				let newData = {
					"toContactsCode": res.repAddress.contactsCode,
					"estimateGoods": {
						"weight": res.goodsInfo.volume.txtweight,
						"volume": res.goodsInfo.volume.volume,
						"category": res.goodsInfo.info.goodType,
						"name": res.goodsInfo.info.goodName,
						"count": res.goodsInfo.volume.txtnum,
					},
					"insurance": res.goodsInfo.money.amount,
					"packageService": res.goodsInfo.info.materialTxt,
					"productType": res.type.productType
				}
				listData.push(newData);
			}
			
			if(this.expressTypeIndex == 2 && this.password == ""){
				let bool = true;
				this.serviceList.forEach(item => {
					if(item.serviceKey == "PayType" && item.serviceValue == 1){
						bool = false;
					}
				});
				if(bool){
					this.isCompanyPassword = true;
					return false;
				}else{
					this.isCompanyPassword = false;
				}
			}else{
				this.isCompanyPassword = false;
			}
			uni.showLoading({
				title:"正在批量下单",
				mask: true
			})
			let createTime = this.expectedTime();
			let param = {
				"fromContactsCode": that.sendInfo.contactsCode,
				"sendTime": createTime,
				"companyCode": that.expressCompany.code,
				"expressMode": that.expressTypeIndex,
				"memo": that.goodMemo,
				"serviceList": that.serviceList,
				"isBillExpress": that.checked, //电子面单
				"orderList": listData,
				"password": that.password,
			}
			that.password = "";
			that.$util.networkRequest({
				url : "/Express/BatchPostApp",
				method: "POST",
				data: param,
				success: function(res){
					console.log("立即下单:",res);
					let _storageData = {expressMode: that.expressTypeIndex, companyCode: that.expressCompany.code};
					//默认寄件形式&&物流公司
					uni.setStorage({key: 'expressStorage', data: JSON.stringify(_storageData)});
					that.emptyData();
					uni.switchTab({url: "/pages/order/orderList"});
				},
				error: function(res){
					//个人余额不足跳转充值存localStorage
					if(res.errCode == 2001){
						uni.showModal({
						    title: '提示',
						    content: res.message,
							showCancel: false,
						    success: function (res) {
								uni.setStorage({key: 'batchSendInfo', data: JSON.stringify(that.$store.state.batchOrderInfo)});
						        uni.navigateTo({ url: "/pages/me/myRefill?type=batch"});
						    }
						});
					}
				}
			});
		},
		//清空
		emptyData: function(){
			this.$store.state.batchOrderInfo = {
				list: [],
				companyCode: "",//物流公司
				sendAddress: {} //寄件地址
			}
		},
		//跳转地址
		addressPage: function(key, type, contactsCode, index){
			if(key == 0){
				//新增&&编辑
				let code = "";
				if(type == "send") code = this.sendInfo.contactsCode;
				if(type == "rep") {
					code = contactsCode;
					uni.setStorage({key: 'addressEdit', data: String(index)});
				}
				uni.navigateTo({url: "/pages/me/addressEdit?addresscode="+code+"&type="+type});
			}
			if(key == 1){
				//列表
				let code= this.sendInfo.contactsCode;
				console.log(code);
				uni.navigateTo({url: "/pages/me/addressList?code="+code+"&type="+type});
			}
		},
		//货品信息
		goGoods: function(key){
			let createTime = this.expectedTime();
			this.$store.state.batchOrderInfo.expectTime = createTime;
			this.$store.state.batchOrderInfo.service = this.$store.state.expressDeliveryInfo.service;
			this.$store.state.batchOrderInfo.sendAddress = this.sendInfo;
			this.$store.state.batchOrderInfo.expressTypeIndex = this.expressTypeIndex;
			uni.navigateTo({url: "/pages/batchSend/batchGoodsInfo?key="+key+"&upperAmount="+this.expressCompany.insuranceUpper+"&code="+this.expressCompany.code});
		},
		//删除订单
		orderRemove: function(key){
			const that = this;
			uni.showModal({
			    title: '提示',
			    content: '您确定要删除吗？',
			    success: function (res) {
			        if (res.confirm) {
						that.orderList = that.orderList.filter(function(item, i){
							return i != key;
						});
						that.$store.state.batchOrderInfo["list"] = that.orderList;
					}
				},
			});
		},
		//选择产品类型
		choiceEstimate: function(index,item){
			this.activeIndex = index;
			this.estimatePrice = item.price;
			this.preserveTypeData = item;
		},
		//产品类型确定
		typePreserve: function(){
			this.isEstimate = false;
			this.orderList[this.orderIndex].type = this.preserveTypeData;
			this.orderList[this.orderIndex].type["index"] = this.activeIndex;
		},
		setData: function(key, callback){
			const that = this;
			let _info = that.orderList[key];
			let createTime = this.expectedTime();
			let _insuranceValue = _info.goodsInfo.volume.txtweight<20&&_info.goodsInfo.money==undefined?0:_info.goodsInfo.money.amount;
			let data = {
				ExpressMode: that.expressTypeIndex,
				areaCodeFrom: that.sendInfo.areaCode,
				fromAddress: that.sendInfo.ad,
				toAddress: _info.repAddress.ad,
				areaCodeTo: _info.repAddress.areaCode,
				companyCode: that.expressCompany.code,
				insuranceValue: _insuranceValue,
				sendTime: createTime,
				volume: _info.goodsInfo.volume.volume <= 0 ? 0 : _info.goodsInfo.volume.volume,
				serviceDeliveryTypeInfo: this.serviceList,
				weight: _info.goodsInfo.volume.txtweight
			}
			that.$util.networkRequest({
				url : "/Price/EstimatePrice",
				method: "POST",
				data: data,
				success: function(res){
					if(callback) callback(res);
				}
			});
		},
		//物流公司&&期望时间&&增值服务改变是,产品类型相应的改变
		forEachEstimate: function(){
			let that = this;
			let dataList = this.orderList;
			that.activeIndex = 0;
			uni.showLoading({
				mask: true
			})
			if(dataList.length == 0){
				uni.hideLoading()
			}
			dataList.forEach(function(item, i){
				if(JSON.stringify(item.goodsInfo.volume) == undefined) {
					uni.hideLoading();
					return false;
				}
				if(item.goodsInfo.volume.txtweight > 20){
					if(item.goodsInfo.money == undefined){
						uni.hideLoading();
						return false;
					}
				}
				that.setData(i, function(res){
					that.orderList[i].type = res[0];
					that.orderList[i].type["index"] = 0;
				})
			});
		},
		//产品类型
		bindEstimate: function(key){
			const that = this;
			let _info = that.orderList[key];
			this.orderIndex = key;
			let typeIndex = _info.type.index==undefined?0:_info.type.index;
			if(JSON.stringify(_info.goodsInfo.volume) == undefined){
				that.$util.showToast("请选填货品信息");
				return false
			}
			if(_info.goodsInfo.volume.txtweight > 20){
				if(_info.goodsInfo.money == undefined){
					that.$util.showToast("预估重量大于20公斤,保费为必填");
					return false;
				}
			}
			that.activeIndex = 0;
			that.estimateName = _info.goodsInfo.info.goodName;
			uni.showLoading({
				title: "加载中...",
				mask: true
			});
			that.setData(key, function(res){
				that.isEstimate = true;
				if(res.length > 1){that.multiple = 2}
				that.estimatePrice = res[typeIndex].price;
				that.activeIndex = typeIndex;
				that.estimateDataList = res;
				that.preserveTypeData = res[typeIndex];
			});
		},
		//物流公司
		expressCompanyPickerChange(e){
			let index = e.detail.value;
			this.$store.state.expressDeliveryInfo.expectTime = "";
			this.setCompanyValue(index);
			this.$store.state.batchOrderInfo.companyCode = this.expressCompany.list[index].companyCode;
			//更换物流公司 增值清空
			this.$store.state.expressDeliveryInfo.service = {};
			this.serviceNames = "";
			this.initServiceData();
			this.forEachEstimate();
		},
		setCompanyValue(index){
			let _code = this.expressCompany.list[index].companyCode;
			let _start = this.expressCompany.list[index].startTime;
			let _end = this.expressCompany.list[index].endTime;
			let _path = this.expressCompany.list[index].logoPath;
			let _agreementUrl = this.expressCompany.list[index].agreementUrl;
			this.expressCompany.index = index;
			this.expressCompany.code = _code;
			this.expressCompany.path = _path.replace(/\s*/g, "");
			this.expressCompany.agreementUrl = _agreementUrl;
			this.expressCompany.companyName = this.expressCompany.list[index].companyName;
			this.expressCompany.insuranceUpper = this.expressCompany.list[index].insuranceUpper;
			this.clauseHtml = this.expressCompany.list[index].agreementContent;
			this.startTime = _start;
			this.endTime = _end;
			this.setPickerIndex = [0];
			this.setDate(_code, _end);
		},
		//选择时间段
		open(){
			this.popupShow = true;
		},
		close(){
			this.popupShow = false;
		},
		timeChange(data){
			this.setPickerIndex = [Number(data.pickerIndex)];
			this.sendTime = data.txt;
			this.timeTabIndex = data.tabIndex;
			// this.$store.state.expressDeliveryInfo.expectTime = this.sendTime;
			this.forEachEstimate();
		},
		//寄件形式
		expressTypeChange: function(e){
			this.expressTypeIndex = e.target.value;
			this.$store.state.expressDeliveryInfo.type = e.target.value;
			this.countYHQ = this.expressTypeIndex == 1?this.couponCountUser:this.couponCountCompany;
			if(this.expressTypeIndex == 0) this.estimatePriceList = [];
			this.forEachEstimate();
		},
		//寄件形式
		isRegister(){
			const that = this;
			that.$util.networkRequest({
				url : "/Company/IsRegister",
				success : function(res){
					if(res){
						that.isShowxs=true;
						that.expressTypeData.push("企业");
					}
					else{
						that.isShowxs=false;
						that.expressTypeIndex=1;
					}
					if (that.expressModeStorage !== 0) {
						if (that.expressModeStorage == 2) {
							that.expressTypeIndex = that.expressTypeData.length == 3 ? that.expressModeStorage : 1;
						} else {
							that.expressTypeIndex = that.expressModeStorage;
						}
					}
					that.expressTypeIndex = that.expressTypeIndex == undefined?1:that.expressTypeIndex;
					that.$store.state.expressDeliveryInfo.type = that.expressTypeIndex;
				}
			});
		},
		//获取物流公司
		getExpressCompany(){
			const that = this;
			that.expressCompany = {
				list: [],
				range: [],
				index: 0,
				code: "",
				path: "",
				agreementUrl: "",
				companyName: "",
				insuranceUpper: 0
			};
			that.$util.networkRequest({
				url : "/ExpressCompany/GetList",
				data: {companyType: "Big"},
				success : function(res){
					let index = that.expressCompany.index;
					//有弹窗带来的参数公司时默认选中，没有弹框时选中缓存的
					if(that.istc !== "" ){
						for(var i = 0; i < res.length; i++){
							if(res[i].companyCode== that.istc){
								index = i;
							}
						}
					}
					else{
						for(var i = 0; i < res.length; i++){
							if(res[i].companyCode== that.companyCodeStorage){
								index = i;
							}
						}
					}
					
					let _data = res[index];
					that.expressCompany.list = res;
					that.expressCompany.code = _data.companyCode;
					that.expressCompany.companyName = _data.companyName;
					that.expressCompany.insuranceUpper = _data.insuranceUpper;
					that.expressCompany.path = _data.logoPath.replace(/\s*/g, "");
					that.expressCompany.agreementUrl = _data.agreementUrl;
					that.clauseHtml = _data.agreementContent;
					that.startTime = _data.startTime;
					that.endTime = _data.endTime;
					that.initServiceData(); //增值服务
					that.setDate("", that.endTime);
					that.setCompanyValue(index);
					res.forEach((c,i)=>{
						that.expressCompany.range.push(c.companyName);
					});
				}
			})
		},
		//增值服务
		initServiceData(){
			let that = this;
			if(JSON.stringify(this.$store.state.expressDeliveryInfo.service) == "{}"){
				that.serviceList = [];
				that.$util.networkRequest({
					url : "/ExpressService/GetList",
					data: {companyCode: that.expressCompany.code},
					success : function(res){
						res.forEach(item => {
							let _subData = item.listDetail[0];
							if(that.expressCompany.code == "db001" && item.serviceKey == "DeliveryType"){
								//若是德邦:提货方式默认“送货（不含上楼）”
								item.listDetail.forEach(sub => {
									if(sub.remark == "送货（不含上楼）"){
										_subData = sub;
									}
								});
							}
							if(item.serviceKey == "TakeBill"){
								return false
							}
							that.serviceList.push({
								remark: _subData.remark,
								serviceKey: _subData.serviceKey,
								serviceValue: _subData.serviceValue
							});
						})
					}
				})
			}
		},
		setDate(_code,_end){
			let _txt = "";
			let _expectTime = this.$store.state.expressDeliveryInfo.expectTime;
			if(_expectTime == ""){
				this.timeTabIndex = 0;
				this.sendTime = _code==""||_code=="sf001"||_code=="ky001"?_txt+" 一小时内":_txt+" 两小时内";
			}else{
				this.sendTime = _expectTime;
			}
		},
		checkboxChange: function(e){
			this.checked = !this.checked;
		},
		//增值服务
		goService: function(){
			uni.navigateTo({url: "/pages/index/addedService?code="+this.expressCompany.code+"&type=1"});
		},
		//计算期望上门时间年月日 时:分
		expectedTime(){
			let date = new Date();
			let new_date = "";
			let hour = "";
			if(this.sendTime.indexOf("小时") != -1){
				let h_i = 1;
				if(this.timeTabIndex == 1){
					//若距离下班时间1小时则期待上门时间是明天
					new_date = new Date(date.getTime() + 24*60*60*1000);
					hour = this.startTime+':00';
				}else{
					if(this.expressCompany.code == "sf001" || this.expressCompany.code == "ky001"){
						if(((this.endTime - 1) < (new Date).getHours() )&& ((new Date).getHours() < this.endTime)){
							return date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()+' '+this.endTime+':00';
						}
						//顺丰一小时之内
						new_date = new Date(date.getTime() + 60*60*1000);
					}else{
						if(((this.endTime - 2) < (new Date).getHours() )&& ((new Date).getHours() < this.endTime)){
							return date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()+' '+this.endTime+':00';
						}
						//德邦两小时之内
						new_date = new Date(date.getTime() + 60*60*1000*2);
					}
					hour = new_date.getHours()+':'+new_date.getMinutes();
				}
			}
			else{
				//已选择时间段
				hour = this.sendTime.split("-")[1];
				if(this.timeTabIndex==0){
					new_date = new Date();
					if(hour=="24:00"){
						hour="23:59";
					}
				}else{
					new_date = new Date(date.getTime() + 24*60*60*1000*this.timeTabIndex);
					if(hour=="24:00"){
						hour="23:59";
					}
				}
			}
			return new_date.getFullYear()+'-'+(new_date.getMonth() + 1)+'-'+new_date.getDate()+' '+hour;
		},
		//获取默认地址簿
		getDefault(){
			const that = this;
			that.$util.networkRequest({
				url : "/AddressBook/GetDefault",
				success : function(res){
					if(!that.$util.isNotEmpty(res)){
						return false;
					}
					that.sendInfo = {
						name: res.name,
						contactsCode: res.contactsCode,
						address: res.areaInfo.province+res.areaInfo.city+res.areaInfo.area+res.address,
						ad: res.address,
						areaCode: res.areaInfo.areaCode
					}
					that.$store.state.batchOrderInfo.sendAddress = that.sendInfo;
				}
			});
		},
		//输入企业支付密码
		passwordInput: function(e){
			this.password = e.detail.value;
		},
	}
}
</script>
<style scoped>
@import '../../common/css/index/expressDelivery.css';
.send-con,
.form{
	background-color: #FFFFFF;
	border: 0;
}
.send-con{
	padding: 10px 0;
}
.send-con .user-info-list{
	margin: 0 15px;
	box-shadow: 0 1px 3px rgba(0,0,0,.2);
	background: #fff;
	border-radius: 5px;
	padding: 15px 10px;
}
.form .label-item{
	border-top: 0;
	border-bottom: 1px solid #F7F7F7;
	}
.label-item_beizhu{
	border-top: 0;
	border-bottom: 1px solid #F7F7F7;

	
}
.order-item-list{
	margin: 10px 15px 0;
	box-shadow: 0 0 4px rgba(0,0,0,.2);
	background: #fff;
	border-radius: 4px;
	padding: 15px 10px;
	padding-bottom: 0;
}
.order-item-list > view{
	display: flex;
	align-items: center;
}
.order-item-list .order-user-info{
	position: relative;
}
.order-item-list .order-user-info .icon-shou{
	font-size: 20px;
	color: #EF9A42;
	line-height: 20px;
}
.order-item-list .order-user-info > view{
	margin-left: 10px;
	width: 82%;
}
.order-item-list .order-user-info .name{
	font-size: 15px;
	font-weight: bold;
	
}
.order-item-list .order-user-info .address{
	font-size: 12px;
	color: #999999;
	margin-top: 5px;
}
.order-item-list .order-user-info .icon-shanchu{
	position: absolute;
	right: 0;
	top: 0;
	width: 20px;
	height: 20px;
	text-align: right;
}
.order-item-list text{
	display: block;
}
.order-item-list .goods-info{
	border-top: 1px solid #eee;
	justify-content: space-between;
	margin-top: 10px;
}
.order-item-list .goods-info > view{
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 50%;
	height: 40px;
	font-size: 14px;
}
.order-item-list .goods-info .solid{
	width: 1px;
	height: 40px;
	background: #eee;
	margin: 0 10px;
}
.order-item-list .goods-info .icon--right-jian{
	font-size: 12px;
	color: #999999;
}
.order-item-list .goods-info .money{
	color: #ff8f00;
}
.order-item-list .add-order{
	padding-bottom: 15px;
}
.order-main{
	padding-bottom: 70px;
}
.bulk-order{
	height: 60px;
	line-height: 60px;
	padding-left: 10px;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0px;
	background-color: #FFFFFF;
}
.bulk-order button{
	float: right;
	line-height: 60px;
	font-size: 14px;
	color: #FFFFFF;
	background-color: #4285F4;
	border-radius: 0;
	padding: 0 20px;
}
.estimate-main{
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #FFFFFF;
	z-index: 1000;
}
.estimate-main .name,
.estimate-main .type-title{
	height: 40px;
	line-height: 40px;
	padding: 0 15px;
	border-bottom: 1px solid #EEEEEE;
}
.estimate-main .name text{
	float: right;
	color: #ff8f00;
	font-size: 16px;
}
.estimate-main .type-title{
	border: 0
}
.estimate-main .swiper{
	height: 62px;
	padding: 0 15px
}
.estimate-main .swiper .swiper-item{
	background-color: #f7f7f7;
	border-radius: 8px;
	margin-right: 15px;
	padding: 10px 0;
	text-align: center;
	border: 1px solid #f7f7f7;
	max-width: 170px;
}
.estimate-main .swiper .swiper-item.active{
	border: 1px solid #ff8f00;
	background-color: #FFFFFF;
	color: #ff8f00;
}
.estimate-main .swiper .swiper-item text{
	display: block;
}
.estimate-main button{
	background-color: #ff8f00;
	line-height: 40px;
	color: #FFFFFF;
	margin: 20px 15px 30px;
}
.label-item_beizhu textarea{
	border: 1px solid #eeeeee;
	width: calc(100% - 10px);
	width: -webkit-calc(100% - 10px);
	padding: 5px;
	font-size: 12px;
	height: 45px;
	border-radius: 3px;
	margin-top: 8px;
	 overflow: scroll;
}
</style>