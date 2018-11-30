// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-742123'
})

const db = cloud.database(),
  collection = db.collection('song_comment')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await collection.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        song_id: event.song_id, // 歌曲id
        content: event.content, // 评论内容
        user: Object.assign(event.user, {
          openid: event.userInfo.openId
        }), // 用户信息
        time: new Date().getTime() // 评论时间
      }
    })
  } catch (e) {
    console.error(e)
  }
}