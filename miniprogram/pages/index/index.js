//index.js
//获取应用实例
// 584f6a04c1b300297b641fb6e3960f34
const app = getApp();
const HEWEATHER_KEY = "70cc10f046b24a45b2a09fe0156c5e40";
function getFormatDate(){
	var date = new Date();
	var year = date.getFullYear().toString();
	var month = (date.getMonth()+1).toString();
	if(month.length==1) month = "0"+month;
	var day = date.getDate().toString();
	if(day.length==1) day = "0"+day;
	return year+month+day;
}
 function requestSync(url,count,city){
	return new Promise((resolve, reject)=>{
		wx.request({
			url: url,
			method: 'POST',
			dataType: 'json',
			success: res=>{
				res.count = count;
				res.city = city;
				console.log("Sync="+res.count+" "+city);
				console.log(url);
				resolve(res);
			},
			fail: res=>{
				reject(res);
			}
		})
	})
}
Page({
	data: {
		motto: app.xxcMess,
		latitude: 0,
		longitude: 0,
		location:'null',
		cid:'null',
		parent_city:'null',
		admin_area:'null',
		url:'null',
		update_time:'null',
		now_tmp:'',
		now_cond_code:'999',
		now_wind_dir: '',
		now_wind_sc: '',
		now_wind_spd: '',
		now_hum: '',
		now_pres: '',
		city_code_add: '',
		daily_forecast: [],
		city_list: [],
		city_weather_list: [],
		daliy_mess: '',
		week: [],
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	//事件处理函数
	// bindViewTap: function() {
	//   wx.navigateTo({
	//     url: '../logs/logs'
	//   })
	// },
	swiperChange: function(e){
		console.log(e);
		// if(e.detail.current==1&e.detail.source=="touch"){
		// }
	},
	onGetUserInfo:function(res1){
		wx.login({
			success: function(res){
				console.log(res);
			}
		});
		// console.log(e);
		wx.cloud.callFunction({
			name: "userLogin",
			data: {
				userName: res1.detail.userInfo.nickName
			},
			complete: function(res2) {
				console.log(res2);
			}
		})
	},
	toCitySelector: function(){
		wx.showLoading({
			title: "正在加载城市列表"
		})
		wx.navigateTo({
			url: '../cityselector/cityselector'
		});
	},
	formSubmit: function(e){
		const db = wx.cloud.database();
		db.collection("DAILY_MESSAGE").add({
			data:{
				_id: getFormatDate(),
				Message: e.detail.value.messageInput,
				Author: e.detail.value.authorInput,
			},
			success: function(res){
				console.log(res);
				wx.showToast({
					title: '成功添加',
					icon: 'none',
					duration: 1000
				});
			},
			fail: function(res){
				console.log(res);
				wx.showToast({
					title: '添加失败，可能已存在',
					icon: 'none',
					duration: 1000
				});
			},
		});
	},
	formReset: function(e){
		const db = wx.cloud.database();
		db.collection("DAILY_MESSAGE").doc(getFormatDate()).remove({
			success:function(res){
				console.log('删除'+getFormatDate()+'成功');
				wx.showToast({
					title: '删除'+getFormatDate()+'成功',
					icon: 'none',
					duration: 1000
				});
			},
			fail:function(res){
				console.log('删除'+getFormatDate()+'失败');
				wx.showToast({
					title: '删除失败，可能不存在',
					icon: 'none',
					duration: 1000
				});
			}
		})
	},
	onLoad: function () {
		wx.setNavigationBarTitle({
			title: '天气'
		}); 
		console.log("onLoad");
		this.daily_forecast = new Array(6);
		// this.city_code_add = "";
		// this.city_code_add = new String();
		//定位相关
		wx.getLocation({
			success: res=>{
				console.log(res);
				this.latitude = res.latitude;
				this.longitude = res.longitude;
				this.url = 'https://free-api.heweather.net/s6/weather/now?key='+HEWEATHER_KEY+'&location='+this.latitude+','+this.longitude;
				wx.request({
					url: this.url,
					method: 'POST',
					dataType: 'json',
					success: res => {
						this.week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
						this.cid = res.data.HeWeather6[0].basic.cid;
						this.location = res.data.HeWeather6[0].basic.location;
						this.admin_area = res.data.HeWeather6[0].basic.admin_area;
						this.parent_city = res.data.HeWeather6[0].basic.parent_city;
						this.update_time = res.data.HeWeather6[0].update.loc;
						this.now_cond_code = res.data.HeWeather6[0].now.cond_code;
						this.now_tmp = res.data.HeWeather6[0].now.tmp;
						this.now_wind_dir = res.data.HeWeather6[0].now.wind_dir;
						this.now_wind_sc = res.data.HeWeather6[0].now.wind_sc;
						this.now_wind_spd = res.data.HeWeather6[0].now.wind_spd;
						this.now_hum = res.data.HeWeather6[0].now.hum;
						this.now_pres = res.data.HeWeather6[0].now.pres;
						this.setData({
							cid: this.cid,
							location: this.location,
							admin_area: this.admin_area,
							parent_city: this.parent_city,
							update_time: this.update_time,
							now_cond_code: this.now_cond_code,
							now_tmp: this.now_tmp,
							now_wind_sc: this.now_wind_sc,
							now_wind_dir: this.now_wind_dir,
							now_wind_spd: this.now_wind_spd,
							now_hum: this.now_hum,
							now_pres: this.now_pres
							// daily_message: '每日一句',
							// daily_message_author: 'xxc'
						})
						console.log(res);
						console.log(res.data.HeWeather6[0].basic);

						this.url = 'https://free-api.heweather.net/s6/weather/forecast?key='+HEWEATHER_KEY+'&location=' + this.cid;
						console.log(this.url);
						wx.request({
							url: this.url,
							method: 'POST',
							dataType: 'json',
							success: res3 => {
								// console.log(res);
								var s;
								var myDate;
								for(var count=0;count<7;count++){
									s = res3.data.HeWeather6[0].daily_forecast[count].date;
									myDate = new Date(s);
									this.daily_forecast[count]={
										date: String(s).substr(5,10),
										week: (count==0)?"今天":this.week[parseInt(myDate.getUTCDay())],
										cond_code: res3.data.HeWeather6[0].daily_forecast[count].cond_code_d,
										tmp_max: res3.data.HeWeather6[0].daily_forecast[count].tmp_min,
										cond_txt: res3.data.HeWeather6[0].daily_forecast[count].cond_txt_d
									}
								}
								this.setData({
									daily_forecast: this.daily_forecast
								})
							}
						})
					}
				})
			}
		});
		const db = wx.cloud.database();
		db.collection("DAILY_MESSAGE").orderBy('_id','desc').limit(2).get({
			success: res=>{
				console.log(res);
				var message = res.data[0].Message.toString();
				var author = res.data[0].Author.toString();
				console.log(message+" "+author);
				this.setData({
					daily_message: message,
					daily_message_author: author
				})
			}
		});
	},
	getLatitude:function(){
		console.log(this.latitude);
	},
	onPullDownRefresh: function(e){
		console.log(this.city_weather_list);
		wx.showToast({
			title: '刷新',
			icon: 'success',
			duration: 1500
		});
		this.getLatitude();
		this.onLoad();
		this.onShow();
		wx.stopPullDownRefresh();
	},
	getLocation:function(e){
		var data = e.currentTarget.dataset;
		console.log(data);
		var pos = data.pos;
		var url = 'https://free-api.heweather.net/s6/weather/now?key='+HEWEATHER_KEY+'&location=' + pos;
		var cid
		console.log(url);
		wx.request({
			url: url,
			method : 'POST',
			dataType : 'json',
			success: res=>{
				this.setData({
					cid: res.data.HeWeather6[0].basic.cid,
					location: res.data.HeWeather6[0].basic.location,
					parent_city: res.data.HeWeather6[0].basic.parent_city,
					admin_area: res.data.HeWeather6[0].basic.admin_area
				})
				console.log(res);
				console.log(res.data.HeWeather6[0].basic);
			}
		})
	},
	onShow: function(){
		var thisapp = this;
		wx.cloud.callFunction({
			name: "getCityList",
			complete: function(res){
				thisapp.city_list = res.result.city_list;
				console.log(thisapp.city_list);
				thisapp.city_weather_list = new Array(thisapp.city_list.length);
				console.log(thisapp.city_weather_list);
				for(var j=0;j<thisapp.city_list.length;j++){
					var thisj = j;
					var this_city = thisapp.city_list[j];
					console.log("j="+thisj+" city="+this_city);
					requestSync("https://free-api.heweather.net/s6/weather/now?key="+HEWEATHER_KEY+"&location="+this_city,thisj,this_city)
					.then(res1=>{
						console.log("j="+res1.count);
						thisapp.city_weather_list[res1.count] = {
							location: res1.data.HeWeather6[0].basic.location,
							admin_area: res1.data.HeWeather6[0].basic.admin_area,
							parent_city: res1.data.HeWeather6[0].basic.parent_city,
							update_time: res1.data.HeWeather6[0].update.loc,
							now_cond_code: res1.data.HeWeather6[0].now.cond_code,
							now_tmp: res1.data.HeWeather6[0].now.tmp,
							now_wind_dir: res1.data.HeWeather6[0].now.wind_dir,
							now_wind_sc: res1.data.HeWeather6[0].now.wind_sc,
							now_wind_spd: res1.data.HeWeather6[0].now.wind_spd,
							now_hum: res1.data.HeWeather6[0].now.hum,
							now_pres: res1.data.HeWeather6[0].now.pres,
							daily_forecast: new Array(7)
						};
						requestSync("https://free-api.heweather.net/s6/weather/forecast?key="+HEWEATHER_KEY+"&location="+res1.city,res1.count,res1.city)
						.then(res2=>{
							var s;
							var myDate;
							for(var count=0;count<7;count++){
								s = res2.data.HeWeather6[0].daily_forecast[count].date;
								myDate = new Date(s);
								thisapp.city_weather_list[res2.count].daily_forecast[count]={
									date: String(s).substr(5,10),
									week: (count==0)?"今天":thisapp.week[parseInt(myDate.getUTCDay())],
									cond_code: res2.data.HeWeather6[0].daily_forecast[count].cond_code_d,
									tmp_max: res2.data.HeWeather6[0].daily_forecast[count].tmp_min,
									cond_txt: res2.data.HeWeather6[0].daily_forecast[count].cond_txt_d
								}
							}
							thisapp.setData({
								city_weather_list: thisapp.city_weather_list
							});
							console.log(thisapp.city_weather_list[res2.count]);
						})
					});
					/* wx.request({
						url:"https://free-api.heweather.net/s6/weather/now?key=70cc10f046b24a45b2a09fe0156c5e40&location="+this_city,
						method : 'POST',
						dataType : 'json',
						success: res1=>{
							this.city_weather_list[thisj] = {
								location: res1.data.HeWeather6[0].basic.location,
								admin_area: res1.data.HeWeather6[0].basic.admin_area,
								parent_city: res1.data.HeWeather6[0].basic.parent_city,
								update_time: res1.data.HeWeather6[0].update.loc,
								now_cond_code: res1.data.HeWeather6[0].now.cond_code,
								now_tmp: res1.data.HeWeather6[0].now.tmp,
								now_wind_dir: res1.data.HeWeather6[0].now.wind_dir,
								now_wind_sc: res1.data.HeWeather6[0].now.wind_sc,
								now_wind_spd: res1.data.HeWeather6[0].now.wind_spd,
								now_hum: res1.data.HeWeather6[0].now.hum,
								now_pres: res1.data.HeWeather6[0].now.pres,
								daily_forecast: new Array(7)
							};
							console.log("success j="+thisj+" city="+this_city);
							wx.request({
								url:"https://free-api.heweather.net/s6/weather/forecast?key=70cc10f046b24a45b2a09fe0156c5e40&location="+this_city,
								method : 'POST',
								dataType : 'json',
								success: res2=>{
									var s;
									var myDate;
									for(var count=0;count<7;count++){
										s = res2.data.HeWeather6[0].daily_forecast[count].date;
										myDate = new Date(s);
										this.city_weather_list[thisj].daily_forecast[count]={
											date: String(s).substr(5,10),
											week: (count==0)?"今天":thisapp.week[parseInt(myDate.getUTCDay())],
											cond_code: res2.data.HeWeather6[0].daily_forecast[count].cond_code_d,
											tmp_max: res2.data.HeWeather6[0].daily_forecast[count].tmp_min,
											cond_txt: res2.data.HeWeather6[0].daily_forecast[count].cond_txt_d
										}
									}
								}
							})
							console.log(thisapp.city_weather_list[j]); 
						}
					}); */

					/* requestSync("https://free-api.heweather.net/s6/weather/now?key=70cc10f046b24a45b2a09fe0156c5e40&location="+this.city_list[i])
					.then(
						res1=>{//当前天气查询返回结果
							this.city_weather_list[i] = {
								location: res1.data.HeWeather6[0].basic.location,
								admin_area: res1.data.HeWeather6[0].basic.admin_area
							}
							console.log(this.city_weather_list);

							// this.city_weather_list[i].location = "东城";
							// this.city_weather_list[i].admin_area = res1.data.HeWeather6[0].basic.admin_area;
							// this.city_weather_list[i].parent_city = res1.data.HeWeather6[0].basic.parent_city;
							// this.city_weather_list[i].update_time = res1.data.HeWeather6[0].update.loc;
							// this.city_weather_list[i].now_cond_code = res1.data.HeWeather6[0].now.cond_code;
							// this.city_weather_list[i].now_tmp = res1.data.HeWeather6[0].now.tmp;
							// this.city_weather_list[i].now_wind_dir = res1.data.HeWeather6[0].now.wind_dir;
							// this.city_weather_list[i].now_wind_sc = res1.data.HeWeather6[0].now.wind_sc;
							// this.city_weather_list[i].now_wind_spd = res1.data.HeWeather6[0].now.wind_spd;
							// this.city_weather_list[i].now_hum = res1.data.HeWeather6[0].now.hum;
							// this.city_weather_list[i].now_pres = res1.data.HeWeather6[0].now.pres;
						}
					); */
				}
			}
		});
	},
})
