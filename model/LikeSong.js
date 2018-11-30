import Storage from '../lib/Storage.js';

const dbName = 'like_db';

// 标记喜欢的歌曲的缓存
export default class LikeSong extends Storage{
  constructor() {
    super(dbName);
  }

  // 是否已标记为喜欢
  has(id) {
    return this.where('song_mid', id).find() ? true : false;
  }

  // 标记为喜欢
  add(song) {
    const keys = ['song_url', 'song_mid', 'song_name', 'song_orig', 'album_min', 'album_big', 'album_mid', 'album_name'];
    let data = {};
    keys.forEach(key => {
      data[key] = song[key];
    });

    super.add(Object.assign({
      time: new Date().getTime()
    }, data)).save();
  }

  // 取消喜欢
  del(song) {
    this.where('song_mid', song.song_mid);
    super.del().save();
  }
}