import PageModule from '../lib/Page.js';
import AudioManager from '../lib/AudioManager.js';

const default_album_min = '/images/default_album_min.jpg',
  default_album_big = '/images/default_album_big.jpg';

// 公共音频类
const $page_music = new PageModule({
  // 页面显示时获取歌曲信息
  onShow() {
    // 背景音频audio监听的事件
    const audioEvents = ['onCanplay', 'onWaiting', 'onError', 'onPlay', 'onPause', 'onSeeking', 'onSeeked', 'onEnded', 'onStop', 'onTimeUpdate', 'onNext', 'onPrev'];

    const trigger = e => {
      Reflect.apply(AudioManager.audio[e], this, [(...args) => {
        Reflect.has(this, e) && Reflect.apply(this[e], this, args);
      }]);
    };

    // 通过page页面的事件去代理触发audio的监听事件
    audioEvents.forEach(trigger);

    const { song, sheet } = AudioManager.getSong();
    this.setData({
      playerSong: song,
      playerSheet: sheet
    });
  },

  // 监听播放进度更新
  onTimeUpdate() {
    Object.assign(this.data.playerSong, {
      duration: AudioManager.audio.duration,
      currentTime: AudioManager.audio.currentTime,
      paused: AudioManager.audio.paused,
      buffered: AudioManager.audio.buffered
    });

    this.setData({
      playerSong: this.data.playerSong
    })
  },

  // 监听歌曲自然播放结束
  onEnded() {
    switch (AudioManager.loopMode) { // 列表循环
      case 0:
        AudioManager.switchSong.call(this, true);
        break;
      case 1: // 随机播放
        const playerSheet = this.data.playerSheet;
        if (playerSheet.length <= 0) {
          return wx.showToast({
            icon: 'none',
            title: '当前列表暂无歌曲'
          });
        } 

        let randomNum = ~~(Math.random()*playerSheet.length);
        AudioManager.setSong(playerSheet[randomNum], playerSheet);
        break;
      case 2: // 单曲循环
        AudioManager.setSong(this.data.playerSong, this.data.playerSheet);
        break;
      default:
    }
  },

  // 监听歌曲播放错误
  onError() {
    wx.showToast({
      icon: 'none',
      title: '歌曲资源找不到了，换一曲试试？'
    });
  },

  // 监听封面图资源加载出错
  albumError() {
    this.data.playerSong.album_min = default_album_min,
    this.data.playerSong.album_big = default_album_big;

    this.setData({
      playerSong: this.data.playerSong
    });
  },

  // 点击歌曲封面及名称播放音频
  onPlayAudio(e) {
    const sheet = e.currentTarget.dataset.sheet,
      song = e.target.dataset.song;

    song && AudioManager.setSong(song, sheet);
  },

  // 事件委托 播放器的tap事件
  musicTap(e) {
    let method = e.target.dataset.method;

    // 判断音频播放器的类是否有此静态方法
    Reflect.has(AudioManager, method) && Reflect.apply(AudioManager[method], this, [e]);
  },

  // 呼出/收起更多菜单
  showMoreMenu() {
    this.setData({
      showMoreMenu: !this.data.showMoreMenu
    });
  },

  // 呼出/收起播放列表
  showPlayList() {
    this.setData({
      showPlayList: !this.data.showPlayList
    });
  },

  // 删除播放列表中的歌曲
  delPlaySong(e) {
    const selectSong = e.currentTarget.dataset.select,
      playerSheet = this.data.playerSheet;
      
    let index = playerSheet.findIndex(item => item.song_mid === selectSong.song_mid);

    index > -1  && playerSheet.splice(index,1);
    
    this.setData({ playerSheet });
  },

  // 清空播放列表中的歌曲
  emptyPlaySheet(e) {
    wx.showModal({
      title: '操作提示',
      content: '确定清空播放列表？',
      cancelColor: '#999',
      confirmColor: '#e6473b',
      success: (res) => {
        if(res.confirm) {
          this.setData({
            playerSheet: []
          });
        }
      }
    })
  }
});

export default $page_music;