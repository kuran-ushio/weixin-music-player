import PageModule from '../../lib/Page.js';
import { request } from '../../common/const.js';
import $list from '../../model/PageList.js';
import $page_music from '../../model/PageMusic.js';
import SearchSong from '../../model/SearchSong.js';

// pages/search/list.js
const $search_song = new SearchSong('search_history');

const $page = new PageModule($list);

$page.extend($page_music);

$page.start({
  onLoad(options) {
    let words = options.keywords;

    this.setData({ words });

    wx.setNavigationBarTitle({
      title: words
    });

    // 打包url并请求数据
    this.data.url = request.query + words;
    this.loadPage();
  },
  searchData(e) {
    this.setData({
      songs: []
    });

    let keywords = e.detail.value;

    // 重载页面
    this.onLoad({ keywords });

    // 添加数据至历史记录缓存
    $search_song.add(keywords);
  }
});