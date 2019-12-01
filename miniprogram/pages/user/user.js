// miniprogram/pages/user/user.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		head_image_url: "../../src/user.png",
		nick_name: ""

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		var thisapp = this;
		this.head_image_url = "../../src/user.png";
		wx.getUserInfo({
			success: function(res) {
				console.log(res);
				console.log(res.userInfo.avatarUrl);
				console.log(res.userInfo.nickName);
				thisapp.head_image_url = res.userInfo.avatarUrl;
				thisapp.nick_name = res.userInfo.nickName;
				thisapp.setData({
					head_image_url: thisapp.head_image_url,
					nick_name: thisapp.nick_name
				});
			}
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
	onShow: function () {

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