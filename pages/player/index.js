import PageModule from '../../lib/Page.js';
import $page_music from '../../model/PageMusic.js';
import LikeSong from '../../model/LikeSong.js';
import AudioManager from '../../lib/AudioManager.js';
import { loopMode, request } from '../../common/const.js';

const $like_db = new LikeSong();

// pages/player/index.js
const $page = new PageModule({
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.name || ''
    });

    this.setData({
      showMoreMenu: false,
      showPlayList: false,
      multiple: 8, // swiper组件同时显示的滑块数量
      duration: 150, // swiper组件滑动滑动时长
      current: 0, // swiper组件当前所在滑块的index
      currentIndex: 0, // 当前播放到第几句
      liked: $like_db.has(options.mid)
    });

    // 设置播放歌曲的循环方式
    this.setLoopMode();

    // 获取歌词
    this.getLyrics(options.mid);
  },
  // 获取歌词
  getLyrics(mid) {
    let url = request.lyrics + mid;
    
    new Promise((resolve, reject) => {
      wx.request({
        url,
        success: resolve,
        fail: reject
      });
    }).then(res => {
      let lyrics = res.data.lyric;
      const multiple = 8;

      // 当前歌曲若无歌词信息
      if (lyrics.length === 0) {
        lyrics.push({
          millisecond: 0,
          second: 0,
          date: '00:00',
          text: '暂无歌词'
        });
      }
      
      if (lyrics.length < multiple) { // 歌词只有一页
        this.setData({
          multiple: lyrics.length || 1
        });
      } else {
        this.setData({
          multiple
        });
      }

      this.setData({ lyrics });
    });
  },
  // 切换歌曲时重新获取歌词
  onCanplay() {
    wx.setNavigationBarTitle({
      title: this.data.playerSong.song_name
    });

    this.setData({
      liked: $like_db.has(this.data.playerSong.song_mid)
    });

    this.getLyrics(this.data.playerSong.song_mid);
  },
  onTimeUpdate() {
    // 没有歌词数据时就不滚动
    if (!this.data.lyrics || this.data.lyrics.length === 0) {
      return false;
    }

    // 歌词高亮
    const lyrics = this.data.lyrics;
    let currentTime = ~~(AudioManager.audio.currentTime * 1000),
      currentIndex = lyrics.findIndex(item => item.millisecond > currentTime),
      current = 0;
    
    if (currentTime < lyrics[lyrics.length - 1].millisecond) {
      currentIndex--;
    } else {
      currentIndex = lyrics.length - 1;
    }
    currentIndex = Math.max(currentIndex, 0);

    // 歌词滚动
    if (currentIndex > ~~(this.data.multiple/2)) { // 当前显示行数的一半开始滚动
      current = currentIndex - ~~(this.data.multiple / 2);

      // 最后一页不滚动
      current = Math.min(current, lyrics.length - this.data.multiple);
    }

    this.setData({
      currentIndex,
      current
    });
  },
  // 设置进度条
  setSeek(e) {
    AudioManager.trigger('seek', this, e.detail.value);
  },
  // 设置播放歌曲的循环方式
  setLoopMode() {
    this.setData({
      loopMode: loopMode[AudioManager.loopMode]
    });
  },
  // 切换循环方式
  switchLoopMode(e) {
    let curMode = AudioManager.loopMode;
    AudioManager.loopMode = ++curMode % loopMode.length;

    this.setLoopMode();

    // 若是点击播放菜单中的按钮切换的
    if(e.currentTarget.dataset.method === 'mode') {
      wx.showToast({
        icon: 'none',
        title: this.data.loopMode.name
      })
    }
  }
});

$page.start($page_music);