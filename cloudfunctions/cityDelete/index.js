// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let{OPENID} = cloud.getWXContext();
  const db = cloud.database();

  await db.collection("USER")
  .where({
    _id: OPENID
  }).update({
    data:{
      city_list: event.city_list
    }
  }).then(res=>{
    return{
      STATE: "success"
    }
  });
}