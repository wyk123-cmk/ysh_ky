<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<text class="iconfont icon-add-cy" @click="addMember"></text>
		<view class="search">
			<text class="iconfont icon-chaxun"></text>
			<input type="text" placeholder="搜索" v-model="keyword" @input="search" />
		</view>
		<scroll-view  v-if="keyword!=''" class="scroll-wrapper" scroll-y="true" @scrolltolower="searchScrolltolower()">
			<view class="list-call admin" v-for="(item, i) in dataList" :key="i" @click="actionSheet(i,item.id,item.department,item.userName,item.phone)">
				<text>{{item.userName}}</text>
				<text class="phone">{{item.phone}}</text>
				<text class="state" v-if="item.isMaster">管理员</text>
			</view>
		</scroll-view>
		<view v-if="keyword==''">
			<view class="list-call admin">
				<text>{{masterName}}</text>
				<text class="phone">{{masterPhone}}</text>
				<text class="state">管理员</text>
			</view>
			<view v-if="classifyData.length == 0" class="none-data-list"><image src="../../static/images/none-ry.svg"></image>暂无内容</view>
			<view v-else v-for="(item, i) in classifyData" :key="i">
				<view class="menu-list" @click="classifyClick(i, item.cmpyUserCount)">
					<view class="branch"><text>{{item.departMentName}}</text>({{item.cmpyUserCount}})</view>
					<text v-if="item.cmpyUserCount>0" :class="item.show?'icon-shouqi':'icon-arrow-up'" class="iconfont"></text>
				</view>
				<scroll-view v-if="item.show" class="menu-sub" scroll-y="true" @scrolltolower="scrolltolower(i, item.page, item.cmpyUserCount)">
					<view class="list-call" v-for="(sub, k) in item.subList" :key="k" @click="actionSheet(i,sub.id,sub.department,sub.userName,sub.phone)">
						<text>{{sub.userName}}</text>
						<text class="phone">{{sub.phone}}</text>
						<text class="state" v-if="sub.isMaster">管理员</text>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- #ifdef H5 -->
		<view ref="inputFile" style="display: none;"></view>
		<!-- #endif -->
		<view class="actionSheet">
		  <view class="v-model" @click="closeMaster" v-if="isShowSheet"></view>
		  <view class="action-sheet-menu" :style="{'height': h,'bottom':'-'+h}" :animation="animationData">
			  <view class="action-sheet-cell" v-for="(item, i) in sheetList" :key="i" @click="sheetMenuClick(i, item)">
				  {{item.txt}}
				  <text class="note" v-if="item.txt=='批量上传文档'">请上传含有姓名、手机号、部门的EXCEL文档</text>
			  </view>
		    <view class="action-sheet-action action-sheet-cell" @click="closeMaster">取消</view>
		  </view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			keyword: "",
			classifyData: [],
			masterName: "",
			masterPhone: "",
			limit: 12,
			searchPage: 1,
			searchTotal: 0,
			dataList: [],
			token: "",
			type:"",
			isShowSheet: false,
			animationData: {},
			h: 0,
			sheetList: []
		}
	},
	onLoad(options){
		this.type=options.type;
		this.token = uni.getStorageSync('token');
		this.animation = uni.createAnimation();
		this.showImage = getApp().globalData.isDiscountPopup;
	},
	onShow(){
		this.keyword = "";
		this.searchPage = 1;
		this.dataList = [];
		this.getCmpyUserDepartment();
		this.closeMaster();
	},
	mounted() {
		const that = this;
		// #ifdef H5
		var input = document.createElement('input');//创建元素
		input.type = 'file'; //添加file类型
		input.accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		input.onchange = (event) => {
			that.uploadFileH5(input, event);
		}
		that.$refs.inputFile.$el.appendChild(input);
		//#endif
	},
	methods: {
		//搜索
		search: function(e){
			this.keyword = e.detail.value;
			this.searchPage = 1;
			this.dataList = [];
			if(this.keyword == "") return false;
			this.getSearch();
		},
		//搜索成员列表
		searchScrolltolower: function(){
			if(Math.ceil(this.searchTotal / this.limit) >= this.searchPage){
				this.getSearch();
			}
		},
		getSearch: function(){
			const that = this;
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/CompanyUser/GetList",
				data: {
					page: that.searchPage,
					limit: that.limit,
					keyWord: that.keyword,
					department: ""
				},
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					that.searchPage++;
					that.searchTotal = total;
					that.dataList = that.dataList.concat(res.list);
				}
			})
		},
		//添加成员
		addMember: function(){
			this.sheetList = [
				{txt: "批量上传文档", index: null},
				{txt: "添加成员", index: null}
			]
			this.showMaster();
		},
		//获取企业部门列表
		getCmpyUserDepartment: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/CompanyUser/GetCmpyUserDepartment",
				success: res => {
					res.departmentLsit.forEach(item => {
						item["show"] = false;
						item["page"] = 1;
						item["subList"] = [];
					})
					that.classifyData = res.departmentLsit;
					that.masterName = res.masterName;
					that.masterPhone = res.masterPhone;
				}
			});
		},
		//是否显示当前部门下的成员
		classifyClick: function(index, num){
			if(num <= 0) return false;
			(this.classifyData).forEach((item, i) => {
				if(i == index){
					item.show = !item.show;
				}else{
					item.show = false;
				}
			});
			if(this.classifyData[index].subList.length==0){
				this.getMemberList(index);
			}
		},
		//下拉加载
		scrolltolower: function(index, currentPage, currentTotal){
			if(Math.ceil(currentTotal / this.limit) >= currentPage){
				this.getMemberList(index);
			}
		},
		//获取成员
		getMemberList(index){
			let that = this;
			let currentJson = this.classifyData[index];
			that.$util.networkRequest({
				url: "/CompanyUser/GetList",
				data: {
					page: currentJson.page,
					limit: that.limit,
					keyWord: "",
					department: currentJson.departMentName
				},
				success: res => {
					currentJson.subList = currentJson.subList.concat(res.list);
					currentJson.page++;
				}
			});
		},
		actionSheet: function(index,id,department,name,phone){
			if(this.type==2){
				this.$store.state.expressDeliveryInfo.busName = name;
					this.$store.state.expressDeliveryInfo.busPhone = phone;
					uni.navigateBack({
						
					})
				// uni.navigateTo({
				// 	url:"/pages/index/expressDelivery?phone="+phone+"&name="+name
				// })
			}
			else{
				this.sheetList = [
					{txt: "设置管理员", index: index, id: id, department: department},
					{txt: "移至部门", index: index, id: id, department: department},
					{txt: "删除", index: index, id: id, department: department},
				]
				this.showMaster();
			}
			
		},
		//设置管理员
		setAdmin: function(id){
			const that = this;
			that.$util.networkRequest({
				url : "/CompanyUser/SetMaster",
				method: "POST",
				data: {value: id},
				success: function(res){
					that.searchPage = 1;
					that.dataList = [];
					that.getSearch();
					that.getCmpyUserDepartment();
					that.$util.showToast("管理员设置成功");
				}
			});
		},
		//删除
		deleteAdmin:  function(index, id) {
			const that = this;
			if(id<= 0){
				that.$util.showToast("请选择删除的员工信息")
			}else{
				uni.showModal({
				    title: '提示',
				    content: '确定要删除吗?',
					success: function (res) {
						if(res.confirm){
							uni.showLoading({ mask: true, title: '正在删除...' });
							that.$util.networkRequest({
								url : "/CompanyUser/DelUser",
								method: "POST",
								data: JSON.stringify([id]),
								success: function(res){
									that.searchPage = 1;
									that.dataList = [];
									that.getSearch();
									that.getCmpyUserDepartment();
									that.$util.showToast("删除成功");
								}
							})
						}
					}
				});
			}
		},
		//小程序上传文件
		uploadFileWX: function(){
			const that = this;
			wx.chooseMessageFile({
			  type: "file",
			  success (res) {
					let tempFlies = res.tempFiles;
					let bool = true;
					let fileTxt = "";
					tempFlies.forEach(function(item){
						let _split = item.name.split('.');
						let _suffix = _split[(_split.length-1)];
						if(_suffix == "xlsx"){
							that.$util.ajaxUploadFile({
								formData: {
									FileName: "CmpyUser",
									UploadType: 11,
									SuffixName: ("."+_suffix),
								},
								filePath: item.path,
								name: item.name
							},function(data){
								that.callBack(data);
							});
						}else{
							fileTxt += (fileTxt + item.name + "、");
							bool = false;
						}
					})
					if(!bool){
						fileTxt = fileTxt.substring(0, fileTxt.length - 1);  
						uni.showModal({
						    title: '提示',
						    content: "目前文件仅支持xlsx上传,\n"+fileTxt+"上传失败!",
							showCancel: false,
						});
					}
				}
			})
		},
		//H5上传文件
		uploadFileH5: function(input, event){
			const that = this;
			let file = input.files[0];
			let _name = file.name;
			let _split = _name.split('.');
			let suffix = '.'+_split[(_split.length-1)];
			uni.uploadFile({
				url: that.apiUrl + '/Account/UploadFileWeb',
				header: { "token": that.token, "appId": that.appId },
				formData: {
					"FileName": "CmpyUser",
					"UploadType": 11,
					"SuffixName": suffix
				},
				files: [
					{
						name: "update_file",
						file: file,
						uri: event.srcElement.value
					}
				],
				success: (res) => {
					input.value = "";
					let data = JSON.parse(res.data);
					if(data.errCode == 200){
						that.callBack(data);
					}else{
						that.$util.showToast(data.message)
					}
				},
				fail: (err) => {
					input.value = "";
					console.log(err)
				}
			});
		},
		callBack(data){
			const that = this;
			that.$util.networkRequest({
				url : "/CompanyUser/ImprotCmpyUser",
				method: "POST",
				data: {url: data.data},
				success: function(res){
					that.searchPage = 1;
					that.dataList = [];
					that.getSearch();
					that.getCmpyUserDepartment();
					that.$util.showToast("共"+res.total+"条数据,导入成功!");
				}
			});
		},
		showMaster(){
		  //创建动画  展开
		  this.isShowSheet = true;
		  this.h = (46*Number(this.sheetList.length)+51)+"px";
		  if(this.sheetList[0].txt == "批量上传文档"){
			  this.h = 160+"px";
		  }
		  this.animation.translateY("-"+this.h).step();
		  this.animationData = this.animation.export();
		},
		closeMaster(){
		  var that = this;
		  this.animation.translateY("100%").step();
		  this.animationData = this.animation.export();
		  this.isShowSheet = false;
		},
		sheetMenuClick(tapIndex, item){
			this.closeMaster();
			if(item.index == null){
				if(tapIndex == 0){
					// #ifdef H5
					this.$refs.inputFile.$el.getElementsByTagName('input')[0].click();
					//#endif
					// #ifdef MP-WEIXIN
					this.uploadFileWX();
					// #endif
				}
				if(tapIndex == 1){
					uni.navigateTo({
						url: "/pages/me/addMember"
					})
				}
			}else{
				if(tapIndex == 0){
					this.setAdmin(item.id);
				}
				if(tapIndex == 1){
					uni.navigateTo({
						url: "moveDepartment?id="+item.id+"&department="+encodeURIComponent(item.department)
					})
				}
				if(tapIndex == 2){
					this.deleteAdmin(item.index, item.id);
				}
			}
		},
	}
}
</script>
<style scoped>
.iconfont.icon-add-cy{
	position: fixed;
	right: 0;
	z-index: 998;
	color: #4385f5;
	font-size: 20px;
	padding: 10px;
}
/* #ifdef H5 */
.iconfont.icon-add-cy{
	top: 0;
}
/* #endif */
/* #ifdef MP-WEIXIN */
.iconfont.icon-add-cy{
	bottom: 20%;
	font-size: 30px;
}
/* #endif */
.search{
	border-top: 1px solid #F7F7F7;
	display: box;
	display: -webkit-box;
	padding: 10px 15px;
	line-height: 34px;
	background-color: #FFFFFF;
}
.search text{
	background-color: #F7F7F7;
	display: block;
	width: 30px;
	text-align: center;
	border-top-left-radius: 20px;
	border-bottom-left-radius: 20px;
}
.search input{
	height: 34px;
	line-height: 34px;
	background-color: #F7F7F7;
	width: calc(100% - 30px);
	width: -webkit-calc(100% - 30px);
	border-top-right-radius: 20px;
	border-bottom-right-radius: 20px;
}
.list-call,
.menu-list{
	display: flex;
	display: -webkit-flex;
	background-color: #FFFFFF;
	padding: 10px 15px;
	align-items: center;
	line-height: 26px;
	border-bottom: 1px solid #F7F7F7;
}
.list-call text:first-child{
	max-width: 58%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.list-call .state{
	background: #fd9523;
	color: #fff;
	font-size: 12px;
	line-height: 20px;
	padding: 0 3px;
	border-radius: 3px;
}
.list-call .phone{
	color: #999999;
	padding: 0 5px;
}
.admin{
	margin: 8px 0;
}
.menu-list{
	justify-content: space-between;
	border-color: #eaeaea;
}
.menu-list .branch{
	font-weight: bold;
	width: 93%;
}
.menu-list .branch text{
	max-width: 80%;
	display: block;
	float: left;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.menu-list .iconfont{
	float: right;
	color: #999999;
	font-size: 14px;
}
.menu-sub{
	border-bottom: 1px solid #eaeaea;
	max-height: 300px;
	overflow-y: auto;
}
.menu-sub .list-call:last-child{
	border: 0;
}
.scroll-wrapper{
	position: absolute;
	top: 53px;
	left: 0;
	right: 0;
	bottom: 0;
}
.action-sheet-menu{
	background-color: #FFFFFF;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
}
.action-sheet-cell{
	padding: 10px 0;
    text-align: center;
    font-size: 18px;
	border-bottom: 1px solid #e5e5e5;
	color: #000;
}
.action-sheet-cell.action-sheet-action{
	border-top: 6px solid #efeff4;
}
.action-sheet-cell .note{
	font-size: 12px;
	color: #999999;
	display: block;
}

</style>
