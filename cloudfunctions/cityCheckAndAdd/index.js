// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	
	let{OPENID, APPID, UNIONID } = cloud.getWXContext();
	var newCity = event.newCity;
	const db = cloud.database();
	db.collection("USER").where({
		_id: OPENID
	}).field({
		
	})
}