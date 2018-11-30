import PageModule from '../../lib/Page.js';
import Storage from '../../lib/Storage.js';

const $app = getApp().example,
  $user_db = new Storage('user_db');

// pages/start/index.js
const $page = new PageModule({
  getUserInfo(e) {
    // 获取用户信息
    const userInfo = e.detail.userInfo;

    // 用户同意授权获取到用户信息后
    if (userInfo) {
      // 保存到全局
      $app.data('userInfo', userInfo);

      // 保存到本地缓存
      let where = $user_db.where('time', '!=', '');
      if (where.find()) { // 本地缓存已存在用户信息则去更新数据
        $user_db.update({
          time: new Date().getTime()
        });
      } else {
        $user_db.add(Object.assign({
          time: new Date().getTime()
        }, userInfo));
      }
      $user_db.save();

      wx.redirectTo({
        url: '/pages/home/index'
      });
    }
  }
});

$page.start();