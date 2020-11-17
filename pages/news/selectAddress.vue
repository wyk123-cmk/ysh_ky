<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<!-- #ifdef H5 -->
		<view class="head-right" @click="Enter()">确定({{num}})</view>
		<!-- #endif -->
		<view class="ser_suo">
			<view class="search-btn" >
				<input type="text" v-model="keyword" @input="inputSearch" class="inp_op" placeholder="请输入姓名/电话/公司" />
				<text class="iconfont icon-chaxun"></text>
			</view>
		</view>
		<scroll-view class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="invoice-item-list" v-for="(item,index) in companyList" :key="index" @click="checkboxChange(index)">
				<checkbox-group class="checkbox-radio">
					<view class="chek_view" >
						<checkbox v-if="item.isShare" checked="true" disabled="true" class="checkbox_gray"/>
						<checkbox :checked="item.isCheck" :value="item.id" class="checkbox-qx" v-else/>
						<view class="menm">
							<view class="addres_inf">
								{{item.name}}<text>{{item.phone}}</text>
							</view>
							<view class="desc_add">{{item.areaInfo.province+item.areaInfo.city+item.areaInfo.area+item.address}}</view>
						</view>
					</view>
				</checkbox-group>
			</view>
		</scroll-view>
		<!-- #ifdef MP-WEIXIN -->
			<text class="wanc_mp" @click="Enter()">确定({{num}})</text>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				t: 0,
				h: 44,
				companyPage: 1,
				limit: 10,
				keyword: "",
				num:0,
				total:0,
				checkData:[],
				isChoose:false,
				companyList: [ ],
				serviceKey:"",
			}
		},
		created() {
		
		
		},
		onShow() {
			this.showImage = getApp().globalData.isDiscountPopup;
			this.init();
		},
		methods: {
			init(){
				const that = this;
				that.getList(that.companyPage, 1, function(res){
					that.companyPage++;
					that.total = res.total;
					(res.list).forEach(item => {
						item["isCheck"] = false;
					})
					that.companyList = that.companyList.concat(res.list);
				})
			},
			getList: function(page, type, callback){
				const that = this;
				uni.showLoading({ title: '加载中...' });
				that.$util.networkRequest({
					url: "/AddressBook/GetListByPage",
					data: {
						page: page,
						limit: that.limit,
						bookType: type, //1=个人2=企业
						keyword: that.keyword
					},
					success: function(res){
						let total = res.total;
						if(total == 0 || res.list.length == 0) return false;
						if(callback) callback(res);
					}
				})
			},
			scrolltolower(){
				if (Math.ceil(this.total / this.limit) >= this.companyPage) {
					this.init();
				}
			},
			inputSearch(e){
				this.keyword=e.detail.value;
				this.companyPage=1;
				this.companyList=[];
				this.init();
			},
			checkboxChange(key){
				let item = this.companyList[key];
				if(!item.isCheck){
					this.companyList[key].isCheck = true;
					this.checkData.push(parseInt(item.id));
				}else{
					this.companyList[key].isCheck = false;
					this.checkData = this.checkData.filter(el => {
						return el!= item.id;
					});
				}
				this.num = this.checkData.length;
			},
			Enter(){
				let that = this;
				let param = this.checkData;
					
				that.$util.networkRequest({
					url: "/AddressBook/batchShareAddress",
					data: {
						idList:param
						},
					method: "POST",
					success: res => {
						if(res){
							that.$util.navigateBack(that)
						}
						// this.memList = res;
					}
				})
			}
		}
	}
</script>

<style scoped>
.scroll-wrapper{
	position: absolute;
	top: 55px;
	left: 0;
	right: 0;
	bottom: 0;
	overflow-y: auto;
}
	
	/* #ifdef MP-WEIXIN */
	.scroll-wrapper{
		bottom: 45px;
	}
	/* #endif */
.addres_inf{
	font-size:15px;
	color:black;
	
}
.addres_inf text{
	font-size:14px;
	color:#666666;
	margin-left: 15px;
}
.menm {
		background-color: #FFFFFF;
		/* padding: 10px 15px; */
		font-size: 15px;
		width: 80%;
		
		display: flex;
		flex-direction: column;
		line-height: 22px;
		position: relative;
	}

	.menm text {
		color: #666666;
		margin-left: 20px;
		margin-right: auto;
	}

.desc_add{
	font-size:14px;
	color:black;
	width:90%;
}

	.chek_view {
		background-color: #FFFFFF;
		padding: 10px 15px;
		font-size: 15px;
		margin-top: 10px;
		display: flex;
		align-items: center;
	}

	.dianhua {
		color: #666666;
		margin-left: 20px;
	}

	.ser_suo {
		background-color: #FFFFFF;
		padding: 10px 0px;
	}

	.search-btn {
		height: 35px;
		display: flex;
		display: -webkit-flex;
		background: #f7f7f6;
		margin: 0 15px;
		border-radius: 15px;
		align-items: center;
		justify-content: flex-start;
		color: #999;
		position: relative;
	}

	.inp_op {
		position: absolute;
		left: 30px;
	}

	.search-btn .iconfont {
		padding-right: 5px;
		color: #999;
		padding-left: 10px;
	}

	.wanc_mp{
		position: fixed;
		bottom: 10px;
		background-color: #007AFF;
		color: #FFFFFF;
		font-size: 13px;
	
		height: 35px;
		line-height: 35px;
		text-align: center;
		border-radius: 3px;
		
		width: 90%;
		display: block;
		
		left: 5%;
		
		}
</style>
