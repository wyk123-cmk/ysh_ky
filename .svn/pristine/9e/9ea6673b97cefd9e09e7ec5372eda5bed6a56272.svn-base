<template>
	<view class="containers">
		<view class="top_tit">您对产品和服务满意吗 ？</view>
		<view class="top_tit_con">您的建议和鼓励会帮助我们做的更好</view>
		<view class="img_pj">
			<view class="manyi_pi">
				<image :src="henhaoImg" @click="ToggleImg(1)"></image>
				<text>很好</text>
			</view>
			<view class="manyi_pi">
				<image :src="manyiImg"  @click="ToggleImg(2)"></image>
				<text>满意</text>
			</view>
			<view class="manyi_pi">
				<image :src="nomanyiImg"  @click="ToggleImg(3)"></image>
				<text>不满意</text>
			</view>
		</view>
		<view class="yijian">
		<textarea class="tear" placeholder="意见及建议" v-model="remark" cursor-spacing="150" :show-confirm-bar="false" @focus="getFocus()"></textarea>
		</view>
		<view class="btn_submit" @click="PostCustomerSuggest()">匿名提交</view>
	</view>
</template>

<script>
	export default {
		name: "userevaluation",
		props: {
			show: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				remark:"",
				type:"",
				henhaoImg: "../../static/images/00-1.png",
				manyiImg: "../../static/images/01-1.png",
				nomanyiImg: "../../static/images/02-1.png"
			}
		},
		created() {

		},
		methods:{
			getFocus(){
				uni.createSelectorQuery().select(".tear").boundingClientRect(data=>{//目标节点
				　　　　uni.pageScrollTo({
				　　　　　　duration:0,//过渡时间必须为0，uniapp bug，否则运行到手机会报错
				　　　　　　scrollTop: data.top,//滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
				　　　　})
				　　}).exec()
			},
			ToggleImg(type){
				if(type=="1"){
					this.henhaoImg="../../static/images/00.png";
					this.manyiImg="../../static/images/01-1.png";
					this.nomanyiImg="../../static/images/02-1.png";
					this.type=1;
				}
				if(type==2){
					this.manyiImg="../../static/images/01.png";
					this.henhaoImg="../../static/images/00-1.png";
					this.nomanyiImg="../../static/images/02-1.png";
					this.type=2;
				}
				if(type==3){
					this.nomanyiImg="../../static/images/02.png";
					this.henhaoImg="../../static/images/00-1.png";
					this.manyiImg="../../static/images/01-1.png";
					this.type=0;
				}
			},
			Valid(){
				console.log(this.type);
				if(this.type===""){
					this.$util.showToast("请选择您对产品的满意程度");
					return false;
				}
				if(this.remark==""){
					
				}
				return true;
			},
			PostCustomerSuggest(){
				if(this.Valid()){
					var that=this;
					var parm={
						"customerLevel": that.type,
						  "remark": that.remark
					}
					that.$util.networkRequest({
						url: "/Express/PostCustomerSuggest",
						method: "POST",
						data: parm,
						success: function(res){
							
							uni.showModal({
							    title: '提示',
							    content: '评价成功',
								showCancel: false,
							    success: function (res) {
							        if (res.confirm) {
										that.$util.navigateBack(that);
							        }
							    }
							});
						}
					})
				}
			
			}
		}
	}
</script>

<style scoped>
	.containers{
		padding: 7.5%;
		    width: 85%;
			    padding-bottom: 80px;
	}
	.top_tit{
		color: #333;
		    font-size: 25px;
		    font-weight: bold;
		    line-height: 45px;
			text-align: center;
	}
	.top_tit_con{
		color: #ff0000;
		    font-size: 18px;
		    line-height: 22px;
			text-align: center;
	}
	.img_pj{
		display: flex;
		    justify-content: space-around;
			align-items: center;
	}
	.manyi_pi{
		margin:30px 0px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	.manyi_pi image{
		width:50px;
		height:50px;
	}
	.manyi_pi text{
		font-size: 16px;
		color: #000000;
		text-align: center;
	}
	.yijian{
		margin-bottom: 30px;
		background-color: #f4f4f4;
		padding: 10px;
	}
	.tear{
		width:100%;
		height:130px;
		background-color: #f4f4f4;
		font-size:15px;
	}
	.btn_submit{
		background-color: #007AFF;
		text-align: center;
		font-size: 15px;
		color: #FFFFFF;
		width:100%;
		height: 40px;
		line-height: 40px;
		border-radius: 25px;
	}
</style>
