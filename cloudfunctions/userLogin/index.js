// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	// const wxContext = cloud.getWXContext()

	// return {
	// 	event,
	// 	openid: wxContext.OPENID,
	// 	appid: wxContext.APPID,
	// 	unionid: wxContext.UNIONID,
	// }
	// OPENID是用户唯一id
	// APPID是小程序的id
	let{OPENID, APPID, UNIONID } = cloud.getWXContext();
	// var APPSECRET = "584f6a04c1b300297b641fb6e3960f34";
	var USERNAME = event.userName;
	// 0 新注册
	// 1 登录成功
	// 2
	var LOGINSTATUS = 0;
	var dbres;
	const dbuser = cloud.database().collection("USER");
	
	await dbuser.where({
		_id : OPENID
	}).get().then(res=>{
		if(res.data.length==0){
			dbuser.add({
				data:{
					_id: OPENID,
					city_list: "",
					delivered_information: "",
					has_open_push: false,
					userName: USERNAME,
					weather_coin: 0
				}
			});
			LOGINSTATUS = 0;
		}else{
			LOGINSTATUS = 1;
		}
	});
	return{
		LOGINSTATUS
	}
}