import PageModule from '../../lib/Page.js';
import $page_music from '../../model/PageMusic.js';
import SearchSong from '../../model/SearchSong.js';

// pages/search/index.js
const $search_song = new SearchSong();

const $page = new PageModule({
  data: {
    words: '',
    history: [] //保存输入历史
  },
  onShow() {
    this.updateView();
  },
  // 从缓存中读取数据并更新页面
  updateView() {
    let history = $search_song.all() || [];
    this.setData({
      words: '',
      history
    });
  },
  submitData(keywords) {
    // 添加数据至缓存
    $search_song.add(keywords);

    this.updateView();

    wx.navigateTo({
      url: 'list?keywords=' + keywords
    });
  },
  // 点击搜索图标
  submitToList(e) {
    let keywords = e.detail.value.keywords.trim();

    if(!keywords) {      
      return wx.showToast({
        icon: 'none',
        title: '输入点内容再来搜索吧'
      });
    }
    this.submitData(keywords);
  },
  // 点击键盘的搜索按钮
  confirmToList(e) {
    let keywords = e.detail.value.trim();

    if (!keywords) {
      return wx.showToast({
        icon: 'none',
        title: '输入点内容再来搜索吧'
      });
    }
    this.submitData(keywords);
  },
  // 点击清空历史记录
  clearHistory() {
    const $this = this;
    wx.showModal({
      title: '操作提示',
      content: '是否清空全部历史记录？',
      cancelColor: '#999',
      confirmColor: '#e6473b',
      success(res) {
        if (res.confirm) {
          $search_song.clear();

          $this.updateView();
        }
      }
    })
  }
});

$page.start($page_music);