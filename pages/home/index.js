// pages/home/index.js
import PageModule from '../../lib/Page.js';
import Banner from '../../model/Banner.js';
import { homeSheet, region, request } from '../../common/const.js';
import AudioManager from '../../lib/AudioManager.js';
import $page_music from '../../model/PageMusic.js';
import utils from '../../utils/utils.js';

// 定义当前页面的命名空间
const $namespace = 'home/index';

const $page = new PageModule({
  onLoad() {
    utils.getUserInfo();

    // 获取banner图
    const banner = new Banner(this);
    banner.getBanner().then(res => {
      this.setData({
        banner: res
      });
    });

    // 设置国家地区
    this.setData({
      region
    });

    // 获取歌单
    let sheets = [];
    this.getSheets(homeSheet)[0].data.then(this.setSheets.bind(this));
  },
  // 获取首页展示的推荐歌单
  getSheets(args) {
    const promiseAll = [];

    args.forEach(item => {
      let p = new Promise(resolve => {
        wx.request({
          url: request.topid + item.id,
          success: resolve
        })
      });

      promiseAll.push(p);
    });

    return {
      nameSpace: $namespace,
      data: Promise.all(promiseAll)
    };
  },
  // 设置推荐歌单
  setSheets(res) {
    let sheets = [];

    res.forEach((item, index) => {
      sheets.push(Object.assign({
        songs: item.data.songs
      }, homeSheet[index]));

      this.setData({ sheets });
    });
  }
});

$page.start($page_music);