<template>
	<view>
		<view class="new-info">
			<text class="title">最新信息：</text>
			<text class="content">{{newInfo.maintainDes}}</text>
		</view>
		<view class="type">
			<navigator url="/pages/me/feedbackList"><text class="optimize">程序近期优化汇报</text></navigator>
			<text>问题反馈类型</text>
		</view>
		<view class="item-list">
		    <view v-for="(item, i) in type" :key="i" v-bind:class="[submitData.Type==item?'active':'']" @click="navTab(item)">
				<text class="iconfont icon-dui"></text>
				<text>{{item}}</text>
		    </view>
		</view>
		<view class="textarea">
			<textarea maxlength="500" @input="textLength" placeholder="请详细描述您遇到的问题或者宝贵意见.." cursor-spacing="160" :show-confirm-bar="false" />
			<view class="camera">
				<image v-for="(item, index) in submitData.photoList" :key="index" mode="aspectFit" :src="item" class="subimg"></image>
				<view @click="uploadPhoto" class="iconfont icon-zhaoxiang"></view>
			</view>
			<text>{{submitData.Des.length}}/500</text>
		</view>
		<view class="bj"></view>
		<view class="input-phone">
			<text>手机号:</text>
			<input @blur="inputPhone" maxlength="11" type="number" v-model="submitData.Phone" />
		</view>
		<view class="bj"></view>
		<button class="submit" @click="submit">提交</button>
	</view>
</template>
<script>
import {feedBackApiUrl} from '../../common/js/config'
export default {
	data() {
		return {
			newInfo: [],
			token: "",
			type: ["功能异常","体验问题","功能建议","其他"],
			submitData: {
				Phone: "",
				Type: "功能异常",
				Des: "",
				photoList: []
			}
		}
	},
	created() {
		const that = this;
		that.token = uni.getStorageSync("token");
		uni.request({
			url: feedBackApiUrl + "/userinfo/getsysmaintainlist",
			header: { "token": that.token, "appId": that.appId },
			data: {page: 1, limit: 1},
			success: res => {
				if(res.data.code != 200){
					this.$util.showToast(res.data.msg);
					return false;
				}
				that.newInfo = res.data.data.modellist[0];
			},
			fail: (res) => {
				this.$util.showToast(res.data.msg);
			},
		});
	},
	methods: {
		navTab: function(_txt){
			this.submitData.Type = _txt;
		},
		textLength: function(e){
			this.submitData.Des = e.detail.value;
		},
		inputPhone: function(e){
			var _txt = e.detail.value;
			if(!/^1[34578]\d{9}$/.test(_txt)){
				_txt = "";
				this.$util.showToast("请输入正确的手机号");
			}
			this.submitData.Phone = _txt;
		},
		uploadPhoto: function(){
			let that = this;
			var phoneArr = that.submitData.photoList;
			if(phoneArr.length >= 2){
				that.$util.showToast("最多上传2张照片");
				return false;
			}
			uni.chooseImage({
				sizeType: ['original', 'compressed'],
				count: 1,
				success: (chooseImageRes) => {
					//图片不能超过2mb 2097152
					if(chooseImageRes.tempFiles[0].size > 2097152){
						that.$util.showToast("图片不能超过2mb");
						return false;
					}
					const tempFilePaths = chooseImageRes.tempFilePaths;
					uni.uploadFile({
						url: feedBackApiUrl + '/userinfo/wxupdateimage', //仅为示例，非真实的接口地址
						filePath: tempFilePaths[0],
						name: 'update_file',
						header: { "token": that.token, "appId": that.appId },
						formData: {'fileType': 'TieImage'},
						success: (res) => {
							let data = JSON.parse(res.data);
							if(data.code == 200){
								phoneArr.push(data.data.imgPath)
								that.submitData.photoList = phoneArr;
								uni.showToast({  
									title: '上传成功',  
									icon: 'success',  
									mask: true,  
									duration: 2000  
								});
							}else{
								that.$util.showToast(data.msg);
							}
						},
						fail: (res)=> {
							uni.showModal({
								title: '上传失败',
								content: JSON.stringify(res),
								showCancel: false,
							});
						},
					});
				},
				fail: (res)=> {
					that.$util.showToast(res.errMsg);
				}
			});
		},
		submit: function(){
			const that = this;
			var parmes = that.submitData;
			if(parmes.Des == ""){
				that.$util.showToast("请描述您遇到的问题或者宝贵意见");
				return false;
			}
			uni.showLoading({ title: '加载中...' });
			uni.request({
				url: feedBackApiUrl + "/userinfo/postuserproblem",
				method: 'POST',
				header: { "token": that.token, "appId": that.appId },
				data: parmes,
				success: res => {
					uni.hideLoading();
					if(res.data.code == 200){
						that.$util.navigateBack(that);
					}else{
						that.$util.showToast(res.data.msg);
					}
				},
				fail: (res) => {
					uni.hideLoading();
					that.$util.showToast(res.data.msg);
				},
			});
		}
	}
}
</script>
<style scoped>
.new-info{
	background: #50a8ff;
	padding: 15px;
	display: flex;
	display: -webkit-flex;
	margin-top: -1px;
}
.new-info text{
	padding: 5px 0;
	display: block;
	border-top: 1px solid #fff;
	border-bottom: 1px solid #fff;
}
.subimg{
	width:70px;
height:70px;
	    margin-right: 10px;
	
}
.new-info .title{
	width: 85px;
	padding-left: 10px;
	background: #cee7ff;
	border-left: 1px solid #fff;
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}
.new-info .content{
	width: calc(100% - 115px);
	width: -webkit-calc(100% - 115px);
	background: #a9d4ff;
	padding: 5px 10px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
	border-right: 1px solid #fff;
}
.type{
	background: #f7f7f7;
	padding: 15px;
	color: #999;
	position: relative;
}
.optimize{
	position: absolute;
	right: 15px;
	top: 14px;
	color: #e95e00;
	background: #fff;
	padding: 2px 10px;
	border-radius: 15px;
}
.item-list{
	display: flex;
	display: -webkit-flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	padding: 15px;
}
.item-list view{
	border: 1px solid #f0f0f0;
	width: 23%;
	text-align: center;
	display: flex;
	display: -webkit-flex;
	flex-flow: row wrap;
	justify-content: center;
	align-items: center;
	padding: 5px 0;
	border-radius: 3px;
}
.item-list .iconfont{
	display: none;
}
.item-list .active{
	color: #f00;
	border-color: #f00;
}
.item-list .active .iconfont{
	display: block;
}
.textarea{
	border: 1px solid #f0f0f0;
	margin: 0 15px 15px;
	padding: 10px;
	position: relative;
}
.textarea textarea{
	font-size: 15px;
	width: 100%;
	height: 150px;
	display: block;
	margin-bottom: 10px;
	line-height: 20px;
}
.textarea .camera{
	height: 80px;
}
.textarea .camera > view,
.textarea .camera image{
	width: 70px;
	height: 70px;
	border: 1px solid #f0f0f0;
	margin-right: 10px;
	display: block;
	float: left;
	text-align: center;
}
.textarea .camera > view{
	font-size: 40px;
	line-height: 70px;
}
.textarea text{
	position: absolute;
	right: 10px;
	bottom: 5px;
}
.input-phone{
	font-size: 15px;
	line-height: 30px;
	padding: 10px 15px;
	display: flex;
	display: -webkit-flex;
}
.input-phone input{
	width: 60%;
	height: 30px;
	padding-left: 5px;
	margin-left: 10px;
	background: #f0f0f0;
}
.submit{
	background: #50a8ff;
	color: #fff;
	margin: 15px;
	font-size: 15px;
	padding: 3px 0;
}
.bj{
	height: 10px;
	background: #f7f7f7;
}
</style>
