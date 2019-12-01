// miniprogram/pages/cityselector.js
// var province_list = ["上海","云南","内蒙古","北京","台湾","吉林","四川","天津","宁夏","安徽","山东","山西","广东","广西","新疆","江苏","江西","河北","河南","浙江","海南","湖北","湖南","澳门","甘肃","福建","西藏","贵州","辽宁","重庆","陕西","青海","香港","黑龙江"];
const db = wx.cloud.database();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		animationData: {},
		animationData1: {},
		animationData2: {},
		animationArray: [],
		city_list: [],
		district_list: [],
		// buttonLayout: "",
		isProvinceSelected: false,
		isCitySelected: false,
		isDistrictSelected: false,
		province: "待选择",
		city: "待选择",
		district: "待选择"
	},
	//省份重置函数
	onProvinceReset: function(){
		this.isProvinceSelected = false;
		this.isCitySelected = false;
		this.isDistrictSelected = false;
		this.province = "待选择";
		this.city = "待选择";
		this.district = "待选择";
		this.city_list = [];
		this.district_list = [];
		this.setData({
			isProvinceSelected: this.isProvinceSelected,
			isCitySelected: this.isCitySelected,
			isDistrictSelected: this.isDistrictSelected,
			province: "待选择",
			city: "待选择",
			district: "待选择",
			city_list: this.city_list,
			district_list: this.district_list
		})
	},
	//城市重置函数
	onCityReset: function(){
		var that = this;
		this.isCitySelected = false;
		this.isDistrictSelected = false;
		this.city = "待选择";
		this.district = "待选择";
		this.city_list = [];
		this.district_list = [];
		wx.showLoading({
			title: "正在加载列表"
		});
		// const db = wx.cloud.database();
		db.collection("CITY_ID").aggregate().match({
			Province: this.province
		}).group({
			_id: "$City"
		}).limit(100).end({
			success: function(res) {
				this.city_list = new Array(res.list.length);
				// this.buttonLayout = "";
				for(var i=0;i<res.list.length;i++){
					// this.buttonLayout+='<button mark:city="'+res.list[i]._id+'" class="ButtonStyle" type="primary" bindtap="onCityButtonClicked">'+res.list[i]._id+'</button>';
					this.city_list[i] = res.list[i]._id;
				}
				that.setData({
					isCitySelected: that.isCitySelected,
					isDistrictSelected: that.isDistrictSelected,
					city: "待选择",
					district: "待选择",
					city_list: this.city_list
					// buttonLayout: this.buttonLayout
				})
			}
		});
		wx.hideLoading();
	},
	//区县重置函数
	onDistrictReset: function(){
		var that = this;
		this.isDistrictSelected = false;
		this.district = "待选择";
		this.district_list = [];
		wx.showLoading({
			title: "正在加载列表"
		});
		// const db = wx.cloud.database();
		db.collection("CITY_ID").aggregate().match({
			Province: this.province,
			City: this.city
		}).group({
			_id: "$District"
		}).limit(100).end({
			success: function(res) {
				this.district_list = new Array(res.list.length);
				for(var i=0;i<res.list.length;i++){
					this.district_list[i] = res.list[i]._id;
				}
				that.setData({
					isDistrictSelected: that.isDistrictSelected,
					district: "待选择",
					district_list: this.district_list
				});
			}
		});
		wx.hideLoading();
	},
	//省份点击函数
	onProvinceButtonClicked: function(e){
		this.isProvinceSelected = true;
		this.province = e.mark.province;
		var that = this;
		this.setData({
			isProvinceSelected: this.isProvinceSelected,
			province: this.province
		});
		wx.showLoading({
			title: "正在加载列表"
		});
		// const db = wx.cloud.database();
		db.collection("CITY_ID").aggregate().match({
			Province: e.mark.province
		}).group({
			_id: "$City"
		}).limit(100).end({//寻找城市最多的省份
			success: function(res2) {
				this.city_list = new Array(res2.list.length);
				// this.buttonLayout = "";
				for(var i=0;i<res2.list.length;i++){
					// this.buttonLayout+='<button mark:city="'+res2.list[i]._id+'" class="ButtonStyle" type="primary" bindtap="onCityButtonClicked">'+res2.list[i]._id+'</button>';
					this.city_list[i] = res2.list[i]._id;
				}
				that.setData({
					city_list: this.city_list
					// buttonLayout: this.buttonLayout
				});
			}
		});
		wx.hideLoading();
	},
	//城市点击函数
	onCityButtonClicked:function(res){
		this.isCitySelected = true;
		this.city = res.mark.city;
		var that = this;
		this.setData({
			isCitySelected: this.isCitySelected,
			city: this.city
		});
		wx.showLoading({
			title: "正在加载列表"
		});
		// const db = wx.cloud.database();
		db.collection("CITY_ID").aggregate().match({
			Province: this.province,
			City: res.mark.city
		}).group({
			_id: "$District"
		}).limit(100).end({//寻找城市最多的省份
			success: function(res2) {
				this.district_list = new Array(res2.list.length);
				for(var i=0;i<res2.list.length;i++){
					this.district_list[i] = res2.list[i]._id;
				}
				that.setData({
					district_list: this.district_list.sort(function(a,b){
						return a.localeCompare(b);
					})
				})
			}
		});
		wx.hideLoading();
	},
	//区县点击函数
	onDistrictButtonClicked:function(e){
		this.isDistrictSelected = true;
		this.district = e.mark.district;
		this.setData({
			isDistrictSelected: this.isDistrictSelected,
			district: this.district
		});
	},
	//提交按钮点击函数
	onSubmitClicked:function(){
		wx.showLoading({
			title: "正在提交查询"
		});
		db.collection("CITY_ID").where({
			Province: this.province,
			City: this.city,
			District: this.district
		}).field({
			_id: true
		}).get({
			success: function(res){
				// setData只在向页面传送数据时使用
				// console.log(res.data[0]._id);
				var pageStacks = getCurrentPages();
				var lastPage = pageStacks[pageStacks.length-2];
				console.log(lastPage);
				// lastPage.city_code_add = res.data[0]._id;
				wx.cloud.callFunction({
					name:"cityCheckAndAdd",
					data:{
						newCity: res.data[0]._id
					},
					complete: function(res2) {
						console.log(res2);
						lastPage.city_list = res2.result.city_list;
						wx.navigateBack({
							delta: 1
						});
						wx.hideLoading();
					}
				});
			}
		});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// db = wx.cloud.database();
		wx.hideLoading();
		this.setData({
			province_list: ["安徽","澳门","北京","重庆","福建", "甘肃", 
			"广东", "广西", "贵州", "海南", "河北", "河南", "黑龙江", 
			"湖北", "湖南", "吉林", "江苏", "江西", "辽宁", "内蒙古", 
			"宁夏", "青海", "山东", "山西", "陕西", "上海", "四川", 
			"台湾", "天津", "西藏", "香港", "新疆", "云南","浙江"],
			// .sort(
			// 	function(a,b){
			// 		return a.localeCompare(b)
			// 	} 
			// ),
			isProvinceSelected: this.isProvinceSelected,
			isCitySelected: this.isCitySelected,
			isDistrictSelected: this.isDistrictSelected,
			province: this.province,
			city: this.city,
			district: this.district
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function(){
		db.collection("USER")
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})