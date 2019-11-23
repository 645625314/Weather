// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	
	let{OPENID, APPID, UNIONID } = cloud.getWXContext();
	console.log(OPENID);
	var newCity = event.newCity;
	console.log(newCity);
	//var city_string = new String();
	var city_list;
	// var thisContext = this;
	var STATE_CODE = 0;
	const db = cloud.database().collection("USER");
	await db.where({
		_id: OPENID
	}).field({
		city_list: true
	}).get().then(
		res=>{
			city_list = res.data[0].city_list;
			console.log("sucess");
			console.log(res);
			console.log("list");
			console.log(city_list);
			if(city_list.length==0){
				console.log("in");
				city_list = new Array(newCity);
			}else{
				for(var i=0;i<city_list.length;i++){
					if(city_list[i]==newCity){
						//1 代表着数据已存在
						STATE_CODE = 1;
						return{
							STATE_CODE
						}
					}
				}
				city_list = city_list.concat(newCity);
				city_list.sort();
			}
			db.where({
				_id:OPENID
			}).update({
				data:{
					city_list: city_list
				}
			}).then(
				res3=>{
					console.log("update");
					console.log(res3);
				}
			);
			console.log(city_list);
		}
	);
	return{
		STATE_CODE
	}
}