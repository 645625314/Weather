// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	let{OPENID} = cloud.getWXContext();
	const db = cloud.database();
	var city_list = [];
	var that = this;

	await db.collection("USER").where({
		_id: OPENID
	}).field({
		city_list: true
	}).get().then(
		res=>{
			city_list = res.data[0].city_list;
			console.log(city_list);
		}
	);
	return{
		city_list
	}
}