import AppModule from './App.js';
import Storage from './Storage.js';
import LikeSong from '../model/LikeSong.js';
import utils from '../utils/utils.js';
import { request } from '../common/const.js';

const audio = wx.getBackgroundAudioManager();
const $audio_db = new Storage('audio_db');
const $like_db = new LikeSong();

// 管理全局唯一的背景音频播放器
export default class AudioManager{
  // 背景音频对象
  static audio = audio;

  // 当前播放的歌曲
  static song = null;

  // 当前播放的歌单
  static sheet = null;

  static loopMode = 0; // 播放列表循环模式 0=列表循环，1=随机播放，2=单曲循环

  // 设置当前播放的歌曲或歌单
  static setSong(song, sheet) {
    // 设置音频属性
    let audioAttr = {
      title: song.song_name,
      epname: song.album_name,
      singer: song.song_orig,
      coverImgUrl: song.album_min
    };

    const keys = ['song_mid', 'song_name', 'song_orig', 'album_min', 'album_big', 'album_mid', 'album_name'];
    let data = {};
    keys.forEach(key => {
      data[key] = song[key];
    });

    AudioManager.saveSong(data, sheet);

    // 获取歌曲的真实url
    wx.request({
      url: request.song_url + '/' + song.song_mid,
      success: (res) => {
        audioAttr.src = res.data;

        Object.assign(audio, audioAttr);
      }
    });
  }

  // 记录当前播放的歌曲或歌单
  static saveSong(song, sheet) {
    const args = { song, sheet };

    // 记录在类中
    Object.assign(AudioManager, args);

    // 记录在page页面
    AppModule.assign({
      playerSong: song,
      playerSheet: sheet
    });

    // 记录在缓存
    Object.keys(args).forEach(key => {
      let where = {
        'type': key
      };
      let data = Object.assign({}, where, {
        data: args[key],
        time: new Date().getTime()
      });

      // 若已存在当前歌曲播放记录的缓存，则修改，否则新增
      if ($audio_db.where({ 'type': key }).find()) {
        $audio_db.where({ 'type': key }).update(data);
      } else {
        $audio_db.add(data);
      }
      $audio_db.save();
    });
  }

  // 获取当前播放的歌曲和歌单
  static getSong() {
    const data = {
      song: {},
      sheet: []
    };

    Object.keys(data).forEach(key => {
      // 从类中读取
      if (AudioManager[key]) {
        Object.assign(data, AudioManager);
      } else {
        // 从缓存中读取
        let result = $audio_db.where('type', key).find();
        if (result) {
          Object.assign(data[key], result.data);
        }
      }
    });

    return data;
  }

  // audio 事件行为代理触发
  static trigger(eType, that, ...args) {
    // 判断事件类型是否存在，存在就触发
    Reflect.has(audio, eType) && Reflect.apply(audio[eType], that, args);
  }

  /*============= 代理触发的播放器事件，this指向page页面 =============*/

  // 播放/暂停
  static play() {
    const { playerSong: song, playerSheet: sheet} = this.data;

    if (audio.paused === undefined) { // audio未设置src
      AudioManager.setSong(song, sheet);
    } else if (audio.paused){
      audio.play();
    } else {
      audio.pause();
    }
  }

  // 歌曲切换
  static switchSong(flag) {
    // 找到当前播放的歌曲在播放列表中的位置
    let index = this.data.playerSheet.findIndex(item => item.song_mid === this.data.playerSong.song_mid),
      len = this.data.playerSheet.length;

    if (len <= 0) {
      return wx.showToast({
        icon: 'none',
        title: '当前列表暂无歌曲'
      });
    }

    flag ? ++index : --index;

    index < 0 && (index = len - 1);
    index %= len;

    AudioManager.setSong(this.data.playerSheet[index], this.data.playerSheet);
  }

  // 上一首
  static prev() {
    AudioManager.switchSong.call(this, false);
  }

  // 下一首
  static next() {
    AudioManager.switchSong.call(this, true);
  }

  // 喜欢
  static like() {
    const song = this.data.playerSong;

    // 若已标记喜欢则取消喜欢
    if ($like_db.has(song.song_mid)) {
      $like_db.del(song);
    } else {
      $like_db.add(song);
    }

    // 更新页面标记状态
    this.setData({
      liked: $like_db.has(song.song_mid)
    });
  }

  // 下载
  static download() {
    wx.showToast({
      icon: 'none',
      title: '非常抱歉，下载功能暂未开放'
    });
  }

  // 评论
  static comment() {
    if (!this.data.playerSong) return;
    wx.navigateTo({
      url: '/pages/player/comment?' + utils.objToUrl(this.data.playerSong)
    });
  }

  /*============= 代理触发的播放器事件 =============*/

  constructor() {}
} 