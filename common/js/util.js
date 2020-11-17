//#ifdef H5
	const wx = require('../../hybrid/html/weixin-js-sdk/index')
	import * as TanslateImage from "../../hybrid/html/js/translate-image.js"
//#endif
import {
	apiUrl,
	appId,
	wxappid
} from './config'

const SIGN_REGEXP = /([yMdhsm])(\1*)/g;
const DEFAULT_PATTERN = 'yyyy-MM-dd';

function padding(s, len) {
	var len = len - (s + '').length;
	for (var i = 0; i < len; i++) {
		s = '0' + s;
	}
	return s;
};
export default {
	isGoLogin: true, //判断token失效情况下,多次跳转登录页
	//网络请求
	networkRequest(param) {
		var token = uni.getStorageSync('token');
		const header = param.header || {
			appId: appId,
			token: token,
			'content-type': 'application/json'
		}
		if (param.method) {
			param.method = param.method.toUpperCase(); //小写改为大写
		}
		let that = this;
		//网络请求
		uni.request({
			url: apiUrl + param.url,
			method: param.method || "GET",
			header: header,
			data: param.data || {},
			success: res => {
				if (res.statusCode == 403 || res.statusCode == 401) {
					uni.removeStorageSync('token');
					//用户未登录
					// #ifdef MP-WEIXIN
					if (that.isGoLogin) {
						uni.removeStorageSync("wxauthorize");
						that._mp_wx_login('logs', '', function() {
							that.isGoLogin = true;
							let page = getCurrentPages().pop();
							if (!page) return;
							page.onLoad(page.options); //如果页面存在，则重新刷新页面
							page.onShow(); //如果页面存在，则重新刷新页面
						});
					}
					// #endif
					// #ifdef H5
					uni.removeStorageSync("h5initlog");
					if (that.isGoLogin) {
						let app = getApp();
						app.isToken();
					}
					// #endif
					that.isGoLogin = false;
					return false;
				}
				uni.hideLoading();
				if (res.data.errCode == 4000) {
					that.isGoLogin = false;
					uni.setStorage({
						key: "errormsg",
						data: res.data.message
					});
					uni.navigateTo({
						url: "/pages/error"
					});
					return false;
				}
				if (res.data.errCode > 1000 && res.data.errCode < 2000) {
					uni.showModal({
						title: '提示',
						content: res.data.message,
						showCancel: false,
					});
					typeof param.error == "function" && param.error(res.data);
					return false;
				}
				if (res.data.errCode > 2000) {
					typeof param.error == "function" && param.error(res.data);
					return false;
				}
				if (res.data.errCode != 200) {
					that.showToast(res.data.message);
					return false;
				}
				typeof param.success == "function" && param.success(res.data.data);
			},
			fail: (err) => {
				uni.hideLoading();
				this.showToast(err.errMsg);
			},
			complete: (res) => {
				uni.hideLoading();
				typeof param.complete == "function" && param.complete(res.data);
				return;
			}
		})
	},
	config() {
		let u = navigator.userAgent;
		let url = window.location.href;
		let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if (isiOS) {
			url = encodeURIComponent(window.location.href.split('#')[0]);
		}
		this.networkRequest({
			url: '/Wx/GetWeChatInfo',
			data: {
				url: url
			},
			success: function(res) {
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: res.appId, // 必填，公众号的唯一标识
					timestamp: res.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.nonceStr, // 必填，生成签名的随机串
					signature: res.signature, // 必填，签名，见附录1
					jsApiList: ["previewImage", "chooseImage", "uploadImage", "downloadImage", "onMenuShareAppMessage",
						"onMenuShareTimeline", "chooseWXPay", "startRecord", "stopRecord", "translateVoice"
					] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			}
		})
	},
	// 小程序长按保存图片
	longSave(barcodeImg) {
		uni.previewImage({
			current: 0,
			urls:barcodeImg,
			success() {
				console.log("预览");
			}
		})
		// uni.showLoading({ title: "下载图片中.." });
		// uni.downloadFile({ //下载图片
		// 	url:barcodeImg,
		// 	success: (res) => {
		// 		console.log(res)
		// 			if(res.statusCode == 200){
		// 				uni.hideLoading();
		// 				uni.saveImageToPhotosAlbum({ //将图片保存在手机
		// 					filePath: res.tempFilePath, //保存的位置
		// 					success: (res) => {
		// 						console.log(res)
		// 						console.log('长按保存图片')

		// 					}
		// 				})

		// 			}

		// 	}
		// })
	},
	//微信小程序授权登录
	_mp_wx_login(type, mptype, callback) {
		let that = this;
		uni.showLoading({
			title: "正在登录",
			mask: true
		});
		uni.login({
			provider: 'weixin',
			success: res => {
				that.networkRequest({
					url: "/Account/WxAppLogin",
					method: "POST",
					data: {
						value: res.code
					},
					success: function(data) {
						//登录结果 1 成功，2 未注册
						if (data.status == 1) {
							uni.setStorage({
								key: 'token',
								data: data.token
							});
							setTimeout(function() {
								if (callback) callback(data);
							}, 100);
						}
						if (data.status == 2 && type == "logs") {
							that.isGoLogin = false;
							uni.navigateTo({
								url: "/pages/logs/logs?mptype=" + mptype + "&openid=" + data.openId
							});
							return false;
						}
					}
				})
			}
		});
	},
	//H5授权登录
	_h5_login(type, _code, callback) {
		const that = this;
		uni.showLoading({
			title: "正在授权",
			mask: true
		});
		that.networkRequest({
			url: "/Account/WxLogin",
			method: "POST",
			data: {
				value: _code
			},
			success: function(data) {
				uni.removeStorageSync("validCode");
				uni.setStorage({
					key: 'h5initlog',
					data: "false"
				});
				//登录结果 1 成功，2 未注册
				if (data.status == 1) {
					uni.setStorage({
						key: "token",
						data: data.token
					});
					that.isGoLogin = true;
					location.reload();
				}
				if (data.status == 2 && type == "logs") {
					uni.navigateTo({
						url: "/pages/logs/logs?openid=" + data.openId
					});
				}
				if (callback) callback(data);
			}
		});
	},
	//H5支付
	_H5_chooseWXPay(info) {
		let _info = info;
		this.config();
		wx.ready(() => {
			wx.chooseWXPay({
				timestamp: _info.timestamp, // 支付签名时间戳
				nonceStr: _info.nonceStr, // 支付签名随机串，不长于32 位
				package: _info.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
				signType: _info.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
				paySign: _info.paySign, // 支付签名
				success: function(res) {
					//支付成功
					// this.showToast("支付成功，感谢您的使用");
					if (_info.success) _info.success();
				},
				cancel: function(res) {
					// this.showToast("您已取消支付");
					if (_info.cancel) _info.cancel();
				},
				fail: function(res) {
					alert('支付失败~');
				}
			});
		})
	},
	/*
	 * H5分享朋友&&朋友圈
	 * 例: <!-- #ifdef H5 --> <view @click="sharef()">分享</view> <!-- #endif -->
		this.$util.wxshare({
			title: '分享标题', // 分享标题
			desc: '分享描述', // 分享描述
			link: 'http://www.baidu.com', // 分享链接
			imgUrl: '分享图标', //分享图标
		})
	*/
	wxshare(info) {
		// console.log("info:"+JSON.stringify(info))
		this.config();
		wx.checkJsApi({
			jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"],
			success: function(res) {
				console.log(res);
			}
		});
		wx.ready(() => {
			//分享给朋友
			wx.onMenuShareAppMessage({
				title: info.title, // 分享标题
				desc: info.desc, // 分享描述
				link: info.link, // 分享链接
				imgUrl: info.imgUrl, // 分享图标
				success: function() {
					// 用户确认分享后执行的回调函数
				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
				}
			})
			//分享到朋友圈
			wx.onMenuShareTimeline({
				title: info.title, // 分享标题
				desc: info.desc, // 分享描述
				link: info.link, // 分享链接
				imgUrl: info.imgUrl, // 分享图标
				success: function() {
					// 用户确认分享后执行的回调函数
				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
				}
			});
		})
	},
	//H5开始语音识别
	_H5_startRecord(callback) {
		let u = navigator.userAgent;
		let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if (isiOS == false) {
			this.config();
		}
		wx.ready(() => {
			wx.startRecord({
				success: function(res) {
					callback(res);
				},
				fail: function(err) {
					alert('用户拒绝授权录音');
				},
				cancel: function() {
					alert('用户拒绝授权录音');
				}
			});
		})
	},
	//H5结束语音识别
	_H5_stopRecord(type, callback) {
		let u = navigator.userAgent;
		let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if (isiOS == false) {
			this.config();
		}
		wx.ready(() => {
			wx.stopRecord({
				success: function(res) {
					var localId = res.localId;
					if (type == 0) return false;
					// 语音识别的结果
					wx.translateVoice({
						localId: localId, //需要识别的音频的本地Id，由录音相关接口获得
						isShowProgressTips: 1, // 默认为1，显示进度提示
						success: function(result) {
							callback(result)
						}
					})
				},
				fail: function(res) {
					if (type == 0) return false;
					uni.hideLoading();
					alert(res.errMsg);
				}
			});
		})
	},
	isNotEmpty(val) {
		return (val != null && val != "" && val != undefined);
	},
	//手机号验证
	isPhoneNumber(val) {
		// return /^1[0-9]{10}$/.test(val);
		let reg =
			/(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1\d{10})$)|(^(400)-(\d{3})-(\d{4})(.)(\d{1,4})$)|(^(400)-(\d{3})-(\d{4}$))/;
		return reg.test(val);
	},
	//邮箱验证
	isEmail(val) {
		return (/.+@.+\..+$/.test(val))
	},
	GetAmount(val) {
		let _token = uni.getStorageSync("token");
		if (_token == "" || _token == undefined) {
			val = "--"
		}
		if (val < 0 || val == "" || val == 0 || val == null) {
			val = "--"
		}
		return val;
	},
	//格式化时间
	formatDate: {
		format: function(date, pattern) {
			if (!date) {
				return '';
			}
			var myDate = new Date(date + '+0800');
			if (myDate == 'Invalid Date') {
				date = date.replace(/T/g, ' '); //去掉T
				date = date.replace(/-/g, '/');
				date = date.replace(/\.\d+/, ' '); //去掉毫秒
				myDate = new Date(date + '+0800');
			}
			date = myDate;
			pattern = pattern || DEFAULT_PATTERN;
			return pattern.replace(SIGN_REGEXP, function($0) {
				switch ($0.charAt(0)) {
					case 'y':
						return padding(date.getFullYear(), $0.length);
					case 'M':
						return padding(date.getMonth() + 1, $0.length);
					case 'd':
						return padding(date.getDate(), $0.length);
					case 'w':
						return date.getDay();
					case 'h':
						return padding(date.getHours(), $0.length);
					case 'm':
						return padding(date.getMinutes(), $0.length);
					case 's':
						return padding(date.getSeconds(), $0.length);
				}
			});
		},
		parse: function(dateString, pattern) {
			var matchs1 = pattern.match(SIGN_REGEXP);
			var matchs2 = dateString.match(/(\d)+/g);
			if (matchs1.length == matchs2.length) {
				var _date = new Date(1970, 0, 1);
				for (var i = 0; i < matchs1.length; i++) {
					var _int = parseInt(matchs2[i]);
					var sign = matchs1[i];
					switch (sign.charAt(0)) {
						case 'y':
							_date.setFullYear(_int);
							break;
						case 'M':
							_date.setMonth(_int - 1);
							break;
						case 'd':
							_date.setDate(_int);
							break;
						case 'h':
							_date.setHours(_int);
							break;
						case 'm':
							_date.setMinutes(_int);
							break;
						case 's':
							_date.setSeconds(_int);
							break;
					}
				}
				return _date;
			}
			return null;
		}
	},
	//地址自动识别过滤特殊字符
	stripAddress(s) { //地址自动识别过滤特殊字符
		s = s.replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3');
		s = s.replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');
		var pattern = new RegExp(
			"[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？-]"
		);
		var rs = '';
		for (var i = 0; i < s.length; i++) {
			rs = rs + s.substr(i, 1).replace(pattern, ' ');
		}
		rs = rs.replace(/[\r\n]/g, '');
		return rs;
	},
	//月
	getMonth(y) {
		var date = new Date();
		var y = y.split("年")[0];
		var y_arr = [];
		var s_y = 2019;
		// if(y == s_y){
		// 	y_arr = ["11月","12月"];
		// }else {
		var len = y == date.getFullYear() ? (date.getMonth() + 1) : 12;
		for (var i = 1; i <= len; i++) {
			if (i < 10) i = "0" + i;
			y_arr.push(i + "月")
		}
		// }
		return y_arr;
	},
	//天
	getDays(y, m) {
		var y = y.split("年")[0];
		var m = m.split("月")[0];
		var len = 0;
		var d_arr = [];
		var date = new Date();
		if (y == date.getFullYear() && m == (date.getMonth() + 1)) {
			len = date.getDate();
		} else {
			len = new Date(y, m, 0).getDate();
		}
		for (var i = 1; i <= len; i++) {
			if (i < 10) i = "0" + i;
			d_arr.push(i + "日");
		}
		return d_arr;
	},
	isWechat() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	},
	//判断pc
	IsPC() {
		// #ifdef H5
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone",
			"SymbianOS", "Windows Phone",
			"iPad", "iPod"
		];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
		// #endif
		return false;
	},
	//下载文件
	downloadFile(filepath) {
		// #ifdef H5
		let link = document.createElement('a');
		link.style.display = 'none';
		link.href = filepath;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link) // 下载完成移除元素
		// #endif
		// #ifdef MP-WEIXIN 
		uni.downloadFile({
			url: filepath, //仅为示例，并非真实的资源
			success: (res) => {
				if (res.statusCode === 200) {
					uni.openDocument({
						filePath: res.tempFilePath
					});
				}
			}
		});
		// #endif
	},
	// H5解义input file上传
	$refsFileHtml(info, callback) {
		const _this = this;
		var token = uni.getStorageSync('token');
		var input = document.createElement('input'); //创建元素
		input.type = "file"; //添加file类型
		input.accept = "image/*";
		input.style = "width: 100%; height: 100%;";
		input.multiple = info.multiple == undefined ? "" : "multiple";
		input.onchange = (event) => {
			uni.showLoading({
				title: "正在上传"
			});
			let fileList = input.files;
			let _length = fileList.length;
			if (_length > 9) {
				uni.hideLoading();
				input.value = "";
				_this.showToast("最多上传9张");
				return false;
			}
			for (var i = 0; i < _length; i++) {
				let file = fileList[i];
				let _name = file.name;
				let _split = _name.split('.');
				let suffix = _split[_split.length - 1];
				//图片不能超过10mb
				if (file.size > 10485760) {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: _name + "图片超过10mb,禁止上传",
						showCancel: false,
					});
					return false;
				}
				if (!(/.*?\.jpg$|\.png$|\.jpeg$/.test(_name))) {
					input.value = "";
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: "图片仅支持jpg,png,jpeg格式,\n" + _name + "上传失败!",
						showCancel: false,
					});
					return false
				}
				var fr = new FileReader();
				fr.readAsDataURL(file);
				fr.onloadend = function(e) {
					var blob = TanslateImage.base64ToBlob(e.target.result);
					TanslateImage.translate(blob, suffix, (url) => {
						info["name"] = _name;
						info["filePath"] = url;
						info.formData["SuffixName"] = '.' + suffix;
						let isSuccess = false;
						if (_length == i) isSuccess = true;
						_this.ajaxUploadFile(info, isSuccess, callback);
						input.value = "";
					})
				}
			}
		}
		info.$input.appendChild(input);
	},
	//选择相机相册图片
	chooseImage(info, callback) {
		let _this = this;
		let _count = info.count == undefined ? 1 : info.count;
		uni.showLoading({
			title: "正在上传"
		})
		uni.chooseImage({
			sizeType: ['original', 'compressed'],
			count: _count,
			success: (chooseImageRes) => {
				let fileList = chooseImageRes.tempFiles;
				for (var i = 0; i < fileList.length; i++) {
					//图片不能超过10mb
					if (fileList[i].size > 10485760) {
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: "图片超过10mb,禁止上传",
							showCancel: false,
						});
						return false;
					}
					let arr = (chooseImageRes.tempFilePaths[i]).split('.');
					let suffix = arr[arr.length - 1];
					let _name = arr[arr.length - 2] + suffix;
					if (!(/.*?\.jpg$|\.png$|\.jpeg$/.test((chooseImageRes.tempFilePaths[i]).toLowerCase()))) {
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: "图片格式错误! 目前仅支持jpg,png,jpeg格式",
							showCancel: false,
						});
						return false
					}
					info["name"] = _name;
					info["filePath"] = chooseImageRes.tempFilePaths[i];
					info.formData["SuffixName"] = '.' + suffix;
					let isSuccess = false;
					if (fileList.length == (i + 1)) isSuccess = true;
					_this.ajaxUploadFile(info, isSuccess, callback);
				}
			},
			fail: (res) => {
				uni.hideLoading();
			}
		});
	},
	//微信上传图片到服务器
	ajaxUploadFile(info, isSuccess, callback) {
		let _url = info.url == undefined ? "/Account/UploadFileWeb" : info.url;
		var token = uni.getStorageSync('token');
		var that = this;
		uni.uploadFile({
			url: apiUrl + _url, //仅为示例，非真实的接口地址
			filePath: info.filePath,
			name: 'update_file',
			header: {
				"token": token,
				"appId": appId
			},
			formData: info.formData,
			success: (res) => {
				let data = JSON.parse(res.data);
				if (data.errCode == 200) {
					if (isSuccess) {
						uni.hideLoading();
						uni.showToast({
							title: '上传成功',
							icon: 'success',
							mask: true,
							duration: 2000
						});
					}
					data["fileName"] = info.name;
					callback(data);
				} else {
					uni.hideLoading();
					that.showToast(data.message)
				}
			},
			fail: (res) => {
				uni.hideLoading();
				uni.showModal({
					title: '上传失败',
					content: "请联系客服,失败提示:" + JSON.stringify(res),
					showCancel: false,
				});
			}
		});
	},
	//返回上一级
	navigateBack(_this) {
		// #ifdef H5
		const pages = getCurrentPages()
		if (pages.length > 1) {
			uni.navigateBack(1)
			return;
		}
		_this.$router.go(-1)
		return false;
		// #endif
		uni.navigateBack(1)
	},
	//提示
	showToast(msg) {
		uni.showToast({
			title: msg,
			icon: 'none'
		});
	}
}
