<template>
<view>
	<page-imges :show="showImage"></page-imges>
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
	<view class="user-info-list">
		<view class="con">
			<text class="iconfont icon-shou"></text>
			<view @click="addressPage(0,'rep')">
				<text class="s-t">{{repInfo.name}}</text>
				<text class="address-input">{{repInfo.address}}</text>
			</view>
		</view>
		<view class="address-icon" @click="addressPage(1,'rep')">
			<text class="iconfont icon-dizhibao"></text>地址簿
		</view>
	</view>
	<form class="form">
		<label class="label-item">
			<view class="modality">
				<text @click="expressTypeChange(m)" v-for="(item, m) in expressTypeData" :key="m" :class="(expressTypeIndex)==m?'active':''">{{item}}</text>
			</view>
			寄件形式<text class="must">必填</text>
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
		<label class="label-item" @click="open">
			<view>
				{{sendTime}}
				<text class="iconfont icon--right-jian"></text>
			</view>
			提货时间
		</label>
		<label class="label-item" @click="goExpressGoods">
			<view>
				<text v-bind:class="{'input-txt':goodName==''}">{{goodName==""?"请填写":goodName}}</text>
				<text class="iconfont icon--right-jian"></text>
			</view>
			寄托物品<text class="must">必填</text>
		</label>
		<label class="label-item">
			<view @click="isCarType=true">
				<text v-bind:class="{'input-txt':carName==''}">{{carName==""?"请选择":carName}}</text>
				<text class="iconfont icon--right-jian"></text>
			</view>
			车辆类型
		</label>
		<label class="label-item" @click="goInsuredPrice">
			<view>
				<text class="input-txt-bj" v-if="insuredPrice==null">建议足额保价</text>
				<view class="money" v-else>{{insuredPrice.amount=="不保价"?insuredPrice.amount:"￥"+insuredPrice.amount}}<text v-if="insuredPrice.price!=0">￥{{insuredPrice.price}}</text></view>
				<text class="iconfont icon--right-jian"></text>
			</view>
			保价<text class="must">必填</text>
		</label>
		<label class="label-item" @click="goService">
			<view>
				<text v-bind:class="{'input-txt':serviceNames=='','red':serviceNames!=''}">{{serviceNames==""?"装货服务、卸货服务等":serviceNames}}</text>
				<text class="iconfont icon--right-jian"></text>
			</view>
			增值服务
		</label>
	</form>
	<view class="create-confirm">
		<view class="checkbox">
			<checkbox class="orange" :checked="checkedAgree" @click="checkedAgree=!checkedAgree">我已阅读并同意</checkbox>
			<text @click="isAagree=true">《仪商汇快运服务协议》</text>
			<text @click="isClause=true">{{expressCompany.agreementUrl}}</text>
		</view>
		<button class="btn-default-css" @click="createOrderBtn">提交</button>
	</view>
	<sendTimePicker
		:show="popupShow" 
		:startTime="startTime" 
		:endTime="endTime" 
		:setPickerIndex="setPickerIndex"
		:tabTimeArr = "tabTimeArr"
		:timeTabIndex="timeTabIndex"
		:code="expressCompany.code" 
		@close="close" 
		@change="timeChange"></sendTimePicker>
	<view v-if="isAagree" @click="isAagree=false">
		<view class="v-model"></view>
		<view class="popup-txt" v-html="agreeHtml"></view>
	</view>
	<view v-if="isClause" @click="isClause=false">
		<view class="v-model"></view>
		<view class="popup-txt" v-html="clauseHtml"></view>
	</view>
	<!-- 选择车型 -->
	<view v-if="isCarType">
		<view class="v-model" @click="isCarType = false"></view>
		<view class="vehicle-type">
			<view class="title">选择车型</view>
			<swiper class="swiper" :indicator-dots="false" :display-multiple-items="swiperItems" :skip-hidden-item-layout="true">
				<swiper-item @click="swiperClick(c)" v-for="(car, c) in carList" :key="c">
					<view class="swiper-item" v-bind:class="[swiperIndex==c?'active':'']">{{car.carName}}</view>
				</swiper-item>
			</swiper>
			<form class="form">
				<label class="tr-th">
					<text v-if="expressCompany.code=='db001'">车宽</text>
					<text v-if="expressCompany.code=='db001'">车高</text>
					<text v-if="expressCompany.code=='ky001'">车载长度(m)</text>
					<text v-if="expressCompany.code=='ky001'">载货重量(kg)</text>
					<text>载货体积(m³)</text>
					<text>选择</text>
				</label>
				<label @click="choiceCar(s,sub.carCode)" v-bind:class="[carIndex==s?'active':'']" v-for="(sub, s) in carSubList" :key="s">
					<text v-if="expressCompany.code=='db001'">{{sub.carWidth}}</text>
					<text v-if="expressCompany.code=='db001'">{{sub.carHeight}}</text>
					<text v-if="expressCompany.code=='ky001'">{{sub.carLength}}</text>
					<text v-if="expressCompany.code=='ky001'">{{sub.carWeight}}</text>
					<text>{{sub.carCubage}}</text>
					<text class="iconfont icon-dui"></text>
				</label>
			</form>
			<button class="btn-default-css" @click="carBtn">确定</button>
		</view>
	</view>
</view>
</template>
<script>
import sendTimePicker from "../../components/sendTime-picker/sendTime-picker.vue"
export default {
	data() {
		return {
			sendInfo: {
				name: "寄件人信息",
				contactsCode: "",
				address: "点击填写寄件地址",
				ad: "",
				areaCode: ""
			},
			repInfo: {},
			expressTypeData: ["个人"],
			expressTypeIndex: 0,
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
			popupShow: false,
			startTime: 8,
			endTime: 19,
			setPickerIndex: [0],
			timeTabIndex: 0,
			sendTime: '一小时内',
			isClause: false,
			isAagree: false,
			insuredPrice: null,
			serviceNames: "",
			serviceList: [],
			goodInfoData: {},
			goodName: "",
			checkedAgree: false,
			isCarType: false,
			carList: [],
			carSubList: [],
			swiperItems: 1,
			swiperIndex: 0,
			carIndex: 0,
			carCode: "",
			carName: "",
			clauseHtml: "",
			agreeHtml: "",
			tabTimeArr: []
		}
	},
	components: {
		sendTimePicker
	},
	onLoad(){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.isRegister();
		this.getExpressCompany();
		this.getYshESAgree();
		this.getYMD();
	},
	onShow(){
		this.init();
	},
	methods: {
		//全局赋值
		init(){
			let expressDeliveryInfo = this.$store.state.expressDeliveryInfo;
			let sendAddress = expressDeliveryInfo.sendAddress; //寄件地址
			let repAddress = expressDeliveryInfo.repAddress; //收件地址
			let goodInfoData = expressDeliveryInfo.goodInfo; //物品信息
			let insuredPrice = expressDeliveryInfo.insuredPrice; //保价
			let serviceData = expressDeliveryInfo.service; //增值服务
			let carTypeData = expressDeliveryInfo.carType; //车辆类型
			this.goodInfoData = {};
			this.insuredPrice = null;
			//寄件地址 true--获取用户设置的默认地址;否则获取自己选择的地址
			if(JSON.stringify(sendAddress) == "{}"){
				this.getDefault();
			}else{
				this.sendInfo = sendAddress;
			}
			//收件地址 true--获取用户设置的默认地址;否则获取自己选择的地址
			if(JSON.stringify(repAddress) == "{}"){
				this.repInfo = {
					name: "收件人信息",
					contactsCode: "",
					address: "点击填写收件地址",
					ad: "",
					areaCode: ""
				}
			}else{
				this.repInfo = repAddress;
			}
			//寄件形式
			if(expressDeliveryInfo.type != ""){
				this.expressTypeIndex = expressDeliveryInfo.type;
			}
			//物流公司
			if(expressDeliveryInfo.companyCode != ""){
				for(var i = 0; i < this.expressCompany.list.length; i++){
					if(this.expressCompany.list[i].companyCode == expressDeliveryInfo.companyCode){
						this.setCompanyValue(i);
					}
				}
			}
			//物品信息
			if(JSON.stringify(goodInfoData) != "{}"){
				this.goodInfoData = goodInfoData;
				this.goodName = goodInfoData.goodName;
			}
			//保价
			if(JSON.stringify(insuredPrice) != "{}"){
				this.insuredPrice = insuredPrice;
			}
			//车辆类型
			if(JSON.stringify(carTypeData) != "{}"){
				this.carIndex = carTypeData.carIndex;
				this.swiperIndex = carTypeData.swiperIndex;
				this.carName = this.carList[this.swiperIndex].carName;
				this.carCode = this.carSubList[this.carIndex].carCode;
			}
			//增值服务
			if(JSON.stringify(serviceData) != "{}"){
				this.serviceList = [];
				let str = "";
				serviceData.forEach(item => {
					let s = (item.sub.remark).replace(/ /g, '');
					str += s+'-';
					this.serviceList.push(item.sub);
					if(item.sub.serviceKey == "PayType" ){
						this.paytype = item.sub.remark;
					}
				})
				this.serviceNames = str.substring(0,str.length-1);
			}
			
		},
		//立即下单
		createOrderBtn: function(){
			const that = this;
			if(!that.Valid()) return false;
			let expressType = that.expressTypeIndex==0?1:2;
			let createTime = this.expectedTime();
			var amount = "";
			if(that.insuredPrice != null) {
				var amount = that.insuredPrice.amount;
			}
			let param = {
					"fromContactsCode": that.sendInfo.contactsCode,
					"toContactsCode": that.repInfo.contactsCode,
					"companyCode": that.expressCompany.code,
					"sendTime": createTime,
					"goodsInfo": { //物品信息
						weight: that.goodInfoData.weigth, //重量
						volume: that.goodInfoData.cubic <= 0 ? 0 : that.goodInfoData.cubic, // 体积m³
						category: that.goodInfoData.packType,//产品类型
						name: that.goodInfoData.goodName, //名称
						count: that.goodInfoData.goodNum, //数量
					},
					"insurance": amount,
					"insuranceCompanyCode": that.expressCompany.code,
					"expressMode": expressType,
					"remark": that.goodInfoData.remark,
					// "password": "string",
					// "memo": "string",
					"serviceList": that.serviceList,
					"carCode": that.carCode
			}
			uni.showLoading({
				mask: true,
				title: "正在下单.."
			})
			that.$util.networkRequest({
				url : "/ExpressCar/Create",
				method: "POST",
				data: param,
				success: function(res){
					that.emptyData();
					uni.redirectTo({ url: "details?mastCode="+res.mastCode });
				},
				error: function(res){
					console.log("error:",res)
				}
			})
		},
		//跳转地址
		addressPage: function(key, type){
			if(key == 0){
				//新增&&编辑
				let code = "";
				if(type == "send") code = this.sendInfo.contactsCode;
				if(type == "rep") code = this.repInfo.contactsCode;
				uni.navigateTo({url: "/pages/me/addressEdit?addresscode="+code+"&type="+type});
			}
			if(key == 1){
				//列表
				uni.navigateTo({url: "/pages/me/addressList?type="+type});
			}
		},
		//寄件形式
		expressTypeChange: function(index){
			this.$store.state.expressDeliveryInfo.type = this.expressTypeIndex = index;
		},
		//请填写报价信息
		goInsuredPrice: function(){
			if(this.expressCompany.code == "" || this.expressCompany.code == null){
				this.$util.showToast("请选择物流公司");
				return false;
			}
			uni.navigateTo({
				url: "/pages/vehicleMail/insured?upperAmount="+this.expressCompany.insuranceUpper+"&code="+this.expressCompany.code+"&mark=1",
			});
		},
		//增值服务
		goService: function(){
			uni.navigateTo({url: "/pages/index/addedService?code="+this.expressCompany.code+"&type=2"});
		},
		//车型
		swiperClick: function(index){
			this.swiperIndex = index;
			this.carSubList = this.carList[index].list;
			this.carName = "";
			this.carIndex = 0;
		},
		choiceCar: function(index,carCode){
			this.carIndex = index;
			this.carCode = carCode;
		},
		carBtn: function(){
			this.isCarType = false;
			this.carName = this.carList[this.swiperIndex].carName;
			this.$store.state.expressDeliveryInfo.carType = {
				swiperIndex: this.swiperIndex,
				carIndex: this.carIndex
			}
		},
		//物流公司
		expressCompanyPickerChange: function(e){
			let index = e.detail.value;
			this.productType = "";
			this.$store.state.expressDeliveryInfo.expectTime = "";
			this.setCompanyValue(index);
			this.$store.state.expressDeliveryInfo.companyCode = this.expressCompany.list[index].companyCode;
			//更换物流公司 增值清空
			this.$store.state.expressDeliveryInfo.service = {};
			this.serviceNames = "";
			this.initServiceData();
			
			//更换车辆类型 车辆类型清空
			this.$store.state.expressDeliveryInfo.carType = {};
			this.getCarListAll();
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
			if(this.$store.state.expressDeliveryInfo.expectTime != ""){
				this.sendTime = this.$store.state.expressDeliveryInfo.expectTime;
			}else{
				this.setDate(_code, _end);
			}
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
			this.$store.state.expressDeliveryInfo.expectTime = this.sendTime;
		},
		setDate(_code,_end){
			let dt = new Date(); //当前时间
			if(dt.getHours() >= (this.endTime-1) && (_code == "sf001" || _code == "" || _code=="ky001")){
				this.timeTabIndex = 1;
			}
			else if(dt.getHours() >= (this.endTime-2) && _code == "db001"){
				this.timeTabIndex = 1;
			}
			else this.timeTabIndex = 0;
			let _txt = this.timeTabIndex == 0?"":"明天";
			this.sendTime = _code==""||_code=="sf001"||_code=="ky001"?_txt+" 一小时内":_txt+" 两小时内";
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
				}else if(this.timeTabIndex > 2){
					new_date = new Date();
					let str = this.sendTime.split(" ");
					return new_date.getFullYear()+'-'+str[0]+' '+str[1].split("-")[1];
				}else{
					new_date = new Date(date.getTime() + 24*60*60*1000*this.timeTabIndex);
					if(hour=="24:00"){
						hour="23:59";
					}
				}
			}
			return new_date.getFullYear()+'-'+(new_date.getMonth() + 1)+'-'+new_date.getDate()+' '+hour;
		},
		//寄托物品
		goExpressGoods: function(){
			uni.navigateTo({url:"expressGoods"});
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
					that.$store.state.expressDeliveryInfo.sendAddress = that.sendInfo;
				}
			});
		},
		//寄件形式
		isRegister(){
			const that = this;
			that.$util.networkRequest({
				url : "/Company/IsRegister",
				success : function(res){
					if(res){
						that.expressTypeData.push("企业");
					}
				}
			});
		},
		//获取车辆车型
		getCarListAll(){
			let that = this;
			that.carList = [];
			that.carSubList = [];
			that.swiperIndex = 0;
			that.carName = "";
			that.$util.networkRequest({
				url : "/ExpressCar/GetCarListAll",
				data: {companyCode: that.expressCompany.code},
				success : function(res){
					if(res.length == 0) return false;
					let arr = [],
					obj = {},
					index = 0;
					res.forEach((item, i) =>{
						if (obj.hasOwnProperty(item.carName)) {
							arr[obj[item.carName]]["list"].push(item);
						}else{
							obj[item.carName] = index++;
							arr.push({
								parentCareName: item.parentCareName,
								carName: item.carName,
								list: [item]
							});
						 }
					})
					that.swiperItems = arr.length >= 5 ? 5 : arr.length;
					that.carList = arr;
					that.carSubList = arr[0].list;
					that.carIndex = 0;
					that.carCode = that.carSubList[0].carCode;
					// that.carName = that.carList[0].carName;
				},
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
				url : "/ExpressCar/GetCompanyList",
				success : function(res){
					if(res.length == 0) return false;
					let index = that.expressCompany.index;
					if(that.istc !== "" ){
						for(var i = 0; i < res.length; i++){
							if(res[i].companyCode== that.istc){
								index = i;
							}
						}
					}
					else{
						if(that.companyCodeStorage != ""){
							for(var i = 0; i < res.length; i++){
								if(res[i].companyCode== that.companyCodeStorage){
									index = i;
								}
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
					that.getCarListAll(); //获取车辆类型
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
					url : "/ExpressCar/GetExpressServiceList",
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
		Valid(){
			if(!this.$util.isNotEmpty(this.sendInfo.contactsCode)){
				this.$util.showToast("寄件人不能为空");
				return false;
			}
			if(!this.$util.isNotEmpty(this.repInfo.contactsCode)){
				this.$util.showToast("收件人不能为空");
				return false;
			}
			if(!this.$util.isNotEmpty(this.carName)){
				this.$util.showToast("请选择车辆类型");
				return false;
			}
			if(JSON.stringify(this.goodInfoData) == "{}"){
				this.$util.showToast("请填写物品信息");
				return false;
			}
			if(this.insuredPrice == null){
				this.$util.showToast("请填写保价信息");
				return false;
			}
			if(!this.checkedAgree){
				this.$util.showToast("请详细阅读条款并勾选");
				return false;
			}
			return true;
		},
		//获取服务协议
		getYshESAgree(){
			const that = this;
			that.$util.networkRequest({
				url : "/ExpressCompany/GetYshESAgree",
				success : function(res){
					that.agreeHtml = res;
				}
			});
		},
		getYMD(){
			let dt = new Date();
			this.tabTimeArr = ["今天", "明天", "后天"];
			let m = dt.getMonth()+1;
			let days = new Date(dt.getFullYear(), m, 0).getDate(); //当前月份的天数
			let a = 0;
			for(var i = 3; i < 7; i++){
				let c_m = m;
				let c_d = dt.getDate()+i;
				let new_date = c_d;
				if(c_d > days){
					a++;
					new_date = a;
					c_m = (m+1);
				}
				this.tabTimeArr.push(c_m+'-'+new_date);
			}
		},
		//清空数据
		emptyData(){
			this.goodName = "";
			this.insuredPrice = null;
			this.serviceNames = "";
			this.checkedAgree = false;
			this.$store.state.expressDeliveryInfo = {
				type: "", //寄件形式
				companyCode: "",//物流公司
				expectTime: "", //期望时间
				sendAddress: {}, //寄件地址
				repAddress: {},  //收件地址
				goodInfo: {}, //物品信息
				insuredPrice: {}, //保价
				service: {}, //增值服务
				carType: {}
			}
		}
	}
}
</script>
<style scoped>
@import '../../common/css/index/expressDelivery.css';
.create-confirm{
	background-color: #F7F7F7;
	padding-top: 20px;
}
.create-confirm .checkbox{
	margin: 0 10px;
}
.create-confirm .checkbox text{
	color: #4285f4;
}
.vehicle-type{
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	background-color: #FFFFFF;
}
.vehicle-type .title{
	background-color: #F5F5F5;
	text-align: center;
	padding: 10px 0;
}
.vehicle-type .swiper{
	height: 40px;
	line-height: 40px;
	padding: 0 10px;
}
.vehicle-type .swiper .swiper-item{
	text-align: center;
}
.vehicle-type .swiper .swiper-item.active{
	background-color: #5682E4;
	color: #FFFFFF;
}
.vehicle-type .form{
	max-height: 220px;
	overflow-y: auto;
}
.vehicle-type .form label{
	display: block;
	display: flex;
	align-items: center;
	padding: 10px 0;
	border-bottom: 1px solid #F5F5F5;
}
.vehicle-type .form label text{
	width: calc((100% - 50px) / 3);
	text-align: center;
}
.vehicle-type .form label text:last-child{
	width: 50px;
}
.vehicle-type .form label.tr-th{
	border-bottom: 1px solid #F5F5F5;
	color: #B1B1B1;
	font-size: 12px;
}
.vehicle-type .form label .iconfont{
	color: #FFFFFF;
}
.vehicle-type .form label.active .iconfont{
	color: #5783E6;
}
</style>
