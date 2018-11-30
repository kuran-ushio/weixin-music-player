import Storage from '../lib/Storage.js';

const dbName = 'search_history';

// 歌曲搜索历史记录的缓存
export default class SearchSong extends Storage{
  constructor() {
    super(dbName);
  }

  // 添加一条歌曲搜索的缓存
  add(data) {
    // 查询数据是否已存在
    let result = this.where('content', data).find();
    
    if(!result) {
      super.add({
        content: data,
        time: new Date().getTime()
      }).save();
    }
  }

  // 删除一条歌曲搜索的缓存
  del(data) {
    this.where('content', data);
    super.del().save();
  }

  // 清空所有歌曲搜索的缓存
  clear() {
    const db = super.all();
    db.forEach(item => {
      this.del(item.content);
    });
  }

  // 读取歌曲搜索记录的缓存
  all() {
    this.order('time', 'desc');    
    const db = super.all(), // 获取所有缓存数据
          data = db.splice(0,10);
    
    // 删除多余的缓存数据
    db.forEach(item => {
      this.del(item.content);
    });

    return data;
  }
}