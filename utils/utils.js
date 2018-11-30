import Storage from '../lib/Storage.js';

const $app = getApp().example,
  $user_db = new Storage('user_db');

// 获取用户信息
function getUserInfo() {
  return new Promise((resolve, reject) => {
    if ($app.data('userInfo')) { // 先从全局拿数据
      return resolve($app.data('userInfo'));
    } else if ($user_db.where('time', '!=', '').find()) { // 从本地缓存拿数据
      const userInfo = $user_db.where('time', '!=', '').find();
      // 返回数据前存到全局
      $app.data({ userInfo });
      return resolve(userInfo);
    } else { // 若用户第一次已经授权，则通过接口获取用户信息
      wx.getUserInfo({
        success(res) {
          const userInfo = Object.assign({
            time: new Date().getTime()
          }, res.userInfo);

          // 返回数据前存到全局和本地缓存
          $app.data({ userInfo });
          $user_db.add(userInfo).save();

          resolve(userInfo);
        },
        fail(res) { // 获取失败则跳转引导页让用户重新授权
          wx.redirectTo({
            url: '/pages/start/index'
          })
        }
      });
    }
  });
}

// 对象转url参数
function objToUrl(obj) {
  // 对象键值拼接
  return Object.keys(obj).map(key => key + '=' + encodeURIComponent(obj[key])).join('&');
}

// 补零
function addZreo(n) {
  return n < 10 ? '0' + n : n + '';
}

// 日期时间格式化
function formatTime(time) {
  let curObj = new Date(),
    timeObj = new Date(time);
  
  let curJson = {
    year: curObj.getFullYear(),
    month: curObj.getMonth() + 1,
    day: curObj.getDate()
  }, 
  timeJson = {
    year: timeObj.getFullYear(),
    month: timeObj.getMonth() + 1,
    day: timeObj.getDate(),
    hour: timeObj.getHours(),
    minute: timeObj.getMinutes()
  };

  // 计算距当前时间的毫秒差值
  let differ = curObj.getTime() - time;

  if (differ <= 60000) { // 1分钟以内
    return '刚刚';
  } else if (differ <= 60000*60) { // 1小时以内
    return ~~(differ/60000) + '分钟前';
  } else if (timeJson.day === curJson.day) { // 今天
    return addZreo(timeJson.hour) + ':' + addZreo(timeJson.minute);
  } else if (new Date(curJson.year, curJson.month - 1, curJson.day).getTime() - timeObj.getTime() < 60000 * 60 * 24) { // 昨天
    return '昨天 ' + addZreo(timeJson.hour) + ':' + addZreo(timeJson.minute);
  } else if (timeJson.year === curJson.year) { // 今年
    return timeJson.month + '月' + timeJson.day + '日';
  } else {
    return timeJson.year + '年' + timeJson.month + '月' + timeJson.day + '日';
  }
}

module.exports = {
  getUserInfo,
  objToUrl,
  formatTime
}