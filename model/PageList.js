import PageModule from '../lib/Page.js';
import { request } from '../common/const.js';

// 歌曲列表
const $list = new PageModule({
  onLoad() {
    Object.assign(this.data, {
      url: '', // 请求url
      page: 1, // 当前页数
      row: 15, // 每页的数据量
      songs: [], // 数据容器
      empty: false // 标记数据是否全部加载完毕
    });
  },
  // 加载数据
  loadPage() {
    if (this.data.empty) {
      wx.showToast({
        icon: 'none',
        title: '没有更多了',
      });
    } else {
      // 打包url
      const url = this.data.url + '/p/' + this.data.page + '/r/' + this.data.row;

      wx.showLoading({
        title: '努力加载中...'
      });

      // 请求数据
      const p = new Promise((resolve, reject) => {
        wx.request({
          url,
          success: resolve
        });
      });

      // 处理数据
      p.then(this.codeData.bind(this));
    }
  },
  // 处理数据
  codeData(res) {
    wx.hideLoading();

    // 更新歌曲列表
    const data = res.data;
    this.data.songs.push(...data.songs);
    this.setData({
      songs: this.data.songs
    });

    // 判断所有页的数据是否已加载完毕
    if (this.data.page >= data.count_page) {
      this.data.empty = true;
    }
  },
  // 加载更多
  loadMore() {
    this.data.page++;

    // 请求下一页的数据
    this.loadPage();
  }
});

export default $list;