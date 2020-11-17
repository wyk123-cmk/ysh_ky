<template>
	<view class="page-bg" style="background-color: #FFFFFF;">
		<page-imges :show="showImage"></page-imges>
		<view class="form-item-list row goods-name column-r">
			<view class="row">
				物品名称<text class="red">（必填）</text>
				<input type="text" placeholder="输入物品名称" v-model="goodName" @input="goodNameInput" />
			</view>
			<text class="often" @click="isOftenGoods=true;goodsNameList = []">常寄物品</text>
		</view>
		<view v-if="goodsNameList.length != 0">
			<view class="v-model"></view>
			<view class="good-name-list">
				<text v-for="(item, i) in goodsNameList" :key="i" @click="btnGetGoodName(item.goodsName)">{{item.goodsName}}</text>
			</view>
		</view>
		<view class="form-item-list row column-r">
			物品类型
			<picker class="picker-box" :range="stdmodeArray" @change="stdmodeChange">
				{{goodType}}
				<text class="iconfont icon--right-jian"></text>
			</picker>
		</view>
		<view class="form-item-list row column-r">
			包装材质
			<picker class="picker-box" :range="materialArray" @change="materialChange">
				{{materialTxt==""?"纸、纤、木箱等":materialTxt}}
				<text class="iconfont icon--right-jian"></text>
			</picker>
		</view>
		<view class="form-item-list">
			寄件备注
			<view class="textarea-text" v-if="goodsNameList.length != 0||isOftenGoods">{{goodMemo==""?"寄件备注仅自己可见，当发货量大时，方便财务统计":goodMemo}}</view>
			<textarea v-else placeholder="寄件备注仅自己可见，当发货量大时，方便财务统计" v-model="goodMemo" cursor-spacing="100" :show-confirm-bar="false"></textarea>
		</view>
		<view class="form-item-list row column-r">
			寄件数量
			<view class="compute row">
				<text class="subtract" @click="computeNum(0)">-</text>
				<input class="num" type="number" v-model="txtnum" />
				<text class="add" @click="computeNum(1)">+</text>
			</view>
		</view>
		<view class="form-item-list predict row column-r">
			<view>
				预估重量<text class="red">（必填）</text>
				<text class="note">最终重量以快递员核算为准</text>
			</view>
			<view class="compute row">
				<text @click="computeWeight(0)">-</text>
				<input class="num" type="number" v-model="txtweight" />kg
				<text class="add" @click="computeWeight(1)">+</text>
			</view>
		</view>
		<view class="form-item-list row column-r-t" v-if="type == 'big'">
			体积填写
			<view>
				<view class="volume">
					<input type="number" placeholder="长" v-model="txtLong" />
					<text class="unit">cm</text>
					<text class="f-h">*</text>
					<input type="number" placeholder="宽" v-model="txtWidth" />
					<text class="unit">cm</text>
					<text class="f-h">*</text>
					<input type="number" placeholder="高" v-model="txtheight" />
					<text class="unit">cm</text>
				</view>
				<view class="volume total">
					总体积：
					<input type="digit" placeholder="0.000" v-model="volume" />
					<text class="unit">m³</text>
				</view>
			</view>
		</view>
		<view class="form-item-list">
			给快递员捎话
			<view class="textarea-text" v-if="goodsNameList.length != 0||isOftenGoods">{{takeTxt==""?"给小哥捎句话吧……":takeTxt}}</view>
			<textarea v-else placeholder="给小哥捎句话吧……" v-model="takeTxt" cursor-spacing="100" :show-confirm-bar="false"></textarea>
			<view class="take row column-r">
				<view>
					<text class="btn" :class="{ packActive: ispack === true }" @click="btnIsPack">带纸箱</text>
					<text class="btn" :class="{ packActive: isjd === true }" @click="btnIsjd">带胶带</text>
					<text class="btn" :class="{ packActive: islink === true }" @click="btnIslink">上门前联系</text>
				</view>
				<text>注意：纸箱需额外收费</text>
			</view>
		</view>
		<view class="tips red">注：因平台相关优惠折扣与物流产品相关，为确保您可享受平台便利，望合理填写产品重量及体积，预估与实际重量差距过大会产生无折扣订单，敬请留意！</view>
		<button class="btn-default-css" @click="btnSumit">确定</button>
		<view v-if="isOftenGoods">
			<view class="v-model" style="top: 0" @click="isOftenGoods=false"></view>
			<view class="often-goods-main">
				<view class="title">常寄物品<text class="iconfont icon-quxiao"  @click="isOftenGoods=false"></text></view>
				<view v-if="total == 0" style="padding: 10px 15px;color: #999999;">暂无常用物品</view>
				<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
					<view class="often-goods-list" v-for="(item, i) in dataList" :key="i">
						<radio-group class="radio" @change="radioChange">
							<radio color="#4285f4" :value="String(item.goodsCode)" :checked="item.goodsCode === current" />
						</radio-group>
						<view class="info">
							<text class="other">{{item.goodsName}}</text>
							<view class="">
								<text>重量：{{item.goodsWeight}}kg</text>
								<text>体积：{{item.goodsVolume}}m³</text>
								<text>保￥{{item.insurance}}</text>
							</view>
						</view>
						<text class="iconfont icon-shanchu" @click="goodsDelete(item.goodsCode)"></text>
					</view>
				</scroll-view>
				<button class="btn-default-css" @click="btnPreserve">确定</button>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			type: "",
			goodName: "",
			stdmodeArray: ["仪器整机","仪器设备","试剂耗材","化玻设备","实验家具","其他"],
			goodType: "",
			materialArray: ['纸', '纤', '木箱', '木架', '托膜', '托木'],
			materialTxt: "",
			goodsNameList: [],
			takeTxt: "",
			txtheight: "",
			txtWidth: "",
			txtLong: "",
			goodMemo: "",
			txtnum: 1,
			txtweight: "",
			volume: "",
			ispack: false,
			isjd: false,
			islink: false,
			isOftenGoods: false,
			current: "",
			page: 1,
			limit: 10,
			total: 0,
			dataList: [],
			code: "",
		}
	},
	onLoad(options){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.type = options.type;
		if(options.type == "small"){
			this.stdmodeArray = ["文件","仪器整机","仪器设备","试剂耗材","化玻设备","其他"];
		}
		this.code = options.code;
		let goodInfoData = this.$store.state.expressDeliveryInfo.goodInfo;
		if(JSON.stringify(goodInfoData) != "{}"){
			this.goodType = goodInfoData.packType;
			this.materialTxt = goodInfoData.packageservice;
			this.goodName = goodInfoData.goodName;
			this.txtweight = goodInfoData.weigth;
			this.txtWidth = goodInfoData.width;
			this.txtheight = goodInfoData.height;
			this.txtLong = goodInfoData.long;
			this.volume = goodInfoData.cubic;
			this.takeTxt = goodInfoData.remark;
			this.txtnum = goodInfoData.goodNum;
			this.goodMemo = goodInfoData.goodMemo;
		}else{
			this.goodType = this.stdmodeArray[0]; //物品类型
		}
		//获取常寄物品
		this.page = 1;
		this.dataList = [];
		this.getGoodsList();
	},
	computed: {
		txtCubic1: function() {
			try {
				let long = Number(this.txtLong);
				let height = Number(this.txtheight == "" ? 0 : this.txtheight);
				let width = Number(this.txtWidth == "" ? 0 : this.txtWidth);
				let cubicMeter = (long * height * width) / 1000000;
				return cubicMeter;
			} catch (e) {}
		}
	},
	watch: {
		txtCubic1(val){
			this.volume = val > 0 ? val : 0;
		},
		txtweight(val) {
			if (val !== "") {
				if (this.txtweight <= 1) {
					this.txtweight = 1;
				}
				if (this.type === "small") {
					if (this.txtweight >= 20) {
						this.txtweight = 20;
					}
				}
			}
		}
	},
	methods: {
		//确定
		btnSumit: function(){
			if(!this.Valid()) return false;
			let param = {
				packType: this.goodType, //物品类型
				packageservice: this.materialTxt, //包装材质
				goodName: this.goodName, //物品名称
				weigth: this.txtweight, //预估重量
				width: this.txtWidth, //体积填写宽
				height: this.txtheight, //体积填写高
				long: this.txtLong, //体积填写长
				cubic: this.volume, //总体积
				remark: this.takeTxt, //给快递员捎话
				goodNum: this.txtnum, //寄件数量
				goodMemo: this.goodMemo //寄件备注
			}
			this.$store.state.expressDeliveryInfo.goodInfo = param;
			this.$util.navigateBack(this);
		},
		//物品名称
		btnGetGoodName: function(val){
			this.goodName = val;
			this.goodsNameList = [];
		},
		//物品类型
		stdmodeChange: function(e){
			this.goodType = this.stdmodeArray[e.detail.value];
		},
		//包装材质
		materialChange: function(e){
			this.materialTxt = this.materialArray[e.detail.value];
		},
		//寄件数量
		computeNum(key){
			if(key == 0){
				if(this.txtnum <= 1) return false;
				this.txtnum --;
			}else{
				this.txtnum ++;
			}
		},
		//预估重量
		computeWeight(key){
			if(key == 0){
				if(this.txtweight <= 1) return false;
				this.txtweight --;
			}else{
				this.txtweight ++;
			}
		},
		btnIsPack() {
			if (this.ispack) {
				this.takeTxt = this.takeTxt.replace("请带纸箱 ", "");
			} else {
				this.takeTxt += "请带纸箱 ";
			}
			this.ispack = !this.ispack;
		},
		btnIsjd() {
			if (this.isjd) {
				this.takeTxt = this.takeTxt.replace("请带胶带 ", "");
			} else {
				this.takeTxt += "请带胶带 ";
			}
			this.isjd = !this.isjd;
		},
		btnIslink() {
			if (this.islink) {
				this.takeTxt = this.takeTxt.replace("上门前联系 ", "");
			} else {
				this.takeTxt += "上门前联系 ";
			}
			this.islink = !this.islink;
		},
		radioChange: function(evt){
			this.current = evt.target.value;
		},
		//确定
		btnPreserve: function(){
			const that = this;
			if(that.current == "") return false;
			that.dataList.forEach(function(item,i){
				if(that.current == item.goodsCode){
					that.goodType = item.goodsCategory;
					that.materialTxt = item.packageservice==null?"":item.packageservice;
					that.goodName = item.goodsName;
					that.txtweight = item.goodsWeight;
					that.takeTxt = item.remark == null?"":item.remark;
					that.goodMemo = item.memo == null?"":item.memo;
					that.isOftenGoods = false;
					if(item.insurance != "" && item.insurance != null){
						that.setPrice(item.insurance);
					}
				}
			})
		},
		setPrice: function(val){
			const that = this;
			that.$util.networkRequest({
				url : "/Price/InsuranceNewPrice",
				method: "POST",
				data: {
					companyCodeList: [that.code],
					amount: val,
					expressType: that.type
				},
				success : function(res){
					let data = {
						price: res[0].ratioAmount,
						amount: val,
						code: that.code
					}
					that.$store.state.expressDeliveryInfo.insuredPrice = data;
					uni.setStorage({key: 'insuredPrice', data: JSON.stringify(data)});
				}
			});
		},
		//删除常寄物品
		goodsDelete: function(_code){
			const that = this;
			uni.showModal({
			    title: '提示',
			    content: '您确定要删除吗？',
			    success: function (res) {
			        if (res.confirm) {
						that.$util.networkRequest({
							url: "/CommonGoods/Delete",
							data: {value: _code},
							method: "POST",
							success: function(res){
								uni.showToast({
								    title: '删除成功',
									 duration: 2000,
									 icon:'none',
								});
								that.dataList = that.dataList.filter(item => {
									return item.goodsCode != _code;
								});
							}
						});
					}
				},
			});
		},
		//关键字搜索物品名称
		goodNameInput: function(e){
			let val = e.detail.value;
			let that = this;
			if(val == ""){
				that.goodsNameList = [];
				return false;
			}
			that.$util.networkRequest({
				url : "/GoodsName/GetGoodsNameList",
				data: {goodsName: val},
				success : function(res){
					that.goodsNameList = res;
				}
			})
		},
		//常寄物品
		scrolltolower: function(){
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getGoodsList();
			}
		},
		getGoodsList: function(){
			let that = this;
			that.$util.networkRequest({
				url : "/CommonGoods/GetPageList",
				data: {page: that.page, limit: that.limit},
				success : function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					that.page++;
					that.total = total;
					that.dataList = that.dataList.concat(res.list);
				}
			})
		},
		Valid(){
			if(!this.$util.isNotEmpty(this.goodName)){
				this.$util.showToast("物品名称不能为空");
				return false;
			}
			if(!this.$util.isNotEmpty(this.txtweight)){
				this.$util.showToast("预估重量不能为空");
				return false;
			}
			if(this.type == "big"){
				if(this.txtweight < 20){
					this.$util.showToast("大件重量不得小于20公斤，小件寄快递更实惠");
					return false;
				}
			}else{
				if(this.txtweight > 20){
					this.$util.showToast("小件重量不得大于20公斤，大件寄快递更实惠");
					return false;
				}
			}
			return true;
		}
	}
}
</script>
<style scoped>
	@import url("../../common/css/index/goodsInfo.css");
</style>