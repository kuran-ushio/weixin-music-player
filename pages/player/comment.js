import PageModule from '../../lib/Page.js';
import { commentTips } from '../../common/const.js';
import utils from '../../utils/utils.js';

const db = wx.cloud.database(),
  collection = db.collection('song_comment');

// pages/player/comment.js
const $page = new PageModule({
  data: {
    comment: '',
    commentList: [],
    total: 0, // 评论总数
    page: 1, // 当前页码
    rows: 20, // 每页显示的记录数
    addCount: 0 // 评论立即刷新用的计数
  },
  onLoad(options) {
    this.setSongInfo(options);
    this.setInputTip();

    this.getCommentCount();
    this.getComments();

    // 获取用户信息
    utils.getUserInfo().then(res => {
      this.data.user = {
        avatarUrl: res.avatarUrl,
        gender: res.gender,
        nickName: res.nickName
      };
    });
  },
  // 设置当前歌曲信息
  setSongInfo(obj) {
    let song = {};
    Object.keys(obj).map(key => song[key] = decodeURIComponent(obj[key]));

    // song = {
    //   "song_url": "http://ws.stream.qqmusic.qq.com/C100004RDAU22ZbmOh.m4a?fromtag=0&guid=0",
    //   "song_mid": "004RDAU22ZbmOh",
    //   "song_name": "My Days",
    //   "song_orig": "鈴木このみ",
    //   "album_min": "https://y.gtimg.cn/music/photo_new/T002R90x90M000000AfsBH3tSkmC.jpg",
    //   "album_big": "https://y.gtimg.cn/music/photo_new/T002R300x300M000000AfsBH3tSkmC.jpg",
    //   "album_mid": "000AfsBH3tSkmC",
    //   "album_name": "My Days"
    // };

    this.setData({
      song
    });
  },
  // 设置评论输入框的提示文字
  setInputTip() {
    let randomIndex = ~~(Math.random() * commentTips.length);
    this.setData({
      commentTip: commentTips[randomIndex]
    });
  },
  // 获取评论总数
  getCommentCount() {
    collection.where({
      song_id: this.data.song.song_mid
    }).count()
      .then(res => {
        this.setData({
          total: res.total 
        });
      })
  },
  // 获取评论列表
  getComments() {
    collection.where({
      song_id: this.data.song.song_mid
    }).orderBy('time', 'desc')
      .skip(this.data.page * this.data.rows - this.data.rows + this.data.addCount)
      .limit(this.data.rows)
      .get()
      .then(this.setCommentList.bind(this))
      .catch(err => {
        console.log(err)
      })
  },
  // 设置评论列表
  setCommentList(res) {
    let commentList = this.data.commentList;

    res.data.forEach(item => {
      item.time = utils.formatTime(item.time);
    });

    commentList.push(...res.data);

    this.setData({
      commentList
    });
  },
  // 滚动加载更多
  loadMore() {
    this.data.page++;

    wx.showNavigationBarLoading();
    this.getComments();
    wx.hideNavigationBarLoading();
  },
  // 发表评论
  comment(e) {
    // 清空输入框内容
    this.setData({
      comment: ''
    });

    // 评论内容
    let content = e.detail.value.content;

    if (!content.trim()) {
      return wx.showToast({
        icon: 'none',
        title: '写点什么嘛~'
      });
    }

    // 调用云函数
    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        song_id: this.data.song.song_mid,
        content,
        user: this.data.user
      }
    }).then(res => {
      if (res.result) {
        // 伪装成立即刷新的评论
        let data = {
          song_id: this.data.song.song_mid,
          content,
          user: this.data.user,
          time: utils.formatTime(new Date().getTime())
        };

        this.data.commentList.unshift(data);
        this.setData({
          commentList: this.data.commentList
        });
        this.data.addCount++;

        wx.showToast({
          icon: 'success_no_circle',
          title: '评论成功~'
        });
      }
    }).catch(err => {
      console.log('失败', err);
    });
  }
});

$page.start();